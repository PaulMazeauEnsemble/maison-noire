<template>
  <div :class="['loader', {loaderHasAnimated, 'completed': loaderCompleted}]">
    <div v-if="!hidePercent" class="loader__text">
      {{ loaderCount }}%
    </div>
  </div>
</template>

<script setup>
import gsap from "gsap"

const props = defineProps(['hidePercent'])

// states
const loaderProgress = useLoaderProgress()
const loaderCompleted = useLoaderCompleted()
const webglStarted = useWebglStarted()
const loaderHasAnimated = useLoaderHasAnimated()

// computed
const loaderCount = computed(() => Math.floor(100 * loaderProgress.value))

// others
let tl

</script>

<style lang="scss" scoped>
.loader{
  @include absolute-full;
  overflow: hidden;
  background-color: #000;
  z-index: 2;

  &.loaderHasAnimated{
    display: none;
  }

  &.completed &{
    &__text{
      @include hidden;
      transition: var(--o3) 300ms;
      transition-property: opacity, visibility;
    }
  }

  &__text{
    @include absolute-center;
    color: #FFF;
    font-size: desktop-vw(16);
    font-weight: 500;
  }

  @include mobile(){
    &__text{
      font-size: mobile-vw(16);
    }
  }

}
</style>