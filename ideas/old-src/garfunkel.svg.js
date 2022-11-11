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


        const LINE_STYLE = [
            'lineStyleA',
            'lineStyleB',
            'lineStyleC',
            'lineStyleD',
            'lineStyleE',
            'lineStyleF',
            'lineStyleG'
        ];

        /**
         * Private methods
         * @param that the instance
         * @returns {{}}
         */
        const createPrivate = function (that) {


            const _ = {};

            _.currentLineStyle = 0;

            _.getNextLineStyle = function () {
                _.currentLineStyle = (_.currentLineStyle + 1) % LINE_STYLE.length;
                return LINE_STYLE[_.currentLineStyle];
            };


            _.element = function (name) {
                const el = document.createElementNS('http://www.w3.org/2000/svg', name);
                const chain = {
                    get: () => el,
                    setAttr: (name, value) => {
                        el.setAttribute(name, value);
                        return chain;
                    },
                    addClass: (classname) => {
                        el.classList.add(classname);
                        return chain;
                    }
                };
                return chain;
            }

            _.buildDefs = function (svg) {
                const defs = _.element('defs').get();
                defs.innerHTML = `<marker id="Triangle" viewBox="0 0 10 10" refX="10" refY="5"
                    markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z"/>
            </marker>`;
                svg.appendChild(defs);

            }


            _.buildViewBox = function (svg) {
                const paper = that.paper;
                const range = paper.range;

                var x = range.from[0] - paper.margin;
                var y = range.from[1] - paper.margin;
                var w = range.to[0] - range.from[0] + paper.margin * 2;
                var h = range.to[1] - range.from[1] + paper.margin * 2;
                svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
            }

            _.buildDimension = function (svg) {
                const paper = that.paper;
                svg.setAttribute('width', `${paper.width}`);
                svg.setAttribute('height', `${paper.height}`);
            }

            _.buildAxes = function (svg) {
                const paper = that.paper;
                const range = paper.range;
                const x1 = range.from[0];
                const y1 = range.from[1];
                const x2 = range.to[0];
                const y2 = range.to[1];

                if (paper.xAxis) {
                    const xAxis = _.element('line')
                        .setAttr('x1', x1)
                        .setAttr('y1', 0)
                        .setAttr('x2', x2)
                        .setAttr('y2', 0)
                        .addClass('axis')
                        .get();
                    svg.appendChild(xAxis);

                }

                if (paper.yAxis) {
                    const yAxis = _.element('line')
                        .setAttr('x1', 0)
                        .setAttr('y1', y1)
                        .setAttr('x2', 0)
                        .setAttr('y2', y2)
                        .addClass('axis')
                        .get();
                    svg.appendChild(yAxis);

                }
            };

            _.buildGrid = function (svg) {
                const paper = that.paper;
                const range = paper.range;
                const x1 = range.from[0];
                const y1 = range.from[1];
                const x2 = range.to[0];
                const y2 = range.to[1];
                for (let n = x1; n <= x2; n = n + paper.grid) {
                    const line = _.element('line')
                        .setAttr('x1', n)
                        .setAttr('y1', y1)
                        .setAttr('x2', n)
                        .setAttr('y2', y2)
                        .addClass('gridLine')
                        .get();
                    svg.appendChild(line);
                }

                for (let m = y1; m <= y2; m = m + paper.grid) {
                    const line = _.element('line')
                        .setAttr('x1', x1)
                        .setAttr('y1', m)
                        .setAttr('x2', x2)
                        .setAttr('y2', m)
                        .addClass('gridLine')
                        .get();
                    svg.appendChild(line);
                }
            }


            const noop = () => {
            };

            function matchCaseApply(object, config) {
                const fn = config[object.type] || noop;
                fn(object);
            }


            _.buildObject = function (svg) {
                return function (object) {
                    matchCaseApply(object, {
                        'Vect': ({element, settings}) => {
                            const vect = element;
                            const builder = _.element('line')
                                .setAttr('x1', 0)
                                .setAttr('y1', 0)
                                .setAttr('x2', vect.x)
                                .setAttr('y2', vect.y)
                                .addClass('vect')
                                .addClass(_.getNextLineStyle());
                            if(settings.directed){
                                builder.setAttr('marker-end', 'url(#Triangle)');
                            }
                            const newChild = builder.get();
                            svg.appendChild(newChild);
                        },
                        'Segment': ({element, settings}) => {
                            const segment = element;
                            const builder = _.element('line')
                                .setAttr('x1', segment.p1.x)
                                .setAttr('y1', segment.p1.y)
                                .setAttr('x2', segment.p2.x)
                                .setAttr('y2', segment.p2.y)
                                .addClass('segment')
                                .addClass(_.getNextLineStyle());
                            if(settings.directed){
                                builder.setAttr('marker-end', 'url(#Triangle)');
                            }
                            const newChild = builder.get();
                            svg.appendChild(newChild);
                        },
                        'Line': ({element, settings}) => {

                        },
                        'Ray': ({element, settings}) => {

                        },
                        'Polygon': ({element, settings}) => {

                        }
                    })
                    ;
                }
            }

            _.buildObjects = function (svg) {
                that.objects.forEach(_.buildObject(svg));
            };

            return _;

        };


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
            this.currentLineStyle = 0;
            this._ = createPrivate(this);
        };


        const DEFAULT_SETTINGS = {
            'Vect': {directed: true},
            'Segment': {directed: false},
            'Line': {directed: false},
            'Ray': {directed: false},
            'Polygon': {directed: false}
        }

        /**
         *
         * @param element
         * @param settings
         * @returns {SvgImage}
         */
        SvgImage.prototype.draw = function ({element, settings}) {
            const type = element.constructor.name;
            settings = settings || DEFAULT_SETTINGS[type];

            this.objects.push(
                {
                    type: element.constructor.name,
                    element: element,
                    settings: settings
                }
            )
            return this;
        }


        SvgImage.prototype.build = function () {

            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            this._.buildDefs(svg);
            this._.buildViewBox(svg);
            this._.buildDimension(svg);
            this._.buildGrid(svg);
            this._.buildAxes(svg);
            this._.buildObjects(svg);
            return svg;
        };

        /**
         * @static
         * @returns {SvgImage}
         */
        SvgImage.create = function () {
            return new SvgImage();
        }


        return SvgImage;

    }
));