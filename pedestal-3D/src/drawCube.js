import * as glm from "gl-matrix";
function drawCube(gl, programInfo, buffers, colorBuffer, cube_type, controls) {

    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = glm.mat4.create();

    glm.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const modelViewMatrix = glm.mat4.create();

    switch (cube_type) {
        case "gold1":
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, -1.0, -15]);
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, controls.rotation_angle_pedestal_2scene, [0, 1, 0]);
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [5.0, 0.0, 0.0]);
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, controls.rotation_angle_gold + controls.rotation_angle_pedestal_2itself, [0, 1, 0]);
            break;
        case "gold2":
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 1.0, -15]);
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, controls.rotation_angle_pedestal_2scene, [0, 1, 0]);
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [5.0, 0.0, 0.0]);
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, controls.rotation_angle_gold + controls.rotation_angle_pedestal_2itself, [0, 1, 0]);
            break;
        case "silver":
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, -1.0, -15]);
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, controls.rotation_angle_pedestal_2scene, [0, 1, 0]);
            // Translate the cube to the center of rotation
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [5.0, 0, 0]);

            // Rotate the cube around its center
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, controls.rotation_angle_pedestal_2itself, [0, 1, 0]);

            // Translate the cube back to its original position
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [-3.0, 0.0, 0.0]);
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, controls.rotation_angle_silver, [0, 1, 0]);
            break;
        case "bronze":
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, -1.0, -15]);
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, controls.rotation_angle_pedestal_2scene, [0, 1, 0]);

            // Translate the cube to the center of rotation
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [5.0, 0.0, 0.0]);

            // Rotate the cube around its center
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, controls.rotation_angle_pedestal_2itself, [0, 1, 0]);

            // Translate the cube back to its original position
            glm.mat4.translate(modelViewMatrix, modelViewMatrix, [3.0, 0.0, 0.0]);
            glm.mat4.rotate(modelViewMatrix, modelViewMatrix, controls.rotation_angle_bronze, [0, 1, 0]);
            break;
    }

    const normalMatrix = glm.mat4.create();
    glm.mat4.invert(normalMatrix, modelViewMatrix);
    glm.mat4.transpose(normalMatrix, normalMatrix);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    setPositionAttribute(gl, buffers, programInfo);

    setColorAttribute(gl, colorBuffer, programInfo);

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    setNormalAttribute(gl, buffers, programInfo);

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix
    );

    gl.uniform1f(
        programInfo.uniformLocations.attenuationLinear,
        controls.attenuation_linear);

    gl.uniform1f(
        programInfo.uniformLocations.attenuationQuadratic,
        controls.attenuation_quadratic);

    gl.uniform1f(
        programInfo.uniformLocations.ambientIntensity,
        controls.ambient_intensity);

    const lightPositionValue = [0, 0, 5];

    gl.uniform3fv(
        programInfo.uniformLocations.lightPosition,
        lightPositionValue
    );

    gl.uniform3fv(
        programInfo.uniformLocations.ambientLightColor,
        [0.1, 0.1, 0.1]
    );

    gl.uniform3fv(
        programInfo.uniformLocations.diffuseLightColor,
        [0.7, 0.7, 0.7]
    );

    gl.uniform3fv(
        programInfo.uniformLocations.specularLightColor,
        [1.0, 1.0, 1.0]
    );
    {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl, buffers, programInfo) {
    const numComponents = 3;
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

// Tell WebGL how to pull out the colors from the color buffer
// into the vertexColor attribute.
function setColorAttribute(gl, colorBuffer, programInfo) {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

// Tell WebGL how to pull out the normals from
// the normal buffer into the vertexNormal attribute.
function setNormalAttribute(gl, buffers, programInfo) {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}

export { drawCube };