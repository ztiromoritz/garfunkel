Rules:

- \*-functions.ts files hold a set of functions

  - that are pure, in the sense:
    - same input -> same output
    - input is not mutaded
  - that free all intermeediate objects after the value returns.
    - All Pools after the method has called have the same state of
      free and used object except the result of the functions should
      be a newly used object from one of the pools or a primitive result like a number (scalar) or boolean

- class methods in files like vect.ts and segment.ts can mutate the object and are chainable.
