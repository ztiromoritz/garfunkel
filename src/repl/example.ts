// The entry point for usage examples and experiments

import * as Garfunkel from "../main";

import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";

const editor = new EditorView({
  extensions: [basicSetup, javascript()],
  parent: document.getElementById("editor")!,
});

editor.focus();

interface Window {
  G: typeof Garfunkel;
}
window.G = Garfunkel;

document.getElementById("run")?.addEventListener("click", () => {
  eval(editor.state.doc.toString());
});
