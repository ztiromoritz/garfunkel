
/**
 * Experimental Immutable/Chainable APi
 */
Vect.of = function(x,y){
    //noinspection JSUnusedGlobalSymbols
    return {
        getX : function(){ return x; },
        getY : function(){ return y; },

        add: function(u,v) {
            return Vect.of(u+x,v+y);
        },
        mul: function(s){
            return Vect.of(s*x,s*y);
        }
    };
};


/**
 * Experimental immutable Vect -Api
 */
Vect.of = function(x,y){
    //noinspection JSUnusedGlobalSymbols
    return {
        getX : function(){ return x; },
        getY : function(){ return y; },

        add: function(u,v) {
            return Vect.of(u+x,v+y);
        },
        mul: function(s){
            return Vect.of(s*x,s*y);
        }
    };
};

/**
 * Second Experimental immutable Vect -Api
 */
Vect.of2 = function(x,y){
    //noinspection JSUnusedGlobalSymbols




    var features = {
        'ADD' : function(x,y,u,v){
            return Vect.of2(x+u,y+v);
        }
    };


    var _ = function(){
        var feature = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
        if(args.le)
            features[feature].apply(null,args)
    };


    _.getX  = function(){ return x; };
    _.getY  = function(){ return y; };
    _.getValue = function(){ return [x,y]; } //destructioning version}

    return _;
};

var Example1 = function () {
    var ADD = "ADD";
    var MUL = "MUL";
    var result = Vect.of2(3, 3)(ADD, 2, 3)(MUL, 4)
};


/** Experiment 3 **/

/* eslint-env es6 */
/* globals boo */
"use strict";
/**
 *
 */

const V = ([x,y]) =>
    ({
        map: (f) => V(f(x,y)),
        value : ()=>[x,y],
        inspect : ()=>`V(${x},${y})`
    });

boo.g();


/** Experiment 4 **/

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



