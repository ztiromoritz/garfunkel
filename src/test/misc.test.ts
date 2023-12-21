import { assert, describe, it } from 'vitest';
import { circle_point_intersect } from '../misc';
import { _v } from '../vect-functions';
import { _c } from '../circle-functions';

describe('Misc', () => {
	describe('segment-function', () => {
		/**
		 * <img src="media://">
		 **/
		it('circle_point_intersect', () => {
			const result = circle_point_intersect(_c(1, -4, 2), _v(-3, 6), _v(0, 0));
			assert(Math.abs(result - 0.333333) < 0.001);
		});

		it('circle_point_intersect_point_on_movement', () => {
			const result = circle_point_intersect(_c(0, 0, 2), _v(6, 0), _v(4, 0));
			assert(Math.abs(result - 0.333333) < 0.001);
		});
	});
});
