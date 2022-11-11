/**
 * A simple object pool
 *
 * @class Pool
 *
 * @constructor
 * @param {Number} capacity The initial capacity.
 */
var Pool = function (capacity, constructor, initializer, growth) {
    this.items = new Array(capacity);
    this.capacity = capacity;
    this.current = capacity;
    this.initializer = initializer;
    this.constructor = constructor;
    this.growth = growth || function (cap) {
        return 1;
    };//
    this.createItems(capacity);
};


/**
 * CreateItems
 *
 *
 */
Pool.prototype.createItems = function (size) {
    this.items.length = size;
    for (var i = 0; i < size; i++) {
        this.items[i] = new this.constructor();
    }
};

/**
 */
Pool.prototype.get = function () {
    if (this.current === 0) {
        var growth = this.growth(this.capacity);
        this.capacity += growth;
        this.current = growth;
        this.createItems(growth);
    }
    this.current--;
    var item = this.items[this.current];
    this.initializer.apply(item, arguments);
    return item;
};

/**
 */
Pool.prototype.dispose = function (obj) {
    this.current = this.items.push(obj);
    this.capacity = Math.max(this.capacity, this.current);
};


export default Pool;