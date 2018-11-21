attribute vec4 out_position;
attribute vec4 a_position;
varying vec4 v_positionOfColor;

void main() {
    gl_Position = out_position;
    v_positionOfColor = a_position;
}
