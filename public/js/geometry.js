// dependencies: None

// revealing module pattern to mimic class
// an object containing useful geometry functions
var Geometry = (function()
{	
	/*	
		Get the intersection between vertical line x=<x>
		and the line defined by points <a> & <b>
	*/
	function intersectX(a, b, x)
	{
		/*	
			compute slope
			m = (b[1] - a[1])/(b[0] - a[0])
			compute b using point a
			b = y - mx
			  = a[1] - m*a[0]
			compute y
			y = mx + a[1] - m*a[0]
			  = mx - m*a[0] + a[1]
			  = m(x - a[0]) + a[1]
		*/
    	return [x, (x - a[X_AXIS]) * (b[Y_AXIS] - a[Y_AXIS])/
    		(b[X_AXIS] - a[X_AXIS]) + a[Y_AXIS]];
	}

	/*	
		Get the intersection between horizontal line y=<y>
		and the line defined by points <a> & <b>
	*/
	function intersectY(a, b, y)
	{
    	return [(y - a[Y_AXIS]) * (b[X_AXIS] - a[X_AXIS])/
    		(b[Y_AXIS] - a[Y_AXIS]) + a[X_AXIS], y];
	}

	/*
		Given an axis <axis> and an array of lines <lines>,
		find the the minimum coordinate value for axis <axis> out of all lines
	*/
	function getMinCoordVal(axis, lines)
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

	/*
		Given an axis <axis> and an array of lines <lines>,
		find the the maximum coordinate value for axis <axis> out of all lines
	*/
	function getMaxCoordVal(axis, lines)
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

	/*
		Compute the area of the triangle defined by points <a>, <b>, <c>
	*/
	function triangleArea(a, b, c)
	{
		return Math.abs((a[0] - c[0]) *
			(b[1] - a[1]) - (a[0] - b[0])*
			(c[1] - a[1]));
	}

	/*	
		Compute & return the square distance from a point <p>
		to segment <a>,<b>
		borrowed from https://github.com/mapbox/geojson-vt
	*/
	function getSqSegDist(p, a, b)
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
		X_AXIS: 0,
		Y_AXIS: 1,
		intersectX: intersectX,
		intersectY: intersectY,
		getMinCoordVal: getMinCoordVal,
		getMaxCoordVal: getMaxCoordVal,
		triangleArea: triangleArea,
		getSqSegDist: getSqSegDist
	};
})();