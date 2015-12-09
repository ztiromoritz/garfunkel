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
     * Cross product of this and the given vector.
     * @method cross
     * @param v
     * @return {number}
     */
    Vect.prototype.cross = function (v) {
        return (this.x * v.y ) - (this.y * v.x );
    };

    /**
     * Normalize the given vector.
     * @method normalize
     * @return {Vect}
     */
    Vect.prototype.normalize = function () {
        var length = this.length();
        if (length === 0) {
            this.x = 1;
            this.y = 0;
        } else {
            this.div(length);
        }
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
     * The result is between [0,2*Pi).
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
            result = Math.atan2(this.y, this.x); // (- Math.atan2(0,1))
        } else {
            result = Math.atan2(this.y, this.x) - Math.atan2(ref.y, ref.x);
        }
        if (result > 0) {
            return result;
        } else {
            return 2 * Math.PI + result;
        }
    };

    /**
     * Rotates the vector by the given angle.
     *
     * @chainable
     * @method rotate
     * @param {number} angle in radians
     * @return {Vect} the rotated vector
     */
    Vect.prototype.rotate = function (angle) {
        var _x = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
        var _y = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));
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
        this.p1 = p1 || new Vect(0, 0);
        this.p2 = p2 || new Vect(1, 1);
        this.boundingBox = new Box.fromSegment(this);
        this.connection = this.p2.clone().sub(this.p1);
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

    Segment.prototype.toCenter = function () {
        this.p2 = this.connection.clone();
        this.p1 = ZERO.clone();
        return this;
    };


    Segment.prototype.length = function () {
        return this.p1.clone().sub(this.p2).length();
    };

    Segment.prototype.lengthSq = function () {
        return this.p1.clone().sub(this.p2).lengthSq();
    };

    Segment.prototype.intersect = function (s) {
        var EPSILON = 0.000001;

        var touchOrCross = function (s1, s2) {

            // X as line, Y as two points
            // Move this.p1 to ZERO
            var u = s1.clone().toCenter().p2;
            var v = s2.p1.clone().sub(s1.p1);
            var w = s2.p2.clone().sub(s1.p1);

            var c1 = v.cross(u);
            var c2 = w.cross(u);
            if (Math.abs(c1) < EPSILON || Math.abs(c2) < EPSILON)
                return true;
            //Y touches X
            return (c1 > 0) !== (c2 > 0);
            // Y cross X
        };
        return this.boundingBox.intersect(s.boundingBox) && touchOrCross(this, s) && touchOrCross(s, this);
    };

    /**
     * @class Line
     * @param segment
     * @constructor
     */
    var Line = function (segment) {

    };

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

    global.Garfunkel = Garfunkel;

})(this);
