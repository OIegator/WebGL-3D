#version 300 es
#ifdef GL_ES
precision highp float;
#endif

in highp vec3 vLightDir;
in vec3 vNormal;
in vec4 vColor;
in vec3 vPosition;
in vec3 vCameraPosition;
in highp vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec3 uLightPosition;
uniform float uAttenuationLinear;
uniform float uAttenuationQuadratic;
uniform float uAmbientIntensity;
uniform vec3 uAmbientLightColor;
uniform vec3 uDiffuseLightColor;
uniform vec3 uSpecularLightColor;
out vec4 fragColor;

uniform sampler2D uSampler1;
uniform sampler2D uSampler2;

const float shininess = 32.0;

void main() {

    highp vec4 tColor1 = texture(uSampler1, vTextureCoord);
    highp vec4 tColor2 = texture(uSampler2, vTextureCoord);

    vec3 lightDirection = normalize(uLightPosition - vPosition);

    float diffuseLightDot = max(dot(vNormal, lightDirection), 0.0);

    float attenuation = 1.0 / (1.0 + uAttenuationLinear * length(lightDirection) +
    uAttenuationQuadratic * length(lightDirection) * length(lightDirection));

    vec3 diffuse = uDiffuseLightColor * diffuseLightDot;

    vec3 specular = uSpecularLightColor * pow(max(dot(normalize(reflect(-normalize(uLightPosition - vPosition), normalize(vNormal))), normalize(-vPosition)), 0.0), shininess);
    vec3 vLightWeighting = uAmbientLightColor * uAmbientIntensity +
          (specular + diffuse) * attenuation;
    fragColor = ((1.0 - tColor2.a) * tColor1
                + tColor2.a * tColor2
                + 0.5 * vColor ) * vec4(vLightWeighting, 1);

    // Add cell shading
    if (fragColor.r > 0.8) {
        fragColor.rgb = fragColor.rgb;
    } else if (fragColor.r > 0.6) {
        fragColor.rgb = fragColor.rgb * 0.8;
    } else if (fragColor.r > 0.4) {
        fragColor.rgb = fragColor.rgb * 0.6;
    } else if (fragColor.r > 0.2) {
        fragColor.rgb = fragColor.rgb * 0.4;
    } else {
        fragColor.rgb = fragColor.rgb * 0.2;
    }
}


