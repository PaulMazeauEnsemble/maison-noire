import { TextureLoader, VideoTexture } from "three";
import { preloadFont } from 'troika-three-text'
import { getSafariFriendlyURL } from "./utils";
import { useNuxtApp } from "nuxt/app";

class AssetsManager {

    constructor(){

        // loaders
        this.textureLoader = new TextureLoader()
        // assets
        this.textures = {}
        this.videos = {}
        this.fonts = {}

        this.count = {
            total: 0,
            loaded: 0,
            state: null
        }
    }

    shouldUseSafariFriendly(){
        return (this.user.os.name === "ios" && this.user.device === 'mobile') || this.user.browser.name === 'safari'
    }

    onLoadItem(){
        const nextLoaded = this.count.loaded + 1
        this.count.loaded = nextLoaded
        this.count.state.value = nextLoaded / this.count.total
    }

    async loadTextures(textures){
        let promises = []

        for(const key in textures){
            promises.push(
                this.textureLoader.loadAsync(textures[key]).then(texture => {
                    this.textures[key] = texture
                    this.onLoadItem()
                })
            )
        }

        return Promise.all(promises)
    }

    async getVideoSrc(originalSrc){
        return originalSrc
        // if(this.shouldUseSafariFriendly()){
        //     const safariFriendly = await getSafariFriendlyURL(originalSrc)
        //     return safariFriendly
        // } else {
        //     return originalSrc
        // }
    }

    async loadVideos(videos){
        let promises = []

        for(const key in videos){
            promises.push(
                new Promise((resolve, reject) => {
                    const video = document.createElement("video")
                    Object.assign(video.style, {
                        position: 'absolute',
                        display: 'none',
                    })
                    document.body.appendChild(video)
                    video.muted = true
                    video.loop = true
                    // video.autoplay = true
                    video.playsInline = true
                    video.setAttribute('webkit-playsinline', '')
                    video.crossOrigin = 'Anonymous'
                    // video.crossorigin = 'anonymous'

                    video.addEventListener('error', err => {
                        console.log("preload", err)
                    })

                    this.getVideoSrc(videos[key].url).then(videoSrc => {
                        if(videos[key].lazy){
                            video.dataset.src = videoSrc
                            this.videos[key] = new VideoTexture(video)
                            this.onLoadItem()
                            resolve()
                        } else {
                            video.addEventListener("canplay", () => {
                            
                                videos[key]._preloaded = true
                                
                                this.onLoadItem()
                                video.pause()
                                video.currentTime = 0                            
                                this.videos[key] = new VideoTexture(video)
                                resolve()
                            }, {once: true})
                            video.src = videoSrc
                            video.play().catch(err => {
                                console.log("can not play", err)
                            })

                        }
                    })
                })
            )
        }

        return Promise.all(promises)
    }

    async loadBitmapFonts(fonts){

        const loadUnitFont = async (path) => new Promise((resolve) => {
            preloadFont({
                font: path,
                characters: "abcdefghijklmnopqrstuvwxyz",
                sdfGlyphSize: 8
            }, resolve)
        })

        let promises = []

        for(const key in fonts){

            promises.push(
                loadUnitFont(fonts[key]).then(payload => {
                    this.onLoadItem()
                    this.fonts[key] = payload.parameters.font
                })
            )

        }

        return Promise.all(promises)

    }

    async testVideoPlayability(videoSrc = '/test-video.mp4'){
        console.log("----- testVideoPlayability ----")
        return new Promise((resolve, reject) => {
            const video = document.createElement("video")
            video.muted = true
            video.loop = true
            video.autoplay = false
            video.playsInline = true
            video.setAttribute('webkit-playsinline', '')
            video.crossOrigin = 'Anonymous'

            video.addEventListener('error', err => {
                console.log("preload", err)
                reject(false)
            })

            video.addEventListener("canplay", () => {
                video.pause()
                resolve(true)
            }, {once: true})
            video.src = videoSrc
            video.play().catch(err => {
                console.log("can not play", err)
                reject(false)
            }).finally(() => {
                console.log("----- END: testVideoPlayability ----")
            })
        })
    }

    async load(assetsToLoad, loaderProgressState){

        const route = useRoute()
        this.hasManual = typeof route.query.manual !== 'undefined'

        const { browser, os, device, userAgent } = useNuxtApp()
        this.user = {
            device,
            os,
            browser
        }

        if(this.shouldUseSafariFriendly()){
            console.log("will use safariFriendly urls")
        }

        if(typeof (route.query.browser) !== 'undefined'){

            alert(`
                1: ${JSON.stringify(browser)}
                2: ${JSON.stringify(os)}
                3: ${JSON.stringify(userAgent)}
                4: ${JSON.stringify(device)}
            `)
        }

        this.count.state = loaderProgressState
        this.count.total = Object.keys(assetsToLoad.textures).length + Object.keys(assetsToLoad.videos).length + Object.keys(assetsToLoad.fonts).length

        console.time("loader")

        await Promise.all([
            this.loadTextures(assetsToLoad.textures),
            this.loadVideos(assetsToLoad.videos),
            this.loadBitmapFonts(assetsToLoad.fonts)
        ])
        
        console.timeEnd("loader")

    }

}

export default new AssetsManager()