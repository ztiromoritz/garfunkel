import {
  add,
  angle,
  cross,
  distance,
  distanceSq,
  div,
  dot,
  invert,
  isLeftOf,
  isRightOf,
  leftNormal,
  length,
  lengthSq,
  manhatten,
  mirrorOnX,
  mirrorOnY,
  mul,
  normalize,
  reflectOn,
  rightNormal,
  rotate,
  rotateTo,
  sub,
  toString,
  trapeze,
  turnLeft,
  turnRight,
  xComponent,
  yComponent,
  _v,
} from './vect-functions';

export class Vect {
  x: number;
  y: number;

  constructor(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  static fromAngle(v: number) {
    return _v.fromAngle(v);
  }

  /**
   * @return
   */
  clone() {
    return _v.from(this);
  }

  /**
   * @return
   */
  toString() {
    return toString(this);
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

  _chain(result: Vect): this {
    this.set(result.x, result.y);
    return this;
  }

  xComponent() {
    return this._chain(xComponent(this));
  }

  yComponent() {
    return this._chain(yComponent(this));
  }

  invert() {
    return this._chain(invert(this));
  }

  mirrorOnX() {
    return this._chain(mirrorOnX(this));
  }

  mirrorOnY() {
    return this._chain(mirrorOnY(this));
  }

  /**
   * Scalar multiplication.
   * Each coordinate will be multiplied with the given scalar.
   * @chainable
   * @param {Number} a scalar to multiply the vector with
   * @return {Vect}
   */
  mul(s: number): this {
    return this._chain(mul(this, s));
  }

  /**
   * Scalar division.
   * Each coordinate will be divided by the given scalar.
   * @chainable
   * @param {Number} a scalar to divide the vector with
   * @return {Vect}
   */
  div(s: number): this {
    return this._chain(div(this, s));
  }

  /**
   * Adds a vector.
   * @chainable
   * @param {Vect} v
   * @return {Vect}
   */
  add(v: Vect): this {
    return this._chain(add(this, v));
  }

  /**
   * Substracts a vector.
   * @chainable
   * @param {Vect} v
   * @return {Vect}
   */
  sub(v: Vect): this {
    return this._chain(sub(this, v));
  }

  /**
   * Normalize the given vector.
   *
   * Optional parameter length can be used as abbreviation.
   * v.normalize().mul(33) -> v.normalize(33);
   * @param length
   *  [optional] length of the target vector. If not set, length is 1.0.
   * @chainable
   * @return {Vect}
   */
  normalize(length?: number): this {
    return this._chain(normalize(this, length));
  }

  /**
   * Dot product of this and the given vector.
   * @param v
   * @return {number}
   */
  dot(v: Vect): number {
    return dot(this, v);
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
  cross(v: Vect): number {
    return cross(this, v);
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
    return trapeze(this, v);
  }

  /**
   * Quadratic length of the vector.
   * y lengthSq
   * @return {number}
   */
  lengthSq(): number {
    return lengthSq(this);
  }

  /**
   * Euclidean norm/length/magnitude of the vector.
   * @return {number}
   */
  length(): number {
    return length(this);
  }

  /**
   * Quadratic distance of two vectors.
   * @param v
   * @return {number}
   */
  distanceSq(v: Vect): number {
    return distanceSq(this, v);
  }

  /**
   * Euclidean distance of two vectors.
   * @param v
   * @return {number}
   */
  distance(v: Vect): number {
    return distance(this, v);
  }

  /**
   * Manhatten/city block/Taxicab distance
   * @param v
   * @return {number}
   */
  manhatten(v: Vect): number {
    return manhatten(this, v);
  }

  /**
   * y isLeftOf
   * @param v
   * @return {boolean}
   */
  isLeftOf(v: Vect): boolean {
    return isLeftOf(this, v);
  }

  /**
   * @param v
   * @return {boolean}
   */
  isRightOf(v: Vect): boolean {
    return isRightOf(this, v);
  }

  /**
   * @chainable
   * @return {Vect}
   */
  turnLeft(): this {
    return this._chain(turnLeft(this));
  }

  /**
   * @chainable
   * @return {Vect}
   */
  turnRight(): this {
    return this._chain(turnRight(this));
  }

  /**
   * @chainable
   * @return {Vect}
   */
  toLeftNormal(): this {
    return this._chain(leftNormal(this));
  }

  /**
   * @chainable
   * @return {Vect}
   */
  toRightNormal(): this {
    return this._chain(rightNormal(this));
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
  angle(ref?: Vect): number {
    return angle(this, ref);
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
  rotate(angle: number, pivot?: Vect): this {
    return this._chain(rotate(this, angle, pivot));
  }

  /**
   * Rotates the vector to the given angle.
   * @chainable
   * @param {number} angle in radians
   * @return {Vect} the rotated vector
   */
  rotateTo(angle: number): this {
    return this._chain(rotateTo(this, angle));
  }

  /**
   *  "angle of incidence equal to the angle of reflexion"
   *  Performs a simple reflection of this object on a surface
   *  that has the direction of the given vector u.
   *  @param {Vect} u
   */
  reflectOn(u: Vect) {
    return this._chain(reflectOn(this, u));
  }
}

export const ZERO = Object.freeze(new Vect(0, 0));
export const ABSCISSA = Object.freeze(new Vect(1, 0));
export const ORDINATE = Object.freeze(new Vect(0, 1));
