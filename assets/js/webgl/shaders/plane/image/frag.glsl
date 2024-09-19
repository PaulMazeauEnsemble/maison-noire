precision highp float;

uniform sampler2D uMap;
uniform float uOpacity;

varying vec2 vUv;

void main() {
  vec4 color = texture2D(uMap, vUv);
  gl_FragColor = vec4(color.rgb, color.a * uOpacity);
}