// Draw garfunkel Objects in SVGs
// Usage:
// SvgElement
const svg = SvgImage.create()
    .from(-10, -10)
    .to(10, 10)
    .withGrid(1)
    .withXAxis()
    .withYAxis()
    .draw(vect, cssClass)
    .draw(polygon)
    .draw(segment, cssClass)
    .draw(p, v)                          // vect,vect -> Stützpunkt
    .combine(SvgImage.create())         // other svg image
    .build();                           // alternative buildAsString()



