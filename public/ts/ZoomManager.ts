/// <reference path="../ts_typings/canvasjs.d.ts" />

import { DataSlice, Bounds } from './DataSlice';
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

export class ZoomManager
{
    private chart: CanvasJS.Chart;
    private oldViewStack: Array<DataSlice>;
    private chartPtMax: number;
    private linePtMin: number;
    private currentSlice: DataSlice;
    private syncCharts: Array<CanvasJS.Chart>;

    constructor(chart: CanvasJS.Chart, chartPtMax: number, linePtMin: number,
        lines: Array<Array<Array<number>>>, syncCharts: Array<CanvasJS.Chart>)
    {
        this.chart = chart;
        this.oldViewStack = [];
        this.chartPtMax = chartPtMax;
        this.linePtMin = linePtMin;

        let noBounds: Bounds = { minX: null, maxX: null, minY: null, maxY: null };
        this.currentSlice = new DataSlice(lines, noBounds, noBounds, linePtMin);
        this.syncCharts = syncCharts;

        // bind callbacks to zoom
        let context = this;
        // added range change event/ range change axis data interfaces 
        // and changed chart options interface
        // in typings (e3 typings is missing this information)
        this.chart.options.rangeChanged = function (e: CanvasJS.RangeChangeEvent): void {
            switch (e.trigger)
            {
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

    private zoomInHandler(e: CanvasJS.RangeChangeEvent): void
    {
        let axisX: CanvasJS.RangeChangeAxisData = e.axisX[0],
            axisY: CanvasJS.RangeChangeAxisData = e.axisY[0],
            userBounds: Bounds = {
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
        // otherwise, continue with dynamic simplification
        else
        {
            console.time("Subslice (Zoom)");
            this.currentSlice = this.currentSlice.subSlice(userBounds, userBounds,
                this.linePtMin);
            console.timeEnd("Subslice (Zoom)");
        }

        this.renderDataSlice(this.currentSlice);
    }

    private zoomOutHandler(e: CanvasJS.RangeChangeEvent): void
    {
        if (this.oldViewStack.length === 0)
        {
            alert("already at base view");
            return;
        }
        this.renderDataSlice(this.currentSlice = this.oldViewStack.pop());
    }

    /*
		private static helper method
		set a chart's x and y axis viewports to given limits
		--> setting axis min/max means no panning
	*/
	private static setChartBounds(chart, dataslice)
    {
        let boundsViewport: Bounds = dataslice.boundsViewport,
            boundsAxis: Bounds = dataslice.boundsAxis;

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
    }

    private renderDataSlice(dataslice: DataSlice): void
    {
        // simplify data and update to chart
        console.log("-----------------------");
        console.log("Rendering New DataView");
        console.log("-----------------------");
        console.log("Pre-simplified Point Count: " + dataslice.numPoints);

        // check for cached simplified lines by default
        // and use those if they exist
        let data: Array<Array<Array<number>>> = dataslice.cachedSimpLines !== null ?
            dataslice.cachedSimpLines : dataslice.simplifySlice(this.chartPtMax);

        let count: number = 0;
        for (let i: number = 0; i < data.length; i++)
            count += data[i].length;

        console.log("Post-simplified Point Count: " + count);

        let percent: number = parseFloat((count / dataslice.numPoints).toFixed(2));
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
        for (let i: number = 0, chart = null; i < this.syncCharts.length; i++)
        {
            ZoomManager.setChartBounds(this.syncCharts[i], dataslice);
            this.syncCharts[i].render();
        }
    }

    public render(): void
    {
        this.renderDataSlice(this.currentSlice);
    }
}