import { _v } from '../main';
import { describe, it, assert } from 'vitest';

describe('pool', function () {
  it('README.md example', function () {
    const in_use_count_before = _v.pool.in_use_count();
    let in_use_count_within;

    const result = _v(() => {
      // return the longest edge of a triangle
      // given by these 3 locations
      const a = _v(3, 2);
      const b = _v(4, 5);
      const c = _v(0, 0);

      const delta_ab = a.clone().sub(b);
      const delta_bc = b.clone().sub(c);
      const delta_ca = b.clone().sub(a);

      const length_ab = delta_ab.length();
      const length_bc = delta_bc.length();
      const length_ca = delta_ca.length();

      in_use_count_within = _v.pool.in_use_count();

      if (length_ab > length_bc && length_ab > length_ca) {
        return delta_ab;
      } else if (length_bc > length_ca) {
        return delta_bc;
      } else {
        return delta_ca;
      }
    });

    const in_use_count_after = _v.pool.in_use_count();

    assert(_v.pool.is_in_use(result));
    assert.equal(in_use_count_before + 1, in_use_count_after);

    console.log({
      in_use_count_before,
      in_use_count_within,
      in_use_count_after,
    });
  });
});
