attribute vec2 a_color;
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_color;
varying vec2 v_texCoord;
//uniform vec2 u_resolution;
attribute float matrix;
//vec4 matrix = vec4(2, 2, 0.1, 1);

void main() {
  vec2 resolution = vec2(640, 898);
  vec2 zeroToOne = a_position / resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(1, matrix, 1, matrix) * vec4(clipSpace * vec2(1, -1), 0, 1);
  v_color = a_color / resolution;
  v_texCoord = a_texCoord;
}
