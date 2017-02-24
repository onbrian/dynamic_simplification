/*
	Queue Class Implementation
	----------------------------------------------------------------------------

	----------------------------------------------------------------------------
	Notes
	----------------------------------------------------------------------------
	Basic implementation of a queue -- should optimize later because Array.shift
	has O(n) runtime

	----------------------------------------------------------------------------
	Dependencies
	----------------------------------------------------------------------------
	None
*/

var Queue = (function()
{
	/*
		Queue instance constructor
	*/
	function Queue()
	{
		this.items = [];
	}

	/*
		Add <item> to the queue
	*/
	Queue.prototype.queue = function(item)
	{
		this.items.push(item);
	};

	/*
		Removes the first item in the queue & returns it
		Returns undefined if queue is empty
	*/
	Queue.prototype.dequeue = function()
	{
		return this.items.shift();
	};

	/*
		Returns the first item on the queue
		Returns undefined if queue is empty
	*/
	Queue.prototype.peek = function()
	{
		return this.items[0];
	};

	/*
		Returns the number of items in the queue
	*/
	Queue.prototype.getLength = function()
	{
		return this.items.length;
	};

	/*
		Returns true if the queue is empty; false otherwise
	*/
	Queue.prototype.isEmpty = function()
	{
		return this.items.length === 0;
	};

	return Queue;
})();