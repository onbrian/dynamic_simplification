/*
    this hefty module has 4 parts:
    1) "static" (standalone) useful algebra/geometry functions/variables
    2) visvalingham-whyatt algorithm implementation & associated helper 
        functions/classes
    3) quick select/select top k algorithm implementation & associated
        helper functions
    4) DataSlice class implementation & associated helper interface
        --> really want to move this out... not really relevant 
*/

/* No dependencies -- completely standalone module */

module SimplifyData
{

    /**************************************************************************/
    /************************** POINT WRAPPER CLASS ***************************/
    /**************************************************************************/

    export abstract class AbstractPointWrapper {
        // underlying point data structure can be anything
        public point: any;
        public index: number;
        public significance: number;
        constructor(point: any, index: number) {
            this.point = point;
            this.index = index;
            this.significance = -1;
        }

        public abstract getX(): number;
        public abstract getY(): number;
        public abstract toCanvasPointObject(): CanvasJS.ChartDataPoint;
    }

    /**************************************************************************/
	/******************* Useful standalone math functions *********************/
	/**************************************************************************/

    export var AXIS_X: number = 0;
    export var AXIS_Y: number = 1;

    /*	
		Get the intersection between vertical line x=<x>
		and the line defined by points <a> & <b>
	*/
    function intersectX(a: Array<number>, b: Array<number>, 
        x: number): Array<number>
    {
        /*	
            compute slope
            m = (b[1] - a[1])/(b[0] - a[0])
            compute b using point a
            b = y - mx
                = a[1] - m*a[0]
            compute y
            y = mx + a[1] - m*a[0]
                = mx - m*a[0] + a[1]
                = m(x - a[0]) + a[1]
        */
        return [x, (x - a[AXIS_X]) * (b[AXIS_Y] - a[AXIS_Y]) /
            (b[AXIS_X] - a[AXIS_X]) + a[AXIS_Y]];
    }

/*
    function intersectX(a: PointWrapper, b: PointWrapper, x: number): number[]
    {
        return [x, (x - a.getX() * (b.getY() - a.getY()) /
            (b.getX() - a.getX()) + a.getY())];
    }
*/

    /*	
		Get the intersection between horizontal line y=<y>
		and the line defined by points <a> & <b>
	*/
    function intersectY(a: Array<number>, b: Array<number>, 
        y: number): Array<number>
    {
        return [(y - a[AXIS_Y]) * (b[AXIS_X] - a[AXIS_X]) /
            (b[AXIS_Y] - a[AXIS_Y]) + a[AXIS_X], y];
    }

    /*
        Get the area of a triangle defined by points
        <a>, <b>, <c>
    */
    function triangleArea<T extends AbstractPointWrapper>(a: T, b: T, 
        c: T): number
    {
        return Math.abs((a.getX() - c.getX()) * (b.getY() - a.getY()) - (a.getX() - b.getX()) *
            (c.getY() - a.getY()));
    }

    /**************************************************************************/
	/********************* VISVALINGHAM-WHYATT ALGORITHM **********************/
	/**************************************************************************/

    // helper class to store point-triangles on min heap
    class Triangle<T extends AbstractPointWrapper>
    {
        // initial index of triangle (<p>) in line
        public i: number;
        // "central" point on triangle
        public p: T;
        // point on triangle to left of <p>
        public pLeft: T;
        // point on triangle to right of <p>
        public pRight: T;
        // area of this triangle (formed by p, pLeft, pRight)
        public area: number;
        // triangle to left in line (left neighbor)
        public nLeft: Triangle<T>;
        // triangle to right in line (right neighbor)
        public nRight: Triangle<T>;
        // property for min heap
        public index: number;

        constructor(i: number, p: T, pLeft: T, pRight: T)
        {
            this.i = i;
            this.p = p;
            this.pLeft = pLeft;
            this.pRight = pRight;
            this.area = triangleArea(pLeft, p, pRight);
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

    // private helper function for <VisvalWhyattRank>
    // a point <p> should have at least 2 coordinates
    // sets the third coordinate of <p>
    function setCoordinateZ(p: Array<number>, val: number)
    {
        if (p.length === 2) p.push(val);
        else p[2] = val;
    }

    // private helper function for <VisvalWhyattRank>
	// update triangle's position in min heap
	// useful if triangle's points have changed
    function updateTriangle<T extends AbstractPointWrapper>(minheap: Collections.MinHeap<Triangle<T>>, 
        triangle: Triangle<T>): void
    {
        // remove triangle, update area, add again
        minheap.remove(triangle);
        triangle.area = triangleArea(triangle.pLeft, triangle.p,
        triangle.pRight);
        minheap.push(triangle);
    }

    // private helper function for <VisvalWhyattRank>
    // when removing a point associated w min triangle area
	// update areas and positions of neighboring triangles in min heap
    function updateNeighbors<T extends AbstractPointWrapper>(minheap: Collections.MinHeap<Triangle<T>>, 
        triangle: Triangle<T>): void
    {
        // update left neighbor if necessary
        let leftNeighbor: Triangle<T> = triangle.nLeft;
        if (leftNeighbor !== null)
        {
            // left neighbor's right point is now <tri>'s right point
            leftNeighbor.pRight = triangle.pRight;
            // remove neighbor, recompute area, push
            updateTriangle(minheap, leftNeighbor);
        }

        // update right neighbor if necessary
        let rightNeighbor: Triangle<T> = triangle.nRight;
        if (rightNeighbor !== null)
        {
            // right neighbor's left point is now <tri>'s left point
            rightNeighbor.pLeft = triangle.pLeft;
            // remove neighbor, recompute area, push
            updateTriangle(minheap, rightNeighbor);
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
    export function VisvalWhyattRank<T extends AbstractPointWrapper>(line: T[]): void
    {
        // no points in line
        if (line.length === 0) return;

        // end points are most important & should not be deleted
        line[0].significance = Infinity;
        line[line.length - 1].significance = Infinity;

        if (line.length <= 2) return;

        // min priority queue to store points/triangles in order of area
        let minHeap: Collections.MinHeap<Triangle<T>> = 
            new Collections.MinHeap<Triangle<T>>(function (a: Triangle<T>, b: Triangle<T>): number
        {
            return a.area - b.area;
        });

        // initialize triangles for points in line
        for (let i: number = 1, prevTri: Triangle<T> = null, currTri: Triangle<T> = null;
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
        let tri: Triangle<T> = null,
            effectiveArea: number = null;

        while (minHeap.getLength() > 0)
        {
            tri = minHeap.pop();

            // effective area is maximum(previous triangle's area + 1, current triangle area)
            effectiveArea = (effectiveArea !== null) &&
                (effectiveArea >= tri.area) ? (effectiveArea + 1) : tri.area;

            // store area with point as 3rd coordinate
            line[tri.i].significance = effectiveArea;
            updateNeighbors(minHeap, tri);
        }
        return;
    }

	/**************************************************************************/
	/************************* SELECT TOP K ALGORITHM *************************/
	/**************************************************************************/

    /*
        private generic helper function to swap to elements in an array
    */
    function swapElements<T>(list: Array<T>, i: number, j: number): void
    {
        let temp: T = list[i];
        list[i] = list[j], list[j] = temp;
        return;
    }

    /*
		private helper function for quick select algorithm
		partitions the elements in <list> between <leftIndex> and <rightIndex>
		inclusive such that...
			- all items at indices less than <pivotIndex> are less than the item
			at <pivotIndex>
			- all items at indices greater than <pivotIndex> are greater than
			the item at <pivotIndex>
	*/
    function partition<T>(list: Array<T>, leftIndex: number, rightIndex: number,
        pivotIndex: number, comparator: (a: T, b: T) => number): number
    {
        let pivotVal: T = list[pivotIndex];
        swapElements(list, pivotIndex, rightIndex);
        let storeIndex: number = leftIndex;
        for (let i: number = leftIndex; i < rightIndex; i++)
        {
            // comparator(a, b) returns negative value if a > b
            if (comparator(list[i], pivotVal) < 0)
            {
                swapElements(list, i, storeIndex);
                storeIndex++;
            }
        }
        // move pivot back
        swapElements(list, storeIndex, rightIndex);
        return storeIndex;
    }

	/*
		private helper recursive function for <quickSelect>
	*/
    function quickSelectHelper<T>(list: Array<T>, leftIndex: number, rightIndex: number,
        k: number, comparator: (a: T, b: T) => number): T
    {
        if (leftIndex >= rightIndex) return list[k];

        // randomly generate pivot index between <leftIndex> and
        // <rightIndex> inclusive
        let pivotIndex: number = Math.floor(Math.random() *
            (rightIndex - leftIndex + 1)) + leftIndex;

        // after partitioning, get the actual pivot index of selected element
        pivotIndex = partition(list, leftIndex, rightIndex, pivotIndex,
            comparator);

        // found k; return it
        if (pivotIndex == k) return list[k];
        // k less than pivot; recurse left
        else if (k < pivotIndex)
            return quickSelectHelper<T>(list, leftIndex, pivotIndex - 1, k, comparator);
        // k greater than pivot; recurse right
        else
            return quickSelectHelper<T>(list, pivotIndex + 1, rightIndex, k, comparator);
    }

    /*
		Returns the <k>th largest element from <list> using the quick select algorithm
        O(n) average runtime, O(n^2) worst case
	*/
    export function quickSelect<T>(list: Array<T>, k: number, 
        comparator: (a: T, b: T) => number): T
    {
        // 'flip' k to get <k>th largest rather than smallest
        k = list.length - k;
        return quickSelectHelper<T>(list.slice(), 0, list.length - 1, k, comparator);
    }

    /*
        Extract the top <k> elements from <list> using the quick select algorithm
        and return them in a new list (in original order)
        O(n) average runtime, O(n^2) worst case
    */
    export function selectTopK<T>(list: Array<T>, k: number, comparator: (a: T, b: T) => number): Array<T>
    {
        let itemK: T = quickSelect<T>(list, k, comparator);
        let listTopK: Array<T> = [];

        for (let i: number = 0; i < list.length; i++)
        {
            // comparator(a, b) returns negative value if a < b
            if (comparator(list[i], itemK) >= 0) listTopK.push(list[i]);
        }
        return listTopK;
    }

    /**************************************************************************/
    /**************************** DataSlice Class *****************************/
    /**************************************************************************/

    /*
	    Data Slice Class Implementation
	    ----------------------------------------------------------------------------

	    ----------------------------------------------------------------------------
	    Notes
	    ----------------------------------------------------------------------------
	    A DataSlice instance represents a set of data to be rendered on a graph. This
	    can be the entire set of data to be displayed, or a subset (slice) of
	    some data. Because the former case is trivial, this class was created mostly
	    for the latter use-case. In particular, when the user zooms in a particular
	    2D box on a graph, this DataSlice class makes it easy to dynamically grab all
	    the points within that box to display only those points when re-rendering
	    the chart.

	    This DataSlice instance also supports operations on its grabbed data before
        rendering, i.e. simplifying it, to handle cases where there are too many
        datapoints.
	
	    ----------------------------------------------------------------------------
	    Dependencies: functions in this module
	    ----------------------------------------------------------------------------
	    None
    */

    /*
        interface representing a rectangular boundary
    */
    export interface Bounds 
    {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    }

    export class DataSlice<T extends AbstractPointWrapper>
    {
        // number of total points contained in this slice
        public numPoints: number;
        // lines contained in the bounds of this slice
        private lines: T[][];
        // viewport bounds of this data slice
        public boundsViewport: Bounds;
        // axis bounds of this data slice
        public boundsAxis: Bounds;
        // array containing proportion of points each line contributes
        // to aggregate number of points
        private linePP: Array<number>;
        // min number of points per line
        private linePtMin: number;
        // last simplified lines cached
        public cachedSimpLines: T[][];

        constructor(lines: T[][], boundsViewport: Bounds,
            boundsAxis: Bounds, linePtMin: number) {
            this.numPoints = 0;
            this.lines = [];
            this.boundsViewport = boundsViewport;
            this.boundsAxis = boundsAxis;
            this.linePP = [];
            this.linePtMin = linePtMin;
            this.cachedSimpLines = null;

            // copy original lines, clipping to specified bounds if any
            for (let i: number = 0; i < lines.length; i++) {
                // clone lines whether or not clipping -- safer to keep own copy
                if (DataSlice.nullBounds(boundsViewport))
                    this.lines.push(lines[i].slice());
                else this.lines.push(DataSlice.hardClipToBounds(lines[i],
                    boundsViewport));
            }

            // set num points
            for (let i: number = 0; i < this.lines.length; i++)
                this.numPoints += this.lines[i].length;

            // set line point proportion contributions
            for (let i: number = 0; i < this.lines.length; i++)
                this.linePP.push(this.lines[i].length / this.numPoints);
        }

        public simplifySlice(chartPtMax: number): T[][] 
        {
            console.time("View Simplification");
            // already have fewer points
            if (this.numPoints <= chartPtMax) return this.lines;
            let simplifiedLines: T[][] = [];

            // use line percentages to compute point caps per line
            let lineCaps: Array<number> = [];
            for (let i: number = 0; i < this.linePP.length; i++) {
                // round to whole number
                let cap: number = this.linePP[i] * chartPtMax;
                lineCaps.push(parseInt(cap.toString(), 10));
            }

            // simplify each line using corresponding line cap
            for (let i: number = 0, lineCap: number = 0,
                line: T[] = null; i < this.lines.length; i++) {
                line = this.lines[i];
                // cap for this line is maximum (computed cap, line pt min)
                lineCap = lineCaps[i] < this.linePtMin ? this.linePtMin : lineCaps[i];

                let simpLine: T[] = null;
                if (lineCap > line.length) simpLine = line;
                else {
                    simpLine = selectTopK(line, lineCap,
                        function (a: T, b: T): number {
                            return a.significance - b.significance;
                        });
                }

                simplifiedLines.push(simpLine);
            }
            console.timeEnd("View Simplification");
            // cache this for zooming out
            this.cachedSimpLines = simplifiedLines;
            return simplifiedLines;
        }

        // "zoom" in on a rectangle defined by bounds object
        public subSlice(boundsViewport, boundsAxis, linePtMin): DataSlice<T> {
            return new DataSlice<T>(this.lines, boundsViewport, boundsAxis, linePtMin);
        }

        // return a shallow clone of this data slice
        // this means the returned Data Slice's references the same
        // array of lines, array of prioritized lines, bounds,
        // array of point percentiles, cached lines (if not null), etc.
        public shallowClone(): DataSlice<T> {
            let fillerBounds: Bounds = { minX: null, maxX: null, minY: null, maxY: null };
            let clone: DataSlice<T> = new DataSlice<T>([], fillerBounds, fillerBounds, 0);
            let context: DataSlice<T> = this;
            // copy over all properties from this object to <clone>
            Object.getOwnPropertyNames(context).forEach(function (val: string): void {
                clone[val] = context[val];
            });
            console.log(clone);
            return clone;
        }

        // returns true if any of the min/max values are null for bounds object
        private static nullBounds(bounds: Bounds): boolean {
            if (bounds.minX === null || bounds.maxX === null) return true;
            return bounds.minY === null || bounds.maxY === null;
        }

        /*	
            private static helper function for constructor
            is point <p> contained in <bounds> for x axis?
        */
        private static pointInBoundsX<T extends AbstractPointWrapper>(p: T, 
            bounds: Bounds): boolean 
        {
            if (DataSlice.nullBounds(bounds)) return true;
            return !(p.getX() < bounds.minX || p.getX() > bounds.maxX);
        }

        /*	
            private static helper function for constructor
            is point <p> contained in <bounds> for y axis?
        */
        private static pointInBoundsY<T extends AbstractPointWrapper>(p: T, 
            bounds: Bounds): boolean 
        {
            if (DataSlice.nullBounds(bounds)) return true;
            return !(p.getY() < bounds.minY || p.getY() > bounds.maxY);
        }

        /*	
            private helper function for constructor
            is point <p> contained in <bounds>?
        */
        private static pointInBounds<T extends AbstractPointWrapper>(p: T, 
            bounds: Bounds): boolean 
        {
            // all points are in
            if (DataSlice.nullBounds(bounds)) return true;
            return DataSlice.pointInBoundsX(p, bounds) &&
                DataSlice.pointInBoundsY(p, bounds);
        }

        /*	
            private static helper function for constructor
            iterate through line <line> position-wise and find
            first/last index of the points just outside these bounds
            (technically out of bounds) if they exist, otherwise returns
            the first/last indices of the points in bounds.
        */
        private static hardClipToBounds<T extends AbstractPointWrapper>(line: T[], 
            bounds: Bounds): T[] {
            // not all bounds are defined
            if (DataSlice.nullBounds(bounds)) return line;
            if (line.length <= 2) return line;

            // get beginning and ending point (position-wise) inside bounds

            let startIndex: number = -1,
                stopIndex: number = -1;

            // get index of first point in-bounds starting from beginning of line
            for (let i: number = 0; i < line.length; i++) {
                // index of first point in bounds
                if (DataSlice.pointInBounds(line[i], bounds)) {
                    startIndex = i;
                    break;
                }
            }


            // no point in bounds
            if (startIndex < 0) {
                console.log("no points in bounds")
                return [];
            }

            // get index of last point in-bounds starting from end of line
            for (let i: number = line.length - 1; i >= 0; i--) {
                if (DataSlice.pointInBounds(line[i], bounds)) {
                    stopIndex = i;
                    break;
                }
            }

            // if made if this far, stopIndex should have non-negative value
            // (lowest possible value is <startIndex>) -- might want to assert
            // for more robust code

            // if possible, step back by one index on either side
            startIndex = startIndex > 0 ? startIndex - 1 : startIndex;
            stopIndex = stopIndex < line.length - 1 ? stopIndex + 1 : stopIndex;

            return line.slice(startIndex, stopIndex + 1);
        }
    }
}