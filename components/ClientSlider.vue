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
          @click="handleVideoClick(cIndex, bIndex, mIndex, media)"
          :class="{ selected: selectedMedia.clientIndex === cIndex && selectedMedia.batchIndex === bIndex && selectedMedia.mediaIndex === mIndex }"
        >
          <div class="slider__client-grid-media-element" style="pointer-events: all;">
            <div class="slider__client-grid-media-element-loader"></div>
            <img v-if="media.is_image" :src="getOptimizedUrl(media.asset, {width: 800})" alt="">
            <video v-else ref="video" playsInline :data-src="media.video" :data-src-low="media.video_low" :data-id="`${cIndex}-${bIndex}`" loop muted></video>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Fullscreen Video -->
  <transition name="fullscreen-video-transition">
    <div v-if="fullscreenVideo" class="fullscreen-video" @click="closeFullscreenVideo">
      <video :key="fullscreenVideo.video" :src="fullscreenVideo.video" autoplay loop></video>
    </div>
  </transition>
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
const selectedMedia = ref({ clientIndex: null, batchIndex: null, mediaIndex: null })
const fullscreenVideo = ref(null)

const gridVideos = computed(() => {
  let obj = {}

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
      
      lastPosition = oneImagePositions({fs: random, isMobile, force, images: list})
      return lastPosition.style
    } 
    else if(count === 2){
      lastPosition = twoImagesPositions({fs: random, isMobile, images: list})
      return lastPosition.style
    }
    else {
      console.warn("COUNT IS WEIRD")
      lastPosition = twoImagesPositions({fs: random, isMobile, images: list})
      return lastPosition.style
    }
  }))

  gridStyle.value = styles
}
const handleListVideo = (clientIndex, batchIndex, play) => {
  
  const id = `${clientIndex}-${batchIndex}`
  const videos = gridVideos.value[id]

  if(!videos) return;

  videos.forEach(el => {
    if(play){

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


const handleVideoClick = (clientIndex, batchIndex, mediaIndex, media) => {
  selectedMedia.value = { clientIndex, batchIndex, mediaIndex }
  // console.log('click', media, clientIndex, batchIndex, mediaIndex)
  if (!media.is_image) {
    fullscreenVideo.value = { ...media }
  }
}

// close fullscreen video
const closeFullscreenVideo = () => {
  fullscreenVideo.value = null
}

const initializeVideos = () => {
  nextTick(() => {
    const currentBatchIndex = props.batchIndexes[props.index].findIndex(v => v)
    handleListVideo(props.index, currentBatchIndex, true)
  })
}

// hook

watch(() => props.state, (state) => {
  if (state === 'entered') {
    initializeVideos()
  } else if (state === 'leaving') {
    const batchIndex = props.batchIndexes[props.index].findIndex(v => v)
    handleListVideo(props.index, batchIndex, false)
  }
}, { immediate: true })

watch(() => props.index, (next, prev) => {
  handleListVideo(prev, props.batchIndexes[prev].findIndex(v => v), false)
  nextTick(() => {
    handleListVideo(next, props.batchIndexes[next].findIndex(v => v), true)
  })
})

watch(() => props.batchIndexes, (newBatchIndexes, oldBatchIndexes) => {
  const currentBatchIndex = newBatchIndexes[props.index].findIndex(v => v)
  const oldBatchIndex = oldBatchIndexes[props.index].findIndex(v => v)
  
  if (currentBatchIndex !== oldBatchIndex) {
    handleListVideo(props.index, oldBatchIndex, false)
    nextTick(() => {
      handleListVideo(props.index, currentBatchIndex, true)
    })
  }
}, { deep: true })

onMounted(() => {

  createGridStyle({random: FastRandom(Date.now()), isMobile: isMobile()})

  if(isDevMode()){
    window.onkeydown = event => {
      if(event.code === "KeyF"){
        createGridStyle({random: FastRandom(Date.now()), isMobile: isMobile()})
      }
    }
  }

  if (props.state === 'entered') {
    initializeVideos()
  }
})

</script>

<style lang="scss" scoped>
.slider{
  @include absolute-full;
  z-index: 1;
  pointer-events: none;

  .slider__client-grid-media {
    pointer-events: all;
  }

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
          pointer-events: all;

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

.fullscreen-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
  transition: opacity 0.5s ease, transform 0.5s ease;

  &-enter-active, &-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  &-enter, &-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }

  video {
    max-width: 90%;
    max-height: 90%;
  }
}
</style>
