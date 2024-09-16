<template>
  <div class="test">

    <div class="trigger" @click="index++">TRIGGER ({{ index }})</div>

    <div ref="scrollWrapper" class="clients">
      <div v-for="client in clients" :key="client._key" :style="scrollStyle" class="client">
        <div class="client__media">
          <video v-for="media in client.images.filter(m => !m.is_image).slice(0, batch)" playsInline :key="media._key" muted loop ref="videos" :data-src="media.video" src=""></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import SmoothWheel from "../assets/js/helpers/SmoothWheel"

const cms = useCMS()
const clients = cms.value.clients.list
const index = ref(-1)
const videos = ref([])
const batch = 2
const scrollWrapper = ref(null)
const scroll = reactive({
  value: 0,
  speed: 0.05,
  limit: 0,
})
const scrollStyle = computed(() => ({transform: `translate(0, ${scroll.value}px)`}))

watch(index, next => {

  const thisIndex = index.value

  videos.value.forEach((el, elIndex) => {

    if(elIndex <= thisIndex * 2 + 1){

      // console.log("el", elIndex)

      // play or load
      if(elIndex === thisIndex * 2 || elIndex === 2 * thisIndex + 1){
        console.log("load", elIndex)

        el.addEventListener('suspend', event => {
          console.log("suspend " + elIndex, event)
        })


        el.addEventListener('error', event => {
          console.log("error " + elIndex, event)
        })

        el.addEventListener('canplay', () => {
          console.log("canplay", elIndex)
        }, {once: true})
        el.src = el.dataset.src
        el.play()
      } else {
        el.pause()
      }
    }


  })



})


let vs = null

const onWheelLerped = ({lerped}) => {
  scroll.value = lerped
}

onMounted(() => {

  vs = new SmoothWheel()
  vs.on("raf", onWheelLerped)

  const wHeight = window.innerHeight
  const scrollHeight = scrollWrapper.value.scrollHeight

  vs.setLimit(-scrollHeight + wHeight / 2, wHeight * .25)

  videos.value.forEach((el, elIndex) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!el.src) {
            el.addEventListener('canplay', () => {
              console.log("canplay", elIndex)
            }, { once: true })
            el.src = el.dataset.src
          }
          el.play().catch(console.error)
        } else {
          el.pause()
        }
      })
    }, { threshold: 0.1 })
    observer.observe(el)
  })

})

</script>

<style lang="scss" scoped>
.test{
  background-color: #000;
  padding: 5rem;
  padding-top: 0;
  border: 4px solid green;
  // overflow: hidden;
  overscroll-behavior: contain;
  height: var(--100sh);

  .trigger{
    position: absolute;
    top: 50vh;
    right: 0;
    color: #FFF;
    background-color: red;
    padding: 2rem;
    pointer-events: all;
  }

  .clients{
    border: 3px dotted blue;
    height: calc(var(--100sh) * 0.7);
    overflow: scroll;
    // overscroll-behavior: contain;
    pointer-events: all;
  }

  .client{
    color: #FFF;
    pointer-events: none;

    &__media{
      border: 1px solid green;
      display: flex;
      width: 100%;
      
      video{
        border: 1px solid orange;
        width: 30vw;
        height: auto;
        display: block;
        background-color: #FFFFFF33;
        pointer-events: none;

        &[src=""]{
          background-color: #FFFFFF11;
        }
      }
    }
  } 

  @include mobile(){
    padding: 1rem;
  }
}
</style>