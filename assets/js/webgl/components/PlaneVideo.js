import * as THREE from "three"
import PlaneImage from "./PlaneImage"

import fragmentShader from "../shaders/plane/video/frag.glsl"
import vertexShader from "../shaders/plane/video/vert.glsl"
import gsap from "gsap"
import AssetsManager from "../../utils/AssetsManager"
import { useBrowser } from '~/composables/states'
export default class PlaneVideo extends PlaneImage {

  constructor(props){
    super(props)

    this._ratio = 1
    this.isPlaneVideo = true
    this.isLazyLoading = false
    this.specialShape = props.specialShape
    this.getSize = props.getSize

    this.browser = useBrowser()
  }

  initMesh(){
    this.plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      defines: {
        SPECIAL_SHAPE: !!this.specialShape
      },
      uniforms: {
        uMap: { value: this.texture },
        uOpacity: { value: 1 },
        uLazyLoaded: { value: 0 },
        uPlaneRatio: { value: this.ratio },
        uGateRatio: { value: 512/702 },
        uGateTexture: { value: !!this.specialShape ? AssetsManager.textures.gate512 : null}
      },
      transparent: true,
    }))
  }

  // helpers
  hasBeenLoaded(){
    return this.plane.material.uniforms.uLazyLoaded.value > 0
  }

  get ratio(){
    return this._ratio
  }

  setSize(){
    this._ratio = this.texture.image.videoWidth / this.texture.image.videoHeight
    const size = this.getSize(this._ratio)
    this.plane.scale.y = 1 / this._ratio
    this.plane.scale.multiplyScalar(size)
    this.plane.material.uniforms.uPlaneRatio.value = this.ratio
  }

  load(cb){

    // console.log("will load", this.texture.image.dataset.src.split('/').pop()
    this.texture.image.addEventListener("canplay", () => {
      this.setSize()
      gsap.to(this.plane.material.uniforms.uLazyLoaded, {
        value: 1,
        duration: 1.2,
        ease: "power3.out",
      })
      cb()
    }, {once: true})

    this.texture.image.src = this.texture.image.dataset.src
  }

  // core
  play(){

    if(!this.texture.image.paused) return;

    if(!this.hasBeenLoaded() && !this.isLazyLoading){

      // not lazy
      if(this.texture.image.src){
        this.setSize()
        this.plane.material.uniforms.uLazyLoaded.value = 1
        this.texture.image.play()
      } else {
        this.isLazyLoading = true
        this.load(() => {
          this.texture.image.play().catch(err => {
            console.log("can not lazy play", err)
          })
        })
      }
    } else {
      this.texture.image.play()
    }

  }

  pause(){
    if(this.texture.image.paused) return;
    this.texture.image.pause()
  }

}