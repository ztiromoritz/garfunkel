// Stolen from here: https://codepen.io/vigneshenoy/pen/gKBLoy

export const template = `
<svg width="500" height="500">
  <defs>
    <marker id="arrow" viewBox="0 -5 10 10" refX="5" refY="0" markerWidth="4" markerHeight="4" orient="auto">
      <path class="cool" d="M0,-5L10,0L0,5" class="arrowHead"></path>
    </marker>
  </defs>
  <circle r="10" cx="100" cy="100"></circle>
  <text x="100" y="100">Hello</text>
  <line class="cool" x1="100" y1="150" x2="130" y2="150" stroke="teal" stroke-width="4" marker-end="url(#arrow)"></line>

  <defs>
  <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.5"/>
  </pattern>
  <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
    <rect width="80" height="80" fill="url(#smallGrid)"/>
    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1"/>
  </pattern>
</defs>
    
<rect width="100%" height="100%" fill="url(#grid)" />


</svg>
<style>
svg {
    border: 1px solid tomato;
  }
  .cool {
    fill: teal;
    stroke: teal;
  }
</style>

`;
