// Stolen from here: https://codepen.io/vigneshenoy/pen/gKBLoy
import { createApp, reactive } from 'petite-vue';
import { Coord } from '../../coord';
import { Vect } from '../../vect';
import { Segment } from '../../segment';
import { Circle } from '../../circle';



export type Plot = {
	segments: Segment[],
	circles: Circle[],
}

export const plot = reactive({
	// see: https://projects.susielu.com/viz-palette
	colors: [
		'#00a622',
		'#ffd500',
		'#ef0028',
		'#ca2d75',
		'#000075',
		'#ff9813'
	],
	segments: [],
	circles: [],
	clear() {
		this.circles = [];
		this.segments = [];
	},
	addVect(v: Vect) {
		const y2 = Coord.getXIsLeftOfY() ? v.y : -v.y;
		this.segments.push({ x1: 0, y1: 0, x2: v.x, y2 });
	},
	addSegment(s: Segment) {
		const x1 = s.x1;
		const y1 = Coord.getXIsLeftOfY() ? s.y1 : -s.y1;
		const x2 = s.x2;
		const y2 = Coord.getXIsLeftOfY() ? s.y2 : -s.y2;
		this.segments.push({ x1, y1, x2, y2 });
	},
	addCircle(c: Circle) {
		const { x, y, radius } = c;
		this.circles.push({ x, y, radius });
	},
});

const plotApp = createApp(plot);
plotApp.mount('#plot');
