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

function assemblyProgram(gl, vertexGlsl, fragmentGlsl){
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexGlsl);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentGlsl);
  return createProgram(gl, vertexShader, fragmentShader)
}

export {
  createProgram,
  createShader,
  assemblyProgram,
}
