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
			dataPoints.push([j - limit / 2, y, 0, false, j])
		}
		//dataSeries.dataPoints = dataPoints;
		data.push(dataPoints);
	}
	return data;
}

function generateRandomPoints(numLines, numPoints, max)
{
	function randNum()
	{
		return Math.random() * (max);
	}
	var data = [];
	for (var i = 0; i < numLines; i++)
	{
		var line = []
		for (var j = 0; j < numPoints; j++)
			line.push([randNum(), randNum(), 0, false, j]);
		data.push(line)
	}
	return data;
}

function simplifyLine(rankFunction, line, percent)
{
	// number of points to include
	var num = parseInt(percent * line.length, 10);
	//console.log(num);
	var ranked = rankFunction(line);
	var simplified = ranked.slice(0, num);
	simplified.sort(function(a, b){ return a[4] - b[4]});
	return simplified;
}

function printSortedIndices(list)
{
	var indices = [];
	for (var i = 0; i < list.length; i++)
		indices.push(list[i][4])
	indices.sort();
	console.log(indices.toString());
}
function bruteForce2DSearch(kdtree, points, x1, x2, y1, y2)
{
	var subset = [];
	for (var i = 0; i < points.length; i++)
	{	
		var point = points[i];
		if (kdtree.inBounds2D(point, x1, x2, y1, y2))
			subset.push(point);
	}
	return subset;
}

function drawNode(depth, node, parents)
{
	var nodeTemplate = _.template($("#kdnodeTemplate").html());
	var templateData = {
		depth: depth,
		axis: node.axis,
		cut: node.cut === null ? "None" : [node.cut[0], node.cut[1].toFixed(2)],
		cutIndex: node.cut === null ? "None" : node.cut[4],
		leaf: node.isLeaf,
		points: node.points === null ? "None" : node.points.toString(),
	};

	$("#kdtreeContainer").html(nodeTemplate(templateData));

	// bind events

	$("#nodeParent").on("click", function(e)
	{
		console.log("go parent");
		if (depth === 0)
		{
			console.log("At root!");
			return;
		}
		drawNode(depth - 1, parents.pop(), parents);
	});

	$("#nodeChildLeft").on("click", function(e)
	{
		if (node.leftChild === null)
		{
			console.log("null left child");
			return;
		}
		parents.push(node);
		drawNode(depth + 1, node.leftChild, parents);
	});

	$("#nodeChildRight").on("click", function(e)
	{
		if (node.rightChild === null)
		{
			console.log("null right child");
			return;
		}
		parents.push(node);
		drawNode(depth + 1, node.rightChild, parents);
	});
}

/*
var points = [
	[1, 23],
	[2, 4],
	//
	[5, 6],
	[12, 8],
	[15, 34],
	[21, 32],
	[26, 12],//
	[29, 16],//
	//
	[32, 34],
	[38, 38],
	[100, 100],
];*/

var points = [
	[-10, 3.009, 0, 0, 0], // 0
	[-9, 0.965, 0, 0, 1], // 1
	[-8, 3.862, 0, 0, 2], // 2
	[-7, 2.359, 0, 0, 3], // 3
	[-6, 1.343, 0, 0, 4], // 4
	[-5, 5.561, 0, 0, 5], // 5
	[-4, 5.369, 0, 0, 6], // 6
	[-3, 1.646, 0, 0, 7], // 7
	[-2, 5.040, 0, 0, 8], // 8
	[-1, 3.015, 0, 0, 9], // 9
	[0, 4.731, 0, 0, 10], // 10
	[1, 7.365, 0, 0, 11], // 11
	[2, 4.542, 0, 0, 12], // 12
	[3, 2.324, 0, 0, 13], // 13
	[4, 2.785, 0, 0, 14], // 14
	[5, 0.149, 0, 0, 15], // 15
	[6, -0.298, 0, 0, 16], // 16
	[7, -2.286, 0, 0, 17], // 17
	[8, -6.506, 0, 0, 18], // 18
	[9, -5.197, 0, 0, 19], // 19
]

// interpolate using mustache's syntax style to prevent conflicts w ejs
_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;

var data = generateRandomPoints(1, 100, 10000);
console.log(data);
// var data = [points]
/*
for (var i = 0; i < data[0].length; i++)
{
	console.log(data[0][i])
}*/

// var kdtree = new KDTree(points);
var x1 = 100, x2 = 300, y1 = 200, y2 = 400;
console.time("KDTree Build");
var kdtree = new KDTree(data[0]);
console.timeEnd("KDTree Build");
console.log(kdtree);

drawNode(0, kdtree.root, []);

console.log(kdtree.sanityCheck(kdtree.root));

console.time("KD Search");
var solutionsKD = kdtree.search(x1, x2, y1, y2);
console.timeEnd("KD Search");
console.log("kd: " + solutionsKD.length);
//console.log(solutionsKD);
// printSortedIndices(solutionsKD);

console.time("Brute 2D Search");
var solutionsBrute = bruteForce2DSearch(kdtree, data[0], x1, x2, y1, y2);
console.timeEnd("Brute 2D Search");
console.log("brute force: " + solutionsBrute.length);
//console.log(solutionsBrute);
// printSortedIndices(solutionsBrute)

data = CanvasHelper.linesToCanvasObjects(data);

window.onload = function ()
{
	var chartFull = CanvasHelper.initEmptyChart("chartContainer", 200, 400);
	chartFull.options.data = data;
	//chartFull.render();
}