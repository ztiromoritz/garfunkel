/**
 * @class Polygon
 * @param points
 * @constructor
 */
var Polygon = function (...points) {
    this.points = points.map(_ => _.clone());
    this.edges = null;
};


Polygon.fromArray = function (arr) {
    const points = [];
    const len = Math.floor(arr.length / 2);
    for (let n = 0; n < len; n++) {
        points.push(new Vect(arr[n * 2], arr[n * 2 + 1]));
    }
    return new Polygon(...points);
};


Polygon.prototype.getPoints = function () {
    return this.points;
}

Polygon.prototype.getEdges = function () {
    if (!this.edges) {
        this.edges = [];
        const len = this.points.length;
        for (let i = 0; i < len; i++) {
            this.edges.push(this.points[(i + 1) % len].clone().sub(this.points[i]));
        }
    }
    return this.edges;
};


/**
 * might be negative
 */
Polygon.prototype.getArea = function () {
    const edges = this.getEdges();
    const len = edges.length;
    const A2 = edges
        .map((current, index) => {
            return [current, edges[(index + 1) % len]];
        })
        .reduce((acc, [u, v]) => {
            return acc + u.trapeze(v);
        }, 0);
    return A2 / 2;
}

Polygon.prototype.getAbsArea = function () {
    return Math.abs(this.getArea());
}

Polygon.prototype.isClockwise = function () {
    // Shoelace formula
    // https://en.wikipedia.org/wiki/Shoelace_formula
    if (Garfunkel.getXIsLeftOfY()) {
        return this.getArea() < 0;
    } else {
        return this.getArea() > 0;
    }

};

Polygon.prototype.getConvexPoints = function () {

};

Polygon.prototype.getConcavePoints = function () {

};

export default Polygon;