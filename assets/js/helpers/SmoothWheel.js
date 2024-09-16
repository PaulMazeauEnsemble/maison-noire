import gsap from "gsap"
import VirtualScroll from "virtual-scroll"
import { MathUtils } from "three"

export default class SmoothWheel {
  constructor(){

    // class
    this.vs = new VirtualScroll({
      passive: true,
      touchMultiplier: 10
    })
    this.scroll = {
      last: 0,
      lerped: 0,
      speed: 0.1,

      smooth: 0.1,

      min: 0,
      max: 0,
      
    }
    this._on = {
      raf: null,
      wheel: null
    }
    this.canCapture = true

    // bind
    this._onWheel = this._onWheel.bind(this)
    this._onRaf = this._onRaf.bind(this)

    this.start()
  }

  // publics
  on(key, fn){
    this._on[key] = fn
  }
  setLimit(min = 0, max = 0){

    const prevPercent = this.scroll.min === 0 ? 0 : this.scroll.last / this.scroll.min

    // new limits
    this.scroll.min = min
    this.scroll.max = max
  
    // apply limit to last 
    this.scroll.last = this.scroll.min * prevPercent
    this.scroll.lerped = this.scroll.last
  }
  setLast(val, useLimit = true){
    this.scroll.last = val

    if(useLimit){
      this.scroll.last = MathUtils.clamp(this.scroll.last, this.scroll.min, this.scroll.max)
    }
  }

  // events
  _onWheel(event){

    if(!this.canCapture) return;

    this.scroll.last += event.deltaY * this.scroll.speed
    this.scroll.last = MathUtils.clamp(this.scroll.last, this.scroll.min, this.scroll.max)

    if(this._on.wheel){
      this._on.wheel(this.scroll)
    }
  }
  _onRaf(){
    this.scroll.lerped = MathUtils.lerp(this.scroll.lerped, this.scroll.last, this.scroll.smooth)
    
    if(this._on.raf){
      this._on.raf(this.scroll)
    }
  }

  // core
  start(){
    this.vs.on(this._onWheel)
    gsap.ticker.add(this._onRaf)
  }

  stop(){
    this.vs.off(this._onWheel)
    gsap.ticker.remove(this._onRaf)
  }

}