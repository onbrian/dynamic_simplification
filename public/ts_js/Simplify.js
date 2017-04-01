import { MathHelper } from './MathHelper';
import { MinHeap } from './MinHeap';
var Triangle = (function () {
    function Triangle(i, p, pLeft, pRight) {
        this.i = i;
        this.p = p;
        this.pLeft = pLeft;
        this.pRight = pRight;
        this.area = MathHelper.triangleArea(pLeft, p, pRight);
        this.nLeft = null;
        this.nRight = null;
        this.index = null;
    }
    Triangle.prototype.toString = function () {
        var dict = {};
        dict['i'] = this.i;
        dict['p'] = this.p;
        dict['pLeft'] = this.pLeft;
        dict['pRight'] = this.pRight;
        dict['area'] = this.area;
        dict['nLeft'] = this.nLeft === null ? null : this.nLeft.p;
        dict['nRight'] = this.nRight === null ? null : this.nRight.p;
        dict['index'] = this.index;
        return JSON.stringify(dict);
    };
    return Triangle;
}());
var Simplify = (function () {
    function Simplify() {
    }
    /**************************************************************************/
    /********************* VISVALINGHAM-WHYATT ALGORITHM **********************/
    /**************************************************************************/
    // private static helper function for <VisvalWhyattRank>
    // a point <p> should have at least 2 coordinates
    // sets the third coordinate of <p>
    Simplify.setCoordinateZ = function (p, val) {
        if (p.length === 2)
            p.push(val);
        else
            p[2] = val;
    };
    // private static helper function for <VisvalWhyattRank>
    // update triangle's position in min heap
    // useful if triangle's points have changed
    Simplify.updateTriangle = function (minheap, triangle) {
        // remove triangle, update area, add again
        minheap.remove(triangle);
        triangle.area = MathHelper.triangleArea(triangle.pLeft, triangle.p, triangle.pRight);
        minheap.push(triangle);
    };
    // private static helper function for <VisvalWhyattRank>
    // when removing a point associated w min triangle area
    // update areas and positions of neighboring triangles in min heap
    Simplify.updateNeighbors = function (minheap, triangle) {
        // update left neighbor if necessary
        var leftNeighbor = triangle.nLeft;
        if (leftNeighbor !== null) {
            // left neighbor's right point is now <tri>'s right point
            leftNeighbor.pRight = triangle.pRight;
            // remove neighbor, recompute area, push
            Simplify.updateTriangle(minheap, leftNeighbor);
        }
        // update right neighbor if necessary
        var rightNeighbor = triangle.nRight;
        if (rightNeighbor !== null) {
            // right neighbor's left point is now <tri>'s left point
            rightNeighbor.pLeft = triangle.pLeft;
            // remove neighbor, recompute area, push
            Simplify.updateTriangle(minheap, rightNeighbor);
        }
        // update neighbor links
        // both neighbors exist
        if (leftNeighbor !== null && rightNeighbor !== null) {
            leftNeighbor.nRight = rightNeighbor;
            rightNeighbor.nLeft = leftNeighbor;
        }
        else if (leftNeighbor !== null)
            leftNeighbor.nRight = null;
        else if (rightNeighbor !== null)
            rightNeighbor.nLeft = null;
        return;
    };
    // use Visvalingam-Whyatt algorithm to assign significance values to each point
    // in line <line>. These values are stored as a z-coordinate for each point
    Simplify.VisvalWhyattRank = function (line) {
        // no points in line
        if (line.length === 0)
            return;
        // end points are most important & should not be deleted
        Simplify.setCoordinateZ(line[0], Infinity);
        Simplify.setCoordinateZ(line[line.length - 1], Infinity);
        if (line.length <= 2)
            return;
        // min priority queue to store points/triangles in order of area
        var minHeap = new MinHeap(function (a, b) {
            return a.area - b.area;
        });
        // initialize triangles for points in line
        for (var i = 1, prevTri = null, currTri = null; i < line.length - 1; i++) {
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
        var tri = null, effectiveArea = null;
        while (minHeap.getLength() > 0) {
            tri = minHeap.pop();
            // effective area is maximum(previous triangle's area + 1, current triangle area)
            effectiveArea = (effectiveArea !== null) &&
                (effectiveArea >= tri.area) ? (effectiveArea + 1) : tri.area;
            // store area with point as 3rd coordinate
            Simplify.setCoordinateZ(line[tri.i], effectiveArea);
            Simplify.updateNeighbors(minHeap, tri);
        }
        return;
    };
    /**************************************************************************/
    /************************* SELECT TOP K ALGORITHM *************************/
    /**************************************************************************/
    /*
        Generic function to swap to elements in an array
    */
    Simplify.swapElements = function (list, i, j) {
        var temp = list[i];
        list[i] = list[j], list[j] = temp;
        return;
    };
    /*
        private static helper function for quick select algorithm
        partitions the elements in <list> between <leftIndex> and <rightIndex>
        inclusive such that...
            - all items at indices less than <pivotIndex> are less than the item
            at <pivotIndex>
            - all items at indices greater than <pivotIndex> are greater than
            the item at <pivotIndex>
    */
    Simplify.partition = function (list, leftIndex, rightIndex, pivotIndex, comparator) {
        var pivotVal = list[pivotIndex];
        Simplify.swapElements(list, pivotIndex, rightIndex);
        var storeIndex = leftIndex;
        for (var i = leftIndex; i < rightIndex; i++) {
            // comparator(a, b) returns negative value if a > b
            if (comparator(list[i], pivotVal) < 0) {
                Simplify.swapElements(list, i, storeIndex);
                storeIndex++;
            }
        }
        // move pivot back
        Simplify.swapElements(list, storeIndex, rightIndex);
        return storeIndex;
    };
    /*
        private static function
        helper recursive function for <quickSelect>
    */
    Simplify.quickSelectHelper = function (list, leftIndex, rightIndex, k, comparator) {
        if (leftIndex >= rightIndex)
            return list[k];
        // randomly generate pivot index between <leftIndex> and
        // <rightIndex> inclusive
        var pivotIndex = Math.floor(Math.random() *
            (rightIndex - leftIndex + 1)) + leftIndex;
        // after partitioning, get the actual pivot index of selected element
        pivotIndex = Simplify.partition(list, leftIndex, rightIndex, pivotIndex, comparator);
        // found k; return it
        if (pivotIndex == k)
            return list[k];
        else if (k < pivotIndex)
            return Simplify.quickSelectHelper(list, leftIndex, pivotIndex - 1, k, comparator);
        else
            return Simplify.quickSelectHelper(list, pivotIndex + 1, rightIndex, k, comparator);
    };
    /*
        Returns the <k>th largest element from <list> using the quick select algorithm
        O(n) average runtime, O(n^2) worst case
    */
    Simplify.quickSelect = function (list, k, comparator) {
        // 'flip' k to get <k>th largest rather than smallest
        k = list.length - k;
        return Simplify.quickSelectHelper(list.slice(), 0, list.length - 1, k, comparator);
    };
    /*
        Extract the top <k> elements from <list> using the quick select algorithm
        and return them in a new list (in original order)
        O(n) average runtime, O(n^2) worst case
    */
    Simplify.selectTopK = function (list, k, comparator) {
        var itemK = Simplify.quickSelect(list, k, comparator);
        var listTopK = [];
        for (var i = 0; i < list.length; i++) {
            // comparator(a, b) returns negative value if a < b
            if (comparator(list[i], itemK) >= 0)
                listTopK.push(list[i]);
        }
        return listTopK;
    };
    return Simplify;
}());
export { Simplify };
