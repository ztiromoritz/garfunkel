import Vect from './modules/vect.js';
import Box from './modules/box.js';
import Segment from './modules/segment.js';
import Line from './modules/line.js';
import Ray from './modules/ray.js';
import Circle from './modules/circle.js';
import Triangle from './modules/triangle.js';
import Pool from './modules/pool.js';
import Polygon from './modules/polygon.js';


/**
 * Static Method
 * @private
 */
const Garfunkel = {
    Vect, Box, Segment, Line, Ray, Circle, Triangle, Pool, Polygon
};

var X_IS_LEFT_TO_Y = true;

/**
 * General orientation of the coordinate system. This is a global setting for this module.
 *
 * Used for the isLeftOf, isRightOf, getLeftNormal, getRightNormal functions.
 *
 * FALSE, means the normal school book coordinates with (0,0) in the lower left corner.
 * TRUE, means the canvas or graphic coordinates with (0,0) in the upper left corner;
 *
 * @static
 * @default "true"
 * @return {boolean}
 */
Garfunkel.getXIsLeftOfY = function () {
    return X_IS_LEFT_TO_Y;
};

/**
 *
 * @static
 * @default "true"
 * @param {boolean} value
 */
Garfunkel.setXisLeftOfY = function (value) {
    X_IS_LEFT_TO_Y = value;
};

/**
 * @example
 * Garfunkel.setGameCoords();
 * var v = new Vect(2,2);
 * var w = v.clone().turnLeft().mul(0.5);
 * draw(v, 'red');
 * draw(w, 'green');
 * print(v)
 * print(w)
 * @static
 */
Garfunkel.setGameCoords = function () {
    X_IS_LEFT_TO_Y = true;
};

/**
 * @example
 * Garfunkel.setSchoolCoords();
 * var v = new Vect(2,2);
 * var w = v.clone().turnLeft().mul(0.5);
 * draw(v, 'red');
 * draw(w, 'green');
 * @static
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
Garfunkel.EPSILON = EPSILON;


export default Garfunkel;
