import { assert, describe, it } from 'vitest';
import { intersectLines, _s } from '../segment-functions';

describe('Segment', () => {
  describe('segment-function', () => {
    it('intersectLines', () => {
			const s1 = _s(0,0,0,4) 
			const s2 = _s(0,0,4,0) 
      const result = intersectLines(s1, s2);

      assert(result.type == 'INTERSECT');
			assert(result.t1 == 0);
			assert(result.t2 == 0);
    });
  });
});
