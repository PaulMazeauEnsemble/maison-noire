<template>
  <div ref="root" id="s-about" :class="['stage about', {active}]">
    <div ref="content" class="stage__content">
      <div v-if="cms.about" class="about__content">

        <!-- Images -->
        <div class="about__images">
          <div v-for="(item, itemIndex) in cms.about.blocs.filter(b => b.images && b.images.length)" :key="item.title"  :class="['about__images-bloc', {opened: itemIndex === index && opened}]">
            <img v-for="(image, imageIndex) in item.images" :key="imageIndex" @load="onLoadImage" ref="images" :src="image.asset.url" class="about__images-bloc-image"/>
          </div>
        </div>
        
        <!-- List -->
        <div class="about__list-container">
          <div :style="listStyle" class="about__list">
            <div :style="itemStyle ? itemStyle[itemIndex] : undefined" :class="['about__list-item', {focused: focused === itemIndex, active: itemIndex === index, opened: itemIndex === index && opened}]" v-for="(item, itemIndex) in cms.about.blocs" :key="item.title" ref="refItems">
              <div @click="handleNavigate(itemIndex)" class="about__list-item-title">
                <div class="about__list-item-title-text hide-on-mobile">{{ item.desktop_title }}</div>
                <div class="about__list-item-title-text hide-on-desktop">{{ item.mobile_title }}</div>
                <div class="icon">
                  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5625" y="1.43164" width="12.88" height="12.904" rx="6.44" stroke="white"/>
                    <path d="M9.9425 8.41164H7.6025V10.8356H6.4025V8.41164H4.0625V7.30764H6.4025V4.93164H7.6025V7.30764H9.9425V8.41164Z" fill="white"/>
                  </svg>
                </div>
              </div>
              <div ref="descs" @click="handleClose" class="about__list-item-desc">
                <p class="titre">{{ item.subtitle }}</p>
                {{ item.description }}
                <div class="icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="13" height="13" rx="6.5" stroke="white"/>
                    <path d="M5.01953 7.60039V6.40039H8.97953V7.60039H5.01953Z" fill="white"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, watch } from 'vue'
import { useStageBehaviors } from '~/composables/stages';
import imageUrlBuilder from '@sanity/image-url'
import { vIntersectionObserver } from '@vueuse/components'
import SmoothWheel from '../assets/js/helpers/SmoothWheel';
import { useDebounceFn, useEventListener } from '@vueuse/core';
import { isMobile, approximate } from '~/assets/js/utils/utils'
const props = defineProps(['active'])
const emit = defineEmits(["next-html", "back-html"])
const isAppPaused = inject('isAppPaused')
// states
const root = ref(null)
const mask = ref(null)
const content = ref(null)
const headerBlack = useHeaderBlack()
const cms = useCMS()
const sanity = useSanity()
const index = ref(0)
const scroll = reactive({
  value: 0,
  speed: 0.05,
  limit: 0,
})
const listStyle = computed(() => ({
  transform: `translate3d(0px, ${scroll.value}px, 0px)`,
  willChange: 'transform'
}))
const refItems = ref(null)
const opened = ref(false)
const focused = ref(false)
const descs = ref(null)
const itemStyle = ref(null)
const images = ref([])

// computed
const centerPositions = computed(() => {
  if (!refItems.value) return []
  return refItems.value.map(el => el.offsetTop + el.offsetHeight / 2)
})

// others
const builder = imageUrlBuilder(sanity.config)
const urlFor = source => builder.image(source)
const optimizedImage = (source, width) => urlFor(source).width(width).auto('format').url()
let vs = null

const onResize = () => {
  const lastItemOffsetCenter = refItems.value[refItems.value.length - 1].offsetTop + refItems.value[refItems.value.length - 1].offsetHeight / 2
  const windowHeightHalf = window.innerHeight / 2
  vs.setLimit(-lastItemOffsetCenter - windowHeightHalf, windowHeightHalf)
}

const onLoadImage = ({target}) => {
  if(target.naturalWidth < target.naturalHeight){
    target.classList.add('portrait')
  }
}

watchEffect(() => {
  if (isAppPaused.value) {
    if (vs) {
      vs.stop()
    }
  } else {
    if (vs && props.active) {
      vs.start()
    }
  }
})

const snapNearest = () => {
  if (!props.active) return

  const positiveScroll = Math.abs(scroll.value)
  const nearest = centerPositions.value.reduce((prev, curr) => (
    Math.abs(curr - positiveScroll) < Math.abs(prev - positiveScroll) ? curr : prev
  ))

  index.value = centerPositions.value.findIndex(el => el === nearest)

  if (vs) {
    vs.setLast(-nearest)
  }
}
const debounceSnapNearest = useDebounceFn(snapNearest, 350)

const handleNavigate = nextIndex => {

  if(nextIndex === index.value){
    handleOpen(index.value)
  } else {
    if(vs){
      const centerPositions = refItems.value.map(el => el.offsetTop + el.offsetHeight / 2)
      vs.setLast(-centerPositions[nextIndex])
      index.value = nextIndex
      handleClose()
    }
  }


}

const handleNavigationStages = () => {

const windowQuarter = isMobile() ? window.innerHeight / 8 : window.innerHeight / 4
const lastItemOffsetCenter = refItems.value[refItems.value.length - 1].offsetTop + refItems.value[refItems.value.length - 1].offsetHeight / 2

if(scroll.value > windowQuarter){
  emit("back-html")
} else if(scroll.value < -lastItemOffsetCenter - windowQuarter){
  emit("next-html")
}
}

// hooks
const onEntered = () => {
  // console.log("onEntered")
  // headerBlack.value = true
  vs.on("wheel", onSmoothWheel)
  vs.start()
  onResize()

  const centerPositions = refItems.value.map(el => el.offsetTop + el.offsetHeight / 2)
  vs.setLast(-centerPositions[index.value])

}
const onLeaving = () => {
  // headerBlack.value = false
  vs.on("wheel", null)
}

const onLeft = () => {
  // console.log("onLeft")

  vs.stop()
  vs.setLast(0)
  scroll.value = 0
  index.value = 0
}

const onWheelLerped = ({lerped}) => {
  scroll.value = lerped
}

const onSmoothWheel = () => {
  debounceSnapNearest()
  handleNavigationStages()
}

onMounted(() => {
  vs = new SmoothWheel()
  vs.on("raf", onWheelLerped)
  vs.on("wheel", onSmoothWheel)
  vs.stop()
  useEventListener(window, "resize", onResize)

  images.value.forEach(el => {
    if(el.complete){
      onLoadImage({target: el})
    }
  })

})

onUnmounted(() => {
  if (vs) {
    vs.stop()
    vs.off("raf", onWheelLerped)
    vs = null
  }
  window.removeEventListener("resize", onResize)
})


const handleClose = () => {
  opened.value = false
  itemStyle.value = null
}

const handleOpen = (targetIndex) => {
  opened.value = true
  const descHeight = descs.value[targetIndex].offsetHeight
  const itemHeight = refItems.value[targetIndex].offsetHeight

  const offset = Math.max(30, (descHeight - itemHeight))

  const offsets = refItems.value.map((el, elIndex) => {
    if(elIndex < targetIndex) return -offset
    if(elIndex === targetIndex) return 0
    if(elIndex > targetIndex) return offset
  })
  itemStyle.value = offsets.map(val => ({transform: `translate(0, ${val}px)`}))
}

watch(index, nextIndex => {
  handleClose()
})

useStageBehaviors({props, root, mask, content, onEntered, onLeaving, onLeft})

</script>

<style lang="scss" scoped>
.about{
  color: #FFF;
  @include absolute-full;

  :deep(.stage__mask-svg){
    fill: black;
  }
  
  &__content{
    height: 100%;
    @include absolute-full;
    z-index: 1;
    
    
    &:after{
      content: "";
      pointer-events: none;
      @include absolute-full;
      background: radial-gradient(100% 100% at 50% 50%, #00000000 14.16%, #414141FF 200%);
    }
  
  }

  &__images{
    @include absolute-full;
    z-index: 2;
    pointer-events: none;

    &-bloc{
      @include absolute-full;
      padding-left: desktop-vw(40);
      padding-right: desktop-vw(40);
      display: grid;
      gap: desktop-vw(40);
      grid-template-columns: repeat(15, 1fr);
      grid-template-rows: repeat(10, 10vh);

      &:nth-child(odd) &{
        &-image{
          &:nth-child(1){grid-column: 1/5; grid-row-start: 2; transition-delay: 200ms;}
          &:nth-child(2){grid-column: 12/16; grid-row-start: 5;
            &.portrait{
              grid-row-start: 3;
            }
          }
        }
      }

      &:nth-child(even) &{
        &-image{
          &:nth-child(1){grid-column: 1/5; grid-row-start: 5;
            &.portrait{
              grid-row-start: 4;
            }
          }
          &:nth-child(2){grid-column: 12/16; grid-row-start: 2; transition-delay: 200ms;}
        }
      }

      &.opened &{
        &-image{
          opacity: 1;
        }
      }

      &-image{
        opacity: 0;
        transform: scale(0.95);
        transition: 400ms var(--o2);
        transition-property: opacity, transform;
      }
    }
  }

  &__list{
    width: desktop-vw(1200);
    margin-left: auto;
    margin-right: auto;
    position: relative;

    &-container{
      padding-top: calc(var(--100sh) * 0.5);
      height: var(--100sh);
      mask-image: linear-gradient(to bottom, transparent, black 35%, black 65%, transparent);
      // mask-image: linear-gradient(to bottom, transparent 50%, black);
    }

    &-item{
      position: relative;
      transition: transform 400ms var(--o5);
      &.opened &{
        &-title{
          @include hidden;
        }
        &-desc{
          @include visible;
          transition-delay: 100ms;
          transition-duration: 400ms;
        }
      }

      .icon{
        position: absolute;
        display: block;
        left: 50%;
        transform: translate(-50%, 10px);
        opacity: 0;
        transition: opacity 200ms var(--o2);
      }

      // &.focused{
      //   outline: 2px solid red;
      // }

      &.active{
        .icon{
          opacity: 1;
        }
      }

      &:not(:last-child){
        margin-bottom: 40px;
      }

      &-title{
        font-size: desktop-vw(38);
        text-align: center;
        font-weight: 500;
        user-select: none;
        transition: 400ms var(--o2);
        transition-property: opacity, visibility;
        pointer-events: all;
        line-height: 1.17;
        cursor: pointer;

        &-text{
          pointer-events: none;
          white-space: break-spaces;
        }
      }

      &-desc{
        @include absolute-center;
        @include hidden;
        user-select: none;
        font-size: desktop-vw(20);
        font-weight: 500;
        transition: var(--o2);
        transition-property: opacity, visibility;
        transition-duration: 200ms;
        cursor: pointer;
        line-height: 137%;
        width: desktop-vw(680);
        text-align: center;

        .titre{
          margin-bottom: desktop-vw(16);
        }
      }
    }
  }

  @include mobile(){

    &__images{
      display: none;
    
      &-bloc{
        grid-template-columns: repeat(7, 1fr);
        padding-left: mobile-vw(20);
        padding-right: mobile-vw(20);
        gap: mobile-vw(20);

        &:nth-child(odd) &{
          &-image{
            &:nth-child(1){grid-column: 1/4; grid-row-start: 2; transition-delay: 200ms;}
            &:nth-child(2){
              grid-column: 4/8; grid-row-start: 7;

              &.portrait{
                grid-row-start: 6;
              }
            }
          }
        }

        &:nth-child(even) &{
          &-image{
            &:nth-child(1){
              grid-column: 1/4; grid-row-start: 7;

              &.portrait{
                grid-row-start: 6;
              }
            }
            &:nth-child(2){grid-column: 4/8; grid-row-start: 2; transition-delay: 200ms;}
          }
        }

      }
    }

    &__list{
      width: 100%;

      &-item{

        &:not(:last-child){
          margin-bottom: mobile-vw(36);
        }


        &-title{
          font-size: mobile-vw(24);
        }
        
        &-desc{
          font-size: mobile-vw(16);
          line-height: 1.26;
          width: mobile-vw(277);
        }
      }
    }
  }
}
</style>