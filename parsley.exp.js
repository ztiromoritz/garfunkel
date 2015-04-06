var Pool = require('./parsley.pool').Parsley.Pool;
var Vect = require('./parsley').Parsley.Vect; 

/**
 * Experimental Equation Api.
 *  * Include Object Pooling
 */
(function(global){
	
	
	/**
	 * @constructor
	 */
	var VectEquation = function(){
		this.elements = []; //TODO: create destructor to empty this array
	};  
	
	var eqPool = new Pool(4,VectEquation, VectEquation);
	var vectPool = new Pool(16, Vect, Vect);
	
	
	VectEquation.get = function(){
		eqPool.get();
	};
	
	/**
	 * Dispose this equation and all the vectors produced by this equation
     * @param {Object} equation
     * @param {Object} disposeLastResult
	 */
	VectEquation.dispose = function( equation, disposeLast ){
 		for(var i = 0; i< this.elements.length; i++){
 			vectPool.dispose(this.elements[i]);
 		}
 		this.element.length = 0; //No destructor needed ??
 		eqPool.dispose(equation);
	};
	
	Vect.add = function(u,v){
		var result = vectPool.get();
		this.elements.push(result);
		result.x = u.x + v.x;
		result.y = u.y + v.y;	
		return result;
	};

	Vect.normalize = function(u){
		var result = vectPool.get();
	};
	
	
})(this);




var test = function(){
	
	var _ = VectEquation.get();
	
	r = _.sub(l, _.mul(2 * _.dot(_.leftNormal(n),l), n ));
	
	
	
	_.dispose();
	
};
