<template>
  <div></div>
</template>
<script>
export default {
  name: "ScreenSize",
  beforeMount(){

    this._sh = document.createElement("div")
    this._sh.style.cssText = `position: fixed; pointer-events: none; top: 0px; width: 1px; height: 100%;`
    document.body.appendChild(this._sh)

    this._vh = document.createElement("div")
    this._vh.style.cssText = `position: fixed; pointer-events: none; top: 0px; width: 1px; height: 100vh;`
    document.body.appendChild(this._vh)

    this.computeSizes()
  },
  mounted(){
    window.addEventListener("resize", this.computeSizes)
  },
  destroyed(){
    
    if(this._sh){
      document.body.removeChild(this._sh)
    }

    if(this._vh){
      document.body.removeChild(this._vh)
    }
    window.removeEventListener("resize", this.computeSizes)
  },
  methods: {
    computeSizes(){
      document.documentElement.style.setProperty("--100vh", `${this._vh.offsetHeight}px`);
      document.documentElement.style.setProperty("--100sh", `${this._sh.offsetHeight}px`);
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  position: relative;
}
</style>