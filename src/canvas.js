const canvas = document.getElementById('demo')
const ctx = canvas.getContext('2d')
const {kdTree} = require('./kdTree')
import { BinaryHeap } from './BinaryHeap'

console.log(ctx)

export function randomHexColor() {	//随机生成十六进制颜色
  return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
}

const stack = [];
window.saveStack = []

// let newStack = localStorage.getItem('point')
// newStack = JSON.parse(newStack)

function runSavedPoint () {
  window.requestIdleCallback(function (deadLine) {
    const timeLeft = deadLine.timeRemaining()
    const count = Math.floor(timeLeft) * 128
    const pointArr = newStack.slice(0, count)
    newStack.splice(0, count)
    for(let i=0;i<pointArr.length;i++) {
      const newNode = pointArr[i]
      if(!newNode) break;
      const x = newNode[0], y = newNode[1]
      saveStack.push([x, y])
      ctx.fillStyle = randomHexColor()
      ctx.beginPath()
      ctx.arc(x, y, 0.5, 0, 2 * Math.PI)
      ctx.fill()
      ctx.closePath()
    }
    runSavedPoint()
  })
}

// runSavedPoint()

function runStack(){
  window.requestIdleCallback(function (deadLine) {
    const timeLeft = deadLine.timeRemaining()
    const count = Math.floor(timeLeft) * 128
    const pointArr = stack.slice(0, count)
    stack.splice(0, count)
    for(let i=0;i<pointArr.length;i++) {
      const newNode = pointArr[i]
      if(!newNode) break;
      const {x, y} = newNode.obj
      saveStack.push([x, y])
      ctx.fillStyle = randomHexColor()
      ctx.beginPath()
      ctx.arc(x, y, 0.5, 0, 2 * Math.PI)
      ctx.fill()
      ctx.closePath()
      if(newNode.left) {
        stack.push(newNode.left)
      }
      if(newNode.right) {
        stack.push(newNode.right)
      }
    }
    // if(!stack.length) {
    //   localStorage.setItem("point", JSON.stringify(saveStack))
    // }
    runStack()
  })

  // requestAnimationFrame(()=>{
  //   const newNode = stack.shift()
  //   if(!newNode) return;
  //   const {x, y} = newNode.obj
  //   ctx.fillStyle = randomHexColor()
  //   ctx.beginPath()
  //   ctx.arc(x, y, 0.5, 0, 2 * Math.PI)
  //   ctx.fill()
  //   ctx.closePath()
  //
  //   if(newNode.left) {
  //     stack.push(newNode.left)
  //   }
  //   if(newNode.right) {
  //     stack.push(newNode.right)
  //   }
  //   runStack()
  // })
}

function drawPoints(ctx, node) {
  if(!node) return
  stack.push(node)
}

//
// const heap = new BinaryHeap(e=>e)
// heap.push(3)
// heap.push(4)
// heap.push(6)
// heap.push(2)
// heap.push(7)
// heap.push(9)
// console.log(heap)

function getCirclePoints(radius, base = {x:0, y:0}) {
  const theta = 2 * Math.PI * Math.random()
  radius = radius * Math.random()
  return {
    x: Math.ceil(radius * Math.cos(theta) + base.x),
    y: Math.ceil(radius * Math.sin(theta) + base.y)
  }
}

function genKDData(max, base=0) {
  const x = Number((base + max * Math.random()).toFixed(2))
  const y = Number((base + max * Math.random()).toFixed(2))
  return {x, y}
}

const result = []

// for (let i = 0; i < 50000; i++ ) {
//   result.push(genKDData(100, 150))
// }
// for (let i = 0; i < 50000; i++ ) {
//   result.push(genKDData(200, 100))
// }
// for (let i = 0; i < 50000; i++ ) {
//   result.push(genKDData(300, 50))
// }
// for (let i = 0; i < 50000; i++ ) {
//   result.push(genKDData(400))
// }
for (let i = 0; i < 50000; i++ ) {
  result.push(getCirclePoints(50, {x: 350, y: 150}))
}
for (let i = 0; i < 50000; i++ ) {
  result.push(getCirclePoints(100, {x: 200, y: 200}))
}
for (let i = 0; i < 50000; i++ ) {
  result.push(getCirclePoints(150, {x: 200, y: 200}))
}
for (let i = 0; i < 50000; i++ ) {
  result.push(getCirclePoints(200, {x: 200, y: 200}))
}

const tree = new kdTree(result, function (a, b) {
  return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)
}, ['x', 'y'])

listenHotKey('d', () => {
  ctx.clearRect(0, 0, 1024, 1024)
  stack.length = 0
  for(let i =0;i<1;i++) {
    drawPoints(ctx, tree.root)
  }
  runStack()
})

// const center = {x: 100, y: 150}
// const nearest = tree.nearest(center, 1, 200)

// drawPoints(ctx, [center], 'green')
// nearest.forEach(point=>{
//   drawPoints(ctx, point)
// })

// function Node(obj, dimension, parent) {
//   this.obj = obj;
//   this.left = null;
//   this.right = null;
//   this.parent = parent;
//   this.dimension = dimension;
// }
//
// function kdTree(points, metric, dimensions) {
//
//   var self = this;
//   function buildTree(points, depth, parent) {
//     var dim = depth % dimensions.length,
//       median,
//       node;
//
//     if (points.length === 0) {
//       return null;
//     }
//     if (points.length === 1) {
//       return new Node(points[0], dim, parent);
//     }
//
//     points.sort(function (a, b) {
//       return a[dimensions[dim]] - b[dimensions[dim]];
//     });
//
//     median = Math.floor(points.length / 2);
//     node = new Node(points[median], dim, parent);
//     node.left = buildTree(points.slice(0, median), depth + 1, node);
//     node.right = buildTree(points.slice(median + 1), depth + 1, node);
//
//     return node;
//   }
//
//   function loadTree (data) {
//     // Just need to restore the `parent` parameter
//     self.root = data;
//
//     function restoreParent (root) {
//       if (root.left) {
//         root.left.parent = root;
//         restoreParent(root.left);
//       }
//
//       if (root.right) {
//         root.right.parent = root;
//         restoreParent(root.right);
//       }
//     }
//
//     restoreParent(self.root);
//   }
//
//
//
// }
// console.log(result)
