// The entry point for usage examples and experiments

import { Vect, _v } from "../main";

import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";

import "./plot";
import { plot } from "./plot";
import { Coord } from "../coord";

const editor = new EditorView({
  doc: "print(_v(3,4))",
  extensions: [basicSetup, javascript()],
  parent: document.getElementById("editor")!,
});

editor.focus();

function print(v: Vect) {
  // TODO: render SVG
  plot.addVect(v);
}

Coord.setSchoolCoords();
Object.assign(window, { _v, print });

document.getElementById("run")?.addEventListener("click", () => {
  eval(editor.state.doc.toString());
});
