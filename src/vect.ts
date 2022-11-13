import { Coord } from "./coord";
import { create_pool, Pool, Pools } from "./pool";

const vect_pool: Pool<Vect> = create_pool<Vect>({
  create: () => new Vect(),
});

const _v = (x?: number, y?: number) => {
  const v = vect_pool.get();
  v.x = x || 0;
  v.y = y || 0;
  return v;
};

Pools.register(vect_pool);

const _VectFunction = {
  add(result: Vect, a: Vect, b: Vect) {
    const x = a.x + b.x;
    const y = a.y + b.y;
    return result.set(x, y);
  },

  mul(result: Vect, a: Vect, s: number) {
    const x = a.x * s;
    const y = a.y * s;
    return result.set(x, y);
  },
};

function curry(fn: Function, ...args: unknown[]) {
  return (..._arg: unknown[]) => {
    return fn(...args, ..._arg);
  };
}

// TODO export all
export const VectFunction = Object.fromEntries(
  Object.entries(_VectFunction).map(([key, fn]) => [key, curry(fn, _v())])
);

export class Vect {
  x: number;
  y: number;

  constructor(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  /**
   * @return {String}
   */
  toString() {
    return "x: " + this.x + " y: " + this.y;
  }

  /**
   * Clone!
   * @return {Vect}
   */
  clone() {
    return _v(this.x, this.y);
  }

  /**
   * Sets the coordinates of this Vect.
   * (Without instantiating a new object)
   * @param {Number} x
   * @param {Number} y
   */
  set(x: number, y: number) {
    this.x = x || 0;
    this.y = y || 0;
    return this;
  }

  invert() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  mirrorOnX() {
    this.y = -this.y;
    return this;
  }

  mirrorOnY() {
    this.x = -this.x;
    return this;
  }

  /**
   *
   */
  xComponent() {
    this.y = 0;
    return this;
  }

  /**
   *
   */
  yComponent() {
    this.x = 0;
    return this;
  }

  /**
   * Scalar multiplication.
   * Each coordinate will be multiplied with the given scalar.
   * @chainable
   * @param {Number} a scalar to multiply the vector with
   * @return {Vect}
   */
  mul(s: number) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  /**
   * Scalar division.
   * Each coordinate will be divided by the given scalar.
   * @chainable
   * @param {Number} a scalar to divide the vector with
   * @return {Vect}
   */
  div(s: number) {
    this.x /= s;
    this.y /= s;
    return this;
  }

  /**
   * Adds a vector.
   * @chainable
   * @param {Vect} v
   * @return {Vect}
   */
  add(v: Vect) {
    return _VectFunction.add(this, v, this);
  }

  /**
   * Substracts a vector.
   * @chainable
   * @param {Vect} v
   * @return {Vect}
   */
  sub(v: Vect) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /**
   * Dot product of this and the given vector.
   * @param v
   * @return {number}
   */
  dot(v: Vect) {
    return this.x * v.x + this.y * v.y;
  }

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
  cross(v: Vect) {
    return this.x * v.y - this.y * v.x;
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
  trapeze(v: Vect) {
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
  normalize(length?: number) {
    var currenLength = this.length();
    if (currenLength === 0) {
      this.x = 1;
      this.y = 0;
    } else {
      this.div(currenLength);
    }
    if (length) this.mul(length);
    return this;
  }

  /**
   * Quadratic length of the vector.
   * y lengthSq
   * @return {number}
   */
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Euclidean norm/length/magnitude of the vector.
   * @return {number}
   */
  length() {
    return Math.sqrt(this.lengthSq());
  }

  /**
   * Quadratic distance of two vectors.
   * @param v
   * @return {number}
   */
  distanceSq(v: Vect) {
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  /**
   * Euclidean distance of two vectors.
   * @param v
   * @return {number}
   */
  distance(v: Vect) {
    return Math.sqrt(this.distanceSq(v));
  }

  /**
   * Manhatten/city block/Taxicab distance
   * @param v
   * @return {number}
   */
  manhatten(v: Vect) {
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    return Math.abs(dx) + Math.abs(dy);
  }

  /**
   * y isLeftOf
   * @param v
   * @return {boolean}
   */
  isLeftOf(v: Vect) {
    if (Coord.getXIsLeftOfY()) return this.cross(v) > 0;
    else return this.cross(v) < 0;
  }

  /**
   * @param v
   * @return {boolean}
   */
  isRightOf(v: Vect) {
    if (Coord.getXIsLeftOfY()) return this.cross(v) < 0;
    else return this.cross(v) > 0;
  }

  /**
   * @chainable
   * @return {Vect}
   */
  turnLeft() {
    var x = this.y * (Coord.getXIsLeftOfY() ? 1 : -1);
    var y = this.x * (Coord.getXIsLeftOfY() ? -1 : 1);
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * @chainable
   * @return {Vect}
   */
  turnRight() {
    var x = this.y * (Coord.getXIsLeftOfY() ? -1 : 1);
    var y = this.x * (Coord.getXIsLeftOfY() ? 1 : -1);
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * @chainable
   * @return {Vect}
   */
  leftNormal() {
    this.turnLeft().normalize();
    return this;
  }

  /**
   * @chainable
   * @return {Vect}
   */
  rightNormal() {
    this.turnRight().normalize();
    return this;
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
  angle(ref?: Vect) {
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
  rotate(angle: number, pivot?: Vect) {
    pivot = pivot || ZERO;
    var _x =
      pivot.x +
      (this.x - pivot.x) * Math.cos(angle) -
      (this.y - pivot.y) * Math.sin(angle);
    var _y =
      pivot.y +
      (this.x - pivot.x) * Math.sin(angle) +
      (this.y - pivot.y) * Math.cos(angle);
    this.x = _x;
    this.y = _y;
    return this;
  }

  /**
   * Rotates the vector to the given angle.
   * @chainable
   * @param {number} angle in radians
   * @return {Vect} the rotated vector
   */
  rotateTo(angle: number) {
    this.rotate(angle - this.angle());
    return this;
  }

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
  rotateTowards(angle: number, stepSize: number) {
    this.rotate(angle - this.angle());
    //TODO
    return this;
  }

  /**
   *  "angle of incidence equal to the angle of reflexion"
   *  Performs a simple reflection of this object on a surface
   *  that has the direction of the given vector u.
   *  @param {Vect} u
   */
  reflectOn(u: Vect) {
    var l, n, r;
    if (this.isRightOf(u)) {
      l = this.clone();
      n = u.clone().leftNormal();
      r = l.sub(n.clone().mul(n.dot(l) * 2));
    } else if (this.isLeftOf(u)) {
      l = this.clone();
      n = u.clone().rightNormal();
      r = l.sub(n.clone().mul(n.dot(l) * 2));
    } else {
      r = this.clone().invert();
    }
    this.x = r.x;
    this.y = r.y;
    return this;
  }
}

const ZERO = new Vect(0, 0);
const ABSCISSA = new Vect(1, 0);
const ORDINATE = new Vect(0, 1);

Object.assign(Vect, { ZERO, ABSCISSA, ORDINATE });
