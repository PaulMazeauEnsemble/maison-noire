<template>
  <div class="clicktp">
    <button @click="$emit('start')">Cliquez pour entrer</button>
  </div>
</template>

<style lang="scss" scoped>
.clicktp{
  @include absolute-full;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;

  button{ 
    border-bottom: 1px solid #FFF;
    color: #FFF;
    padding: 0.5em 0.5em;
  }
}
</style>