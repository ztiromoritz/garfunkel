import { assert, describe, it } from 'vitest';
import { circle_point_intersect, circle_point_intersect_opt } from '../misc';
import { _v } from '../vect-functions';
import { _c } from '../circle-functions';

describe('Misc', () => {
  describe('segment-function', () => {
    /**
     * <img src="media://">
     **/
    it('circle_point_intersect', () => {
      const result = circle_point_intersect(_c(1, -4, 2), _v(-3, 6), _v(0, 0));
      assert(result.type === 'INTERSECT');
      assert(Math.abs(result.t - 0.333333) < 0.001);
    });

    it('circle_point_intersect_point_on_movement', () => {
      const result = circle_point_intersect(_c(0, 0, 2), _v(6, 0), _v(4, 0));
      assert(result.type=== 'INTERSECT');
      assert(Math.abs(result.t - 0.333333) < 0.001);
    });

    it('circle_point_intersect_point_tangent', () => {
      const result = circle_point_intersect(_c(0, 0, 2), _v(6, 0), _v(2, 2));
			assert(result.type === 'INTERSECT')
      assert(Math.abs(result.t - 0.333333) < 0.001);
    });

    it('circle_point_intersect_point_fly_by_not_yet', () => {
      const result = circle_point_intersect(_c(0, 0, 2), _v(6, 0), _v(12, 3));
			assert(result.type == 'FLY_BY')
      assert(Math.abs(result.t - 2) < 0.001);
    });

    it('circle_point_intersect_point_miss', () => {
      const result = circle_point_intersect(_c(0, 0, 2), _v(6, 0), _v(4, 3));
			assert(result.type == 'FLY_BY')
      assert(Math.abs(result.t - 0.66666666) < 0.001);
    });

	  // todo: param
    /**
     * <img src="media://">
     **/
    it('circle_point_intersect', () => {
      const result = circle_point_intersect_opt(_c(1, -4, 2), _v(-3, 6), _v(0, 0));
      assert(result.type === 'INTERSECT');
      assert(Math.abs(result.t - 0.333333) < 0.001);
    });

    it('circle_point_intersect_opt_point_on_movement', () => {
      const result = circle_point_intersect_opt(_c(0, 0, 2), _v(6, 0), _v(4, 0));
      assert(result.type=== 'INTERSECT');
      assert(Math.abs(result.t - 0.333333) < 0.001);
    });

    it('circle_point_intersect_opt_point_tangent', () => {
      const result = circle_point_intersect_opt(_c(0, 0, 2), _v(6, 0), _v(2, 2));
			assert(result.type === 'INTERSECT')
      assert(Math.abs(result.t - 0.333333) < 0.001);
    });

    it('circle_point_intersect_opt_point_fly_by_not_yet', () => {
      const result = circle_point_intersect_opt(_c(0, 0, 2), _v(6, 0), _v(12, 3));
			assert(result.type == 'FLY_BY')
      assert(Math.abs(result.t - 2) < 0.001);
    });

    it('circle_point_intersect_opt_point_miss', () => {
      const result = circle_point_intersect_opt(_c(0, 0, 2), _v(6, 0), _v(4, 3));
			assert(result.type == 'FLY_BY')
      assert(Math.abs(result.t - 0.66666666) < 0.001);
    });

  });
});
