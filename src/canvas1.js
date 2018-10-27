import CanvasGrid from "./grid";

const canvas = document.getElementById('demo')
const canvas1 = document.getElementById('demo1')
const ctx = canvas.getContext('2d')
const ctx1 = canvas1.getContext('2d')

let rate = 0
let pause = false
let isOpt = false
window.imageCache = {}
let colors
const step = 64
const cWidth = 512
const cHeight = 512

function randomColor(alpha1, alpha2) {
  const rgb = {
    r: Math.random() * 256 << 0,
    g: Math.random() * 256 << 0,
    b: Math.random() * 256 << 0,
  }
  const {r, g, b} = rgb
  return [`rgba(${r},${g},${b},${alpha1})`, `rgba(${r},${g},${b},${alpha2})`]
}

function drawRect(ctx, pointSet, rate, color, lineColor) {
  const {bottomLeft, topRight} = pointSet;
  const { x, y: y0 } = bottomLeft
  const { x: x0, y } = topRight
  const width = Math.abs(x0 - x)
  const height = Math.abs(y - y0)

  render(ctx, color, x, y, width, height, lineColor, rate)
}

function drawRects (ctx, pointList) {
  pointList.forEach(point=>{
    drawRect(ctx, point.point, point.rate, point.color, point.fillColor)
  })
}

function render(ctx, color, x, y, width, height, lineColor, rate) {
  const widthInt = width * Math.ceil(rate * 20) / 20
  if(imageCache[color + widthInt]) {
    ctx.putImageData(imageCache[color + widthInt], x, y)
  } else {
    ctx.fillStyle = color
    ctx.strokeStyle = lineColor
    ctx.clearRect(x, y, width, height)
    ctx.fillRect(x, y, width, height)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.fillRect(x, y, width * rate, height)
    ctx.strokeRect(x, y, width, height)
    imageCache[color + widthInt] = ctx.getImageData(x, y, width, height)
  }
}

function renderer(color, x, y, width, height, lineColor, rate, useCache) {
  width = Math.ceil(width * rate)
  if(!width) return
  if(imageCache[color + width] && useCache) {
    const cache = imageCache[color + width]
    ctx.putImageData(cache, x, y)
    // ctx.drawImage(canvas, ...cache, x, y, width, height)
  } else {
    ctx.fillStyle = color
    if(lineColor) {
      ctx.clearRect(x, y, width, height)
      ctx.strokeStyle = lineColor
      ctx.strokeRect(x, y, width, height)
    }
    ctx.fillRect(x, y, width, height)
    if(useCache) {
      imageCache[color + width] = ctx.getImageData(x, y, width, height)
    }
    // imageCache[color + width] = [x, y, width, height]
  }
}

function groupRender(ctx, pointList, useCache=true) {
  pointList.forEach(points=>{
    const { color, rate = 1, point, fillColor} = points
    const [bottomLeft, topRight] = point;
    const { x, y: y0 } = bottomLeft
    const { x: x0, y } = topRight
    const width = Math.abs(x0 - x)
    const height = Math.abs(y - y0)

    renderer(color, x, y, width * rate, height, fillColor, rate, useCache)
  })
}


function getColor (){
  const result = []
  for(let i =0;i<=20;i++) {
    const colors = randomColor(0.3, 0.99)
    result.push(colors)
  }
  return result
}


function getPoints() {
  const result = []
  let startX = 0, startY = 0
  while(startX < cWidth) {
    startY = 0
    while(startY < cHeight) {
      const color = colors[(startX + startY / step) % 20]
      result.push({bounds: {
          bottomLeft: {
            lng: startX,
            lat: startY
          },
          topRight: {
            lng: startX + step,
            lat: startY + step,
          }
        },
        rate: Math.random() * 0.5,
        color: color[0],
        fillColor: color[1]
      })
      startY += step
    }
    startX += step
  }
  return result
}


let points, points0, points1
function init() {
  colors = getColor()
  points = getPoints()
  points0 = points.map(point=>{
    return {bounds: point.bounds, color: point.color, borderColor: point.fillColor}
  })
  points1 = points.map(point=>{
    return {bounds:point.bounds, color: 'rgba(255, 255, 255, 0.2)', rate: point.rate,}
  })

  console.log(JSON.stringify(points0))
  console.log(JSON.stringify(points1))
}
init()
const grid = new CanvasGrid(ctx)

listenHotKey('s', () => {
  console.time('run')
  init()
  for(let i =0;i<1;i++){
    // groupRender(ctx, points0)
    grid.groupRender(points0)
    grid.groupRender(points1, false)
    // groupRender(ctx, points1, false)
  }
  console.timeEnd('run')
})

listenHotKey('a', () => {
  console.time('run')
  for(let i =0;i<1;i++){
    groupRender(ctx, points0, false)
    groupRender(ctx, points1, false)
  }
  console.timeEnd('run')
})

listenHotKey('x', () => {
  imageCache = {}
  ctx.clearRect(0, 0, cWidth, cHeight)
})

listenHotKey('d', () => {
  console.time('run last')
  for(let i =0;i<10;i++) {
    drawRects(ctx1, points)
  }
  console.timeEnd('run last')
})
listenHotKey('c', () => {
  imageCache = {}
  ctx1.clearRect(0, 0, cWidth, cHeight)
})

listenHotKey('z', () => {
  init()
})

function runDraw() {
  rate += 0.005
  if(pause) {
    return
  }
  requestAnimationFrame(() => {
    groupRender(ctx, points)
    // drawRects(ctx, points, rate)
    if(rate >= 1) {
      console.timeEnd('run ' + (isOpt?'opt': 'no opt'))
      isOpt = !isOpt
      rate = 0
      console.time('run ' + (isOpt?'opt': 'no opt'))
      runDraw()
    } else {
      runDraw()
    }
  })
}
console.time('run ' + (isOpt?'opt': 'no opt'))
// runDraw()
listenHotKey('p', ()=>{
  if(!pause) {
    pause = true
  } else {
    pause = false
    runDraw()
  }
})

