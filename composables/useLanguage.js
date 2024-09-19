import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useLanguage = () => {
  const route = useRoute()
  const router = useRouter()
  const currentLanguage = ref(route.query.lang || 'fr')

  const toggleLanguage = () => {
    currentLanguage.value = currentLanguage.value === 'fr' ? 'en' : 'fr'
    router.push({ query: { ...route.query, lang: currentLanguage.value } })
  }

  watch(() => route.query.lang, (newLang) => {
    if (newLang) {
      currentLanguage.value = newLang
    }
  })

  return {
    currentLanguage,
    toggleLanguage
  }
}