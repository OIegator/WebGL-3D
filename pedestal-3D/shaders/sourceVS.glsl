#version 300 es

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;
out vec3 vNormal;
out vec4 vColor;
out vec3 vPosition;
out highp vec3 vLightDir;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vPosition = aVertexPosition;
    vColor = aVertexColor;

    vNormal = mat3(uNormalMatrix) * aVertexNormal;
    vLightDir = normalize(uLightPosition - vec3(uModelViewMatrix * vec4(aVertexPosition, 1.0)));
}
