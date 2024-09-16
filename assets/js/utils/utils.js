import AssetsManager from "./AssetsManager"
import Sniffer from 'snifferjs'

// Responsive
export const isMobile = () => window.innerWidth  < 1024
export const isBrowser = () => typeof window !== "undefined"
export const isDevMode = () => process.env.NODE_ENV === "development"

// DOM
export const xMetricToPixel = (val, reference = 1680) => val * window.innerWidth / 1680

// Misc

export const handleVideoLoader = (video, onLoad) => {

  const _onLoad = () => {
    video.removeEventListener("canplay", _onLoad)
    video.removeEventListener("canplaythrough", _onLoad)
    onLoad()
  }

  video.addEventListener("canplay", _onLoad)
  video.addEventListener("canplaythrough", _onLoad)

}

export const  getSafariFriendlyURL = url => {
  return new Promise((resolve) => {
    $fetch(url, {
      onResponse(res){
        resolve(res.response.url)
      },
      onResponseError(res){
        console.log(
          "[fetch response error]",
          request,
          response.status,
          response.body
        );

        resolve(url)
      }
    })
  })
}

export const approximate = (a, b, p = 1) => Math.abs(b - a) < Math.pow(10, -p)

export const retrieveSceneElements = array => {

  return array.map(el => {
    if(el.mesh_type === "text"){
      return {...el}
    }

    let type = el.media_type === "image" ? "textures" : "videos"
    let keyinAssets = el.__assetKey

    return {
      ...el,
      preloadedAssetReference: AssetsManager[type][keyinAssets]
    }
  })
}

// Gsap
export const onCompleteProgress = (progressThreshold, cb) => {
  let reached = false
  return function(){
    if(!reached && this.progress() > progressThreshold){
      reached = true
      cb()
    }
  }

}