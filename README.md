# What is this?
*Garfunkel.js* - is a 2d geometry toolbox.

But first an foremost it is my ever changing pet project. It started as a clone of [http://victorjs.org/](http://victorjs.org/) in 2015.
I used it to do some vector arithmetic in a Ludum Dare Game: [https://ztiromoritz.itch.io/oktapong](https://ztiromoritz.itch.io/oktapong)
I still use it to learn and explore new JS stuff and other tools. 

# Usage
```
```

# Playground

# Documentation

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
 * Build a minimal in browser playground with `_init,_update,_draw` and svg rendering and vue-petite
 * Going from `var` to `let` and `const` :)
 * Drawing jittering arrows


# Readings
 * https://github.com/TypeStrong/typedoc/issues/2458 this type and chaining in typedocs
