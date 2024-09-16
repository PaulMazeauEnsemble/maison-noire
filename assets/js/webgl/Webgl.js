import gsap from "gsap"
import * as THREE from "three"
import WebglCore from "./WebglCore"
import Navigation from "./components/Navigation"
import Stats from "../utils/Stats"
import BasicStats from "stats.js"

export default class Webgl {

  constructor({canvas, assets, cms, store}){

    // props
    this.canvas = canvas
    this.assets = assets
    this.cms = cms
    this.store = store

    // binds
    this.raf = this.raf.bind(this)
    this.onResize = this.onResize.bind(this)

    window.webgl = this

    this.autoInit()
  }

  autoInit(){
    this.core = new WebglCore({canvas: this.canvas})

    this.navigation = new Navigation({
      renderer: this.core.renderer,
      assets: this.assets,
      cms: this.cms,
      store: this.store
    })


    // this.stats = new Stats(true)
    // this.stats.showPanel(1)
    // document.body.appendChild(this.stats.dom)
    // this.stats.setRenderPanel(this.core.renderer.getContext())
  }

  start(){
    gsap.ticker.add(this.raf)
    window.addEventListener("resize", this.onResize)

    this.navigation.start()
  }

  pause() {
    // Arrêter les animations, les mises à jour, etc.
    this.renderer.setAnimationLoop(null)
    // Arrêter d'autres processus si nécessaire
  }

  resume() {
    // Reprendre les animations, les mises à jour, etc.
    this.renderer.setAnimationLoop(this.render.bind(this))
    // Reprendre d'autres processus si nécessaire
  }

  raf(time, delta){

    if(this.stats){
      this.stats.beforeRender()
      // this.stats.begin()
    }

    this.navigation.update(time, delta)

    if(this.stats){
      this.stats.afterRender()
      // this.stats.end()
    }
  }

  onResize(){
    this.core.renderer.setSize(window.innerWidth, window.innerHeight)
    this.navigation.onResize()
  }

  destroy(){
    this.core.renderer.dispose()
    this.navigation.destroy()
  }

  // utils
  isCurrentWebglStage(){
    return this.navigation.current && !this.navigation.current.isHTML
  }

}