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
 // a.rotate(Math.PI/32);
  if(btn("w")){ a.add(_v(0,1)) }	
  if(btn("a")){ a.add(_v(-1,0)) }	
  if(btn("s")){ a.add(_v(0,-1)) }	
  if(btn("d")){ a.add(_v(1,0)) }	

  //_v(3,4).rotate(90).normalize()
  _v(3,4).normalize()
}

function _draw(){
  clear();
  print(a);
}
  `,
  extensions: [basicSetup, javascript()],
  parent: document.getElementById("editor")!,
});

/*
editor.on("change", (editor) => {
  localStorage.setItem("garfunkel_editor", editor.getValue());
});
*/
editor.focus();

function createKeyboardHandler() {
  window.addEventListener("blur", () => {
    keys.clear();
  });

  window.addEventListener("keydown", (e) => {
    keys.add(e.key);
  });

  window.addEventListener("keyup", (e) => {
    keys.delete(e.key);
  });

  const keys = new Set<string>();

  return {
    is_key_down(key: string) {
      return keys.has(key);
    },
  };
}

const keyboardHandler = createKeyboardHandler();

const helper = {
  print(v: Vect) {
    // TODO: render SVG
    plot.addVect(v);
  },

  btn(key: string) {
    return keyboardHandler.is_key_down(key);
  },

  clear() {
    plot.clear();
  },
};

Coord.setSchoolCoords();
Object.assign(window, { _v, ...helper });

let game: {
  _init?: () => void;
  _update?: () => void;
  _draw?: () => void;
} = {};
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

const poolsize = document.getElementById("poolsize");
let start_timestamp: DOMHighResTimeStamp;
const fps = 30;
const interval = 1000 / fps;
function gameLoop(timestamp: DOMHighResTimeStamp) {
  start_timestamp = start_timestamp ?? timestamp;

  const delta = timestamp - start_timestamp;
  if (delta > interval) {
    start_timestamp = timestamp - (delta % interval);

    _v(() => game._update?.());
    game._draw?.();
    poolsize!.innerText = `free: ${_v.pool.free_count()} in_use: ${_v.pool.in_use_count()}`;
  }

  if (running) {
    window.requestAnimationFrame(gameLoop);
  }
}

document.getElementById("start")?.addEventListener("click", () => start());
document.getElementById("stop")?.addEventListener("click", () => stop());
document.getElementById("parse")?.addEventListener("click", () => parse());

// canvas crisp render experiment
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (ctx) {
  ctx.imageSmoothingEnabled = false;
  ctx.scale(1, 1);
  ctx.beginPath(); // Start a new path
  ctx.moveTo(30, 50); // Move the pen to (30, 50)
  ctx.lineTo(150, 100); // Draw a line to (150, 100)
  ctx.stroke(); // Render the path
}
