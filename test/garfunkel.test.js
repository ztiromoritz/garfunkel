var assert = require("assert");
var sinon = require("sinon");
var expect = require("chai").expect;
var Garfunkel = require("../garfunkel").Garfunkel;
Vect = Garfunkel.Vect;
Box = Garfunkel.Box;
Segment = Garfunkel.Segment;
Equation = Garfunkel.Equation;
Pool = Garfunkel.Pool;

describe('Pool#constructor', function(){
	it('should take initial size, constructor and initializer',
		function(){
			var pool = new Pool(1, Vect, function(x,y){this.x = x; this.y = y;}); //Can the constructor be reused as init?	
		}
	);
	
});


describe('Pool#get' , function(){
	var constructorSpy = sinon.spy(Vect);
	var initializerSpy = sinon.spy(Vect);
	var pool; 
	
	beforeEach(function(){
		pool = new Pool(4, constructorSpy, initializerSpy);
		constructorSpy.reset();
		initializerSpy.reset();	
	});
	
	
	it('should take the given capacity and be full loaded at start', function(){
		expect(pool.capacity, "capacity").to.be.equal(4);
		expect(pool.current, "current").to.be.equal(4);
	});
	
	it('should keep have the given capacity and update the current load', function(){
		pool.get(3,4);
		expect(pool.capacity, "capacity").to.be.equal(4);
		expect(pool.current, "current").to.be.equal(3);
	});
	
	it('should take object not created by the pool', function(){
		/**
		 * This might be unusual, because the object was not created under the control of this pool.
		 * So for example another constructor was used. 
		 * If the capacity is reached, desiposing a new object would increase the capacity.
		 * 
		 * Not that the application also could juggle with more instances but keep a certain amount of them 
		 * undisposed at every moment. So the capacity of the pool would not increase, but every object could be 
		 * passed to the pool once in a while.
		 * 
		 */
		pool.dispose(new Vect(7,7));
		expect(pool.capacity, "capacity").to.be.equal(5);
		expect(pool.current, "current").to.be.equal(5);	
	});
	
		
	it('capacity 0 is possible', function(){
		pool = new Pool(0, constructorSpy, initializerSpy);		
		expect(pool.capacity, "capacity").to.be.equal(0);
		expect(pool.current, "current").to.be.equal(0);
	});
	
	it('dispose can be used to initialize a capacity zero pool', function(){
		pool = new Pool(0, constructorSpy, initializerSpy);
		pool.dispose(new Vect(3,1));
		pool.dispose(new Vect(4,1));
		pool.dispose(new Vect(5,9));
		pool.dispose(new Vect(2,6));
		expect(pool.capacity,"capacity").to.be.equal(4);
		expect(pool.current, "current").to.be.equal(4);
	});
	
	it('get can also be used to initialize a capacity zero pool', function(){
		pool = new Pool(0, constructorSpy, initializerSpy);
		pool.get(3,1);
		pool.get(4,1);
		pool.get(5,9);
		pool.get(2,6);
		expect(pool.capacity, "capacity").to.be.least(4);
		expect(pool.current, "current").to.be.equal(0);
	});
	
	
	it('should give instance created by constructor function', function(){	
		assert(pool.get(3,4) instanceof Vect);
	});
	
	it('should use initialize function', function(){
		pool.get();
		assert(initializerSpy.called);		
	});	
	
	it('should work with parameters', function(){	
		var v = pool.get(2,9);
		assert.equal(v.x, 2);
		assert.equal(v.y, 9);	
	});
	
});


describe('Equation#get', function(){
	it('should provide an Equation', function(){
		var e = Equation.get();
		expect(e).to.be.instanceOf(Equation);	
	});
});


describe('Equation#_get()', function(){
	it('should provide a Vect', function(){
		var e = Equation.get();	
		expect(e._get()).to.have.property('x');
		expect(e._get()).to.have.property('y');
		expect(e._get()).to.be.instanceof(Vect);
		
	});
	
	
	it('should set the values', function(){
		var e = Equation.get();
		var v = e._get(1,4);
		expect(v.x).to.be.equal(1);
		expect(v.y).to.be.equal(4);
	});
		
});

describe('Equation.dispose' , function(){
	it('should cleanup without error after a small equation', function(){
		var e = Equation.get();
		e.sub(e.v(3,4),e.v(3,5));
		Equation.dispose(e);
	});
});

describe('Equation#items', function(){
	it('should count only own elements', function(){
		var e = Equation.get();
		var u = new Vect(2,3);
		var v = e._get(23,7);
		var w = e.add(u,v);
		
		expect(e.items.length).to.be.equal(2);
		
		expect(e.items[0].x).to.be.equal(23);
		expect(e.items[1].x).to.be.equal(25);
	});
});


describe('Equation#mul', function(){
	it('should provide new object', function(){
		var e = Equation.get();
		var u = new Vect(2,3);
		var v = e.mul(4,u);
		expect(u.x).to.be.equal(2);
		expect(u.y).to.be.equal(3);
	});
	
	it('should multiply by skalar', function(){
		var e = Equation.get();
		var u = new Vect(2,3);
		var v = e.mul(4,u);
		expect(v.x).to.be.equal(8);
		expect(v.y).to.be.equal(12);
	});
});

describe('Vect#constructor', function(){
 it('should keep values', function(){
	var v = new Vect(0,0);
	assert.equal(0,v.x);
	assert.equal(0,v.y);
  });
  it('should have defaults', function(){
	var v = new Vect();
	assert.equal(0,v.x);
	assert.equal(0,v.y);
  });
});

describe('Vect#invert', function(){
	it('should invert values', function(){
		var v = new Vect(3,4);
		v.invert();
		assert.equal(v.x, -3);
		assert.equal(v.y, -4);	
	});	
});

describe('Vect#mul', function(){
	it('should multiply by scalar', function(){
		var v = new Vect(4,5);
		v.mul(3);
		assert.equal(v.x, 12);
		assert.equal(v.y, 15);
	});
});

describe('Vect#div', function(){
	it('should divide by scalar', function(){
		var v = new Vect(4,5);
		v.div(2);
		assert.equal(v.x, 2);
		assert.equal(v.y, 2.5);
	});
	
	it('should divide by 0 to Infinity', function(){
		var v = new Vect(4,5);
		v.div(0);
		assert.equal(v.x, Infinity);
		assert.equal(v.y, Infinity);
	});
});

describe('Vect#add', function(){
	it('should add parameterwise', function(){
		var v = new Vect(-3,4);
		var w = new Vect(2,6);
		v.add(w);
		assert.equal(v.x, -1);
		assert.equal(v.y, 10);
	});
});

describe('Vect#sub', function(){
	it('should sub parameterwise', function(){
		var v = new Vect(-3,4);
		var w = new Vect(2,6);
		v.sub(w);
		assert.equal(v.x, -5);
		assert.equal(v.y, -2);
	});
});

describe('Vect#dot', function(){
	it('should calc product of length for parrallels', function(){
		var v = new Vect(3,0);
		var w = new Vect(4,0);
		var dot = v.dot(w);
		assert.equal(dot,12);
	});
	
	it('should calc 0 for 90° vectors', function(){
		var v = new Vect(0,3);
		var w = new Vect(4,0);
		var dot = v.dot(w);
		assert.equal(dot,0);
	});
	
	it('should project on vector to another', function(){
		var v = new Vect(3,4); //length 5 
		var w = new Vect(7,0);
		var dot = v.dot(w);
		assert.equal(dot, 21);
	});
});



describe('Vect#isLeftOf/isRightOf', function(){
	var a = new Vect(1,0);
	var b = new Vect(1,1);
	var c = new Vect(1,2);
	var d = new Vect(0,1);
	var e = new Vect(-1,1);
	var f = new Vect(-2,1);
	var g = new Vect(-1,0);
	var h = new Vect(-1,-1);
	var i = new Vect(0,-1);
	var j = new Vect(2,-1);
	var all = [a,b,c,d,e,f,g,h,i,j];
	
	Garfunkel.setXisLeftOfY(true);
	
	it('should find the correct right values',
		function(){
			assert(b.isRightOf(a));
			assert(c.isRightOf(a));
			assert(d.isRightOf(a));
			assert(e.isRightOf(a));
			assert(f.isRightOf(a));
		}
	);
	
	it('should find the correct left values', 
		function(){
			assert(h.isLeftOf(a));
			assert(i.isLeftOf(a));
			assert(j.isLeftOf(a));
		}
	);
	
	it('should be "anti-reflexive" on true', 
		function(){
			var l = all.length;
			for(n = 0;n<l;n++){
				for(m = 0; m<l;m++){
					var v1 = all[n];
					var v2 = all[m];
					if(v1.isRightOf(v2)){
						assert(v2.isLeftOf(v1), "Althoug v1: "+v1 + " isRightOf v2:" + v2 + " v2.isLeftOf(v1) is false" );
					}
				}
			}
		}
	);

	it('should fail on paralles', 
		function(){
			assert(!g.isLeftOf(a));
			assert(!g.isRightOf(a));
			
			
		}
	);
	
	it('especcially on itself', function(){
		assert(!a.isLeftOf(a));
		assert(!a.isRightOf(a));
	});
});


describe('Vect#isLeftOf/isRightOf the other way around', function(){
	var a = new Vect(1,0);
	var b = new Vect(1,1);
	var c = new Vect(1,2);
	var d = new Vect(0,1);
	var e = new Vect(-1,1);
	var f = new Vect(-2,1);
	var g = new Vect(-1,0);
	var h = new Vect(-1,-1);
	var i = new Vect(0,-1);
	var j = new Vect(2,-1);
	var all = [a,b,c,d,e,f,g,h,i,j];
	
	before(function(){
		Garfunkel.setXisLeftOfY(false);
	});
	
	after(function(){
		Garfunkel.setXisLeftOfY(true);
	});
	
	it('should find the correct right values',
		function(){
			
			assert(b.isLeftOf(a));
			assert(c.isLeftOf(a));
			assert(d.isLeftOf(a));
			assert(e.isLeftOf(a));
			assert(f.isLeftOf(a));
			
		}
	);
	
	it('should find the correct left values', 
		function(){
			Garfunkel.setXisLeftOfY(false);
			assert(h.isRightOf(a));
			assert(i.isRightOf(a));
			assert(j.isRightOf(a));
		}
	);
	
	it('should be "anti-reflexive" on true', 
		function(){
			var l = all.length;
			for(n = 0;n<l;n++){
				for(m = 0; m<l;m++){
					var v1 = all[n];
					var v2 = all[m];
					if(v1.isLeftOf(v2)){
						assert(v2.isRightOf(v1), "Althoug v1: "+v1 + " isLeftOf v2:" + v2 + " v2.isRightOf(v1) is false" );
					}
				}
			}
		}
	);

	it('should fail on paralles', 
		function(){
			assert(!g.isLeftOf(a));
			assert(!g.isRightOf(a));
			
			
		}
	);
	
	it('especcially on itself', function(){
		assert(!a.isLeftOf(a));
		assert(!a.isRightOf(a));
	});
	
	
});


describe('Vector#turnLeft',function(){
	var u = new Vect(0,1);
	var v = new Vect(1,0);
	var w = new Vect(2,3);
	
	var u_l = u.clone().turnLeft();
	var v_l = v.clone().turnLeft();
	var w_l = w.clone().turnLeft();
	
	it('is left of',function(){
		assert(u_l.isLeftOf(u));
		assert(v_l.isLeftOf(v));
		assert(w_l.isLeftOf(w));
	});
	
	it('has same length', function(){
		assert.equal(u.length(),u_l.length());
		assert.equal(v.length(),v_l.length());
		assert.equal(w.length(),w_l.length());
	});
	
	it('is turned 90°', function(){
		assert.equal(0,u.dot(u_l));
		assert.equal(0,v.dot(v_l));
		assert.equal(0,w.dot(w_l));
	});
		
});


describe('Vector#turnRight',function(){
	var u = new Vect(0,1);
	var v = new Vect(1,0);
	var w = new Vect(2,3);
	
	var u_l = u.clone().turnRight();
	var v_l = v.clone().turnRight();
	var w_l = w.clone().turnRight();
	
	it('is right of',function(){
		assert(u_l.isRightOf(u));
		assert(v_l.isRightOf(v));
		assert(w_l.isRightOf(w));
	});
	
	it('has same length', function(){
		assert.equal(u.length(),u_l.length());
		assert.equal(v.length(),v_l.length());
		assert.equal(w.length(),w_l.length());
	});
	
	it('is turned 90°', function(){
		assert.equal(0,u.dot(u_l));
		assert.equal(0,v.dot(v_l));
		assert.equal(0,w.dot(w_l));
	});
		
});


describe('Vect#reflectOn', function(){
	

	
	it('should do boing', function(){
		var ref = new Vect(1,0);
		var u = new Vect(1,2);
		
		var u_r = u.clone().reflectOn(ref);
		
		assert.equal(  1, u_r.x);
		assert.equal( -2, u_r.y);
	});
	
	it('should do buff', function(){
		var ref = new Vect(0,1);
		var u = new Vect(1,-3);
		
		var u_r = u.clone().reflectOn(ref);
		
		assert.equal( -1, u_r.x);
		assert.equal( -3, u_r.y);
	});
	
	it('should do whiuuuuuuuu', function(){
		var EPSILON = 0.0001;
		var ref = new Vect(1,1);
		var u = new Vect(1,0);
		
		var u_r = u.clone().reflectOn(ref);
		
		assert( Math.abs(u_r.x) < EPSILON);
		assert(	Math.abs( u_r.y - 1) < EPSILON);
	});
	 
	 
	 it('should do hää', function(){
	 	var ref = new Vect(2,3);
		var u = new Vect(2,3);
		var u_r = u.clone().reflectOn(ref);
		assert.equal( -2, u_r.x);
		assert.equal( -3, u_r.y);
	});
	
});



describe('Segment#fromArray', function(){
	var segment = Segment.fromArray([3,3,0,0]);
	it('should keep values', function(){
		assert.equal(3,segment.p1.x);
		assert.equal(3,segment.p1.y);
		assert.equal(0,segment.p2.x); 
		assert.equal(0,segment.p2.y); 
	});
});


describe('Segment#intersect', function(){
	
	it('works', function(){
		var v = new Segment( new Vect(3,3), new Vect(4,3));
		assert.equal(0,v.toCenter().p1.x);
		assert.equal(0,v.toCenter().p1.y);
		assert.equal(1,v.toCenter().p2.x);
		assert.equal(0,v.toCenter().p2.y);
	});
	
	
	it('keeps length', function(){
		var v = new Segment( new Vect(3,3), new Vect(4,3));
		assert.equal(v.length(),v.toCenter().length());
	});

	
	
});


describe('Box#constructor', function(){
	var box;
	

	
	it('keep values ordered according to game coordinate system', function(){
		box = new Box(1,3,4,5);
		
		assert.equal(box.left, 1);
		assert.equal(box.right, 3);
		assert.equal(box.top, 4);
		assert.equal(box.bottom, 5);
	});
});

describe('Box#constructor', function(){
	var box;
	before(function(){
		Garfunkel.setSchoolCoords();
	});
	
	it('keep values ordered according to school coordinate system', function(){
		box = new Box(1,3,4,5);
		assert.equal(box.left, 1);
		assert.equal(box.right, 3);
		assert.equal(box.top, 5); //!
		assert.equal(box.bottom, 4); //!
	});
	
	after(function(){
		Garfunkel.setGameCoords();
	});
});


describe('Box#containsPoint', function(){
	var box , ins, outs;
	
	before(function(){
		box = new Box(0,3,0,3);
		ins =  [new Vect(0,0), new Vect(0,3), new Vect(3,3), new Vect(3,0)];
		outs = [new Vect(0,-1), new Vect(0,4), new Vect(1,4)];
	});

	it('should sort in', function(){
		var l = ins.length;
		while(l--){
			assert( box.containsPoint(ins[l]), ins[l]+' in ' + box);
			
		};
	});	

	it('and sort out', function(){
		var l = outs.length;
		while(l--){
			assert(!box.containsPoint(outs[l]), outs[l]+ ' out ' + box);
			
		}
	});
	

});


describe('Box#containsPoint ', function(){
	var box , ins, outs;
	describe('also for school coords it', function(){
		before(function(){
			Garfunkel.setSchoolCoords();
			box = new Box(0,3,0,3);
			ins =  [new Vect(0,0), new Vect(0,3), new Vect(3,3), new Vect(3,0)];
			outs = [new Vect(0,-1), new Vect(0,4), new Vect(1,4)];
		});

		it('should sort in', function(){
			var l = ins.length;
			while(l--){
				assert( box.containsPoint(ins[l]), ins[l]+' in ' + box);
				
			};
		});	
	
		it('and sort out', function(){
			var l = outs.length;
			while(l--){
				assert(!box.containsPoint(outs[l]), outs[l]+ ' out ' + box);
				
			}
		});
		
		after(function(){
			Garfunkel.setGameCoords();
		});
	});
});


describe('Box#intersect', function(){
	var box1,box2,box3,box4,box5;
	before(function(){
		
		Garfunkel.setSchoolCoords();
		
		box1 = new Box(3,5,3,5);
		box2 = new Box(4,6,4,6);
	 	box3 = new Box(0,4,0,4);
		box4 = new Box(5,6,5,6);
		box5 = new Box(10,12,10,13);
	});

	it('should work with intersected', function(){
		assert( box1.intersect(box3) ,  box1 + ' with ' +box3);
		assert( box2.intersect(box3) ,  box2 + ' with ' +box3);
		assert( box1.intersect(box2) ,  box1 + ' with ' +box2);
		}	
	);
	
	it('even only a corner', function(){
		assert( box1.intersect(box4) ,  box1 + ' out ' +box4);
	});
	
	it('should work with non intersected', function(){
		assert( !box2.intersect(box5) ,  box2 + ' out ' +box5);
		assert( !box3.intersect(box5) ,  box3 + ' out ' +box5);
		}	
	);
	
	after(function(){
			Garfunkel.setGameCoords();
	});
	
});


describe('Box#intersect', function(){
	
	var box1,box2,box3,box4,box5;
	
	describe('also for school coords', function(){
	
		before(function(){
			box1 = new Box(3,5,3,5);
			box2 = new Box(4,6,4,6);
		 	box3 = new Box(0,4,0,4);
			box4 = new Box(5,6,5,6);
			box5 = new Box(10,12,10,13);
		});
	
		it('should work with intersected', function(){
			assert( box1.intersect(box3) ,  box1 + ' with ' +box3);
			assert( box2.intersect(box3) ,  box2 + ' with ' +box3);
			assert( box1.intersect(box2) ,  box1 + ' with ' +box2);
			}	
		);
		
		it('even only a corner', function(){
			assert( box1.intersect(box4) ,  box1 + ' out ' +box4);
		});
		
		it('should work with non intersected', function(){
			assert( !box2.intersect(box5) ,  box2 + ' out ' +box5);
			assert( !box3.intersect(box5) ,  box3 + ' out ' +box5);
			}	
		);
	});

	
});






describe('Segment#intersect', function(){
	
	it('cross should intersect', function(){
		var seg1 = Segment.fromArray([3,3,0,0]);
		var seg2 = Segment.fromArray([3,0,0,3]);
		assert(seg1.intersect(seg2));
	});
	
	it('and also vice versa', function(){
		var seg1 = Segment.fromArray([3,3,0,0]);
		var seg2 = Segment.fromArray([3,0,0,3]);
		assert(seg2.intersect(seg1));
	});
	
	describe('parallel', function(){
		
		it('should not intersect', function(){
			var seg1 = Segment.fromArray([3,3,0,0]);
			var seg2 = Segment.fromArray([3,4,0,1]);
			assert(!seg1.intersect(seg2));
		});
		
		it('except they lay on each other', function(){
			var seg1 = Segment.fromArray([3,3,0,0]);
			var seg2 = Segment.fromArray([0,0,1,1]);
			assert(seg1.intersect(seg2));
		});
		
		it('or are even identical', function(){
			var seg1 = Segment.fromArray([3,3,0,0]);
			var seg2 = Segment.fromArray([0,0,1,1]);
			assert(seg1.intersect(seg2));
		});
	});
	
	
});
