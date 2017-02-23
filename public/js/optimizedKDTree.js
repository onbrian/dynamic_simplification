// dependencies: queue.js

// a data structure for optimized 2D indexing (bounding-box search)
// should only be used for 2 dimensions
// useful for zooming
KDNode.prototype.sortPoints = function()
{
	var axis = this.axis; // scoping
	this.points.sort(function(a, b){ return a[axis] - b[axis]});
}

function KDNode(axis, xSortedIndices, ySortedIndices)
{
	this.points = null;
	this.sortedIndices = [xSortedIndices, ySortedIndices];
	this.axis = axis;
	this.isLeaf = false;
	this.cut = null;
	this.leftChild = null;
	this.rightChild = null;
}

KDTree.prototype.inBounds1D = function(k, k1, k2)
{
	if (!((k >= k1) && (k <= k2))) 
		return false;
	return true;
}

KDTree.prototype.inBounds2D = function(p, x1, x2, y1, y2)
{
	// in bounds x-value
	if (!this.inBounds1D(p[0], x1, x2) || 
		!this.inBounds1D(p[1], y1, y2))
		return false;
	return true;
}

/*function printIndices(list)
{
	var indices = [];
	for (var i = 0; i < list.length; i++)
		indices.push(list[i][4])
	console.log(indices.toString());
}

function printAllItems(list)
{
	//list.sort(function(a, b){return a[4]- b[4]});
	for (var i = 0; i < list.length; i++)
		console.log(list[i]);
}*/

// 2d range searching
KDTree.prototype.search = function(x1, x2, y1, y2)
{
	var subset = [], // all pointsi in range
		bounds = [[x1, x2], [y1, y2]];
		frontier = new Queue(),
		node = null,       // current node
		axis = -1,         // current axis
		axisBounds = null, // current bounds
		cut = null;        // current cut

	frontier.queue(this.root);

	// iterative searching
	while (!frontier.isEmpty())
	{
		node = frontier.dequeue();
		// leaf -- add all points in range to solution
		if (node.isLeaf)
		{
			for (var i = 0, p = null; i < node.points.length; i++)
			{
				p = node.points[i];
				if (this.inBounds2D(p, x1, x2, y1, y2)) subset.push(p);
			}
			continue;
		}

		axis = node.axis,
		axisBounds = bounds[axis],
		cut = node.cut;
		// go "left"
		if (cut[axis] > axisBounds[1])
		{
			if (node.leftChild !== null) frontier.queue(node.leftChild);
		}
		// go "right"
		else if (cut[axis] < axisBounds[0])
		{
			if (node.rightChild !== null) frontier.queue(node.rightChild);
		}
		// explore both
		else
		{
			// check if cut is part of solution
			if (this.inBounds2D(cut, x1, x2, y1, y2)) subset.push(cut);
			if (node.leftChild !== null) frontier.queue(node.leftChild);
			if (node.rightChild !== null) frontier.queue(node.rightChild);
		}
	}
	return subset;
}

KDTree.prototype.sanityCheck = function(node)
{
	if (node === null) return 0;
	if (node.isLeaf) return node.points.length;
	return this.sanityCheck(node.leftChild) 
		   + this.sanityCheck(node.rightChild) 
		   // count point at this node
		   + 1;
}

function sortWithIndex(array, comparator)
{
	var sortedIndices = [];
	for (var i = 0; i < array.length; i++)
	{
		sortedIndices.push([i, array[i]]);
	}
	sortedIndices.sort(function(a, b){
		return comparator(a[1], b[1]);
	});
	for (var i = 0; i < array.length; i++)
		sortedIndices[i] = sortedIndices[i][0];
	return sortedIndices;
}

function sortPointsByIndex(array, axis)
{
	return sortWithIndex(array, function(a, b)
		{
			return a[axis] - b[axis];
		});
}

// optimized by eliminating sort at each axis
function KDTree(points)
{
	this.leafSize = 256;

	var median = -1,
		node = null,
		axis = 0,
		numPoints = 0,
		newSortedIndices = null;

	var indexSortedX = sortPointsByIndex(points, 0);
	var indexSortedY = sortPointsByIndex(points, 1);
	var includeWorkspace = [];
	for (var i = 0; i < points.length; i++)
		includeWorkspace.push(false);
	

	// iterative implementation in lieu of recursive for extra efficiency
	var queue = new Queue();
	queue.queue(this.root = new KDNode(axis, indexSortedX, indexSortedY));

	while (!queue.isEmpty())
	{
		//console.log("building...")
		node = queue.dequeue();
		// edge cases
		if ((numPoints = node.sortedIndices[0].length) <= this.leafSize) 
		{
			// convert to points
			node.points = [];
			for (var i = 0; i < numPoints; i++)
				node.points.push(points[node.sortedIndices[0][i]]);
			node.isLeaf = true;
			node.sortedIndices = null;
			continue;
		}

		// generate children

		medianIndex = Math.floor((numPoints - 1) / 2);
		node.cut = points[node.sortedIndices[node.axis][medianIndex]];

		// generate children

		axis = node.axis === 0 ? 1 : 0;
		newSortedIndices = [[], []];

		// set workspace
		for (var i = 0; i < numPoints; i++)
		{
			// true  --> include for left
			// false --> include for right
			includeWorkspace[node.sortedIndices[node.axis][i]] = i < medianIndex;
		}

		includeWorkspace[node.sortedIndices[node.axis][medianIndex]] = null;

		// at least one point in "left" side
		if (medianIndex >= 1)
		{
			for (var i = 0, index = -1; i < medianIndex; i++)
			{
				index = node.sortedIndices[node.axis][i];
				// active axis
				newSortedIndices[node.axis].push(index);
			}
			for (var i = 0, index = -1; i < numPoints; i++)
			{
				index = node.sortedIndices[axis][i];
				if (includeWorkspace[index] === true) newSortedIndices[axis].push(index);
			}

			node.leftChild = new KDNode(axis, newSortedIndices[0], newSortedIndices[1]);
			queue.queue(node.leftChild);

			// reset if used
			newSortedIndices = [[], []];
		}
		// at least one point in "right" side
		if (medianIndex < numPoints - 1)
		{
			for (var i = medianIndex + 1, index = -1; i < numPoints; i++)
			{
				index = node.sortedIndices[node.axis][i];
				// active axis
				newSortedIndices[node.axis].push(index);
			}

			for (var i = 0, index = -1; i < numPoints; i++)
			{
				index = node.sortedIndices[axis][i];
				if (includeWorkspace[index] === false) newSortedIndices[axis].push(index);
			}

			node.rightChild = new KDNode(axis, newSortedIndices[0], newSortedIndices[1]);
			queue.queue(node.rightChild);
		}
		// no longer necessary
		node.sortedIndices = null;
	}
}



