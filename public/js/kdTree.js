// dependencies: queue.js

// a data structure for optimized 2D indexing (bounding-box search)
// should only be used for 2 dimensions
// useful for zooming
KDNode.prototype.sortPoints = function()
{
	var axis = this.axis; // scoping
	this.points.sort(function(a, b){ return a[axis] - b[axis]});
}

function KDNode(points, axis)
{
	this.points = points;
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
/*
function KDTree(points)
{
	this.leafSize = 2;

	var median = -1,
		node = null,
		axis = 0;

	// iterative implementation in lieu of recursive for extra efficiency
	var queue = new Queue();
	queue.queue(this.root = new KDNode(points.slice(), axis));

	while (!queue.isEmpty())
	{
		console.log("building...")
		node = queue.dequeue();
		// edge cases
		if (node.points.length <= this.leafSize) 
		{
			node.isLeaf = true;
			continue;
		}

		// generate children
		node.sortPoints();
		//node.points.slice();
		medianIndex = Math.floor((node.points.length - 1) / 2);
		node.cut = node.points[medianIndex];

		// generate children

		axis = node.axis === 0 ? 1 : 0;
		
		// at least one point in "left" side
		if (medianIndex >= 1)
		{
			node.leftChild = new KDNode(node.points.slice(0, medianIndex), 
				axis);
			queue.queue(node.leftChild);
		}
		// at least one point in "right" side
		if (medianIndex < node.points.length - 1)
		{
			node.rightChild = new KDNode(node.points.slice(medianIndex + 1), 
				axis);
			queue.queue(node.rightChild);
		}
		// only nodes need to keep points
		node.points = null;
	}
}*/

// optimized by eliminating sort at each axis
function KDTree(points)
{
	this.leafSize = 2;

	var median = -1,
		node = null,
		axis = 0;

	var indexSortedX = sortPointsByIndex(points, 0);
	var indexSortedY = sortPointsByIndex(points, 1);
	var includeWorkspace = [];
	for (var i = 0; i < points.length; i++)
		includeWorkspace.push(false);
	

	// iterative implementation in lieu of recursive for extra efficiency
	var queue = new Queue();
	queue.queue(this.root = new KDNode(points.slice(), axis));

	while (!queue.isEmpty())
	{
		console.log("building...")
		node = queue.dequeue();
		// edge cases
		if (node.points.length <= this.leafSize) 
		{
			node.isLeaf = true;
			continue;
		}

		// generate children
		node.sortPoints();
		//node.points.slice();
		medianIndex = Math.floor((node.points.length - 1) / 2);
		node.cut = node.points[medianIndex];

		// generate children

		axis = node.axis === 0 ? 1 : 0;
		
		// at least one point in "left" side
		if (medianIndex >= 1)
		{
			node.leftChild = new KDNode(node.points.slice(0, medianIndex), 
				axis);
			queue.queue(node.leftChild);
		}
		// at least one point in "right" side
		if (medianIndex < node.points.length - 1)
		{
			node.rightChild = new KDNode(node.points.slice(medianIndex + 1), 
				axis);
			queue.queue(node.rightChild);
		}
		// only leaves need to keep points
		node.points = null;
	}
}



