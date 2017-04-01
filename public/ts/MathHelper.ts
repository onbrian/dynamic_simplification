export class MathHelper
{
    public static AXIS_X: number = 0;
    public static AXIS_Y: number = 1;

    constructor() { }

	/*	
		Get the intersection between vertical line x=<x>
		and the line defined by points <a> & <b>
	*/
    public static intersectX(a: Array<number>, b: Array<number>, x: number): Array<number>
    {
        /*	
            compute slope
            m = (b[1] - a[1])/(b[0] - a[0])
            compute b using point a
            b = y - mx
              = a[1] - m*a[0]
            compute y
            y = mx + a[1] - m*a[0]
              = mx - m*a[0] + a[1]
              = m(x - a[0]) + a[1]
        */
        return [x, (x - a[MathHelper.AXIS_X])
            * (b[MathHelper.AXIS_Y] - a[MathHelper.AXIS_Y]) /
            (b[MathHelper.AXIS_X] - a[MathHelper.AXIS_X]) + a[MathHelper.AXIS_Y]];
    }

    /*	
		Get the intersection between horizontal line y=<y>
		and the line defined by points <a> & <b>
	*/
    public static intersectY(a: Array<number>, b: Array<number>, y: number): Array<number>
    {
        return [(y - a[MathHelper.AXIS_Y])
            * (b[MathHelper.AXIS_X] - a[MathHelper.AXIS_X]) /
            (b[MathHelper.AXIS_Y] - a[MathHelper.AXIS_Y]) + a[MathHelper.AXIS_X], y];
    }

    public static triangleArea(a: Array<number>, b: Array<number>, c: Array<number>): number
    {
        return Math.abs((a[0] - c[0]) *
            (b[1] - a[1]) - (a[0] - b[0]) *
            (c[1] - a[1]));
    }

    public static getSqSegDist(p: Array<number>, a: Array<number>, b: Array<number>): number
    {
        let x: number = a[0], y: number = a[1],
            bx: number = b[0], by: number = b[1],
            px: number = p[0], py: number = p[1],
            dx: number = bx - x, // horizontal distance between <a> and <b>
            dy: number = by - y; // vertical distance between <a> and <b>

        // check up on this later
        if (dx !== 0 || dy !== 0) {
            let t: number = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);

            if (t > 1) {
                x = bx;
                y = by;

            }
            else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }

        dx = px - x;
        dy = py - y;

        return dx * dx + dy * dy;
    }
}