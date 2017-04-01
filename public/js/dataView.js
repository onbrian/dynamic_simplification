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
		Bounds should be an array of two points [p1, p2]. p1 should be the point
		of the lower left corner of the bounding rectangle; p2 the upper right.
	*/
	function DataView(lines, boundsVP, boundsAxis, lineFloor)
	{
		// number of total points contained in this data view
		this.numPoints = 0;
		// lines contained in this data view
		this.lines = [];
		// cache of lines sorted by priority
		//this.linesPrioritized = [];
		// bounds  of this data view
		this.boundsVP = boundsVP;
		// axis bounds for this data view
		this.boundsAxis = boundsAxis;
		// point percentiles for lines in this data view
		this.linePP = [];
		// minimum number of points per line
		this.lineFloor = lineFloor;
		// last simplified lines cached
		this.cachedSimpLines = null;

		// copy original lines, clipping to specified bounds if any
		for (var i = 0; i < lines.length; i++)
		{
			// clone lines whether or not clipping -- safer to keep own copy
			if (nullBounds(boundsVP)) this.lines.push(lines[i].slice());
			else this.lines.push(hardClipToBounds(boundsVP, lines[i]));
		}

		// cache [clipped] lines sorted by priority
		/*
		for (i = 0; i < this.lines.length; i++)
		{
			this.linesPrioritized.push(this.lines[i].slice());
			this.linesPrioritized[i].sort(function(a, b){return a[2] - b[2]; });
		}*/

		// set num points
		for (i = 0; i < this.lines.length; i++)
			this.numPoints += this.lines[i].length;

		// set line point percentiles
		for (i = 0; i < this.lines.length; i++)
			this.linePP.push(this.lines[i].length/this.numPoints);
	}

	/*
		private static helper function to check
		if <bounds> are null
	*/
	function nullBounds(bounds)
	{
		if (bounds[0][0] === null || bounds[0][1] === null) return true;
		return bounds[1][0] === null || bounds[1][1] === null;
	}

	/*	
		private static helper function for constructor
		is point <p> contained in <bounds> for x axis?
	*/
	function pointInBoundsX(bounds, p)
	{
	    if (bounds === null) return true;
	    return !(p[0] < bounds[0][0] || p[0] > bounds[1][0]);
	}

	/*	
		private static helper function for constructor
		is point <p> contained in <bounds> for y axis?
	*/
	function pointInBoundsY(bounds, p)
	{
		if (nullBounds(bounds)) return true;
		return !(p[1] < bounds[0][1] || p[1] > bounds[1][1]);
	}

	/*	
		private helper function for constructor
		is point <p> contained in <bounds>?
	*/
	function pointInBounds(bounds, p)
	{
		// all points are in
		if (nullBounds(bounds)) return true;
		return pointInBoundsX(bounds, p) && pointInBoundsY(bounds, p);
	}

	/*	
		private static helper function for constructor
		iterate through line <line> position-wise and find
		first and last index of segment in <bounds> (if any)
	*/
	function hardClipToBounds(bounds, line)
	{
		if (nullBounds(bounds)) return line;
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
		private static helper function for constructor
		if a line has even one point in bounds, include whole line
		from first time it's x-coordinate goes in bounds
	*/
	function softClipToBounds(bounds, line)
	{
		if (nullBounds(bounds)) return line;
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

	function swapElements(list, i, j)
	{
		var temp = list[i];
		list[i] = list[j], list[j] = temp;
		return;
	}

	/*
		private static helper function for quick select algorithm
		partitions the elements in <list> between <leftIndex> and <rightIndex>
		inclusive such that...
			- all items at indices less than <pivotIndex> are less than the item
			at <pivotIndex>
			- all items at indices greater than <pivotIndex> are greater than
			the item at <pivotIndex>
	*/
	function partition(list, leftIndex, rightIndex, pivotIndex, comparator)
	{
		var pivotVal = list[pivotIndex];
		swapElements(list, pivotIndex, rightIndex);
		for (var i = leftIndex, storeIndex = leftIndex; i < rightIndex; i++)
		{
			// comparator(a, b) returns negative value if a < b
			if (comparator(list[i], pivotVal) < 0)
			{
				swapElements(list, i, storeIndex);
				storeIndex++;
			}
		}
		// move pivot back
		swapElements(list, storeIndex, rightIndex);
		return storeIndex;
	}

	/*
		private static function
		helper recursive function for <quickSelect>
	*/
	function quickSelectHelper(list, leftIndex, rightIndex, k, comparator)
	{
		if (leftIndex >= rightIndex) return list[k];

		// randomly generate pivot index between <leftIndex> and
		// <rightIndex> inclusive
		var pivotIndex = Math.floor(Math.random() *
			(rightIndex - leftIndex + 1)) + leftIndex;

		// after partitioning, get the actual pivot index of selected element
		pivotIndex = partition(list, leftIndex, rightIndex, pivotIndex,
			comparator);

		// found k; return it
		if (pivotIndex == k) return list[k];
		// k less than pivot; recurse left
		else if (k < pivotIndex)
			return quickSelectHelper(list, leftIndex, pivotIndex - 1, k, comparator);
		// k greater than pivot; recurse right
		else
			return quickSelectHelper(list, pivotIndex + 1, rightIndex, k, comparator);
	}

	/*
		private static function to select the <k>th largest element from <list>
	*/
	function quickSelect(list, k, comparator)
	{
		// console.log(k);
		// console.log(list);
		return quickSelectHelper(list.slice(), 0, list.length - 1, k - 1,
			comparator);
	}


	/*	
		return a set of simplified lines in this data view
		such that the number of aggregate points is less than/equal to <cap>
		pretty inefficient, so optimize later
	*/
	DataView.prototype.simplifyView = function(viewPtCap)
	{
		console.time("View Simplification");
		// already have fewer points
		if (this.numPoints <= viewPtCap)
			return this.lines;

		var simplifiedLines = [];

		// use line percentages to calculate total point cap per line
		var lineCaps = [];
		for (var i = 0; i < this.linePP.length; i++)
			lineCaps.push(parseInt(this.linePP[i] * viewPtCap, 10));

		// simplify each line using corresponding line cap
		for (var i = 0, lineCap = 0, line = null; i < this.lines.length; i++)
		{
			line = this.lines[i];
			// cap for this line is maximum(computed cap, line floor)
			lineCap = lineCaps[i] < this.lineFloor ? this.lineFloor : lineCaps[i];

			var simpLine = [];
			if (lineCap > line.length)
			{
				simpLine = line;
			}
			else
			{
				/*
				// slice top <lineCap> points, sort by line position
				simpLine = this.linesPrioritized[i].slice(0, lineCap);
				simpLine.sort(function(a, b){ return a[4] - b[4]; });
				*/
				var kthVal = quickSelect(line, lineCap,
					function(a, b){ return b[2] - a[2]; });
				// console.log(kthVal);
				for (var j = 0, point = null; j < line.length; j++)
				{
					point = line[j];
					if (point[2] >= kthVal[2]) simpLine.push(point);
				}
			}
			simplifiedLines.push(simpLine);
		}
		console.timeEnd("View Simplification");

		// cache this for zooming out
		this.cachedSimpLines = simplifiedLines;
		return simplifiedLines;
	};

	// "zoom" in on a rectangle defined by bounds object(x1, x2, y1, y2)
	DataView.prototype.subView = function(boundsVP, boundsAxis, lineFloor)
	{
		return new DataView(this.lines, boundsVP, boundsAxis, lineFloor);
	};

	// return a shallow clone of this data view
	// this means the returned Data View's references the same
	// array of lines, array of prioritized lines, bounds,
	// array of point percentiles, cached lines (if not null), etc.
	DataView.prototype.shallowClone = function()
	{
		var clone = new DataView([], [[null, null], [null, null]],
			[[null, null], [null, null]], 0);
		var context = this;
		Object.getOwnPropertyNames(context).forEach(function(val)
		{
			clone[val] = context[val];
		});
		return clone;
	};

	return DataView;
})();