/**
 * A line segment represented by two points.
 *
 * (The line segment has a orinentation given by the order or the two points.)
 * @class Segment
 * @constructor
 * @param {Object} p1
 * @param {Object} p2
 */
var Segment = function (p1, p2) {
    this.p1 = (p1 || new Vect(0, 0)).clone();
    this.p2 = (p2 || new Vect(1, 0)).clone();
};

/**
 * Create segment from support and connection vector
 */
Segment.fromSupport = function (support, connection) {
    return new Segment(support, support.clone().add(connection));
}


Segment.prototype.getBoundingBox = function () {
    return new Box.fromSegment(this);
};


Segment.prototype.connection = function () {
    return this.p2.clone().sub(this.p1);
};
//Segment.prototype.getConnection = Segment.prototype.connection;

Segment.prototype.direction = function () {
    return this.connection().normalize();
};

Segment.prototype.toString = function () {
    return '[ ' + this.p1 + ' , ' + this.p2 + ' ]';
};

Segment.fromArray = function (arr) {
    return new Segment(new Vect(arr[0], arr[1]), new Vect(arr[2], arr[3]));
};

Segment.fromObject = function (obj) {
    return new Segment(obj.p1, obj.p2);
};

Segment.prototype.clone = function () {
    return new Segment(this.p1.clone(), this.p2.clone());
};


/**
 * Move Segment to center. Keeps direction and length
 */
Segment.prototype.toCenter = function () {
    return this.translate(Vect.ZERO.clone().sub(this.p1));
};

/**
 * Move every point by v
 * @param v
 */
Segment.prototype.translate = function (v) {
    this.p1.add(v);
    this.p2.add(v);
    return this;
};


/**
 * Gives a point on the segment.
 * number:
 *  0   -> p1
 *  1   -> p2
 *  0.5 -> middle between p1,p2
 *  <0  -> a point beyond p1 on the line the segment defines
 *  >1  -> a point beyond p2 on the line the segment defines
 *
 *
 * @param {number} position
 *   number between [0,1] to get a point between p1 and p2.
 *
 */
Segment.prototype.getPoint = function (position) {
    return new Vect(this.p2.x * position + this.p1.x * (1 - position),
        this.p2.y * position + this.p1.y * (1 - position));
};

/**
 * Return the middle between p1 and p2
 * @return {Vect}
 *      middle point of the Segment
 */
Segment.prototype.getMiddle = function () {
    return this.getPoint(0.5);
};

/**
 * Rotate the Segment
 * @param {number} angle
 *      in radians
 * @param {Vect} pivot
 *      [optional] default is this.p1, *not* {x:0,y:0}
 * @returns {Segment}
 */
Segment.prototype.rotate = function (angle, pivot) {
    if (pivot) {
        this.p1.rotate(angle, pivot);
    } else {
        pivot = this.p1;
    }
    this.p2.rotate(angle, pivot);
    return this;
};

Segment.prototype.angle = function (ref) {
    return this.connection().angle(ref);
};


Segment.prototype.length = function () {
    return this.connection().length();
};

Segment.prototype.lengthSq = function () {
    return this.connection().lengthSq();
};


/**
 *
 * @param s
 * @returns {boolean}
 *      true, if the both segments intersect
 */
Segment.prototype.intersect = function (s) {

    var touchOrCross = function (s1, s2) {

        // s1 as line, s2 as two points
        var u = s1.connection(); // Move this.p1 to ZERO
        var v = s2.p1.clone().sub(s1.p1);
        var w = s2.p2.clone().sub(s1.p1);

        // Check on which side the points of s2 are
        var c1 = v.cross(u);
        var c2 = w.cross(u);
        if (Math.abs(c1) < Garfunkel.EPSILON || Math.abs(c2) < Garfunkel.EPSILON)
            return true; // s2 touches s1
        return (c1 > 0) !== (c2 > 0);
        // if both points on opposite sites -> s2 cross s1
    };
    return this.getBoundingBox().intersect(s.getBoundingBox())
        && touchOrCross(this, s)
        && touchOrCross(s, this);
};

Segment.prototype.intersect2 = function (s) {

};

export default Segment;