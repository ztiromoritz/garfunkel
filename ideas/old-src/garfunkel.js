/**
 * garfunkel.js - A 2D geometry toolbox
 * @module Garfunkel
 */
(function (root, factory) {
    /*global module, define, define*/
    if (typeof exports === 'object') {
        // COMMON-JS
        module.exports = factory();
    } else if (typeof define === 'function' && define['amd']) {
        // Asynchronous Module Definition AMD
        define([], factory);
    } else {
        //GLOBAL (e.g. browser)
        root['Garfunkel'] = factory();
    }
}(this, function () {






















    Garfunkel.Vect = Vect;
    Garfunkel.Box = Box;
    Garfunkel.Segment = Segment;
    Garfunkel.Line = Line;
    Garfunkel.Ray = Ray;
    Garfunkel.Circle = Circle;
    Garfunkel.Triangle = Triangle;
    Garfunkel.Pool = Pool;
    Garfunkel.Polygon = Polygon;

    //Garfunkel.lineIntersect = lineIntersect;

    return Garfunkel;

}));
