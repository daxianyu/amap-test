attribute vec4 out_position;
attribute vec4 a_color_position;
varying vec4 u_color_position;

void main() {
    gl_Position = out_position;
    v_positionOfColor = a_position;
}
