import cubeVS from '../../pedestal-3D/shaders/cubeVS.glsl'
import cubeFS from '../../pedestal-3D/shaders/cubeFS.glsl'
import * as glm from "gl-matrix";

const canvas = document.querySelector('canvas');
let gl;

let controls = {
    pedestal_center: [],
    current_rotator: "gold",
    rotation_angle_gold: 0.0,
    rotation_angle_silver: 0.0,
    rotation_angle_bronze: 0.0,
    rotation_angle_pedestal_2itself: 0.0,
    rotation_angle_pedestal_2scene: 0.0,
}

function initWebGL(canvas) {
    gl = null
    const names = ["webgl2", "webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    for (let ii = 0; ii < names.length; ++ii) {
        try {
            gl = canvas.getContext(names[ii]);
        } catch(e) {}
        if (gl) {
            break;
        }
    }

    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        gl = null;
    }
    return gl;
}

function main() {
    gl = initWebGL(canvas);

    if (gl) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    const vertices = [
        // Front face
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];

    const cubeVerticesBuffer = gl.createBuffer();
   // gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const vertexNormals = [
        // Front
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,

        // Back
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,

        // Top
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,

        // Bottom
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,

        // Right
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,

        // Left
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
    ];

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
        gl.STATIC_DRAW);


    const buffers = {
        vertexBuffer: cubeVerticesBuffer,
        normalBuffer: normalBuffer,
    }

    let shaderProgram = initShaderProgram(gl, cubeVS, cubeFS);

    gl.useProgram(shaderProgram);

    window.addEventListener("keydown", checkKeyPressed);

    function render() {

        if(shaderProgram) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.clearDepth(1.0);
            drawCube(shaderProgram, buffers, controls.rotation_angle_gold,
                [1.0, 0.85, 0.0, 1.0], [2.0, -1.0, -15.0],
                controls.rotation_angle_pedestal_2itself, controls.rotation_angle_pedestal_2scene, "gold1");
            drawCube(shaderProgram, buffers, controls.rotation_angle_gold, [1.0, 0.85, 0.0, 1.0],[2.0, 1.0, -15.0], controls.rotation_angle_pedestal_2itself, controls.rotation_angle_pedestal_2scene, "gold2");
            drawCube(shaderProgram, buffers, controls.rotation_angle_silver, [0.75, 0.75, 0.75, 1.0],[-1.0, -1.0, -15.0], controls.rotation_angle_pedestal_2itself, controls.rotation_angle_pedestal_2scene, "silver");
            drawCube(shaderProgram, buffers, controls.rotation_angle_bronze, [0.8, 0.5, 0.2, 1.0],[5.0, -1.0, -15.0], controls.rotation_angle_pedestal_2itself, controls.rotation_angle_pedestal_2scene, "bronze");
        }
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;

}
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function checkKeyPressed(e) {

    if (e.keyCode == "66") {
        controls.current_rotator = "bronze";
    }

    if (e.keyCode == "71") {
        controls.current_rotator = "gold";
    }

    if (e.keyCode == "83") {
        controls.current_rotator = "silver";
    }

    if (e.keyCode == "80") {
        controls.current_rotator = "pedestal";
    }

    if (e.keyCode == "67") {
        controls.current_rotator = "center";
    }


    if (e.keyCode == "37") {
        switch (controls.current_rotator) {
            case "gold":
                controls.rotation_angle_gold -= 0.1;
                break;
            case "silver":
                controls.rotation_angle_silver -= 0.1;
                break;
            case "bronze":
                controls.rotation_angle_bronze -= 0.1;
                break;
            case "pedestal":
                controls.rotation_angle_pedestal_2itself -= 0.1;
                break;
            case "center":
                controls.rotation_angle_pedestal_2scene -= 0.1;
                break;
        }
    }

    if (e.keyCode == "39") {
        switch (controls.current_rotator) {
            case "gold":
                controls.rotation_angle_gold += 0.1;
                break;
            case "silver":
                controls.rotation_angle_silver += 0.1;
                break;
            case "bronze":
                controls.rotation_angle_bronze += 0.1;
                break;
            case "pedestal":
                controls.rotation_angle_pedestal_2itself += 0.1;
                break;
            case "center":
                controls.rotation_angle_pedestal_2scene += 0.1;
                break;
        }
    }

}

main();

function drawCube(shaderProgram, buffers, rotationAngle, color, vec_translate, rotate2itself, rotate2scene, cube_type) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);

    const vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    const prMatrix = gl.getUniformLocation(shaderProgram, "prMatrix");
    const mvMatrix = gl.getUniformLocation(shaderProgram, "mvMatrix");
    const fColor = gl.getUniformLocation(shaderProgram, "fColor");

    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionAttribute);

    const fieldOfView = (45 * Math.PI) / 180;// in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = glm.mat4.create();

    glm.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const modelViewMatrix = glm.mat4.create();

    switch (cube_type) {
        case "gold1":
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, -1.0, -15]);
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, rotate2scene, [0, 1, 0]);
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [5.0, 0.0, 0.0]);
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, rotationAngle + rotate2itself, [0, 1, 0]);
            break;
        case "gold2":
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 1.0, -15]);
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, rotate2scene, [0, 1, 0]);
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [5.0, 0.0, 0.0]);
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, rotationAngle + rotate2itself, [0, 1, 0]);
            break;
        case "silver":
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, -1.0, -15]);
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, rotate2scene, [0, 1, 0]);
            // Translate the cube to the center of rotation
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [5.0, 0, 0]);

            // Rotate the cube around its center
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, rotate2itself, [0, 1, 0]);

            // Translate the cube back to its original position
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [-3.0, 0.0, 0.0]);
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, rotationAngle, [0, 1, 0]);
            break;
        case "bronze":
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, -1.0, -15]);
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, rotate2scene, [0, 1, 0]);

            // Translate the cube to the center of rotation
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [5.0, 0.0, 0.0]);

            // Rotate the cube around its center
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, controls.rotation_angle_pedestal_2itself, [0, 1, 0]);

            // Translate the cube back to its original position
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [3.0, 0.0, 0.0]);
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, rotationAngle, [0, 1, 0]);
            break;
    }

    const vertexNormals = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normalBuffer);
    gl.vertexAttribPointer(vertexNormals, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexNormals);

    const normalMatrix = glm.mat4.create();
    glm.mat4.invert(normalMatrix, modelViewMatrix);
    glm.mat4.transpose(normalMatrix, normalMatrix);

    const nMatrix = gl.getUniformLocation(shaderProgram, 'uNormalMatrix');
    gl.uniformMatrix4fv(nMatrix, false, normalMatrix);

    gl.uniform4f(fColor, color[0], color[1], color[2], color[3])
    gl.uniformMatrix4fv(prMatrix, false, projectionMatrix)
    gl.uniformMatrix4fv(mvMatrix, false, modelViewMatrix)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 36);

    requestAnimationFrame(drawCube);
}