// basic implementation of a queue
// optimize later, because Array.shift has O(n) runtime

function Queue()
{
	this.items = [];
}

Queue.prototype.queue = function(item)
{
	this.items.push(item);
};

// returns undefined if queue is empty
Queue.prototype.dequeue = function()
{
	return this.items.shift();
};

// return undefined if queue is empty
Queue.prototype.peek = function()
{
	return this.items[0];
};

Queue.prototype.getLength = function()
{
	return this.items.length;
};

Queue.prototype.isEmpty = function()
{
	return this.items.length === 0;
};