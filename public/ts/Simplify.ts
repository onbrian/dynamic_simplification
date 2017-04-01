import { MathHelper } from './MathHelper';
import { MinHeap } from './MinHeap';

class Triangle
{
    // initial index of triangle (<p>) in line
    public i: number;
    // "central" point on triangle
    public p: Array<number>;
    // point on triangle to left of <p>
    public pLeft: Array<number>;
    // point on triangle to right of <p>
    public pRight: Array<number>;
    // area of this triangle (formed by p, pLeft, pRight)
    public area: number;
    // triangle to left in line (left neighbor)
    public nLeft: Triangle;
    // triangle to right in line (right neighbor)
    public nRight: Triangle;
    // property for min heap
    public index: number;

    constructor(i: number, p: Array<number>, pLeft: Array<number>, pRight: Array<number>)
    {
        this.i = i;
        this.p = p;
        this.pLeft = pLeft;
        this.pRight = pRight;
        this.area = MathHelper.triangleArea(pLeft, p, pRight);
        this.nLeft = null;
        this.nRight = null;
        this.index = null;
    }

    public toString(): String
    {
        let dict = {};
        dict['i'] = this.i;
        dict['p'] = this.p;
        dict['pLeft'] = this.pLeft;
        dict['pRight'] = this.pRight;
        dict['area'] = this.area;
        dict['nLeft'] = this.nLeft === null ? null : this.nLeft.p;
        dict['nRight'] = this.nRight === null ? null : this.nRight.p;
        dict['index'] = this.index;
        return JSON.stringify(dict);
    }
}

export class Simplify
{
    constructor() { }

	/**************************************************************************/
	/********************* VISVALINGHAM-WHYATT ALGORITHM **********************/
	/**************************************************************************/

    // private static helper function for <VisvalWhyattRank>
    // a point <p> should have at least 2 coordinates
    // sets the third coordinate of <p>
    private static setCoordinateZ(p: Array<number>, val: number)
    {
        if (p.length === 2) p.push(val);
        else p[2] = val;
    }

    // private static helper function for <VisvalWhyattRank>
	// update triangle's position in min heap
	// useful if triangle's points have changed
    private static updateTriangle(minheap: MinHeap<Triangle>, 
        triangle: Triangle): void
    {
        // remove triangle, update area, add again
        minheap.remove(triangle);
        triangle.area = MathHelper.triangleArea(triangle.pLeft, triangle.p,
        triangle.pRight);
        minheap.push(triangle);
    }

    // private static helper function for <VisvalWhyattRank>
    // when removing a point associated w min triangle area
	// update areas and positions of neighboring triangles in min heap
    private static updateNeighbors(minheap, triangle): void
    {
        // update left neighbor if necessary
        let leftNeighbor: Triangle = triangle.nLeft;
        if (leftNeighbor !== null)
        {
            // left neighbor's right point is now <tri>'s right point
            leftNeighbor.pRight = triangle.pRight;
            // remove neighbor, recompute area, push
            Simplify.updateTriangle(minheap, leftNeighbor);
        }

        // update right neighbor if necessary
        let rightNeighbor: Triangle = triangle.nRight;
        if (rightNeighbor !== null)
        {
            // right neighbor's left point is now <tri>'s left point
            rightNeighbor.pLeft = triangle.pLeft;
            // remove neighbor, recompute area, push
            Simplify.updateTriangle(minheap, rightNeighbor);
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

    // use Visvalingam-Whyatt algorithm to assign significance values to each point
    // in line <line>. These values are stored as a z-coordinate for each point
    public static VisvalWhyattRank(line: Array<Array<number>>): void
    {
        // no points in line
        if (line.length === 0) return;

        // end points are most important & should not be deleted
        Simplify.setCoordinateZ(line[0], Infinity);
        Simplify.setCoordinateZ(line[line.length - 1], Infinity);

        if (line.length <= 2) return;

        // min priority queue to store points/triangles in order of area
        let minHeap: MinHeap<Triangle> = new MinHeap<Triangle>(function (a: Triangle, b: Triangle): number
        {
            return a.area - b.area;
        });

        // initialize triangles for points in line
        for (let i: number = 1, prevTri: Triangle = null, currTri: Triangle = null;
            i < line.length - 1; i++)
        {
            currTri = new Triangle(i, line[i], line[i - 1], line[i + 1]);
            // set neighbors if not first triangle
            if (prevTri !== null) {
                currTri.nLeft = prevTri;
                prevTri.nRight = currTri;
            }

            // add new triangle to min heap
            minHeap.push(currTri);
            // update prev triangle
            prevTri = currTri;
        }

        // all triangles are now in priority queue -- now pop them off by area
        let tri: Triangle = null,
            effectiveArea: number = null;

        while (minHeap.getLength() > 0)
        {
            tri = minHeap.pop();

            // effective area is maximum(previous triangle's area + 1, current triangle area)
            effectiveArea = (effectiveArea !== null) &&
                (effectiveArea >= tri.area) ? (effectiveArea + 1) : tri.area;

            // store area with point as 3rd coordinate
            Simplify.setCoordinateZ(line[tri.i], effectiveArea);
            Simplify.updateNeighbors(minHeap, tri);
        }
        return;
    }

	/**************************************************************************/
	/************************* SELECT TOP K ALGORITHM *************************/
	/**************************************************************************/

    /*
        Generic function to swap to elements in an array
    */
    private static swapElements<T>(list: Array<T>, i: number, j: number): void
    {
        let temp: T = list[i];
        list[i] = list[j], list[j] = temp;
        return;
    }

    /*
		private static helper function for quick select algorithm
		partitions the elements in <list> between <leftIndex> and <rightIndex>
		inclusive such that...
			- all items at indices less than <pivotIndex> are less than the item
			at <pivotIndex>
			- all items at indices greater than <pivotIndex> are greater than
			the item at <pivotIndex>
	*/
    private static partition<T>(list: Array<T>, leftIndex: number, rightIndex: number,
        pivotIndex: number, comparator: (a: T, b: T) => number): number
    {
        let pivotVal: T = list[pivotIndex];
        Simplify.swapElements<T>(list, pivotIndex, rightIndex);
        let storeIndex: number = leftIndex;
        for (let i: number = leftIndex; i < rightIndex; i++)
        {
            // comparator(a, b) returns negative value if a > b
            if (comparator(list[i], pivotVal) < 0)
            {
                Simplify.swapElements(list, i, storeIndex);
                storeIndex++;
            }
        }
        // move pivot back
        Simplify.swapElements(list, storeIndex, rightIndex);
        return storeIndex;
    }

	/*
		private static function
		helper recursive function for <quickSelect>
	*/
    private static quickSelectHelper<T>(list: Array<T>, leftIndex: number, rightIndex: number,
        k: number, comparator: (a: T, b: T) => number): T
    {
        if (leftIndex >= rightIndex) return list[k];

        // randomly generate pivot index between <leftIndex> and
        // <rightIndex> inclusive
        let pivotIndex: number = Math.floor(Math.random() *
            (rightIndex - leftIndex + 1)) + leftIndex;

        // after partitioning, get the actual pivot index of selected element
        pivotIndex = Simplify.partition(list, leftIndex, rightIndex, pivotIndex,
            comparator);

        // found k; return it
        if (pivotIndex == k) return list[k];
        // k less than pivot; recurse left
        else if (k < pivotIndex)
            return Simplify.quickSelectHelper<T>(list, leftIndex, pivotIndex - 1, k, comparator);
        // k greater than pivot; recurse right
        else
            return Simplify.quickSelectHelper<T>(list, pivotIndex + 1, rightIndex, k, comparator);
    }

    /*
		Returns the <k>th largest element from <list> using the quick select algorithm
        O(n) average runtime, O(n^2) worst case
	*/
    public static quickSelect<T>(list: Array<T>, k: number, comparator: (a: T, b: T) => number): T
    {
        // 'flip' k to get <k>th largest rather than smallest
        k = list.length - k;
        return Simplify.quickSelectHelper<T>(list.slice(), 0, list.length - 1, k, comparator);
    }

    /*
        Extract the top <k> elements from <list> using the quick select algorithm
        and return them in a new list (in original order)
        O(n) average runtime, O(n^2) worst case
    */
    public static selectTopK<T>(list: Array<T>, k: number, comparator: (a: T, b: T) => number): Array<T>
    {
        let itemK: T = Simplify.quickSelect<T>(list, k, comparator);
        let listTopK: Array<T> = [];

        for (let i: number = 0; i < list.length; i++)
        {
            // comparator(a, b) returns negative value if a < b
            if (comparator(list[i], itemK) >= 0) listTopK.push(list[i]);
        }
        return listTopK;
    }
}