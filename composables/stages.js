import gsap from "gsap"
import emitter from "tiny-emitter/instance"
import { MENU_CLICK } from "~/assets/js/utils/events"


// states
export const useStageHtmlIndex = () => useState("stageHtmlIndex", () => 0)
export const useIsInHtml = () => useState("inInHtml", () => false)

// utils
export const useStageBehaviors = function({
  props, root, mask, content, 
  onEntering, onEntered,
  onLeaving, onLeft,
}){

  // utils
  const handleAnimateEnter = () => {

    const rootEl = toValue(root)
    const maskEl = toValue(mask)
    const contentEl = toValue(content)

    const tl = gsap.timeline({
      onStart: () => {
        // rootEl.style.zIndex = "2"
        rootEl.style.pointerEvents = "none"
        if(onEntering){
          onEntering()
        }
      }
    })

    tl.add(gsap.delayedCall(1, () => {
      // rootEl.style.zIndex = ""
      rootEl.style.pointerEvents = ""
      if(onEntered){
        onEntered()
      }
    }))

    // tl.fromTo(maskEl, {
    //   scale: 0
    // }, {
    //   scale: 1,
    //   duration: 1,
    //   ease: "power3.inOut",
    //   clearProps: true,
    //   onComplete: () => {
    //     rootEl.style.zIndex = ""
    //     rootEl.style.pointerEvents = ""
    //     if(onEntered){
    //       onEntered()
    //     }
    //   }
    // })

    tl.from(contentEl, {
      alpha: 0,
      duration: 1,
      ease: "power3.out"
    })
  }
  const handleAnimateExit = () => {

    const rootEl = toValue(root)
    
    rootEl.style.pointerEvents = "none"

    if(onLeaving){
      onLeaving()
    }

    gsap.delayedCall(1, () => {
      // console.log("delated exit", root.value.id)
      rootEl.style.pointerEvents = "none"
      rootEl.style.opacity = '0'

      if(onLeft){
        onLeft()
      }
    })
  }

  // events
  const onMenuClick = opened => {
    gsap.to(toValue(content), {
      duration: 1.5,
      ease: "power3.inOut",
      scale: opened ? 0.8 : 1
    })
  }
  emitter.on(MENU_CLICK, onMenuClick)


  // hooks

  onMounted(() => {
    if(!props.active){
      // console.log("mounted", root.value.id)
      toValue(root).style.opacity = 0
    }
  })

  watch(() => props.active, (next, prev) => {
    if(next){
      toValue(root).style.opacity = '1'

      if(toValue(content)){
        handleAnimateEnter()
      }
    } else {
      handleAnimateExit()
    }
  })
}

