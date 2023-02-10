import { Segment } from "./segment";
import { Vect } from "./vect";

export type PoolOptions<T> = {
  create: () => T;
};

export type Pool<T> = ReturnType<typeof create_pool<T>>;

export function create_pool<T>(options: PoolOptions<T>) {
  const free_objects: T[] = [];
  const in_use = new Set<T>();
  const context_stack: Set<T>[] = [];
  // Can an object be in 2 contexts on the stack???

  const { create } = options;

  function get(): T {
    const o = free_objects.length === 0 ? create() : free_objects.pop()!;
    use(o);
    return o;
  }

  function use(o: T) {
    in_use.add(o);
    const context = context_stack[context_stack.length - 1];
    if (context) {
      context.add(o);
    }
  }

  function free(o: T) {
    in_use.delete(o);
    free_objects.push(o);
  }

  // remove a value from current context
  // without freeing it
  function lift(o: T) {
    const context = context_stack[context_stack.length - 1];
    const parent_context = context_stack[context_stack.length - 2];
    if (context && o) {
      context.delete(o);
      if (parent_context) {
        parent_context.add(o);
      }
    }
  }

  function push_context() {
    // should we pool this Set as well :D
    context_stack.push(new Set());
  }

  function pop_context() {
    context_stack.pop()?.forEach(free);
  }

  function free_count() {
    return free_objects.length;
  }

  function in_use_count() {
    return in_use.size;
  }

  function debug() {
    return JSON.stringify(
      { free_objects, in_use: [...in_use], context_stack },
      null,
      2
    );
  }

  return {
    get,
    free,
    free_count,
    in_use_count,
    pop_context,
    push_context,
    lift,
    debug,
  };
}

type AllPools = Pool<Vect> | Pool<Segment>;
const all_pools: AllPools[] = [];

export const Pools = {
  register(pool: AllPools): void {
    all_pools.push(pool);
  },

  push_context() {
    all_pools.forEach((pool) => pool.push_context());
  },

  pop_context() {
    all_pools.forEach((pool) => pool.pop_context());
  },
};

export function wrap<T>(fn: () => T): T {
  Pools.push_context();
  const result = fn();
  Pools.pop_context();
  return result;
}
