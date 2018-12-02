const pie = document.getElementById('pie');

function generateCircle(cx, cy, r, rate, offsetRate, color) {
  const perimeter = 2 * Math.PI * r;

  return `
        <circle style="-moz-transform-origin: 50px 50px 0;transform-origin: 50px 50px 0;"
          cx="${cx}" cy="${cy}" r="${r}" 
          stroke="${color}" stroke-width="${2 * r}" fill="none"
          stroke-dasharray="${rate * perimeter} ${perimeter}"
          transform="rotate(${-90 + 360 * offsetRate})"
          />`
}
let rate = 0.1;

const pie1 = generateCircle(50, 50, 25, rate, 0, '#E84D4D');
const pie2 = generateCircle(50, 50, 25, 1 - rate, rate, '#0090FF');
pie.innerHTML = pie1 + pie2;

// function draw() {
//   requestAnimationFrame(()=>{
//     if(rate < 1) {
//       rate += 0.01;
//     } else {
//       rate = 0;
//     }
//     const pie1 = generateCircle(50, 50, 25, rate, 0, '#E84D4D');
//     const pie2 = generateCircle(50, 50, 25, 1 - rate, rate, '#0090FF');
//     pie.innerHTML = pie1 + pie2;
//     draw()
//   })
// }
//
// draw();
