// The entry point for usage examples and experiments

import { Vect, _v } from "../main";

import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";

import "./plot";
import { plot } from "./plot";
import { Coord } from "../coord";

const editor = new EditorView({
  doc: `


let a,b,c;
function _init(){
  a = _v(0,30);
}

function _update(){
 a.rotate(Math.PI/32);
}

function _draw(){
  clear();
  print(a);
}

  `,
  extensions: [basicSetup, javascript()],
  parent: document.getElementById("editor")!,
});

editor.focus();

function print(v: Vect) {
  // TODO: render SVG
  plot.addVect(v);
}

function clear() {
  plot.clear();
}

Coord.setSchoolCoords();
Object.assign(window, { _v, print, clear });

let game = {};
let running = false;

function parse() {
  const code = editor.state.doc.toString();
  const fnStr = `
	${code}
	const _result = {};
	_result._init = (()=>{ try { return _init; }catch{ return null; } })();
	_result._update = (()=>{ try { return _update; }catch{ return null; } })();
	_result._draw = (()=>{ try { return _draw; }catch{ return null; } })();
	return _result;

  `;
  const fn = new Function(fnStr);
  game = fn();
  console.log("parsed", game);
}

function start() {
  running = true;
  plot.clear();
  game._init?.();
  window.requestAnimationFrame(gameLoop);
}

function stop() {
  running = false;
}

let start_timestamp;
const fps = 30;
const interval = 1000 / fps;
function gameLoop(timestamp) {
  console.log("gameLoop", timestamp);
  start_timestamp = start_timestamp ?? timestamp;

  const delta = timestamp - start_timestamp;
  if (delta > interval) {
    start_timestamp = timestamp - (delta % interval);

    game._update?.();
    game._draw?.();
    console.log("tick");
  }

  if (running) {
    window.requestAnimationFrame(gameLoop);
  }
}

document.getElementById("start")?.addEventListener("click", () => start());
document.getElementById("stop")?.addEventListener("click", () => stop());
document.getElementById("parse")?.addEventListener("click", () => parse());
