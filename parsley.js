(function(global){
/**
 * parsley.js - my personal 2d geometry toolbox
 */

/**
 * Represents a vector as well as a point.
 *
 * It's a tupel.
 *
 * @param {Object} x
 * @param {Object} y
 */
var Vect = function(x, y) {
	this.x = x || 0;
	this.y = y || 0;
};


/**
 * Used for the isLeftOf, isRightOf, getLeftNormal, getRightNormal functions.
 * 
 * FALSE, means the normal school book coordinates with (0,0) in the lower left corner.
 * TRUE, means the canvas or graphic coordinates with (0,0) in the upper left corner;
 * 
 */
var X_IS_LEFT_TO_Y = true;

var ZERO = new Vect(0, 0);

var Parsley = {};

Parsley.setXisLeftOfY = function(value){
	X_IS_LEFT_TO_Y = value;
};


Vect.prototype.toString = function() {
	return 'x: ' + this.x + ' y: ' + this.y;
};


Vect.prototype.clone = function() {
	return new Vect(this.x, this.y);
};

Vect.prototype.cl = Vect.prototype.clone;


Vect.prototype.invert = function(){
	this.x = -this.x;
	this.y = -this.y;
	return this;
};

/**
 * Scalar multiplication.
 */
Vect.prototype.mul = function(s) {
	this.x *= s;
	this.y *= s;
	return this;
};

Vect.prototype.div = function(s) {
	this.x /= s;
	this.y /= s;
	return this;
};

Vect.prototype.add = function(v) {
	this.x += v.x;
	this.y += v.y;
	return this;
};

Vect.prototype.sub = function(v) {
	this.x -= v.x;
	this.y -= v.y;
	return this;
};

Vect.prototype.dot = function(v) {
	return this.x * v.x + this.y * v.y;
};


Vect.prototype.cross = function(v) {
	return (this.x * v.y ) - (this.y * v.x );
};

Vect.prototype.distanceSq = function(v){
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        return dx * dx + dy * dy;
};

Vect.prototype.distance = function (v) {
	return Math.sqrt(this.distanceSq(v));
};

Vect.prototype.isLeftOf = function(v){
	if(X_IS_LEFT_TO_Y)
		return this.cross(v) > 0;
	else
		return this.cross(v) < 0;
};

Vect.prototype.isRightOf = function(v){
		if(X_IS_LEFT_TO_Y)
		return this.cross(v) < 0;
	else
		return this.cross(v) > 0;
};

Vect.prototype.turnLeft = function(){
	var	x = this.y * ( X_IS_LEFT_TO_Y?1:-1 );
	var	y = this.x * ( X_IS_LEFT_TO_Y?-1:1 );	
	this.x = x;
	this.y = y;
	return this;
};

Vect.prototype.turnRight = function(){
	var	x = this.y * ( X_IS_LEFT_TO_Y?-1:1 );
	var	y = this.x * ( X_IS_LEFT_TO_Y?1:-1 );	
	this.x = x;
	this.y = y;
	return this;
};

Vect.prototype.leftNormal = function(){
 	this.turnLeft().normalize();
 	return this;
};

Vect.prototype.rightNormal = function(){
 	this.turnRight().normalize();
 	return this;
};

Vect.prototype.normalize = function() {
	var length = this.length();

	if (length === 0) {
		this.x = 1;
		this.y = 0;
	} else {
		this.div(length);
	}
	return this;
};

Vect.prototype.lengthSq = function() {
	return this.x * this.x + this.y * this.y;
};

Vect.prototype.length = function() {
	return Math.sqrt(this.lengthSq());
};


Vect.prototype.angle = function (){
	return Math.atan2(this.y, this.x);
};

Vect.prototype.rotate = function(angle) {
	var _x = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
	var _y = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));
	this.x = _x;
	this.y = _y;
	return this;
};

Vect.prototype.rotateTo = function(angle){
	this.rotate(angle - this.angle());
	return this;
};


Vect.prototype.reflectOn = function( u ){
	var l,n,r;
	if(this.isRightOf(u)){
		l = this.clone();
		n = u.clone().leftNormal();
		r = l.sub(n.clone().mul( n.dot(l) * (2) ));
	}else if(this.isLeftOf(u)){
		l = this.clone();
		n = u.clone().rightNormal();
		r = l.sub(n.clone().mul( n.dot(l) * (2) ));
	}else{
		r = this.clone().invert();;
	}
	this.x = r.x;
	this.y = r.y;
	return this;	
};


/**
 * A rectangular box with edges parallel to the coordinate axes.
 * The origin (0,0) is in the upper left corner.
 * So:
 * 		Box#left &le; Box#right
 * 		Box#top  &le; Box#bottom
 */
var Box = function(x0, x1, y0, y1) {
	this.left = Math.min(x0, x1);
	this.right = Math.max(x0, x1);
	this.top = Math.min(y0, y1);
	this.bottom = Math.max(y0, y1);
};

/**
 * Bounding box of a given Segment
 */
Box.fromSegment = function(segment) {
	return new Box(segment.p1.x, segment.p2.x, segment.p1.y, segment.p2.y);

};

Box.prototype.toString = function() {
	return "[ left: " + this.left + " right: " + this.right + " top: " + this.top + " bottom: " + this.bottom + " ]";
};

Box.prototype.containsPoint = function(p) {
	return this.left <= p.x && p.x <= this.right//
	&& this.top <= p.y && p.y <= this.bottom;
};

Box.prototype.intersect = function(box) {
	return this.left <= box.right && box.left <= this.right//
		 && this.top <= box.bottom && box.top <= this.bottom;
};

/**
 * A line segment represented by two points.
 *  
 * (The line segment has a orinentation given by the order or the two points.)
 *
 * @param {Object} p1
 * @param {Object} p2
 */
var Segment = function(p1, p2) {
	this.p1 = p1 || new Vect(0, 0);
	this.p2 = p2 || new Vect(1, 1);
	this.boundingBox = new Box.fromSegment(this);
	this.connection = this.p2.clone().sub(this.p1);
};

Segment.prototype.toString = function() {
	return '[ ' + this.p1 + ' , ' + this.p2 + ' ]';
};

Segment.fromArray = function(arr) {
	return new Segment(new Vect(arr[0], arr[1]), new Vect(arr[2], arr[3]));
};

Segment.fromObject = function(obj){
	return new Segment(obj.p1,obj.p2);
};

Segment.prototype.clone = function() {
	return new Segment(this.p1.clone(), this.p2.clone());
};

Segment.prototype.toCenter = function() {
	this.p2 = this.connection.clone();
	this.p1 = ZERO.clone();
	return this;
};


Segment.prototype.length = function(){
	return this.p1.clone().sub(this.p2).length();
};

Segment.prototype.lengthSq = function(){
	return this.p1.clone().sub(this.p2).lengthSq();
};

Segment.prototype.intersect = function(s) {
	var EPSILON = 0.000001;

	var touchOrCross = function(s1, s2) {

		// X as line, Y as two points
		// Move this.p1 to ZERO
		var u = s1.clone().toCenter().p2;
		var v = s2.p1.clone().sub(s1.p1);
		var w = s2.p2.clone().sub(s1.p1);

		var c1 = v.cross(u);
		var c2 = w.cross(u);
		if (Math.abs(c1) < EPSILON || Math.abs(c2) < EPSILON)
			return true;
		//Y touches X
		return (c1 > 0) !== (c2 > 0);
		// Y cross X
	};
	return this.boundingBox.intersect(s.boundingBox) && touchOrCross(this, s) && touchOrCross(s, this);
};

Parsley.Vect = Vect;
Parsley.Segment = Segment;
Parsley.Box = Box;

global.Parsley = Parsley;

})(this);
