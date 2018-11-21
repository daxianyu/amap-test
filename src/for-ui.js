const canvas = document.getElementById('demo')
const root = document.getElementById('root')
const ctx = canvas.getContext('2d')
const fileInput = document.getElementById('file')
const height = window.innerHeight
const width = window.innerWidth
canvas.height = height;
canvas.width = width;
const imageFile = require('./duck.jpg')

const data = require('./stops')

function getPosition(lnglat) {
  const { lng, lat } = lnglat
  const top = (lng - 119.7) * height;
  const left = (lat - 29.9) * width;
  return [top.toFixed(0), left.toFixed(0)]
}

for(let i=0;i<data.length;i++) {
  const image = document.createElement('img')
  image.src = imageFile
  image.className = 'point'
  const tl = getPosition(data[i])
  image.style = `top: ${tl[0]}px;left:${tl[1]}px`
  root.appendChild(image)
}

// fileInput.addEventListener('change', function (event) {
//   const file = event.target.files["0"]
//   const reader = new FileReader();
//   reader.readAsDataURL(file);
//   reader.onload = function(e) {
//     const img = this.result;
//     for(let i=0;i<data.length;i++) {
//       const image = document.createElement('img')
//       image.src = img
//       root.appendChild(image)
//     }
//   }
// })
//

