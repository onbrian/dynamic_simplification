/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CanvasHelper; });
/// <reference path="./typings/canvasjs.d.ts" />
var CanvasHelper = (function () {
    function CanvasHelper() {
    }
    ;
    CanvasHelper.segmentToCanvasObject = function (segment) {
        var segmentData = [];
        for (var i = 0; i < segment.length; i++) {
            segmentData.push({ x: segment[i][0], y: segment[i][1] });
        }
        var canvasObject = {
            type: "line",
            click: function (e) {
                console.log(e);
            },
            markerType: "none",
            dataPoints: segmentData
        };
        return canvasObject;
    };
    CanvasHelper.linesToCanvasObjects = function (lines) {
        var segments = [];
        for (var i = 0; i < lines.length; i++) {
            segments.push(CanvasHelper.segmentToCanvasObject(lines[i]));
        }
        return segments;
    };
    CanvasHelper.initEmptyChart = function (elementID, height, width) {
        var chart = new CanvasJS.Chart(elementID, {
            title: "",
            data: null,
            zoomEnabled: true,
            zoomType: "xy",
            legend: {
                horizontalAlign: "right",
                verticalAlign: "center"
            },
            axisY: {
                includeZero: true
            },
            width: width,
            height: height
        });
        return chart;
    };
    return CanvasHelper;
}());



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MathHelper__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__MinHeap__ = __webpack_require__(5);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Simplify; });


var Triangle = (function () {
    function Triangle(i, p, pLeft, pRight) {
        this.i = i;
        this.p = p;
        this.pLeft = pLeft;
        this.pRight = pRight;
        this.area = __WEBPACK_IMPORTED_MODULE_0__MathHelper__["a" /* MathHelper */].triangleArea(pLeft, p, pRight);
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
        triangle.area = __WEBPACK_IMPORTED_MODULE_0__MathHelper__["a" /* MathHelper */].triangleArea(triangle.pLeft, triangle.p, triangle.pRight);
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
        var minHeap = new __WEBPACK_IMPORTED_MODULE_1__MinHeap__["a" /* MinHeap */](function (a, b) {
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



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__DataSlice__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CanvasHelper__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ZoomManager; });
/// <reference path="./typings/canvasjs.d.ts" />


/*
    Zoom Manager Class Implementation
    ----------------------------------------------------------------------------

    ----------------------------------------------------------------------------
    Notes
    ----------------------------------------------------------------------------
    A Zoom Manager associates data to a chart for synergistic zooming and
    simplification to enable efficient viewing of millions of data points.

    After constructing a Zoom Manager with a given chart and dataset, do not use
    the chart's native render function. Instead, render the chart using the
    Zoom Manager's render function, which wraps around the native function.
    
    ----------------------------------------------------------------------------
    Dependencies
    ----------------------------------------------------------------------------
    DataSlice class (./DataSlice.ts)
*/
var ZoomManager = (function () {
    function ZoomManager(chart, chartPtMax, linePtMin, lines, syncCharts) {
        this.chart = chart;
        this.oldViewStack = [];
        this.chartPtMax = chartPtMax;
        this.linePtMin = linePtMin;
        var noBounds = { minX: null, maxX: null, minY: null, maxY: null };
        this.currentSlice = new __WEBPACK_IMPORTED_MODULE_0__DataSlice__["a" /* DataSlice */](lines, noBounds, noBounds, linePtMin);
        this.syncCharts = syncCharts;
        // bind callbacks to zoom
        var context = this;
        // added range change event/ range change axis data interfaces 
        // and changed chart options interface
        // in typings (e3 typings is missing this information)
        this.chart.options.rangeChanged = function (e) {
            switch (e.trigger) {
                // user zoomed into a section
                case "zoom":
                    console.log(e);
                    context.zoomInHandler(e);
                    break;
                // user reset zoom level
                case "reset":
                    console.log(e);
                    context.zoomOutHandler(e);
                    break;
                default:
                    break;
            }
        };
    }
    ZoomManager.prototype.zoomInHandler = function (e) {
        var axisX = e.axisX[0], axisY = e.axisY[0], userBounds = {
            minX: axisX.viewportMinimum,
            maxX: axisX.viewportMaximum,
            minY: axisY.viewportMinimum,
            maxY: axisY.viewportMaximum
        };
        this.oldViewStack.push(this.currentSlice);
        // already below point threshold
        // panning restriction/simplification are unnecessary
        // simply mimic native CanvasJS zooming
        if (this.currentSlice.numPoints <= this.chartPtMax) {
            this.currentSlice = this.currentSlice.shallowClone();
            this.currentSlice.boundsViewport = userBounds;
        }
        else {
            console.time("Subslice (Zoom)");
            this.currentSlice = this.currentSlice.subSlice(userBounds, userBounds, this.linePtMin);
            console.timeEnd("Subslice (Zoom)");
        }
        this.renderDataSlice(this.currentSlice);
    };
    ZoomManager.prototype.zoomOutHandler = function (e) {
        if (this.oldViewStack.length === 0) {
            alert("already at base view");
            return;
        }
        this.renderDataSlice(this.currentSlice = this.oldViewStack.pop());
    };
    /*
        private static helper method
        set a chart's x and y axis viewports to given limits
        --> setting axis min/max means no panning
    */
    ZoomManager.setChartBounds = function (chart, dataslice) {
        var boundsViewport = dataslice.boundsViewport, boundsAxis = dataslice.boundsAxis;
        chart.options.axisX = {
            viewportMinimum: boundsViewport.minX,
            viewportMaximum: boundsViewport.maxX,
            minimum: boundsAxis.minX,
            maximum: boundsAxis.maxX
        };
        chart.options.axisY = {
            viewportMinimum: boundsViewport.minY,
            viewportMaximum: boundsViewport.maxY,
            minimum: boundsAxis.minY,
            maximum: boundsAxis.maxY
        };
        //chart.options.axisX.minimum = boundsAxis.minX;
        //chart.options.axisX.maximum = boundsAxis.maxX;
        //chart.options.axisY.minimum = boundsAxis.minY;
        //chart.options.axisY.maximum = boundsAxis.maxY;
        return;
    };
    ZoomManager.prototype.renderDataSlice = function (dataslice) {
        // simplify data and update to chart
        console.log("-----------------------");
        console.log("Rendering New DataView");
        console.log("-----------------------");
        console.log("Pre-simplified Point Count: " + dataslice.numPoints);
        // check for cached simplified lines by default
        // and use those if they exist
        var data = dataslice.cachedSimpLines !== null ?
            dataslice.cachedSimpLines : dataslice.simplifySlice(this.chartPtMax);
        var count = 0;
        for (var i = 0; i < data.length; i++)
            count += data[i].length;
        console.log("Post-simplified Point Count: " + count);
        var percent = parseFloat((count / dataslice.numPoints).toFixed(2));
        console.log("Percentage of actual points in viewport displayed: " +
            percent * 100 + "%");
        console.log(data);
        console.log('\n');
        this.chart.options.data = __WEBPACK_IMPORTED_MODULE_1__CanvasHelper__["a" /* CanvasHelper */].linesToCanvasObjects(data);
        // update chart bounds
        // set bounds -- two cases
        // 1) null bounds values (no bounds), aka base view
        // per CanvasJS docs, reset/pan buttons don't appear
        // and viewport automatically sizes min/max x and y points
        // 2) defined rectangle bounds for zoomed in view
        // this latter case causes reset/pan buttons to appear
        ZoomManager.setChartBounds(this.chart, dataslice);
        this.chart.render();
        // any sync charts
        for (var i = 0, chart = null; i < this.syncCharts.length; i++) {
            ZoomManager.setChartBounds(this.syncCharts[i], dataslice);
            this.syncCharts[i].render();
        }
    };
    ZoomManager.prototype.render = function () {
        this.renderDataSlice(this.currentSlice);
    };
    return ZoomManager;
}());



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Simplify__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataSlice; });
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
                simpLine = __WEBPACK_IMPORTED_MODULE_0__Simplify__["a" /* Simplify */].selectTopK(line, lineCap, function (a, b) {
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



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MathHelper; });
var MathHelper = (function () {
    function MathHelper() {
    }
    /*
        Get the intersection between vertical line x=<x>
        and the line defined by points <a> & <b>
    */
    MathHelper.intersectX = function (a, b, x) {
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
        return [x, (x - a[MathHelper.AXIS_X])
                * (b[MathHelper.AXIS_Y] - a[MathHelper.AXIS_Y]) /
                (b[MathHelper.AXIS_X] - a[MathHelper.AXIS_X]) + a[MathHelper.AXIS_Y]];
    };
    /*
        Get the intersection between horizontal line y=<y>
        and the line defined by points <a> & <b>
    */
    MathHelper.intersectY = function (a, b, y) {
        return [(y - a[MathHelper.AXIS_Y])
                * (b[MathHelper.AXIS_X] - a[MathHelper.AXIS_X]) /
                (b[MathHelper.AXIS_Y] - a[MathHelper.AXIS_Y]) + a[MathHelper.AXIS_X], y];
    };
    MathHelper.triangleArea = function (a, b, c) {
        return Math.abs((a[0] - c[0]) *
            (b[1] - a[1]) - (a[0] - b[0]) *
            (c[1] - a[1]));
    };
    MathHelper.getSqSegDist = function (p, a, b) {
        var x = a[0], y = a[1], bx = b[0], by = b[1], px = p[0], py = p[1], dx = bx - x, // horizontal distance between <a> and <b>
        dy = by - y; // vertical distance between <a> and <b>
        // check up on this later
        if (dx !== 0 || dy !== 0) {
            var t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
            if (t > 1) {
                x = bx;
                y = by;
            }
            else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }
        dx = px - x;
        dy = py - y;
        return dx * dx + dy * dy;
    };
    return MathHelper;
}());

MathHelper.AXIS_X = 0;
MathHelper.AXIS_Y = 1;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MinHeap; });
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



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CanvasHelper__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Simplify__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ZoomManager__ = __webpack_require__(2);



// semi-randomly generate <numLines> lines, each with <limit> points
function generatePoints(numLines, limit) {
    var data = [];
    var y = 0;
    for (var i = 0; i < numLines; i++) {
        //var dataSeries = { type: "line" };
        var dataPoints = [];
        for (var j = 0; j < limit; j += 1) {
            y += (Math.random() * 10 - 5);
            // [x, y, priority, "workspace" 0, index]
            dataPoints.push([j - limit / 2, y, 0, 0, j]);
        }
        //dataSeries.dataPoints = dataPoints;
        data.push(dataPoints);
    }
    return data;
}
function getSimplifiedData(rawData, k) {
    var simpData = [];
    function comparator(a, b) {
        return a[2] - b[2];
    }
    for (var i = 0; i < rawData.length; i++) {
        simpData.push(__WEBPACK_IMPORTED_MODULE_1__Simplify__["a" /* Simplify */].selectTopK(rawData[i], k, comparator));
    }
    return simpData;
}
function ArraysAsString(list) {
    var linesArrayString = [];
    for (var i = 0; i < list.length; i++) {
        var line = list[i];
        var lineArrayString = [];
        for (var j = 0; j < line.length; j++) {
            lineArrayString.push("[" + line[j].toString() + "]");
        }
        linesArrayString.push("[" + lineArrayString.join(',') + "]");
    }
    return "[" + linesArrayString.join(',') + "]";
}
// 200, 10000
var numLines = 10;
var limit = 10000; //increase number of dataPoints by increasing this
console.log("Number of Lines: " + numLines);
console.log("Points per line: " + limit);
var rawData = generatePoints(numLines, limit);
// let rawData = [[[-500, -2.0698050446227167, 0, 0, 0], [-499, -0.46897537791573285, 0, 0, 1], [-498, 0.7090380224120807, 0, 0, 2], [-497, 5.4263427144795084, 0, 0, 3], [-496, 0.5653067060590473, 0, 0, 4], [-495, -0.1611623176422876, 0, 0, 5], [-494, -2.5914352787464905, 0, 0, 6], [-493, -2.870710620330164, 0, 0, 7], [-492, -2.4041211548093466, 0, 0, 8], [-491, -4.163293518548916, 0, 0, 9], [-490, -5.001785263872693, 0, 0, 10], [-489, -3.3718162738681157, 0, 0, 11], [-488, -0.7980394537165898, 0, 0, 12], [-487, -0.5542033025306337, 0, 0, 13], [-486, 1.6974825863129084, 0, 0, 14], [-485, 2.165283928948252, 0, 0, 15], [-484, -0.7524464320386954, 0, 0, 16], [-483, -4.192942760773641, 0, 0, 17], [-482, -5.600697727535987, 0, 0, 18], [-481, -6.463832849516628, 0, 0, 19], [-480, -7.577705640667169, 0, 0, 20], [-479, -7.750654906762741, 0, 0, 21], [-478, -12.167689259979399, 0, 0, 22], [-477, -8.758452319816698, 0, 0, 23], [-476, -12.348791280124306, 0, 0, 24], [-475, -15.080903797263492, 0, 0, 25], [-474, -12.737949320537481, 0, 0, 26], [-473, -14.249029742340452, 0, 0, 27], [-472, -15.820347666781956, 0, 0, 28], [-471, -14.664126192603076, 0, 0, 29], [-470, -18.805612263455657, 0, 0, 30], [-469, -22.80260600567885, 0, 0, 31], [-468, -20.777170075481465, 0, 0, 32], [-467, -22.941622248595408, 0, 0, 33], [-466, -20.50080100391866, 0, 0, 34], [-465, -17.89917244585039, 0, 0, 35], [-464, -16.125383712647462, 0, 0, 36], [-463, -18.541237046093816, 0, 0, 37], [-462, -15.62796070064113, 0, 0, 38], [-461, -11.146609726093613, 0, 0, 39], [-460, -9.825640220121116, 0, 0, 40], [-459, -13.95689852092181, 0, 0, 41], [-458, -11.224546288906247, 0, 0, 42], [-457, -6.281330985778146, 0, 0, 43], [-456, -6.3889165143552695, 0, 0, 44], [-455, -4.427588929344253, 0, 0, 45], [-454, -0.05055969141908179, 0, 0, 46], [-453, 2.997401970770836, 0, 0, 47], [-452, 0.8967770589798914, 0, 0, 48], [-451, -0.46038895085133635, 0, 0, 49], [-450, 0.5988911254422637, 0, 0, 50], [-449, 1.067361925401717, 0, 0, 51], [-448, -0.04084290638429344, 0, 0, 52], [-447, -4.478817950902776, 0, 0, 53], [-446, -1.8347927117638907, 0, 0, 54], [-445, -5.838401490716865, 0, 0, 55], [-444, -5.720208075581923, 0, 0, 56], [-443, -3.453038338289381, 0, 0, 57], [-442, 0.32870329358523254, 0, 0, 58], [-441, -3.6554308582851895, 0, 0, 59], [-440, 1.0414876193004048, 0, 0, 60], [-439, 1.1689373283688704, 0, 0, 61], [-438, 3.0338586703011634, 0, 0, 62], [-437, 6.696733121263303, 0, 0, 63], [-436, 10.58389088507386, 0, 0, 64], [-435, 10.469022544528302, 0, 0, 65], [-434, 9.705915198404043, 0, 0, 66], [-433, 7.164123771875994, 0, 0, 67], [-432, 4.883350264248452, 0, 0, 68], [-431, 6.84849371945905, 0, 0, 69], [-430, 5.9930335723345785, 0, 0, 70], [-429, 5.269730215685491, 0, 0, 71], [-428, 7.17908177123761, 0, 0, 72], [-427, 7.2197264499272125, 0, 0, 73], [-426, 6.741127820170685, 0, 0, 74], [-425, 3.424285847997184, 0, 0, 75], [-424, 3.781625607474046, 0, 0, 76], [-423, 6.392935640325373, 0, 0, 77], [-422, 6.309297493180974, 0, 0, 78], [-421, 7.4878662111508865, 0, 0, 79], [-420, 5.117501686383006, 0, 0, 80], [-419, 1.3183368583614556, 0, 0, 81], [-418, 0.6295303139281665, 0, 0, 82], [-417, 3.1826042851003904, 0, 0, 83], [-416, 4.566990326956189, 0, 0, 84], [-415, 6.58464800234109, 0, 0, 85], [-414, 11.276799070541593, 0, 0, 86], [-413, 7.504666799471036, 0, 0, 87], [-412, 10.124621326671978, 0, 0, 88], [-411, 13.225943159809363, 0, 0, 89], [-410, 13.460414157450359, 0, 0, 90], [-409, 12.906286103310135, 0, 0, 91], [-408, 8.788395119146722, 0, 0, 92], [-407, 10.857239631780523, 0, 0, 93], [-406, 10.967659200549548, 0, 0, 94], [-405, 6.044069752391637, 0, 0, 95], [-404, 8.706196482391302, 0, 0, 96], [-403, 9.049986261464536, 0, 0, 97], [-402, 10.110859789648686, 0, 0, 98], [-401, 7.1651757616379435, 0, 0, 99], [-400, 10.055247863923636, 0, 0, 100], [-399, 8.63946204265985, 0, 0, 101], [-398, 7.397147435093527, 0, 0, 102], [-397, 6.4284200745937605, 0, 0, 103], [-396, 9.434285027576767, 0, 0, 104], [-395, 11.209075149455007, 0, 0, 105], [-394, 10.185352090777293, 0, 0, 106], [-393, 9.747710048671133, 0, 0, 107], [-392, 4.92168403684509, 0, 0, 108], [-391, -0.002467326960998939, 0, 0, 109], [-390, -0.5217220840649146, 0, 0, 110], [-389, 0.48776596322013965, 0, 0, 111], [-388, 3.2302801290800485, 0, 0, 112], [-387, 3.790081773143511, 0, 0, 113], [-386, 6.666277705261044, 0, 0, 114], [-385, 9.497620471035095, 0, 0, 115], [-384, 5.589158424963339, 0, 0, 116], [-383, 6.228144376116216, 0, 0, 117], [-382, 4.114075757603857, 0, 0, 118], [-381, 4.468016541575135, 0, 0, 119], [-380, 8.919664805994461, 0, 0, 120], [-379, 7.1736530664701945, 0, 0, 121], [-378, 5.868870550988251, 0, 0, 122], [-377, 10.821018136639402, 0, 0, 123], [-376, 14.875761789463398, 0, 0, 124], [-375, 16.986887847472268, 0, 0, 125], [-374, 20.419558749008615, 0, 0, 126], [-373, 18.994475900403355, 0, 0, 127], [-372, 18.076690580617072, 0, 0, 128], [-371, 15.336589404929516, 0, 0, 129], [-370, 12.26201535385855, 0, 0, 130], [-369, 15.956730655415017, 0, 0, 131], [-368, 18.95162399349281, 0, 0, 132], [-367, 18.442455474987216, 0, 0, 133], [-366, 14.48648493045674, 0, 0, 134], [-365, 14.658777936268297, 0, 0, 135], [-364, 11.943209585687072, 0, 0, 136], [-363, 8.932130125407841, 0, 0, 137], [-362, 11.549639089532885, 0, 0, 138], [-361, 11.82092242665559, 0, 0, 139], [-360, 7.746284039447101, 0, 0, 140], [-359, 3.5381548524202975, 0, 0, 141], [-358, 4.707103998342984, 0, 0, 142], [-357, 2.3406562946357914, 0, 0, 143], [-356, 0.611840029843377, 0, 0, 144], [-355, -1.8786242131692963, 0, 0, 145], [-354, 2.758508639214502, 0, 0, 146], [-353, 3.4770511333421648, 0, 0, 147], [-352, 7.430459607442764, 0, 0, 148], [-351, 5.747567755506102, 0, 0, 149], [-350, 7.857834873635365, 0, 0, 150], [-349, 7.494079540286318, 0, 0, 151], [-348, 12.447199078901608, 0, 0, 152], [-347, 9.791870907375154, 0, 0, 153], [-346, 12.1773232751477, 0, 0, 154], [-345, 8.524957928532327, 0, 0, 155], [-344, 10.671256142272977, 0, 0, 156], [-343, 11.709865874959323, 0, 0, 157], [-342, 9.303886713973125, 0, 0, 158], [-341, 8.012901130232816, 0, 0, 159], [-340, 4.3522938121879005, 0, 0, 160], [-339, 3.6182812163404785, 0, 0, 161], [-338, 3.355042752568785, 0, 0, 162], [-337, -0.6419636023594935, 0, 0, 163], [-336, -1.3356790755505834, 0, 0, 164], [-335, -6.169531653091271, 0, 0, 165], [-334, -5.865075805347416, 0, 0, 166], [-333, -5.592538339768533, 0, 0, 167], [-332, -4.623154242507692, 0, 0, 168], [-331, -5.172104258062786, 0, 0, 169], [-330, -2.8287749381501364, 0, 0, 170], [-329, -6.062842936409394, 0, 0, 171], [-328, -8.680055718315066, 0, 0, 172], [-327, -6.4347289039481215, 0, 0, 173], [-326, -6.428130682303166, 0, 0, 174], [-325, -9.529506267873991, 0, 0, 175], [-324, -8.657093241096293, 0, 0, 176], [-323, -13.347958994441022, 0, 0, 177], [-322, -16.34821214342776, 0, 0, 178], [-321, -14.4530366026104, 0, 0, 179], [-320, -11.798552427543605, 0, 0, 180], [-319, -10.487556118179837, 0, 0, 181], [-318, -11.705801776921923, 0, 0, 182], [-317, -15.186169027824626, 0, 0, 183], [-316, -17.749560383316346, 0, 0, 184], [-315, -20.002338503316434, 0, 0, 185], [-314, -22.638823147731838, 0, 0, 186], [-313, -22.287486038368808, 0, 0, 187], [-312, -21.916405160472866, 0, 0, 188], [-311, -23.132470608778544, 0, 0, 189], [-310, -22.524315721861328, 0, 0, 190], [-309, -22.15084532742852, 0, 0, 191], [-308, -17.58364509912716, 0, 0, 192], [-307, -15.559624119709433, 0, 0, 193], [-306, -16.720047118074625, 0, 0, 194], [-305, -21.677381293505313, 0, 0, 195], [-304, -17.256152326215656, 0, 0, 196], [-303, -18.600141295657107, 0, 0, 197], [-302, -15.541237935747994, 0, 0, 198], [-301, -10.663789228920272, 0, 0, 199], [-300, -15.219843883809268, 0, 0, 200], [-299, -15.799580550249333, 0, 0, 201], [-298, -18.703186473483854, 0, 0, 202], [-297, -20.32496635447355, 0, 0, 203], [-296, -21.541245919464913, 0, 0, 204], [-295, -25.482757228428547, 0, 0, 205], [-294, -27.784329184914817, 0, 0, 206], [-293, -26.339138829519726, 0, 0, 207], [-292, -27.183629390775504, 0, 0, 208], [-291, -27.99688277421568, 0, 0, 209], [-290, -26.17956617069026, 0, 0, 210], [-289, -28.740315991091798, 0, 0, 211], [-288, -25.14411289926455, 0, 0, 212], [-287, -21.58350072449992, 0, 0, 213], [-286, -25.512769936681032, 0, 0, 214], [-285, -27.08447278357197, 0, 0, 215], [-284, -27.39349429679381, 0, 0, 216], [-283, -26.814158093966903, 0, 0, 217], [-282, -29.644024643441057, 0, 0, 218], [-281, -25.080588972518676, 0, 0, 219], [-280, -25.482553991828585, 0, 0, 220], [-279, -25.205745421936093, 0, 0, 221], [-278, -23.442041466771137, 0, 0, 222], [-277, -19.62101087527428, 0, 0, 223], [-276, -19.59824557210399, 0, 0, 224], [-275, -15.475323484202228, 0, 0, 225], [-274, -11.339878725853659, 0, 0, 226], [-273, -8.044901837529395, 0, 0, 227], [-272, -5.038454449280694, 0, 0, 228], [-271, -0.9830212577835855, 0, 0, 229], [-270, 2.2596933926911493, 0, 0, 230], [-269, 6.7388848127233025, 0, 0, 231], [-268, 11.110545847035624, 0, 0, 232], [-267, 8.890053161374889, 0, 0, 233], [-266, 7.284984723972771, 0, 0, 234], [-265, 3.0049122504135646, 0, 0, 235], [-264, 1.066166880351211, 0, 0, 236], [-263, 4.948270836363239, 0, 0, 237], [-262, 8.138860650086386, 0, 0, 238], [-261, 4.984484758269869, 0, 0, 239], [-260, 2.8174254984526215, 0, 0, 240], [-259, 7.719936012150672, 0, 0, 241], [-258, 3.876757927840293, 0, 0, 242], [-257, 8.522776528343579, 0, 0, 243], [-256, 11.821205887917177, 0, 0, 244], [-255, 8.7723683044285, 0, 0, 245], [-254, 9.786271074939117, 0, 0, 246], [-253, 5.266355218534689, 0, 0, 247], [-252, 1.8056948662958177, 0, 0, 248], [-251, -0.22714871470199638, 0, 0, 249], [-250, -4.0430357258425165, 0, 0, 250], [-249, -0.6238046879646095, 0, 0, 251], [-248, -2.6574228835741263, 0, 0, 252], [-247, -2.034324412016236, 0, 0, 253], [-246, -4.778158650907381, 0, 0, 254], [-245, -4.960117697214697, 0, 0, 255], [-244, -9.701184196488933, 0, 0, 256], [-243, -6.343862539381954, 0, 0, 257], [-242, -9.553198509469468, 0, 0, 258], [-241, -13.961964846892013, 0, 0, 259], [-240, -16.24694300545675, 0, 0, 260], [-239, -14.020283321110224, 0, 0, 261], [-238, -11.835634500280666, 0, 0, 262], [-237, -16.316956021200415, 0, 0, 263], [-236, -12.254014309028282, 0, 0, 264], [-235, -9.821179378336385, 0, 0, 265], [-234, -6.17320594222182, 0, 0, 266], [-233, -1.2731482090402864, 0, 0, 267], [-232, -2.086562490752601, 0, 0, 268], [-231, 1.0233594498955378, 0, 0, 269], [-230, -2.757675177198049, 0, 0, 270], [-229, -1.3519205663356608, 0, 0, 271], [-228, 1.6493642966490256, 0, 0, 272], [-227, -0.19294816630225986, 0, 0, 273], [-226, 4.734142725279648, 0, 0, 274], [-225, 0.35802764924126773, 0, 0, 275], [-224, 4.4359078917676475, 0, 0, 276], [-223, 0.3848373558085072, 0, 0, 277], [-222, -1.1094054600959247, 0, 0, 278], [-221, -5.33482290019482, 0, 0, 279], [-220, -10.016180842746685, 0, 0, 280], [-219, -12.7208814664007, 0, 0, 281], [-218, -14.431962288493889, 0, 0, 282], [-217, -17.5536173172915, 0, 0, 283], [-216, -16.78707562713533, 0, 0, 284], [-215, -13.516225833021725, 0, 0, 285], [-214, -11.414021637476079, 0, 0, 286], [-213, -15.080211220845495, 0, 0, 287], [-212, -16.985149578204307, 0, 0, 288], [-211, -18.06866703949269, 0, 0, 289], [-210, -15.18880631693403, 0, 0, 290], [-209, -19.674654549321254, 0, 0, 291], [-208, -21.635219447277102, 0, 0, 292], [-207, -22.099498916119103, 0, 0, 293], [-206, -27.098958788370652, 0, 0, 294], [-205, -27.258206830424868, 0, 0, 295], [-204, -25.571305004531908, 0, 0, 296], [-203, -26.85326389674159, 0, 0, 297], [-202, -25.259026751735966, 0, 0, 298], [-201, -28.466926840104236, 0, 0, 299], [-200, -31.058756648795327, 0, 0, 300], [-199, -33.88833799172122, 0, 0, 301], [-198, -30.655082462272848, 0, 0, 302], [-197, -30.263929806537558, 0, 0, 303], [-196, -32.16026187852085, 0, 0, 304], [-195, -34.82639145700241, 0, 0, 305], [-194, -38.65957173443957, 0, 0, 306], [-193, -37.52249302323145, 0, 0, 307], [-192, -40.89999545883277, 0, 0, 308], [-191, -41.07014249496002, 0, 0, 309], [-190, -42.68517559984869, 0, 0, 310], [-189, -43.645188689883184, 0, 0, 311], [-188, -44.66809999361447, 0, 0, 312], [-187, -41.35256373684369, 0, 0, 313], [-186, -42.861054813060804, 0, 0, 314], [-185, -39.499760314138214, 0, 0, 315], [-184, -39.46465558864021, 0, 0, 316], [-183, -41.64096618121427, 0, 0, 317], [-182, -45.358550688203046, 0, 0, 318], [-181, -42.425568182450306, 0, 0, 319], [-180, -39.85169886922125, 0, 0, 320], [-179, -39.53388281577732, 0, 0, 321], [-178, -41.02816717214386, 0, 0, 322], [-177, -38.85843544347589, 0, 0, 323], [-176, -39.36352540063657, 0, 0, 324], [-175, -36.19443608773483, 0, 0, 325], [-174, -33.04879811204065, 0, 0, 326], [-173, -30.3000348997544, 0, 0, 327], [-172, -32.82752080261108, 0, 0, 328], [-171, -29.358502915256857, 0, 0, 329], [-170, -27.518771029391193, 0, 0, 330], [-169, -28.236174149042153, 0, 0, 331], [-168, -27.499030616635306, 0, 0, 332], [-167, -27.359303445086475, 0, 0, 333], [-166, -30.18051080343694, 0, 0, 334], [-165, -32.58403659103843, 0, 0, 335], [-164, -36.18111271996213, 0, 0, 336], [-163, -34.26704625507903, 0, 0, 337], [-162, -33.51835934581858, 0, 0, 338], [-161, -32.74368323054676, 0, 0, 339], [-160, -29.43599582674117, 0, 0, 340], [-159, -33.19990979583613, 0, 0, 341], [-158, -31.452805421295885, 0, 0, 342], [-157, -28.25233846915708, 0, 0, 343], [-156, -28.39203114749265, 0, 0, 344], [-155, -31.51296697813246, 0, 0, 345], [-154, -33.49832584622764, 0, 0, 346], [-153, -36.8929046020435, 0, 0, 347], [-152, -37.99477676170356, 0, 0, 348], [-151, -34.01750474062811, 0, 0, 349], [-150, -33.12404786350177, 0, 0, 350], [-149, -31.43570690640739, 0, 0, 351], [-148, -34.789386006145165, 0, 0, 352], [-147, -38.722218951187386, 0, 0, 353], [-146, -40.48525712201154, 0, 0, 354], [-145, -40.91847347635855, 0, 0, 355], [-144, -36.940548588380565, 0, 0, 356], [-143, -39.830316752889814, 0, 0, 357], [-142, -39.89292342188789, 0, 0, 358], [-141, -40.5498680753731, 0, 0, 359], [-140, -40.7290878044969, 0, 0, 360], [-139, -38.237622812432704, 0, 0, 361], [-138, -40.117547432663564, 0, 0, 362], [-137, -36.052104867831105, 0, 0, 363], [-136, -40.38482911338929, 0, 0, 364], [-135, -38.18517624241855, 0, 0, 365], [-134, -37.83277316707926, 0, 0, 366], [-133, -39.548394520514336, 0, 0, 367], [-132, -37.79146939408806, 0, 0, 368], [-131, -42.20359924995963, 0, 0, 369], [-130, -43.99623971926946, 0, 0, 370], [-129, -47.78505753586928, 0, 0, 371], [-128, -51.41939688527843, 0, 0, 372], [-127, -54.14796782996887, 0, 0, 373], [-126, -54.58955225841219, 0, 0, 374], [-125, -57.559917568548556, 0, 0, 375], [-124, -54.227601467771294, 0, 0, 376], [-123, -54.26989408703228, 0, 0, 377], [-122, -54.90038815199517, 0, 0, 378], [-121, -51.72318622103069, 0, 0, 379], [-120, -50.165408403011014, 0, 0, 380], [-119, -51.97466028478124, 0, 0, 381], [-118, -51.802735353545586, 0, 0, 382], [-117, -53.26182142031178, 0, 0, 383], [-116, -56.626625397254735, 0, 0, 384], [-115, -56.61196406949341, 0, 0, 385], [-114, -54.43736892391814, 0, 0, 386], [-113, -51.92073503538527, 0, 0, 387], [-112, -52.65821242621681, 0, 0, 388], [-111, -47.673706832197205, 0, 0, 389], [-110, -42.72113593336314, 0, 0, 390], [-109, -44.11650850387055, 0, 0, 391], [-108, -44.859699386367964, 0, 0, 392], [-107, -47.410519426619004, 0, 0, 393], [-106, -50.89882024285455, 0, 0, 394], [-105, -55.76657589589357, 0, 0, 395], [-104, -57.421123934100514, 0, 0, 396], [-103, -54.285003550835455, 0, 0, 397], [-102, -54.458214661585416, 0, 0, 398], [-101, -50.04329651592088, 0, 0, 399], [-100, -52.92587641300488, 0, 0, 400], [-99, -52.03271416642431, 0, 0, 401], [-98, -49.59639384693962, 0, 0, 402], [-97, -52.554747675030356, 0, 0, 403], [-96, -53.88970078053768, 0, 0, 404], [-95, -49.2917180921907, 0, 0, 405], [-94, -51.728648753224135, 0, 0, 406], [-93, -53.21622519161879, 0, 0, 407], [-92, -54.80028805137387, 0, 0, 408], [-91, -50.71921311773985, 0, 0, 409], [-90, -47.839654647527084, 0, 0, 410], [-89, -51.90321536209032, 0, 0, 411], [-88, -54.06554319071823, 0, 0, 412], [-87, -54.19797007921601, 0, 0, 413], [-86, -57.807665443510615, 0, 0, 414], [-85, -57.113774273825285, 0, 0, 415], [-84, -59.148625673276456, 0, 0, 416], [-83, -60.86865347511858, 0, 0, 417], [-82, -64.15891735206162, 0, 0, 418], [-81, -62.921101846640575, 0, 0, 419], [-80, -61.97085464053451, 0, 0, 420], [-79, -57.4358509147457, 0, 0, 421], [-78, -58.0481543136139, 0, 0, 422], [-77, -60.099128266853114, 0, 0, 423], [-76, -55.18479043747581, 0, 0, 424], [-75, -55.10917457381708, 0, 0, 425], [-74, -57.176744954810815, 0, 0, 426], [-73, -53.63994429040334, 0, 0, 427], [-72, -56.330827371357, 0, 0, 428], [-71, -60.23312589020918, 0, 0, 429], [-70, -64.80880677403387, 0, 0, 430], [-69, -60.91473510782295, 0, 0, 431], [-68, -65.50630760589166, 0, 0, 432], [-67, -68.70726210159252, 0, 0, 433], [-66, -68.11744774630641, 0, 0, 434], [-65, -71.05532335043384, 0, 0, 435], [-64, -67.40822642602677, 0, 0, 436], [-63, -67.60607950081976, 0, 0, 437], [-62, -62.97643192463245, 0, 0, 438], [-61, -63.26770671994434, 0, 0, 439], [-60, -61.44145651967693, 0, 0, 440], [-59, -56.680415445119024, 0, 0, 441], [-58, -53.20994755016931, 0, 0, 442], [-57, -49.982048497434256, 0, 0, 443], [-56, -48.70807001824936, 0, 0, 444], [-55, -50.844843459193264, 0, 0, 445], [-54, -48.95049709674217, 0, 0, 446], [-53, -49.75929398094133, 0, 0, 447], [-52, -51.65397624149147, 0, 0, 448], [-51, -56.572099594436175, 0, 0, 449], [-50, -58.475662925835316, 0, 0, 450], [-49, -57.13479498736612, 0, 0, 451], [-48, -61.41922602867325, 0, 0, 452], [-47, -57.55785186401312, 0, 0, 453], [-46, -56.682993712681515, 0, 0, 454], [-45, -60.620627473239196, 0, 0, 455], [-44, -61.72198555886883, 0, 0, 456], [-43, -66.46400561694777, 0, 0, 457], [-42, -62.798715423720644, 0, 0, 458], [-41, -61.91903044550105, 0, 0, 459], [-40, -65.12548084920034, 0, 0, 460], [-39, -61.98217786559085, 0, 0, 461], [-38, -60.231174615253806, 0, 0, 462], [-37, -58.431444728180416, 0, 0, 463], [-36, -60.11402744501382, 0, 0, 464], [-35, -56.18588674777928, 0, 0, 465], [-34, -54.265967315935995, 0, 0, 466], [-33, -58.32016181759735, 0, 0, 467], [-32, -53.726710296110625, 0, 0, 468], [-31, -50.88546426847154, 0, 0, 469], [-30, -51.699331324260825, 0, 0, 470], [-29, -52.77215264981135, 0, 0, 471], [-28, -55.86579377199044, 0, 0, 472], [-27, -59.52895734826248, 0, 0, 473], [-26, -54.93746110213688, 0, 0, 474], [-25, -56.83886047936846, 0, 0, 475], [-24, -59.09098862695542, 0, 0, 476], [-23, -56.35849749316728, 0, 0, 477], [-22, -58.04651689269979, 0, 0, 478], [-21, -55.64158486377826, 0, 0, 479], [-20, -57.71743629546555, 0, 0, 480], [-19, -54.3230817003415, 0, 0, 481], [-18, -50.02901724398114, 0, 0, 482], [-17, -53.11277812243474, 0, 0, 483], [-16, -50.25632169167805, 0, 0, 484], [-15, -54.218910598769924, 0, 0, 485], [-14, -54.778642152439616, 0, 0, 486], [-13, -56.74066607727614, 0, 0, 487], [-12, -60.843456096913734, 0, 0, 488], [-11, -57.850039292133275, 0, 0, 489], [-10, -54.355824758178755, 0, 0, 490], [-9, -49.530882486340076, 0, 0, 491], [-8, -49.631515817576926, 0, 0, 492], [-7, -45.463854617338555, 0, 0, 493], [-6, -42.54959174157264, 0, 0, 494], [-5, -45.97911739452862, 0, 0, 495], [-4, -42.31969187329522, 0, 0, 496], [-3, -46.55440471230232, 0, 0, 497], [-2, -50.8000842355597, 0, 0, 498], [-1, -49.61585723078085, 0, 0, 499], [0, -51.279416995505585, 0, 0, 500], [1, -47.73468030405952, 0, 0, 501], [2, -52.6254112707026, 0, 0, 502], [3, -51.29728329563462, 0, 0, 503], [4, -48.08984458377161, 0, 0, 504], [5, -44.906839265153195, 0, 0, 505], [6, -46.458212119434464, 0, 0, 506], [7, -43.943109184821004, 0, 0, 507], [8, -41.138766258897945, 0, 0, 508], [9, -42.59667997767533, 0, 0, 509], [10, -43.70095157679097, 0, 0, 510], [11, -44.43582990484084, 0, 0, 511], [12, -49.4277653873261, 0, 0, 512], [13, -45.053704011741814, 0, 0, 513], [14, -48.68428733940728, 0, 0, 514], [15, -47.88834551269325, 0, 0, 515], [16, -44.5559027078059, 0, 0, 516], [17, -44.136751717249275, 0, 0, 517], [18, -48.8000977659753, 0, 0, 518], [19, -49.71164928026592, 0, 0, 519], [20, -48.61318781578338, 0, 0, 520], [21, -51.61048487902565, 0, 0, 521], [22, -54.519660790730235, 0, 0, 522], [23, -58.10111564326885, 0, 0, 523], [24, -55.548464525507704, 0, 0, 524], [25, -53.276057860947596, 0, 0, 525], [26, -54.654945620851294, 0, 0, 526], [27, -51.88837444839729, 0, 0, 527], [28, -47.73915029167416, 0, 0, 528], [29, -44.56323327675307, 0, 0, 529], [30, -41.866844467390735, 0, 0, 530], [31, -38.43189210156244, 0, 0, 531], [32, -34.94135839356359, 0, 0, 532], [33, -33.85054438377668, 0, 0, 533], [34, -33.43094113896188, 0, 0, 534], [35, -37.36861509135518, 0, 0, 535], [36, -36.97473926096673, 0, 0, 536], [37, -39.41985243328775, 0, 0, 537], [38, -35.70614432407695, 0, 0, 538], [39, -33.113941475430394, 0, 0, 539], [40, -36.661871914520376, 0, 0, 540], [41, -40.88920447648893, 0, 0, 541], [42, -40.899446730642744, 0, 0, 542], [43, -37.08592660994218, 0, 0, 543], [44, -38.12646993939204, 0, 0, 544], [45, -35.297962783287865, 0, 0, 545], [46, -32.05835652583525, 0, 0, 546], [47, -30.101924707391866, 0, 0, 547], [48, -30.430411078037395, 0, 0, 548], [49, -32.978967875828694, 0, 0, 549], [50, -37.345445332970804, 0, 0, 550], [51, -42.240889614748255, 0, 0, 551], [52, -37.339197967608285, 0, 0, 552], [53, -33.049479122848616, 0, 0, 553], [54, -36.653055907121804, 0, 0, 554], [55, -38.67948050802789, 0, 0, 555], [56, -36.258222249929474, 0, 0, 556], [57, -34.44032646548217, 0, 0, 557], [58, -36.59818299982471, 0, 0, 558], [59, -32.008356387941326, 0, 0, 559], [60, -35.12095443537414, 0, 0, 560], [61, -39.14025222656437, 0, 0, 561], [62, -36.3045673708823, 0, 0, 562], [63, -35.28544282291021, 0, 0, 563], [64, -31.86596486527164, 0, 0, 564], [65, -35.42611555337196, 0, 0, 565], [66, -30.65819140315128, 0, 0, 566], [67, -29.535047611726323, 0, 0, 567], [68, -24.673838980735766, 0, 0, 568], [69, -21.29128318215684, 0, 0, 569], [70, -21.333854452747133, 0, 0, 570], [71, -23.293895544395852, 0, 0, 571], [72, -25.126320531194352, 0, 0, 572], [73, -28.09149550828485, 0, 0, 573], [74, -26.452161210867672, 0, 0, 574], [75, -24.528708872585383, 0, 0, 575], [76, -27.34150949296486, 0, 0, 576], [77, -30.1820399827212, 0, 0, 577], [78, -30.735114421046845, 0, 0, 578], [79, -26.024830227648437, 0, 0, 579], [80, -24.710402435158514, 0, 0, 580], [81, -27.42392006595098, 0, 0, 581], [82, -26.12964330778131, 0, 0, 582], [83, -21.551120340244147, 0, 0, 583], [84, -25.058252647053322, 0, 0, 584], [85, -23.083191362331007, 0, 0, 585], [86, -25.699743848290034, 0, 0, 586], [87, -27.895807516384366, 0, 0, 587], [88, -30.16987388892407, 0, 0, 588], [89, -31.682277112077777, 0, 0, 589], [90, -33.52864989794999, 0, 0, 590], [91, -37.94294957933119, 0, 0, 591], [92, -41.25052264001431, 0, 0, 592], [93, -36.29607739532332, 0, 0, 593], [94, -36.82950274217073, 0, 0, 594], [95, -36.440292981335105, 0, 0, 595], [96, -41.40354324168203, 0, 0, 596], [97, -43.546980881000124, 0, 0, 597], [98, -39.27925627867848, 0, 0, 598], [99, -43.235608920033926, 0, 0, 599], [100, -44.37242842977358, 0, 0, 600], [101, -44.83076420648405, 0, 0, 601], [102, -49.824152633784905, 0, 0, 602], [103, -54.173872535502234, 0, 0, 603], [104, -50.63896040650433, 0, 0, 604], [105, -52.976291578981545, 0, 0, 605], [106, -55.474649272453426, 0, 0, 606], [107, -53.738164159495376, 0, 0, 607], [108, -50.03904332761024, 0, 0, 608], [109, -46.887601907123695, 0, 0, 609], [110, -41.99660200007078, 0, 0, 610], [111, -38.40298991679022, 0, 0, 611], [112, -39.14224646852224, 0, 0, 612], [113, -36.92064436971651, 0, 0, 613], [114, -39.723733929587134, 0, 0, 614], [115, -39.162901997430595, 0, 0, 615], [116, -41.993885483918355, 0, 0, 616], [117, -45.76189969975081, 0, 0, 617], [118, -41.83563559125011, 0, 0, 618], [119, -37.80481755028794, 0, 0, 619], [120, -33.11954455542652, 0, 0, 620], [121, -34.20158121195908, 0, 0, 621], [122, -33.63591031541018, 0, 0, 622], [123, -32.58365534767353, 0, 0, 623], [124, -35.14962149508626, 0, 0, 624], [125, -35.561755824635554, 0, 0, 625], [126, -33.41268472723246, 0, 0, 626], [127, -29.912178337279382, 0, 0, 627], [128, -32.26246058774027, 0, 0, 628], [129, -36.53738935617654, 0, 0, 629], [130, -37.74535191372236, 0, 0, 630], [131, -37.91211397484701, 0, 0, 631], [132, -40.55281088928898, 0, 0, 632], [133, -36.364146587818325, 0, 0, 633], [134, -32.35430642103507, 0, 0, 634], [135, -30.920049196075936, 0, 0, 635], [136, -32.82015877407125, 0, 0, 636], [137, -35.598266217296555, 0, 0, 637], [138, -32.75562786728798, 0, 0, 638], [139, -28.68646499092494, 0, 0, 639], [140, -24.29340692972836, 0, 0, 640], [141, -26.066429682070375, 0, 0, 641], [142, -29.806602386891726, 0, 0, 642], [143, -29.2063678473506, 0, 0, 643], [144, -30.02398455557693, 0, 0, 644], [145, -32.20122473235014, 0, 0, 645], [146, -29.14507516533439, 0, 0, 646], [147, -31.68948104377376, 0, 0, 647], [148, -34.34777821896516, 0, 0, 648], [149, -36.92725892037652, 0, 0, 649], [150, -34.003033234434724, 0, 0, 650], [151, -31.071371786070088, 0, 0, 651], [152, -34.18451899992753, 0, 0, 652], [153, -37.37713540926643, 0, 0, 653], [154, -35.43987634753594, 0, 0, 654], [155, -35.320233144894026, 0, 0, 655], [156, -39.22535574189844, 0, 0, 656], [157, -37.38696121042838, 0, 0, 657], [158, -35.28900837774158, 0, 0, 658], [159, -34.975172620478865, 0, 0, 659], [160, -38.45981321776076, 0, 0, 660], [161, -41.113889889603506, 0, 0, 661], [162, -36.66283841362292, 0, 0, 662], [163, -39.129149234794326, 0, 0, 663], [164, -43.26839528301676, 0, 0, 664], [165, -48.194148507992374, 0, 0, 665], [166, -52.15087309245285, 0, 0, 666], [167, -50.67377281251933, 0, 0, 667], [168, -53.62275333333576, 0, 0, 668], [169, -57.043037232093354, 0, 0, 669], [170, -53.868078878686624, 0, 0, 670], [171, -53.2022056282998, 0, 0, 671], [172, -50.99898905380946, 0, 0, 672], [173, -52.14426446611685, 0, 0, 673], [174, -47.24184034861073, 0, 0, 674], [175, -47.700937803036865, 0, 0, 675], [176, -46.94280851361195, 0, 0, 676], [177, -49.166296950318774, 0, 0, 677], [178, -44.97854698841196, 0, 0, 678], [179, -48.705758376497016, 0, 0, 679], [180, -52.24958614409443, 0, 0, 680], [181, -54.01391690694725, 0, 0, 681], [182, -58.51023575223947, 0, 0, 682], [183, -54.677081516855495, 0, 0, 683], [184, -52.13559811433873, 0, 0, 684], [185, -51.126115057705995, 0, 0, 685], [186, -48.00693715285621, 0, 0, 686], [187, -52.001701297609706, 0, 0, 687], [188, -51.65275276528083, 0, 0, 688], [189, -55.77204008362813, 0, 0, 689], [190, -55.62591337957846, 0, 0, 690], [191, -54.32366420375376, 0, 0, 691], [192, -58.542474054267196, 0, 0, 692], [193, -57.57951373514819, 0, 0, 693], [194, -56.56009561208844, 0, 0, 694], [195, -54.9717300679324, 0, 0, 695], [196, -54.95645757827093, 0, 0, 696], [197, -56.697898444639215, 0, 0, 697], [198, -54.609373305569775, 0, 0, 698], [199, -54.20116997138811, 0, 0, 699], [200, -52.86234346288784, 0, 0, 700], [201, -56.357481214099856, 0, 0, 701], [202, -54.88106806177483, 0, 0, 702], [203, -52.117225981771774, 0, 0, 703], [204, -55.444128300889886, 0, 0, 704], [205, -58.614644832102414, 0, 0, 705], [206, -61.94442806865577, 0, 0, 706], [207, -61.95564503556318, 0, 0, 707], [208, -60.200822687185024, 0, 0, 708], [209, -62.0447881251228, 0, 0, 709], [210, -66.01620444047832, 0, 0, 710], [211, -63.45244295791326, 0, 0, 711], [212, -68.27454530492457, 0, 0, 712], [213, -71.72805759576288, 0, 0, 713], [214, -71.57477185647983, 0, 0, 714], [215, -68.11113463036445, 0, 0, 715], [216, -70.0153968786779, 0, 0, 716], [217, -67.64425008357756, 0, 0, 717], [218, -63.54694873866823, 0, 0, 718], [219, -58.990929129218685, 0, 0, 719], [220, -63.98898357253046, 0, 0, 720], [221, -60.32763451162842, 0, 0, 721], [222, -58.27240631927265, 0, 0, 722], [223, -59.261946163051874, 0, 0, 723], [224, -56.72191352072105, 0, 0, 724], [225, -60.132983255623195, 0, 0, 725], [226, -61.80565656027156, 0, 0, 726], [227, -63.07395491389246, 0, 0, 727], [228, -65.32759787424013, 0, 0, 728], [229, -66.42497004595681, 0, 0, 729], [230, -68.51003090307988, 0, 0, 730], [231, -70.0248463603859, 0, 0, 731], [232, -74.99205548847222, 0, 0, 732], [233, -79.6888888186587, 0, 0, 733], [234, -76.09415613570212, 0, 0, 734], [235, -78.58853355421047, 0, 0, 735], [236, -73.67986768143467, 0, 0, 736], [237, -70.68785883172987, 0, 0, 737], [238, -67.35847810220181, 0, 0, 738], [239, -68.50222792855635, 0, 0, 739], [240, -63.75317500861963, 0, 0, 740], [241, -63.82088567404064, 0, 0, 741], [242, -62.30805316921868, 0, 0, 742], [243, -60.65355371882347, 0, 0, 743], [244, -55.790093939554104, 0, 0, 744], [245, -55.453879653622394, 0, 0, 745], [246, -55.16161767322937, 0, 0, 746], [247, -53.818115425503024, 0, 0, 747], [248, -57.94811413090444, 0, 0, 748], [249, -61.29254761320142, 0, 0, 749], [250, -63.82038239262567, 0, 0, 750], [251, -60.04040576782134, 0, 0, 751], [252, -56.701469446754146, 0, 0, 752], [253, -54.20583337873367, 0, 0, 753], [254, -49.815700997705285, 0, 0, 754], [255, -51.930912445094094, 0, 0, 755], [256, -48.58554514879802, 0, 0, 756], [257, -47.587820549407, 0, 0, 757], [258, -52.14769721425124, 0, 0, 758], [259, -53.90272490077359, 0, 0, 759], [260, -49.783858097791594, 0, 0, 760], [261, -50.091998143323956, 0, 0, 761], [262, -51.01001321332083, 0, 0, 762], [263, -48.07042524467411, 0, 0, 763], [264, -51.018190481143954, 0, 0, 764], [265, -55.6645646118361, 0, 0, 765], [266, -60.270598341235235, 0, 0, 766], [267, -60.22545793309314, 0, 0, 767], [268, -64.14021782763756, 0, 0, 768], [269, -68.76379712904078, 0, 0, 769], [270, -72.00967625035828, 0, 0, 770], [271, -69.73448125792005, 0, 0, 771], [272, -73.8675388834946, 0, 0, 772], [273, -78.5029052938356, 0, 0, 773], [274, -82.234857960959, 0, 0, 774], [275, -81.00117684548313, 0, 0, 775], [276, -80.32518604691306, 0, 0, 776], [277, -77.77379873532021, 0, 0, 777], [278, -76.03375616701508, 0, 0, 778], [279, -72.34985899467516, 0, 0, 779], [280, -71.48684772250289, 0, 0, 780], [281, -66.71070514220085, 0, 0, 781], [282, -70.03854901710645, 0, 0, 782], [283, -71.70228396230499, 0, 0, 783], [284, -70.09951088722096, 0, 0, 784], [285, -73.78939922208406, 0, 0, 785], [286, -74.1068750157864, 0, 0, 786], [287, -75.24522952410355, 0, 0, 787], [288, -73.89041798769686, 0, 0, 788], [289, -78.03884653392011, 0, 0, 789], [290, -78.4581222846577, 0, 0, 790], [291, -76.89033797930779, 0, 0, 791], [292, -78.62626529547443, 0, 0, 792], [293, -75.25057988445948, 0, 0, 793], [294, -77.36270471818393, 0, 0, 794], [295, -74.99488536055138, 0, 0, 795], [296, -77.50186009135449, 0, 0, 796], [297, -77.03225181205265, 0, 0, 797], [298, -76.09572371591916, 0, 0, 798], [299, -76.48054482125778, 0, 0, 799], [300, -80.5029830852577, 0, 0, 800], [301, -77.42488367005994, 0, 0, 801], [302, -78.30179323101711, 0, 0, 802], [303, -75.57060809022911, 0, 0, 803], [304, -71.4293674569575, 0, 0, 804], [305, -74.00799338541371, 0, 0, 805], [306, -73.02042775036409, 0, 0, 806], [307, -69.29990996591691, 0, 0, 807], [308, -72.42266156285474, 0, 0, 808], [309, -69.62837729631553, 0, 0, 809], [310, -72.870151631343, 0, 0, 810], [311, -74.27296716804659, 0, 0, 811], [312, -73.66962046924252, 0, 0, 812], [313, -71.65868310659437, 0, 0, 813], [314, -73.84022297641863, 0, 0, 814], [315, -69.17384313769782, 0, 0, 815], [316, -70.6117619362875, 0, 0, 816], [317, -72.3864022659781, 0, 0, 817], [318, -75.4588175494505, 0, 0, 818], [319, -75.72405507397329, 0, 0, 819], [320, -79.65919046957528, 0, 0, 820], [321, -77.89336006453217, 0, 0, 821], [322, -74.78721808405137, 0, 0, 822], [323, -78.49045704676442, 0, 0, 823], [324, -78.84083801839795, 0, 0, 824], [325, -75.60130112208675, 0, 0, 825], [326, -71.2949626385552, 0, 0, 826], [327, -73.62564153295601, 0, 0, 827], [328, -78.12003832969744, 0, 0, 828], [329, -79.35210415658221, 0, 0, 829], [330, -77.81467188471358, 0, 0, 830], [331, -78.78877851852545, 0, 0, 831], [332, -78.03371650681424, 0, 0, 832], [333, -80.01540746853573, 0, 0, 833], [334, -83.96305957715556, 0, 0, 834], [335, -80.63843866757688, 0, 0, 835], [336, -79.80591694338585, 0, 0, 836], [337, -81.04719005785938, 0, 0, 837], [338, -77.34244707429072, 0, 0, 838], [339, -78.90063299566386, 0, 0, 839], [340, -82.4395953837663, 0, 0, 840], [341, -77.52075296556875, 0, 0, 841], [342, -77.36750565821167, 0, 0, 842], [343, -81.74433257510987, 0, 0, 843], [344, -85.11922441092912, 0, 0, 844], [345, -82.16488048281403, 0, 0, 845], [346, -78.1253184030889, 0, 0, 846], [347, -76.31977519403691, 0, 0, 847], [348, -74.85874512114346, 0, 0, 848], [349, -71.57709592985798, 0, 0, 849], [350, -74.60425263582538, 0, 0, 850], [351, -71.62800252700268, 0, 0, 851], [352, -76.48511657349539, 0, 0, 852], [353, -74.30297801938814, 0, 0, 853], [354, -70.97697998658933, 0, 0, 854], [355, -68.11586858759959, 0, 0, 855], [356, -63.186206778730295, 0, 0, 856], [357, -59.17934019539574, 0, 0, 857], [358, -58.85812407983027, 0, 0, 858], [359, -59.35955390640661, 0, 0, 859], [360, -59.40235415010569, 0, 0, 860], [361, -58.828555154609575, 0, 0, 861], [362, -59.49801267283107, 0, 0, 862], [363, -61.38602747648983, 0, 0, 863], [364, -60.02413260430096, 0, 0, 864], [365, -64.35459987139558, 0, 0, 865], [366, -59.846944369870414, 0, 0, 866], [367, -58.15296600059324, 0, 0, 867], [368, -60.281790111619365, 0, 0, 868], [369, -60.03441746338076, 0, 0, 869], [370, -64.10400073560686, 0, 0, 870], [371, -68.2277559430054, 0, 0, 871], [372, -65.34159573763512, 0, 0, 872], [373, -68.99250607535865, 0, 0, 873], [374, -66.20192469841638, 0, 0, 874], [375, -61.507150320217065, 0, 0, 875], [376, -65.11613773743879, 0, 0, 876], [377, -64.67961193550451, 0, 0, 877], [378, -66.31995208612355, 0, 0, 878], [379, -66.59081784571583, 0, 0, 879], [380, -67.86104911276252, 0, 0, 880], [381, -72.54794580648645, 0, 0, 881], [382, -72.20153412562836, 0, 0, 882], [383, -73.49578320212571, 0, 0, 883], [384, -70.73106698501017, 0, 0, 884], [385, -67.09754699813149, 0, 0, 885], [386, -70.19959543363662, 0, 0, 886], [387, -66.8553092292072, 0, 0, 887], [388, -64.11456472989518, 0, 0, 888], [389, -61.91076073361116, 0, 0, 889], [390, -61.052719934772504, 0, 0, 890], [391, -59.590295051605175, 0, 0, 891], [392, -57.182638228429475, 0, 0, 892], [393, -57.82085536597483, 0, 0, 893], [394, -54.0749660667411, 0, 0, 894], [395, -55.397509916002875, 0, 0, 895], [396, -52.71817537026316, 0, 0, 896], [397, -53.838205066948085, 0, 0, 897], [398, -53.439042421038614, 0, 0, 898], [399, -57.28308309849219, 0, 0, 899], [400, -58.98015759323831, 0, 0, 900], [401, -60.75680558417742, 0, 0, 901], [402, -64.98495457643861, 0, 0, 902], [403, -68.20483882053752, 0, 0, 903], [404, -67.54109407260593, 0, 0, 904], [405, -65.03082833843854, 0, 0, 905], [406, -62.44182734045589, 0, 0, 906], [407, -62.261123309758254, 0, 0, 907], [408, -66.88986061408636, 0, 0, 908], [409, -71.50476276570969, 0, 0, 909], [410, -67.51950187784482, 0, 0, 910], [411, -62.874549895132326, 0, 0, 911], [412, -66.60337232788312, 0, 0, 912], [413, -65.34535607094195, 0, 0, 913], [414, -61.28388055884362, 0, 0, 914], [415, -58.6324505320258, 0, 0, 915], [416, -60.42824726201337, 0, 0, 916], [417, -64.32961938776376, 0, 0, 917], [418, -63.43527229906479, 0, 0, 918], [419, -65.35780022148892, 0, 0, 919], [420, -65.0868731971387, 0, 0, 920], [421, -67.42220471190375, 0, 0, 921], [422, -71.98267974674016, 0, 0, 922], [423, -75.0586053969061, 0, 0, 923], [424, -74.8635705199869, 0, 0, 924], [425, -77.09237423163496, 0, 0, 925], [426, -78.6885072332485, 0, 0, 926], [427, -78.38392215966097, 0, 0, 927], [428, -77.8964102378523, 0, 0, 928], [429, -79.28329049576324, 0, 0, 929], [430, -79.72219890161905, 0, 0, 930], [431, -82.37526939624678, 0, 0, 931], [432, -87.14938657699628, 0, 0, 932], [433, -89.81666053361081, 0, 0, 933], [434, -93.90006025552616, 0, 0, 934], [435, -92.69355582713654, 0, 0, 935], [436, -92.68032116784214, 0, 0, 936], [437, -96.04744870344605, 0, 0, 937], [438, -91.99186056608062, 0, 0, 938], [439, -94.6632340565178, 0, 0, 939], [440, -98.2112227503364, 0, 0, 940], [441, -100.76675794064471, 0, 0, 941], [442, -105.17181593333159, 0, 0, 942], [443, -106.44505542767676, 0, 0, 943], [444, -103.67555836287183, 0, 0, 944], [445, -100.78764490789905, 0, 0, 945], [446, -98.15580928931743, 0, 0, 946], [447, -93.89800756797247, 0, 0, 947], [448, -97.01374863406511, 0, 0, 948], [449, -100.73015798084774, 0, 0, 949], [450, -104.02606921092988, 0, 0, 950], [451, -107.49804687917069, 0, 0, 951], [452, -102.86221217150108, 0, 0, 952], [453, -99.05306875047953, 0, 0, 953], [454, -96.99452605820483, 0, 0, 954], [455, -101.70495123325334, 0, 0, 955], [456, -98.39333202031338, 0, 0, 956], [457, -97.58545569549648, 0, 0, 957], [458, -97.5511434071257, 0, 0, 958], [459, -94.29325833905527, 0, 0, 959], [460, -91.30006698925752, 0, 0, 960], [461, -88.36960321294707, 0, 0, 961], [462, -91.22328247256107, 0, 0, 962], [463, -88.61490533205672, 0, 0, 963], [464, -87.85340348008818, 0, 0, 964], [465, -87.07542901075449, 0, 0, 965], [466, -83.86480056864733, 0, 0, 966], [467, -79.23998263605843, 0, 0, 967], [468, -82.21481103830055, 0, 0, 968], [469, -80.721282120572, 0, 0, 969], [470, -85.19569503952908, 0, 0, 970], [471, -82.19553743171332, 0, 0, 971], [472, -78.16518949527759, 0, 0, 972], [473, -79.18632878105184, 0, 0, 973], [474, -82.2348753087843, 0, 0, 974], [475, -86.1049234998293, 0, 0, 975], [476, -89.36830491151503, 0, 0, 976], [477, -91.00801992246602, 0, 0, 977], [478, -88.00152331186328, 0, 0, 978], [479, -83.1125720113242, 0, 0, 979], [480, -86.90914340866496, 0, 0, 980], [481, -85.12871547049926, 0, 0, 981], [482, -84.68077105093397, 0, 0, 982], [483, -83.78900611528195, 0, 0, 983], [484, -88.09088669554204, 0, 0, 984], [485, -85.44692690455987, 0, 0, 985], [486, -90.41946263507293, 0, 0, 986], [487, -91.72542676678597, 0, 0, 987], [488, -92.34825126675437, 0, 0, 988], [489, -92.54606660678643, 0, 0, 989], [490, -95.29785116590132, 0, 0, 990], [491, -90.83417009016348, 0, 0, 991], [492, -86.8257859348225, 0, 0, 992], [493, -90.3350478939363, 0, 0, 993], [494, -91.60403658980682, 0, 0, 994], [495, -87.70639458929095, 0, 0, 995], [496, -83.3765828655866, 0, 0, 996], [497, -84.71293769488324, 0, 0, 997], [498, -87.2686260900191, 0, 0, 998], [499, -89.49803936185246, 0, 0, 999]], [[-500, -87.96558381940636, 0, 0, 0], [-499, -88.12791095907485, 0, 0, 1], [-498, -92.55901349413399, 0, 0, 2], [-497, -88.10507740924722, 0, 0, 3], [-496, -84.40448131687991, 0, 0, 4], [-495, -80.58490953832883, 0, 0, 5], [-494, -85.26153285003616, 0, 0, 6], [-493, -86.08538133095564, 0, 0, 7], [-492, -85.84668955818033, 0, 0, 8], [-491, -82.5013271798492, 0, 0, 9], [-490, -77.52742125923544, 0, 0, 10], [-489, -76.75891400478369, 0, 0, 11], [-488, -75.15871997048392, 0, 0, 12], [-487, -77.57320957322241, 0, 0, 13], [-486, -81.38777391922923, 0, 0, 14], [-485, -84.35411393839927, 0, 0, 15], [-484, -80.14503985491774, 0, 0, 16], [-483, -80.09548141313435, 0, 0, 17], [-482, -83.88983267468979, 0, 0, 18], [-481, -80.60900433196122, 0, 0, 19], [-480, -75.70877202910071, 0, 0, 20], [-479, -73.87500357987868, 0, 0, 21], [-478, -75.86310803639255, 0, 0, 22], [-477, -73.76124693096043, 0, 0, 23], [-476, -74.40426537599122, 0, 0, 24], [-475, -78.11071854220344, 0, 0, 25], [-474, -81.42842805520759, 0, 0, 26], [-473, -76.58926530677988, 0, 0, 27], [-472, -71.79910729216112, 0, 0, 28], [-471, -70.69806602462518, 0, 0, 29], [-470, -70.29745841339003, 0, 0, 30], [-469, -65.87398196039679, 0, 0, 31], [-468, -64.54703619126457, 0, 0, 32], [-467, -61.58272360406691, 0, 0, 33], [-466, -63.140985890945146, 0, 0, 34], [-465, -58.78020739492765, 0, 0, 35], [-464, -59.616912686251084, 0, 0, 36], [-463, -55.55474359924182, 0, 0, 37], [-462, -57.58991344956731, 0, 0, 38], [-461, -61.915772611843764, 0, 0, 39], [-460, -66.20962360052563, 0, 0, 40], [-459, -68.63630062830879, 0, 0, 41], [-458, -73.3386414036434, 0, 0, 42], [-457, -75.26930677163665, 0, 0, 43], [-456, -72.49951648885572, 0, 0, 44], [-455, -70.78375231699789, 0, 0, 45], [-454, -70.55110155973743, 0, 0, 46], [-453, -66.03222560605815, 0, 0, 47], [-452, -69.61802832451984, 0, 0, 48], [-451, -67.36512722452136, 0, 0, 49], [-450, -63.84654318970268, 0, 0, 50], [-449, -67.8350046873501, 0, 0, 51], [-448, -63.313449044215474, 0, 0, 52], [-447, -58.578449814080415, 0, 0, 53], [-446, -56.225922491495766, 0, 0, 54], [-445, -55.089686107534995, 0, 0, 55], [-444, -51.350916820596055, 0, 0, 56], [-443, -49.45253474635363, 0, 0, 57], [-442, -47.36825572963767, 0, 0, 58], [-441, -47.19700145007459, 0, 0, 59], [-440, -48.31743098717555, 0, 0, 60], [-439, -50.62938835217246, 0, 0, 61], [-438, -53.54240902960347, 0, 0, 62], [-437, -51.10738430409165, 0, 0, 63], [-436, -51.56219979173914, 0, 0, 64], [-435, -52.66084161362123, 0, 0, 65], [-434, -55.49407662036969, 0, 0, 66], [-433, -51.87495167899382, 0, 0, 67], [-432, -52.291849585094546, 0, 0, 68], [-431, -55.607386015362195, 0, 0, 69], [-430, -59.092029199313245, 0, 0, 70], [-429, -63.926690793876034, 0, 0, 71], [-428, -59.937064672459925, 0, 0, 72], [-427, -62.01926074156255, 0, 0, 73], [-426, -66.60781419689258, 0, 0, 74], [-425, -68.54481073095428, 0, 0, 75], [-424, -71.79169011284091, 0, 0, 76], [-423, -67.60605046919483, 0, 0, 77], [-422, -72.2026107562085, 0, 0, 78], [-421, -73.3086443833721, 0, 0, 79], [-420, -75.05847607593962, 0, 0, 80], [-419, -79.72476899264905, 0, 0, 81], [-418, -83.45466249949948, 0, 0, 82], [-417, -83.98292098295951, 0, 0, 83], [-416, -84.16055344822905, 0, 0, 84], [-415, -87.05070260457317, 0, 0, 85], [-414, -87.04340665599796, 0, 0, 86], [-413, -89.40471010113332, 0, 0, 87], [-412, -93.12725961524188, 0, 0, 88], [-411, -90.94499781634667, 0, 0, 89], [-410, -93.33138265245691, 0, 0, 90], [-409, -92.02087935856237, 0, 0, 91], [-408, -87.38610554341653, 0, 0, 92], [-407, -85.00156152775618, 0, 0, 93], [-406, -83.14415979749091, 0, 0, 94], [-405, -85.59956204795988, 0, 0, 95], [-404, -87.9828140556844, 0, 0, 96], [-403, -87.30096864240139, 0, 0, 97], [-402, -91.03702830262164, 0, 0, 98], [-401, -88.49698828260784, 0, 0, 99], [-400, -89.34781401358272, 0, 0, 100], [-399, -91.16770880260698, 0, 0, 101], [-398, -90.62746977276869, 0, 0, 102], [-397, -93.37040401314977, 0, 0, 103], [-396, -93.57061032867962, 0, 0, 104], [-395, -93.07196051531403, 0, 0, 105], [-394, -96.48955140984032, 0, 0, 106], [-393, -101.01229514729538, 0, 0, 107], [-392, -97.0353778642686, 0, 0, 108], [-391, -96.24983249493032, 0, 0, 109], [-390, -100.65995350733762, 0, 0, 110], [-389, -104.0058968480649, 0, 0, 111], [-388, -103.96067915318766, 0, 0, 112], [-387, -99.73373779129511, 0, 0, 113], [-386, -96.40410266083606, 0, 0, 114], [-385, -91.4680407777515, 0, 0, 115], [-384, -93.5752749937823, 0, 0, 116], [-383, -94.70332833921664, 0, 0, 117], [-382, -92.72759219698722, 0, 0, 118], [-381, -88.0218842238994, 0, 0, 119], [-380, -88.32877683722538, 0, 0, 120], [-379, -87.56591136152157, 0, 0, 121], [-378, -90.38328747662639, 0, 0, 122], [-377, -92.66266402718458, 0, 0, 123], [-376, -90.23905594625322, 0, 0, 124], [-375, -90.4946978732085, 0, 0, 125], [-374, -94.16068315144096, 0, 0, 126], [-373, -97.47414888362326, 0, 0, 127], [-372, -99.43433139272129, 0, 0, 128], [-371, -95.7510256229378, 0, 0, 129], [-370, -94.86570472084193, 0, 0, 130], [-369, -94.02676719809567, 0, 0, 131], [-368, -93.91206935770992, 0, 0, 132], [-367, -94.55673113205827, 0, 0, 133], [-366, -93.56385650027707, 0, 0, 134], [-365, -97.64655747850658, 0, 0, 135], [-364, -97.372730137291, 0, 0, 136], [-363, -92.65360447445785, 0, 0, 137], [-362, -97.21413659037704, 0, 0, 138], [-361, -98.1781542939265, 0, 0, 139], [-360, -94.47807013600567, 0, 0, 140], [-359, -97.85820984631688, 0, 0, 141], [-358, -102.73883511896653, 0, 0, 142], [-357, -103.32337715610213, 0, 0, 143], [-356, -107.39095820498798, 0, 0, 144], [-355, -107.91520452054002, 0, 0, 145], [-354, -108.53423445374564, 0, 0, 146], [-353, -112.08053845057289, 0, 0, 147], [-352, -115.85653048115717, 0, 0, 148], [-351, -114.85117225089309, 0, 0, 149], [-350, -112.73614638755302, 0, 0, 150], [-349, -116.18148790494803, 0, 0, 151], [-348, -120.75254176249565, 0, 0, 152], [-347, -118.09421855486028, 0, 0, 153], [-346, -120.6482626418435, 0, 0, 154], [-345, -117.96283000130268, 0, 0, 155], [-344, -113.50733861381192, 0, 0, 156], [-343, -109.78142284032455, 0, 0, 157], [-342, -108.92230225031459, 0, 0, 158], [-341, -104.62343628150798, 0, 0, 159], [-340, -107.57478550367104, 0, 0, 160], [-339, -110.41096530915736, 0, 0, 161], [-338, -113.23167549303055, 0, 0, 162], [-337, -110.47628074196714, 0, 0, 163], [-336, -106.47888736956817, 0, 0, 164], [-335, -109.08183756282078, 0, 0, 165], [-334, -104.8956222906787, 0, 0, 166], [-333, -106.70690686399278, 0, 0, 167], [-332, -110.41390896255352, 0, 0, 168], [-331, -110.89674847864528, 0, 0, 169], [-330, -106.77761037900656, 0, 0, 170], [-329, -104.22726850502163, 0, 0, 171], [-328, -104.9446326436578, 0, 0, 172], [-327, -104.98782960110584, 0, 0, 173], [-326, -108.94816015700114, 0, 0, 174], [-325, -108.85218493584227, 0, 0, 175], [-324, -111.03114462298713, 0, 0, 176], [-323, -111.38968316917432, 0, 0, 177], [-322, -114.5720492806294, 0, 0, 178], [-321, -117.93018933020916, 0, 0, 179], [-320, -120.33388875422025, 0, 0, 180], [-319, -117.4857126351922, 0, 0, 181], [-318, -119.11327148107685, 0, 0, 182], [-317, -120.37787810621107, 0, 0, 183], [-316, -116.00044701672952, 0, 0, 184], [-315, -115.5038855034736, 0, 0, 185], [-314, -118.43807773139618, 0, 0, 186], [-313, -113.93194372723966, 0, 0, 187], [-312, -112.0403700008229, 0, 0, 188], [-311, -111.53632474519705, 0, 0, 189], [-310, -107.1052345759163, 0, 0, 190], [-309, -109.65495225829095, 0, 0, 191], [-308, -107.17410079350047, 0, 0, 192], [-307, -109.57673094569154, 0, 0, 193], [-306, -105.78011815334239, 0, 0, 194], [-305, -105.10820892544346, 0, 0, 195], [-304, -108.06449260500696, 0, 0, 196], [-303, -103.25130498418345, 0, 0, 197], [-302, -104.17775266357663, 0, 0, 198], [-301, -104.18867338178558, 0, 0, 199], [-300, -100.90056853981251, 0, 0, 200], [-299, -96.15473860788504, 0, 0, 201], [-298, -92.31567468276728, 0, 0, 202], [-297, -93.5263338821068, 0, 0, 203], [-296, -97.70995607477249, 0, 0, 204], [-295, -99.89989078900223, 0, 0, 205], [-294, -100.16854378267755, 0, 0, 206], [-293, -98.51335800506882, 0, 0, 207], [-292, -99.70041079208072, 0, 0, 208], [-291, -95.27016648644955, 0, 0, 209], [-290, -100.16133502889072, 0, 0, 210], [-289, -97.24796812230723, 0, 0, 211], [-288, -97.03088115373548, 0, 0, 212], [-287, -97.43592770364651, 0, 0, 213], [-286, -97.55721059348376, 0, 0, 214], [-285, -92.59723151451625, 0, 0, 215], [-284, -91.01222976504815, 0, 0, 216], [-283, -90.40724884126521, 0, 0, 217], [-282, -86.9858385999323, 0, 0, 218], [-281, -91.92816326802712, 0, 0, 219], [-280, -93.59209029705546, 0, 0, 220], [-279, -94.54631845219272, 0, 0, 221], [-278, -96.64874092736484, 0, 0, 222], [-277, -93.65800254344776, 0, 0, 223], [-276, -92.75269573197023, 0, 0, 224], [-275, -88.64245940406039, 0, 0, 225], [-274, -86.1592420355446, 0, 0, 226], [-273, -81.4235047218847, 0, 0, 227], [-272, -81.7108494592545, 0, 0, 228], [-271, -77.92045251588641, 0, 0, 229], [-270, -73.00110067869893, 0, 0, 230], [-269, -75.86418728877226, 0, 0, 231], [-268, -78.95541277454193, 0, 0, 232], [-267, -74.93399858601626, 0, 0, 233], [-266, -77.84438910154108, 0, 0, 234], [-265, -76.94818235098394, 0, 0, 235], [-264, -76.10811813280277, 0, 0, 236], [-263, -77.90258414127094, 0, 0, 237], [-262, -74.09037795114772, 0, 0, 238], [-261, -76.26411715917, 0, 0, 239], [-260, -79.19075758675764, 0, 0, 240], [-259, -79.61922257308565, 0, 0, 241], [-258, -78.73950292301856, 0, 0, 242], [-257, -82.430356042475, 0, 0, 243], [-256, -78.35075621539036, 0, 0, 244], [-255, -78.27994798199845, 0, 0, 245], [-254, -74.53657512298527, 0, 0, 246], [-253, -73.52301813168182, 0, 0, 247], [-252, -70.56769485045123, 0, 0, 248], [-251, -72.76123868258179, 0, 0, 249], [-250, -68.21015499801611, 0, 0, 250], [-249, -72.44305875782437, 0, 0, 251], [-248, -74.67335490916054, 0, 0, 252], [-247, -77.12018388363413, 0, 0, 253], [-246, -78.94311551477402, 0, 0, 254], [-245, -81.35561680199608, 0, 0, 255], [-244, -78.24467172726763, 0, 0, 256], [-243, -79.72674741933892, 0, 0, 257], [-242, -78.96557459577295, 0, 0, 258], [-241, -80.18764851850115, 0, 0, 259], [-240, -75.25180183333275, 0, 0, 260], [-239, -79.93806850040319, 0, 0, 261], [-238, -77.98697641196301, 0, 0, 262], [-237, -76.73713730998614, 0, 0, 263], [-236, -80.7715255720636, 0, 0, 264], [-235, -80.11859576572421, 0, 0, 265], [-234, -78.80961794717959, 0, 0, 266], [-233, -74.42921141228325, 0, 0, 267], [-232, -70.62451161702293, 0, 0, 268], [-231, -73.9874757114839, 0, 0, 269], [-230, -71.87817316910207, 0, 0, 270], [-229, -71.76847548434684, 0, 0, 271], [-228, -69.06141251306626, 0, 0, 272], [-227, -70.38119065077656, 0, 0, 273], [-226, -74.31389260886996, 0, 0, 274], [-225, -75.38184853959154, 0, 0, 275], [-224, -75.8568852504303, 0, 0, 276], [-223, -78.08530648642525, 0, 0, 277], [-222, -79.51378481692821, 0, 0, 278], [-221, -81.38814970416573, 0, 0, 279], [-220, -83.10001582837424, 0, 0, 280], [-219, -87.41479837643783, 0, 0, 281], [-218, -84.01264165671297, 0, 0, 282], [-217, -87.48016288340251, 0, 0, 283], [-216, -91.25843237615625, 0, 0, 284], [-215, -92.77152086760512, 0, 0, 285], [-214, -88.32867682440755, 0, 0, 286], [-213, -88.64959912483238, 0, 0, 287], [-212, -84.91705411409548, 0, 0, 288], [-211, -80.47455129656115, 0, 0, 289], [-210, -84.50642093369635, 0, 0, 290], [-209, -79.78922865787179, 0, 0, 291], [-208, -83.81229935269471, 0, 0, 292], [-207, -84.28476827372397, 0, 0, 293], [-206, -81.12627453655438, 0, 0, 294], [-205, -83.03692414726214, 0, 0, 295], [-204, -78.69143135733447, 0, 0, 296], [-203, -74.30814547394583, 0, 0, 297], [-202, -75.26951907333031, 0, 0, 298], [-201, -73.33286319775436, 0, 0, 299], [-200, -77.46136603307563, 0, 0, 300], [-199, -78.77387030572093, 0, 0, 301], [-198, -79.03119075877468, 0, 0, 302], [-197, -82.40843397282164, 0, 0, 303], [-196, -78.71606802058648, 0, 0, 304], [-195, -80.83401128531757, 0, 0, 305], [-194, -76.42682892011136, 0, 0, 306], [-193, -72.29872952663443, 0, 0, 307], [-192, -76.28968768513657, 0, 0, 308], [-191, -76.15963469614047, 0, 0, 309], [-190, -80.73511804863948, 0, 0, 310], [-189, -79.52927223478166, 0, 0, 311], [-188, -77.15721587470972, 0, 0, 312], [-187, -76.13624730166505, 0, 0, 313], [-186, -73.44207811832341, 0, 0, 314], [-185, -73.9109112337854, 0, 0, 315], [-184, -69.67151565742016, 0, 0, 316], [-183, -71.77855613879841, 0, 0, 317], [-182, -75.28155711443995, 0, 0, 318], [-181, -72.4959866977634, 0, 0, 319], [-180, -71.26590541249799, 0, 0, 320], [-179, -70.56483703000288, 0, 0, 321], [-178, -69.08449647246823, 0, 0, 322], [-177, -72.68814775371332, 0, 0, 323], [-176, -75.79632155746575, 0, 0, 324], [-175, -78.70118091479247, 0, 0, 325], [-174, -75.84392889485774, 0, 0, 326], [-173, -71.25981658362723, 0, 0, 327], [-172, -74.98709178780706, 0, 0, 328], [-171, -78.0593643623609, 0, 0, 329], [-170, -81.96871374048206, 0, 0, 330], [-169, -84.95992221009219, 0, 0, 331], [-168, -89.72762375944988, 0, 0, 332], [-167, -94.4721311707275, 0, 0, 333], [-166, -89.79193514517891, 0, 0, 334], [-165, -89.95332613767945, 0, 0, 335], [-164, -90.56324011566562, 0, 0, 336], [-163, -91.46812722012108, 0, 0, 337], [-162, -95.50727516783802, 0, 0, 338], [-161, -96.29771113019817, 0, 0, 339], [-160, -91.94809254108539, 0, 0, 340], [-159, -93.86127192920013, 0, 0, 341], [-158, -88.88433608354481, 0, 0, 342], [-157, -84.5136064577123, 0, 0, 343], [-156, -85.73139886285969, 0, 0, 344], [-155, -89.18418352801766, 0, 0, 345], [-154, -85.9467200640321, 0, 0, 346], [-153, -89.12475330890967, 0, 0, 347], [-152, -88.02511052114345, 0, 0, 348], [-151, -90.52863679160096, 0, 0, 349], [-150, -90.83366274705446, 0, 0, 350], [-149, -89.23624075752524, 0, 0, 351], [-148, -90.92825848076983, 0, 0, 352], [-147, -93.54610959542052, 0, 0, 353], [-146, -93.37674849414297, 0, 0, 354], [-145, -91.32769643490782, 0, 0, 355], [-144, -94.20550298543823, 0, 0, 356], [-143, -98.51644654064977, 0, 0, 357], [-142, -102.46501017244161, 0, 0, 358], [-141, -101.10866645171839, 0, 0, 359], [-140, -97.2655950951055, 0, 0, 360], [-139, -93.02954112994158, 0, 0, 361], [-138, -92.59808753551155, 0, 0, 362], [-137, -89.67237716985375, 0, 0, 363], [-136, -89.16967987627244, 0, 0, 364], [-135, -87.20499999610414, 0, 0, 365], [-134, -87.42517690682583, 0, 0, 366], [-133, -88.98077177980524, 0, 0, 367], [-132, -88.75400036030614, 0, 0, 368], [-131, -88.4284342879456, 0, 0, 369], [-130, -89.92558665833586, 0, 0, 370], [-129, -91.83863888480627, 0, 0, 371], [-128, -90.82338501356065, 0, 0, 372], [-127, -89.29974501976884, 0, 0, 373], [-126, -88.25366378046452, 0, 0, 374], [-125, -83.44689023463175, 0, 0, 375], [-124, -80.41275686390921, 0, 0, 376], [-123, -84.86769588401452, 0, 0, 377], [-122, -83.55621054278366, 0, 0, 378], [-121, -86.75618411015034, 0, 0, 379], [-120, -82.12098872134027, 0, 0, 380], [-119, -77.4115842201121, 0, 0, 381], [-118, -73.41045312281464, 0, 0, 382], [-117, -75.97592070562766, 0, 0, 383], [-116, -76.34638160170735, 0, 0, 384], [-115, -74.57567606249945, 0, 0, 385], [-114, -71.66055055631489, 0, 0, 386], [-113, -66.66203519279784, 0, 0, 387], [-112, -64.74647843621491, 0, 0, 388], [-111, -62.687977258921194, 0, 0, 389], [-110, -60.46360262317172, 0, 0, 390], [-109, -57.273768192599654, 0, 0, 391], [-108, -54.484401725548246, 0, 0, 392], [-107, -55.463840229283974, 0, 0, 393], [-106, -60.374886703635276, 0, 0, 394], [-105, -61.774696710735064, 0, 0, 395], [-104, -61.41811647465658, 0, 0, 396], [-103, -63.31865720597419, 0, 0, 397], [-102, -65.85252346270642, 0, 0, 398], [-101, -63.40654769815494, 0, 0, 399], [-100, -65.19603150303745, 0, 0, 400], [-99, -62.11797115716647, 0, 0, 401], [-98, -59.11936914469281, 0, 0, 402], [-97, -59.39445104473116, 0, 0, 403], [-96, -64.31073178136131, 0, 0, 404], [-95, -66.66829779757062, 0, 0, 405], [-94, -62.64868174916525, 0, 0, 406], [-93, -58.594634571448665, 0, 0, 407], [-92, -57.9964713096563, 0, 0, 408], [-91, -60.32211028666622, 0, 0, 409], [-90, -58.92703028956931, 0, 0, 410], [-89, -58.654044397848125, 0, 0, 411], [-88, -56.900691753897355, 0, 0, 412], [-87, -57.036637296435465, 0, 0, 413], [-86, -54.0730800628319, 0, 0, 414], [-85, -55.035721469480144, 0, 0, 415], [-84, -54.05965849735398, 0, 0, 416], [-83, -50.71148009628317, 0, 0, 417], [-82, -50.54044536674564, 0, 0, 418], [-81, -52.76668791619535, 0, 0, 419], [-80, -47.965435760353884, 0, 0, 420], [-79, -49.457808049183214, 0, 0, 421], [-78, -52.49030598817106, 0, 0, 422], [-77, -48.30069995253238, 0, 0, 423], [-76, -44.10445230318866, 0, 0, 424], [-75, -43.06768171249103, 0, 0, 425], [-74, -45.69253099737253, 0, 0, 426], [-73, -47.29266689032785, 0, 0, 427], [-72, -48.823007228954324, 0, 0, 428], [-71, -51.78012067035894, 0, 0, 429], [-70, -47.8504721840844, 0, 0, 430], [-69, -47.80240779752003, 0, 0, 431], [-68, -46.25676396055715, 0, 0, 432], [-67, -42.251604518841944, 0, 0, 433], [-66, -39.980334370017864, 0, 0, 434], [-65, -35.11954002215087, 0, 0, 435], [-64, -39.93938833156739, 0, 0, 436], [-63, -44.24857882327723, 0, 0, 437], [-62, -45.51852772830656, 0, 0, 438], [-61, -44.53801324488564, 0, 0, 439], [-60, -43.37726899576272, 0, 0, 440], [-59, -39.61537387207607, 0, 0, 441], [-58, -35.51232295567102, 0, 0, 442], [-57, -39.364550664171105, 0, 0, 443], [-56, -40.92404997798721, 0, 0, 444], [-55, -43.51403868590289, 0, 0, 445], [-54, -44.05779341548432, 0, 0, 446], [-53, -45.73171705049873, 0, 0, 447], [-52, -46.06418873830097, 0, 0, 448], [-51, -47.820864979033985, 0, 0, 449], [-50, -45.48057371275159, 0, 0, 450], [-49, -41.72375485520453, 0, 0, 451], [-48, -43.90787276089326, 0, 0, 452], [-47, -40.43037975073751, 0, 0, 453], [-46, -41.37047092314862, 0, 0, 454], [-45, -39.762397547018814, 0, 0, 455], [-44, -34.92070659277913, 0, 0, 456], [-43, -35.65173620262258, 0, 0, 457], [-42, -37.13845384059734, 0, 0, 458], [-41, -39.401299919524824, 0, 0, 459], [-40, -40.57569489175728, 0, 0, 460], [-39, -36.80596606097638, 0, 0, 461], [-38, -40.98629294933548, 0, 0, 462], [-37, -36.50282291977564, 0, 0, 463], [-36, -39.42442960636992, 0, 0, 464], [-35, -35.36452670531247, 0, 0, 465], [-34, -37.45990938978803, 0, 0, 466], [-33, -36.795924460622885, 0, 0, 467], [-32, -34.688916167358556, 0, 0, 468], [-31, -39.573017492107184, 0, 0, 469], [-30, -39.498755106464415, 0, 0, 470], [-29, -41.25449794369961, 0, 0, 471], [-28, -45.11291216179837, 0, 0, 472], [-27, -42.67922375906597, 0, 0, 473], [-26, -42.098446764048255, 0, 0, 474], [-25, -44.95496899842103, 0, 0, 475], [-24, -49.511546029721565, 0, 0, 476], [-23, -52.80462949552169, 0, 0, 477], [-22, -56.95201367996482, 0, 0, 478], [-21, -55.98579161912704, 0, 0, 479], [-20, -54.058726600253244, 0, 0, 480], [-19, -54.22538158248432, 0, 0, 481], [-18, -52.08517538668111, 0, 0, 482], [-17, -51.59734568171832, 0, 0, 483], [-16, -49.30609668651377, 0, 0, 484], [-15, -53.25106817282187, 0, 0, 485], [-14, -56.701133183065146, 0, 0, 486], [-13, -58.43382315960044, 0, 0, 487], [-12, -59.578663083454344, 0, 0, 488], [-11, -55.235030184775, 0, 0, 489], [-10, -56.03958424197687, 0, 0, 490], [-9, -55.982729940266836, 0, 0, 491], [-8, -57.30410497203377, 0, 0, 492], [-7, -61.323489627724996, 0, 0, 493], [-6, -61.35486666462303, 0, 0, 494], [-5, -61.335318866658, 0, 0, 495], [-4, -56.7928774245065, 0, 0, 496], [-3, -57.23227211383558, 0, 0, 497], [-2, -54.439214895960404, 0, 0, 498], [-1, -51.99316779358482, 0, 0, 499], [0, -56.50601791376763, 0, 0, 500], [1, -59.45625573030074, 0, 0, 501], [2, -64.08727572792452, 0, 0, 502], [3, -67.8295621284541, 0, 0, 503], [4, -64.38160001461247, 0, 0, 504], [5, -68.17203290815404, 0, 0, 505], [6, -64.45937917566935, 0, 0, 506], [7, -69.2542635139498, 0, 0, 507], [8, -66.35316041440294, 0, 0, 508], [9, -62.90577192452123, 0, 0, 509], [10, -65.50657508138907, 0, 0, 510], [11, -62.70520070916291, 0, 0, 511], [12, -61.72300325117238, 0, 0, 512], [13, -63.65510148660729, 0, 0, 513], [14, -62.17768243239789, 0, 0, 514], [15, -66.26721523079411, 0, 0, 515], [16, -68.16721219356123, 0, 0, 516], [17, -70.65291073987122, 0, 0, 517], [18, -66.52566813885142, 0, 0, 518], [19, -62.410854642445855, 0, 0, 519], [20, -65.22853095420024, 0, 0, 520], [21, -60.559204529909564, 0, 0, 521], [22, -55.75907352378996, 0, 0, 522], [23, -57.15354256582416, 0, 0, 523], [24, -54.45798643028315, 0, 0, 524], [25, -51.821411809840406, 0, 0, 525], [26, -55.45531051087403, 0, 0, 526], [27, -51.49791322477704, 0, 0, 527], [28, -53.266732866294696, 0, 0, 528], [29, -56.19480430715304, 0, 0, 529], [30, -59.99153164987516, 0, 0, 530], [31, -61.35470114572701, 0, 0, 531], [32, -65.5941769767144, 0, 0, 532], [33, -63.734988780082716, 0, 0, 533], [34, -61.49028812913109, 0, 0, 534], [35, -60.06914427316235, 0, 0, 535], [36, -61.8465554870201, 0, 0, 536], [37, -64.88045270525899, 0, 0, 537], [38, -61.466028064427775, 0, 0, 538], [39, -65.23175355257509, 0, 0, 539], [40, -67.8228928849462, 0, 0, 540], [41, -67.99910549419006, 0, 0, 541], [42, -72.90567547519547, 0, 0, 542], [43, -73.34179540501724, 0, 0, 543], [44, -68.61145691780605, 0, 0, 544], [45, -70.0703078710225, 0, 0, 545], [46, -66.1297584890131, 0, 0, 546], [47, -63.33319233399309, 0, 0, 547], [48, -61.372440515027485, 0, 0, 548], [49, -65.20059008187413, 0, 0, 549], [50, -62.715465840099824, 0, 0, 550], [51, -58.693514638594465, 0, 0, 551], [52, -54.00739308231891, 0, 0, 552], [53, -53.31440384121683, 0, 0, 553], [54, -49.4154068769166, 0, 0, 554], [55, -50.639481344532555, 0, 0, 555], [56, -48.25567377579506, 0, 0, 556], [57, -50.04758007529949, 0, 0, 557], [58, -49.95932713371848, 0, 0, 558], [59, -47.1315845439859, 0, 0, 559], [60, -46.02140010329788, 0, 0, 560], [61, -45.51940951900545, 0, 0, 561], [62, -47.29310829852791, 0, 0, 562], [63, -48.24267896943518, 0, 0, 563], [64, -48.527946339685045, 0, 0, 564], [65, -51.52663948341909, 0, 0, 565], [66, -54.735127070833286, 0, 0, 566], [67, -57.23728443026891, 0, 0, 567], [68, -57.18980625114321, 0, 0, 568], [69, -54.5942081636055, 0, 0, 569], [70, -57.85213078742355, 0, 0, 570], [71, -55.71042911479438, 0, 0, 571], [72, -59.15936501541515, 0, 0, 572], [73, -56.66876415196514, 0, 0, 573], [74, -56.2188241500434, 0, 0, 574], [75, -52.31217000985234, 0, 0, 575], [76, -52.76130160156519, 0, 0, 576], [77, -53.543534026131944, 0, 0, 577], [78, -58.2373162702848, 0, 0, 578], [79, -59.54017214470243, 0, 0, 579], [80, -62.60974174444066, 0, 0, 580], [81, -61.205717574484666, 0, 0, 581], [82, -63.597752178779075, 0, 0, 582], [83, -60.266265875358954, 0, 0, 583], [84, -56.56974456737064, 0, 0, 584], [85, -52.55110892469847, 0, 0, 585], [86, -53.02069054160815, 0, 0, 586], [87, -54.49495147470022, 0, 0, 587], [88, -53.21682439429121, 0, 0, 588], [89, -51.72919932103659, 0, 0, 589], [90, -49.11157105243667, 0, 0, 590], [91, -53.691454935403456, 0, 0, 591], [92, -49.98068593927918, 0, 0, 592], [93, -49.708855072554016, 0, 0, 593], [94, -47.6406862052322, 0, 0, 594], [95, -45.562162093768805, 0, 0, 595], [96, -40.867494080453646, 0, 0, 596], [97, -39.848069179515804, 0, 0, 597], [98, -43.31628414742466, 0, 0, 598], [99, -43.13756442320404, 0, 0, 599], [100, -40.8412208549149, 0, 0, 600], [101, -40.73649529419693, 0, 0, 601], [102, -41.46092266160177, 0, 0, 602], [103, -37.417801322626175, 0, 0, 603], [104, -34.13757488990579, 0, 0, 604], [105, -38.185435953661596, 0, 0, 605], [106, -38.70376501484622, 0, 0, 606], [107, -34.08937530217999, 0, 0, 607], [108, -35.96981031664089, 0, 0, 608], [109, -33.49464030699078, 0, 0, 609], [110, -32.24665992430089, 0, 0, 610], [111, -29.81434728935864, 0, 0, 611], [112, -27.515944892027377, 0, 0, 612], [113, -32.50244800697362, 0, 0, 613], [114, -33.21438753105655, 0, 0, 614], [115, -37.769731356523195, 0, 0, 615], [116, -41.96245010300756, 0, 0, 616], [117, -40.55819616178318, 0, 0, 617], [118, -41.18558171394706, 0, 0, 618], [119, -41.32456521844592, 0, 0, 619], [120, -45.179705472258696, 0, 0, 620], [121, -40.94864868881389, 0, 0, 621], [122, -39.18466250161593, 0, 0, 622], [123, -35.24506949535779, 0, 0, 623], [124, -30.963635006295235, 0, 0, 624], [125, -31.42105859469691, 0, 0, 625], [126, -35.98776322708971, 0, 0, 626], [127, -35.49309810056771, 0, 0, 627], [128, -40.00374451828663, 0, 0, 628], [129, -43.9702508421692, 0, 0, 629], [130, -45.36911560663186, 0, 0, 630], [131, -46.86367980967719, 0, 0, 631], [132, -50.16370904587253, 0, 0, 632], [133, -47.8491579372987, 0, 0, 633], [134, -48.69687770140082, 0, 0, 634], [135, -46.462353146409, 0, 0, 635], [136, -46.48483565357236, 0, 0, 636], [137, -50.482613780186504, 0, 0, 637], [138, -47.11286431458162, 0, 0, 638], [139, -47.06603444248147, 0, 0, 639], [140, -47.19992891707369, 0, 0, 640], [141, -44.37330716088684, 0, 0, 641], [142, -39.438227711714816, 0, 0, 642], [143, -37.57586805195293, 0, 0, 643], [144, -42.4846940495744, 0, 0, 644], [145, -41.20158166323509, 0, 0, 645], [146, -43.932663342259076, 0, 0, 646], [147, -39.96829375950799, 0, 0, 647], [148, -36.60884567282103, 0, 0, 648], [149, -34.195973605677445, 0, 0, 649], [150, -30.60681668931688, 0, 0, 650], [151, -31.673124987177843, 0, 0, 651], [152, -31.14068745046454, 0, 0, 652], [153, -32.260750774056, 0, 0, 653], [154, -33.766646047763786, 0, 0, 654], [155, -34.60291058562095, 0, 0, 655], [156, -33.220359908302115, 0, 0, 656], [157, -30.528076840729735, 0, 0, 657], [158, -31.03322539412209, 0, 0, 658], [159, -31.307387443501625, 0, 0, 659], [160, -26.635676806205428, 0, 0, 660], [161, -26.645665368763506, 0, 0, 661], [162, -24.370238024865387, 0, 0, 662], [163, -19.46834163261923, 0, 0, 663], [164, -17.522887088494237, 0, 0, 664], [165, -19.432989251064512, 0, 0, 665], [166, -19.665292787158755, 0, 0, 666], [167, -18.687243077375527, 0, 0, 667], [168, -16.353020145040606, 0, 0, 668], [169, -13.330756086255303, 0, 0, 669], [170, -18.110447748928642, 0, 0, 670], [171, -15.306670828937737, 0, 0, 671], [172, -14.636496712036706, 0, 0, 672], [173, -18.2841677547084, 0, 0, 673], [174, -21.251316769089282, 0, 0, 674], [175, -25.741923536873134, 0, 0, 675], [176, -24.415614301823652, 0, 0, 676], [177, -23.489230577118995, 0, 0, 677], [178, -23.18947025512766, 0, 0, 678], [179, -21.47479808723503, 0, 0, 679], [180, -22.779220441249983, 0, 0, 680], [181, -22.21935890032792, 0, 0, 681], [182, -20.669153671034838, 0, 0, 682], [183, -15.717137772251267, 0, 0, 683], [184, -15.47742955668259, 0, 0, 684], [185, -13.808122049120204, 0, 0, 685], [186, -18.414153337980558, 0, 0, 686], [187, -21.9126434297996, 0, 0, 687], [188, -24.039606352606853, 0, 0, 688], [189, -27.23708668697378, 0, 0, 689], [190, -30.5064096745609, 0, 0, 690], [191, -25.960716241953538, 0, 0, 691], [192, -30.67008189073584, 0, 0, 692], [193, -32.91238274934234, 0, 0, 693], [194, -37.36766698599392, 0, 0, 694], [195, -35.69564688148214, 0, 0, 695], [196, -32.73016007527114, 0, 0, 696], [197, -32.506659205323544, 0, 0, 697], [198, -30.734719121559895, 0, 0, 698], [199, -27.76440525281778, 0, 0, 699], [200, -27.301389945942397, 0, 0, 700], [201, -30.562347673221296, 0, 0, 701], [202, -34.9109518325444, 0, 0, 702], [203, -32.46629962815482, 0, 0, 703], [204, -28.038879439985024, 0, 0, 704], [205, -25.36719356628993, 0, 0, 705], [206, -24.19651935081652, 0, 0, 706], [207, -23.419230567081357, 0, 0, 707], [208, -25.29075007459379, 0, 0, 708], [209, -23.66577519055243, 0, 0, 709], [210, -19.705024436571144, 0, 0, 710], [211, -21.79685071909028, 0, 0, 711], [212, -26.694013241721915, 0, 0, 712], [213, -23.036085873547563, 0, 0, 713], [214, -19.88853643600766, 0, 0, 714], [215, -23.467362425610556, 0, 0, 715], [216, -27.880562186896597, 0, 0, 716], [217, -27.12304842134283, 0, 0, 717], [218, -25.664684750669508, 0, 0, 718], [219, -29.858636853145708, 0, 0, 719], [220, -27.309142863093548, 0, 0, 720], [221, -26.673090795716604, 0, 0, 721], [222, -23.99293225975466, 0, 0, 722], [223, -21.92326049372135, 0, 0, 723], [224, -21.50794236879363, 0, 0, 724], [225, -21.743837990122962, 0, 0, 725], [226, -22.84421760249302, 0, 0, 726], [227, -27.090035161194628, 0, 0, 727], [228, -22.36706001115404, 0, 0, 728], [229, -26.913307578563984, 0, 0, 729], [230, -31.862177441411802, 0, 0, 730], [231, -32.62201088233597, 0, 0, 731], [232, -37.46998025249307, 0, 0, 732], [233, -40.63599973602445, 0, 0, 733], [234, -42.096370228317554, 0, 0, 734], [235, -38.40954226795264, 0, 0, 735], [236, -34.94017036089036, 0, 0, 736], [237, -35.483593561930164, 0, 0, 737], [238, -36.43584652617305, 0, 0, 738], [239, -33.637902055241376, 0, 0, 739], [240, -38.58930832256628, 0, 0, 740], [241, -34.133339831601724, 0, 0, 741], [242, -29.427444703861106, 0, 0, 742], [243, -29.655026643717264, 0, 0, 743], [244, -32.981881754590326, 0, 0, 744], [245, -34.954509828998304, 0, 0, 745], [246, -39.68731901840017, 0, 0, 746], [247, -38.68474339919993, 0, 0, 747], [248, -42.95133388829359, 0, 0, 748], [249, -41.45393441964586, 0, 0, 749], [250, -37.52778458834989, 0, 0, 750], [251, -39.11027491697036, 0, 0, 751], [252, -39.25732162906118, 0, 0, 752], [253, -35.662257597655284, 0, 0, 753], [254, -33.24001316849461, 0, 0, 754], [255, -31.982988448454464, 0, 0, 755], [256, -32.89490081091415, 0, 0, 756], [257, -36.20885782278332, 0, 0, 757], [258, -31.477536379156597, 0, 0, 758], [259, -28.268386536223954, 0, 0, 759], [260, -28.31199641784515, 0, 0, 760], [261, -31.102904727118958, 0, 0, 761], [262, -28.899888511219935, 0, 0, 762], [263, -24.440388722651377, 0, 0, 763], [264, -21.89691477928736, 0, 0, 764], [265, -21.391760909554545, 0, 0, 765], [266, -21.74155290917539, 0, 0, 766], [267, -24.091000387582348, 0, 0, 767], [268, -21.17837890442415, 0, 0, 768], [269, -22.038611107643582, 0, 0, 769], [270, -21.140763710784867, 0, 0, 770], [271, -16.96357160130297, 0, 0, 771], [272, -16.901649896756016, 0, 0, 772], [273, -21.478210655546118, 0, 0, 773], [274, -22.70386084625046, 0, 0, 774], [275, -18.337823420253518, 0, 0, 775], [276, -14.513808993324865, 0, 0, 776], [277, -12.85930711104932, 0, 0, 777], [278, -9.383975962303374, 0, 0, 778], [279, -4.941561137319894, 0, 0, 779], [280, -3.8441162621539533, 0, 0, 780], [281, -0.9696678132119896, 0, 0, 781], [282, 1.7630535915482977, 0, 0, 782], [283, 3.78463672594403, 0, 0, 783], [284, 0.5266531263282221, 0, 0, 784], [285, 3.4483315952767715, 0, 0, 785], [286, -0.3641191849396139, 0, 0, 786], [287, -5.305467257664512, 0, 0, 787], [288, -9.72910605042214, 0, 0, 788], [289, -4.8245605745767985, 0, 0, 789], [290, -7.916877250483324, 0, 0, 790], [291, -5.519027003806089, 0, 0, 791], [292, -0.6285737158613873, 0, 0, 792], [293, 1.2426325127521611, 0, 0, 793], [294, -2.034599541034466, 0, 0, 794], [295, -1.78742732459758, 0, 0, 795], [296, 2.5399218340078527, 0, 0, 796], [297, 5.989503907241454, 0, 0, 797], [298, 8.535777871563822, 0, 0, 798], [299, 10.43610358001934, 0, 0, 799], [300, 7.169604273966527, 0, 0, 800], [301, 4.53235297255232, 0, 0, 801], [302, 7.057481475137046, 0, 0, 802], [303, 2.7076673370900766, 0, 0, 803], [304, 4.8877805033587896, 0, 0, 804], [305, 1.5820622102361104, 0, 0, 805], [306, 1.596404351732947, 0, 0, 806], [307, 3.841161283852783, 0, 0, 807], [308, 3.2674549749772734, 0, 0, 808], [309, -1.7231110959811908, 0, 0, 809], [310, -6.075613366045822, 0, 0, 810], [311, -10.307658670645658, 0, 0, 811], [312, -8.672851544332929, 0, 0, 812], [313, -13.315461522715534, 0, 0, 813], [314, -16.371976614134685, 0, 0, 814], [315, -14.503111632533756, 0, 0, 815], [316, -16.213959980914602, 0, 0, 816], [317, -12.427787008273889, 0, 0, 817], [318, -14.407140767822705, 0, 0, 818], [319, -10.223875227957965, 0, 0, 819], [320, -13.27470730828578, 0, 0, 820], [321, -9.496605333257834, 0, 0, 821], [322, -10.516240504650966, 0, 0, 822], [323, -12.101143309636637, 0, 0, 823], [324, -12.690558745486364, 0, 0, 824], [325, -15.364947482369708, 0, 0, 825], [326, -17.640530620225757, 0, 0, 826], [327, -14.443871174272065, 0, 0, 827], [328, -13.746548481453377, 0, 0, 828], [329, -13.423636813866326, 0, 0, 829], [330, -9.450024121361501, 0, 0, 830], [331, -8.382868836815799, 0, 0, 831], [332, -7.454322451342877, 0, 0, 832], [333, -8.91990334369413, 0, 0, 833], [334, -12.910066379349216, 0, 0, 834], [335, -11.928809860225922, 0, 0, 835], [336, -7.063085437309365, 0, 0, 836], [337, -10.096327898424951, 0, 0, 837], [338, -6.598647914782008, 0, 0, 838], [339, -9.299524564717654, 0, 0, 839], [340, -10.372691864803196, 0, 0, 840], [341, -13.732888194512732, 0, 0, 841], [342, -10.969484539531013, 0, 0, 842], [343, -13.947422043639378, 0, 0, 843], [344, -12.498833131404274, 0, 0, 844], [345, -15.67840745451116, 0, 0, 845], [346, -19.78525142937525, 0, 0, 846], [347, -19.22269246340325, 0, 0, 847], [348, -15.857964527875229, 0, 0, 848], [349, -12.953791992380529, 0, 0, 849], [350, -10.706842586426134, 0, 0, 850], [351, -9.029573554970607, 0, 0, 851], [352, -5.876783045697659, 0, 0, 852], [353, -5.255654490935559, 0, 0, 853], [354, -6.509539860461736, 0, 0, 854], [355, -2.06963354747273, 0, 0, 855], [356, -3.439324088995218, 0, 0, 856], [357, -0.809015341809403, 0, 0, 857], [358, 3.720329617205351, 0, 0, 858], [359, 0.14132535083157105, 0, 0, 859], [360, 2.1948247816910404, 0, 0, 860], [361, 0.3707465129296583, 0, 0, 861], [362, 2.4053759947766062, 0, 0, 862], [363, 2.737094764565991, 0, 0, 863], [364, -0.6121744553457393, 0, 0, 864], [365, 2.0521831660641396, 0, 0, 865], [366, 5.483978683957352, 0, 0, 866], [367, 2.9181272522574946, 0, 0, 867], [368, 6.718465139571569, 0, 0, 868], [369, 10.186642517195912, 0, 0, 869], [370, 13.336532957130746, 0, 0, 870], [371, 13.257588353700985, 0, 0, 871], [372, 12.370435560983832, 0, 0, 872], [373, 10.814587221443386, 0, 0, 873], [374, 7.7279443003639114, 0, 0, 874], [375, 8.260414249624407, 0, 0, 875], [376, 6.33132325089543, 0, 0, 876], [377, 3.5742335393355997, 0, 0, 877], [378, 4.192318103822524, 0, 0, 878], [379, 0.3909780609329214, 0, 0, 879], [380, 1.292921769971283, 0, 0, 880], [381, 2.3593706042751315, 0, 0, 881], [382, 3.881433059153908, 0, 0, 882], [383, 6.437829447643292, 0, 0, 883], [384, 10.21517100121477, 0, 0, 884], [385, 7.88557365635817, 0, 0, 885], [386, 4.642132903351034, 0, 0, 886], [387, 6.273386573574053, 0, 0, 887], [388, 2.683005081838631, 0, 0, 888], [389, 4.5922124480289135, 0, 0, 889], [390, 2.6895855254543606, 0, 0, 890], [391, 7.226223359263646, 0, 0, 891], [392, 2.6866569071560598, 0, 0, 892], [393, -0.6317516176863647, 0, 0, 893], [394, -4.804343730388467, 0, 0, 894], [395, -4.022790553804539, 0, 0, 895], [396, -0.272460496316425, 0, 0, 896], [397, 1.6608713790776282, 0, 0, 897], [398, 4.875345074159389, 0, 0, 898], [399, 1.9837867139909533, 0, 0, 899], [400, 0.5628525439658789, 0, 0, 900], [401, -2.0411302287964577, 0, 0, 901], [402, -1.0327439736602844, 0, 0, 902], [403, -5.023632299868469, 0, 0, 903], [404, -8.09385496334554, 0, 0, 904], [405, -10.774056850374134, 0, 0, 905], [406, -12.931648111117186, 0, 0, 906], [407, -9.176596825449332, 0, 0, 907], [408, -13.964556204255508, 0, 0, 908], [409, -15.064561436055268, 0, 0, 909], [410, -11.430781563297948, 0, 0, 910], [411, -13.832192156282154, 0, 0, 911], [412, -12.985250901331584, 0, 0, 912], [413, -14.72222562596913, 0, 0, 913], [414, -14.732302675092384, 0, 0, 914], [415, -11.32068741331168, 0, 0, 915], [416, -9.45209464742884, 0, 0, 916], [417, -10.895244091312208, 0, 0, 917], [418, -9.37902710234282, 0, 0, 918], [419, -4.909209626223676, 0, 0, 919], [420, -0.02018938823918326, 0, 0, 920], [421, 0.3630871006024785, 0, 0, 921], [422, 3.842531757407877, 0, 0, 922], [423, 3.093081580584532, 0, 0, 923], [424, 3.682291349804159, 0, 0, 924], [425, -0.5118727187913263, 0, 0, 925], [426, -4.609441029332834, 0, 0, 926], [427, -5.583024889957406, 0, 0, 927], [428, -1.8238369004244896, 0, 0, 928], [429, -4.202544150683956, 0, 0, 929], [430, -6.338583185747806, 0, 0, 930], [431, -6.620594153514648, 0, 0, 931], [432, -6.972432877203318, 0, 0, 932], [433, -5.3106676590206625, 0, 0, 933], [434, -5.50564072438114, 0, 0, 934], [435, -5.314292783297089, 0, 0, 935], [436, -3.7785262043224357, 0, 0, 936], [437, -1.7416767234564103, 0, 0, 937], [438, -3.8499892959841833, 0, 0, 938], [439, -1.6191267909051024, 0, 0, 939], [440, -6.199679560616529, 0, 0, 940], [441, -5.348698642778007, 0, 0, 941], [442, -2.3537270746946426, 0, 0, 942], [443, 1.1008760251245864, 0, 0, 943], [444, 1.6639575666045854, 0, 0, 944], [445, 4.215521525270605, 0, 0, 945], [446, 7.047099678739905, 0, 0, 946], [447, 3.128633518055084, 0, 0, 947], [448, -0.47281061711396344, 0, 0, 948], [449, -4.279918914434484, 0, 0, 949], [450, -9.08619075060434, 0, 0, 950], [451, -8.003017838025785, 0, 0, 951], [452, -7.65891893356031, 0, 0, 952], [453, -7.132919129305117, 0, 0, 953], [454, -9.07861640996578, 0, 0, 954], [455, -13.641662705116449, 0, 0, 955], [456, -10.40842173834848, 0, 0, 956], [457, -8.774663335300303, 0, 0, 957], [458, -9.700625433490366, 0, 0, 958], [459, -11.881196350128883, 0, 0, 959], [460, -15.197380301260182, 0, 0, 960], [461, -17.818557169158268, 0, 0, 961], [462, -13.142559478843008, 0, 0, 962], [463, -17.604692448165338, 0, 0, 963], [464, -21.627105933217013, 0, 0, 964], [465, -17.844707250078766, 0, 0, 965], [466, -15.581211226611352, 0, 0, 966], [467, -14.461678923277603, 0, 0, 967], [468, -11.47291617848818, 0, 0, 968], [469, -6.5188622086322106, 0, 0, 969], [470, -9.055395120077739, 0, 0, 970], [471, -9.160912870784333, 0, 0, 971], [472, -12.60630582573014, 0, 0, 972], [473, -17.584598802160954, 0, 0, 973], [474, -16.64463318795171, 0, 0, 974], [475, -12.96555227156832, 0, 0, 975], [476, -8.007291304961495, 0, 0, 976], [477, -6.406008378649224, 0, 0, 977], [478, -10.548208029729143, 0, 0, 978], [479, -7.037573814383492, 0, 0, 979], [480, -3.5609337287709657, 0, 0, 980], [481, 1.3427582624555274, 0, 0, 981], [482, -1.1899040255767939, 0, 0, 982], [483, -2.075594469315225, 0, 0, 983], [484, 2.662127530007331, 0, 0, 984], [485, 6.027773791533216, 0, 0, 985], [486, 10.917587628833925, 0, 0, 986], [487, 7.208255862459502, 0, 0, 987], [488, 4.749607333933467, 0, 0, 988], [489, 7.544949455402307, 0, 0, 989], [490, 11.342023574564134, 0, 0, 990], [491, 8.863847341029174, 0, 0, 991], [492, 9.672588568323679, 0, 0, 992], [493, 12.087409307395484, 0, 0, 993], [494, 7.637024470789502, 0, 0, 994], [495, 5.8175759818899, 0, 0, 995], [496, 8.452433269407493, 0, 0, 996], [497, 8.211608929554782, 0, 0, 997], [498, 12.471947217144148, 0, 0, 998], [499, 13.885066857276577, 0, 0, 999]]];
//console.log(ArraysAsString(rawData));
// process & insert simplification data
for (var i = 0; i < rawData.length; i++)
    __WEBPACK_IMPORTED_MODULE_1__Simplify__["a" /* Simplify */].VisvalWhyattRank(rawData[i]);
var simpData = getSimplifiedData(rawData, 100);
//let simpData = rawData;
//let test = [];
//for (let i = 0; i < 100; i++)
//    test.push(i);
//console.log(Simplify.selectTopK(test, 10, function (a: number, b: number) { return a - b}));
console.log(rawData);
window.onload = function () {
    var width = 500;
    var height = 300;
    // initialize & render normal chart
    var chartFull = __WEBPACK_IMPORTED_MODULE_0__CanvasHelper__["a" /* CanvasHelper */].initEmptyChart("chartContainer", height, width);
    chartFull.options.data = __WEBPACK_IMPORTED_MODULE_0__CanvasHelper__["a" /* CanvasHelper */].linesToCanvasObjects(rawData);
    chartFull.render();
    // initialize & render zoomable, simplified chart
    var chartZoom = __WEBPACK_IMPORTED_MODULE_0__CanvasHelper__["a" /* CanvasHelper */].initEmptyChart("chartContainerVW", height, width);
    var zoomManager = new __WEBPACK_IMPORTED_MODULE_2__ZoomManager__["a" /* ZoomManager */](chartZoom, 500, 50, rawData, [chartFull]);
    zoomManager.render();
};


/***/ })
/******/ ]);