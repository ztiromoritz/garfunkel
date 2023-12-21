import { assert, describe, it } from 'vitest';
import { intersectLines, _s } from '../segment-functions';
import { almostEqualVect } from './test-utils';
import { _v } from '../vect-functions';

describe('Segment', () => {
  describe('segment-function', () => {
    it('intersectLines', () => {
      const s1 = _s(0, 0, 0, 4);
      const s2 = _s(0, 0, 4, 0);
      const result = intersectLines(s1, s2);

      assert(result.type == 'INTERSECT');
      assert(result.t1 == 0);
      assert(result.t2 == 0);
    });

    it('intersectLines_X', () => {
      const s1 = _s(0, 0, 4, 4);
      const s2 = _s(0, 4, 4, 0);
      const result = intersectLines(s1, s2);

      assert(result.type == 'INTERSECT');
      assert(result.t1 == 0.5);
      assert(result.t2 == 0.5);
    });


		
    it('intersectLines_YYY', () => {
      const s1 = _s(-3, 8, 3, -1);
      const s2 = _s(2, 1, 2, 3);
      const result = intersectLines(s1, s2);

			console.log({result, p: s1.getPoint(result.t1)});

      assert(result.type == 'INTERSECT');
      assert(result.t1 == 0.5);
      assert(result.t2 == 0.5);
    });


    it('intersectLines_XXX', () => {
      const s1 = _s(0, 0, 8, 8);
      const s2 = _s(0, 4, 4, 0);
      const result = intersectLines(s1, s2);

      assert(result.type == 'INTERSECT');
      assert(result.t1 == 0.5);
      assert(result.t2 == 0.5);
    });

    it('intersectLines_2', () => {
      const s1 = _s(1, -4, -2, 2);
      const s2 = _s(-2, -1, 0, 0);
      const result = intersectLines(s1, s2);

      assert(result.type == 'INTERSECT');
			const p1 = s1.getPoint(result.t1);
			const p2 = s2.getPoint(result.t2);
			
			almostEqualVect(p1,p2);
			almostEqualVect(p1, _v(-0.8, -0.4))
    });

    it('intersectLines_PARALLEL', () => {
      const s1 = _s(0, 0, 6, 0);
      const s2 = _s(2, 2, 15, 2);
      const result = intersectLines(s1, s2);

      assert(result.type == 'PARALLEL');
    });

    it('intersectLines_EQUIVALENT', () => {
      const s1 = _s(0, 0, 6, 0);
      const s2 = _s(-10, 0, -15, 0);
      const result = intersectLines(s1, s2);

      assert(result.type == 'EQUIVALENT');
    });
  });
});
