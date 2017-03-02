/*
	Zoom Manager Class Implementation
	----------------------------------------------------------------------------

	----------------------------------------------------------------------------
	Notes
	----------------------------------------------------------------------------
	A Zoom Manager binds data to a chart for synergistic zooming and
	simplification to enable efficient viewing of millions of data points.

	After constructing a Zoom Manager with a given chart and dataset, do not use
	the chart's native render function. Instead, render the chart using the
	Zoom Manager's render function, which wraps around the native function.
	
	----------------------------------------------------------------------------
	Dependencies
	----------------------------------------------------------------------------
	DataView class (dataView.js)
*/
var ZoomManager = (function()
{
	// constructor
	function ZoomManager(chart, lines, viewCap=50000, syncCharts=[])
	{
		this.chart = chart;
		// already prioritized
		this.lines = lines;
		this.oldViewStack = [];
		this.currentView = new DataView(lines, [[null, null], [null, null]], 50);
		this.viewCap = viewCap; // maximum number of points
		this.syncCharts = syncCharts;

		// bind callbacks to zoom
		var context = this;
		this.chart.options.rangeChanged = function(e)
		{
			switch(e.trigger)
			{
				// user zoomed into a section
				case "zoom":
					context.zoomInHandler(e);
					break;
				// user reset zoom level -- hijack to zoom out
				case "reset":
					context.zoomOutHandler(e);
					break;
				default:
					break;
					//console.log(e.trigger);
			}
		};

		// render view
		// this.renderDataView(this.currentView);
	}

	// handler for canvasjs zoom feature
	ZoomManager.prototype.zoomInHandler = function(e)
	{
		var axisX = e.axisX[0],
			axisY = e.axisY[0],
			bounds = [[axisX.viewportMinimum, axisY.viewportMinimum],
				[axisX.viewportMaximum, axisY.viewportMaximum]];

		//var childView = this.currentView.subView(bounds);
		this.oldViewStack.push(this.currentView);
		this.renderDataView(this.currentView = this.currentView.subView(bounds, 50));
	};

	// handler for canvasjs reset zoom feature
	// override hard reset for incremental zoom out
	ZoomManager.prototype.zoomOutHandler = function(e)
	{
		if (this.oldViewStack.length === 0)
		{
			alert("already at base view");
			return;
		}

		// reset current view and view stack to initial view
	/*	this.currentView = this.oldViewStack[0];
		this.oldViewStack = [];
		this.renderDataView(this.currentView);*/
		this.renderDataView(this.currentView = this.oldViewStack.pop());
		return;
	};

	/*
		private static helper method
		set a chart's x and y axis viewports to given limits
		--> setting axis min/max means no panning
	*/
	function setChartViewport(chart, bounds, fixAxes=true)
	{
		chart.options.axisX = {
			viewportMinimum: bounds[0][0],
			viewportMaximum: bounds[1][0]
		};
		chart.options.axisY = {
			viewportMinimum: bounds[0][1],
			viewportMaximum: bounds[1][1]
		};

		if (fixAxes)
		{
			chart.options.axisX.minimum = bounds[0][0];
			chart.options.axisX.maximum = bounds[1][0];
			chart.options.axisY.minimum = bounds[0][1];
			chart.options.axisY.maximum = bounds[1][1];			
		}
		return;
	}

	ZoomManager.prototype.renderDataView = function(dataview)
	{
		// simplify data and update to chart
		console.log("-----------------------");
		console.log("Rendering New DataView");
		console.log("-----------------------");
		console.log("Pre-simplified Point Count: " + dataview.numPoints);


		// check for cached simplified lines by default
		// and use those if they exist
		var data = dataview.cachedSimpLines !== null ?
			dataview.cachedSimpLines : dataview.simplifyView(this.viewCap);

		// count number of points in simplified dataview
		for (var count = i = 0; i < data.length; i++)
			count += data[i].length;

		console.log("Post-simplified Point Count: " + count);

		var percent = (count/dataview.numPoints).toFixed(2);
		console.log("Percentage of actual points in viewport displayed: " +
			percent * 100 +  "%");

		this.chart.options.data = CanvasHelper.linesToCanvasObjects(data);

		// update chart bounds

		// set bounds -- two cases
		// 1) null bounds values (no bounds), aka base view
		// per CanvasJS docs, reset/pan buttons don't appear
		// and viewport automatically sizes min/max x and y points
		// 2) defined rectangle bounds for zoomed in view
		// this latter case causes reset/pan buttons to appear
		setChartViewport(this.chart, dataview.bounds, true);

		this.chart.render();

		// any sync charts
		for (i = 0, chart = null; i < this.syncCharts.length; i++)
		{
			setChartViewport(this.syncCharts[i], dataview.bounds, false);
			this.syncCharts[i].render();
			// console.log(this.syncCharts[i]);
		}
	};

	ZoomManager.prototype.render = function()
	{
		this.renderDataView(this.currentView);
	};

	return ZoomManager;
})();