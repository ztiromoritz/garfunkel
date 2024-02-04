# Garfunkel.js
See [the Garfunkel Hompage](https://zitro.uber.space/garfunkel/) for more information.
## What is this?
*Garfunkel.js* - is a 2d geometry toolbox.

But first an foremost it is my ever changing pet project. It started as a clone of [http://victorjs.org/](http://victorjs.org/) in 2015.
I used it to do some vector arithmetic in a Ludum Dare Game: [https://ztiromoritz.itch.io/oktapong](https://ztiromoritz.itch.io/oktapong)
I still use it to learn and explore new JS stuff and other tools. 

## Usage
```bash
npm i garfunkel
```

### Vector arithmetics
```js
import {_v} from 'garfunkel';
//
// 1. Vector arithmetics with a chaining options.
//
const a = _v(2,4);
const b = _v(-1,3);
// Mutating the vector a : 
a.mul(2)
 .add(b)
 .turnLeft();

// Changing a copy of the vector b:
const c = b.clone()
 .mul(3)
 .turnRight();

// b is still [-1,3]
```

### Wrap calculations within a context
If we performe complex calculations, we will work with intermediate instances of Vect.
These instances can all be created with the  _v function as seen above.
We can wrap this calculation so that all intermediate instances of vector objects
will be given back to the pool and can be reused.

```js
// _v can take a callback.
// The returned instance will be kept active, while all other instances will be given back to the pool (freed).

const result = _v(()=>{
 // return the longest edge of a triangle 
 // given by these 3 locations
 const a = _v(3,2);
 const b = _v(4,5);
 const c = _v(0,0);

 const delta_ab = a.clone().sub(b);
 const delta_bc = b.clone().sub(c);
 const delta_ca = b.clone().sub(a);

 const length_ab = delta_ab.length();
 const length_bc = delta_bc.length();
 const length_ca = delta_ca.length();

 if(length_ab > length_bc && length_ab > length_ca){
    return delta_ab;
 }else if (length_bc > length_ca){
    return delta_bc;
 }else {
    return delta_ca
 }
});

```

This might become handy, if you write a game loop that calculate some 2d physics 30 times a second.
We are just interested in some values like the position of our player given as a vector. 
But we need intermediate values to calculate the players interaction with the world. 



## Playground
The [Playground](https://zitro.uber.space/garfunkel/playground.html) can be used to test the vector api.
It implements basic `_init, _update, _draw` utils to create a simple game loop. 
Those functions implicitly serve as pool contexts the same way `_v` is used. 

## Documentation
[https://zitro.uber.space/garfunkel/docs/index.html](https://zitro.uber.space/garfunkel/docs/index.html)

## Tools and libs come and go
Things I experimented with on the way:
 * Writing JS "classes" with `Vect.prototype.normalize`
 * The Universal Module Definition (UMD) Pattern
 * Thinking about how to design the API: v1.add(v2), add(v1,v2), ..
 * Thinking about Memory Management and currently ended up with a stack based pooling solution
 * Experimenting with jsdoc and generating documentation with [https://documentation.js.org/](https://documentation.js.org/)
 * Using mocha for testing and used the in browser report
 * Doing automated builds and tests with [Travis CI](https://www.travis-ci.com/)
 * Using [bower](https://bower.io/)
 * Using Vite, TS and Vitest 
 * Thing about going back to jsdoc and JS :P
 * Collect intersection functions
 * Thinking about how to represent Rays, Segments, Lines
 * Build a minimal in browser playground with game framework like `_init,_update,_draw`, svg rendering and vue-petite
 * Going from `var` to `let` and `const` :)
 * Drawing jittering arrows

# Readings
 * https://github.com/TypeStrong/typedoc/issues/2458 this type and chaining in typedocs
