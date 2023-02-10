import { Vect } from "./vect";

type ValueOf<T> = T[keyof T];

const INTERSECT_RESULT_KIND = {
  UNKNOWN: -1,
  PARALLEL: 0,
} as const;

type IntersectResultKind = ValueOf<typeof INTERSECT_RESULT_KIND>; //| ...

export function _intersect_result(
  type: IntersectResultKind,
  point: Vect
): IntersectResult {
  // TODO: use pool
  return new IntersectResult();
}

class IntersectResult {
  private point: Vect;
  private _kind: IntersectResultKind;
  constructor() {
    this.point = new Vect();
    this._kind = INTERSECT_RESULT_KIND.UNKNOWN;
  }

  get x() {
    return this.point.x;
  }

  get y() {
    return this.point.y;
  }

  get kind() {
    return this._kind;
  }
}
