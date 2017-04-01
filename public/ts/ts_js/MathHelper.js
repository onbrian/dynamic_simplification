var MathHelper = (function () {
    function MathHelper() {
    }
    /*
        Get the intersection between vertical line x=<x>
        and the line defined by points <a> & <b>
    */
    MathHelper.intersectX = function (a, b, x) {
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
    };
    /*
        Get the intersection between horizontal line y=<y>
        and the line defined by points <a> & <b>
    */
    MathHelper.intersectY = function (a, b, y) {
        return [(y - a[MathHelper.AXIS_Y])
                * (b[MathHelper.AXIS_X] - a[MathHelper.AXIS_X]) /
                (b[MathHelper.AXIS_Y] - a[MathHelper.AXIS_Y]) + a[MathHelper.AXIS_X], y];
    };
    MathHelper.triangleArea = function (a, b, c) {
        return Math.abs((a[0] - c[0]) *
            (b[1] - a[1]) - (a[0] - b[0]) *
            (c[1] - a[1]));
    };
    MathHelper.getSqSegDist = function (p, a, b) {
        var x = a[0], y = a[1], bx = b[0], by = b[1], px = p[0], py = p[1], dx = bx - x, // horizontal distance between <a> and <b>
        dy = by - y; // vertical distance between <a> and <b>
        // check up on this later
        if (dx !== 0 || dy !== 0) {
            var t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
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
    };
    return MathHelper;
}());
export { MathHelper };
MathHelper.AXIS_X = 0;
MathHelper.AXIS_Y = 1;
