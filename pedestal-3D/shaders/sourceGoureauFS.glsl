#version 300 es
#ifdef GL_ES
precision highp float;
#endif

in highp vec3 vLightDir;
in vec3 vNormal;
in vec4 vColor;
uniform float uAttenuationLinear;
uniform float uAttenuationQuadratic;
uniform float uAmbientIntensity;
out vec4 fragColor;

void main() {
    vec3 normal = normalize(vNormal);
    float attenuation = 1.0 / (1.0 + uAttenuationLinear * length(vLightDir) + uAttenuationQuadratic * length(vLightDir) * length(vLightDir));
    float diffuse = max(dot(normal, vLightDir), 0.0);
    fragColor = vColor * attenuation * (diffuse + uAmbientIntensity);
}
