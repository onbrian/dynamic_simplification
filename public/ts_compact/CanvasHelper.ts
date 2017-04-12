module CanvasHelper 
{
    export function segmentToCanvasObject<T extends SimplifyData.AbstractPointWrapper>(
        segment: T[]): CanvasJS.ChartDataOptions
    {
        let segmentData: CanvasJS.ChartDataPoint[] = [];

        for (let i = 0; i < segment.length; i++)
            segmentData.push(segment[i].toCanvasPointObject());

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

    export function linesToCanvasObjects<T extends SimplifyData.AbstractPointWrapper>(
        lines: T[][]): CanvasJS.ChartDataOptions[]
    {
        let segments: CanvasJS.ChartDataOptions[] = [];
        for (let i = 0; i < lines.length; i++) {
            segments.push(CanvasHelper.segmentToCanvasObject<T>(lines[i]));
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