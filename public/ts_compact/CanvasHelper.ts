module CanvasHelper 
{
    export function segmentToCanvasObject(segment: Array<Array<number>>): CanvasJS.ChartDataOptions
    {
        let segmentData: Array<CanvasJS.ChartDataPoint> = [];

        for (let i = 0; i < segment.length; i++) {
            segmentData.push({ x: segment[i][0], y: segment[i][1] });
        }

        let canvasObject: CanvasJS.ChartDataOptions = {
            type: "line",
            click: function (e) {
                console.log(e);
            },
            markerType: "none", // so data points don't become circles
            dataPoints: segmentData
        };
        return canvasObject;
    }

    export function linesToCanvasObjects(lines: Array<Array<Array<number>>>): Array<CanvasJS.ChartDataOptions>
    {
        let segments: Array<CanvasJS.ChartDataOptions> = [];
        for (let i = 0; i < lines.length; i++) {
            segments.push(CanvasHelper.segmentToCanvasObject(lines[i]));
        }
        return segments;
    }

    export function initEmptyChart(elementID: string, height: number, width: number): CanvasJS.Chart
    {
        let chart: CanvasJS.Chart = new CanvasJS.Chart(elementID,
        {
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
    }
}