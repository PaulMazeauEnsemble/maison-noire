import emitter from "tiny-emitter/instance"
import { STAGE_HTML_PREV } from "~/assets/js/utils/events"
import { useIsInHtml } from "~/composables/stages"
import { isMobile } from "../../utils/utils"
import Stage from "./Stage"

export default class StageHTML extends Stage{

  constructor(props){
    super(props)
    const {handleBackward} = props
    
    // props
    this.handleBackward = handleBackward
    // data
    this.isHTML = true
    this.end = {
      position: -Infinity,
      threshold: 20,
      smooth: 0.1
    }
    this.dom = {
      el: document.getElementById("stages"),
    }
    this.isInHtml = useIsInHtml()

    // bind
    this.handleLeavingHTML = this.handleLeavingHTML.bind(this)
  }

  // public
  handleLeavingHTML(){
    this.handleBackward(isMobile() ? 30 : 20)
  }

  onEnterHTML(){
    emitter.on(STAGE_HTML_PREV, this.handleLeavingHTML)
    this.isInHtml.value = true    
  }
  onLeaveHTML(){
    this.isInHtml.value = false
    emitter.off(STAGE_HTML_PREV, this.handleLeavingHTML)
  }

  getPortalPercent(){
    return 0
  }

  getTexture(){
    return null
  }
}