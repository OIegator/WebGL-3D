#version 300 es
#ifdef GL_ES
precision highp float;
#endif

in vec3 vNormal;
in vec4 vColor;
in vec3 vPosition;

uniform vec3 uLightPosition;
uniform vec3 uAmbientLightColor;
uniform vec3 uDiffuseLightColor;
uniform vec3 uSpecularLightColor;
uniform float uAttenuationLinear;
uniform float uAttenuationQuadratic;
uniform float uAmbientIntensity;
out vec4 fragColor;

const float shininess = 16.0;

void main() {

    vec3 lightDirection = normalize(uLightPosition - vPosition);
    vec3 normal = normalize(vNormal);
    float diffuseLightDot = max(dot(normal, lightDirection), 0.0);

    vec3 reflectionVector = normalize(reflect(-lightDirection, normal));
    vec3 viewVector = normalize(-vPosition);
    float specularLightDot = max(dot(reflectionVector, viewVector), 0.0);
    float specularLightParam = pow(specularLightDot, shininess);

    float attenuation = 1.0 / (1.0 + uAttenuationLinear * length(lightDirection) +
    uAttenuationQuadratic * length(lightDirection) * length(lightDirection));

    vec3 lightWeighting = uAmbientLightColor * uAmbientIntensity +
    (uDiffuseLightColor * diffuseLightDot +
    uSpecularLightColor * specularLightParam) * attenuation;

    fragColor = vColor * vec4(lightWeighting, 1.0);
}


