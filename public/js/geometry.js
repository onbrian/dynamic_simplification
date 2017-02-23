// dependencies: None

// revealing module pattern to mimic class
// an object containing useful geometry functions
var Geometry = (function()
{
	var X_AXIS = 0;
	var Y_AXIS = 1;
	
	// get the intersection between vertical line x=<x>
	// and the line defined by points <a> & <b> 
	var intersectX = function(a, b, x) 
	{
		// compute slope
		// m = (b[1] - a[1])/(b[0] - a[0])
		// compute b using point a
		// b = y - mx 
		//   = a[1] - m*a[0]
		// compute y
		// y = mx + a[1] - m*a[0]
		//   = mx - m*a[0] + a[1]
		//	 = m(x - a[0]) + a[1]
    	return [x, (x - a[X_AXIS]) * (b[Y_AXIS] - a[Y_AXIS]) / (b[X_AXIS] - a[X_AXIS]) + a[Y_AXIS]];
	}

	// get the intersection between horizontal line y=<y>
	// and the line defined by points <a> & <b> 
	var intersectY = function(a, b, y)
	{
    	return [(y - a[Y_AXIS]) * (b[X_AXIS] - a[X_AXIS]) / (b[Y_AXIS] - a[Y_AXIS]) + a[X_AXIS], y];
	}

	var getMinCoordVal = function(axis, lines)
	{
		var min = Infinity;
		// iterate through each line explicitly and get min value
		for (var i = 0, line = null; i < lines.length; i++)
		{
			line = lines[i]; // current line
			for (var j = 0; j < line.length; j++)
			{
				if (line[j][axis] < min)
					min = line[j][axis];
			}
		}
		return min;
	}

	var getMaxCoordVal = function(axis, lines)
	{
		console.log(lines);
		var max = -Infinity;
		// iterate through each line explicitly and get max value
		for (var i = 0, line = null; i < lines.length; i++)
		{
			line = lines[i]; // current line
			for (var j = 0; j < line.length; j++)
			{
				if (line[j][axis] > max)
					max = line[j][axis];
			}
		}
		return max;
	}

	var triangleArea = function(a, b, c)
	{
		return Math.abs((a[0] - c[0]) 
			* (b[1] - a[1]) - (a[0] - b[0]) 
			* (c[1] - a[1]));
	}

	// square distance from a point p to segment a-b
	// borrowed from https://github.com/mapbox/geojson-vt
	var getSqSegDist = function(p, a, b) 
	{

	    var x = a[0], y = a[1],
	        bx = b[0], by = b[1],
	        px = p[0], py = p[1],
	        dx = bx - x, // horizontal dist between a and b
	        dy = by - y; // vertical dist between a and b

	    if (dx !== 0 || dy !== 0) 
	    {
	        var t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);

	        if (t > 1) {
	            x = bx;
	            y = by;

	        } 
	        else if (t > 0) 
	        {
	            x += dx * t;
	            y += dy * t;
	        }
	    }

	    dx = px - x;
	    dy = py - y;

	    return dx * dx + dy * dy;
	}

	return {
		intersectX: intersectX,
		intersectY: intersectY,
		getMinCoordVal: getMinCoordVal,
		getMaxCoordVal: getMaxCoordVal,
		X_AXIS: X_AXIS,
		Y_AXIS: Y_AXIS,
		triangleArea: triangleArea,
		getSqSegDist: getSqSegDist
	}
})();