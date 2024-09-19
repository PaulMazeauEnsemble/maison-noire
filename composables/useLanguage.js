import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import emitter from 'tiny-emitter/instance'

export const useLanguage = () => {
  const route = useRoute()
  const router = useRouter()
  const currentLanguage = ref(route.query.lang || 'fr')

  const toggleLanguage = () => {
    currentLanguage.value = currentLanguage.value === 'fr' ? 'en' : 'fr'
    router.push({ query: { ...route.query, lang: currentLanguage.value } }).then(() => {
      emitter.emit('language-changed', currentLanguage.value)
      window.location.reload() // Ajout du reload ici
    })
  }

  watch(() => route.query.lang, (newLang) => {
    if (newLang) {
      currentLanguage.value = newLang
      emitter.emit('language-changed', newLang)
    }
  })

  return {
    currentLanguage,
    toggleLanguage
  }
}