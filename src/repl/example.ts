// The entry point for usage examples and experiments

import * as Garfunkel from "../main";

import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { template } from "./plot";

const editor = new EditorView({
  doc: "print(_v(3,4))",
  extensions: [basicSetup, javascript()],
  parent: document.getElementById("editor")!,
});

editor.focus();

window.G = Garfunkel;
window._v = Garfunkel._v;

function print(v: Vect) {
  // TODO: render SVG
  console.log(v.toString());
}

document.getElementById("run")?.addEventListener("click", () => {
  eval(editor.state.doc.toString());
});

document.getElementById("output")!.innerHTML = template;
