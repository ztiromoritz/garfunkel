import { TAU } from "../../utils";
import { Plot } from "./plot";

export type CanvasRenderer = { render: () => void }

export function createCanvasRenderer(
	canvas: HTMLCanvasElement,
	state: Plot): CanvasRenderer {

	const ctx = canvas.getContext('2d');
	if (ctx) {
		ctx.imageSmoothingEnabled = false;
		ctx.scale(1, 1);
	}

	function render() {
		if (!ctx) return;

		ctx.clearRect(0, 0, 500, 500);

		ctx.save();
		ctx.translate(250, 250);
		ctx.scale(3, 3);

		state.circles.forEach((circle) => {
			ctx.beginPath(); // Start a new path
			ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
			ctx.stroke(); // Render the path
		})

		state.segments.forEach((segment) => {
			ctx.beginPath(); // Start a new path
			ctx.moveTo(segment.x1, segment.y1); // Move the pen to (30, 50)
			ctx.lineTo(segment.x2, segment.y2); // Draw a line to (150, 100)
			ctx.stroke(); // Render the path
			ctx.beginPath(); // Start a new path
			ctx.arc(segment.x2, segment.y2, 2, 0, TAU);
			ctx.fill()
		})


		ctx.restore();
	}


	return {
		render
	}

}
