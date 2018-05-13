if (typeof window === 'undefined') {
    //node
    //console.log(_mocha);

    assert = require("assert");
    sinon = require("sinon");
    expect = require("chai").expect;
    Garfunkel = require("../garfunkel");

} else {
    //browser
    expect = chai.expect;
    assert = chai.assert;
}

// Converts from degrees to radians.
Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function (radians) {
    return radians * 180 / Math.PI;
};

var SQRT_OF_2 = Math.sqrt(2);


Vect = Garfunkel.Vect;
Box = Garfunkel.Box;
Segment = Garfunkel.Segment;
Equation = Garfunkel.Equation;
Calculator = Garfunkel.Calculator;
Pool = Garfunkel.Pool;
Line = Garfunkel.Line;


describe('Pool#constructor', function () {
    it('should take initial size, constructor and initializer',
        function () {
            var pool = new Pool(1, Vect, function (x, y) {
                this.x = x;
                this.y = y;
            }); //Can the constructor be reused as init?
        }
    );

});


describe('Pool#get', function () {
    var constructorSpy = sinon.spy(Vect);
    var initializerSpy = sinon.spy(Vect);
    var pool;

    beforeEach(function () {
        pool = new Pool(4, constructorSpy, initializerSpy);
        constructorSpy.reset();
        initializerSpy.reset();
    });


    it('should take the given capacity and be full loaded at start', function () {
        expect(pool.capacity, "capacity").to.be.equal(4);
        expect(pool.current, "current").to.be.equal(4);
    });

    it('should keep have the given capacity and update the current load', function () {
        pool.get(3, 4);
        expect(pool.capacity, "capacity").to.be.equal(4);
        expect(pool.current, "current").to.be.equal(3);
    });

    it('should take object not created by the pool', function () {
        /*
         * This might be unusual, because the object was not created under the control of this pool.
         * So for example another constructor was used.
         * If the capacity is reached, desiposing a new object would increase the capacity.
         *
         * Not that the application also could juggle with more instances but keep a certain amount of them
         * undisposed at every moment. So the capacity of the pool would not increase, but every object could be
         * passed to the pool once in a while.
         *
         */
        pool.dispose(new Vect(7, 7));
        expect(pool.capacity, "capacity").to.be.equal(5);
        expect(pool.current, "current").to.be.equal(5);
    });


    it('capacity 0 is possible', function () {
        pool = new Pool(0, constructorSpy, initializerSpy);
        expect(pool.capacity, "capacity").to.be.equal(0);
        expect(pool.current, "current").to.be.equal(0);
    });

    it('dispose can be used to initialize a capacity zero pool', function () {
        pool = new Pool(0, constructorSpy, initializerSpy);
        pool.dispose(new Vect(3, 1));
        pool.dispose(new Vect(4, 1));
        pool.dispose(new Vect(5, 9));
        pool.dispose(new Vect(2, 6));
        expect(pool.capacity, "capacity").to.be.equal(4);
        expect(pool.current, "current").to.be.equal(4);
    });

    it('get can also be used to initialize a capacity zero pool', function () {
        pool = new Pool(0, constructorSpy, initializerSpy);
        pool.get(3, 1);
        pool.get(4, 1);
        pool.get(5, 9);
        pool.get(2, 6);
        expect(pool.capacity, "capacity").to.be.least(4);
        expect(pool.current, "current").to.be.equal(0);
    });


    it('should give instance created by constructor function', function () {
        assert(pool.get(3, 4) instanceof Vect);
    });

    it('should use initialize function', function () {
        pool.get();
        assert(initializerSpy.called);
    });

    it('should work with parameters', function () {
        var v = pool.get(2, 9);
        assert.equal(v.x, 2);
        assert.equal(v.y, 9);
    });

});


describe('Calculator#reflectOn', function () {

    var _ = Calculator.create();

    it('should do boing', function () {
        var ref = new Vect(1, 0);
        var u = new Vect(1, 2);

        var u_r = _.reflectOn(u, ref);

        assert.equal(1, u_r.x);
        assert.equal(-2, u_r.y);
    });

    it('should do buff', function () {
        var ref = new Vect(0, 1);
        var u = new Vect(1, -3);

        var u_r = _.reflectOn(u, ref);

        assert.equal(-1, u_r.x);
        assert.equal(-3, u_r.y);
    });

    it('should do whiuuuuuuuu', function () {
        var EPSILON = 0.0001;
        var ref = new Vect(1, 1);
        var u = new Vect(1, 0);

        var u_r = _.reflectOn(u, ref);

        assert(Math.abs(u_r.x) < EPSILON);
        assert(Math.abs(u_r.y - 1) < EPSILON);
    });


    it('should do hää', function () {
        var ref = new Vect(2, 3);
        var u = new Vect(2, 3);

        var u_r = _.reflectOn(u, ref);
        assert.equal(-2, u_r.x);
        assert.equal(-3, u_r.y);
    });

});


describe('Vect#constructor', function () {
    it('should keep values', function () {
        var v = new Vect(0, 0);
        assert.equal(0, v.x);
        assert.equal(0, v.y);
    });
    it('should have defaults', function () {
        var v = new Vect();
        assert.equal(0, v.x);
        assert.equal(0, v.y);
    });
});

describe('Vect#invert', function () {
    it('should invert values', function () {
        var v = new Vect(3, 4);
        v.invert();
        assert.equal(v.x, -3);
        assert.equal(v.y, -4);
    });
});

describe('Vect#mul', function () {
    it('should multiply by scalar', function () {
        var v = new Vect(4, 5);
        v.mul(3);
        assert.equal(v.x, 12);
        assert.equal(v.y, 15);
    });
});

describe('Vect#div', function () {
    it('should divide by scalar', function () {
        var v = new Vect(4, 5);
        v.div(2);
        assert.equal(v.x, 2);
        assert.equal(v.y, 2.5);
    });

    it('should divide by 0 to Infinity', function () {
        var v = new Vect(4, 5);
        v.div(0);
        assert.equal(v.x, Infinity);
        assert.equal(v.y, Infinity);
    });
});

describe('Vect#add', function () {
    it('should add parameterwise', function () {
        var v = new Vect(-3, 4);
        var w = new Vect(2, 6);
        v.add(w);
        assert.equal(v.x, -1);
        assert.equal(v.y, 10);
    });
});

describe('Vect#sub', function () {
    it('should sub parameterwise', function () {
        var v = new Vect(-3, 4);
        var w = new Vect(2, 6);
        v.sub(w);
        assert.equal(v.x, -5);
        assert.equal(v.y, -2);
    });
});

describe('Vect#dot', function () {
    it('should calc product of length for parrallels', function () {
        var v = new Vect(3, 0);
        var w = new Vect(4, 0);
        var dot = v.dot(w);
        assert.equal(dot, 12);
    });

    it('should calc 0 for 90° vectors', function () {
        var v = new Vect(0, 3);
        var w = new Vect(4, 0);
        var dot = v.dot(w);
        assert.equal(dot, 0);
    });

    it('should project on vector to another', function () {
        var v = new Vect(3, 4); //length 5
        var w = new Vect(7, 0);
        var dot = v.dot(w);
        assert.equal(dot, 21);
    });
});

describe('Vect#normalize', function () {
    var EPSILON = 0.0001;

    it('should normalize normal vector', function () {
        var v = new Vect(3, 0);
        var v_0 = v.normalize();
        assert.equal(v_0.x, 1);
        assert.equal(v_0.y, 0);
    });

    it('should normalize negative normal vector', function () {
        var v = new Vect(0, -2);
        var v_0 = v.normalize();
        assert.equal(v_0.x, 0);
        assert.equal(v_0.y, -1);
    });

    it('should give default for zero vector', function () {
        var v = new Vect(0, 0);
        var v_0 = v.normalize();
        assert.equal(v_0.x, 1);
        assert.equal(v_0.y, 0);
    });

    it('should scale normalized vector', function () {
        var v = new Vect(3, 3);
        var v_0 = v.normalize(42);
        assert(Math.abs(v_0.x - 42/SQRT_OF_2) < EPSILON);
        assert(Math.abs(v_0.y - 42/SQRT_OF_2) < EPSILON);
        assert(Math.abs(v_0.length()- 42)<EPSILON);
    });

});


describe('Vect#distance', function () {
    it('should give euclidian distance', function () {
        var v = new Vect(3, 0);
        var w = new Vect(0, 4);
        var dist = v.distance(w);
        assert.equal(dist, 5);
    });

    it('should give euclidian distance, even for negative values', function () {
        var v = new Vect(3, 0);
        var w = new Vect(0, -4);
        var dist = v.distance(w);
        assert.equal(dist, 5);
    });

});

describe('Vect#distanceSq', function () {
    it('should give quadratic distance', function () {
        var v = new Vect(3, 0);
        var w = new Vect(0, 4);
        var dist = v.distanceSq(w);
        assert.equal(dist, 25);
    });

    it('should give quadratic distance, even for negative values', function () {
        var v = new Vect(3, 0);
        var w = new Vect(0, -4);
        var dist = v.distanceSq(w);
        assert.equal(dist, 25);
    });

    it('should be symmetric', function () {
        var v = new Vect(3, 0);
        var w = new Vect(0, -4);
        assert.equal(v.distanceSq(w), w.distanceSq(v));
    });
});

describe('Vect#manhatten', function () {
    it('should give manhatten distance', function () {
        var v = new Vect(3, 0);
        var w = new Vect(0, 4);
        var dist = v.manhatten(w);
        assert.equal(dist, 7);
    });

    it('should give manhatten distance, , even for negative values', function () {
        var v = new Vect(3, 0);
        var w = new Vect(0, -4);
        var dist = v.manhatten(w);
        assert.equal(dist, 7);
    });
});

describe('Vect#angle', function () {
    var EPSILON = 0.0001;

    it('should give a 0° angle', function () {
        var v = new Vect(1, 0);
        var angle = v.angle();
        assert(angle < EPSILON, Math.degrees(angle) + "°");
    });

    it('should give a 90° angle', function () {
        var v = new Vect(0, 1);
        var angle = v.angle();
        assert(Math.abs(angle - Math.PI / 2) < EPSILON, Math.degrees(angle) + "°");
    });

    it('should give a 180° angle', function () {
        var v = new Vect(-1, 0);
        var angle = v.angle();
        assert(Math.abs(angle - Math.PI) < EPSILON, Math.degrees(angle) + "°");
    });

    it('should give a -90° angle', function () {
        var v = new Vect(0, -1);
        var angle = v.angle();
        console.log(angle, angle / Math.PI * 180);
        assert(Math.abs(angle + Math.PI / 2) < EPSILON, Math.degrees(angle) + "°");
    });


    it('should give a 90° angle between (-1,0) and a reference of (0,1)', function () {
        var ref = new Vect(0, 1);
        var w = new Vect(-1, 0);
        var angle = w.angle(ref);
        assert(Math.abs(angle - Math.PI / 2) < EPSILON, Math.degrees(angle) + "°");
    });

    it('should give a 90° angle between (-1,1) and a reference of (1,1)', function () {
        var ref = new Vect(1, 1);
        var w = new Vect(-1, 1);
        var angle = w.angle(ref);
        assert(Math.abs(angle - Math.PI / 2) < EPSILON, Math.degrees(angle) + "°");
    });

    it('should give a 90° angle between (-1,-1) and a reference of (-1,1)', function () {
        var ref = new Vect(-1, 1);
        var w = new Vect(-1, -1);
        var angle = w.angle(ref);
        assert(Math.abs(angle - Math.PI / 2) < EPSILON, Math.degrees(angle) + "°");
    });

    it('should give a -90° angle between (-1,1) and a reference of (-1,-1)', function () {
        var ref = new Vect(-1, -1);
        var w = new Vect(-1, 1);
        var angle = w.angle(ref);
        assert(Math.abs(angle + Math.PI / 2) < EPSILON, Math.degrees(angle) + "°");
    });

    it('should give a 90° angle between (1,-1)  and a reference of (-1,-1)', function () {
        var ref = new Vect(-1, -1);
        var w = new Vect(1, -1);
        var angle = w.angle(ref);
        assert(Math.abs(angle - Math.PI / 2) < EPSILON, Math.degrees(angle) + "°");
    });

    it('should give a 180° angle between (1,1)  and a reference of (-1,-1)', function () {
        var ref = new Vect(-1, -1);
        var w = new Vect(1, 1);
        var angle = w.angle(ref);
        assert(Math.abs(angle - Math.PI) < EPSILON, Math.degrees(angle) + "°");
    });

});

describe('Vect#rotate', function () {
    var EPSILON = 0.0001;
    it('should rotate 180°', function () {
        var v = new Vect(1, 0);
        v.rotate(Math.PI);

        assert(Math.abs(v.x + 1) < EPSILON);
        assert(Math.abs(v.y) < EPSILON);
    });

    it('should preserve length', function () {
        var v = new Vect(3, 7);
        var before = v.length();
        v.rotate(Math.PI / 7);
        var after = v.length();
        assert(Math.abs(before - after) < EPSILON);
    });

});


describe('Vect#rotate with pivot', function () {
    var EPSILON = 0.0001;
    it('should rotate 90°', function () {
        var v = new Vect(3, 2);
        var pivot = new Vect(2, 1);

        v.rotate(Math.PI / 2, pivot);

        assert(Math.abs(v.x - 1) < EPSILON);
        assert(Math.abs(v.y - 2) < EPSILON);
    });
});


describe('Vect#rotateTo', function () {
    var EPSILON = 0.0001;
    it('should preserve length', function () {
        var v = new Vect(3, 7);
        var before = v.length();
        v.rotateTo(Math.PI / 7);
        var after = v.length();
        assert(Math.abs(before - after) < EPSILON);
    });

    /*
     it('should set angle from (1,0)', function () {
     var v = new Vect(3, 7);
     var w = new Vect(0, 1);
     v.rotateTo(Math.PI / 7);
     var angle = v.angle(w);
     assert(Math.abs(angle - Math.PI / 7) < EPSILON);
     });
     */


});


describe('Vect#isLeftOf/isRightOf', function () {
    var a = new Vect(1, 0);
    var b = new Vect(1, 1);
    var c = new Vect(1, 2);
    var d = new Vect(0, 1);
    var e = new Vect(-1, 1);
    var f = new Vect(-2, 1);
    var g = new Vect(-1, 0);
    var h = new Vect(-1, -1);
    var i = new Vect(0, -1);
    var j = new Vect(2, -1);
    var all = [a, b, c, d, e, f, g, h, i, j];

    Garfunkel.setXisLeftOfY(true);

    it('should find the correct right values',
        function () {
            assert(b.isRightOf(a));
            assert(c.isRightOf(a));
            assert(d.isRightOf(a));
            assert(e.isRightOf(a));
            assert(f.isRightOf(a));
        }
    );

    it('should find the correct left values',
        function () {
            assert(h.isLeftOf(a));
            assert(i.isLeftOf(a));
            assert(j.isLeftOf(a));
        }
    );

    it('should be "anti-reflexive" on true',
        function () {
            var l = all.length;
            for (n = 0; n < l; n++) {
                for (m = 0; m < l; m++) {
                    var v1 = all[n];
                    var v2 = all[m];
                    if (v1.isRightOf(v2)) {
                        assert(v2.isLeftOf(v1), "Althoug v1: " + v1 + " isRightOf v2:" + v2 + " v2.isLeftOf(v1) is false");
                    }
                }
            }
        }
    );

    it('should fail on paralles',
        function () {
            assert(!g.isLeftOf(a));
            assert(!g.isRightOf(a));


        }
    );

    it('especcially on itself', function () {
        assert(!a.isLeftOf(a));
        assert(!a.isRightOf(a));
    });
});


describe('Vect#isLeftOf/isRightOf the other way around', function () {
    var a = new Vect(1, 0);
    var b = new Vect(1, 1);
    var c = new Vect(1, 2);
    var d = new Vect(0, 1);
    var e = new Vect(-1, 1);
    var f = new Vect(-2, 1);
    var g = new Vect(-1, 0);
    var h = new Vect(-1, -1);
    var i = new Vect(0, -1);
    var j = new Vect(2, -1);
    var all = [a, b, c, d, e, f, g, h, i, j];

    before(function () {
        Garfunkel.setXisLeftOfY(false);
    });

    after(function () {
        Garfunkel.setXisLeftOfY(true);
    });

    it('should find the correct right values',
        function () {

            assert(b.isLeftOf(a));
            assert(c.isLeftOf(a));
            assert(d.isLeftOf(a));
            assert(e.isLeftOf(a));
            assert(f.isLeftOf(a));

        }
    );

    it('should find the correct left values',
        function () {
            Garfunkel.setXisLeftOfY(false);
            assert(h.isRightOf(a));
            assert(i.isRightOf(a));
            assert(j.isRightOf(a));
        }
    );

    it('should be "anti-reflexive" on true',
        function () {
            var l = all.length;
            for (n = 0; n < l; n++) {
                for (m = 0; m < l; m++) {
                    var v1 = all[n];
                    var v2 = all[m];
                    if (v1.isLeftOf(v2)) {
                        assert(v2.isRightOf(v1), "Althoug v1: " + v1 + " isLeftOf v2:" + v2 + " v2.isRightOf(v1) is false");
                    }
                }
            }
        }
    );

    it('should fail on paralles',
        function () {
            assert(!g.isLeftOf(a));
            assert(!g.isRightOf(a));


        }
    );

    it('especcially on itself', function () {
        assert(!a.isLeftOf(a));
        assert(!a.isRightOf(a));
    });


});


describe('Vector#turnLeft', function () {
    var u = new Vect(0, 1);
    var v = new Vect(1, 0);
    var w = new Vect(2, 3);

    var u_l = u.clone().turnLeft();
    var v_l = v.clone().turnLeft();
    var w_l = w.clone().turnLeft();

    it('is left of', function () {
        assert(u_l.isLeftOf(u));
        assert(v_l.isLeftOf(v));
        assert(w_l.isLeftOf(w));
    });

    it('has same length', function () {
        assert.equal(u.length(), u_l.length());
        assert.equal(v.length(), v_l.length());
        assert.equal(w.length(), w_l.length());
    });

    it('is turned 90°', function () {
        assert.equal(0, u.dot(u_l));
        assert.equal(0, v.dot(v_l));
        assert.equal(0, w.dot(w_l));
    });

});


describe('Vector#turnRight', function () {
    var u = new Vect(0, 1);
    var v = new Vect(1, 0);
    var w = new Vect(2, 3);

    var u_l = u.clone().turnRight();
    var v_l = v.clone().turnRight();
    var w_l = w.clone().turnRight();

    it('is right of', function () {
        assert(u_l.isRightOf(u));
        assert(v_l.isRightOf(v));
        assert(w_l.isRightOf(w));
    });

    it('has same length', function () {
        assert.equal(u.length(), u_l.length());
        assert.equal(v.length(), v_l.length());
        assert.equal(w.length(), w_l.length());
    });

    it('is turned 90°', function () {
        assert.equal(0, u.dot(u_l));
        assert.equal(0, v.dot(v_l));
        assert.equal(0, w.dot(w_l));
    });

});


describe('Vect#reflectOn', function () {

    it('should do boing', function () {
        var ref = new Vect(1, 0);
        var u = new Vect(1, 2);

        var u_r = u.clone().reflectOn(ref);

        assert.equal(1, u_r.x);
        assert.equal(-2, u_r.y);
    });

    it('should do buff', function () {
        var ref = new Vect(0, 1);
        var u = new Vect(1, -3);

        var u_r = u.clone().reflectOn(ref);

        assert.equal(-1, u_r.x);
        assert.equal(-3, u_r.y);
    });

    it('should do whiuuuuuuuu', function () {
        var EPSILON = 0.0001;
        var ref = new Vect(1, 1);
        var u = new Vect(1, 0);

        var u_r = u.clone().reflectOn(ref);

        assert(Math.abs(u_r.x) < EPSILON);
        assert(Math.abs(u_r.y - 1) < EPSILON);
    });


    it('should do hää', function () {
        var ref = new Vect(2, 3);
        var u = new Vect(2, 3);
        var u_r = u.clone().reflectOn(ref);
        assert.equal(-2, u_r.x);
        assert.equal(-3, u_r.y);
    });

});

describe('Segment constructor', function () {

    it('should not reuse points internally', function () {
        var u = new Vect(2, 3);
        var v = new Vect(4, 7);
        var s = new Segment(u, v);

        s.rotate(Math.PI / 3);

        assert.equal(u.x, 2);
        assert.equal(u.y, 3);
        assert.equal(v.x, 4);
        assert.equal(v.y, 7);
    });

});


describe('Segment#fromArray', function () {
    var segment = Segment.fromArray([3, 3, 0, 0]);
    it('should keep values', function () {
        assert.equal(3, segment.p1.x);
        assert.equal(3, segment.p1.y);
        assert.equal(0, segment.p2.x);
        assert.equal(0, segment.p2.y);
    });


    it('should have a connection vector', function () {
        var connection = segment.connection();
        assert.equal(-3, connection.x);
        assert.equal(-3, connection.y);
    });

    it('should give a bounding box', function () {
        var box = segment.getBoundingBox();
        assert.equal(3, box.right);
        assert.equal(3, box.bottom);
    });

});


describe('Segment#toCenter', function () {

    it('works', function () {
        var v = new Segment(new Vect(3, 3), new Vect(4, 3));
        var w = v.toCenter();
        assert.equal(0, w.p1.x);
        assert.equal(0, w.p1.y);
        assert.equal(1, w.p2.x);
        assert.equal(0, w.p2.y);
    });

});


describe('Segment#translate', function () {

    it('keeps length', function () {
        var segment = new Segment(new Vect(3, 3), new Vect(4, 3));
        var v = new Vect(4, 5);
        assert.equal(segment.length(), segment.translate(v).length());
    });

    it('keeps the connection', function () {
        var segment = new Segment(new Vect(3, 3), new Vect(4, 3));
        var v = new Vect(4, 5);
        var c_1 = segment.connection();
        segment.translate(v);
        var c_2 = segment.connection();
        assert.equal(c_1.x, c_2.x);
        assert.equal(c_1.y, c_2.y);
    });

    it('updates the bounding box', function () {
        var segment = new Segment(new Vect(3, 3), new Vect(4, 3));
        var v = new Vect(4, 5);
        var b_1 = segment.getBoundingBox();
        segment.translate(v);
        var b_2 = segment.getBoundingBox();
        assert.equal(b_1.left + 4, b_2.left);
        assert.equal(b_1.right + 4, b_2.right);
        assert.equal(b_1.top + 5, b_2.top);
        assert.equal(b_1.bottom + 5, b_2.bottom);
    });

});

describe('Segment#toCenter', function () {

    it('moves the segment to the center', function () {
        var v = new Segment(new Vect(3, 3), new Vect(4, 3));
        v.toCenter();
        assert.equal(v.p1.x, 0);
        assert.equal(v.p1.y, 0);
        assert.equal(v.p2.x, 1);
        assert.equal(v.p2.y, 0);
    });

    it('keeps length', function () {
        var v = new Segment(new Vect(3, 3), new Vect(4, 3));
        assert.equal(v.length(), v.toCenter().length());
    });

});


describe('Segment#getMiddle', function () {

    it('should get the middle', function () {
        var s = new Segment(new Vect(2, 3), new Vect(4, 5));
        var m = s.getMiddle();
        assert.equal(m.x, 3);
        assert.equal(m.y, 4);
    });


});

describe('Segment#getPoint', function () {

    it('should find the right point between p1 and p2', function () {
        var s = new Segment(new Vect(3, 3), new Vect(7, 3));
        var p = s.getPoint(1 / 4);
        assert.equal(p.x, 4);
        assert.equal(p.y, 3);
    });

    it('should find p1 ', function () {
        var s = new Segment(new Vect(3, 9), new Vect(7, 3));
        var p = s.getPoint(0);
        assert.equal(p.x, 3);
        assert.equal(p.y, 9);
    });

    it('should find p2', function () {
        var s = new Segment(new Vect(3, 9), new Vect(7, 3));
        var p = s.getPoint(1);
        assert.equal(p.x, 7);
        assert.equal(p.y, 3);
    });

    it('should go beyond p2', function () {
        var s = new Segment(new Vect(3, 3), new Vect(7, 7));
        var p = s.getPoint(2);
        assert.equal(p.x, 11);
        assert.equal(p.y, 11);
    });

});


describe('Box#constructor', function () {
    var box;


    it('keep values ordered according to game coordinate system', function () {
        box = new Box(1, 3, 4, 5);

        assert.equal(box.left, 1);
        assert.equal(box.right, 3);
        assert.equal(box.top, 4);
        assert.equal(box.bottom, 5);
    });
});

describe('Box#constructor', function () {
    var box;
    before(function () {
        Garfunkel.setSchoolCoords();
    });

    it('keep values ordered according to school coordinate system', function () {
        box = new Box(1, 3, 4, 5);
        assert.equal(box.left, 1);
        assert.equal(box.right, 3);
        assert.equal(box.top, 5); //!
        assert.equal(box.bottom, 4); //!
    });

    after(function () {
        Garfunkel.setGameCoords();
    });
});


describe('Box#containsPoint', function () {
    var box, ins, outs;

    before(function () {
        box = new Box(0, 3, 0, 3);
        ins = [new Vect(0, 0), new Vect(0, 3), new Vect(3, 3), new Vect(3, 0)];
        outs = [new Vect(0, -1), new Vect(0, 4), new Vect(1, 4)];
    });

    it('should sort in', function () {
        var l = ins.length;
        while (l--) {
            assert(box.containsPoint(ins[l]), ins[l] + ' in ' + box);

        }
        ;
    });

    it('and sort out', function () {
        var l = outs.length;
        while (l--) {
            assert(!box.containsPoint(outs[l]), outs[l] + ' out ' + box);

        }
    });


});


describe('Box#containsPoint ', function () {
    var box, ins, outs;
    describe('also for school coords it', function () {
        before(function () {
            Garfunkel.setSchoolCoords();
            box = new Box(0, 3, 0, 3);
            ins = [new Vect(0, 0), new Vect(0, 3), new Vect(3, 3), new Vect(3, 0)];
            outs = [new Vect(0, -1), new Vect(0, 4), new Vect(1, 4)];
        });

        it('should sort in', function () {
            var l = ins.length;
            while (l--) {
                assert(box.containsPoint(ins[l]), ins[l] + ' in ' + box);

            }
            ;
        });

        it('and sort out', function () {
            var l = outs.length;
            while (l--) {
                assert(!box.containsPoint(outs[l]), outs[l] + ' out ' + box);

            }
        });

        after(function () {
            Garfunkel.setGameCoords();
        });
    });
});


describe('Box#intersect', function () {
    var box1, box2, box3, box4, box5;
    before(function () {

        Garfunkel.setSchoolCoords();

        box1 = new Box(3, 5, 3, 5);
        box2 = new Box(4, 6, 4, 6);
        box3 = new Box(0, 4, 0, 4);
        box4 = new Box(5, 6, 5, 6);
        box5 = new Box(10, 12, 10, 13);
    });

    it('should work with intersected', function () {
            assert(box1.intersect(box3), box1 + ' with ' + box3);
            assert(box2.intersect(box3), box2 + ' with ' + box3);
            assert(box1.intersect(box2), box1 + ' with ' + box2);
        }
    );

    it('even only a corner', function () {
        assert(box1.intersect(box4), box1 + ' out ' + box4);
    });

    it('should work with non intersected', function () {
            assert(!box2.intersect(box5), box2 + ' out ' + box5);
            assert(!box3.intersect(box5), box3 + ' out ' + box5);
        }
    );

    after(function () {
        Garfunkel.setGameCoords();
    });

});


describe('Box#intersect', function () {

    var box1, box2, box3, box4, box5;

    describe('also for school coords', function () {

        before(function () {
            box1 = new Box(3, 5, 3, 5);
            box2 = new Box(4, 6, 4, 6);
            box3 = new Box(0, 4, 0, 4);
            box4 = new Box(5, 6, 5, 6);
            box5 = new Box(10, 12, 10, 13);
        });

        it('should work with intersected', function () {
                assert(box1.intersect(box3), box1 + ' with ' + box3);
                assert(box2.intersect(box3), box2 + ' with ' + box3);
                assert(box1.intersect(box2), box1 + ' with ' + box2);
            }
        );

        it('even only a corner', function () {
            assert(box1.intersect(box4), box1 + ' out ' + box4);
        });

        it('should work with non intersected', function () {
                assert(!box2.intersect(box5), box2 + ' out ' + box5);
                assert(!box3.intersect(box5), box3 + ' out ' + box5);
            }
        );
    });
});

describe('Segment#intersect', function () {

    it('cross should intersect', function () {
        var seg1 = Segment.fromArray([3, 3, 0, 0]);
        var seg2 = Segment.fromArray([3, 0, 0, 3]);
        assert(seg1.intersect(seg2));
    });

    it('and also vice versa', function () {
        var seg1 = Segment.fromArray([3, 3, 0, 0]);
        var seg2 = Segment.fromArray([3, 0, 0, 3]);
        assert(seg2.intersect(seg1));
    });

    describe('touch', function () {
        it('is also intersect ', function(){
            var seg1 = Segment.fromArray([0, 0, 2, 2]);
            var seg2 = Segment.fromArray([1, 1, 1, 3]);
            assert(seg2.intersect(seg1));
        });

        it('even if the tips touches', function(){
            var seg1 = Segment.fromArray([0, 0, 1, 1]);
            var seg2 = Segment.fromArray([1, 1, 1, 3]);
            assert(seg2.intersect(seg1));
        });
    });

    describe('parallel', function () {

        it('should not intersect', function () {
            var seg1 = Segment.fromArray([3, 3, 0, 0]);
            var seg2 = Segment.fromArray([3, 4, 0, 1]);
            assert(!seg1.intersect(seg2));
        });

        it('except they lay on each other', function () {
            var seg1 = Segment.fromArray([3, 3, 0, 0]);
            var seg2 = Segment.fromArray([2, 2, 1, 1]);
            assert(seg1.intersect(seg2));
        });

        it('or are even identical', function () {
            var seg1 = Segment.fromArray([3, 3, 0, 0]);
            var seg2 = Segment.fromArray([3, 3, 0, 0]);
            assert(seg1.intersect(seg2));
        });

        it('or just touch', function () {
            var seg1 = Segment.fromArray([1, 2, 1, 3]);
            var seg2 = Segment.fromArray([1, 3, 1, 4]);
            assert(seg1.intersect(seg2));
        });
    });

});


describe('Line#direction', function () {
    var EPSILON = 0.0001;

    it('should get a normalized direction', function () {
        var line = Line.fromArray([2, 3, 4, 5]);
        var d = line.direction();

        var angle = d.angle();
        var len = d.length()
        assert(Math.abs(angle - Math.PI / 4) < EPSILON
            || Math.abs(angle + 3 / 4 * Math.PI) < EPSILON);
        assert(Math.abs(len - 1) < EPSILON);
    });

});


describe('Line#intersect', function () {

    it('should find paralles', function () {
        var a = Line.fromArray([2, 2, 4, 4]);
        var b = Line.fromArray([0, 1, 7, 8]);
        assert.equal(Line.PARALLEL, a.intersect(b));
    });

    it('should find equals', function () {
        var a = Line.fromArray([1, 2, 400, 401]);
        var b = Line.fromArray([0, 1, 7, 8]);
        assert.equal(Line.EQUAL, a.intersect(b));
    });

    it('should find the intersection', function () {
        var a = Line.fromArray([1, 1, -1, -1]);
        var b = Line.fromArray([1, -1, -1, 1]);
        var p = a.intersect(b);
        assert.equal(p.x, 0);
        assert.equal(p.y, 0);
    });

    it('should find the intersection', function () {
        var a = Line.fromArray([2, 3, 5, 6]);
        var b = Line.fromArray([2, 6, 5, 3]);
        var p = a.intersect(b);
        assert.equal(p.x, 3.5);
        assert.equal(p.y, 4.5);
    });

});


