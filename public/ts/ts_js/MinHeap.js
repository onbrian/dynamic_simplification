var MinHeap = (function () {
    function MinHeap(compare) {
        this.array = [];
        this.compare = compare;
    }
    // add item to minimum heap
    // return array length
    MinHeap.prototype.push = function (item) {
        if (item.index !== null) {
            throw new TypeError("Index property of HeapItem subtype should have null value.");
        }
        // instead of null
        this.up(item.index = this.array.push(item) - 1);
        return this.array.length;
    };
    // pop & return the object with min priority from heap
    MinHeap.prototype.pop = function () {
        // object to pop and return
        var removed = this.array[0], 
        // replacement object for popped one
        item = this.array.pop();
        // if array isn't empty, move replacement to top of heap & sink
        if (this.array.length) {
            this.array[item.index = 0] = item;
            this.down(0);
        }
        // restore index to null
        removed.index = null;
        return removed;
    };
    MinHeap.prototype.getLength = function () {
        return this.array.length;
    };
    // remove HeapItem <removed> from min heap
    MinHeap.prototype.remove = function (removed) {
        var i = removed.index, item = this.array.pop();
        // if <removed> wasn't the last item in the array/heap...
        if (i !== this.array.length) {
            // swap the last item in the array with <removed>
            this.array[item.index = i] = item;
            // float <object> if smaller than <removed>
            // otherwise sink, if swapped item is greater than <removed>
            if (this.compare(item, removed) < 0)
                this.up(i);
            else
                this.down(i);
        }
        removed.index = null;
        return i;
    };
    // float an item up until none of its parents are larger than it
    MinHeap.prototype.up = function (i) {
        var item = this.array[i];
        while (i > 0) {
            // get parent index in "binary tree"
            var up = ((i + 1) >> 1) - 1, parent_1 = this.array[up];
            // if bigger than parent, found right place and break
            if (this.compare(item, parent_1) >= 0)
                break;
            //console.log(parent.index);
            // otherwise, swap parent & item and keep floating
            this.array[parent_1.index = i] = parent_1;
            this.array[item.index = i = up] = item;
        }
    };
    // sink an item down until no children are smaller than it
    MinHeap.prototype.down = function (i) {
        var item = this.array[i];
        while (true) {
            var right = (i + 1) << 1, left = right - 1, down = i, child = this.array[down];
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
            this.array[item.index = i = down] = item;
        }
    };
    MinHeap.prototype.toString = function () {
        var stringArray = [];
        for (var i = 0; i < this.array.length; i++)
            stringArray.push(this.array[i].toString());
        return this.array.join(',\n');
    };
    return MinHeap;
}());
export { MinHeap };
