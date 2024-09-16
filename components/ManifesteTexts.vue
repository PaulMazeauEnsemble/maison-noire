<template>
  <div :class="['container', {visible: !menuOpened && !isInHtml}]">
    <!-- <p class="foo">{{ manifestePortalProgress }}</p> -->
    <div :class="['container__wrapper', {started}]">
      <div 
        :class="['container__item', {visible: !menuOpened && textVisibilities[textIndex]}]"
        v-for="(text, textIndex) in texts"
        :key="text.value"
        :style="{'--dlen': `${text.dlen}`, '--mlen': `${text.mlen}`}"
      >
        <span ref="itemSpan">{{ text.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>

import { withLoader } from "~/assets/js/utils/commons"
import { onBeforeUnmount } from 'vue'
import { MathUtils } from "three"
import gsap from 'gsap'
import { inject, watch } from 'vue'

const cms = useCMS()
const texts = computed(() => cms.value.manifeste.scenes.map(scene => ({
  value: scene.fixed_text,
  dlen: scene.text_box_size,
  mlen: scene.text_box_size_mobile,
})))
const textVisibilities = ref([])

const manifesteIndex = useManifesteIndex()
const itemSpan = ref()
const menuOpened = useMenuOpened()
const isInHtml = useIsInHtml()
const started = ref(false)
const manifestePortalProgress = useManifestePortalProgress()
const loaderCompleted = useLoaderCompleted()
const isAppPaused = inject('isAppPaused')

const handleShow = index => {
  if (isAppPaused.value) return;
  const span = itemSpan.value[index]

  if(!span) return;

  textVisibilities.value = texts.value.map((v, vIndex) => vIndex === index ? true : false)

  gsap.fromTo(span, {
    autoAlpha: 0
  }, {
    autoAlpha: 1,
    duration: 0.3,
    delay: 0.2,
    ease: "power2.out",
  })
}

const handleHide = (index, animate = true) => {
  if (isAppPaused.value) return;
  const span = itemSpan.value[index]

  if(!span) return;

  textVisibilities.value = texts.value.map((v, vIndex) => false)

  gsap.to(span, {
    autoAlpha: 0,
    duration: animate ? 0.3 : 0,
    ease: "power2.out",
    overwrite: true
  })
}

watch(manifestePortalProgress, (next, prev) => {

  // console.log("p progress", next, manifesteIndex.value)

  if(next > 0 && textVisibilities.value[manifesteIndex.value]){
    handleHide(manifesteIndex.value)
    // console.log("hide him", manifesteIndex.value, next)
  } else if(prev !== 0 && next === 0 && !textVisibilities.value[manifesteIndex.value]){
    // console.log("show it", manifesteIndex.value)
    handleShow(manifesteIndex.value)
  }
})

watch(manifesteIndex, (nextIndex, prevIndex) => {

  // console.log("index", nextIndex)

  if(textVisibilities.value[prevIndex]){
    handleHide(prevIndex)
  }

  if(!textVisibilities.value[nextIndex] && manifestePortalProgress.value <= 0){
    // console.log("reachde next index without showing it", nextIndex)
    handleShow(nextIndex)
  }  
})

watch(loaderCompleted, () => {
  if(loaderCompleted.value){
    setTimeout(() => {
      handleShow(0)
    }, (2.4 + 2 * 0.25) * 1000) // duration linked to loader animation end (see Navigation.js > start())
  }
})

onMounted(() => {

  textVisibilities.value = texts.value.map(v => false)

  // hide all
  for(let i = 0; i < itemSpan.value.length; i++){
    handleHide(i, false)
  }

  if(!withLoader){
    handleShow(0)
  }

  started.value = true

})

const killAllTweens = () => {
  itemSpan.value.forEach(span => {
    gsap.killTweensOf(span)
  })
}

watch(menuOpened, (isOpened) => {
  if (isOpened) {
    killAllTweens()
  }
})

watch(isInHtml, (inHtml) => {
  if (inHtml) {
    killAllTweens()
  }
})

watch(isAppPaused, (isPaused) => {
  if (isPaused) {
    killAllTweens()
  }
})

onBeforeUnmount(() => {
  killAllTweens()
})

</script>

<style lang="scss" scoped>
.container{
  @include absolute-full;
  opacity: 0;
  transition: opacity 400ms var(--o4);
  transition-delay: 500ms;
  pointer-events: none;
  z-index: 4;



  .foo{
    position: absolute;
    color: red;
  }

  &.visible{
    opacity: 1;
    transition-delay: 800ms;

    .container__item.visible{
      cursor: pointer;
      pointer-events: all;
    }
  }

  &__wrapper{
    @include hidden;
    &.started{
      @include visible;
    }
  }

  &__item{
    @include absolute-center;
    // @include hidden;
    width: calc(var(--dlen, 1) * 23vw);
    text-align: center;
    color: #FFF;
    font-size: desktop-vw(28);
    line-height: 1.2;
    user-select: none;
  }

  @include mobile(){
    &__item{
      font-size: mobile-vw(18);
      width: calc(var(--mlen, 1) * 50vw);
    }
  }
}
</style>