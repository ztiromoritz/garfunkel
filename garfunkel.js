/**
 * garfunkel.js - my personal 2d geometry toolbox
 * @module Garfunkel
 * @namespace Garfunkel
 */
(function (global) {


    /**
     * Used for the isLeftOf, isRightOf, getLeftNormal, getRightNormal functions.
     *
     * FALSE, means the normal school book coordinates with (0,0) in the lower left corner.
     * TRUE, means the canvas or graphic coordinates with (0,0) in the upper left corner;
     *
     */
    var X_IS_LEFT_TO_Y = true;

    var Garfunkel = {};

    Garfunkel.setXisLeftOfY = function (value) {
        X_IS_LEFT_TO_Y = value;
    };


    /**
     *
     *
     */
    Garfunkel.setGameCoords = function () {
        X_IS_LEFT_TO_Y = true;
    };
    Garfunkel.setSchoolCoords = function () {
        X_IS_LEFT_TO_Y = false;
    };


    /**
     *
     *
     * @example
     *    exponential growth
     *      growth = function(capacity){return capacity === 0?1:2*capacity;};
     * @memberOf Garfunkel
     *
     * @classdesc A simple object pool
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
     * @function createItems
     *
     */
    Pool.prototype.createItems = function (size) {
        this.items.length = size;
        for (var i = 0; i < size; i++)
            this.items[i] = new this.constructor();
    };

    /**
     * @function
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
     * @function
     */
    Pool.prototype.dispose = function (obj) {
        this.current = this.items.push(obj);
        this.capacity = Math.max(this.capacity, this.current);
    };

    /**
     * @classdesc Represents a vector as well as a point.
     *
     * <br>
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
     * @function
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
     */
    Vect.prototype.mul = function (s) {
        this.x *= s;
        this.y *= s;
        return this;
    };

    Vect.prototype.div = function (s) {
        this.x /= s;
        this.y /= s;
        return this;
    };

    Vect.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };

    Vect.prototype.sub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };

    Vect.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };


    Vect.prototype.cross = function (v) {
        return (this.x * v.y ) - (this.y * v.x );
    };

    Vect.prototype.distanceSq = function (v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        return dx * dx + dy * dy;
    };

    Vect.prototype.distance = function (v) {
        return Math.sqrt(this.distanceSq(v));
    };

    Vect.prototype.manhatten = function (v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        return Math.abs(dx) + Math.abs(dy);
    };

    Vect.prototype.isLeftOf = function (v) {
        if (X_IS_LEFT_TO_Y)
            return this.cross(v) > 0;
        else
            return this.cross(v) < 0;
    };

    Vect.prototype.isRightOf = function (v) {
        if (X_IS_LEFT_TO_Y)
            return this.cross(v) < 0;
        else
            return this.cross(v) > 0;
    };

    Vect.prototype.turnLeft = function () {
        var x = this.y * ( X_IS_LEFT_TO_Y ? 1 : -1 );
        var y = this.x * ( X_IS_LEFT_TO_Y ? -1 : 1 );
        this.x = x;
        this.y = y;
        return this;
    };

    Vect.prototype.turnRight = function () {
        var x = this.y * ( X_IS_LEFT_TO_Y ? -1 : 1 );
        var y = this.x * ( X_IS_LEFT_TO_Y ? 1 : -1 );
        this.x = x;
        this.y = y;
        return this;
    };

    Vect.prototype.leftNormal = function () {
        this.turnLeft().normalize();
        return this;
    };

    Vect.prototype.rightNormal = function () {
        this.turnRight().normalize();
        return this;
    };

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

    Vect.prototype.lengthSq = function () {
        return this.x * this.x + this.y * this.y;
    };

    Vect.prototype.length = function () {
        return Math.sqrt(this.lengthSq());
    };


    Vect.prototype.angle = function () {
        return Math.atan2(this.y, this.x);
    };

    Vect.prototype.rotate = function (angle) {
        var _x = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
        var _y = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));
        this.x = _x;
        this.y = _y;
        return this;
    };

    Vect.prototype.rotateTo = function (angle) {
        this.rotate(angle - this.angle());
        return this;
    };


    /**
     *  @function
     *  "angle of incidence equal to the angle of reflexion"
     *  Performs a simple reflection of this object on a surface
     *  the has the direction of the given vector u.
     *
     *
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

        /**
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

    /**
     * A rectangular box with edges parallel to the coordinate axes.
     *
     * So:
     *        Box#left &le; Box#right
     *        Box#top  &le; Box#bottom
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
     */
    Box.fromSegment = function (segment) {
        return new Box(segment.p1.x, segment.p2.x, segment.p1.y, segment.p2.y);
    };

    Box.fromObject = function (obj) {
        return new Box(obj.x0, obj.x1, obj.y0, obj.y1);
    };

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
     *
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

    Garfunkel.Vect = Vect;
    Garfunkel.Segment = Segment;
    Garfunkel.Box = Box;
    Garfunkel.Pool = Pool;
    Garfunkel.Calculator = Calculator;


    global.Garfunkel = Garfunkel;

})(this);
