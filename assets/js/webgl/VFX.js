import * as THREE from "three"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass.js';
import { BlendShader } from 'three/examples/jsm/shaders/BlendShader';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { isMobile } from "../utils/utils"
export default class VFX {

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

    const width = window.innerWidth
    const height = window.innerHeight

    const renderTargetParameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
    }
    
    // composer
    this.composer = new EffectComposer(this.renderer)
    this.composer.setSize(width, height)

    // passes
    this.passes = {render: null, save: null, blend: null, output: null}
    this.passes.first = new RenderPass(this.scene, this.camera, undefined, undefined, false)
    this.passes.save = new SavePass(new THREE.WebGLRenderTarget(width, height, renderTargetParameters))
    this.passes.blend = new ShaderPass(BlendShader, 'tDiffuse1')
    this.passes.blend.uniforms["tDiffuse2"].value = this.passes.save.renderTarget.texture
    this.passes.blend.uniforms["mixRatio"].value = 0.7
    this.passes.output = new ShaderPass(CopyShader)
    this.passes.output.renderToScreen = true

    // composer
    this.composer.addPass(this.passes.first)
    this.composer.addPass(this.passes.blend)
    this.composer.addPass(this.passes.save)
    this.composer.addPass(this.passes.output)

  }
  
  render(velocity){

    let velocityMix = (this.isMobile ? 0.2 : 1.0) * velocity


    velocityMix = THREE.MathUtils.mapLinear(velocity, 0.35, 1.5, 0, 0.7)
    velocityMix = THREE.MathUtils.clamp(velocityMix, 0, 0.7)

    // fix freeze
    if(velocity > 200){
      velocityMix *= 0.5
    }
    
    this.passes.blend.uniforms["mixRatio"].value = velocityMix
    this.composer.render()
  }

  onResize(){
    const width = window.innerWidth
    const height = window.innerHeight
    this.composer.setSize(width, height)
  }

}