function ZoomManager(chart, lines, syncCharts = [])
{
	this.chart = chart;
	// already prioritized
	this.lines = lines;
	this.oldViewStack = [];
	this.currentView = new DataView(lines);
	this.viewCap = 50000; // maximum number of points
	this.syncCharts = syncCharts;

	// bind callbacks to zoom
	var context = this;
	this.chart.options.rangeChanged = function(e)
	{
		switch(e.trigger)
		{
			// user zoomed into a section
			case "zoom":
				context.zoomHandler(e);
				break;
			// user reset zoom level
			case "reset":
				context.resetHandler(e);
				break;
			default:
				break;
				//console.log(e.trigger);
		}
	};

	// render view
	this.renderDataView(this.currentView);
}

// handler for canvasjs zoom feature
ZoomManager.prototype.zoomHandler = function(e)
{
	var axisX = e.axisX[0],
		axisY = e.axisY[0],
		bounds = {x1: axisX.viewportMinimum, x2: axisX.viewportMaximum,
				  y1: axisY.viewportMinimum, y2: axisY.viewportMaximum};

	//console.log(e);
	// console.log(bounds);

	//var childView = this.currentView.subView(bounds);
	this.oldViewStack.push(this.currentView);
	this.currentView = this.currentView.subView(bounds);
	this.renderDataView(this.currentView);
}

// handler for canvasjs reset zoom feature
// override hard reset for incremental zoom out
ZoomManager.prototype.resetHandler = function(e)
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

}

ZoomManager.prototype.renderDataView = function(dataview)
{
	// set a chart's x and y axis viewports to given limits
	function setChartViewport(chart, x1, x2, y1, y2)
	{
		chart.options.axisX = {
			viewportMinimum: x1,
			viewportMaximum: x2
		};
		chart.options.axisY = {
			viewportMinimum: y1,
			viewportMaximum: y2
		}
		return;
	}

	// simplify data and update to chart
	console.log("-----------------------");
	console.log("Rendering New DataView");
	console.log("-----------------------");
	console.log("Pre-simplified Point Count: " + dataview.numPoints);
	var data = dataview.simplifyView(this.viewCap);
	var count = 0;
	for (var i = 0; i < data.length; i++)
		count += data[i].length;

	console.log("Post-simplified Point Count: " + count);

	var percent = (count/dataview.numPoints).toFixed(2);
	console.log("Percentage of actual points in viewport displayed: "
		+ percent * 100 +  "%");

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
	for (var i = 0, chart = null; i < this.syncCharts.length; i++)
	{
		setChartViewport(this.syncCharts[i], x1, x2, y1, y2);
		this.syncCharts[i].render();
	}
}