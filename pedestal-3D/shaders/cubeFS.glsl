#version 300 es
#ifdef GL_ES
precision highp float;
#endif

in highp vec3 vLighting;
in vec4 vColor;
out vec4 fragColor;

void main(void) {
    fragColor = vec4(vColor.rgb * vLighting, 1.0);
}
