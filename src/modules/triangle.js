/**
 * @class Triangle
 * @param a
 * @param b
 * @param c
 * @constructor
 */
var Triangle = function (a, b, c) {
    this.a = a.clone();
    this.b = b.clone();
    this.c = c.clone();
};


Triangle.prototype.angleA = function () {
    var v = this.b.clone().sub(this.a);
    var w = this.c.clone().sub(this.a);
    var angle = v.angle(w);
    if (angle >= Math.PI)
        return w.angle(v);
    return angle;
};

Triangle.prototype.angleB = function () {
    var v = this.a.clone().sub(this.b);
    var w = this.c.clone().sub(this.b);
    var angle = v.angle(w);
    if (angle >= Math.PI)
        return w.angle(v);
    return angle;
};

Triangle.prototype.angleC = function () {
    var v = this.a.clone().sub(this.c);
    var w = this.b.clone().sub(this.c);
    var angle = v.angle(w);
    if (angle >= Math.PI)
        return w.angle(v);
    return angle;
};


export default Triangle;