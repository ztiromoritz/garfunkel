export type PoolOptions<T> = {
    create: ()=>T;
}

export function create_pool<T>(options: PoolOptions<T>) {
    const free_objects: T[] = [];
    const in_use = new Set<T>();
    const context_stack:Set<T>[] = [];

    // Can an object be in 2 contexts on the stack???

    function create(x,y){
        return {x,y};
    }

    function get(x,y){
        if (free_objects.length === 0) {
            const v = create(x,y);
            use(v);
            return v;
        }else{
            const v = free_objects.pop();
            use(v);
            v.x = x;
            v.y = y;
            return v;
        }
    }

    function use(v){
        in_use.add(v);
        const context = context_stack[context_stack.length-1];
        if(context){
            context.add(v);
        }
    }
    function free(v){
        in_use.delete(v);
        free_objects.push(v);
    }

    // remove a value from current context
    // without freeing it
    function lift(v){
        const context = context_stack[context_stack.length-1];
        if(context){
            context.delete(v);
        }
    }


    function push_context(){
        context_stack.push(new Set());
    }


    function pop_context(){
        context_stack.pop().forEach(free);
    }

    function free_count(){
        return free_objects.length;
    }

    function in_use_count(){
        return in_use.size;
    }

    function debug(){
        return JSON.stringify({free_objects, in_use: [...in_use],context_stack}, null, 2);
    }

    return {get,free,free_count, in_use_count, pop_context, push_context, lift, debug};
}