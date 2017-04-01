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
	Dependencies
	----------------------------------------------------------------------------
	None
*/
import { Simplify } from './Simplify';

export interface Bounds
{
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

export class DataSlice
{
    // number of total points contained in this slice
    public numPoints: number;
    // lines contained in the bounds of this slice
    private lines: Array<Array<Array<number>>>;
    // viewport bounds of this data slice
    public boundsViewport: Bounds;
    // axis bounds of this data slice
    private boundsAxis: Bounds;
    // array containing proportion of points each line contributes
    // to aggregate number of points
    private linePP: Array<number>;
    // min number of points per line
    private linePtMin: number;
    // last simplified lines cached
    public cachedSimpLines: Array<Array<Array<number>>>;

    constructor(lines: Array<Array<Array<number>>>, boundsViewport: Bounds,
        boundsAxis: Bounds, linePtMin: number)
    {
        this.numPoints = 0;
        this.lines = [];
        this.boundsViewport = boundsViewport;
        this.boundsAxis = boundsAxis;
        this.linePP = [];
        this.linePtMin = linePtMin;
        this.cachedSimpLines = null;

        // copy original lines, clipping to specified bounds if any
        for (let i: number = 0; i < lines.length; i++)
        {
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

    public simplifySlice(chartPtMax: number): Array<Array<Array<number>>>
    {
        console.time("View Simplification");
        // already have fewer points
        if (this.numPoints <= chartPtMax) return this.lines;
        var simplifiedLines = [];

        // use line percentages to compute point caps per line
        let lineCaps: Array<number> = [];
        for (let i: number = 0; i < this.linePP.length; i++)
        {
            // round to whole number
            let cap: number = this.linePP[i] * chartPtMax;
            lineCaps.push(parseInt(cap.toString(), 10));
        }

        // simplify each line using corresponding line cap
        for (let i: number = 0, lineCap: number = 0,
            line: Array<Array<number>> = null; i < this.lines.length; i++)
        {
            line = this.lines[i];
            // cap for this line is maximum (computed cap, line pt min)
            lineCap = lineCaps[i] < this.linePtMin ? this.linePtMin : lineCaps[i];

            let simpLine: Array<Array<number>> = null;
            if (lineCap > line.length) simpLine = line;
            else
            {
                simpLine = Simplify.selectTopK(line, lineCap,
                    function (a: Array<number>, b: Array<number>): number
                    {
                        return a[2] - b[2];
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
    public subSlice(boundsViewport, boundsAxis, linePtMin): DataSlice
    {
        return new DataSlice(this.lines, boundsViewport, boundsAxis, linePtMin);
    }

	// return a shallow clone of this data slice
	// this means the returned Data Slice's references the same
	// array of lines, array of prioritized lines, bounds,
	// array of point percentiles, cached lines (if not null), etc.
    public shallowClone(): DataSlice
    {
        let fillerBounds: Bounds = { minX: null, maxX: null, minY: null, maxY: null };
        let clone: DataSlice = new DataSlice([], fillerBounds, fillerBounds, 0);
        let context: DataSlice = this;
        // copy over all properties from this object to <clone>
        Object.getOwnPropertyNames(context).forEach(function(val: string): void
        {
            clone[val] = context[val];
        });
        console.log(clone);
        return clone;
    }

    // returns true if any of the min/max values are null for bounds object
    private static nullBounds(bounds: Bounds): boolean
    {
        if (bounds.minX === null || bounds.maxX === null) return true;
        return bounds.minY === null || bounds.maxY === null;
    }

    /*	
		private static helper function for constructor
		is point <p> contained in <bounds> for x axis?
	*/
    private static pointInBoundsX(p: Array<number>, bounds: Bounds): boolean
    {
        if (DataSlice.nullBounds(bounds)) return true;
        return !(p[0] < bounds.minX || p[0] > bounds.maxX);
    }

	/*	
		private static helper function for constructor
		is point <p> contained in <bounds> for y axis?
	*/
    private static pointInBoundsY(p: Array<number>, bounds: Bounds): boolean
    {
        if (DataSlice.nullBounds(bounds)) return true;
        return !(p[1] < bounds.minY || p[1] > bounds.maxY);
    }

	/*	
		private helper function for constructor
		is point <p> contained in <bounds>?
	*/
    private static pointInBounds(p: Array<number>, bounds: Bounds): boolean
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
    private static hardClipToBounds(line: Array<Array<number>>, bounds: Bounds):
        Array<Array<number>>
    {
        // not all bounds are defined
        if (DataSlice.nullBounds(bounds)) return line;
        if (line.length <= 2) return line;

        // get beginning and ending point (position-wise) inside bounds

        let startIndex: number = -1,
            stopIndex: number = -1;

        // get index of first point in-bounds starting from beginning of line
        for (let i: number = 0; i < line.length; i++)
        {
            // index of first point in bounds
            if (DataSlice.pointInBounds(line[i], bounds))
            {
                startIndex = i;
                break;
            }
        }


        // no point in bounds
        if (startIndex < 0)
        {
            console.log("no points in bounds")
            return [];
        }

        // get index of last point in-bounds starting from end of line
        for (let i: number = line.length - 1; i >= 0; i--)
        {
            if (DataSlice.pointInBounds(line[i], bounds))
            {
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