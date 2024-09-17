<template>
  <div ref="root" id="s-clients" :class="['stage clients', {active}]">
    <div ref="content" class="stage__content">

      <!-- Images -->
      <client-slider
        :clients="cms.clients.list"
        :index="index"
        :indexLeaving="indexLeaving"
        :batchIndexes="clientIndexes"
        :state="sliderState"
      />

      <!-- List -->
      <div class="clients__content">
        <div :style="listStyle" ref="refItemsList" class="clients__content-list">
          <div :class="['clients__content-list-item', {active: index === itemIndex}]" v-for="(item, itemIndex) in cms.clients.list" :key="item._key" ref="refItems" >
            <div @click="handleTitleClick(itemIndex)" class="clients__content-list-item-text">{{ item.title }}</div>
            <div v-if="clientIndexes[itemIndex].length > 1" :class="['clients__content-list-item-dots', {visible: index === itemIndex}]">
              <button v-for="(dot, dIndex) in clientIndexes[itemIndex]" @click="() => handleSliderDots(itemIndex, dIndex)" :class="{active: clientIndexes[itemIndex][dIndex]}" :key="dIndex"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, watch } from 'vue'
import chunk from "lodash/chunk"
import { useEventListener, useDebounceFn } from '@vueuse/core'
import SmoothWheel from "../assets/js/helpers/SmoothWheel"
import { isMobile, isDevMode } from '~/assets/js/utils/utils'
import { useWindowSize } from '@vueuse/core'

const props = defineProps(['active'])
const emit = defineEmits(['back-webgl', 'next-html'])
const isAppPaused = inject('isAppPaused')

// debug
console.log('Initial isAppPaused Clients value:', isAppPaused.value)

// states
const root = ref(null)
const mask = ref(null)
const content = ref(null)
const cms = useCMS()
const scroll = reactive({
  value: 0,
  speed: 0.05,
  limit: 0,
})
const refItems = ref(null)
const refItemsList = ref(null)
const index = ref(0)
const indexLeaving = ref(-1)
const medias = ref([])
const sliderState = ref('')
const {width: windowWidth} = useWindowSize()


let arr = cms.value.clients.list.map(c => chunk(c.images, 2))
arr = arr.map(batches => batches.map((batch, bIndex) => bIndex === 0))
const clientIndexes = ref(arr)
const offsetTopItems = ref([])

// computed
const listStyle = computed(() => ({
  transform: `translate3d(0, ${scroll.value}px, 0)`,
  willChange: 'transform'
}))
const mediaVideos = computed(() => medias.value.map(el => el.querySelectorAll('video')))

// others
let vs = null
const { getOptimizedUrl } = useOptimizedImageUrl()

watchEffect(() => {
  console.log(`StageClients: isAppPaused is now ${isAppPaused.value}`)
  if (isAppPaused.value) {
    console.log('StageClients: Stopping animations and scroll interactions')
    if (vs) {
      vs.stop()
    }
  } else {
    console.log('StageClients: Resuming animations and scroll interactions')
    if (vs && props.active) {
      vs.start()
    }
  }
})

const onEntered = () => {
  // console.log("onEntered")
  vs.on("wheel", onSmoothWheel)
  vs.start()
  onResize()

  // index.value = 3
  // vs.setLast(-( refItems.value.map(el => el.offsetTop)[3] ))
  sliderState.value = "entered"
}

const onLeaving = () => {
  // console.log("onLeaving")
  vs.on("wheel", null)
  sliderState.value = "leaving"
}

const onLeft = () => {
  // console.log("onLeft")

  vs.stop()
  vs.setLast(0)
  scroll.value = 0
  index.value = 0
}

const snapNearest = useDebounceFn(() => {

  // not in the page anymore
  if(!props.active) return;

  const positiveScroll = Math.abs(scroll.value)

  let nearest = 0

  // find nearest
  if(scroll.value > 0){
    nearest = offsetTopItems.value[0]
  } else {
    nearest = offsetTopItems.value.reduce((prev, curr) => (
      Math.abs(curr - positiveScroll) < Math.abs(prev - positiveScroll) ? curr : prev
    ))
  }

  // set index
  index.value = offsetTopItems.value.findIndex(el => el ===  nearest)
  // console.log("snapNearest", index.value)

  // snap
  if(vs){
    vs.setLast(-nearest)
  }

}, 350)

const handleNavigation = () => {

  const windowQuarter = isMobile() ? window.innerHeight / 8 : window.innerHeight / 4
  const lastItemOffsetTop = refItems.value[refItems.value.length - 1].offsetTop

  if(scroll.value > windowQuarter){
    emit("back-webgl")
  } else if(scroll.value < -lastItemOffsetTop - windowQuarter){
    emit("next-html")
  }
}

const onSmoothWheel = () => {
  snapNearest()
  handleNavigation()
}

const onWheelLerped = ({lerped}) => {
  scroll.value = lerped
}
const onResize = () => {
  const lastItemOffsetTop = refItems.value[refItems.value.length - 1].offsetTop
  const windowHeightHalf = window.innerHeight / 2
  vs.setLimit(-lastItemOffsetTop - windowHeightHalf, windowHeightHalf)
}

const handleSliderDots = (clientIndex, batchIndex) => {

clientIndexes.value = clientIndexes.value.map((batches, _clientIndex) => batches.map((val, _batchIndex) => {
  if(clientIndex === _clientIndex){
    return batchIndex === _batchIndex ? true : false
  } else {
    return val
  }

}))
}

const handleJumpIndex = nextIndex => {

  if(vs){
    vs.setLast(-offsetTopItems.value[nextIndex])
    index.value = nextIndex
  }
}


const handleTitleClick = (thisIndex) => {
  if(thisIndex === index.value){
    handleNextBatch()
  } else {
    handleJumpIndex(thisIndex)
  }
}

const handleNextBatch = () => {

  const batches = clientIndexes.value[index.value]
  const current = batches.findIndex(v => v)
  const length = batches.length

  // useless to loop the batch if there is only one
  if(length === 1) return;

  const nextIndex = (current + 1) % length

  if(nextIndex >= 0 && nextIndex < length){
    clientIndexes.value = clientIndexes.value.map((batches, _clientIndex) => batches.map((val, _batchIndex) => {
      if(index.value === _clientIndex){
        return nextIndex === _batchIndex ? true : false
      } else {
        return val
      }
    }))
  }

}


// hooks
onMounted(() => {

  vs = new SmoothWheel()
  vs.on("raf", onWheelLerped)
  vs.on("wheel", onSmoothWheel)
  vs.stop()

  useEventListener(window, "resize", onResize)

})

watch(index, (next, prev) => {
  indexLeaving.value = prev
})

watch([windowWidth, refItemsList, refItems], () => {
  if(typeof window !== "undefined" && refItemsList.value && refItems.value[0]){
    const offsetTopHasIncludedMargin = refItems.value[0].offsetTop !== 0
    const offset = offsetTopHasIncludedMargin ? refItems.value[0].offsetTop : 0
    offsetTopItems.value = refItems.value.map(el => el.offsetTop - offset)
  }
}, { immediate: true })


useStageBehaviors({props, root, mask, content, onEntered, onLeft, onLeaving})

onUnmounted(() => {
  if (vs) {
    vs.stop()
    vs.off("raf", onWheelLerped)
    vs.off("wheel", onSmoothWheel)
    vs = null
  }
  window.removeEventListener("resize", onResize)
})
</script>

<style lang="scss" scoped>
.clients{
  @include absolute-full;
  color: #FFF;

  :deep(.stage__mask-svg){
    fill: #000;
  }

  &__content{
    overflow: hidden;
    height: var(--100sh);
    pointer-events: none;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;

    // &:before{
    //   content: "";
    //   @include absolute-center();
    //   width: 300px;
    //   height: 1px;
    //   pointer-events: none;
    //   background-color: red;
    // }

    &:after{
      @include absolute-full;

      background-image: linear-gradient(180deg, 
        rgba(0,0,0,1) 0%, 
        rgba(0,0,0,0.8) 30%, 
        rgba(0,0,0,0) 50%, 
        rgba(0,0,0,0.8) 70%, 
        rgba(0,0,0,1) 100%
      );
      content: "";
      pointer-events: none;
    }

    &-list{
      margin-top: calc(50vh - #{desktop-vw(35 / 2)});

      &-item{
        font-size: desktop-vw(58);
        font-weight: 500;
        text-align: center;
        line-height: 1;
        user-select: none;
        position: relative;

        &.active{
          .clients__content-list-item-dots button{
            pointer-events: all;
            cursor: pointer;
          }
        }

        &:not(:last-child){
          margin-bottom: desktop-vw(30);
        }

        &-text{
          // border: 1px solid blue;
          pointer-events: all;
          cursor: pointer;
        }

        &-dots{
          position: absolute;
          left: 50%;
          top: calc(100% + #{desktop-vw(10)});
          transform: translate(-50%, 0);
          display: flex;
          opacity: 0;
          transition: opacity 300ms var(--o2);

          &.visible{
            opacity: 1;
          }


          & > button{
            margin: 0 5px;
            opacity: 0.5;
            display: block;

            &:before{
              display: block;
              content: "";
              border-radius: 100%;
              width: 4px;
              height: 4px;
              background-color: #FFF;
            }

            &.active{
              opacity: 1;
            }
          }
        }
      }
    }
  }

  @include mobile(){

    &__content{
      &-list{
        margin-top: calc(0.5 * #{var(--100sh)} - #{mobile-vw(25 / 2)});

        &-item{
          font-size: mobile-vw(36);

          &:not(:last-child){
            margin-bottom: mobile-vw(30);
          }

          &-dots{
            top: calc(100% + #{mobile-vw(10)});
          }
        }
      }
    }
  }
}
</style>