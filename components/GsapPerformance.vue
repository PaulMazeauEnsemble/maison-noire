<template>
  <div class="gperf">
    <p>{{ gperf }}</p>
  </div>
</template>>

<script setup>
import gsap from "gsap"

const gperf = ref(15.4)

// others
const onTick = (time, delta) => {
  gperf.value = delta
}

// hooks
onMounted(() => {
  gsap.ticker.add(onTick)
})

</script>

<style lang="scss" scoped>
.gperf{
  position: absolute;
  z-index: 100;
  background-color: #FFF;
  color: red;
  width: 60px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>