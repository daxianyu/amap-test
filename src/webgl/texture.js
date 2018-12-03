import { assemblyProgram } from './creator';
import f from './glsl/f.glsl'
import v from './glsl/v.glsl'
import imageURL from '../duck.jpg';

const canvas = document.getElementById('demo');
let gl = window.gl;
if(!gl) {
  /** Save gl context for reuse when refresh on code modification,
  * otherwise, it will cause canvas error */
  gl = canvas.getContext('webgl');
  window.gl = gl;
}

const program = assemblyProgram(gl, v, f);

/**
 * 1. create buffer
 * 2. bind buffer to a point: ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER
 * 3. bind data to previous point
 * */
function bindAttribData(gl, program, attribute, bufferType, bufferData, usage = gl.STATIC_DRAW){
  const location = gl.getAttribLocation(program, attribute);
  const buffer = gl.createBuffer();
  gl.bindBuffer(bufferType, buffer);
  gl.bufferData(bufferType, bufferData, usage);

  return {
    bindPointer(size, type, normalize = false, stride = 0, offset = 0) {
      gl.enableVertexAttribArray(location);
      gl.bindBuffer(bufferType, buffer);
      gl.vertexAttribPointer(location, size, type, normalize, stride, offset)
    },
    bufferData(data){
      gl.bindBuffer(bufferType, buffer);
      gl.bufferData(bufferType, data, usage);
    }
  }
}

function createAndSetupTexture(gl) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return texture
}

function computeKernelWeight(kernel) {
  const weight = kernel.reduce(function(prev, curr) {
    return prev + curr;
  });
  return weight <= 0 ? 1 : weight;
}

function render(image) {
  gl.useProgram(program);
  console.log(
    gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
  );

  const matrixLocation = gl.getAttribLocation(program, 'matrix');
  const kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
  const kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");

  const rectData = setRectangle(0, 0, image.width, image.height);
  const positionBuffer = bindAttribData(gl, program, 'a_position', gl.ARRAY_BUFFER, rectData);
  positionBuffer.bindPointer(2, gl.FLOAT);

  const texBuffer = bindAttribData(gl, program, 'a_texCoord', gl.ARRAY_BUFFER, new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    0.0,  1.0,
    0.0,  1.0,
    1.0,  0.0,
    1.0,  1.0,
  ]));

  /* Tell gl which attribute to bind to current buffer, and how to read data from it */
  texBuffer.bindPointer(2, gl.FLOAT);
  createAndSetupTexture(gl);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  const edgeDetect = [
      -0.125, -0.125, -0.125,
      -0.125,  1,     -0.125,
      -0.125, -0.125, -0.125
  ];

  const emboss = [
    -2, -1,  0,
    -1,  1,  1,
    0,  1,  2
  ];

  let i = 1;
  gl.uniform1fv(kernelLocation, emboss);
  gl.uniform1f(kernelWeightLocation, computeKernelWeight(emboss));
  gl.vertexAttrib1f(matrixLocation, Math.sin(i));
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  // return;

  let direction = -1;
  function draw() {
    requestAnimationFrame(()=>{
      if(direction > 0) {
        i += 0.01;
        if(i > Math.PI) {
          direction = -1
        }
      } else {
        i -= 0.01;
        if(i < 0) {
          direction = 1
        }
      }
      gl.vertexAttrib1f(matrixLocation, Math.sin(i));
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      draw()
    })
  }
  draw();
}

function main() {
  const image = new Image();
  image.src = imageURL;
  image.onload = () => {
    render(image);
  };
}

main();

function setRectangle(x, y, width, height) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;
  return new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ])
}
