#version 300 es

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

uniform vec3 uLightPosition;
uniform vec3 uDiffuseLightColor;
uniform float uAmbientIntensity;
uniform float uAttenuationLinear;
uniform float uAttenuationQuadratic;

out vec4 vColor;
out vec3 vPosition;
out vec3 vNormal;

out highp vec3 vLightWeighting;

void main() {

    vec4 vertexPositionEye4 = uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vec3 vertexPositionEye3 = vertexPositionEye4.xyz / vertexPositionEye4.w;

    vec3 lightDirection = normalize(uLightPosition - vertexPositionEye3);

    vec3 normal = normalize(mat3(uNormalMatrix) * aVertexNormal);

    float diffuseLightDot = max(dot(normal, lightDirection), 0.0);

    float attenuation = 1.0 / (1.0 + uAttenuationLinear * length(lightDirection) +
    uAttenuationQuadratic * length(lightDirection) * length(lightDirection));

    vLightWeighting = uDiffuseLightColor * diffuseLightDot * attenuation * (1.0 + uAmbientIntensity);

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vPosition = vertexPositionEye3;
    vColor = aVertexColor;
    vNormal = normal;
}
