const spriteA = {};

function setup() {
    // Init

    const a = v(3, 4);
    const b = v(4, 4);

    const t = s(23); // Skalar??

    const c = v(() => add(a, b)) // like readonly computed
    const d = v(() => a.add(b))
    const e = v(add(a,b))
    return { a, b, c, d, e }
}

function update() {
    // The game loop

    a.set(4, 5);
    b.set(5, 6);
    b.y = 23


    const [x, y] = c.get()

    spriteA.x = c.x; // getter, triggers evaluation
    spriteB.y = c.y;

}






