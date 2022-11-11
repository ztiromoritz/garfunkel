/**
 *
 * A rectangular box with edges parallel to the coordinate axes.
 *
 * So:
 *        Box#left &le; Box#right
 *        Box#top  &le; Box#bottom
 *
 * @class Box
 * @constructor
 * @param {Number} x0
 * @param {Number} x1
 * @param {Number} y0
 * @param {Number} y1
 */
var Box = function (x0, x1, y0, y1) {
    this.left = Math.min(x0, x1);
    this.right = Math.max(x0, x1);

    this.y_min = Math.min(y0, y1);
    this.y_max = Math.max(y0, y1);
    this.top = Garfunkel.getXIsLeftOfY() ? this.y_min : this.y_max;
    this.bottom = Garfunkel.getXIsLeftOfY() ? this.y_max : this.y_min;
};

/**
 * Bounding box of a given Segment
 * @static
 * @param {Segment} segment
 */
Box.fromSegment = function (segment) {
    return new Box(segment.p1.x, segment.p2.x, segment.p1.y, segment.p2.y);
};

Box.fromObject = function (obj) {
    return new Box(obj.x0, obj.x1, obj.y0, obj.y1);
};

/**
 * @return {string}
 */
Box.prototype.toString = function () {
    return "[ left: " + this.left + " right: " + this.right + " top: " + this.top + " bottom: " + this.bottom + " ]";
};

Box.prototype.containsPoint = function (p) {
    return this.left <= p.x && p.x <= this.right//
        && this.y_min <= p.y && p.y <= this.y_max;
};

Box.prototype.intersect = function (box) {
    return this.left <= box.right && box.left <= this.right//
        && this.y_min <= box.y_max && box.y_min <= this.y_max;
};

Box.prototype.translate = function (v) {
    this.left += v.x;
    this.right += v.x;
    this.y_min += v.y;
    this.y_max += v.y;
    this.top += v.y;
    this.bottom += v.y;
};

export default Box;