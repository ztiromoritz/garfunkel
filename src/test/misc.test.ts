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
			const result = circle_point_intersect(_c(1, -4, 2), _v(-12, 24), _v(0, 0));
			console.log(result);
			assert(Math.abs(result - 0.333333) < 0.001);
		});
	});
});
