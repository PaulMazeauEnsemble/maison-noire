import { ref } from 'vue'

export const useAppPause = () => {
  const isAppPaused = ref(false)

  const pauseApp = () => {
    isAppPaused.value = true
  }

  const resumeApp = () => {
    isAppPaused.value = false
  }

  return {
    isAppPaused,
    pauseApp,
    resumeApp
  }
}