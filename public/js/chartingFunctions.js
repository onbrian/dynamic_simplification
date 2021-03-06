// dependencies: None

var CanvasHelper = (function()
{
	function segmentToCanvasObject(segment)
	{
		var segmentData = [];
		var canvasObject = {
			type: "line",
			click: function(e){
				console.log(e);
			},
			markerType: "none", // so data points don't become circles
			dataPoints: segmentData
		};
		for (var i = 0; i < segment.length; i++)
		{
			segmentData.push({x: segment[i][0], y: segment[i][1]});
		}
		return canvasObject;
	}

	function linesToCanvasObjects(line)
	{
		var segments = [];	
		for (var i = 0; i < line.length; i++)
		{
			segments.push(segmentToCanvasObject(line[i]));
		}
		return segments;
	}

	function initEmptyChart(elementID, height, width)
	{
		var chart = new CanvasJS.Chart(elementID,
		{
			zoomEnabled: true,
			zoomType: "xy",
			legend: {
				horizontalAlign: "right",
				verticalAlign: "center"
			},
			axisY:{
				includeZero: true
			},
			width: width,
			height: height
		});

		return chart;
	}

	return {
		segmentToCanvasObject: segmentToCanvasObject,
		linesToCanvasObjects: linesToCanvasObjects,
		initEmptyChart: initEmptyChart
	};
})();