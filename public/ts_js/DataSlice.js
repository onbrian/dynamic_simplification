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
var DataSlice = (function () {
    function DataSlice(lines, boundsViewport, boundsAxis, linePtMin) {
        this.numPoints = 0;
        this.lines = [];
        this.boundsViewport = boundsViewport;
        this.boundsAxis = boundsAxis;
        this.linePP = [];
        this.linePtMin = linePtMin;
        this.cachedSimpLines = null;
        // copy original lines, clipping to specified bounds if any
        for (var i = 0; i < lines.length; i++) {
            // clone lines whether or not clipping -- safer to keep own copy
            if (DataSlice.nullBounds(boundsViewport))
                this.lines.push(lines[i].slice());
            else
                this.lines.push(DataSlice.hardClipToBounds(lines[i], boundsViewport));
        }
        // set num points
        for (var i = 0; i < this.lines.length; i++)
            this.numPoints += this.lines[i].length;
        // set line point proportion contributions
        for (var i = 0; i < this.lines.length; i++)
            this.linePP.push(this.lines[i].length / this.numPoints);
    }
    DataSlice.prototype.simplifySlice = function (chartPtMax) {
        console.time("View Simplification");
        // already have fewer points
        if (this.numPoints <= chartPtMax)
            return this.lines;
        var simplifiedLines = [];
        // use line percentages to compute point caps per line
        var lineCaps = [];
        for (var i = 0; i < this.linePP.length; i++) {
            // round to whole number
            var cap = this.linePP[i] * chartPtMax;
            lineCaps.push(parseInt(cap.toString(), 10));
        }
        // simplify each line using corresponding line cap
        for (var i = 0, lineCap = 0, line = null; i < this.lines.length; i++) {
            line = this.lines[i];
            // cap for this line is maximum (computed cap, line pt min)
            lineCap = lineCaps[i] < this.linePtMin ? this.linePtMin : lineCaps[i];
            var simpLine = null;
            if (lineCap > line.length)
                simpLine = line;
            else {
                simpLine = Simplify.selectTopK(line, lineCap, function (a, b) {
                    return a[2] - b[2];
                });
            }
            simplifiedLines.push(simpLine);
        }
        console.timeEnd("View Simplification");
        // cache this for zooming out
        this.cachedSimpLines = simplifiedLines;
        return simplifiedLines;
    };
    // "zoom" in on a rectangle defined by bounds object
    DataSlice.prototype.subSlice = function (boundsViewport, boundsAxis, linePtMin) {
        return new DataSlice(this.lines, boundsViewport, boundsAxis, linePtMin);
    };
    // return a shallow clone of this data slice
    // this means the returned Data Slice's references the same
    // array of lines, array of prioritized lines, bounds,
    // array of point percentiles, cached lines (if not null), etc.
    DataSlice.prototype.shallowClone = function () {
        var fillerBounds = { minX: null, maxX: null, minY: null, maxY: null };
        var clone = new DataSlice([], fillerBounds, fillerBounds, 0);
        var context = this;
        // copy over all properties from this object to <clone>
        Object.getOwnPropertyNames(context).forEach(function (val) {
            clone[val] = context[val];
        });
        console.log(clone);
        return clone;
    };
    // returns true if any of the min/max values are null for bounds object
    DataSlice.nullBounds = function (bounds) {
        if (bounds.minX === null || bounds.maxX === null)
            return true;
        return bounds.minY === null || bounds.maxY === null;
    };
    /*
        private static helper function for constructor
        is point <p> contained in <bounds> for x axis?
    */
    DataSlice.pointInBoundsX = function (p, bounds) {
        if (DataSlice.nullBounds(bounds))
            return true;
        return !(p[0] < bounds.minX || p[0] > bounds.maxX);
    };
    /*
        private static helper function for constructor
        is point <p> contained in <bounds> for y axis?
    */
    DataSlice.pointInBoundsY = function (p, bounds) {
        if (DataSlice.nullBounds(bounds))
            return true;
        return !(p[1] < bounds.minY || p[1] > bounds.maxY);
    };
    /*
        private helper function for constructor
        is point <p> contained in <bounds>?
    */
    DataSlice.pointInBounds = function (p, bounds) {
        // all points are in
        if (DataSlice.nullBounds(bounds))
            return true;
        return DataSlice.pointInBoundsX(p, bounds) &&
            DataSlice.pointInBoundsY(p, bounds);
    };
    /*
        private static helper function for constructor
        iterate through line <line> position-wise and find
        first/last index of the points just outside these bounds
        (technically out of bounds) if they exist, otherwise returns
        the first/last indices of the points in bounds.
    */
    DataSlice.hardClipToBounds = function (line, bounds) {
        // not all bounds are defined
        if (DataSlice.nullBounds(bounds))
            return line;
        if (line.length <= 2)
            return line;
        // get beginning and ending point (position-wise) inside bounds
        var startIndex = -1, stopIndex = -1;
        // get index of first point in-bounds starting from beginning of line
        for (var i = 0; i < line.length; i++) {
            // index of first point in bounds
            if (DataSlice.pointInBounds(line[i], bounds)) {
                startIndex = i;
                break;
            }
        }
        // no point in bounds
        if (startIndex < 0) {
            console.log("no points in bounds");
            return [];
        }
        // get index of last point in-bounds starting from end of line
        for (var i = line.length - 1; i >= 0; i--) {
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
    };
    return DataSlice;
}());
export { DataSlice };
