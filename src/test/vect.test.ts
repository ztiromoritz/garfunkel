import { describe, it, assert, beforeAll, afterAll } from 'vitest'
import { Coord } from '../coord';
import { ABSCISSA, ORDINATE, Vect, ZERO } from '../vect';
import { isLeftOf } from '../vect-functions';



// Converts from degrees to radians.
function radians(degrees:number) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
function degrees(radians:number) {
    return radians * 180 / Math.PI;
};

const SQRT_OF_2 = Math.sqrt(2);

describe("Vect", function () {


    describe('#constructor', function () {
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

    describe('#invert', function () {
        it('should invert values', function () {
            var v = new Vect(3, 4);
            v.invert();
            assert.equal(v.x, -3);
            assert.equal(v.y, -4);
        });
    });

    describe("#length", function(){
        it("should measure correct", function(){
            const v = new Vect(3, 4);
        
            assert.equal(ABSCISSA.length(), 1);
            assert.equal(ORDINATE.length(), 1);
            assert.equal(ZERO.length(), 0);
            assert.equal(v.length(), 5);
        })
   
    })

    describe('#mul', function () {
        it('should multiply by scalar', function () {
            var v = new Vect(4, 5);
            v.mul(3);
            assert.equal(v.x, 12);
            assert.equal(v.y, 15);
        });
    });

    describe('#div', function () {
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

    describe('#add', function () {
        it('should add parameterwise', function () {
            var v = new Vect(-3, 4);
            var w = new Vect(2, 6);
            v.add(w);
            assert.equal(v.x, -1);
            assert.equal(v.y, 10);
        });
    });

    describe('#sub', function () {
        it('should sub parameterwise', function () {
            var v = new Vect(-3, 4);
            var w = new Vect(2, 6);
            v.sub(w);
            assert.equal(v.x, -5);
            assert.equal(v.y, -2);
        });
    });


    describe('#mirrorOnX, #mirrorOnY', function () {
        it('inverts the corresponding value', function () {
            const u = new Vect(3, 7);
            const v = new Vect(11, 9);

            u.mirrorOnX();
            v.mirrorOnY();

            assert.equal(u.y, -7);
            assert.equal(v.x, -11);

        });

        it('keeps the correct value', function () {
            const u = new Vect(3, 7);
            const v = new Vect(11, 9);

            u.mirrorOnX();
            v.mirrorOnY();

            assert.equal(u.x, 3);
            assert.equal(v.y, 9);
        });
    });

    describe('#xComponent, #yComponent', function () {

        it('both should add up the to the original vect', function () {
            const u = new Vect(7, 5);
            const u_x = u.clone().xComponent();
            const u_y = u.clone().yComponent();


            const v = u_x.add(u_y);

            assert.equal(v.x, u.x);
            assert.equal(v.y, u.y);
        });

        it('self value is equal, corespondent value is zero', function () {
            const u = new Vect(7, 5);
            const u_x = u.clone().xComponent();
            const u_y = u.clone().yComponent();

            assert.equal(u_x.x, u.x);
            assert.equal(u_x.y, 0);
            assert.equal(u_y.x, 0);
            assert.equal(u_y.y, u.y);
        });


    });

    describe('#trapeze', function () {

        const u = new Vect(0, 1);
        const v = new Vect(1, 2);

        it('gives a trapeze-ish area', function () {
            assert.equal(u.trapeze(v), 3);

        });

        it('turns the sign if turned around', function () {
            assert.equal(v.trapeze(u), -3);
        });
    });


    describe('#dot', function () {
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

    describe('#normalize', function () {
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
            assert.isTrue(Math.abs(v_0.x - 42 / SQRT_OF_2) < EPSILON);
            assert.isTrue(Math.abs(v_0.y - 42 / SQRT_OF_2) < EPSILON);
            
            assert.isTrue(Math.abs(v_0.length() - 42) < EPSILON, ""+ v_0.length());
        });

    });


    describe('#distance', function () {
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

    describe('#distanceSq', function () {
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

    describe('#manhatten', function () {
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

    describe('#angle', function () {
        var EPSILON = 0.0001;

        it('should give a 0° angle', function () {
            var v = new Vect(1, 0);
            var angle = v.angle();
            assert.isTrue(angle < EPSILON, degrees(angle) + "°");
        });

        it('should give a 90° angle', function () {
            var v = new Vect(0, 1);
            var angle = v.angle();
            assert.isTrue(Math.abs(angle - Math.PI / 2) < EPSILON, degrees(angle) + "°");
        });

        it('should give a 180° angle', function () {
            var v = new Vect(-1, 0);
            var angle = v.angle();
            assert.isTrue(Math.abs(angle - Math.PI) < EPSILON, degrees(angle) + "°");
        });

        it('should give a -90° angle', function () {
            var v = new Vect(0, -1);
            var angle = v.angle();
            assert.isTrue(Math.abs(angle + Math.PI / 2) < EPSILON, degrees(angle) + "°");
        });


        it('should give a 90° angle between (-1,0) and a reference of (0,1)', function () {
            var ref = new Vect(0, 1);
            var w = new Vect(-1, 0);
            var angle = w.angle(ref);
            assert.isTrue(Math.abs(angle - Math.PI / 2) < EPSILON, degrees(angle) + "°");
        });

        it('should give a 90° angle between (-1,1) and a reference of (1,1)', function () {
            var ref = new Vect(1, 1);
            var w = new Vect(-1, 1);
            var angle = w.angle(ref);
            assert.isTrue(Math.abs(angle - Math.PI / 2) < EPSILON, degrees(angle) + "°");
        });

        it('should give a 90° angle between (-1,-1) and a reference of (-1,1)', function () {
            var ref = new Vect(-1, 1);
            var w = new Vect(-1, -1);
            var angle = w.angle(ref);
            assert.isTrue(Math.abs(angle - Math.PI / 2) < EPSILON, degrees(angle) + "°");
        });

        it('should give a -90° angle between (-1,1) and a reference of (-1,-1)', function () {
            var ref = new Vect(-1, -1);
            var w = new Vect(-1, 1);
            var angle = w.angle(ref);
            assert.isTrue(Math.abs(angle + Math.PI / 2) < EPSILON, degrees(angle) + "°");
        });

        it('should give a 90° angle between (1,-1)  and a reference of (-1,-1)', function () {
            var ref = new Vect(-1, -1);
            var w = new Vect(1, -1);
            var angle = w.angle(ref);
            assert.isTrue(Math.abs(angle - Math.PI / 2) < EPSILON, degrees(angle) + "°");
        });

        it('should give a 180° angle between (1,1)  and a reference of (-1,-1)', function () {
            var ref = new Vect(-1, -1);
            var w = new Vect(1, 1);
            var angle = w.angle(ref);
            assert.isTrue(Math.abs(angle - Math.PI) < EPSILON, degrees(angle) + "°");
        });

    });

    describe('#rotate', function () {
        var EPSILON = 0.0001;
        it('should rotate 180°', function () {
            var v = new Vect(1, 0);
            v.rotate(Math.PI);

            assert.isTrue(Math.abs(v.x + 1) < EPSILON);
            assert.isTrue(Math.abs(v.y) < EPSILON);
        });

        it('should preserve length', function () {
            var v = new Vect(3, 7);
            var before = v.length();
            v.rotate(Math.PI / 7);
            var after = v.length();
            assert.isTrue(Math.abs(before - after) < EPSILON);
        });

    });


    describe('#rotate with pivot', function () {
        var EPSILON = 0.0001;
        it('should rotate 90°', function () {
            var v = new Vect(3, 2);
            var pivot = new Vect(2, 1);

            v.rotate(Math.PI / 2, pivot);

            assert.isTrue(Math.abs(v.x - 1) < EPSILON);
            assert.isTrue(Math.abs(v.y - 2) < EPSILON);
        });
    });


    describe('#rotateTo', function () {
        var EPSILON = 0.0001;
        it('should preserve length', function () {
            var v = new Vect(3, 7);
            var before = v.length();
            v.rotateTo(Math.PI / 7);
            var after = v.length();
            assert.isTrue(Math.abs(before - after) < EPSILON);
        });

        /*
         it('should set angle from (1,0)', function () {
         var v = new Vect(3, 7);
         var w = new Vect(0, 1);
         v.rotateTo(Math.PI / 7);
         var angle = v.angle(w);
         assert.isTrue(Math.abs(angle - Math.PI / 7) < EPSILON);
         });
         */


    });


    describe('#isLeftOf/isRightOf', function () {
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

        Coord.setXisLeftOfY(true);

        it('should find the correct right values',
            function () {
                assert.isTrue(b.isRightOf(a));
                assert.isTrue(c.isRightOf(a));
                assert.isTrue(d.isRightOf(a));
                assert.isTrue(e.isRightOf(a));
                assert.isTrue(f.isRightOf(a));
            }
        );

        it('should find the correct left values',
            function () {
                assert.isTrue(h.isLeftOf(a));
                assert.isTrue(i.isLeftOf(a));
                assert.isTrue(j.isLeftOf(a));
            }
        );

        it('should be "anti-reflexive" on true',
            function () {
                var l = all.length;
                for (let n = 0; n < l; n++) {
                    for (let m = 0; m < l; m++) {
                        var v1 = all[n];
                        var v2 = all[m];
                        if (v1.isRightOf(v2)) {
                            assert.isTrue(v2.isLeftOf(v1), "Althoug v1: " + v1 + " isRightOf v2:" + v2 + " v2.isLeftOf(v1) is false");
                        }
                    }
                }
            }
        );

        it('should fail on paralles',
            function () {
                assert.isTrue(!g.isLeftOf(a));
                assert.isTrue(!g.isRightOf(a));


            }
        );

        it('especcially on itself', function () {
            assert.isTrue(!a.isLeftOf(a));
            assert.isTrue(!a.isRightOf(a));
        });
    });


    describe('#isLeftOf/isRightOf the other way around', function () {
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

        beforeAll(function () {
            Coord.setXisLeftOfY(false);
        });

        afterAll(function () {
            Coord.setXisLeftOfY(true);
        });

        it('should find the correct right values',
            function () {

                assert.isTrue(b.isLeftOf(a));
                assert.isTrue(c.isLeftOf(a));
                assert.isTrue(d.isLeftOf(a));
                assert.isTrue(e.isLeftOf(a));
                assert.isTrue(f.isLeftOf(a));

            }
        );

        it('should find the correct left values',
            function () {
                Coord.setXisLeftOfY(false);
                assert.isTrue(h.isRightOf(a));
                assert.isTrue(i.isRightOf(a));
                assert.isTrue(j.isRightOf(a));
            }
        );

        it('should be "anti-reflexive" on true',
            function () {
                var l = all.length;
                for (let n = 0; n < l; n++) {
                    for (let m = 0; m < l; m++) {
                        var v1 = all[n];
                        var v2 = all[m];
                        if (v1.isLeftOf(v2)) {
                            assert.isTrue(v2.isRightOf(v1), "Althoug v1: " + v1 + " isLeftOf v2:" + v2 + " v2.isRightOf(v1) is false");
                        }
                    }
                }
            }
        );

        it('should fail on paralles',
            function () {
                assert.isTrue(!g.isLeftOf(a));
                assert.isTrue(!g.isRightOf(a));


            }
        );

        it('especcially on itself', function () {
            assert.isTrue(!a.isLeftOf(a));
            assert.isTrue(!a.isRightOf(a));
        });


    });


    describe('#turnLeft', function () {
        var u = new Vect(0, 1);
        var v = new Vect(1, 0);
        var w = new Vect(2, 3);

        var u_l = u.clone().turnLeft();
        var v_l = v.clone().turnLeft();
        var w_l = w.clone().turnLeft();

        it('is left of', function () {
            assert.isTrue(u_l.isLeftOf(u));
            assert.isTrue(v_l.isLeftOf(v));
            assert.isTrue(w_l.isLeftOf(w));
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


    describe('#turnRight', function () {
        var u = new Vect(0, 1);
        var v = new Vect(1, 0);
        var w = new Vect(2, 3);

        var u_l = u.clone().turnRight();
        var v_l = v.clone().turnRight();
        var w_l = w.clone().turnRight();

        it('is right of', function () {
            assert.isTrue(u_l.isRightOf(u));
            assert.isTrue(v_l.isRightOf(v));
            assert.isTrue(w_l.isRightOf(w));
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


    describe('#reflectOn', function () {

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

            assert.isTrue(Math.abs(u_r.x) < EPSILON);
            assert.isTrue(Math.abs(u_r.y - 1) < EPSILON);
        });


        it('should do hää', function () {
            var ref = new Vect(2, 3);
            var u = new Vect(2, 3);
            var u_r = u.clone().reflectOn(ref);
            assert.equal(-2, u_r.x);
            assert.equal(-3, u_r.y);
        });

    });
});
