import { assemblyProgram } from './creator';
import f from './glsl/f.glsl'
import v from './glsl/v.glsl'
import imageURL from '../duck.jpg';

const canvas = document.getElementById('demo');
let gl = window.gl;
if(!gl) {
  gl = canvas.getContext('webgl');
}

const program = assemblyProgram(gl, v, f);

function bindAttribData(gl, program, attribute, bufferType, bufferData, usage = gl.STATIC_DRAW){
  const location = gl.getAttribLocation(program, attribute);
  const buffer = gl.createBuffer();
  gl.bindBuffer(bufferType, buffer);
  gl.bufferData(bufferType, bufferData, usage);

  return {
    vertexAttribPointer(size, type, normalize, stride = 0, offset = 0) {
      gl.vertexAttribPointer(location, size, type, normalize, stride, offset)
    },
    on() {
      gl.enableVertexAttribArray(location);
      gl.bindBuffer(bufferType, buffer);
    }
  }
}

function render() {
  /**
   * 1. create buffer
   * 2. bind buffer to a point: ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER
   * 3. bind data to previous point
   * */
  const rectData = setRectangle(gl, 0, 0, image.width, image.height);
  const positionBuffer = bindAttribData(gl, program, 'a_position', gl.ARRAY_BUFFER, rectData);
  positionBuffer.vertexAttribPointer(2, gl.FLOAT, false);
  positionBuffer.on();

  const positionBuffer2 = bindAttribData(gl, program, 'a_position2', gl.ARRAY_BUFFER, rectData);
  positionBuffer2.vertexAttribPointer(2, gl.FLOAT, false);
  positionBuffer2.on();

  const texCoordBuffer = bindAttribData(gl, program, 'a_texCoord', gl.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    0.0, 1.0,
  ]));
  texCoordBuffer.vertexAttribPointer(2, gl, gl.FLOAT, false);
  texCoordBuffer.on();

  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  setRectangle(gl, 0, 0, image.width, image.height);
  gl.useProgram(program);
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 6;

  gl.drawArrays(primitiveType, offset, count);
}

const image = new Image();
image.src = imageURL;
image.onload = () => {
  render();
};


function setRectangle(gl, x, y, width, height) {
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
