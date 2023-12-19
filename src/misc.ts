import { Circle } from './circle';
import { wrap } from './pool';
import { _s, connection, intersectLines, support } from './segment-functions';
import { Vect } from './vect';
import { _v, add, mul, distance, length as vect_length } from './vect-functions';

/**
 * Collide a moving circle with a given point u.
 *
 **/
export function circle_point_intersect(
	circle: Circle,
	movement: Vect,
	u: Vect,
) {
	return wrap(() => {
		const m = _v(circle.x, circle.y);
		const s1 = _s(m, movement);

		const dir = movement.clone().toLeftNormal();
		const sup = u;
		const s2 = _s(sup, dir);
		const intersect = intersectLines(s1, s2);
		let p: Vect;
		let b: number;
		if (intersect.type === 'INTERSECT') {
			p = add(support(s1), mul(connection(s1), intersect.t1));
			console.log({p})

			// Pythagoras
			const a = distance(u, p);
			const c = circle.radius;
			b = Math.sqrt(c*c - a*a);

			return distance(m,p) - b / vect_length(movement);
		} else {
		  b = circle.radius	
			return distance(m,u) - b / vect_length(movement);
		}
	});
}
