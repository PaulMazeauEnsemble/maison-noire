
uniform float uTime;
uniform int uSeed;
uniform float uBackgroundProgress;
uniform vec2 uControlsOffset;

uniform vec3 uColorStart1;
uniform vec3 uColorEnd1;

uniform vec3 uColorStart2;
uniform vec3 uColorEnd2;

uniform vec3 uColorStart3;
uniform vec3 uColorEnd3;

varying vec2 vUv;


#define PI 3.14159265359
const highp float NOISE_GRANULARITY = 0.5/255.0;


#include /utils/snoise2.glsl;

highp float random(highp vec2 coords) {
   return fract(sin(dot(coords.xy, vec2(12.9898,78.233))) * 43758.5453);
}

vec2 rotate_uv(vec2 uv, float rotation){
    float mid = 0.5;
    return vec2(
        cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
        cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}

vec3 getGradientColor(vec2 point, vec2 gradientCenter, vec2 gradientSize, vec4 color1, vec4 color2, vec4 color3) {
    float dist = distance(point, gradientCenter) / max(gradientSize.x, gradientSize.y);
    
    if(dist <= color1.a){
        return color1.rgb;
    }
    else if (dist <= color2.a) {
        return mix(color1.rgb, color2.rgb, (dist - color1.a) / (color2.a - color1.a));
    } else if (dist <= color3.a) {
        return mix(color2.rgb, color3.rgb, (dist - color2.a) / (color3.a - color2.a));
    } else {
        return color3.rgb;
    }
}

vec3 simple_radial(vec2 pos, vec2 uv, vec3 color1, vec3 color2){
    float dist = distance(pos, uv);
    return mix(color1, color2,dist);
}

vec3 powVec3(vec3 vec, float powValue){
    return vec3(
        pow(vec.x, powValue),
        pow(vec.y, powValue),
        pow(vec.z, powValue)
    );
}

float cubicIn(float t) {
  return t * t * t;
}

void main() {
    gl_FragColor.a = 1.0;


    float time = uTime * 0.45;

    vec2 uv = vUv;

    vec2 gradient_uv = uv;
    gradient_uv.y += 0.1 * snoise2(vec2(6e-1 * uv.x, float(uSeed * 15) + time * 3e-1));
    gradient_uv.x += 0.12 * snoise2(vec2(1.12 + 6e-1 * uv.y, 3.541 + float(uSeed * 15) + time * 3e-1));

    vec2 gradientCenter = vec2(0.1, -0.2);
    // vec2 gradientCenter = vec2(0.5);
    gradientCenter.x += 0.3 * sin(2e-1 * time + float(uSeed + 7)) * (1.0 - uBackgroundProgress);
    gradientCenter.y += 0.3 * cos(2e-1 * time + float(uSeed + 7)) * (1.0 - uBackgroundProgress);

    vec2 gradientSize = vec2(2.3 * (sqrt(2.0) / 2.0));

    // colors
    vec4 color1 = vec4(mix(uColorStart1, uColorEnd1, uBackgroundProgress), 0.0);
    vec4 color2 = vec4(mix(uColorStart2, uColorEnd2, uBackgroundProgress), 0.5);
    vec4 color3 = vec4(mix(uColorStart3, uColorEnd3, uBackgroundProgress), 1.0);

    vec3 gradientColor = getGradientColor(gradient_uv, gradientCenter, gradientSize, color1, color2, color3);
    // gradientColor = powVec3(gradientColor, 1.0 + uBackgroundProgress * 0.4);

    // dithering to avoid banding
    gradientColor += mix(-NOISE_GRANULARITY, NOISE_GRANULARITY, random(uv));

    gl_FragColor.rgb = gradientColor;
}

// void main(){
//     gl_FragColor = vec4(vec3(1.0, 1.0, 0.0) * 0.15, 1.0);
// }