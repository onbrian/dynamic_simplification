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
		this.currentView = new DataView(lines, null);
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
			bounds = {x1: axisX.viewportMinimum, x2: axisX.viewportMaximum,
					  y1: axisY.viewportMinimum, y2: axisY.viewportMaximum};

		//var childView = this.currentView.subView(bounds);
		this.oldViewStack.push(this.currentView);
		this.renderDataView(this.currentView = this.currentView.subView(bounds));
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
	*/
	function setChartViewport(chart, x1, x2, y1, y2, fixAxes=true)
	{
		chart.options.axisX = {
			viewportMinimum: x1,
			viewportMaximum: x2
		};
		chart.options.axisY = {
			viewportMinimum: y1,
			viewportMaximum: y2
		};

		if (fixAxes)
		{
			chart.options.axisX.minimum = x1;
			chart.options.axisX.maximum = x2;
			chart.options.axisY.minimum = y1;
			chart.options.axisY.maximum = y2;			
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


		// use cached by default
		var data = dataview.cachedSimpLines !== null ?
			dataview.cachedSimpLines : dataview.simplifyView(this.viewCap);

		for (var count = i = 0; i < data.length; i++)
			count += data[i].length;

		console.log("Post-simplified Point Count: " + count);

		var percent = (count/dataview.numPoints).toFixed(2);
		console.log("Percentage of actual points in viewport displayed: " +
			percent * 100 +  "%");

		this.chart.options.data = CanvasHelper.linesToCanvasObjects(data);

		// update chart bounds

		// no bounds (aka base view)
		// per canvasjs docs, set viewports to null
		// so reset/pan buttons don't appear
		// and viewport automatically sizes min/max x and y points
		var x1 = x2 = y1 = y2 = null;

		// set bounds (zoomed in view)
		// this causes reset/pan buttons to appear
		if (dataview.bounds !== null)
		{
			x1 = dataview.bounds.x1;
			x2 = dataview.bounds.x2;
			y1 = dataview.bounds.y1;
			y2 = dataview.bounds.y2;
		}

		setChartViewport(this.chart, x1, x2, y1, y2);

		this.chart.render();

		// any sync charts
		for (i = 0, chart = null; i < this.syncCharts.length; i++)
		{
			setChartViewport(this.syncCharts[i], x1, x2, y1, y2, false);
			this.syncCharts[i].render();
			console.log(this.syncCharts[i]);
		}
	};

	ZoomManager.prototype.render = function()
	{
		this.renderDataView(this.currentView);
	};

	return ZoomManager;
})();