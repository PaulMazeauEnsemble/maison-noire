import * as THREE from 'three'
import { isMobile, retrieveSceneElements } from '../../utils/utils'
import { createScene, showGridHelper } from '../../utils/webgl'
import fragmentShader from "../shaders/background/frag.glsl"
import vertexShader from "../shaders/background/vert.glsl"
import Stage from "./Stage"


export default class Stage3D extends Stage {

  constructor(props){
    super(props)
    const {renderer, assets, cms, sceneList, startOffset, gradient} = props

    // props
    this.scene = new THREE.Scene()
    this.renderer = renderer
    this.assets = assets
    this.cms = cms
    this.startOffset = startOffset
    this.gradient = gradient ? gradient : {
      color_1_start: '#9F9F9F',
      color_2_start: '#3A3A3A',
      color_3_start: '#9F9F9F',
      color_1_end: '#4B4B4B',
      color_2_end: '#000000',
      color_3_end: '#4B4B4B',
    }

    // data
    this.sceneElements = []

    this.camera = new THREE.PerspectiveCamera( isMobile() ? 70 : 60, window.innerWidth / window.innerHeight, 0.1, 100 )
    this.camera.position.z = typeof startOffset !== "undefined" ? 10 : 0

    this.dpr = this.renderer.getPixelRatio()
    // this.dpr = 1
    this.rt = new THREE.WebGLRenderTarget(this.dpr * window.innerWidth, this.dpr * window.innerHeight)
    this.end = {
      position: -Infinity,
      threshold: 10,
      smooth: 0.1
    }
    this.visibilityOptions = {
      tooFar: -52,
      farFogLength: 15,

      tooClose: -8,
      nearFogLength: 5,

    }

    this.sceneList = sceneList
    this.startOffset = startOffset ? startOffset : 0

    this.autoInit()
  }

  resetCameraPosition(){
    this.camera.position.z = typeof this.startOffset !== "undefined" ? 10 : 0
  }

  createBackground(){

    this.quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2, 1, 1),
      new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uSeed: { value: this.uid },
          uBackgroundProgress: { value: 0 },
          uControlsOffset: { value: [0, 0] },

          uColorStart1: { value: new THREE.Color(this.gradient.color_1_start) },
          uColorEnd1: { value: new THREE.Color(this.gradient.color_1_end) },

          uColorStart2: { value: new THREE.Color(this.gradient.color_2_start) },
          uColorEnd2: { value: new THREE.Color(this.gradient.color_2_end) },

          uColorStart3: { value: new THREE.Color(this.gradient.color_3_start) },
          uColorEnd3: { value: new THREE.Color(this.gradient.color_3_end) },
        }
      })
    )

    this.scene.add(this.quad)
    this.quad.position.z = -1

    this.quadCamera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 )
  }

  moveCamera(z){
    this.camera.position.z = z
    this.quad.position.z = this.camera.position.z - 1
  }

  handleLazyLoadVideos(){

    let arr = this.sceneElements
    for(let i = 0; i < arr.length; i++){
      if(arr[i].userData.element && arr[i].userData.element.isPlaneVideo){
        const opacity = arr[i].userData.getOpacity()
        if(opacity > 0){
          arr[i].userData.element.play()
        } else {
          arr[i].userData.element.pause()
        }

      }
    }
  }

  handleMeshesVisibility(){
    
    // return;

    let arr = this.sceneElements

    for(let i = 0; i < arr.length; i++){
      let child = arr[i]
      if(child.isMesh){
        const camera2ChildZ = child.position.z - this.camera.position.z
        const near = child.userData.near ? child.userData.near : this.visibilityOptions.tooClose
        const nearLength = child.userData.nearLength ? child.userData.nearLength : this.visibilityOptions.nearFogLength

        if(camera2ChildZ < this.visibilityOptions.tooFar){
          child.userData.setOpacity(0)
        } 
        else if(camera2ChildZ < near){
          child.userData.setOpacity(THREE.MathUtils.mapLinear(camera2ChildZ, this.visibilityOptions.tooFar, this.visibilityOptions.tooFar + this.visibilityOptions.farFogLength, 0, 1))
          child.userData.setOpacity(THREE.MathUtils.clamp(child.userData.getOpacity(), 0, 1))
        } 
        else if(camera2ChildZ < 0) {
          child.userData.setOpacity(THREE.MathUtils.mapLinear(camera2ChildZ, near, near + nearLength, 1, 0))
          child.userData.setOpacity(THREE.MathUtils.clamp(child.userData.getOpacity(), 0, 1))
        } else {
          child.userData.setOpacity(0)
        }
      }
    }
  }
  
  render(inBuffer = true){
    this.renderer.setRenderTarget(this.rt)
    this.renderer.clear()

    // this.renderer.render(this.quad, this.quadCamera)
    this.renderer.render(this.scene, this.camera)

    this.renderer.setRenderTarget(null)
  }

  update(time, delta){
    this.quad.material.uniforms.uTime.value = time
    this.quad.material.uniforms.uBackgroundProgress.value = Math.abs(this.camera.position.z / this.end.position)

    this.handleLazyLoadVideos()
    this.handleMeshesVisibility()
  }

  autoInit(){

    this.createBackground()
    const elements = retrieveSceneElements(this.sceneList).filter(el => el.mesh_type !== 'text')
    this.createdElements = createScene({elements, stage: this, startOffset: this.startOffset})
    this.cameraTarget = new THREE.Vector3(0, 0, this.end.position)
    // showGridHelper({stage: this})
  }

  onResize(){
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.rt.setSize(this.dpr * window.innerWidth, this.dpr * window.innerHeight)
  }

  getPortalPercent(){
    const threshold2Camera = (this.end.position + this.end.threshold) - this.camera.position.z
    const percent = THREE.MathUtils.clamp(threshold2Camera / this.end.threshold, 0, 1)
    return percent
  }

  getTexture(){
    return this.rt.texture
  }

  destroy(){
    this.quad.geometry.dispose()
    this.quad.material.dispose()
    this.rt.dispose()

    this.scene.traverse(c => {
      if(c.isMesh){
        c.material.dispose()
      }
    })
  }

}