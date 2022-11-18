// Stolen from here: https://codepen.io/vigneshenoy/pen/gKBLoy
import { createApp, reactive } from "petite-vue";
import { Coord } from "../coord";
import { Vect } from "../vect";

export const plot = reactive({
  // see: https://projects.susielu.com/viz-palette
  colors: [
    "#ffd700",
    "#ffb14e",
    "#fa8775",
    "#ea5f94",
    "#cd34b5",
    "#9d02d7",
    "#0000ff",
  ],
  segments: [],
  clear() {
    this.segments = [];
  },
  addVect(v: Vect) {
    const y2 = Coord.getXIsLeftOfY() ? v.y : -v.y;
    this.segments.push({ x1: 0, y1: 0, x2: v.x, y2 });
  },
});

const plotApp = createApp(plot);
plotApp.mount("#plot");
