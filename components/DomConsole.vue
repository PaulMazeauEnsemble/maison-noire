<template>
  <div class="console">
    <button class="videologs" @click="openVideoLogs" >Video logs</button>
    <button class="toggle" title="toggle" @click="opened = !opened">Toggle</button>
    <div :style="{display: opened ? '' : 'none'}" class="console__list">
      <pre>{{ content }}</pre>
    </div>
  </div>
</template>

<script setup>

const contentArray = ref([])
const content = ref("")
const opened = ref(true)
const assets = useAssets()

const LIMIT = 100

const names = ['log', 'warn', 'error', 'info']

if(typeof window !== "undefined"){

  names.forEach(name => {

    const fn = console[name]

    window.console[name] = function(...args){


      contentArray.value = [
        ...contentArray.value,
        `${(performance.now() / 1000).toFixed(2)}s => (${name}): ${arguments[0]}, ${typeof arguments[1] !== 'undefined' ? arguments[1] : ''}`
      ]

      if(contentArray.value.length > LIMIT){
        contentArray.value = contentArray.value.filter((_, index) => index > 0)
      }

      content.value = contentArray.value.join('\n')

      // console.log(content.value.split('\n'))

      return fn(...args)
    }

  })

}

// others
const openVideoLogs = () => {

  let videos = Object.keys(assets.value.videos).map(key => !assets.value.videos[key].lazy ? ([key, !!assets.value.videos[key]._preloaded]) : null).filter(f => f)

  let outputString = ''

  videos.forEach(v => {
    outputString += `[${v[0]}; ${v[1]}\n`
  })

  console.log(outputString)
}

</script>

<style lang="scss" scoped>
.console{
  position: fixed;
  z-index: 10000;
  border: 3px solid red;
  background-color: #FFF;
  pointer-events: all;
  width: 100%;
  // opacity: .4;
  

  .videologs{
    position: absolute;
    right: 30%;
  }
  bu
  tton{
    display: block;
  }

  &__list{
    max-height: 25vh;
    overflow: auto;
  }
}
</style>