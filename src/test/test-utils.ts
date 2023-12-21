import { assert } from 'vitest';

import { Vect } from '../vect';

export function almostEqual(x: number, y: number, epsilon: number) {
    assert.isTrue(
        Math.abs(x - y) <= epsilon,
        `Difference between ${x} and ${y} larger then epsilon`
    );
}

export function almostEqualVect(
    a: { x: number; y: number },
    b: Vect,
    epsilon: number = 0.0001
) {
    assert.isTrue(
        Math.abs(a.x - b.x) <= epsilon,
        `Difference between x values ${a.x} and ${b.x} larger then epsilon`
    );
    assert.isTrue(
        Math.abs(a.y - b.y) <= epsilon,
        `Difference between y values ${a.y} and ${b.y} larger then epsilon`
    );
}
