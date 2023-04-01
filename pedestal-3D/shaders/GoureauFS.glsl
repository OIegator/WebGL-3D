#version 300 es
#ifdef GL_ES
precision highp float;
#endif

in highp vec3 vLightWeighting;
in highp vec2 vTextureCoord;
in vec4 vColor;

uniform sampler2D uSampler1;
uniform sampler2D uSampler2;

out vec4 fragColor;

void main() {
    highp vec4 tColor1 = texture(uSampler1, vTextureCoord);
    highp vec4 tColor2 = texture(uSampler2, vTextureCoord);

    fragColor = ((1.0 - tColor2.a) * tColor1 + tColor2.a * tColor2 + vColor * 0.5) * vec4(vLightWeighting, 1);
}
