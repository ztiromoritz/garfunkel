

function pool() {
    const free_objects = [];
    const in_use = new Set();
    const context_stack = [];

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

const the_pool = pool();



function v(x,y){
    return the_pool.get(x,y);
}

function add(a,b){
    const x = a.x + b.x;
    const y = a.x + b.y;
    return the_pool.get(x,y);
}

function mul(a,s){
    const x = a.x * s;
    const y = a.x * s;
    return the_pool.get(x,y);
}

function wrap(fn, opts = {lift_result:true}){
    the_pool.push_context();
    const v = fn();
    if(opts.lift_result && v)
    {
        the_pool.lift(v);
    }
    the_pool.pop_context();
    return v;
}

const options = { lift_result: true };

console.log(wrap(()=>{
    const a = v(2,2);
    const b = v(3,3);
    return add(mul(a,4),mul(b,0.5))
}));

console.log(the_pool.free_count(), the_pool.in_use_count())
console.log(the_pool.debug());


// next step, write a game loop with it