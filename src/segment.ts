import { Vect } from "./vect";
import { _v } from "./vect-functions";

export class Segment {
  private p1: Vect;
  private p2: Vect;

  constructor() {
    this.p1 = new Vect();
    this.p2 = new Vect();
  }

  set(v1: Vect, v2: Vect) {
    this.p1.x = v1.x;
    this.p1.y = v1.y;
    this.p2.x = v2.x;
    this.p2.y = v2.y;
  }

  set x1(value: number) {
    this.p1.x = value;
  }

  get x1() {
    return this.p1.x;
  }

  set y1(value: number) {
    this.p1.y = value;
  }

  get y1() {
    return this.p1.y;
  }

  set x2(value: number) {
    this.p2.x = value;
  }

  get x2() {
    return this.p2.x;
  }

  set y2(value: number) {
    this.p2.y = value;
  }

  get y2() {
    return this.p2.y;
  }
}
