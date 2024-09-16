<template>
  <div ref="root" id="s-about" :class="['stage about', {active}]">
    <stage-mask :elRef="el => mask = el" />
    <div ref="content" class="stage__content">
      <div v-if="cms.about" class="about__content">
        <lenis-scroll :wheel-multiplier="1.2" start end :locked="lenisLocked" @init="initLenis" @reached-start="$emit('back-html')" @reached-end="$emit('next-html')">
          <div class="about__images">
            <img class="about__images-item" :src="optimizedImage(cms.about.hero_images[0].asset, 400)" alt="">
            <img class="about__images-item" :src="optimizedImage(cms.about.hero_images[1].asset, 400)" alt="">
            <img class="about__images-item" :src="optimizedImage(cms.about.hero_images[2].asset, 400)" alt="">
            <img class="about__images-item" :src="optimizedImage(cms.about.hero_images[3].asset, 400)" alt="">
          </div>
          <div class="about__four">
            <p>Les 4 Piliers de la Maison Noire</p>
          </div>

          <!-- Blocs -->

          <!-- Fixed -->
          <div class="about__list">
            <div class="about__sticky">
              <div v-for="(block, blockIndex) in blocks" :key="block.id">
                <div :style="{opacity: currentVisibleSection.index === blockIndex && currentVisibleSection.type === 'hero' ? 1 : 0}" :class="`about__sticky-child about__block about__${block.id}`">
                  <p class="about__tcenter">{{ block.hero_title }}</p>
                </div>
                <div :style="{opacity: currentVisibleSection.index === blockIndex && currentVisibleSection.type === 'body' ? 1 : 0}" :class="`about__sticky-child about__block about__${block.id}`">
                  <p class="about__tcenter small">{{ cms.about[`${block.cmsKey}_desc`] }}</p>
                </div>
              </div>
            </div>

            <div class="about__scroll">
              <div
                v-for="(block, blockIndex) in blocks"
                :key="block.id"
              >
                <div v-intersection-observer="[onIntersectionObserver(blockIndex, 'hero'), {threshold: 0.5}]" :class="`about__block about__${block.id}`">
                  <img v-if="cms.about[`${block.cmsKey}_hero`]" :class="`about__${block.id}-hero-image`" :src="optimizedImage(cms.about[`${block.cmsKey}_hero`].asset, 700)" alt="">
                </div>
                <div ref="scrollBody" v-intersection-observer="[onIntersectionObserver(blockIndex, 'body'), {threshold: 0.5}]" :class="['about__scroll-body about__block']">
                  <img :style="{transitionDelay: `${115 * 0}ms`}" :class="`about__${block.id}-image first`" :src="optimizedImage(cms.about[`${block.cmsKey}_images`][0].asset, 400)" alt="">
                  <img :style="{transitionDelay: `${115 * 1}ms`}" :class="`about__${block.id}-image second`" :src="optimizedImage(cms.about[`${block.cmsKey}_images`][1].asset, 400)" alt="">
                  <img :style="{transitionDelay: `${115 * 2}ms`}" :class="`about__${block.id}-image third`" :src="optimizedImage(cms.about[`${block.cmsKey}_images`][2].asset, 400)" alt="">
                </div>
              </div>
            </div>
          </div>
        </lenis-scroll>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, watch } from 'vue'
import { useStageBehaviors } from '~/composables/stages';
import imageUrlBuilder from '@sanity/image-url'
import { vIntersectionObserver } from '@vueuse/components'

const props = defineProps(['active'])
const emit = defineEmits(["next-html"])
const isAppPaused = inject('isAppPaused')
console.log('Initial isAppPaused StageAboutvalue:', isAppPaused.value)

// states
const root = ref(null)
const mask = ref(null)
const content = ref(null)
const headerBlack = useHeaderBlack()
const lenisParameters = ref(null)
const cms = useCMS()
const sanity = useSanity()
const currentVisibleSection = ref({index: 0, type: 'hero'})
const scrollBody = ref(null)

// computed
const lenisLocked = computed(() => !props.active)

// others
const initLenis = p => {lenisParameters.value = p}
const builder = imageUrlBuilder(sanity.config)
const urlFor = source => builder.image(source)
const optimizedImage = (source, width) => urlFor(source).width(width).auto('format').url()
const blocks = [
  {id: 'da', cmsKey: 'gp2', hero_title: '1. Conception & Direction artistique'},
  {id: 'real', cmsKey: 'gp3', hero_title: '2. La Réalisation'},
  {id: 'prod', cmsKey: 'gp4', hero_title: '2. La Production'},
  {id: 'postprod', cmsKey: 'gp5', hero_title: '2. La Post-Production'},
  {id: 'origin', cmsKey: 'gp6', hero_title: 'À l’origine la passion de l’image'},
  {id: 'equipe', cmsKey: 'gp7', hero_title: 'Des équipes en interne pour une meilleure vue d’ensemble'},
  {id: 'emplacement', cmsKey: 'gp8', hero_title: 'Situés au cœur de paris dans un cadre historique'},
]

watchEffect(() => {
  console.log(`StageAbout: isAppPaused is now ${isAppPaused.value}`)
  if (isAppPaused.value) {
    console.log('StageAbout: Stopping animations and scroll interactions')
    if (vs) {
      vs.stop()
    }
  } else {
    console.log('StageAbout: Resuming animations and scroll interactions')
    if (vs && props.active) {
      vs.start()
    }
  }
})

const onIntersectionObserver = (index, type) => ([{isIntersecting}]) => {
  if(isIntersecting){
    currentVisibleSection.value = {index, type}

    if(type === 'body'){
      scrollBody.value[index].classList.add("visible")
    }
  }
}
// hooks
const onEntered = () => {
  headerBlack.value = true
  lenisParameters.value.startLenis()
  currentVisibleSection.value = ref({index: 0, type: 'hero'})
  scrollBody.value.forEach(el => {
    el.classList.remove("visible")
  })
}
const onLeaving = () => {
  headerBlack.value = false
  lenisParameters.value.stopLenis()
}

useStageBehaviors({props, root, mask, content, onEntered, onLeaving})

</script>

<style lang="scss" scoped>
.about{
  color: #000;

  :deep(.stage__mask-svg){
    fill: #FFF;
  }

  &__content{
    height: var(--100sh);
    overflow: hidden;
  }

  &__images{
    height: var(--100sh);
    align-items: center;
    position: relative;

    &-item{
      position: absolute;
      width: desktop-vw(235);
      top: 50%;
      transform: translate(0, -50%);
      &:nth-child(1){left: desktop-vw(310)}
      &:nth-child(2){left: desktop-vw(585)}
      &:nth-child(3){left: desktop-vw(860)}
      &:nth-child(4){left: desktop-vw(1135)}
    }
  }

  :deep(.c-scroll-overlay){
    background-color: #FFF;
  }

  &__four{
    display: grid;
    height: 100vh;
    align-items: center;
    text-align: center;
    font-size: desktop-vw(32);
    font-weight: 500;
  }

  &__grid{
    grid-template-rows: repeat(27, #{(100/27) * 1vh});
  }

  &__block{
    height: var(--100sh);
    position: relative;
  }

  &__list{
    padding-bottom: calc(-1 * var(--100sh));
  }

  &__scroll{
    position: relative;
    top: calc(-1 * var(--100sh));

    &-body{
      img{
        opacity: 0;
        transform: scale(0.85);
        transition: 2s var(--o3);
        transition-property: transform, opacity;
      }

      &.visible img{
        opacity: 1;
        transform: scale(1.0);
      }
    }
  }

  &__sticky{
    position: sticky;
    top: 0;
    height: var(--100sh);
    z-index: 1;

    &-child{
      position: absolute;
      top: 0;
      width: 100%;
    }
  }

  &__tcenter{
    @include absolute-center;
    z-index: 1;
    font-size: desktop-vw(24);
    font-weight: 500;
    text-align: center;
  }

  &__da{
    &-hero{
      &-image{
        position: absolute;
        width: desktop-vw(371);
        left: desktop-vw(40);
        top: desktop-vw(160);
      }
    }
    &-image{
      position: absolute;
      &.first{width: desktop-vw(507); left: desktop-vw(40); top: desktop-vw(164);}
      &.second{width: desktop-vw(234); left: desktop-vw(997); top: 0;}
      &.third{width: desktop-vw(372); left: desktop-vw(1270); bottom: 0;}
    }
  }

  &__real{
    &-hero-image{
      position: absolute;
      width: desktop-vw(370);
      left: desktop-vw(1270);
      top: desktop-vw(200);
    }
    &-image{
      position: absolute;
      &.first{width: desktop-vw(234); left: desktop-vw(175); bottom: 0;}
      &.second{width: desktop-vw(360); left: desktop-vw(450); top: 0;}
      &.third{width: desktop-vw(507); right: desktop-vw(40); top: desktop-vw(164);}
    }
  }

  &__prod{
    &-hero-image{
      position: absolute;
      width: desktop-vw(370);
      right: desktop-vw(40);
      top: desktop-vw(42);
    }
    &-image{
      position: absolute;
      &.first{width: desktop-vw(507); left: desktop-vw(40); bottom: desktop-vw(40);}
      &.second{width: desktop-vw(507); left: desktop-vw(723); top: 0;}
      &.third{width: desktop-vw(234); left: desktop-vw(1270); bottom: 0;}
    }
  }

  &__postprod{
    &-hero-image{
      position: absolute;
      width: desktop-vw(370);
      left: desktop-vw(177);
      bottom: desktop-vw(40);
    }
    &-image{
      position: absolute;
      &.first{width: desktop-vw(360); left: desktop-vw(175); bottom: 0;}
      &.second{width: desktop-vw(234); left: desktop-vw(859); top: 0;}
      &.third{width: desktop-vw(507); right: desktop-vw(40); bottom: desktop-vw(40);}
    }
  }

  &__origin{
    &-image{
      position: absolute;
      &.first{width: desktop-vw(507); left: desktop-vw(312); bottom: 0;}
      &.second{width: desktop-vw(234); left: desktop-vw(449); top: 0;}
      &.third{width: desktop-vw(547); right: 0; top: 0;}
    }
  }


  &__equipe{
    &-image{
      position: absolute;
      &.first{width: desktop-vw(507); left: desktop-vw(40); bottom: desktop-vw(40);}
      &.second{width: desktop-vw(507); right: desktop-vw(176); bottom: 0;}
      &.third{width: desktop-vw(234); right: desktop-vw(313); top: 0;}
    }
  }

  &__emplacement{
    &-image{
      position: absolute;
      &.first{width: desktop-vw(234); left: desktop-vw(176); bottom: 0;}
      &.second{width: desktop-vw(507); left: desktop-vw(449); top: 0;}
      &.third{width: desktop-vw(507); left: desktop-vw(1133); bottom: desktop-vw(40);}
    }
  }

  @include mobile(){
    &__four{
      font-size: mobile-vw(21);
    }

    &__images{
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-content: center;
      width: mobile-vw(103 * 2 + 20);
      margin-left: auto;
      margin-right: auto;

      &-item{
        position: relative;
        width: mobile-vw(103);
        transform: none;
        top: auto!important;
        left: auto!important;

        &:nth-child(1), &:nth-child(2){
          margin-bottom: mobile-vw(20);
        }

        &:nth-child(odd){
          margin-right: mobile-vw(10);
        }

        &:nth-child(even){
          margin-left: mobile-vw(10);
        }
      }
    }

    &__tcenter{
      font-size: mobile-vw(19);
      width: calc(100% - #{mobile-vw(40)});

      &.small{
        font-size: mobile-vw(16);
      }
    }

    &__da{
      &-hero-image{
        left: mobile-vw(20);
        top: mobile-vw(80);
        width: mobile-vw(164);
      }
      &-image{
        &.first{width: mobile-vw(166); left: mobile-vw(20); top: mobile-vw(80);}
        &.second{width: mobile-vw(103); left: mobile-vw(205); top: 0;}
        &.third{width: mobile-vw(165); left: mobile-vw(205); bottom: 0;}
      }
    }

    &__real{
      &-hero-image{
        position: absolute;
        width: mobile-vw(164);
        left: mobile-vw(206);
        top: mobile-vw(80);
      }
      &-image{
        position: absolute;
        &.first{width: mobile-vw(103); left: mobile-vw(20); bottom: 0;}
        &.second{width: mobile-vw(165); left: mobile-vw(51); top: mobile-vw(140);}
        &.third{width: mobile-vw(166); right: mobile-vw(20); top: auto; bottom: mobile-vw(160);}
      }
    }

    &__prod{
      &-hero-image{
        width: mobile-vw(164);
        right: auto;
        left: mobile-vw(20);
        top: auto;
        bottom: mobile-vw(100);
      }
      &-image{
        position: absolute;
        &.first{width: mobile-vw(165); left: mobile-vw(20); bottom: mobile-vw(120);}
        &.second{width: mobile-vw(165); left: auto; right: mobile-vw(20); top: mobile-vw(140);}
        &.third{width: mobile-vw(103); left: auto; right: mobile-vw(51); bottom: 0;}
      }
    }

    &__postprod{
      &-hero-image{
        position: absolute;
        width: mobile-vw(164);
        right: mobile-vw(20);
        left: auto;
        bottom: mobile-vw(100);
      }
      &-image{
        position: absolute;
        &.first{width: mobile-vw(165); left: mobile-vw(20); bottom: 0;}
        &.second{width: mobile-vw(103); left: auto; right: mobile-vw(51); top: 0;}
        &.third{width: mobile-vw(165); right: mobile-vw(20); bottom: mobile-vw(40);}
      }
    }

    &__origin{
      &-image{
        position: absolute;
        &.first{width: mobile-vw(165); left: mobile-vw(82); bottom: 0;}
        &.second{width: mobile-vw(103); left: mobile-vw(20); top: mobile-vw(80);}
        &.third{width: mobile-vw(185); right: 0; top: mobile-vw(140);}
      }
    }


    &__equipe{
      &-image{
        position: absolute;
        &.first{width: mobile-vw(165); left: mobile-vw(20); bottom: mobile-vw(100);}
        &.second{width: mobile-vw(165); right: mobile-vw(20); left: auto; bottom: 0;}
        &.third{width: mobile-vw(103); right: mobile-vw(82); top: mobile-vw(100);}
      }
    }

    &__emplacement{
      &-image{
        position: absolute;
        &.first{width: mobile-vw(165); right: mobile-vw(20); left: auto; top: auto; bottom: mobile-vw(161);}
        &.second{width: mobile-vw(165); left: mobile-vw(82); top: mobile-vw(100);}
        &.third{width: mobile-vw(103); left: mobile-vw(20); bottom: 0;}
      }
    }


  }
}
</style>