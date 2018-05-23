// Draw garfunkel Objects in SVGs
// Usage:
// SvgElement
/*
const svg = SvgImage.create()
    .from(-10, -10)
    .to(10, 10)
    .margin(10)
    .width(200)
    .height(200)
    .withGrid(1)
    .withXAxis()
    .withYAxis()
    .draw(vect, cssClass)
    .draw(polygon)
    .draw(segment, cssClass)
    .draw(p, v)                          // vect,vect -> Stützpunkt
    .combine(SvgImage.create())         // other svg image

    .build();                           // alternative buildAsString()

    */


/**
 * garfunkel.js - A 2D geometry toolbox
 * @module Garfunkel
 */
(function (root, factory) {
    /*global module, define, define*/
    if (typeof exports === 'object') {
        // COMMON-JS
        module.exports = factory();
    } else if (typeof define === 'function' && define['amd']) {
        // Asynchronous Module Definition AMD
        define([], factory);
    } else {
        //GLOBAL (e.g. browser)
        root['SvgImage'] = factory();
    }
}(this, function () {


        /**
         * @constructor
         */
        const SvgImage = function () {
            this.paper = {
                range: {from: [-10, -10], to: [10, 10]},
                margin: 10,
                grid: 1,
                xAxis: true,
                yAxis: true,
                width: 400,
                height: 400,
                xIsLiftOfY: true // game coordinates
            };
            this.objects = [];
        };

        const element = function (name) {
            const el = document.createElementNS('http://www.w3.org/2000/svg', name);
            const _ = {
                get: () => el,
                attr: (name, value) => {
                    el.setAttribute(name, value);
                    return _;
                }
            };
            return _;
        }

        const buildDefs = function (svg) {
            const defs = element('defs').get();
            defs.innerHTML = `<marker id="Triangle" viewBox="0 0 10 10" refX="1" refY="5"
                    markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z"/>
            </marker>`;

        }


        const buildViewBox = function (paper, svg) {
            const range = paper.range;
            var x = range.from[0] - paper.margin;
            var y = range.from[1] - paper.margin;
            var w = range.to[0] - range.from[0] + paper.margin * 2;
            var h = range.to[1] - range.from[1] + paper.margin * 2;
            svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
        }

        const buildDimension = function (paper, svg) {
            svg.setAttribute('width', `${paper.width}`);
            svg.setAttribute('height', `${paper.height}`);
        }

        const buildAxes = function (paper, svg) {
            const range = paper.range;
            const x1 = range.from[0];
            const y1 = range.from[1];
            const x2 = range.to[0];
            const y2 = range.to[1];

            if (paper.xAxis) {
                const xAxis = element('line')
                    .attr('x1', x1)
                    .attr('y1', 0)
                    .attr('x2', x2)
                    .attr('y2', 0)
                    .attr('stroke', 'black')
                    .attr('stroke-width', '0.1')
                    .get();
                svg.appendChild(xAxis);

            }

            if (paper.yAxis) {
                const yAxis = element('line')
                    .attr('x1', 0)
                    .attr('y1', y1)
                    .attr('x2', 0)
                    .attr('y2', y2)
                    .attr('stroke', 'black')
                    .attr('stroke-width', '0.1')
                    .get();
                svg.appendChild(yAxis);

            }
        };

        const buildGrid = function (paper, svg) {
            const range = paper.range;
            const x1 = range.from[0];
            const y1 = range.from[1];
            const x2 = range.to[0];
            const y2 = range.to[1];
            for (let n = x1; n <= x2; n = n + paper.grid) {
                const line = element('line')
                    .attr('x1', n)
                    .attr('y1', y1)
                    .attr('x2', n)
                    .attr('y2', y2)
                    .attr('stroke', 'blue')
                    .attr('stroke-width', '0.05')
                    .get();
                svg.appendChild(line);
            }

            for (let m = y1; m <= y2; m = m + paper.grid) {
                const line = element('line')
                    .attr('x1', x1)
                    .attr('y1', m)
                    .attr('x2', x2)
                    .attr('y2', m)
                    .attr('stroke', 'blue')
                    .attr('stroke-width', '0.05')
                    .get();
                svg.appendChild(line);
            }
        }

        const buildObject = function (svg) {
            return function (object) {
                ({
                    'Vect': (vect) => {
                        const el = element('line')
                            .attr('x1', 0)
                            .attr('y1', 0)
                            .attr('x2', vect.x)
                            .attr('y2', vect.y)
                            .attr('marker-end', 'url(#Triangle)')
                            .attr('stroke-width', '0.1')
                            .attr('stroke', 'red' )
                            .get();
                        svg.appendChild(el);
                    }
                }[object.type] || (() => {
                }))(object.element);
            }
        }


        const buildObjects = function (objects, svg) {
            objects.forEach(buildObject(svg));
        };


        SvgImage.prototype.draw = function (element) {
            this.objects.push(
                {
                    type: element.constructor.name,
                    element: element
                }
            )
            return this;
        }


        SvgImage.prototype.build = function () {

            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            buildDefs(svg);
            buildViewBox(this.paper, svg);
            buildDimension(this.paper, svg);
            buildAxes(this.paper, svg);
            buildGrid(this.paper, svg);

            buildObjects(this.objects, svg);

            return svg;
        };

        SvgImage.create = function () {
            return new SvgImage();
        }


        return SvgImage;

    }
));