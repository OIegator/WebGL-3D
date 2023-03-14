#version 300 es

in vec3 aVertexPosition;
uniform mat4 mvMatrix;
uniform mat4 prMatrix;
out vec3 vPosition;

void main() {
    gl_Position = prMatrix * mvMatrix * vec4(aVertexPosition, 1.0);
    vPosition = aVertexPosition;
}
