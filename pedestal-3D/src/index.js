import cubeVS from '../../pedestal-3D/shaders/cubeVS.glsl'
import cubeFS from '../../pedestal-3D/shaders/cubeFS.glsl'
import * as glm from "gl-matrix";
import {mod} from "glsl-shader-loader/src/utils/constructor-mask";

const canvas = document.querySelector('canvas');
let gl;
let deltaTime = 0;
let controls = {
    current_rotator: "gold",
    rotation_angle_gold: -1.0,
    rotation_angle_silver: -1.0,
    rotation_angle_bronze: -1.0,
    rotation_angle_pedestal_2itself: 0.2,
    rotation_angle_pedestal_2scene: 0.2,
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

    let shaderProgram = initShaderProgram(gl, cubeVS, cubeFS);

    gl.useProgram(shaderProgram);

    let then = 0;

    window.addEventListener("keydown", checkKeyPressed);

    // Draw the scene repeatedly
    function render(now) {
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;

        if(shaderProgram) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.clearDepth(1.0);
            drawCube(shaderProgram, controls.rotation_angle_gold,
                [1.0, 0.85, 0.0, 1.0], [1.0, -1.0, -9.0],
                controls.rotation_angle_pedestal_2itself, controls.rotation_angle_pedestal_2scene);
            drawCube(shaderProgram, controls.rotation_angle_gold, [1.0, 0.85, 0.0, 1.0],[1.0, 1.0, -9.0], controls.rotation_angle_pedestal_2itself, controls.rotation_angle_pedestal_2scene);
            drawCube(shaderProgram, controls.rotation_angle_silver, [0.75, 0.75, 0.75, 1.0],[-2.0, -1.0, -9.0], controls.rotation_angle_pedestal_2itself, controls.rotation_angle_pedestal_2scene);
            drawCube(shaderProgram, controls.rotation_angle_bronze, [0.8, 0.5, 0.2, 1.0],[4.0, -1.0, -9.0], controls.rotation_angle_pedestal_2itself, controls.rotation_angle_pedestal_2scene);
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

function drawCube(shaderProgram, rotationAngle, color, vec_translate, rotate2itself, rotate2scene) {
//    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//    gl.clearDepth(1.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    let c = rotate2itself;
    let g = rotate2scene;

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
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

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
    //glm.mat4.rotate(projectionMatrix, projectionMatrix, rotationAngle, [0, 1, 0]);
    const modelViewMatrix = glm.mat4.create();
    glm.mat4.translate(modelViewMatrix, modelViewMatrix, vec_translate);

    //let rotationMatrix = glm.mat4.create();

    //glm.mat4.fromYRotation(rotationMatrix, controls.rotation_angle_pedestal_2scene);


    glm.mat4.rotateY(modelViewMatrix, modelViewMatrix, controls.rotation_angle_pedestal_2itself)
    //glm.mat4.translate(modelViewMatrix, modelViewMatrix, [Math.cos(controls.rotation_angle_pedestal_2itself)], 0,  Math.sin(controls.rotation_angle_pedestal_2itself));

    glm.mat4.rotate(modelViewMatrix, modelViewMatrix, rotationAngle, [0, 1, 0]);

    gl.uniform4f(fColor, color[0], color[1], color[2], color[3])
    gl.uniformMatrix4fv(prMatrix, false, projectionMatrix)
    gl.uniformMatrix4fv(mvMatrix, false, modelViewMatrix)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 36);

    requestAnimationFrame(drawCube);
}