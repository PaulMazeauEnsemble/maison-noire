
uniform float uOpacity;
uniform sampler2D uMap;
uniform float uLazyLoaded;
uniform float uPlaneRatio;

#ifdef SPECIAL_SHAPE
uniform sampler2D uGateTexture;
uniform float uGateRatio;
#endif

varying vec2 vUv;


#define BLANK vec4(vec3(1.0), 0.0)

void main() {

  vec4 videoTexture = texture(uMap, vUv);

  gl_FragColor = mix(BLANK, videoTexture, uLazyLoaded);
  gl_FragColor.a *= uOpacity;

  #ifdef SPECIAL_SHAPE
      vec2 gate_uv = vUv;

    if(uPlaneRatio > uGateRatio){
      gate_uv.x *= uPlaneRatio / uGateRatio;
      gate_uv.x += -((uPlaneRatio / uGateRatio) - 1.0) / 2.0;
    } else {
      gate_uv.y *= uGateRatio / uPlaneRatio;
      gate_uv.y += -((uGateRatio / uPlaneRatio) - 1.0) / 2.0;
    }

    float mask = texture(uGateTexture, gate_uv).g;
    gl_FragColor.a *= mask;

  #endif

  // gl_FragColor = vec4(
  //   1.0, 1.0, 0.0,
  //   1.0
  // );

}