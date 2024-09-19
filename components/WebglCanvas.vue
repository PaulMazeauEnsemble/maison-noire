<template>
  <manifeste-texts/>
  <canvas ref="canvas" id="webgl"></canvas>
</template>

<script setup>
  import { inject, watch, ref, onMounted, toValue } from 'vue'
  import Webgl from "~/assets/js/webgl/Webgl"
  import singleton from "~/assets/js/utils/singleton"

  const isAppPaused = inject('isAppPaused')
  const assets = useAssets()
  const cms = useCMS()
  const loaderHasAnimated = useLoaderHasAnimated()
  const manifesteIndex = useManifesteIndex()
  const manifestePortalProgress = useManifestePortalProgress()
  const manifesteCameraProgress = useManifesteCameraProgress()
  
  const props = defineProps({
    completed: Boolean
  })

  // refs
  const canvas = ref(null)
  const loaderCompleted = useLoaderCompleted()
  const webglStarted = useWebglStarted()

  watch(isAppPaused, (isPaused) => {
    if (singleton.webgl) {
      if (isPaused) {
        singleton.webgl.pause()
      } else {
        singleton.webgl.resume()
      }
    }
  })

  watch(loaderCompleted, (next, prev) => {
    if (!singleton.webgl) {
      createWebgl()
    }
  })

  onMounted(() => {
    if (loaderCompleted.value) {
      createWebgl()
    }
  })

  function createWebgl() {
    singleton.webgl = new Webgl({
      canvas, 
      assets: toValue(assets), 
      cms: toValue(cms), 
      store: {
        loaderHasAnimated,
        manifesteIndex,
        manifesteCameraProgress,
        manifestePortalProgress,
      }
    })
    singleton.webgl.start()
    setTimeout(() => { webglStarted.value = true }, 300)
  }

  // hooks
  onUnmounted(() => {
    if (singleton.webgl) {
      singleton.webgl.destroy()
      singleton.webgl = null
    }
  })
</script>

<style lang="scss" scoped>
  #webgl {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    pointer-events: none;
  }
</style>