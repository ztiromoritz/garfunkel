import { Circle } from './circle';
import { wrap } from './pool';
import { _s, intersectLines } from './segment-functions';
import { Vect } from './vect';
import { _v, distance, length as vect_length } from './vect-functions';

type Intersect = {
	type: 'INTERSECT';
	t: number;
};

type FlyBy = {
	type: 'FLY_BY';
	t: number;
};

export type IntersectCirclePointResult = Intersect | FlyBy;

/**
 * Collide a moving circle with a given point u.
 **/
export function circle_point_intersect(
	circle: Circle,
	movement: Vect,
	u: Vect,
): IntersectCirclePointResult {
	return wrap<IntersectCirclePointResult>(() => {
		const m = _v(circle.x, circle.y);

		// Take s1 as the movement segment of the center
		const s1 = _s.fromSupport(m, movement);

		// Find a line through u ortogonal to s1
		const dir = movement.clone().toRightNormal();
		const s2 = _s.fromSupport(u, dir);

		// intersect them
		const intersect = intersectLines(s1, s2);
		if (intersect.type === 'INTERSECT') {
			const p = s1.getPoint(intersect.t1);

			const a = distance(u, p);
			if (a > circle.radius) {
				return {
					type: 'FLY_BY',
					t: intersect.t1,
				};
			}

			// At the time of collision the three points:
			// u - The target point
			// p - the point where s1 and s2 intersect
			// m - the center of the circle
			// create a right-angled triangle with r as hypothenuse (u,m).
			const c = circle.radius;
			const b = Math.sqrt(c * c - a * a);

      // TODO: save some sqrt calculations sqrt(a)/sqrt(b) = sqrt(a/b)

			// Distance the circle already moved
			// as percentage of the whole movement
			return {
				type: 'INTERSECT',
				t: (distance(m, p) - b) / vect_length(movement),
			};
		} else {
			// TODO:
			// Can we get this case first without intersect
			// Line-vs-Point intersection
			const b = circle.radius;
			return {
				type: 'INTERSECT',
				t: distance(m, u) - b / vect_length(movement)
			}
		}
	});
}

export function circle_point_intersect_opt(
	circle: Circle,
	movement: Vect,
	u: Vect,
): IntersectCirclePointResult {
	return wrap<IntersectCirclePointResult>(() => {
		const m = _v(circle.x, circle.y);

		// Take s1 as the movement segment of the center
		const s1 = _s.fromSupport(m, movement);

		// Find a line through u ortogonal to s1
		const dir = movement.clone().toRightNormal();
		const s2 = _s.fromSupport(u, dir);

		// intersect them
		const intersect = intersectLines(s1, s2);
		if (intersect.type === 'INTERSECT') {
			const p = s1.getPoint(intersect.t1);

			const a = distance(u, p);
			if (a > circle.radius) {
				return {
					type: 'FLY_BY',
					t: intersect.t1,
				};
			}

			// At the time of collision the three points:
			// u - The target point
			// p - the point where s1 and s2 intersect
			// m - the center of the circle
			// create a right-angled triangle with r as hypothenuse (u,m).
			const c = circle.radius;
			const b = Math.sqrt(c * c - a * a);

      // TODO: save some sqrt calculations sqrt(a)/sqrt(b) = sqrt(a/b)

			// Distance the circle already moved
			// as percentage of the whole movement
			return {
				type: 'INTERSECT',
				t: (distance(m, p) - b) / vect_length(movement),
			};
		} else {
			// TODO:
			// Can we get this case first without intersect
			// Line-vs-Point intersection
			const b = circle.radius;
			return {
				type: 'INTERSECT',
				t: distance(m, u) - b / vect_length(movement)
			}
		}
	});
}
