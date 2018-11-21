import { Grid } from 'canvas-mass/build/'

const canvas = document.getElementById('demo')
const ctx = canvas.getContext('2d')
const step = 64
const cWidth = 512
const cHeight = 512
let colors

function randomColor(alpha1, alpha2) {
  const rgb = {
    r: Math.random() * 256 << 0,
    g: Math.random() * 256 << 0,
    b: Math.random() * 256 << 0,
  }
  const {r, g, b} = rgb
  if(arguments.length === 1){
    return `rgba(${r},${g},${b},${alpha1})`
  }
  return [`rgba(${r},${g},${b},${alpha1})`, `rgba(${r},${g},${b},${alpha2})`]
}

function getColor (){
  const result = []
  for(let i =0;i<=20;i++) {
    const colors = [randomColor(1), randomColor(1)]
    result.push(colors)
  }
  return result
}

function getPoints() {
  const result = []
  let startX = 0, startY = 0
  const colors = getColor()
  while(startX < cWidth) {
    startY = 0
    while(startY < cHeight) {
      const color = colors[(startX + startY / step) % 20]
      result.push({bounds: {
          bottomLeft: {
            x: startX,
            y: startY
          },
          topRight: {
            x: startX + step,
            y: startY + step,
          }
        },
        rate: Math.random() * 0.5,
        color: color[0],
        borderColor: color[1]
      })
      startY += step
    }
    startX += step
  }
  return result
}

const points = getPoints()

const grid0 = new Grid(ctx)
const grid1 = new Grid(ctx, false)

const points0 = points.map(point=>{
  const {
    rate, ...rest
  } = point
  return rest
})

const points1 = points.map(point => {
  const {
    rate, bounds, borderColor, ...rest
  } = point
  const { topRight, bottomLeft } = bounds
  const x0 = bottomLeft.x
  const x1 = topRight.x

  return {
    ...rest, color: 'rgba(255,255,255,0.2)', bounds: {
      topRight,
      bottomLeft: {...bottomLeft, x: x0 + (x1 - x0) * rate}
    }
  }
})

console.log(JSON.stringify(points0))
console.log(JSON.stringify(points1))

listenHotKey('d', ()=>{
  const points = getPoints()

  const points0 = points.map(point=>{
    const {
      rate, ...rest
    } = point
    return rest
  })

  const points1 = points.map(point => {
    const {
      rate, bounds, borderColor, ...rest
    } = point
    const { topRight, bottomLeft } = bounds
    const x0 = bottomLeft.x
    const x1 = topRight.x

    return {
      ...rest, color: 'rgba(255,255,255,0.2)', bounds: {
        topRight,
        bottomLeft: {...bottomLeft, x: x0 + (x1 - x0) * rate}
      }
    }
  })
  ctx.clearRect(0, 0, cWidth, cHeight)
  grid0.groupRender(points0)
  grid1.groupRender(points1)
})

