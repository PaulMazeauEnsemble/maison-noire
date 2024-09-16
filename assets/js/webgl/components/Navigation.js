import * as THREE from "three"
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass"
import VirtualScroll from 'virtual-scroll'
import emitter from "tiny-emitter/instance"
import mainFs from "../shaders/main/frag.glsl" 
import mainVs from "../shaders/main/vert.glsl" 
import { MENU_CLICK } from "../../utils/events"
import gsap from "gsap"
import StageHTML from "../stages/StageHTML"
import { withLoader } from "~/assets/js/utils/commons"
import CameraControls from "./CameraControls"
import { isMobile, onCompleteProgress } from "../../utils/utils"
import Stage3D from "../stages/Stage3D"
import VFX from "../VFX"
import VFX2 from "../VFX2"
export default class Navigation {
  
  constructor({renderer, assets, cms, store}){
    
    // props
    this.assets = assets
    this.cms = cms
    this.renderer = renderer
    this.store = store
    this.device = useNuxtApp().device

    // data
    this.current = null
    this.next = null
    this.SCROLL_SPEED = 1e-3
    this.scroll = {
      last: 0,
      current: 0,
      smooth: 0.05,
    }
    this.quickJumping = false
    this.canQuickJumping = false
    this.canWheel = false

    // binds
    this.onWheel = this.onWheel.bind(this)
    this.onMenuClick = this.onMenuClick.bind(this)
    this.handleForward = this.handleForward.bind(this)
    this.handleBackward = this.handleBackward.bind(this)
    this.onClickExperience = this.onClickExperience.bind(this)

    this.autoInit()

    // performance
    this.isActive = true;
    this.lastUpdateTime = 0;
    this.updateInterval = 1000 / 60; // 60 FPS par défaut

    // visibility
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  get index(){
    return this.store.manifesteIndex.value
  }

  autoInit(){

    if(!isMobile()){
      this.controls = new CameraControls()
    }

    // list
    this.list = [
      ...this.cms.manifeste.scenes.map((scene, index) => {
        return new Stage3D({startOffset: index === 0 ? 0 : -1.2, renderer: this.renderer, handleBackward: this.handleBackward, sceneList: this.cms.manifeste.scenes[index].list, gradient: scene.gradient})
      }),
      new StageHTML({renderer: this.renderer, handleBackward: this.handleBackward}),
    ]

    this.dpr = this.renderer.getPixelRatio()
    this.quad = new FullScreenQuad(new THREE.ShaderMaterial({
      fragmentShader: mainFs,
      vertexShader: mainVs,
      transparent: true,
      defines: {
        IS_MOBILE: isMobile()
      },
      uniforms: {
        uResolution: { value: [this.dpr * window.innerWidth, this.dpr * window.innerHeight] },

        uCurrent: { value: null },
        uCurrentHTML: { value: false},
        uNext: { value: null },
        uNextHTML: { value: false},

        uProgress: { value: 0 },

        uMenuProgress: { value: 0 },
        uStartProgress: { value: 0 },

        uStart1: { value: 0 },
        uStart2: { value: 0 },
        uStart3: { value: 0 },

        uDpr: { value: this.dpr }
      }
    }))
    
    // VFX
    this.vfxScene = new THREE.Scene()
    this.vfxScene.add(this.quad._mesh)
    this.vfxCamera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 )

    // this.vfx = new VFX2({
    //   renderer: this.renderer,
    //   scene: this.vfxScene,
    //   camera: this.vfxCamera
    // })

    this.vs = new VirtualScroll({
      passive: true,
      mouseMultiplier: 6,
      touchMultiplier: 70,
    })
    this.setScenes(this.list[this.store.manifesteIndex.value], this.list[this.store.manifesteIndex.value + 1])
    this.current.onOpened()

    emitter.on(MENU_CLICK, this.onMenuClick)
  
  }

  start(){
    this.vs.on(this.onWheel)

    document.documentElement.addEventListener("click", this.onClickExperience)      

    if(withLoader){

      const tl = gsap.timeline()

      tl.to([
        this.quad.material.uniforms.uStart1,
        this.quad.material.uniforms.uStart2,
        this.quad.material.uniforms.uStart3,
      ], {
        value: 1,
        duration: 1.4,
        stagger: 0.5,
        ease: "power3.out",
      })

      tl.to(this.quad.material.uniforms.uStartProgress, {
        value: 1,
        duration: 2,
        ease: "power3.out",
        // onStart(){
        //   console.log("START LAST")
        // },
        // onComplete(){
        //   console.log("END LAST")
        // },
        onUpdate: onCompleteProgress(0.7, () => {
          this.store.loaderHasAnimated.value = true
          this.canWheel = true
          this.canQuickJumping = true
        })
      }, ">-0.5")
    } else {
      this.quad.material.uniforms.uStartProgress.value = 1
      this.store.loaderHasAnimated.value = true
      this.canWheel = true
      this.canQuickJumping = true
    }

    // JUMP TO HTML
    // for(let i = 0; i < this.list.length - 1; i++){
    //   this.handleForward()
    // }
    
  }

  update(time, delta){

    if (!this.isActive) {
      return;
    }

    if (this.isAppPaused) {
      return;
    }

    const now = performance.now();
    if (now - this.lastUpdateTime < this.updateInterval) {
      return;
    }
    this.lastUpdateTime = now;

    let velocity = 0

    // avoid computations when we are seeing html stage
    if(!this.current.isHTML){
     
      // scroll
      const current = THREE.MathUtils.lerp(this.scroll.current, this.scroll.last, this.scroll.smooth)
      let _delta = current - this.scroll.current
      _delta = (_delta < 1e-7 && _delta > -(1e-7)) ? 0 : _delta

      // prendre en compte : menu opening + backward animation
      if(_delta === 0 && this.canWheel){
        _delta = -5e-3
      }

      this.scroll.current = current

      velocity = _delta
      
      // current scene camera
      if(!this.current.isHTML){
        this.current.moveCamera(this.current.camera.position.z + _delta)

        // not backward for first scene
        if(this.store.manifesteIndex.value === 0){
          this.current.moveCamera(Math.min(0, this.current.camera.position.z))
        }

        if(this.controls){
          this.controls.update(this.current)
        }
      }

      // animate
      if(this.quad.material.uniforms.uProgress.value < 1 && !this.current.isHTML){
        this.current.update(time, delta)
        this.current.render(true)
      }

      // quad
      if(this.next){

        if(this.quad.material.uniforms.uProgress.value > 0){

          if(!this.next.opened){
            this.next.onOpened()
          }
  
          if(!this.next.isHTML){
            if(this.controls){
              this.controls.update(this.next)
            }
            this.next.moveCamera(this.next.camera.position.z + _delta)
            this.next.update(time, delta)
            this.next.render(true)
          }
  
        } else if(this.next.opened){
          this.next.onClosed()
        }
      }

      this.handlePortalSwaping(_delta < 0 ? true : false) 

      this.quad.render(this.renderer)

    } else {
      if(this.quad.material.uniforms.uMenuProgress.value > 0){
        this.quad.render(this.renderer)
      }
    }

    // this.vfx.render(Math.abs(velocity))

  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.isActive = false;
      this.updateInterval = 1000 / 30; // Réduire à 30 FPS en arrière-plan
    } else {
      this.isActive = true;
      this.updateInterval = 1000 / 60; // Retour à 60 FPS lorsque actif
    }
  }

  handlePortalSwaping(isForward){

    // percent
    const percent = this.current.getPortalPercent()
    this.quad.material.uniforms.uProgress.value = percent
    this.store.manifestePortalProgress.value = percent
    this.store.manifesteCameraProgress.value = this.current ? this.current.camera.position.z / this.current.end.position : 0

    if(!this.current.isHTML){
      if(this.current.camera.position.z > 0 && this.store.manifesteIndex.value > 0 && !isForward){
        this.handleBackward()
      }
      else if(percent >= 1 && isForward && this.store.manifesteIndex.value < this.list.length - 1){
        this.handleForward()
      }
    } 
  }

  handleBackward(offset = null){
    this.quad.material.uniforms.uProgress.value = 1
  
    this.store.manifesteIndex.value += -1
    this.setScenes(this.list[this.store.manifesteIndex.value], this.list[this.store.manifesteIndex.value + 1])

    if(offset && this.current && !this.current.isHTML){
      this.canWheel = false
      gsap.to(this.current.camera.position, {
        z: "+=" + offset,
        duration: 1.5,
        ease: "power3.out",
        onUpdate: () => {
          this.current.camera.quad = this.current.camera.position.z - 1
        },
        onComplete: () => {
          this.canWheel = true
        }
      })
    }

  }

  handleForward(){
    if(!this.current.isHTML){
      this.current.moveCamera(this.current.end.position)
    }

    this.quad.material.uniforms.uProgress.value = 0

    // update index
    this.store.manifesteIndex.value += 1

    // swap scenes
    this.setScenes(this.list[this.store.manifesteIndex.value], this.store.manifesteIndex.value + 1 === this.list.length ? null : this.list[this.store.manifesteIndex.value + 1])
  }

  handleQuickJump(){

    if(this.quickJumping) return;

    if(this.current && !this.current.isHTML){
      this.quickJumping = true
      const distance = this.current.end.position - this.current.camera.position.z
      gsap.to(this.scroll, {
        last: `+=${distance * 1.05}`,
        duration: 1,
        ease: "none",
        onComplete: () => {
          this.quickJumping = false
        }
      })
    }
  }

  // events
  onClickExperience(event){

    if(!this.canQuickJumping) return;

    const clickOnExperience = !event.target.closest('.header')
    const inWebgl = this.current && !this.current.isHTML
    const menuClosed = this.quad.material.uniforms.uMenuProgress.value === 0

    if(clickOnExperience && inWebgl && menuClosed){
      // console.log("handleQuickJump")
      this.handleQuickJump()
    }
  }

  onWheel(event){

    if(!this.canWheel) return;
    if(this.current.isHTML) return;

    const exponentialVelocity = (1 + Math.abs(event.deltaY) * this.SCROLL_SPEED * 1e-1)
    this.scroll.last += event.deltaY * this.SCROLL_SPEED * exponentialVelocity
  }

  onMenuClick(state){

    if(state){
      this.canWheel = false
    }

    gsap.to(this.quad.material.uniforms.uMenuProgress, {
      value: state ? 1 : 0,
      duration: 1.5,
      ease: "power3.inOut",
      onUpdate: onCompleteProgress(0.7, () => {
        if(!state){
          this.canWheel = true
        }
      })
    })
  }

  // public
  setScenes(current, next){

    const prevs = [this.current, this.next].filter(f => f)
    const nexts = [current, next].filter(f => f)

    // states
    nexts.filter(s => !prevs.length || prevs.every(ps => ps.uid !== s.uid)).forEach(s => {
      s.onAttached()
    })

    prevs.filter(s => !nexts.length || nexts.every(ns => ns.uid !== s.uid)).forEach(s => {
      s.onDetached()
    })

    if(this.current && this.current.isHTML && current.uid !== this.current.uid){
      this.current.onLeaveHTML()
    }


    this.current = current
    this.next = next

    this.quad.material.uniforms.uCurrent.value = current.getTexture()
    this.quad.material.uniforms.uNext.value = next ? next.getTexture() : null

    this.quad.material.uniforms.uCurrentHTML.value = current.isHTML
    this.quad.material.uniforms.uNextHTML.value = next ? next.isHTML : false  

    // states
    if(current.isHTML){
      current.onEnterHTML()
      this.scroll.last = this.scroll.current
    }

    const time = gsap.ticker.time
    const delta = gsap.ticker.deltaRatio()

    if(this.next && !this.next.isHTML){
      this.next.update(time, delta)
      this.next.render(true)
    }

  }

  onResize(){
    this.quad.material.uniforms.uResolution.value[0] = this.dpr * window.innerWidth
    this.quad.material.uniforms.uResolution.value[1] = this.dpr * window.innerHeight

    if(!this.current.isHTML){
      this.current.onResize()
    }

    if(this.next && !this.next.isHTML){
      this.next.onResize()
    }

    if(this.vfx){
      this.vfx.onResize()
    }
  }

  destroy(){
    this.quad.dispose()
    this.current.destroy()

    if(this.next){
      this.next.destroy()
    }

    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

}