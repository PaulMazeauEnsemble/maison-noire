export const useLoaderCompleted = () => useState('loaderCompleted', () => false)
export const useManifesteIndex = () => useState('manifesteIndex', () => 0)
export const useManifestePortalProgress = () => useState('manifestePortalProgress', () => 0)
export const useManifesteCameraProgress = () => useState('manifesteCameraProgress', () => 0)

export const useBrowser = () =>  useNuxtApp().browser
export const useOs = () =>  useNuxtApp().os
export const useUA = () => {
  const nuxtApp = useNuxtApp()
  return {
    os: nuxtApp.os,
    device: nuxtApp.device,
    isTouch: nuxtApp.isTouch,
    browser: nuxtApp.browser,
  }
}


