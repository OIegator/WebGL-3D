#version 300 es
#ifdef GL_ES
precision highp float;
#endif

in highp vec3 vLighting;
uniform vec4 fColor;
out vec4 fragColor;

void main(void) {
    fragColor = vec4(fColor.rgb * vLighting, 1.0);
}
