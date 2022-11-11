/**
 * Represents a vector as well as a point.
 * Methods that transform the mutable vector are chainable.
 * @example
 * print("sadf","fooooo");
 * print("foo");
 * draw({x:2,y:4});
 * @constructor
 * @param {Number} x
 * @param {Number} y
 */
var Vect = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

var ZERO = new Vect(0, 0);
var ABSCISSA = new Vect(1, 0);
var ORDINATE = new Vect(0, 1);

Vect.ZERO = ZERO;
Vect.ABSCISSA = ABSCISSA;
Vect.ORDINATE = ORDINATE;


/**
 * @example
 * print(new Vector(2,4).toString());
 * @return {String}
 */
Vect.prototype.toString = function () {
    return 'x: ' + this.x + ' y: ' + this.y;
};

/**
 * Clone!
 * @return {Vect}
 */
Vect.prototype.clone = function () {
    return new Vect(this.x, this.y);
};

Vect.prototype.cl = Vect.prototype.clone;


/**
 * Sets the coordinates of this Vect.
 * (Without instantiating a new object)
 * @param {Number} x
 * @param {Number} y
 */
Vect.prototype.set = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
    return this;
};

Vect.prototype.invert = function () {
    this.x = -this.x;
    this.y = -this.y;
    return this;
};

Vect.prototype.mirrorOnX = function () {
    this.y = -this.y;
    return this;
};

Vect.prototype.mirrorOnY = function () {
    this.x = -this.x
    return this;
}

/**
 *
 */
Vect.prototype.xComponent = function () {
    this.y = 0;
    return this;
};

/**
 *
 */
Vect.prototype.yComponent = function () {
    this.x = 0;
    return this;
};

/**
 * Scalar multiplication.
 * Each coordinate will be multiplied with the given scalar.
 * @chainable
 * @param {Number} a scalar to multiply the vector with
 * @return {Vect}
 */
Vect.prototype.mul = function (s) {
    this.x *= s;
    this.y *= s;
    return this;
};

/**
 * Scalar division.
 * Each coordinate will be divided by the given scalar.
 * @chainable
 * @param {Number} a scalar to divide the vector with
 * @return {Vect}
 */
Vect.prototype.div = function (s) {
    this.x /= s;
    this.y /= s;
    return this;
};

/**
 * Adds a vector.
 * @chainable
 * @param {Vect} v
 * @return {Vect}
 */
Vect.prototype.add = function (v) {
    this.x += v.x;
    this.y += v.y;
    return this;
};

/**
 * Substracts a vector.
 * @chainable
 * @param {Vect} v
 * @return {Vect}
 */
Vect.prototype.sub = function (v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
};

/**
 * Dot product of this and the given vector.
 * @param v
 * @return {number}
 */
Vect.prototype.dot = function (v) {
    return this.x * v.x + this.y * v.y;
};

/**
 * Not exactly the cross product, because seems not to be defined for 2d vectors.
 *
 * "Gives the Z-component of 3d cross product, if the two given
 * vectors where extended to 3d vectors."
 * or
 * "Determinant of a 2x2 matrix build by the two vectors."
 *
 * Usefull to find the orientation of the two vectors.
 *
 * @param v
 * @return {number}
 */
Vect.prototype.cross = function (v) {
    return (this.x * v.y) - (this.y * v.x);
};

/**
 * Product of two vectors needed for the Gauss's area formula.
 *
 * Describes the doubled area of the shape that is enclosed by
 * (this.x,0), (v.x,0), (v.x,v.y),(this.x,this.y).
 * So its an area based on the x-axis. If you reflect it on the x-axis,
 * you get the trapeze of which the area value is calculated.
 *
 * Needed for orientation and area of a polygon.
 * @see Polygon.prototype.getArea() //TODO
 * @example
 * const u = new Vect(3,5);
 * const v = new Vect(5,7);
 * const polygon = new Polygon(u, u.clone().mirrorOnX(), v.clone().mirrorOnY(), v);
 * const result = u.trapeze(v);
 *
 * print(result);
 * draw(u,v,polygon);
 *
 * @param v
 */
Vect.prototype.trapeze = function (v) {
    return (v.x - this.x) * (v.y + this.y);
}

/**
 * Normalize the given vector.
 *
 * Optional parameter length can be used ass abbreviation.
 * v.normalize.mul(33) -> v.normalize(33);
 * @param {number} length
 *  [optional] length of the target vector. If not set, length is 1.0.
 *
 * @return {Vect}
 */
Vect.prototype.normalize = function (length) {
    var currenLength = this.length();
    if (currenLength === 0) {
        this.x = 1;
        this.y = 0;
    } else {
        this.div(currenLength);
    }
    if (length)
        this.mul(length);
    return this;
};


/**
 * Quadratic length of the vector.
 * y lengthSq
 * @return {number}
 */
Vect.prototype.lengthSq = function () {
    return this.x * this.x + this.y * this.y;
};

/**
 * Euclidean norm/length/magnitude of the vector.
 * @return {number}
 */
Vect.prototype.length = function () {
    return Math.sqrt(this.lengthSq());
};

/**
 * Quadratic distance of two vectors.
 * @param v
 * @return {number}
 */
Vect.prototype.distanceSq = function (v) {
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    return dx * dx + dy * dy;
};

/**
 * Euclidean distance of two vectors.
 * @param v
 * @return {number}
 */
Vect.prototype.distance = function (v) {
    return Math.sqrt(this.distanceSq(v));
};

/**
 * Manhatten/city block/Taxicab distance
 * @param v
 * @return {number}
 */
Vect.prototype.manhatten = function (v) {
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    return Math.abs(dx) + Math.abs(dy);
};

/**
 * y isLeftOf
 * @param v
 * @return {boolean}
 */
Vect.prototype.isLeftOf = function (v) {
    if (Garfunkel.getXIsLeftOfY())
        return this.cross(v) > 0;
    else
        return this.cross(v) < 0;
};


/**
 * @param v
 * @return {boolean}
 */
Vect.prototype.isRightOf = function (v) {
    if (Garfunkel.getXIsLeftOfY())
        return this.cross(v) < 0;
    else
        return this.cross(v) > 0;
};

/**
 * @chainable
 * @return {Vect}
 */
Vect.prototype.turnLeft = function () {
    var x = this.y * (Garfunkel.getXIsLeftOfY() ? 1 : -1);
    var y = this.x * (Garfunkel.getXIsLeftOfY() ? -1 : 1);
    this.x = x;
    this.y = y;
    return this;
};

/**
 * @chainable
 * @return {Vect}
 */
Vect.prototype.turnRight = function () {
    var x = this.y * (Garfunkel.getXIsLeftOfY() ? -1 : 1);
    var y = this.x * (Garfunkel.getXIsLeftOfY() ? 1 : -1);
    this.x = x;
    this.y = y;
    return this;
};

/**
 * @chainable
 * @return {Vect}
 */
Vect.prototype.leftNormal = function () {
    this.turnLeft().normalize();
    return this;
};

/**
 * @chainable
 * @return {Vect}
 */
Vect.prototype.rightNormal = function () {
    this.turnRight().normalize();
    return this;
};


/**
 * Gives the angle between a reference vector and this.
 * The result is between [PI,-PI).
 * In school coordinates, the angle is counted <strong>counter clockwise</strong>
 * from reference to the vector. In game coordinates, the angle is counted <strong>clockwise</strong>
 * from reference to the vector.
 *
 * @param {Vector} ref
 *  [optional] reference vector. default: (1,0).
 * @return {number}
 */
Vect.prototype.angle = function (ref) {
    var result;
    if (!(ref instanceof Vect)) {
        return Math.atan2(this.y, this.x); // (- Math.atan2(0,1))
    } else {
        result = Math.atan2(this.y, this.x) - Math.atan2(ref.y, ref.x);
        if (result > Math.PI) {
            result = result - Math.PI * 2;
        } else if (result < -Math.PI) {
            result = Math.PI * 2 + result;
        }
    }
    return result;
};

/**
 * Rotates the vector by the given angle.
 * If you take the vector as a point, the default pivot is {x:0,y:0}
 *
 * @chainable
 * @param {number} angle
 *      in radians
 * @param {Vect} pivot
 *      [optional] default is {x:0,y:0}
 * @return {Vect} the rotated vector
 */
Vect.prototype.rotate = function (angle, pivot) {
    pivot = pivot || ZERO;
    var _x = pivot.x
        + ((this.x - pivot.x) * Math.cos(angle))
        - ((this.y - pivot.y) * Math.sin(angle));
    var _y = pivot.y
        + ((this.x - pivot.x) * Math.sin(angle))
        + ((this.y - pivot.y) * Math.cos(angle));
    this.x = _x;
    this.y = _y;
    return this;
};


/**
 * Rotates the vector to the given angle.
 * @chainable
 * @param {number} angle in radians
 * @return {Vect} the rotated vector
 */
Vect.prototype.rotateTo = function (angle) {
    this.rotate(angle - this.angle());
    return this;
};

/**
 * Rotates the vector towards the given angle.
 * The rotation is limited by stepSize, so move a 0° vector towards 90° with limit 50°
 * would result in a 50° vector. If the method with the same limit is reapplied again
 * the result would be 90°.
 *
 * The rotation will take the "shortest way" towards the given angle.
 *
 * @chainable
 * @param {number} angle - angle in radians
 * @param {number} stepSize - maximum angle to move towards angle
 * @return {Vect} the rotated vector
 */
Vect.prototype.rotateTowards = function (angle, stepSize) {
    this.rotate(angle - this.angle());
    //TODO
    return this;
};


/**
 *  "angle of incidence equal to the angle of reflexion"
 *  Performs a simple reflection of this object on a surface
 *  that has the direction of the given vector u.
 *  @param {Vect} u
 */
Vect.prototype.reflectOn = function (u) {
    var l, n, r;
    if (this.isRightOf(u)) {
        l = this.clone();
        n = u.clone().leftNormal();
        r = l.sub(n.clone().mul(n.dot(l) * (2)));
    } else if (this.isLeftOf(u)) {
        l = this.clone();
        n = u.clone().rightNormal();
        r = l.sub(n.clone().mul(n.dot(l) * (2)));
    } else {
        r = this.clone().invert();
    }
    this.x = r.x;
    this.y = r.y;
    return this;
};

export default Vect;