#version 300 es

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;
uniform mat4 uNormalMatrix;
uniform mat4 mvMatrix;
uniform mat4 prMatrix;
out vec4 vColor;
out vec3 vPosition;
out highp vec3 vLighting;

void main() {
    gl_Position = prMatrix * mvMatrix * vec4(aVertexPosition, 1.0);
    vPosition = aVertexPosition;
    vColor = aVertexColor;

    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
}
