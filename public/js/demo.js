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

function simplifyLineV1(rankFunction, line, percent)
{
	// number of points to include
	var num = parseInt(percent * line.length, 10);
	//console.log(num);
	var ranked = rankFunction(line);
	var simplified = ranked.slice(0, num);
	simplified.sort(function(a, b){ return a[4] - b[4]; });
	return simplified;
}

function simplifyLineV2(line, percent)
{
	// number of points to include
	var num = parseInt(percent * line.length, 10);
	//console.log(num);
	var ranked = Simplify.VisvalWhyattRank(line);
	//console.log(ranked);
	for (var i = 0; i < num; i++)
	{
		ranked[i][3] = true;
	}
	var simplified = [];

	for (i = 0, p = null; i < line.length; i++)
	{
		p = line[i];

		if (p[3]) simplified.push(p);
		// found all points -- return
		if (simplified.length === num) break;
	}
	return simplified;
}

// semi-randomly generate <numLines> lines, each with <limit> points

var numLines = 3;
var limit = 10000;    //increase number of dataPoints by increasing this
var percent = 0.05;

console.log("Number of Lines: " + numLines);
console.log("Points per line: " + limit);
console.log("Points per simplified line: " + limit*percent);
console.log("Simplification rate: " + percent + " (reduced by "  + (1 - percent)*100 + "%)");

var data = generatePoints(numLines, limit);

var simpDataVW = [],
	simpDataRDP = [];
console.time("VW Simplification");
for (var i = 0; i < data.length; i++)
{
	simpDataVW.push(simplifyLineV1(Simplify.VisvalWhyattRank, data[i], percent));
}
//console.log(simpDataVW);
console.timeEnd("VW Simplification");
console.time("RDP Simplification");
for (var i = 0; i < data.length; i++)
{
	simpDataRDP.push(simplifyLineV1(Simplify.RamerDouglasRank, data[i], percent));
}

//console.log(simpDataRDP);
console.timeEnd("RDP Simplification");

data = CanvasHelper.linesToCanvasObjects(data);
simpDataVW = CanvasHelper.linesToCanvasObjects(simpDataVW);
simpDataRDP = CanvasHelper.linesToCanvasObjects(simpDataRDP);
window.onload = function ()
{
	var chartFull = CanvasHelper.initEmptyChart("chartContainer", 210, 500);
	var chartSimpVW = CanvasHelper.initEmptyChart("chartContainerVW", 210, 500);
	var chartSimpRDP = CanvasHelper.initEmptyChart("chartContainerRDP", 210, 500);
	
	chartFull.options.data = data;
	chartSimpVW.options.data = simpDataVW;
	chartSimpRDP.options.data = simpDataRDP;

	chartFull.render();
    chartSimpVW.render();
    chartSimpRDP.render();
};