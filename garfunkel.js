/**
 * garfunkel.js - A 2D geometry toolbox
 * @module Garfunkel
 */
(function (global) {

    var X_IS_LEFT_TO_Y = true;

    /**
     * Static Method
     * @class Garfunkel
     */
    var Garfunkel = {};

    /**
     * General orientation of the coordinate system. This is a global setting for this module.
     *
     * Used for the isLeftOf, isRightOf, getLeftNormal, getRightNormal functions.
     *
     * FALSE, means the normal school book coordinates with (0,0) in the lower left corner.
     * TRUE, means the canvas or graphic coordinates with (0,0) in the upper left corner;
     *
     * @static
     * @method getXIsLeftOfY
     * @default "true"
     * @return {boolean}
     */
    Garfunkel.getXIsLeftOfY = function () {
        return X_IS_LEFT_TO_Y;
    };

    /**
     *
     * @static
     * @method setXIsLeftOfY
     * @default "true"
     * @param {boolean} value
     */
    Garfunkel.setXisLeftOfY = function (value) {
        X_IS_LEFT_TO_Y = value;
    };

    /**
     * @static
     * @method setGameCoords
     */
    Garfunkel.setGameCoords = function () {
        X_IS_LEFT_TO_Y = true;
    };

    /**
     * @static
     * @method setSchoolCoords
     */
    Garfunkel.setSchoolCoords = function () {
        X_IS_LEFT_TO_Y = false;
    };

    Garfunkel.isVect = function isVect(obj) {
        return obj instanceof Garfunkel.Vect;
    };

    Garfunkel.isBox = function isBox(obj) {
        return obj instanceof Garfunkel.Box;
    };

    Garfunkel.isSegment = function isSegment(obj) {
        return obj instanceof Garfunkel.Segment;
    };

    Garfunkel.isLine = function isLine(obj) {
        return obj instanceof Garfunkel.Line;
    };

    Garfunkel.isRay = function isRay(obj) {
        return obj instanceof Garfunkel.Ray;
    };

    var EPSILON = 0.000001;

    /**
     *  Represents a vector as well as a point.
     *
     *
     * All Methods on a Vector that return a vector are
     * chainable and will change the initial vector to
     * the result of the operation.
     *
     * @class Vect
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


    /**
     * <img src="../assets/logo.jpg"></img>
     * @example
     * <pre>new Vector(2,4).toString() -> "x: 2 y: 4" </pre>
     * @method toString
     * @return {String}
     */
    Vect.prototype.toString = function () {
        return 'x: ' + this.x + ' y: ' + this.y;
    };

    /**
     * @method clone
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
    Vect.prototype.set = function(x,y){
        this.x = x || 0;
        this.y = y || 0;
        return this;
    };

    Vect.prototype.invert = function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    };

    /**
     * Scalar multiplication.
     * Each coordinate will be multiplied with the given scalar.
     * @chainable
     * @method mul
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
     * Each coordinate will be devided by the given scalar.
     * @chainable
     * @method div
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
     * @method add
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
     * @method sub
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
     * @method dot
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
     * @method cross
     * @param v
     * @return {number}
     */
    Vect.prototype.cross = function (v) {
        return (this.x * v.y ) - (this.y * v.x );
    };

    /**
     * Normalize the given vector.
     *
     * Optional parameter length can be used ass abbreviation.
     * v.normalize.mul(33) -> v.normalize(33);
     * @method normalize
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
        if(length)
            this.mul(length);
        return this;
    };



    /**
     * Quadratic length of the vector.
     * @method lengthSq
     * @return {number}
     */
    Vect.prototype.lengthSq = function () {
        return this.x * this.x + this.y * this.y;
    };

    /**
     * Euclidean norm/length/magnitude of the vector.
     * @method length
     * @return {number}
     */
    Vect.prototype.length = function () {
        return Math.sqrt(this.lengthSq());
    };

    /**
     * Quadratic distance of two vectors.
     * @method distanceSq
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
     * @method distance
     * @param v
     * @return {number}
     */
    Vect.prototype.distance = function (v) {
        return Math.sqrt(this.distanceSq(v));
    };

    /**
     * Manhatten/city block/Taxicab distance
     * @method manhatten
     * @param v
     * @return {number}
     */
    Vect.prototype.manhatten = function (v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        return Math.abs(dx) + Math.abs(dy);
    };

    /**
     * @method isLeftOf
     * @param v
     * @return {boolean}
     */
    Vect.prototype.isLeftOf = function (v) {
        if (X_IS_LEFT_TO_Y)
            return this.cross(v) > 0;
        else
            return this.cross(v) < 0;
    };


    /**
     * @method isRightOf
     * @param v
     * @return {boolean}
     */
    Vect.prototype.isRightOf = function (v) {
        if (X_IS_LEFT_TO_Y)
            return this.cross(v) < 0;
        else
            return this.cross(v) > 0;
    };

    /**
     * @chainable
     * @method turnLeft
     * @return {Vect}
     */
    Vect.prototype.turnLeft = function () {
        var x = this.y * ( X_IS_LEFT_TO_Y ? 1 : -1 );
        var y = this.x * ( X_IS_LEFT_TO_Y ? -1 : 1 );
        this.x = x;
        this.y = y;
        return this;
    };

    /**
     * @chainable
     * @method turnRight
     * @return {Vect}
     */
    Vect.prototype.turnRight = function () {
        var x = this.y * ( X_IS_LEFT_TO_Y ? -1 : 1 );
        var y = this.x * ( X_IS_LEFT_TO_Y ? 1 : -1 );
        this.x = x;
        this.y = y;
        return this;
    };

    /**
     * @chainable
     * @method leftNormal
     * @return {Vect}
     */
    Vect.prototype.leftNormal = function () {
        this.turnLeft().normalize();
        return this;
    };

    /**
     * @chainable
     * @method rightNormal
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
     * @method angle
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
     * @method rotate
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
     * @method rotateTo
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
     * @method rotateTowards
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
     *  @method reflectOn
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
        this.top = X_IS_LEFT_TO_Y ? this.y_min : this.y_max;
        this.bottom = X_IS_LEFT_TO_Y ? this.y_max : this.y_min;
    };

    /**
     * Bounding box of a given Segment
     * @method fromSegment
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
     * @method toString
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
        return this.translate(ZERO.clone().sub(this.p1));
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
            if (Math.abs(c1) < EPSILON || Math.abs(c2) < EPSILON)
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

    /**
     * @class Line
     * @param segment
     * @constructor
     */
    var Line = function (p1, p2) {
        this.p1 = p1.clone();
        this.p2 = p2.clone();
    };

    Line.fromSegment = function (segment) {
        this.p1 = segment.p1.clone();
        this.p2 = segment.p2.clone();
    };

    Line.fromArray = function (arr) {
        return new Line(new Vect(arr[0], arr[1]), new Vect(arr[2], arr[3]));
    };

    Line.prototype.direction = function () { //TODO: connection vs direction
        return this.p2.clone().sub(this.p1).normalize();
    };


    Line.EQUAL = 1;
    Line.PARALLEL = 2;

    /**
     *
     * @param line
     * @returns {Vect|Line.PARALLEL|Line.EQUIVALENT} - Intersection is
     */
    Line.prototype.intersect = function (line) {

        // this: x = a + b*t
        // line: x = c + d*s

        //direction vectors
        var b = this.direction();
        var d = line.direction();

        //support vectors
        var a = this.p1;
        var c = line.p1;

        //difference between support vector
        var z = c.clone().sub(a);

        var cross = b.cross(d);
        var numerator = z.cross(d); //(this.p1.y-line.p1.y)*d.x - (this.p1.x-line.p1.x)* d.y;

        if (Math.abs(cross) < EPSILON) { //directions are parallel
            if (Math.abs(numerator) < EPSILON) { //connection of support is parallel to direction
                return Line.EQUAL;
            } else {
                return Line.PARALLEL;
            }
        }
        var t = numerator / cross;
        return this.p1.clone().add(b.mul(t));
    };


    /**
     * General intersection method for all combinations of lines, segments, rays.
     *
     * @param {Segment|Ray|Line} g
     * @param {Segment|Ray|Line} h
     * @returns {Vect|Segment|Ray|Line|null}
     *      An object that describes the intersection. Can be null.
     */
    function lineIntersect(g, h) {

        // g: x = g.p1 + (g.p2-g.p1)*t = a + b*t
        // h: x = h.p1 + (h.p2-h.p1)*s = c + d*s

        //direction vectors
        var b = g.direction();
        var d = h.direction();

        //support vectors
        var a = g.p1;
        var c = h.p1;

        //difference between support vector
        var z = c.clone().sub(a); // (c-a)

        var cross_directions = b.cross(d);
        var dot_directions = b.dot(d);
        var cross_support_direction = z.cross(d); //(this.p1.y-line.p1.y)*d.x - (this.p1.x-line.p1.x)* d.y;
        var dot_support_direction = z.dot(d);

        if (Math.abs(cross_directions) < EPSILON) { //directions are parallel
            if (Math.abs(cross_support_direction) < EPSILON) { //connection of support is parallel to direction
                if (isLine(g)) {
                    return h.clone();
                }
                if (isLine(h)) {
                    return g.clone();
                }
                if (isRay(g) && isRay(h)) {
                    if (dot_directions > 0) {
                        //both rays in same direction
                        if (dot_support_direction > 0)
                            return h.clone();
                        else
                            return g.clone();
                    } else {
                        //both ray in different directions
                        if (dot_support_direction > 0)
                            return null;
                        else
                            return new Segment(g.p1, h.p1);
                    }
                }
                if (isSegment(g) && isSegment(h)) {

                    var gp1 = g.containsPoint(h.p1);
                    var gp2 = g.containsPoint(h.p2);
                    var hp1 = h.containsPoint(g.p1);
                    var hp2 = h.containsPoint(g.p2);

                    // 0000 => null;
                    // 1000 => XXX
                    // 0100 => XXX
                    // 1100 => return h
                    // 0010 => XXX
                    // 1010 => [hp1,gp1]
                    // 0110 => [hp2,gp1]
                    // 1110 => return h (touch)
                    // 0001 => XXX
                    // 1001 => [hp1,gp2]
                    // 0101 => [hp2,gp2]
                    // 1101 => return h
                    // 0011 => return g
                    // 1011 => return g
                    // 0111 => return g
                    // 1111 => return g (or h)

                    if (gp1 && gp2)
                        return h.clone();
                    if (hp1 && hp2)
                        return g.clone();
                    if (gp1 && hp1)
                        return new Segment(h.p1, g.p1);
                    if (gp2 && hp1)
                        return new Segment(h.p2, g.p1);
                    if (gp1 && hp2)
                        return new Segment(h.p1, g.p2);
                    if (gp2 && hp2)
                        return new Segment(h.p2, g.p2);
                    return null;
                }
                if (isSegment(g)) { //h is ray
                    //TODO
                    if(g.containsPoint(h.p1)){

                    }
                } else { //h is segment, g is ray
                    //TODO
                    if(h.containsPoint(g.p2)){

                    }
                }
            } else {
                return null; //no intersection Line.PARALLEL;
            }
        }
        var t = cross_support_direction / cross_directions;
        return g.p1.clone().add(b.mul(t));
    }


    /**
     * @class Ray
     * @param segment
     * @constructor
     */
    var Ray = function (segment) {

    };

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


    /**
     * @class Circle
     * @param p
     * @param radius
     * @constructor
     */
    var Circle = function (p, radius) {

    };


    /**
     * A simple object pool
     *
     * @class Pool
     *
     * @constructor
     * @param {Number} capacity The initial capacity.
     */
    var Pool = function (capacity, constructor, initializer, growth) {
        this.items = new Array(capacity);
        this.capacity = capacity;
        this.current = capacity;
        this.initializer = initializer;
        this.constructor = constructor;
        this.growth = growth || function (cap) {
                return 1;
            };//
        this.createItems(capacity);
    };


    /**
     * CreateItems
     *
     * @method createItems
     *
     */
    Pool.prototype.createItems = function (size) {
        this.items.length = size;
        for (var i = 0; i < size; i++)
            this.items[i] = new this.constructor();
    };

    /**
     * @method get
     */
    Pool.prototype.get = function () {
        if (this.current === 0) {
            var growth = this.growth(this.capacity);
            this.capacity += growth;
            this.current = growth;
            this.createItems(growth);
        }
        this.current--;
        var item = this.items[this.current];
        this.initializer.apply(item, arguments);
        return item;
    };

    /**
     * @method dispose
     */
    Pool.prototype.dispose = function (obj) {
        this.current = this.items.push(obj);
        this.capacity = Math.max(this.capacity, this.current);
    };


    /*
     *
     *
     * Experimental Calculator API.
     *  * Include Object Pooling
     *
     *
     * Usage:
     * var _ = Calculator.create();
     *
     * var v = _(3,4); //Creates a vector in the calculators scope
     *
     * _.sub( _(3,4) , _(1,2) )
     *
     * _.clear();
     *
     * The vectors passed to a calculator function stay immutable.
     * The Vect function can be applied also so:
     *
     *
     * var v = _( 2, 0 );
     * var w = _.n( v );
     *
     * // v ->  x: 2 y: 0
     * // w ->  x: 1 y: 0;
     *
     * var v = c( 2 , 0 );
     * var w = v.normalize();
     * // v ->  x: 1 y: 0
     * // w ->  x: 1 y: 0;
     *
     *
     *
     * All references to vectors produced in equation must not be used after.
     *
     *
     *
     */
    var Calculator = {};
    Calculator.create = function () {


        var pool = new Pool(16, Vect, Vect);
        var active = [];

        var maxActive = 0;

        /*
         *  Calculator
         * Create a Vector within the scope of the Calculator.
         *
         * This means the instance is take from the internal Vect pool.
         *
         * When the calculation is clear all references to the Vect object become invalid.
         *
         * Usage:
         *  _(3,4) or _([3,4]) or _({x:3,y:4})
         *
         * When working with the normal Vect methods _ can be seen as a clone with a clean up ability;
         *
         */
        var _ = function () {
            var x, y;
            if (arguments.length === 1) {
                if (arguments[0].constructor === Array) {
                    x = arguments[0][0];
                    y = arguments[0][1];
                } else {
                    x = arguments[0].x;
                    y = arguments[0].y;
                }
            } else if (arguments === 2) {
                x = arguments[0];
                y = arguments[1];
            }
            var item = Pool.prototype.get.apply(pool, [x, y]);
            active.push(item);
            maxActive = Math.max(maxActive, active.length);
            return item;
        };

        _.clear = function () {
            for (var i = 0; i < items.length; i++) {
                pool.dispose(equation.items[i]);
            }
            used.length = 0;
        };

        _.statistics = function () {
            return {
                currentPoolCapacity: pool.items.length,
                currentActiveItems: used.length,
                maxActive: maxActive
            };
        };


        //V x V -> V
        _.add = function (u, v) {
            return _(u).add(v);
        };

        _.sub = function (u, v) {
            return _(u).sub(v);
        };


        //V x V -> S
        _.cross = function (u, v) {
            return u.cross(v);
        };

        _.dot = function (u, v) {
            return u.dot(v);
        };

        _.distanceSq = function (u, v) {
            return u.distanceSq(v);
        };

        _.distance = function (u, v) {
            return u.distance(u, v);
        };

        _.turnLeft = function (u) {
            return _(u).turnLeft();
        };

        _.turnRight = function (u) {
            return _(u).turnRight();
        };

        _.leftNormal = function (u) {
            return _(u).turnLeft().normalize();
        };

        _.rightNormal = function (u) {
            return _(u).turnRight().normalize();
        };

        //V -> S
        _.length = function (u) {
            return u.length();
        };

        _.lengthSq = function (u) {
            return u.lengthSq();
        };

        _.angle = function (u) {
            return u.angle();
        };

        //V -> V
        _.normalize = function (u) {
            var length = u.length(); //TODO: u.length();
            if (length === 0) {
                return _(1, 0);
            } else {
                return _.div(u, length);
            }
        };
        _.n = _.normalize;

        //S x V -> V
        _.div = function (s, u) {
            return _.mul(1 / s, u);
        };

        _.mul = function (s, u) {
            return _(u).mul(s);
        };


        _.rotate = function (angle, u) {
            return _(u).rotate(angle);
        };

        _.rotateTo = function (angle, u) {
            return _(u).rotateTo(angle);
        };

        _.reflectOn = function (u, v) {
            var n;
            if (u.isRightOf(v)) {
                n = _(v).leftNormal();
            } else if (u.isLeftOf(v)) {
                n = _(v).rightNormal();
            } else {
                return _(u).invert();
            }
            return _.sub(u, _.mul(n.dot(u) * 2, n));
        };

        return _;

    };

    Garfunkel.Vect = Vect;
    Garfunkel.Box = Box;
    Garfunkel.Segment = Segment;
    Garfunkel.Line = Line;
    Garfunkel.Ray = Ray;
    Garfunkel.Circle = Circle;
    Garfunkel.Triangle = Triangle;
    Garfunkel.Pool = Pool;
    Garfunkel.Calculator = Calculator;

    //Garfunkel.lineIntersect = lineIntersect;

    global.Garfunkel = Garfunkel;

})(this);
