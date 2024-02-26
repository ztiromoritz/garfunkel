// The entry point for usage examples and experiments

import { _v, _s, _c } from '../main';

import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';

import { plot } from './utils/plot';
import { Coord } from '../coord';
import { CanvasRenderer, createCanvasRenderer } from './utils/canvas-renderer';

import { helper } from './utils/repl-api';

import example_1 from './examples/example1.js?raw';


const editor = new EditorView({
	doc: example_1,
	extensions: [basicSetup, javascript()],
	parent: document.getElementById('editor')!,
});

editor.focus();

// canvas crisp render experiment
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
let canvasRenderer: CanvasRenderer;
if (canvas) {
	canvasRenderer = createCanvasRenderer(canvas, plot)
}

const svg = document.getElementById('plot') as SVGElement;

/*
editor.on("change", (editor) => {
	localStorage.setItem("garfunkel_editor", editor.getValue());
});
*/

Coord.setSchoolCoords();
Object.assign(window, { _v, _s, _c, ...helper });

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
	(window as any)._game = game;
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

function restart() {
	stop();
	parse();
	start();
}

const in_use_count = document.getElementById('in_use_count');
const free_count = document.getElementById('free_count');
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
		canvasRenderer?.render();
		in_use_count!.innerText = String(_v.pool.in_use_count());
		free_count!.innerText = String(_v.pool.free_count());
	}

	if (running) {
		window.requestAnimationFrame(gameLoop);
	}
}


document.getElementById('restart')?.addEventListener('click', () => restart());
document.getElementById('start')?.addEventListener('click', () => start());
document.getElementById('stop')?.addEventListener('click', () => stop());
document.getElementById('parse')?.addEventListener('click', () => parse());

const canvasWrapper = document.querySelector('.canvas-wrapper')! as HTMLElement;
Array.from(document.querySelectorAll('input[type=radio][name=render]')).forEach((radio: HTMLInputElement) => {
	radio.addEventListener('click', (event) => {
		const value = (event.target as HTMLInputElement)?.value;
		if(value==='svg'){
			canvasWrapper.style.display='none';
			svg.style.display="";
		}else if(value==='canvas'){
			canvasWrapper.style.display='';
			svg.style.display='none';
		}

	})
})

