import { Vect } from './vect';
import { _v } from './vect-functions';
import {
  _s,
  connection,
  length,
  lengthSq,
  direction,
  support,
	translate,
	rotate,
	toCenter,
	angle,
	getMiddle,
	getPoint
} from './segment-functions';

export class Segment {
  private p1: Vect;
  private p2: Vect;

  constructor() {
    this.p1 = new Vect();
    this.p2 = new Vect();
  }

  set(other: Segment) {
    this.x1 = other.x1;
    this.y1 = other.y1;
    this.x2 = other.x2;
    this.y2 = other.y2;
  }
  /*
		set(v1: Vect, v2: Vect) {
			this.p1.x = v1.x;
			this.p1.y = v1.y;
			this.p2.x = v2.x;
			this.p2.y = v2.y;
		}
		*/

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

  _chain(result: Segment): this {
    this.set(result);
    return this;
  }

  clone(): Segment {
    return _s.from(this);
  }

  support(): Vect {
    return support(this);
  }

  connection(): Vect {
    return connection(this);
  }

  direction(): Vect {
    return direction(this);
  }

  length(): number {
    return length(this);
  }

  lengthSq(): number {
    return lengthSq(this);
  }

  toString(): string {
    return toString(this);
  }

	getPoint(position: number): Vect {
		// Todo
	}

	getMiddle(): Vect {
		return // Todo
	}

	angle(ref?: Vect): number {
		return angle(this, ref);
	}


  translate(v: Vect): this {
    return this._chain(translate(this, v));
  }

	rotate(angle: number, pivot?:Vect): this {
		return this._chain(rotate(this, angle, pivot));
	}

	toCenter(): this {
		return this._chain(toCenter(this));
	}










}
