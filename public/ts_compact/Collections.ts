module Collections
{
    interface HeapItem
    {
        // objects on MinHeap must have index property
        index: number;
        toString: () => String;
    }

    export class MinHeap<T extends HeapItem>
    {
        private array: Array<T>;
        private compare: (a: T, b: T) => number;

        constructor(compare: (a: T, b: T) => number)
        {
            this.array = [];
            this.compare = compare;
        }

        // add item to minimum heap
        // return array length
        public push(item: T): number
        {
            if (item.index !== null)
            {
                throw new TypeError("Index property of HeapItem subtype should have null value.");
            }

            // instead of null
            this.up(item.index = this.array.push(item) - 1);
            return this.array.length;
        }

        // pop & return the object with min priority from heap
        public pop(): T
        {
            // object to pop and return
            let removed: T = this.array[0],
                // replacement object for popped one
                item: T = this.array.pop();

            // if array isn't empty, move replacement to top of heap & sink
            if (this.array.length)
            {
                this.array[item.index = 0] = item;
                this.down(0);
            }

            // restore index to null
            removed.index = null;
            return removed;
        }

        public getLength(): number
        {
            return this.array.length;
        }

        // remove HeapItem <removed> from min heap

        public remove(removed: T): number
        {
            let i: number = removed.index,
                item: T = this.array.pop();

            // if <removed> wasn't the last item in the array/heap...
            if (i !== this.array.length)
            {
                // swap the last item in the array with <removed>
                this.array[item.index = i] = item;

                // float <object> if smaller than <removed>
                // otherwise sink, if swapped item is greater than <removed>
                if (this.compare(item, removed) < 0) this.up(i);
                else this.down(i);
            }

            removed.index = null;
            return i;
        }

        // float an item up until none of its parents are larger than it
        public up(i: number): void
        {
            let item: T = this.array[i];
            while (i > 0)
            {
                // get parent index in "binary tree"
                let up: number = ((i + 1) >> 1) - 1,
                    parent: T = this.array[up];

                // if bigger than parent, found right place and break
                if (this.compare(item, parent) >= 0) break;
                //console.log(parent.index);
                // otherwise, swap parent & item and keep floating
                this.array[parent.index = i] = parent;
                this.array[item.index = i = up] = item;
            }
        }

        // sink an item down until no children are smaller than it
        public down(i: number): void
        {
            let item: T = this.array[i];
            while (true)
            {
                let right: number = (i + 1) << 1,
                    left: number = right - 1,
                    down: number = i,
                    child: T = this.array[down];

                // get minimum of (sinker, left child, right child) and make parent
                if (left < this.array.length &&
                    this.compare(this.array[left], child) < 0)
                    child = this.array[down = left];
                if (right < this.array.length &&
                    this.compare(this.array[right], child) < 0)
                    child = this.array[down = right];
                // current sinking object is smaller than both children -- break
                if (down === i) break;

                this.array[child.index = i] = child;
                this.array[item.index = i = down] = item;
            }
        }

        public toString(): String
        {
            let stringArray: Array<String> = [];
            for (let i: number = 0; i < this.array.length; i++)
                stringArray.push(this.array[i].toString());
            return this.array.join(',\n');
        }
    }
}