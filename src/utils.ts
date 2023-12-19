export const TAU = Math.PI * 2;

export const SQRT_OF_2 = Math.sqrt(2);

export const EPSILON = 0.00001;

// Converts from degrees to radians.
export function radians(degrees: number) {
	return (degrees * TAU) / 360;
}

// Converts from radians to degrees.
export function degrees(radians: number) {
	return (radians * 360) / TAU;
}
