<template>
<div ref="scrollWrapper" class="c-scroll-wrapper c-noscrollbar">

  <div :class="['c-scroll-bar', {hidden: menuOpened}]">
    <div :style="scrollbarStyle" class="c-scroll-bar-content"></div>
  </div>

  <div ref="scrollContainer" class="c-scroll-container">

    <!-- Start -->
    <div v-if="startExists" ref="scrollOverlayStart" class="c-scroll-overlay start"></div>
    <div v-if="startExists" ref="scrollStart" class="c-scroll-start"></div>

    <slot></slot>

    <!-- End -->
    <div v-if="endExists" ref="scrollEnd" class="c-scroll-end"></div>
    <div v-if="endExists" ref="scrollOverlayEnd" class="c-scroll-overlay end"></div>
  </div>
</div>
</template>

<script setup>

  import gsap from "gsap"
  import Lenis from '@studio-freight/lenis'

  const props = defineProps(['start', 'end', 'locked', 'wheelMultiplier'])
  const emit = defineEmits(['init', 'reached-start', 'reached-end'])

  // others
  let lenis = null

  const startLenis = () => {
    if(lenis && lenis.isStopped){
      lenis.start()
      lenis.scrollTo(scrollStart.value.clientHeight, {immediate: true, force: true})
      // console.log('start at', scrollStart.value.clientHeight)
    }
  }
  const stopLenis = () => {
    if(lenis && !lenis.isStopped){
      lenis.stop()
    }
  }

  const scrollToEnd = e => {
    const endProgress = 1 - Math.min(1, (e.limit - e.animatedScroll) / scrollEnd.value.clientHeight)
    const threshold = 0.01

    scrollOverlayEnd.value.style.opacity = endProgress

    if(!props.locked && endProgress > 1 - threshold){
      emit('reached-end')
      // stopLenis()
    }
  }

  const scrollToStart = e => {
    const startProgress = 1 - Math.min(1, (e.animatedScroll / scrollStart.value.clientHeight))
    const threshold = 0.01

    // console.log("startProgress", e.animatedScroll , scrollStart.value.clientHeight)

    scrollOverlayStart.value.style.opacity = startProgress

    if(!props.locked && startProgress > 1 - threshold){
      emit("reached-start")
      // stopLenis()
    }
  }
  
  // states
  const scrollWrapper = ref(null)
  const scrollContainer = ref(null)

  const scrollEnd = ref(null)
  const scrollStart = ref(null)
  const scrollOverlayStart = ref(null)
  const scrollOverlayEnd = ref(null)
  const scrollbarStyle = ref({transform: 'scaleY(0)'})
  const menuOpened = useMenuOpened()

  // computed
  const startExists = computed(() => typeof props.start !== "undefined")
  const endExists = computed(() => typeof props.end !== "undefined")

  // hooks
  onMounted(() => {
    lenis = new Lenis({
      wrapper: scrollWrapper.value,
      content: scrollContainer.value,
      wheelMultiplier: props.wheelMultiplier
    })
    gsap.ticker.add(time => {
      lenis.raf(time * 1000)
    })
    lenis.stop()
    lenis.on("scroll", e => {


      scrollbarStyle.value = {transform: `scaleY(${e.progress})`}

      if(startExists.value){
        scrollToStart(e)
      }
      if(endExists.value){
        scrollToEnd(e)
      }
    })

    emit('init', {startLenis, stopLenis})
  })

  onUnmounted(() => {
    if (lenis) {
      lenis.destroy()
      lenis = null
    }
    gsap.ticker.remove(time => {
      lenis.raf(time * 1000)
    })
  })
</script>


<style lang="scss" scoped>
  .c-scroll{
    &-wrapper{
      overflow: auto;
      height: 100%;
      position: relative;
    }

    &-start{
      height: desktop-vw(540);
      // border: 3px dotted green;
    }
    &-end{
      height: desktop-vw(540);
      // border: 3px dotted red;
    }
    &-overlay{
      @include absolute-full;
      position: fixed;
      z-index: 1;
      pointer-events: none;
      opacity: 0;

      &.start{
        // background-color: green!important;
      }

      &.end{
        // background-color: red!important;
      }
    }

    &-bar{
      width: 7px;
      position: fixed;
      right: 0;
      top: 0;
      height: var(--100sh);
      z-index: 1;
      transition: opacity ease 400ms;
      transition-delay: 1.3s;
      &.hidden{
        opacity: 0;
        transition-delay: 0s;
      }

      &-content{
        width: 100%;
        height: 100%;
        background-color: #000000;
        transform: scaleY(0);
        transform-origin: top;
      }
    }

    @include mobile(){
     &-start, &-end{
      height: mobile-vw(420);
     } 
    }
  }
</style>