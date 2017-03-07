// semi-randomly generate <numLines> lines, each with <limit> points
function generatePoints(numLines, limit)
{
	var data = [];
	var y = 0;
	for (var i = 0; i < numLines; i++)
	{
		//var dataSeries = { type: "line" };
		var dataPoints = [];
		for (var j = 0; j < limit; j += 1)
		{
			y += (Math.random() * 10 - 5);
			// [x, y, priority, "workspace" boolean, index]
			dataPoints.push([j - limit / 2, y, 0, false, j]);
		}
		//dataSeries.dataPoints = dataPoints;
		data.push(dataPoints);
	}
	return data;
}

// 200, 10000
var numLines = 200;
var limit = 10000;    //increase number of dataPoints by increasing this

console.log("Number of Lines: " + numLines);
console.log("Points per line: " + limit);

var rawData = generatePoints(numLines, limit);

console.time("VW Simplification");
for (var i = 0; i < rawData.length; i++)
{
	Simplify.VisvalWhyattRank(rawData[i]);
}
console.timeEnd("VW Simplification");

/*var test = rawData[0].slice();
console.log(quickSelect(test, 2, function(a, b){ return a[2] - b[2]; }));
console.log(test.sort(function(a, b){ return a[2] - b[2]; }));*/
window.onload = function()
{
	var width = 550;
	var height = 300;
	// initialize & render normal chart
	var chartFull = CanvasHelper.initEmptyChart("chartContainer", height, width);
	chartFull.options.data = CanvasHelper.linesToCanvasObjects(rawData);
	chartFull.render();

	// initialize & render zoomable, simplified chart
    var chartZoom = CanvasHelper.initEmptyChart("chartContainerVW", height, width);
    var zm = new ZoomManager(chartZoom, 50000, 50, rawData, [chartFull]);
    zm.render();


};
