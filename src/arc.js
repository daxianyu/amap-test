import { Arcs } from 'canvous/build/index'

const data = require('./data2');
const map = new AMap.Map('container', {
  center: [121.7, 31.2],
  zooms: [3, 18],
  zoom: 12
});

function lngLatToXy(map, position) {
  let { lng, lat } = position;
  if (Array.isArray(position)) {
    lng = position[0];
    lat = position[1];
  }

  const lngLat = new window.AMap.LngLat(lng, lat);
  const {x, y} = map.lngLatToContainer(lngLat);
  return [x, y];
}

function createDefaultCoordinateTransformation(map) {
  return (position) => {
    return lngLatToXy(map, position);
  };
}

AMap.plugin('AMap.CustomLayer', () => {
  const canvas = document.createElement('canvas');;
  const ctx = canvas.getContext('2d');
  const height = window.innerHeight;
  const width = window.innerWidth;
  canvas.height = height;
  canvas.width = width;
  ctx.lineWidth = 0.5;
  const customLayer = new AMap.CustomLayer(canvas, {
    zooms: [3, 18],
    alwaysRender: true,
    zIndex: 120
  })
  const transformer = createDefaultCoordinateTransformation(map)
  const arcDrawer = new Arcs(ctx, {
    data: data,
    rate: 0.6,
    coordinateTransformation: transformer,
  });
  customLayer.render = () => {
    canvas.width = width;
    ctx.strokeStyle = 'rgba(14, 11, 1, 0.02)';
    arcDrawer.start()
  };
  customLayer.setMap(map);
})

//
// const point1 = [1024, 0];
// const point2 = [0, 1024];
// function drawArc(center, points, radius) {
//   const [xc, yc] = center;
//   const [point1, point2] = points;
//   const [xp1, yp1] = point1;
//   const [xp2, yp2] = point2;
//   let startAngle = getRadOfVector([xp1 - xc, yp1 - yc]);
//   let endAngle = getRadOfVector([xp2 - xc, yp2 - yc]);
//
//   if (startAngle > endAngle && startAngle - endAngle < Math.PI) {
//     const temp = startAngle;
//     startAngle = endAngle;
//     endAngle = temp;
//   }
//   ctx.beginPath();
//   ctx.arc(xc, yc, radius, startAngle, endAngle);
//   ctx.stroke();
// }
//
// function drawArcs(points, rate) {
//   const [point1, point2] = points;
//   const radiusAndCenters = getMidperpandicular(point1, point2)(rate);
//   const { centers, radius } = radiusAndCenters;
//   const [c1, c2] = centers;
//   if (Math.random() > 0.5) {
//     drawArc(c1, points, radius);
//   } else {
//     drawArc(c2, points, radius);
//   }
// }
//
// function draw() {
//   window.requestAnimationFrame(() => {
//     canvas.width = canvas.width;
//     ctx.strokeStyle = '#e5ee1b';
//     for (let i = 0; i < 10; i += 1) {
//       drawArcs([point1, point2], Math.random() * 1.3);
//     }
//     draw();
//   });
// }
//
// draw()
