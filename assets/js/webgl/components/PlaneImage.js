import * as THREE from "three"
import fragmentShader from "../shaders/plane/image/frag.glsl"
import vertexShader from "../shaders/plane/image/vert.glsl"

export default class PlaneImage {

  constructor({scene, texture}){

    // props
    this.scene = scene
    this.texture = texture

    this.isPlaneImage = true
  }

  initMesh(){
    this.plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        uMap: { value: this.texture },
        uOpacity: { value: 1 }
      },
      transparent: true,
    }))
  }

  init(){
    this.initMesh()
    this.scene.add(this.plane)
  }


  get ratio(){
    return (this.texture.image.naturalWidth / this.texture.image.naturalHeight)
  }

}