// dependencies: geometry.js, minHeap.js

var Simplify = (function()
{
	// a point should have at least 2 coordinates
	function setCoordinateZ(p, val)
	{
		if (p.length === 2) p.push(val);
		else p[2] = val;
	}

	/**************************************************************************/
	/********************* VISVALINGHAM-WHYATT ALGORITHM **********************/
	/**************************************************************************/

	// "nested" Triangle classfor use in VW algorithm
	function Triangle(i, pLeft, p, pRight)
	{
		// index of triangle in line
		this.i = i;
		this.pLeft = pLeft;
		this.p = p;
		this.pRight = pRight;
		this.area = Geometry.triangleArea(pLeft, p, pRight);
		// left neighbor
		this.nLeft = null;
		// right neighbor
		this.nRight = null;
	}

	// update triangle's position in min heap
	// useful if triangle's points have changed
	function updateTri(minheap, tri)
	{
		minheap.remove(tri);
		tri.area = Geometry.triangleArea(tri.pLeft, tri.p, tri.pRight);
		minheap.push(tri);
	}

	// when removing a point associated w min triangle area
	// update areas and positions of neighboring triangles in min heap
	function updateNeighbors(minheap, tri)
	{
		// update left neighbor if necessary
		var leftNeighbor = tri.nLeft;
		if (leftNeighbor !== null)
		{
			// left neighbor's right point is now <tri>'s right point
			leftNeighbor.pRight = tri.pRight;
			// remove neighbor, recompute area, push
			updateTri(minheap, leftNeighbor);
		}

		// update right neighbor if necessary
		var rightNeighbor = tri.nRight;
		if (rightNeighbor !== null)
		{
			// right neighbor's left point is now <tri>'s left point
			rightNeighbor.pLeft = tri.pLeft;
			// remove neighbor, recompute area, push
			updateTri(minheap, rightNeighbor);
		}

		// update neighbor links

		// both neighbors exist
		if (leftNeighbor !== null && rightNeighbor !== null)
		{
			leftNeighbor.nRight = rightNeighbor;
			rightNeighbor.nLeft = leftNeighbor;
		}
		// only left neighbor exists
		else if (leftNeighbor !== null) leftNeighbor.nRight = null;
		// only right neighbor exists
		else if (rightNeighbor !== null) rightNeighbor.nLeft = null;

		return;
	}

	// use Visvalingam-Whyatt algorithm to rank points in line
	// for dynamic simplification
	function VisvalWhyattRank(line)
	{
		// points sorted by area
		var rankedPoints = [];

		// end points are most important & should not be deleted
		setCoordinateZ(line[0], Infinity);
		setCoordinateZ(line[line.length - 1], Infinity);
		rankedPoints.push(line[0]);
		rankedPoints.push(line[line.length - 1]);

		// min priority queue to store points/triangles in order of area
		var minHeap = new MinHeap(function(a, b)
		{
			return a.area - b.area;
		});

		// initialize triangles for points in line
		for (var i = 1, prevTri = null, currTri = null; i < line.length - 1; i++)
		{
			currTri = new Triangle(i, line[i - 1], line[i], line[i + 1]);
			// set neighbors if not first triangle
			if (prevTri !== null)
			{
				currTri.nLeft = prevTri;
				prevTri.nRight = currTri;
			}

			// add new triangle to min heap
			minHeap.push(currTri);
			// update prev triangle
			prevTri = currTri;
		}

		//console.log(minHeap);

		// all triangles are now in priority queue... now pop them off by area
		var tri = null;
		var effectiveArea = null;
		while (minHeap.getLength() > 0)
		{
			//console.log(minHeap.array.slice());
		    tri = minHeap.pop();
			// effective area is maximum(previous triangle's area + 1, current triangle area)
			effectiveArea = (effectiveArea !== null) &&
				(effectiveArea >= tri.area) ? (effectiveArea + 1) : tri.area;

			// store area with point as 3rd coordinate
			setCoordinateZ(line[tri.i], effectiveArea);

			rankedPoints.push(line[tri.i]);
			updateNeighbors(minHeap, tri);
		}
		return rankedPoints;
	}

	/**************************************************************************/
	/*************** MODIFIED RAMER DOUGLAS PEUCKER ALGORITHM *****************/
	/**************************************************************************/

	// constructor for point wrapper (for priority queue)
	// <pIndex>: index of point this point wrapper represents
	// <aIndex>: index of first index of line segment this point splits
	// <bIndex>: index of second index of line segment this point splits
	// <sqDist>: the sq dist of point <pIndex> from segment (<aIndex>, <bIndex>)
	function PointWrapper(pIndex, aIndex, bIndex, sqDist)
	{
		this.i = pIndex;
		this.a = aIndex;
		this.b = bIndex;
		this.sqDist = sqDist;
	}

	// given a line <line>, and two indices <aIndex> and <bIndex> into the line
	// that represent endpoints of a simplified line segment, find the point in
	// between those indices on the original line with the furthest
	// perpendicular distance from the segment.
	// return the point with most significant distance as a point wrapper
	function getBestPoint(aIndex, bIndex, line)
	{
		// no points in between
		if (aIndex >= (bIndex - 1)) return null;
		
		// loop through all candidate points
		// find point with further sq dist
		var bestIndex = -1, bestSqDist = -Infinity;
		for (var i = aIndex + 1, sqDist = 0; i < bIndex; i++)
		{
			sqDist = Geometry.getSqSegDist(line[i], line[aIndex], line[bIndex]);
			//console.log(sqDist);
			if (sqDist > bestSqDist)
			{
				bestIndex = i;
				bestSqDist = sqDist;
			}
		}

		return new PointWrapper(bestIndex, aIndex, bIndex, bestSqDist);
	}

	// Rank the points using a modified version of the Ramer-Douglas-Peucker
	// algorithm, and return the ranked list
	// this algorithm also sets the z-coordinate of each point to its rank
	function RamerDouglasRank(line)
	{
		var rankedPoints = [];
		var pq = new MinHeap(function(a, b){
			// since this a min heap, negative diff to make it normal pq
			return b.sqDist - a.sqDist;
		});

		// end points are most important & should not be deleted
		setCoordinateZ(line[0], Infinity);
		setCoordinateZ(line[line.length - 1], Infinity);
		rankedPoints.push(line[0]);
		rankedPoints.push(line[line.length - 1]);

		// corner case: only 2 points
		if (line.length <= 2) return rankedPoints;

		// first significant point to priority queue
		pq.push(getBestPoint(0, line.length - 1, line));

		var pW = p = bestLeft = bestRight = null;
		
		while (pq.getLength() > 0)
		{
			pW = pq.pop(), p = line[pW.i];
			setCoordinateZ(p, rankedPoints.length);
			//console.log(pW);
			rankedPoints.push(p);

			// add points to priority queue if they exist
			if ((bestLeft = getBestPoint(pW.a, pW.i, line)) !== null)
				pq.push(bestLeft);
			if ((bestRight = getBestPoint(pW.i, pW.b, line)) !== null)
				pq.push(bestRight);
		}
		return rankedPoints;
	}

	return {
		VisvalWhyattRank: VisvalWhyattRank,
		RamerDouglasRank: RamerDouglasRank
	};
})();