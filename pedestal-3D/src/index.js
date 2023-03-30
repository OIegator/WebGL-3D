import PhongVS from '../shaders/PhongVS.glsl'
import BlinnPhongVS from '../shaders/BlinnPhongVS.glsl'
import LambertVS from '../shaders/LambertVS.glsl'
import GoureauFS from '../shaders/GoureauFS.glsl'
import ToonShadingFS from '../shaders/ToonShadingFS.glsl'
import PhongFS from '../shaders/PhongFS.glsl'
import {initBuffers, initColorBuffer} from "./initBuffers";
import {drawCube} from "./drawCube.js";

const canvas = document.querySelector('canvas');
const textLight = document.getElementById('light-overlay');
const textShade = document.getElementById('shade-overlay');
const verticalCtrl = document.getElementById('vertical-controller-overlay');
const horizontalCtrl = document.getElementById('horizontal-controller-overlay');
let gl;

let controls = {
    pedestal_center: [],
    current_rotator: "gold",
    current_controller: "lin",
    rotation_angle_gold: 0.0,
    rotation_angle_silver: 0.0,
    rotation_angle_bronze: 0.0,
    rotation_angle_pedestal_2itself: 0.0,
    rotation_angle_pedestal_2scene: 0.0,
    attenuation_linear: 0.0,
    attenuation_quadratic: 0.0,
    ambient_intensity: 0.0,
    current_vs: LambertVS,
    current_fs: GoureauFS,
    fs_list: [GoureauFS, PhongFS, ToonShadingFS],
    fs_ind: 0,
    vs_list: [LambertVS, PhongVS, BlinnPhongVS],
    vs_ind: 0,
}

function initWebGL(canvas) {
    gl = null
    const names = ["webgl2", "webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    for (let ii = 0; ii < names.length; ++ii) {
        try {
            gl = canvas.getContext(names[ii]);
        } catch (e) {
        }
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


    const buffers = initBuffers(gl);

    window.addEventListener("keydown", checkKeyPressed);

    function render() {

        let shaderProgram = initShaderProgram(gl, controls.current_vs, controls.current_fs);

        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition:
                    gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                vertexNormal:
                    gl.getAttribLocation(shaderProgram, "aVertexNormal"),
                vertexColor:
                    gl.getAttribLocation(shaderProgram, "aVertexColor"),
            },
            uniformLocations: {
                projectionMatrix:
                    gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                modelViewMatrix:
                    gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                normalMatrix:
                    gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
                lightPosition:
                    gl.getUniformLocation(shaderProgram, "uLightPosition"),
                ambientLightColor:
                    gl.getUniformLocation(shaderProgram, "uAmbientLightColor"),
                diffuseLightColor:
                    gl.getUniformLocation(shaderProgram, "uDiffuseLightColor"),
                specularLightColor:
                    gl.getUniformLocation(shaderProgram, "uSpecularLightColor"),
                attenuationLinear:
                    gl.getUniformLocation(shaderProgram, "uAttenuationLinear"),
                attenuationQuadratic:
                    gl.getUniformLocation(shaderProgram, "uAttenuationQuadratic"),
                ambientIntensity:
                    gl.getUniformLocation(shaderProgram, "uAmbientIntensity"),
            },
        };


        if (shaderProgram) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.clearDepth(1.0);
            let colorBuffer = initColorBuffer(gl, [1.0, 0.85, 0.0, 1.0]);
            drawCube(gl, programInfo, buffers, colorBuffer, "gold1", controls);
            drawCube(gl, programInfo, buffers, colorBuffer, "gold2", controls);
            colorBuffer = initColorBuffer(gl, [0.75, 0.75, 0.75, 1.0]);
            drawCube(gl, programInfo, buffers, colorBuffer, "silver", controls);
            colorBuffer = initColorBuffer(gl, [0.8, 0.5, 0.2, 1.0]);
            drawCube(gl, programInfo, buffers, colorBuffer, "bronze", controls);
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

function shader2string(shader) {
    switch (shader) {
        case PhongVS:
            return "Phong"
        case LambertVS:
            return "Lambert"
        case BlinnPhongVS:
            return "Blinn-Phong"
        case PhongFS:
            return "Phong"
        case GoureauFS:
            return "Goureau"
        case ToonShadingFS:
            return "Toon Shading"
    }
}

function checkKeyPressed(e) {


    if (e.key === "b") {
        controls.current_rotator = "bronze";
        horizontalCtrl.innerText = "Rotation Controller: Bronze pedestal"
    }

    if (e.key === "g") {
        controls.current_rotator = "gold";
        horizontalCtrl.innerText = "Rotation Controller: Gold pedestal"
    }

    if (e.key === "s") {
        controls.current_rotator = "silver";
        horizontalCtrl.innerText = "Rotation Controller: Silver pedestal"
    }

    if (e.key === "p") {
        controls.current_rotator = "pedestal";
        horizontalCtrl.innerText = "Rotation Controller: All pedestals"
    }

    if (e.key === "c") {
        controls.current_rotator = "center";
        horizontalCtrl.innerText = "Rotation Controller: Around center"
    }

    if (e.key === "f") {
        controls.current_fs = controls.fs_list[++controls.fs_ind % controls.fs_list.length];
        textShade.innerText = "Shading Model: " + shader2string(controls.fs_list[controls.fs_ind % controls.fs_list.length]);
    }

    if (e.key === "v") {
        controls.current_vs = controls.vs_list[++controls.vs_ind % controls.vs_list.length];
        textLight.innerText = "Light Model: " + shader2string(controls.vs_list[controls.vs_ind % controls.vs_list.length]);
    }
    if (e.key === "1") {
        controls.current_controller = "lin";
        verticalCtrl.innerText = "Adjustment Controller: Linear attenuation"
    }

    if (e.key === "2") {
        controls.current_controller = "quad";
        verticalCtrl.innerText = "Adjustment Controller: Quadratic attenuation"
    }

    if (e.key === "3") {
        controls.current_controller = "ambient";
        verticalCtrl.innerText = "Adjustment Controller: Ambient light"
    }


    if (e.key === "ArrowLeft") {
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

    if (e.key === "ArrowRight") {
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

    if (e.key === "ArrowDown") {
        switch (controls.current_controller) {
            case "lin":
                controls.attenuation_linear -= 0.1;
                break;
            case "quad":
                controls.attenuation_quadratic -= 0.1;
                break;
            case "ambient":
                controls.ambient_intensity += 0.1;
                break;
        }
    }

    if (e.key === "ArrowUp") {
        switch (controls.current_controller) {
            case "lin":
                controls.attenuation_linear += 0.1;
                break;
            case "quad":
                controls.attenuation_quadratic += 0.1;
                break;
            case "ambient":
                controls.ambient_intensity -= 0.1;
                break;
        }
    }

}

main();

