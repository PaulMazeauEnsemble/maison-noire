<template>
  <div class="app">
    <NuxtLayout>
      <!-- <gsap-performance/>  -->
      <ScreenSize/>
      <HeaderLayout/>
      <WebglCanvas/>
      <TheLoader v-if="withLoader" :hidePercent="shouldShowStarToPlay === null" />
      <DomConsole v-if="queryConsole"/>
      <StageList/>
      <ClickToStart v-if="shouldShowStarToPlay && !hasStartedToPlay" @start="handleManualStart"/>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const ScreenSize = defineAsyncComponent(() => import('./components/ScreenSize.vue'))
const HeaderLayout = defineAsyncComponent(() => import('./components/HeaderLayout.vue'))
const WebglCanvas = defineAsyncComponent(() => import('./components/WebglCanvas.vue'))
const TheLoader = defineAsyncComponent(() => import('./components/TheLoader.vue'))
const DomConsole = defineAsyncComponent(() => import('./components/DomConsole.vue'))
const StageList = defineAsyncComponent(() => import('./components/StageList.vue'))
const ClickToStart = defineAsyncComponent(() => import('./components/ClickToStart.vue'))

import AssetsManager from "~/assets/js/utils/AssetsManager"
import { withLoader } from "~/assets/js/utils/commons.js"
import { isBrowser, isMobile } from "~/assets/js/utils/utils.js"
import { onMounted, onUnmounted, provide } from 'vue'
import { useAppPause } from '~/composables/useAppPause'
import gsap from "gsap"
import { useLanguage } from '~/composables/useLanguage'
import emitter from 'tiny-emitter/instance'

if(typeof window !== "undefined"){
  gsap.ticker.lagSmoothing(0)
}

// utils
const route = useRoute()
const { getOptimizedUrl } = useOptimizedImageUrl()
const { isAppPaused, pauseApp, resumeApp } = useAppPause()
const { currentLanguage } = useLanguage()

// states
const loaderCompleted = useLoaderCompleted()
const assets = useAssets()
const cms = useCMS()
const loaderProgress = useLoaderProgress()
const ua = useUA()
const { device } = useNuxtApp()

// computed
const queryConsole = computed(() => typeof route.query.console !== 'undefined')
const queryManual = computed(() => typeof route.query.manual !== 'undefined')
const shouldShowStarToPlay = ref(null)
const hasStartedToPlay = ref(false)

// hooks
// assets from cms

const handleVisibilityChange = () => {
  if (document.hidden) {
    pauseApp()
  } else {
    resumeApp()
  }
}

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

const handleManualStart = () => {
  console.log("handleManualStart")
  hasStartedToPlay.value = true
  AssetsManager.load(toValue(assets), loaderProgress).then(() => {
      loaderCompleted.value = true
  })
}

onMounted(() => {

  if(window.innerWidth / window.innerHeight < 1.05){
    document.body.classList.add("less-than-1dotzero5")
  }

  // console.log('v', 1.1)

  if(queryConsole){
    const { browser, os, device, userAgent } = useNuxtApp()
    // console.log('browser', Object.values(browser).join('-'))
    // console.log('os', Object.values(os).join('-'))
  }

  AssetsManager.testVideoPlayability().then(() => {
    // console.log("success test")
    shouldShowStarToPlay.value = false
    AssetsManager.load(toValue(assets), loaderProgress).then(() => {
      loaderCompleted.value = true
    })
  }).catch(() => {
    // console.log("failed test")
    shouldShowStarToPlay.value = true
  })

})

// manifeste
const textures = {}
const videos = {}
const {data: dataManifeste} = await useSanityQuery(groq`*[_type == "manifeste" && language == $lang][0]{
  ...,
  scenes[]{
    ...,
    list[]{
      ...,
      select(mesh_type == "media" && media_type == "image") => {
        "image": image.asset->
      },
      select(mesh_type == "media" && media_type == "video") => {
        "video": {
          "url": video
        }
      }
    }
  }
}`, { lang: currentLanguage })

dataManifeste.value.scenes.forEach((scene, sceneIndex) => {

  const isMobileBrowser = isBrowser() && isMobile()

  scene.list.forEach(el => {
    const key = `cms-scene-${sceneIndex}-${el._key}`
    el.__assetKey = key
    if(el.mesh_type === "media" && el.media_type == "image"){
      textures[key] = getOptimizedUrl(el.image.url, {width: 1200})
    }
    else if(el.mesh_type === "media" && el.media_type == "video"){
      if(!el.video_low){
        console.log("no low", el)
      }

      const videoUrl = isMobileBrowser ? (el.video_low || el.video.url) : el.video.url

      videos[key] = {
        url: isMobileBrowser ? (el.video_low || el.video.url) : el.video.url,
        // url: `/assets/videos/manifeste/${el.local_video}`,
        url: `https://videos.maisonoir.fr/server.php?file=${videoUrl}`,
        lazy: sceneIndex === 0 ? false : true
        // lazy: true,
      }
    }
  })
})

assets.value = {
  ...assets.value,
  textures: {
    ...assets.value.textures,
    ...textures,
  },
  videos: {
    ...assets.value.videos,
    ...videos,
  },
}

const {data: dataClientList} = await useSanityQuery(groq`*[_type == "client_list"][0]{
  ...,
  list[]->{
      ...,
      images[]{
        ...,
        select(is_image == true) => {
          "asset": image.asset->
            
        }
      }
        
    }
  }
`)

const {data: dataContact} = await useSanityQuery(groq`*[_type == "contact" && language == $lang][0]`, { lang: currentLanguage })
const {data: dataAbout} = await useSanityQuery(groq`*[_type == "about" && language == $lang][0]{
  ...,
  scenes[]{
    ...,
    list[]{
      ...,
      select(mesh_type == "media" && media_type == "image") => {
        "image": image.asset->
      },
      select(mesh_type == "media" && media_type == "video") => {
        "video": {
          "url": video
        }
      }
    }
  }
}`, {lang: currentLanguage})


// cms
cms.value = {
  ...cms.value,
  manifeste: dataManifeste.value,
  clients: dataClientList.value,
  contact: dataContact.value,
  about: dataAbout.value,
}

provide('isAppPaused', isAppPaused)

const updateContent = async (lang) => {
  // Re-fetch or update content based on the new language
  const { data: dataManifeste } = await useSanityQuery(groq`*[_type == "manifeste" && language == $lang][0]`, { lang })
  const { data: dataContact } = await useSanityQuery(groq`*[_type == "contact" && language == $lang][0]`, { lang })
  const { data: dataAbout } = await useSanityQuery(groq`*[_type == "about" && language == $lang][0]`, { lang })

  cms.value = {
    ...cms.value,
    manifeste: dataManifeste.value,
    contact: dataContact.value,
    about: dataAbout.value,
  }
}

onMounted(() => {
  emitter.on('language-changed', updateContent)
})

onUnmounted(() => {
  emitter.off('language-changed', updateContent)
})
</script>

<style lang="scss" scoped>
.app{
  &:before{
    content: "";
    display: block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1px;
    height: 1px;
    background-color: green;
    z-index: 100;
    display: none;
  }
}
</style>