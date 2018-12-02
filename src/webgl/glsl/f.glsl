precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
varying vec2 v_color;
uniform float u_kernel[9];
uniform float u_kernelWeight;

vec4 getMatrix(vec2 v_texCoord, float u_kernel[9]) {
  vec2 onePixel = vec2(1.0, 1.0) / vec2(640.0, 898.0);
  return texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
    texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
    texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
    texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8];
}

void main() {
//  gl_FragColor = vec4(v_color,0 , 1).rgra;
  vec4 colorSum = getMatrix(v_texCoord, u_kernel);
  gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1);
//   + vec4(v_color, 1, 1);
}
