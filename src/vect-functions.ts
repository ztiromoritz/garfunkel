import { Coord } from './coord';
import { create_pool, Pool, Pools } from './pool';
import { ABSCISSA, Vect, ZERO } from './vect';

const vect_pool: Pool<Vect> = create_pool<Vect>({
  create: () => new Vect(),
});
Pools.register(vect_pool);

interface _v {
  (x?: number, y?: number): Vect;
  (x?: number, y?: number): Vect;
  ([x, y]: number[]): Vect;
  (fn: () => Vect): Vect;
  (fn: () => void): void;
  // TODO: maybe handle the void case in a separate function
  pool: Pool<Vect>;
  fromArray: ([x, y]: number[]) => Vect;
  fromAngle: (angle: number) => Vect;
  from: (other: Vect) => Vect;
}

export function _v(
  arg0?: number | number[] | (() => Vect | void),
  arg1?: number
): Vect {
  if (Array.isArray(arg0)) {
    const v = vect_pool.get();
    v.x = arg0[0] ?? 0;
    v.y = arg0[1] ?? 0;
    return v;
  } else if (typeof arg0 === 'function') {
    Pools.push_context();
    const v = arg0();
    if (v) vect_pool.lift(v);
    Pools.pop_context();
    return v ?? ZERO;
  } else {
    const v = vect_pool.get();
    v.x = arg0 ?? 0;
    v.y = arg1 ?? 0;
    return v;
  }
}
_v.pool = vect_pool;

_v.fromArray = ([x, y]: number[]) => {
  return _v(x, y);
};

_v.fromAngle = (angle: number) => {
  const x = Math.cos(angle);
  const y = Math.sin(angle);
  return _v(x, y);
};

_v.from = (other: Vect) => {
  return _v(other.x, other.y);
};

/**
 * Just the bare formulas, without creating any object inside.
 * Even a Vector object that receive the result will given as first argument.
 *
 * This will be used to create:
 *  1. the VectFunction - that return a new Vector result without changing the input Vectors
 *  2. the Vect class - that give a chainable Api that mutates the object, the methods are called on.
 */

// TODO: all like this... ??
// Return type this ???
export function invert(a: Vect) {
  const x = -a.x;
  const y = -a.y;
  return _v(x, y);
}

export function xComponent(a: Vect) {
  const x = a.x;
  const y = 0;
  return _v(x, y);
}

export function yComponent(a: Vect) {
  const x = 0;
  const y = a.y;
  return _v(x, y);
}

export function mirrorOnX(a: Vect) {
  const x = a.x;
  const y = -a.y;
  return _v(x, y);
}

export function mirrorOnY(a: Vect) {
  const x = -a.x;
  const y = a.y;
  return _v(x, y);
}

/**
 * Scalar multiplication.
 * Each coordinate will be multiplied with the given scalar.
 * @param {Number} a scalar to multiply the vector with
 * @return {Vect}
 */
export function mul(a: Vect, s: number) {
  const x = a.x * s;
  const y = a.y * s;
  return _v(x, y);
}

/**
 * Scalar division.
 * Each coordinate will be divided by the given scalar.
 * @param {Number} a scalar to divide the vector with
 * @return {Vect}
 */
export function div(a: Vect, s: number) {
  const x = a.x / s;
  const y = a.y / s;
  return _v(x, y);
}

/**
 * Adds a vector.
 * @param {Vect} v
 * @return {Vect}
 */
export function add(a: Vect, b: Vect) {
  const x = a.x + b.x;
  const y = a.y + b.y;
  return _v(x, y);
}

/**
 * Substracts a vector.
 * @param {Vect} v
 * @return {Vect}
 */
export function sub(a: Vect, b: Vect) {
  const x = a.x - b.x;
  const y = a.y - b.y;
  return _v(x, y);
}

/**
 * Normalize the given vector.
 *
 * Optional parameter length can be used as abbreviation.
 * v.normalize.mul(33) -> v.normalize(33);
 * @param {number} length
 *  [optional] length of the target vector. If not set, length is 1.0.
 *
 * @return {Vect}
 */
export function normalize(a: Vect, targetLength?: number) {
  return _v(() => {
    const currenLength = length(a);
    targetLength = targetLength ?? 1;
    if (currenLength === 0) {
      return _v(1, 0);
    } else {
      return div(a, currenLength / targetLength);
    }
  });
}

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
export function rotate(a: Vect, angle: number, pivot?: Vect) {
  const r = _v();
  pivot = pivot || ZERO;
  r.x =
    pivot.x +
    (a.x - pivot.x) * Math.cos(angle) -
    (a.y - pivot.y) * Math.sin(angle);
  r.y =
    pivot.y +
    (a.x - pivot.x) * Math.sin(angle) +
    (a.y - pivot.y) * Math.cos(angle);
  return r;
}

/**
 * Rotates the vector to the given angle.
 * @chainable
 * @param {number} angle in radians
 * @return {Vect} the rotated vector
 */
export function rotateTo(a: Vect, to: number) {
  return rotate(a, to - angle(a));
}

//TODO:
//  * point reflection
//  * axis reflection

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
     rotateTowards(a: Vect, angle: number, stepSize: number) {
       this.rotate(angle - this.angle());
       //TODO
       return this;
      }
      */

/**
 *  "angle of incidence equal to the angle of reflexion"
 *  Performs a simple reflection of this object on a surface
 *  that has the direction of the given vector u.
 *  @param {Vect} u
 */
export function reflectOn(a: Vect, u: Vect) {
  return _v(() => {
    if (isRightOf(a, u)) {
      const n = leftNormal(u);
      return sub(a, mul(n, dot(n, a) * 2));
    } else if (isLeftOf(a, u)) {
      const n = rightNormal(u);
      return sub(a, mul(n, dot(n, a) * 2));
    } else {
      return invert(a);
    }
  });
}

/**
 * @return {Vect}
 */
export function turnLeft(a: Vect) {
  const x = a.y * (Coord.getXIsLeftOfY() ? 1 : -1);
  const y = a.x * (Coord.getXIsLeftOfY() ? -1 : 1);
  return _v(x, y);
}

/**
 * @return {Vect}
 */
export function turnRight(a: Vect) {
  const x = a.y * (Coord.getXIsLeftOfY() ? -1 : 1);
  const y = a.x * (Coord.getXIsLeftOfY() ? 1 : -1);
  return _v(x, y);
}

/**
 * @chainable
 * @return {Vect}
 */
export function leftNormal(a: Vect) {
  return _v(() => {
    const tmp = turnLeft(a);
    return normalize(tmp, 1);
  });
}

/**
 * @chainable
 * @return {Vect}
 */
export function rightNormal(a: Vect) {
  return _v(() => {
    const tmp = turnRight(a);
    return normalize(tmp, 1);
  });
}

/**
 * Dot product of this and the given vector.
 * @return {number}
 */
export function dot(a: Vect, b: Vect) {
  return a.x * b.x + a.y * b.y;
}

/**
 * Not exactly the cross product, because seems not to be defined for 2d vectors.
 *
 * "Gives the Z-component of 3d cross product, if the two given
 * vectors where extended to 3d vectors with a Z-component of 0.
 * So a and b are 3d vectors in the x-y plane.
 * The resulting vector is orthogonal to both of them.
 * And therefor only the Z-component has a non-zero value."
 * or
 * "Determinant of a 2x2 matrix build by the two vectors."
 *
 * Usefull to find the orientation of the two vectors.
 *
 * @return {number}
 */
export function cross(a: Vect, b: Vect) {
  return a.x * b.y - a.y * b.x;
}

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
export function trapeze(a: Vect, b: Vect) {
  return (b.x - a.x) * (b.y + a.y);
}

/**
 * Quadratic length of the vector.
 * y lengthSq
 * @return {number}
 */
export function lengthSq(a: Vect) {
  return a.x * a.x + a.y * a.y;
}

/**
 * Euclidean norm/length/magnitude of the vector.
 * @return {number}
 */
export function length(a: Vect) {
  return Math.sqrt(lengthSq(a));
}

/**
 * Quadratic distance of two vectors.
 * @param v
 * @return {number}
 */
export function distanceSq(a: Vect, b: Vect) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

/**
 * Euclidean distance of two vectors.
 * @param v
 * @return {number}
 */
export function distance(a: Vect, b: Vect) {
  return Math.sqrt(distanceSq(a, b));
}

/**
 * Manhatten/city block/Taxicab distance
 * @param v
 * @return {number}
 */
export function manhatten(a: Vect, b: Vect) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.abs(dx) + Math.abs(dy);
}

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
export function angle(a: Vect, ref?: Vect): number {
  ref = ref || ABSCISSA;
  let result = Math.atan2(a.y, a.x) - Math.atan2(ref.y, ref.x);
  if (result > Math.PI) {
    result = result - Math.PI * 2;
  } else if (result < -Math.PI) {
    result = Math.PI * 2 + result;
  }
  return result;
}

/**
 * y isLeftOf
 * @param v
 * @return {boolean}
 */
export function isLeftOf(a: Vect, v: Vect) {
  if (Coord.getXIsLeftOfY()) {
    return cross(a, v) > 0;
  } else {
    return cross(a, v) < 0;
  }
}

/**
 * @param v
 * @return {boolean}
 */
export function isRightOf(a: Vect, v: Vect) {
  if (Coord.getXIsLeftOfY()) {
    return cross(a, v) < 0;
  } else {
    return cross(a, v) > 0;
  }
}

export function toString(a: Vect) {
  return 'x: ' + a.x + ' y: ' + a.y;
}
