<template>
  <div class="stage__mask">
    <svg :ref="elRef" class="stage__mask-svg" viewBox="0 0 102 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#000000" d="M0 51C0 22.8335 22.8335 0 51 0C79.1665 0 102 22.8335 102 51V140H0V51Z"/>
      <defs>
        <radialGradient v-if="radial" cx="50%" cy="50%" r="70%" fx="50%" fy="50%" :id="`smask-radial-${radial}`">
          <stop offset="14%" stop-color="#000000" />
          <stop offset="110%" stop-color="#414141" />
        </radialGradient>
      </defs>
    </svg>
  </div>
</template>

<script setup>

  defineProps(['elRef', 'radial'])

</script>