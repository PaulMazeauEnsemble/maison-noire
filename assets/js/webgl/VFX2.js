import * as THREE from "three"
import { isMobile } from "../utils/utils"
import { BlendFunction, CopyPass, EffectComposer, EffectPass, FXAAEffect, RenderPass, ShaderPass } from "postprocessing"
// import { BlendShader } from "three/examples/jsm/shaders/BlendShader"



export default class VFX2 {

  constructor({renderer, scene, camera}){
    // props
    this.renderer = renderer
    this.scene = scene
    this.camera = camera

    // privates
    this.isMobile = isMobile()
    
    this.autoInit()
  }

  autoInit(){
    
    // composer
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(new EffectPass(this.camera, new FXAAEffect({})))
  }
  
  render(velocity){
    this.composer.render()
  }

  onResize(){
    const width = window.innerWidth
    const height = window.innerHeight
    this.composer.setSize(width, height)
  }

}