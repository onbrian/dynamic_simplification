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
	function ZoomManager(chart, viewPtCap, lineFloor, lines, syncCharts)
	{
		this.chart = chart;
		this.oldViewStack = [];
		this.viewPtCap = viewPtCap; // max num of points to render per chart
		this.lineFloor = lineFloor; // min num points to render per line
		this.currentView = new DataView(lines, [[null, null], [null, null]],
			[[null, null], [null, null]], this.lineFloor);
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
			userBounds = [[axisX.viewportMinimum, axisY.viewportMinimum],
				[axisX.viewportMaximum, axisY.viewportMaximum]];

		this.oldViewStack.push(this.currentView);
		// already below point threshold
		// panning restriction/simplification are unnecessary
		// simply mimic native CanvasJS zooming
		if (this.currentView.numPoints <= this.viewPtCap)
		{
			this.currentView = this.currentView.shallowClone();
			this.currentView.boundsVP = userBounds;
		}
		// continue with dynamic simplification
		else
		{
			console.log("hmm");
			console.time("Subview (Zoom)");
			this.currentView = this.currentView.subView(userBounds, userBounds,
				this.lineFloor);
			console.timeEnd("Subview (Zoom)");
		}
		this.renderDataView(this.currentView);
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

		this.renderDataView(this.currentView = this.oldViewStack.pop());
		return;
	};

	/*
		private static helper method
		set a chart's x and y axis viewports to given limits
		--> setting axis min/max means no panning
	*/
	function setChartBounds(chart, dataview)
	{
		var boundsVP = dataview.boundsVP,
			boundsAxis = dataview.boundsAxis;

		chart.options.axisX = {
			viewportMinimum: boundsVP[0][0],
			viewportMaximum: boundsVP[1][0]
		};
		chart.options.axisY = {
			viewportMinimum: boundsVP[0][1],
			viewportMaximum: boundsVP[1][1]
		};

		chart.options.axisX.minimum = boundsAxis[0][0];
		chart.options.axisX.maximum = boundsAxis[1][0];
		chart.options.axisY.minimum = boundsAxis[0][1];
		chart.options.axisY.maximum = boundsAxis[1][1];
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
			dataview.cachedSimpLines : dataview.simplifyView(this.viewPtCap);

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
		setChartBounds(this.chart, dataview);

		this.chart.render();

		// any sync charts
		for (i = 0, chart = null; i < this.syncCharts.length; i++)
		{
			setChartBounds(this.syncCharts[i], dataview);
			this.syncCharts[i].render();
		}
	};

	ZoomManager.prototype.render = function()
	{
		this.renderDataView(this.currentView);
	};

	return ZoomManager;
})();