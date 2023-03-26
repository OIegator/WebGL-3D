#version 300 es
#ifdef GL_ES
precision highp float;
#endif

in highp vec3 vLightDir;
in vec3 vNormal;
in vec4 vColor;
in vec3 vPosition;
uniform float uAttenuationLinear;
uniform float uAttenuationQuadratic;
uniform float uAmbientIntensity;
out vec4 fragColor;

void main() {
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    vec3 diffuseColor = lightColor * max(dot(vNormal, vLightDir), 0.0);
    vec3 viewDir = normalize(-vPosition);
    vec3 reflectDir = reflect(-vLightDir, vNormal);
    float specular = pow(max(dot(reflectDir, viewDir), 0.0), 32.0);
    float attenuation = 1.0 / (1.0 + uAttenuationLinear * length(vLightDir) + uAttenuationQuadratic * length(vLightDir) * length(vLightDir));
    vec3 color = (diffuseColor + specular) * attenuation;
    fragColor = vec4(color, 1.0) * vColor * (1.0 + uAmbientIntensity);
}


