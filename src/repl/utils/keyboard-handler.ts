export function createKeyboardHandler() {
	window.addEventListener('blur', () => {
		keys.clear();
	});

	window.addEventListener('keydown', (e) => {
		keys.add(e.key);
	});

	window.addEventListener('keyup', (e) => {
		keys.delete(e.key);
	});

	const keys = new Set<string>();

	return {
		is_key_down(key: string) {
			return keys.has(key);
		},
	};
}
