import { Circle } from './circle';
import { create_pool, Pool, Pools } from './pool';
import { Segment } from './segment';
import { Vect, ZERO } from './vect';
import {
	_v,
	sub as vect_sub
} from './vect-functions';

import {
	length as segment_length,
} from './segment-functions';

const circle_pool: Pool<Circle> = create_pool<Circle>({
	create: () => new Circle(),
});

Pools.register(circle_pool);

interface _c {
	// Construct a Circle via callback. All intermediate resources will be freed afterwards.
	(fn: () => Circle): Circle;
	// Construct a circle from it's center an a radius
	(m?: Vect, r?: number): Circle;
	// Construct a circle from a segment. Take the support as a center and the length as the radius.
	(s: Segment): Circle;

	(x1: number, y1: number, r: number): Circle;
	pool: Pool<Circle>;
}

export function _c(
	arg0?: Vect | Segment | (() => Circle) | number,
	arg1?: number,
	arg2?: number,
): Circle {
	if (typeof arg0 === 'function') {
		Pools.push_context();
		const c = arg0();
		if (c) circle_pool.lift(c);
		Pools.pop_context();
		return c;
	} else if (
		arguments.length === 3 &&
		typeof arg0 === 'number' &&
		typeof arg1 === 'number' &&
		typeof arg2 === 'number'
	) {
		const c = circle_pool.get();
		c.x = arg0;
		c.y = arg1;
		c.radius = arg2;
		return c;
	} else if (arguments.length === 1 && arg0?.constructor.name === Segment.name) {
		const s = (arg0 as Segment);
		const c = circle_pool.get();
		c.x = s.x1
		c.y = s.y1
		c.radius = segment_length(s);
		return c;
	} else {
		const c = circle_pool.get();
		const m = arg0?.constructor?.name === Vect.name ? (arg0 as Vect) : ZERO;
		const r = arg1 ?? 1;
		c.set(m, r);
		return c;
	}
}

_c.pool = circle_pool;

// functions
export function toString(c: Circle): string {
	return `[Circle m: (${c.x}, ${c.y}) r: ${c.radius} ]`;
}

export function translate(c: Circle, v: Vect): Circle {
	const x = c.x + v.x;
	const y = c.y + v.y;
	const r = c.radius;
	return _c(x, y, r);
}

/**
 * Move circles center (x,y) to center (0,0). Keeps the radius.
 */
export function toCenter(c: Circle): Circle {
	return _c(() => {
		const move = vect_sub(ZERO, _v(c.x, c.y));
		return translate(c, move);
	});
}











