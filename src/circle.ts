
import { Vect } from "./vect";
import { _v } from "./vect-functions";

export class Circle {
  private m: Vect;
  private r: number;

  constructor() {
    this.m = new Vect();
    this.r = 1; 
  }

  set(m: Vect, r: number) {
    this.m.x = m.x;
    this.m.y = m.y;
    this.r = r;
  }

  set x(value: number) {
    this.m.x = value;
  }

  get x() {
    return this.m.x;
  }

  set y(value: number) {
    this.m.y = value;
  }

  get y() {
    return this.m.y;
  }

  set radius(value: number) {
    this.r = value;
  }

  get radius() {
    return this.r;
  }

}
