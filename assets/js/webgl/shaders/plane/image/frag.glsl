
uniform float uOpacity;
uniform sampler2D uMap;

varying vec2 vUv;


void main() {
  gl_FragColor = texture(uMap, vUv);
  gl_FragColor.a *= uOpacity;
}