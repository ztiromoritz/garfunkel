(function(global){
	
	
/**
 * 
 * TODO: desctructor
 * 
 * Simple Object Pool 
 * (for internal and external use)	
 * <img src="../doc/logo.jpg">
 * 
 * @example
 *  	exponential growth
 *      growth = function(capacity){return capacity === 0?1:2*capacity;};
 * @memberOf Parsley
 * @class Pool
 * @constructor
 * @param {Number} capacity The initial capacity.
 */
var Pool = function(capacity, constructor , initializer, growth){
	this.items = new Array(capacity);
	this.capacity = capacity;
	this.current = capacity;
	this.initializer = initializer;
	this.constructor = constructor;
	this.growth = growth || function(cap){return 1;};// 
	this.createItems( capacity );
};


/** 
 * CreateItems
 * 
 * @function 
 * 
 */
Pool.prototype.createItems = function(size){
	this.items.length = size;
	for(var i = 0; i < size; i++)
		this.items[i] = new this.constructor();	
};

/**
 * @function
 */
Pool.prototype.get = function(){
	if(this.current === 0){
		var growth = this.growth( this.capacity ); 
		this.capacity += growth;
		this.current = growth;
		this.createItems( growth );	
	}		
	this.current--;
	var item = this.items[this.current];
	this.initializer.apply( item, arguments );
	return item;
};

/**
 * @function
 */
Pool.prototype.dispose = function( obj ){
	this.current = this.items.push(obj);
	this.capacity = Math.max(this.capacity, this.current);	
};



if(!!!global.Parsley)
	global.Parsley = {};

global.Parsley.Pool = Pool;
	
})(this);

