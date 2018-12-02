import v1 from './v1.glsl';
import f1 from './f1.glsl';
import {
  getRectBuffer,
  getRandom2x
} from "./utils";
import dataJ from './data'
import { createShader, createProgram } from './creator'

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

const vertexShader = createShader(gl, gl.VERTEX_SHADER, v1);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, f1);
const program = createProgram(gl, vertexShader, fragmentShader);

/* 创建缓冲，数据从缓冲中获取 */
const positionBuffer = gl.createBuffer();
/* 绑定点：ARRAY_BUFFER
 * bind points: internal global variables inside WebGL
  * */
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const aPos = gl.getAttribLocation(program, 'out_position');
const aColorPos = gl.getAttribLocation(program, 'a_color_position');
const uColor = gl.getUniformLocation(program, 'u_color');

/* 运行着色程序 */
gl.useProgram(program);
gl.enableVertexAttribArray(aPos);
console.log(aColorPos)
gl.enableVertexAttribArray(aColorPos)

function setReadDataWay(gl) {
  const size = 2;
  const type = gl.FLOAT;
  /* 是否归一化数据 */
  const normalize = false;
  /* 移动单位 */
  const stride = 0;
  const offset = 0;
  /**
   * 将属性绑定到当前的ARRAY_BUFFER。 换句话说就是属性绑定到了positionBuffer上。
   * 这也意味着现在利用绑定点随意将 ARRAY_BUFFER绑定到其它数据上后，
   * 该属性依然从positionBuffer上读取数据。
   * */
  gl.vertexAttribPointer(aPos, size, type, normalize, stride, offset);
}
setReadDataWay(gl);
gl.vertexAttribPointer(aColorPos, 4, gl.FLOAT, false, 4 * 6, 6);

const total = 10;
function getData() {
  if(dataJ) {
    return new Float32Array(dataJ);
  }
  const data = new Float32Array(total * 12);
  const arr = []
  for (let i = 0; i < total; i += 1) {
    const a = getRectBuffer(
      getRandom2x(),
      getRandom2x(),
      getRandom2x(),
      getRandom2x(),
    );
    for(let j = 0;j < 12;j += 1) {
      data[i * 12 + j] = a[j];
      arr[i * 12 + j] = a[j];
    }
  }
  return data;
}

let dataBuffer = getData();
/* 指定从缓冲中读取数据的方式 */
gl.bufferData(gl.ARRAY_BUFFER, dataBuffer, gl.STATIC_DRAW);
gl.uniform4f(uColor, 0.3, 0.3, 0.1, 0.8);
console.time("1");
// gl.drawArrays(gl.TRIANGLES, 6, (total - 1) * 6);
gl.drawArrays(gl.TRIANGLES, 0, 10);
console.timeEnd("1");
/**  **/
