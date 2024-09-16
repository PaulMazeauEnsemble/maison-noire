<template>
  <div v-if="gridStyle" ref="el" :class="['slider', {ios: ua.os.name === 'ios'}]">
     
    <!-- Client -->
    <div :class="['slider__client']" v-for="(client, cIndex) in clientsWithBatches" :key="cIndex">
      
      <!-- Batches -->
      <div 
        :class="['slider__client-grid', {visible: index === cIndex && (batchIndexes[cIndex][bIndex]), leaving: cIndex === indexLeaving && batchIndexes[cIndex][bIndex]}]" 
        v-for="(batch, bIndex) in client" 
        :key="bIndex"
        :data-grid="`${cIndex}-${bIndex}`"
        ref="grids"
      >
        
        <!-- Media -->
        <div 
          class="slider__client-grid-media" 
          v-for="(media, mIndex) in batch" 
          :key="mIndex"
          :style="gridStyle[cIndex][bIndex][mIndex]" 
          :data-col="gridStyle[cIndex][bIndex][mIndex].gridColumn" 
          :data-row="gridStyle[cIndex][bIndex][mIndex].gridRow"
          :data-portait="media.is_portrait ? 'true' : 'false'"
        >
          <div class="slider__client-grid-media-element">
            <div class="slider__client-grid-media-element-loader"></div>
            <img v-if="media.is_image" :src="getOptimizedUrl(media.asset, {width: 800})" alt="">
            <video v-else ref="video" playsInline :data-src="media.video" :data-src-low="media.video_low" :data-id="`${cIndex}-${bIndex}`" loop muted></video>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import chunk from "lodash/chunk"
import FastRandom from "fast-random"
import { isMobile, isDevMode, handleVideoLoader } from '~/assets/js/utils/utils'
import { oneImagePositions, twoImagesPositions } from "~/assets/js/utils/clients"

const LOW_DEFAULT = "https://player.vimeo.com/progressive_redirect/playback/840062340/rendition/360p/file.mp4?loc=external&log_user=0&signature=a0724e33e4484921cedade4e506f03f3b4bc9158aa3f89a1e68b25eee3a58191"

// states
const props = defineProps(['clients', 'index', 'indexLeaving', 'batchIndexes', 'state'])
const clientsWithBatches = computed(() => {
  return props.clients.map(c => chunk(c.images, 2))
})
const gridStyle = ref(null)
const el = ref(null)
const grids = ref(null)
const ua = useUA()
const gridVideos = computed(() => {
  let obj = {}

  // console.log("computing")

  if(grids.value){
    grids.value.forEach(el => {
      obj[el.dataset.grid] = el.querySelectorAll('video')
    })
  }

  return obj
})
const {device} = useUA()

// others
const { getOptimizedUrl } = useOptimizedImageUrl()
const createGridStyle = ({random, isMobile = false} = {}) => {

  const batched = props.clients.map(c => chunk(c.images, 2))
  let lastPosition = null

  const styles = batched.map(batch => batch.map(list => {
    const count = list.length
    if(count === 1){

      let force = {}
      if(lastPosition && lastPosition.type === 'one'){
        force.isLeft = !lastPosition.params.isLeft
        force.isTop = !lastPosition.params.isTop
      }
      
      // console.log("====> build: one")
      lastPosition = oneImagePositions({fs: random, isMobile, force, images: list})
      return lastPosition.style
    } 
    else if(count === 2){
      // console.log("====> build: two")
      lastPosition = twoImagesPositions({fs: random, isMobile, images: list})
      return lastPosition.style
    }
    else {
      console.warn("COUNT IS WEIRD")
      // console.log("====> build: other")
      lastPosition = twoImagesPositions({fs: random, isMobile, images: list})
      return lastPosition.style
    }
  }))

  gridStyle.value = styles
}
const handleListVideo = (clientIndex, batchIndex, play) => {
  
  const id = `${clientIndex}-${batchIndex}`
  const videos = gridVideos.value[id]

  // allow client with no media
  if(!videos) return;

  videos.forEach(el => {
    if(play){

      // load
      if(!el.src){
        handleVideoLoader(el, () => {
          el.parentElement.classList.add('loaded')
        })

        el.src = isMobile() ? el.dataset.srcLow ? el.dataset.srcLow : el.dataset.src : el.dataset.src
      }

      el.currentTime = 0
      el.play()

    } else {
      el.pause()
    }
  })
}

// hook

watch(() => props.state, state => {

  const batchIndex = props.batchIndexes[props.index].findIndex(v => v)
  
  if(state === 'entered'){
    handleListVideo(props.index, batchIndex, true)
  } else if(state === 'leaving'){
    handleListVideo(props.index, batchIndex, false)
  }
})

watch(() => props.index, (next, prev) => {
  handleListVideo(next, props.batchIndexes[next].findIndex(v => v), true)
  handleListVideo(prev, props.batchIndexes[prev].findIndex(v => v), false)
})

watch(() => props.batchIndexes, (next, prev) => {

  handleListVideo(props.index, next[props.index].findIndex(v => v), true)
  handleListVideo(props.index, prev[props.index].findIndex(v => v), false)
})


onMounted(() => {

  createGridStyle({random: FastRandom(Date.now()), isMobile: isMobile()})

  if(isDevMode()){
    window.onkeydown = event => {
      if(event.code === "KeyF"){
        createGridStyle({random: FastRandom(Date.now()), isMobile: isMobile()})
      }
    }
  }

})

</script>

<style lang="scss" scoped>
.slider{
  @include absolute-full;
  z-index: 1;
  pointer-events: none;


  @keyframes media-in {
    from{visibility: hidden; opacity: 0; transform: scale(0.95);}
    to{visibility: visible; opacity: 1; transform: scale(1)}
  }

  &.ios .slider__client-grid{
    display: none;
    &.visible{
      display: grid;
      .slider__client-grid-media{
        transition: none;
        animation: media-in 900ms 300ms forwards;
      }
    }
  }

  &:not(.ios) .slider__client-grid{
    &.visible{
      .slider__client-grid-media{
        @include visible;
        transition-duration: 900ms;
        transition-delay: 300ms;
        transform: scale(1);
      }
    }
  }

  &__client{
    @include absolute-full;
    pointer-events: none;

    &-grid{
      @include absolute-full;
      padding-left: desktop-vw(40);
      padding-right: desktop-vw(40);
      display: grid;
      gap: desktop-vw(40);
      grid-template-columns: repeat(12, 1fr);
      grid-template-rows: repeat(10, 10vh);

      &.leaving:not(.visible){
          .slider__client-grid-media{
            transform: scale(1.1);
            transition-delay: 0s!important;
        }
      }

      &.visible{
        .slider__client-grid-media-element-loader{
          animation-play-state: running;
        }
      }

      &-media{
        @include hidden;
        transition: 300ms var(--o2);
        transition-property: opacity, visibility, transform;
        transform: scale(0.95);

        &-element{
          height: auto;
          display: block;
          position: relative;


          &-loader{

            @keyframes loader {
              from{background-color: rgba(255, 255, 255, 0.1);}
              to{background-color: rgba(255, 255, 255, 0.05);}
            }

            @include absolute-full;
            background-color: rgba(255, 255, 255, 0.1);
            animation: loader var(--io1) 1s 300ms infinite alternate-reverse;
            animation-play-state: paused;
          }

          video{
            @include hidden;
            transition: 400ms var(--o2);
            transition-property: opacity, visibility;
          }

          &.loaded {
            .slider__client-grid-media-element-loader{
              @include hidden;
              transition: var(--o4) 400ms;
              transition-property: opacity, visibility;
            }
            video{
              @include visible;
            }
          }
        }
      }
    }
  }

  @include mobile(){
    &__client{
      &-grid{
        grid-template-columns: repeat(7, 1fr);
        padding-left: mobile-vw(20);
        padding-right: mobile-vw(20);
        gap: mobile-vw(20);
      }
    }
  }
}
</style>