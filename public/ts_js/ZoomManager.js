/// <reference path="./typings/canvasjs.d.ts" />
import { DataSlice } from './DataSlice';
import { CanvasHelper } from './CanvasHelper';
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
        this.currentSlice = new DataSlice(lines, noBounds, noBounds, linePtMin);
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
        this.chart.options.data = CanvasHelper.linesToCanvasObjects(data);
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
export { ZoomManager };
