(function ({Vect, Pool}) {


    /**
     * ImmutableVect seems to work very well, but hast do be testet
     * I'm not sure if the ImmutablePooledVect works so well right now.
     *
     */


    const ImmutableVect = function (x, y) {
        this.x = x;
        this.y = y;
    };

    ImmutableVect.fromVect = function (v) {
        return new ImmutableVect(v.x, v.y);
    };

    Vect.createImmutable = function (x, y) {
        return new ImmutableVect(x, y);
    };

    Vect.createImmutablePooled = function (x, y) {
        return new ImmutablePooledVect()
    };


    const vectPoolSymbol = Symbol();
    const ImmutablePooledVect = function (x, y) {
        this.x = x;
        this.y = y;
        this[vectPoolSymbol] = null;
    };
    const vectPool = new Pool(32, ImmutablePooledVect, ImmutablePooledVect);
    const vectPooledCreate = function (v, predecessor) {
        const result = vectPool.get(v.x, v.y);
        result[vectPoolSymbol] = predecessor;
        return result;
    };

    const dispose = function () {
        const predecessor = this[vectPoolSymbol];
        if (predecessor) {
            predecessor.dispose();
        }
        this[vectPoolSymbol] = null;
        vectPool.dispose(this);
    }

    const normalCreate = function (v, predecesor) {
        return new ImmutableVect(v.x, v.y);
    }

    const immutableFunction = (name, func, create) => {
        const temp = new Vect();
        return function () {
            temp.set(this.x, this.y);
            const result = func.apply(temp, arguments);
            if (result === temp) {
                // chainable result
                return create(temp, this);
            } else {
                return result;
            }
        };
    }


    const createPrototype = function (create) {
        return Object.entries(Vect.prototype)
            .map(([name, func]) => {
                if (['clone', 'toString'].includes(name)) { //optimization
                    return [name, func];
                } else if (typeof func === 'function') {
                    return [name, immutableFunction(name, func, create)];
                } else {
                    return [name, func];
                }
            })
            .reduce((acc, [name, func]) => {
                acc[name] = func;
                return acc;
            }, {});

    }

    const immutablePrototype = createPrototype(normalCreate);
    const immutablePooledPrototype = createPrototype(vectPooledCreate);
    immutablePooledPrototype.dispose = dispose;

    Object.assign(ImmutableVect.prototype, immutablePrototype);
    Object.assign(ImmutablePooledVect.prototype, immutablePooledPrototype);


})(Garfunkel);
