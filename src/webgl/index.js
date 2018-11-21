import v1 from './v1.glsl';
import f1 from './f1.glsl';
import {
  getRectBuffer,
  getRandom2x, getRandom256x
} from "./utils";

const data = new Float32Array([
  -0.5, -0.5,
  0, 0.5,
  1, 0,
  1, 0.6,
  0, -1,
  0.4, 0.6,
  -0.5, -0.5,
]);
const canvas = document.getElementById('demo');
let gl = window.gl;
if(!gl) {
  gl = canvas.getContext('webgl');
}

/**
 * @param {object} gl
 * @param {number} type
 * @param {string} source
 * @return { object } shader
 * */
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if(success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader);
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, v1);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, f1);

/**
 * @param {object} gl
 * @param {object} vertexShader
 * @param {object} fragmentShader
 * @return { object } program
 * */
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if(success) {
    return program
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

const program = createProgram(gl, vertexShader, fragmentShader);

/* 创建缓冲，数据从缓冲中获取 */
const positionBuffer = gl.createBuffer();
/* 绑定点：ARRAY_BUFFER
 * bind points: internal global variables inside WebGL
  * */
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const aPos = gl.getAttribLocation(program, 'out_position');
const colorPos = gl.getAttribLocation(program, 'a_position');
const uColor = gl.getUniformLocation(program, 'u_color');

/* 运行着色程序 */
gl.useProgram(program);
gl.enableVertexAttribArray(aPos);

function setReadDataWay(gl, posAttr, offset = 0) {
  const size = 2;
  const type = gl.UNSIGNED_BYTE;
  /* 是否归一化数据 */
  const normalize = true;
  /* 移动单位 */
  const stride = 0;
  /**
   * 将属性绑定到当前的ARRAY_BUFFER。 换句话说就是属性绑定到了positionBuffer上。
   * 这也意味着现在利用绑定点随意将 ARRAY_BUFFER绑定到其它数据上后，
   * 该属性依然从positionBuffer上读取数据。
   * */
  gl.vertexAttribPointer(posAttr, size, type, normalize, stride, offset);
}
// setReadDataWay(gl, aPos);
gl.vertexAttribPointer(aPos, 2, gl.UNSIGNED_BYTE, true, 0, 0);
// gl.vertexAttribPointer(colorPos, 4, gl.UNSIGNED_BYTE, true, 16, 12);

const total = 100;
function getData() {
  const itemCount = 12 + 4;
  const data = new Uint8Array(total * 2 * itemCount);
  for (let i = 0; i < total * 2; i += 1) {
    const a = getRectBuffer(
      getRandom2x(),
      getRandom2x(),
      2, 2
    );
    for(let j = 0;j < 12;j += 1) {
      data[i * itemCount + j] = a[j];
    }
    for(let j = 12;j < 16;j += 1) {
      data[i * itemCount + j] = getRandom256x();
    }
  }
  return data
}

let dataBuffer = getData();
gl.bufferData(gl.ARRAY_BUFFER, dataBuffer, gl.STATIC_DRAW);
let offset = 1;
function d() {
  requestAnimationFrame(()=>{
    if(offset < 2) {
      offset += 1
    } else {
      offset = 0
    }
    /* 指定从缓冲中读取数据的方式 */
    gl.uniform4f(uColor, Math.random(), Math.random(), Math.random(), 1)
    gl.drawArrays(gl.Line, 0, 2);
    d();
  })
}

d()
/**  **/
