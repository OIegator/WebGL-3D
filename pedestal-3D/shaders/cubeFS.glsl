#version 300 es
#ifdef GL_ES
precision highp float;
#endif

uniform vec4 fColor;
out vec4 fragColor;

void main(void) {
    fragColor = fColor;
}
