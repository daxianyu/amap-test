precision mediump float;
uniform vec4 u_color;
varying vec4 u_color_position;

void main() {
    if(u_color_position == vec4(1, 1, 1, 1)) {
        gl_FragColor = u_color_position;
    } else {
        gl_FragColor = u_color;
    }
}
