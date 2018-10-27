import { Points } from 'canvas-2d'

const canvas = document.getElementById('demo')
const ctx = canvas.getContext('2d')

function randomHexColor() {	//随机生成十六进制颜色
  return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
}

const length = 28200

const result = []
function getCirclePoints(radius, base = {x:0, y:0}) {
  const theta = 2 * Math.PI * Math.random()
  radius = radius * Math.random()
  return {
    x: Math.ceil(radius * Math.cos(theta) + base.x),
    y: Math.ceil(radius * Math.sin(theta) + base.y)
  }
}
// for (let i = 0; i < length; i++ ) {
//   result.push(getCirclePoints(50, {x: 350, y: 150}))
// }
for (let i = 0; i < length; i++ ) {
  result.push(getCirclePoints(100, {x: 200, y: 200}))
}
for (let i = 0; i < length; i++ ) {
  result.push(getCirclePoints(150, {x: 200, y: 200}))
}
for (let i = 0; i < length; i++ ) {
  result.push(getCirclePoints(200, {x: 200, y: 200}))
}

console.time('1')
const point = new Points(result, function(point) {
  const { x, y } = point
  ctx.fillStyle = randomHexColor()
  ctx.beginPath()
  ctx.arc(x, y, 0.5, 0, 2 * Math.PI)
  ctx.fill()
  ctx.closePath()
})
console.timeEnd('1')

listenHotKey('d', () => {
  point.cursor = 0
  ctx.clearRect(0, 0, 1024, 1024)
})
point.start()
