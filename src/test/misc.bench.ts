import { bench, describe } from 'vitest';
import { _c } from '../circle-functions';
import { circle_point_intersect, circle_point_intersect_opt } from '../misc';
import { _v } from '../vect-functions';

describe('Misc', () => {
  describe('benchmark', () => {
		bench('normal', ()=>{
      circle_point_intersect(_c(1, -4, 2), _v(-3, 6), _v(0, 0));
      circle_point_intersect(_c(0, 0, 2), _v(6, 0), _v(4, 0));
      circle_point_intersect(_c(0, 0, 2), _v(6, 0), _v(2, 2));
      circle_point_intersect(_c(0, 0, 2), _v(6, 0), _v(12, 3));
      circle_point_intersect(_c(0, 0, 2), _v(6, 0), _v(4, 3));
		})
		bench('opt', ()=>{
      circle_point_intersect_opt(_c(1, -4, 2), _v(-3, 6), _v(0, 0));
      circle_point_intersect_opt(_c(0, 0, 2), _v(6, 0), _v(4, 0));
      circle_point_intersect_opt(_c(0, 0, 2), _v(6, 0), _v(2, 2));
      circle_point_intersect_opt(_c(0, 0, 2), _v(6, 0), _v(12, 3));
      circle_point_intersect_opt(_c(0, 0, 2), _v(6, 0), _v(4, 3));
		})
  });
});
