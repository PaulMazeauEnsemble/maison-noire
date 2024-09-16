import * as THREE from "three"

export default class WebglCore {

  constructor({canvas}){
    this.canvas = canvas

    this.autoInit()
  }
  autoInit(){

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      canvas: this.canvas.value,
    });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    // this.renderer.setPixelRatio(1)
    this.renderer.autoClear = false

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.classList.add("webgl-canvas")
    document.body.appendChild(this.renderer.domElement);
  }

}