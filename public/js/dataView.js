/*
	Data View Class Implementation
	----------------------------------------------------------------------------

	----------------------------------------------------------------------------
	Notes
	----------------------------------------------------------------------------
	A DataView instance represents a set of data to be rendered on a graph. This
	can be the entire set of data to be displayed, or a subset of
	some data. Because the former case is trivial, this class was created mostly
	for the latter use-case. In particular, when the user zooms in a particular
	2D box on a graph, this DataView class makes it easy to dynamically grab all
	the points within that box to display only those points when re-rendering
	the chart.

	This DataView instance also makes it simple to simplify its current data
	before rendering, to handle cases where there are too many datapoints.
	
	----------------------------------------------------------------------------
	Dependencies
	----------------------------------------------------------------------------
	None
*/

var DataView = (function()
{
	/*	
		DataView instance constructor
		Lines should have a priority value stored as z-coordinate for each point
		Bounds should be an object with attr (x1, x2, y1, y2)
	*/
	function DataView(lines, bounds=null)
	{
		// number of total points contained in this data view
		this.numPoints = 0;
		// lines contained in this data view
		this.lines = [];
		// cache of lines sorted by priority
		this.linesPrioritized = [];
		// bounds  of this data view
		this.bounds = bounds;
		// point percentiles for lines in this data view
		this.linePP = [];
		// minimum number of points per line
		this.lineFloor = 50;
		// last simplified lines cached
		this.cachedSimpLines = null;

		// copy original lines, clipping to specified bounds if any
		for (var i = 0; i < lines.length; i++)
		{
			if (bounds === null) this.lines.push(lines[i].slice());
			else this.lines.push(hardClipToBounds(bounds, lines[i]));
		}

		// cache [clipped] lines sorted by priority
		for (i = 0; i < this.lines.length; i++)
		{
			this.linesPrioritized.push(this.lines[i].slice());
			this.linesPrioritized[i].sort(function(a, b){return a[2] - b[2]; });
		}

		// set num points
		for (i = 0; i < this.lines.length; i++)
			this.numPoints += this.lines[i].length;

		// set line point percentiles
		for (i = 0; i < this.lines.length; i++)
			this.linePP.push(this.lines[i].length/this.numPoints);
	}

	/*	
		private static helper function for constructor
		is point <p> contained in <bounds> for x axis?
	*/
	function pointInBoundsX(bounds, p)
	{
		if (bounds === null) return true;
		return !(p[0] < bounds.x1 || p[0] > bounds.x2);
	}

	/*	
		private static helper function for constructor
		is point <p> contained in <bounds> for y axis?
	*/
	function pointInBoundsY(bounds, p)
	{
		if (bounds === null) return true;
		return !(p[1] < bounds.y1 || p[1] > bounds.y2);
	}

	/*	
		private helper function for constructor
		is point <p> contained in <bounds>?
	*/
	function pointInBounds(bounds, p)
	{
		// all points are in
		if (bounds === null) return true;
		return pointInBoundsX(bounds, p) && pointInBoundsY(bounds, p);
	}

	/*	
		private helper function for constructor
		iterate through line <line> position-wise and find
		first and last index of segment in <bounds> (if any)
	*/
	function hardClipToBounds(bounds, line)
	{
		if (bounds === null) return line;
		if (line.length <= 2) return line;

		// get beginning and ending point (position-wise)
		// inside bound (go out by one on either side)
		var startIndex = stopIndex = -1;

		// get index of first point in-bounds starting from beginning of line
		for (var i = 0; i < line.length; i++)
		{
			// index of first point in bounds
			if (pointInBounds(bounds, line[i]))
			{
				startIndex = i;
				break;
			}
		}

		// no points in bounds
		if (startIndex < 0) return [];

		// get index of last point in-bounds starting from beginning of line
		for (i = line.length - 1; i >= 0; i--)
		{
			if (pointInBounds(bounds, line[i]))
			{
				stopIndex = i;
				break;
			}
		}
		// if made it this far, stopIndex should have non-negative value
		// lowest value possible is <startIndex>
		// might want to assert for more robust code later

		// if possible, step back by one index on either side
		startIndex = startIndex > 0 ? startIndex - 1 : startIndex;
		stopIndex = stopIndex < line.length - 1? stopIndex + 1 : stopIndex;

		return line.slice(startIndex, stopIndex + 1);
	}

	/*	
		private helper function for constructor
		if a line has even one point in bounds, include whole line
		from first time it's x-coordinate goes in bounds
	*/
	function softClipToBounds(bounds, line)
	{
		if (bounds === null) return line;
		if (line.length <= 2) return line;

		// get beginning and ending point (position-wise)
		// inside bound (go out by one on either side)
		var lineInBounds = false;

		// return empty array if no point in line is contained in <bounds>
		for (var i = 0; i < line.length; i++)
		{
			// index of first point in bounds
			if (pointInBounds(bounds, line[i]))
			{
				lineInBounds = true;
				break;
			}
		}
		
		if (!lineInBounds) return [];

		var startIndex = stopIndex = -1;
		
		for (i = 0; i < line.length; i++)
		{
			if (pointInBoundsX(bounds, line[i]))
			{
				startIndex = i;
				break;
			}
		}

		// get index of last point in-bounds starting from beginning of line
		for (i = line.length - 1; i >= 0; i--)
		{
			if (pointInBoundsX(bounds, line[i]))
			{
				stopIndex = i;
				break;
			}
		}
		// if made it this far, start and stopIndex should have
		// non-negative values; might want to assert for more robust code later

		// if possible, step back by one index on either side
		startIndex = startIndex > 0 ? startIndex - 1 : startIndex;
		stopIndex = stopIndex < line.length - 1? stopIndex + 1 : stopIndex;

		return line.slice(startIndex, stopIndex + 1);
	}

	// "zoom" in on a rectangle defined by bounds object(x1, x2, y1, y2)
	DataView.prototype.subView = function(bounds)
	{
		return new DataView(this.lines, bounds);
	};

	/*	
		return a set of simplified lines in this data view
		such that the number of aggregate points is less than/equal to <cap>
		pretty inefficient, so optimize later
	*/
	DataView.prototype.simplifyView = function(viewCap)
	{
		// already have fewer points
		if (this.numPoints <= viewCap)
			return this.lines;

		var simplifiedLines = [];

		// use line percentages to calculate total point cap per line
		var lineCaps = [];
		for (var i = 0; i < this.linePP.length; i++)
			lineCaps.push(parseInt(this.linePP[i] * viewCap, 10));

		// simplify each line using corresponding line cap
		for (i = 0, lineCap = 0, simpLine = null;
			 i < this.linesPrioritized.length; i++)
		{
			// cap for this line is maximum(computed cap, line floor)
			lineCap = lineCaps[i] < this.lineFloor ? this.lineFloor : lineCaps[i];
			// slice top <lineCap> points, sort by line position
			simpLine = this.linesPrioritized[i].slice(0, lineCap);
			simpLine.sort(function(a, b){ return a[4] - b[4]; });
			simplifiedLines.push(simpLine);
		}
		
		// cache this for zooming out
		this.cachedSimpLines = simplifiedLines;
		return simplifiedLines;
	};

	return DataView;
})();