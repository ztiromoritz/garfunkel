import { Circle } from "../../circle";
import { Segment } from "../../segment";
import { Vect } from "../../vect";
import { createKeyboardHandler } from "./keyboard-handler";
import { plot } from "./plot";

const keyboardHandler = createKeyboardHandler();

export const helper = {
	print(o: Vect | Segment | Circle) {
		const type = o?.constructor?.name as String;
		if (!type) return;
		switch (type) {
			case Vect.name:
				plot.addVect(o);
				break;
			case Segment.name:
				plot.addSegment(o);
				break;
			case Circle.name:
				plot.addCircle(o);
				break;
		}
	},

	btn(key: string) {
		return keyboardHandler.is_key_down(key);
	},

	clear() {
		plot.clear();
	},
};
