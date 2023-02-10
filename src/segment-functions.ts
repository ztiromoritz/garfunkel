import { create_pool, Pool, Pools, wrap } from "./pool";
import { Segment } from "./segment";
import { ABSCISSA, Vect, ZERO } from "./vect";
import {
  normalize,
  rotate as vect_rotate,
  angle as vect_angle,
  length as vect_length,
  lengthSq as vect_lengthSq,
  sub,
  _v,
} from "./vect-functions";

const segment_pool: Pool<Segment> = create_pool<Segment>({
  create: () => new Segment(),
});

Pools.register(segment_pool);

interface _s {
  (p1?: Vect, p2?: Vect): Segment;
  (x1: number, y1: number, x2: number, y2: number): Segment;
  (fn: () => Segment): Segment;
  pool: Pool<Segment>;
  fromSupport: (support: Vect, direction: Vect) => Segment;
}

export function _s(
  arg0?: Vect | (() => Segment) | number,
  arg1?: Vect | number,
  arg2?: number,
  arg3?: number
): Segment {
  if (typeof arg0 === "function") {
    Pools.push_context();
    const s = arg0();
    if (s) segment_pool.lift(s);
    Pools.pop_context();
    return s;
  } else if (
    arguments.length === 4 &&
    typeof arg0 === "number" &&
    typeof arg1 === "number" &&
    typeof arg2 === "number" &&
    typeof arg3 === "number"
  ) {
    const s = segment_pool.get();
    s.x1 = arg0;
    s.y1 = arg1;
    s.x2 = arg2;
    s.y2 = arg3;
    return s;
  } else {
    const s = segment_pool.get();
    const p1 = arg0?.constructor?.name === "Vect" ? (arg0 as Vect) : ZERO;
    const p2 = arg1?.constructor?.name === "Vect" ? (arg1 as Vect) : ABSCISSA;
    s.set(p1, p2);
    return s;
  }
}

_s.pool = segment_pool;

/**
 * Create segment from support and connection vector
 */
_s.fromSupport = (support: Vect, connection: Vect) => {
  const s = _s();
  s.x1 = support.x;
  s.y1 = support.y;
  s.x2 = support.x + connection.x;
  s.y2 = support.y + connection.y;
  return s;
};

// functions
export function toString(s: Segment): string {
  return `[Segment p1: (${s.x1}, ${s.y1}) p2: (${s.x2}, ${s.y2}) ]`;
}

export function connection(s: Segment): Vect {
  const x = s.x2 - s.x1;
  const y = s.y2 - s.y1;
  return _v(x, y);
}

export function direction(s: Segment): Vect {
  return _v(() => {
    const c = connection(s);
    return normalize(c);
  });
}

export function translate(s: Segment, v: Vect): Segment {
  const x1 = s.x1 + v.x;
  const y1 = s.y1 + v.y;
  const x2 = s.x2 + v.x;
  const y2 = s.y2 + v.y;
  return _s(x1, y1, x2, y2);
}

/**
 * Rotate the Segment
 * @param {Segment} s
 *
 * @param {number} angle
 *      in radians
 * @param {Vect} pivot
 *      [optional] default is (0,0) not  s.p1
 * @returns {Segment}
 */
export function rotate(s: Segment, angle: number, pivot?: Vect) {
  const p1 = _v(s.x1, s.y1);
  const p2 = _v(s.x2, s.y2);
  return _s(vect_rotate(p1, angle, pivot), vect_rotate(p2, angle, pivot));
}

/**
 * Move Segments support vector (x1,y1) to center (0,0). Keeps direction and length
 */
export function toCenter(s: Segment): Segment {
  return _s(() => {
    const move = sub(ZERO, _v(s.x1, s.y1));
    return translate(s, move);
  });
}

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
export function getPoint(s: Segment, position: number): Vect {
  const x = s.x2 * position + s.x1 * (1 - position);
  const y = s.y2 * position + s.y1 * (1 - position);
  return _v(x, y);
}

export function getMiddle(s: Segment): Vect {
  return getPoint(s, 0.5);
}

export function angle(s: Segment, ref?: Vect): number {
  // TODO: wrap with scalar wrapper
  return wrap(() => vect_angle(connection(s), ref));
}

export function length(s: Segment): number {
  // TODO: wrap with scalar wrapper
  return wrap(() => vect_length(connection(s)));
}

export function lengthSq(s: Segment): number {
  // TODO: wrap with scalar wrapper
  return wrap(() => vect_lengthSq(connection(s)));
}

// Segment.prototype.getBoundingBox = function () {
//   return new Box.fromSegment(this);
// };

// Segment.prototype.toString = function () {
//   return "[ " + this.p1 + " , " + this.p2 + " ]";
// };

// Segment.fromArray = function (arr) {
//   return new Segment(new Vect(arr[0], arr[1]), new Vect(arr[2], arr[3]));
// };

// Segment.fromObject = function (obj) {
//   return new Segment(obj.p1, obj.p2);
// };

// Segment.prototype.clone = function () {
//   return new Segment(this.p1.clone(), this.p2.clone());
// };

// /**
//  *
//  * @param s
//  * @returns {boolean}
//  *      true, if the both segments intersect
//  */
// Segment.prototype.intersect = function (s) {
//   var touchOrCross = function (s1, s2) {
//     // s1 as line, s2 as two points
//     var u = s1.connection(); // Move this.p1 to ZERO
//     var v = s2.p1.clone().sub(s1.p1);
//     var w = s2.p2.clone().sub(s1.p1);

//     // Check on which side the points of s2 are
//     var c1 = v.cross(u);
//     var c2 = w.cross(u);
//     if (Math.abs(c1) < Garfunkel.EPSILON || Math.abs(c2) < Garfunkel.EPSILON)
//       return true; // s2 touches s1
//     return c1 > 0 !== c2 > 0;
//     // if both points on opposite sites -> s2 cross s1
//   };
//   return (
//     this.getBoundingBox().intersect(s.getBoundingBox()) &&
//     touchOrCross(this, s) &&
//     touchOrCross(s, this)
//   );
// };

// Segment.prototype.intersect2 = function (s) {};
