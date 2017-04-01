/// <reference path="./typings/canvasjs.d.ts" />
var CanvasHelper = (function () {
    function CanvasHelper() {
    }
    ;
    CanvasHelper.segmentToCanvasObject = function (segment) {
        var segmentData = [];
        for (var i = 0; i < segment.length; i++) {
            segmentData.push({ x: segment[i][0], y: segment[i][1] });
        }
        var canvasObject = {
            type: "line",
            click: function (e) {
                console.log(e);
            },
            markerType: "none",
            dataPoints: segmentData
        };
        return canvasObject;
    };
    CanvasHelper.linesToCanvasObjects = function (lines) {
        var segments = [];
        for (var i = 0; i < lines.length; i++) {
            segments.push(CanvasHelper.segmentToCanvasObject(lines[i]));
        }
        return segments;
    };
    CanvasHelper.initEmptyChart = function (elementID, height, width) {
        var chart = new CanvasJS.Chart(elementID, {
            title: "",
            data: null,
            zoomEnabled: true,
            zoomType: "xy",
            legend: {
                horizontalAlign: "right",
                verticalAlign: "center"
            },
            axisY: {
                includeZero: true
            },
            width: width,
            height: height
        });
        return chart;
    };
    return CanvasHelper;
}());
export { CanvasHelper };
