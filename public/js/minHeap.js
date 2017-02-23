// dependencies: None

/* 
	Class definition for a minimum heap. 
 	Optimized for use in Visvalingam-Whyatt Algorithm
*/

// partially borrowed from https://bost.ocks.org/mike/simplify/simplify.js (mike bostocks)

// float object with index <i> up to correct position
MinHeap.prototype.up = function(i) 
{
	var object = this.array[i];
	while (i > 0) 
	{
		// get parent index in "binary tree"
		var up = ((i + 1) >> 1) - 1,
			parent = this.array[up];
		// if bigger than parent, found right place and break
		if (this.compare(object, parent) >= 0) 
			break;
		// otherwise, swap parent & object, and keep floating 
		this.array[parent.index = i] = parent;
		this.array[object.index = i = up] = object;
    }
};

// sink object with index <i> down to correct position
MinHeap.prototype.down = function(i)
{
	//console.log(this);
    var object = this.array[i];
    while (true) 
    {
    	// get indices of right and left children
		var right = (i + 1) << 1,
			left = right - 1,
			down = i,
			child = this.array[down];

		// get minimum of (sinker, left child, right child) and make parent
		if (left < this.array.length && 
			this.compare(this.array[left], child) < 0) 
			child = this.array[down = left];
		if (right < this.array.length && 
			this.compare(this.array[right], child) < 0) 
			child = this.array[down = right];
		// current sinking object is smaller than both children -- break
		if (down === i) 
			break;

		this.array[child.index = i] = child;
		this.array[object.index = i = down] = object;
    }
};

// pop & return the object with min priority from heap
MinHeap.prototype.pop = function() 
{
	// the object to pop and return
	var removed = this.array[0],
	// replacement object for popped one
		object = this.array.pop();

	// if array isn't empty
	// move replacement to top of heap & sink
	if (this.array.length) 
	{
		this.array[object.index = 0] = object;
		this.down(0);
	}
	return removed;
};

// push n objects on to the heap
// n objects = n arguments
MinHeap.prototype.push = function()
{
	for (var i = 0, n = arguments.length; i < n; ++i)
	{
		var object = arguments[i];
		// add object to bottom of heap and float up
		this.up(object.index = this.array.push(object) - 1);
	}
	return this.array.length;
};

// remove object <removed> from min heap
MinHeap.prototype.remove = function(removed) 
{
	var i = removed.index,
		object = this.array.pop();

	// if <removed> wasn't the last item in the array/heap...
	if (i !== this.array.length) 
	{
		// swap the last item in the array with <removed>
		this.array[object.index = i] = object;

		// float <object> if smaller than <removed> 
		// otherwise sink if swapped item is greater than <removed>
		if (this.compare(object, removed) < 0)
			this.up(i)
		else
			this.down(i)
	}
	return i;
};

// returns number of current items in heap
MinHeap.prototype.getLength = function()
{
	return this.array.length;
};

// <compare> is a comparator function: function compare(a, b)
// return + if a > b
// return 0 if a == b
// return -1 if a < b
function MinHeap(compare)
{
	this.array = [];
	this.compare = compare;
}