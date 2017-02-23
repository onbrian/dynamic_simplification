// dependencies: nothing so far

// optimize with binary search, quick check later
// "soft" clips <line> between 2 y-axis parallel lines <x1>, <x2>
// where <x1> < <x2>
// soft clip means new intersections points aren't generated
// points on line are included simply if they are between the lines
// <includeOutliers> specifies whether to include 2 points just outside 
// border
// assumes x-coordinates in <line> are non-decreasing
function softClipX(line, x1, x2, includeOutliers = true)
{
	// no solution: |        | --------
	if (line[0] > x2) return [];
	// no solution ------- |        |
	if (line[line.length - 1] < x1) return [];

	// some points are in bounds

	var startIndex = -1,
		stopIndex = -1;

	for (var i = 0, p = null; i < line.length; i++)
	{
		currX = line[i][0];
		
		// index of first point in bounds (if one exists)
		if (currX > x1 && startIndex < 0)
			startIndex = i;

		// index of first point out of bounds (on <x2> side)
		if (currX > x2)
		{
			stopIndex = i;
			break;
		}
	}

	startIndex = includeOutliers && (startIndex > 0) 
				 ? startIndex - 1 : startIndex;
	
	// edge case: some points are in bounds
	// but no points are past <x2> (on right side)
	if (stopIndex < 0)
		return line.slice(startIndex);
	return line.slice(startIndex, stopIndex + 1);
}

DataView.prototype.pointInBounds = function(p)
{
	// all points are in
	if (this.bounds === null) return true;
	// x bounds
	if (p[0] < this.bounds.x1 || p[0] > this.bounds.x2) return false;
	// y bounds
	return (p[1] >= this.bounds.y1 && p[1] <= this.bounds.y2);
}

// iterate through this line position-wise
DataView.prototype.clipLineToBounds = function(line)
{
	if (this.bounds === null) return line;
	if (line.length <= 2) return line;

	// get beginning and ending point (position-wise)
	// inside bound (go out by one on either side)
	var startIndex = stopIndex = -1;

	// get index of first point in-bounds starting from beginning of line
	for (var i = 0; i < line.length; i++)
	{
		// index of first point in bounds
		if (this.pointInBounds(line[i]))
		{
			startIndex = i;
			break;
		}
	}

	// no points in bounds
	if (startIndex < 0) return [];

	// get index of last point in-bounds starting from beginning of line
	for (var i = line.length - 1; i >= 0; i--)
	{
		if (this.pointInBounds(line[i]))
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
DataView.prototype.fitToBounds = function()
{
	// all done
	if (this.bounds === null) return;
	return;
}*/

// "zoom" in on a rectangle defined by bounds object(x1, x2, y1, y2)
DataView.prototype.subView = function(bounds)
{
	return new DataView(this.lines, bounds);
}

// given a line <line>, simplify
DataView.prototype.simplifyLine = function(line, cap)
{
	cap = cap < this.lineFloor ? this.lineFloor : cap;
	var simplified = line.slice(0, cap);
	simplified.sort(function(a, b){ return a[4] - b[4]});
	return simplified;
}

// return a set of simplified lines in this data view
// such that the number of aggregate points is less than/equal to <cap>
// pretty inefficient, so optimize later
DataView.prototype.simplifyView = function(viewCap)
{
	// already have fewer points
	if (this.numPoints <= viewCap)
		return this.lines;

	var simplifiedLines = [];

	// use line percentages to calculate total point cap per line
	var lineCaps = [];
	for (var i = 0; i < this.numPoints; i++)
		lineCaps.push(parseInt(this.linePP[i] * viewCap, 10));

	// simplify each line using corresponding line cap
	for (var i = 0, lineCap = 0, simpLine = null; 
		 i < this.linesPrioritized.length; i++)
	{
		lineCap = lineCaps[i] < this.lineFloor ? this.lineFloor : lineCaps[i];
		simpLine = this.linesPrioritized[i].slice(0, lineCap);
		simpLine.sort(function(a, b){ return a[4] - b[4]});
		simplifiedLines.push(simpLine);
	}
	return simplifiedLines;
}

// lines are already ranked
// bounds should be an object with attr (x1, x2, y1, y2)
function DataView(lines, bounds = null)
{
	// number of total points contained in this data view
	this.numPoints = 0,
	// lines contained in this data view
	this.lines = [],
	this.linesPrioritized = [],
	// bounds  of this data view
	this.bounds = bounds,
	// point percentiles for lines in this data view 
	this.linePP = [],
	this.lineFloor = 50; // minimum number of points per line

	// copy original lines
	for (var i = 0; i < lines.length; i++)
	{
		if (bounds === null)
			this.lines.push(lines[i].slice())
		else
		{
			// this.lines.push(softClipX(lines[i], bounds.x1, bounds.x2));
			this.lines.push(this.clipLineToBounds(lines[i]));
		}
	}

	// sort lines by priority
	for (var i = 0; i < this.lines.length; i++)
	{
		this.linesPrioritized.push(this.lines[i].slice());
		this.linesPrioritized[i].sort(function(a, b){return a[2] - b[2]});
	}

	// set num points
	for (var i = 0; i < this.lines.length; i++)
		this.numPoints += this.lines[i].length;

	// set line point percentiles
	for (var i = 0; i < this.lines.length; i++)
		this.linePP.push(this.lines[i].length/this.numPoints);
}