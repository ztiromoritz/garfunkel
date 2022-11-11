/**
 * @class Line
 * @param segment
 * @constructor
 */
var Line = function (p1, p2) {
    this.p1 = p1.clone();
    this.p2 = p2.clone();
};

Line.fromSegment = function (segment) {
    this.p1 = segment.p1.clone();
    this.p2 = segment.p2.clone();
};

Line.fromArray = function (arr) {
    return new Line(new Vect(arr[0], arr[1]), new Vect(arr[2], arr[3]));
};

Line.prototype.direction = function () { //TODO: connection vs direction
    return this.p2.clone().sub(this.p1).normalize();
};


Line.EQUAL = 1;
Line.PARALLEL = 2;

/**
 *
 * @param line
 * @returns {Vect|Line.PARALLEL|Line.EQUIVALENT} - Intersection is
 */
Line.prototype.intersect = function (line) {

    // this: x = a + b*t
    // line: x = c + d*s

    //direction vectors
    var b = this.direction();
    var d = line.direction();

    //support vectors
    var a = this.p1;
    var c = line.p1;

    //difference between support vector
    var z = c.clone().sub(a);

    var cross = b.cross(d);
    var numerator = z.cross(d); //(this.p1.y-line.p1.y)*d.x - (this.p1.x-line.p1.x)* d.y;

    if (Math.abs(cross) < Garfunkel.EPSILON) { //directions are parallel
        if (Math.abs(numerator) < Garfunkel.EPSILON) { //connection of support is parallel to direction
            return Line.EQUAL;
        } else {
            return Line.PARALLEL;
        }
    }
    var t = numerator / cross;
    return this.p1.clone().add(b.mul(t));
};


/**
 * General intersection method for all combinations of lines, segments, rays.
 * @private
 * @param {Segment|Ray|Line} g
 * @param {Segment|Ray|Line} h
 * @returns {Vect|Segment|Ray|Line|null}
 *      An object that describes the intersection. Can be null.
 */
function lineIntersect(g, h) {

    // g: x = g.p1 + (g.p2-g.p1)*t = a + b*t
    // h: x = h.p1 + (h.p2-h.p1)*s = c + d*s

    //direction vectors
    var b = g.direction();
    var d = h.direction();

    //support vectors
    var a = g.p1;
    var c = h.p1;

    //difference between support vector
    var z = c.clone().sub(a); // (c-a)

    var cross_directions = b.cross(d);
    var dot_directions = b.dot(d);
    var cross_support_direction = z.cross(d); //(this.p1.y-line.p1.y)*d.x - (this.p1.x-line.p1.x)* d.y;
    var dot_support_direction = z.dot(d);

    if (Math.abs(cross_directions) < Garfunkel.EPSILON) { //directions are parallel
        if (Math.abs(cross_support_direction) < Garfunkel.EPSILON) { //connection of support is parallel to direction
            if (isLine(g)) {
                return h.clone();
            }
            if (isLine(h)) {
                return g.clone();
            }
            if (isRay(g) && isRay(h)) {
                if (dot_directions > 0) {
                    //both rays in same direction
                    if (dot_support_direction > 0)
                        return h.clone();
                    else
                        return g.clone();
                } else {
                    //both ray in different directions
                    if (dot_support_direction > 0)
                        return null;
                    else
                        return new Segment(g.p1, h.p1);
                }
            }
            if (isSegment(g) && isSegment(h)) {

                var gp1 = g.containsPoint(h.p1);
                var gp2 = g.containsPoint(h.p2);
                var hp1 = h.containsPoint(g.p1);
                var hp2 = h.containsPoint(g.p2);

                // 0000 => null;
                // 1000 => XXX
                // 0100 => XXX
                // 1100 => return h
                // 0010 => XXX
                // 1010 => [hp1,gp1]
                // 0110 => [hp2,gp1]
                // 1110 => return h (touch)
                // 0001 => XXX
                // 1001 => [hp1,gp2]
                // 0101 => [hp2,gp2]
                // 1101 => return h
                // 0011 => return g
                // 1011 => return g
                // 0111 => return g
                // 1111 => return g (or h)

                if (gp1 && gp2)
                    return h.clone();
                if (hp1 && hp2)
                    return g.clone();
                if (gp1 && hp1)
                    return new Segment(h.p1, g.p1);
                if (gp2 && hp1)
                    return new Segment(h.p2, g.p1);
                if (gp1 && hp2)
                    return new Segment(h.p1, g.p2);
                if (gp2 && hp2)
                    return new Segment(h.p2, g.p2);
                return null;
            }
            if (isSegment(g)) { //h is ray
                //TODO
                if (g.containsPoint(h.p1)) {

                }
            } else { //h is segment, g is ray
                //TODO
                if (h.containsPoint(g.p2)) {

                }
            }
        } else {
            return null; //no intersection Line.PARALLEL;
        }
    }
    var t = cross_support_direction / cross_directions;
    return g.p1.clone().add(b.mul(t));
}


export default Line;