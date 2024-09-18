<template>
  <header id="header" ref="root" :class="['header', {opened: menuOpened, black: headerBlack, loaderAnimating: !loaderHasAnimated}]">

    <!-- Logo -->
    <button @click="handleLogo" class="header__logo">
      <svg viewBox="0 0 425 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.2 54.3V1.1H11V49.8H35V54.3H0.2Z"/>
        <path d="M73.6 54.3L67.6 38.8H44.8L38.9 54.3H33.3L53.7 1.1H63.9L84.9 54.3H73.6ZM65.8 34.4L56 9L46.5 34.3H65.8V34.4Z"/>
        <path d="M142.8 54.3L124.8 5.4V54.3H119.3V1.1H134.3L149.3 42.2L164.2 1.1H178.7V54.3H168.2V5.5L150.3 54.3H142.8Z"/>
        <path d="M225.5 54.3L219.5 38.8H196.7L190.8 54.3H185.2L205.6 1.1H215.8L236.8 54.3H225.5ZM217.7 34.4L207.8 9L198.3 34.3H217.7V34.4Z"/>
        <path d="M243.6 54.3V1.1H254.4V54.3H243.6Z"/>
        <path d="M286 55.1C282.9 55.1 280 54.7 277.3 54C274.7 53.3 272.4 52.2 270.5 50.8C268.6 49.4 267 47.6 265.8 45.5C264.6 43.4 263.9 40.9 263.6 38.1H273.8C274 42.2 275.2 45.3 277.3 47.5C279.5 49.7 282.3 50.7 285.9 50.7C289.1 50.7 291.9 49.9 294.2 48.4C296.5 46.9 297.7 44.7 297.7 42C297.7 39.5 296.8 37.6 294.9 36.1C293 34.7 290.4 33.5 287.1 32.6L281.5 31.1C276.2 29.7 272.3 27.8 269.8 25.6C267.3 23.3 266 20.2 266 16.3C266 13.9 266.6 11.7 267.7 9.7C268.8 7.7 270.3 6 272.1 4.5C273.9 3.1 276.1 2 278.5 1.2C280.9 0.4 283.5 0 286.1 0C291.8 0 296.6 1.3 300.3 3.8C304.1 6.3 306.2 10 306.6 14.7H296.5C296.3 11.4 295.3 8.9 293.5 7.1C291.7 5.3 289.2 4.4 286 4.4C282.9 4.4 280.3 5.2 278.3 6.9C276.3 8.5 275.3 10.6 275.3 13.2C275.3 15.2 276 16.9 277.5 18.2C278.9 19.5 281.2 20.6 284.3 21.4L291 23C296 24.3 300 26.1 302.9 28.3C305.8 30.5 307.3 33.9 307.3 38.3C307.3 41 306.7 43.5 305.4 45.6C304.2 47.7 302.6 49.5 300.6 50.8C298.6 52.2 296.3 53.2 293.8 54C291.3 54.8 288.7 55.1 286 55.1Z"/>
        <path d="M341.7 55.1C337.9 55.1 334.4 54.5 331 53.2C327.6 51.9 324.7 50.1 322.2 47.7C319.7 45.3 317.7 42.4 316.3 39C314.9 35.6 314.1 31.7 314.1 27.5C314.1 23.1 314.8 19.3 316.3 15.8C317.8 12.4 319.8 9.5 322.3 7.2C324.8 4.9 327.7 3.1 331.1 1.9C334.5 0.6 338 0 341.7 0C345.3 0 348.8 0.6 352.2 1.8C355.5 3 358.5 4.8 361 7.1C363.5 9.4 365.5 12.3 367 15.7C368.5 19.1 369.2 23 369.2 27.4C369.2 31.7 368.5 35.5 367 38.9C365.5 42.3 363.6 45.2 361.1 47.6C358.6 50 355.7 51.8 352.3 53.1C349 54.5 345.4 55.1 341.7 55.1ZM341.7 50.8C346.8 50.8 350.7 48.7 353.3 44.6C355.9 40.5 357.2 34.8 357.2 27.5C357.2 20.2 355.9 14.5 353.2 10.4C350.6 6.4 346.7 4.4 341.6 4.4C336.5 4.4 332.6 6.4 330 10.4C327.4 14.4 326.1 20.1 326.1 27.5C326.1 34.7 327.4 40.4 330 44.6C332.6 48.8 336.5 50.8 341.7 50.8Z"/>
        <path d="M413.6 54.3L384.2 6.3V54.3H378.7V1.1H393.3L418.9 42.7V1.1H424.4V54.3H413.6Z"/>
        <path d="M5.5 78.4V126.4H0V73.1H14.6L40.2 114.8V73.1H45.7V126.3H34.9L5.5 78.4Z"/>
        <path d="M119.4 73.1H130.2V126.3H119.4V73.1Z"/>
        <path d="M231.4 126.3H192.6V73.1H230.8V77.6H203.4V96.6H228.6V101.1H203.4V121.8H231.4V126.3Z"/>
        <path d="M172 102.2L170.8 100.2C176.7 98.4 182.2 94.8 182.2 87.6C182.2 82.9 180.3 79.3 176.5 76.8C172.7 74.3 166.8 73.1 159 73.1H140.9V126.3H151.4V102.3H160.9L174.4 126.3H185.8L172 102.2ZM158.8 98.4H151.4V77.4H158.9C163.2 77.4 166.3 78.3 168.3 80.2C170.3 82.1 171.3 84.6 171.3 87.7C171.3 90.8 170.3 93.4 168.3 95.4C166.4 97.4 163.2 98.4 158.8 98.4Z"/>
        <path d="M82.2 127.2C78.4 127.2 74.9 126.6 71.5 125.3C68.1 124 65.2 122.2 62.7 119.8C60.2 117.4 58.2 114.5 56.8 111.1C55.4 107.7 54.6 103.8 54.6 99.6C54.6 95.2 55.3 91.4 56.8 87.9C58.3 84.5 60.3 81.6 62.8 79.3C65.3 77 68.2 75.2 71.6 74C75 72.8 78.5 72.2 82.1 72.2C85.7 72.2 89.2 72.8 92.6 74C95.9 75.2 98.9 77 101.4 79.3C103.9 81.6 105.9 84.5 107.4 87.9C108.9 91.3 109.6 95.2 109.6 99.6C109.6 103.9 108.9 107.7 107.4 111.1C105.9 114.5 104 117.4 101.5 119.8C99 122.2 96.1 124 92.7 125.3C89.5 126.6 85.9 127.2 82.2 127.2ZM82.2 122.9C87.3 122.9 91.2 120.8 93.8 116.7C96.4 112.6 97.7 106.9 97.7 99.6C97.7 92.3 96.4 86.6 93.7 82.5C91.1 78.5 87.2 76.5 82.1 76.5C77 76.5 73.1 78.5 70.5 82.5C67.9 86.5 66.6 92.2 66.6 99.6C66.6 106.8 67.9 112.5 70.5 116.7C73.1 120.9 77.1 122.9 82.2 122.9Z"/>
        <path d="M401.6 72.1C385.5 72.1 378.8 84.6 378.8 96.5C378.8 109.9 378.8 126.4 378.8 126.4H424.5C424.5 126.4 424.5 110 424.5 96.5C424.4 84.6 417.7 72.1 401.6 72.1ZM397.9 122.9V117.5C397.9 116.2 398.3 113.3 401.6 113.3C404.9 113.3 405.3 116.2 405.3 117.5V122.9H397.9ZM408.3 122.9C408.3 120.8 408.3 120 408.3 117.5C408.3 114 406.3 110.3 401.6 110.3C396.9 110.3 394.9 114 394.9 117.5C394.9 120 394.9 120.8 394.9 122.9H390.8V107.6C390.8 105.6 391.3 95.8 401.6 95.8C411.9 95.8 412.4 105.6 412.4 107.6V122.9H408.3ZM420.4 122.9H415.9C415.9 115.5 415.9 114.6 415.9 107.6C415.9 100.2 411.7 92.3 401.6 92.3C391.5 92.3 387.3 100.1 387.3 107.6C387.3 114.6 387.3 115.5 387.3 122.9H382.8V96.5C382.8 87.1 387.7 76.1 401.6 76.1C415.5 76.1 420.4 87.1 420.4 96.5V122.9Z"/>
      </svg>
    </button>

    <!-- Menu -->
    <button title="menu" @click="handleMenu" :class="['header__menu', {loaderCompleted}]">
      <svg viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0H30V2H0V0Z" />
        <path d="M0 11H30V15H0V11Z" />
        <path d="M0 24H30V26H0V24Z" />
      </svg>
    </button>

    <div class="header__nav">
      <button :title="`nav ${item.label}`" :class="{current: item.value === currentLink}" v-for="item in nav" :key="item.value" v-show="menuNavShow" @click="() => handleClickLink(item.to, item.index)">{{ item.label }}</button>
      <button @click="toggleLanguage">{{ currentLanguage === 'fr' ? 'Switch to English' : 'Passer en Français' }}</button>
    </div>

    <!-- Titles -->
    <div :class="['header__titles', {loaderCompleted, menuOpened}]">
      <p v-for="item in nav" :key="item.value" :class="['header__titles-item', {dark: item.dark, active: activeTitle === item.value}]">{{ item.label }}</p>
    </div>
  </header>
</template>

<script setup>
import emitter from "tiny-emitter/instance"
import { MENU_CLICK } from "~/assets/js/utils/events"
import singleton from "~/assets/js/utils/singleton"

// state
// const router = useRouter()
const headerBlack = useHeaderBlack()
const stageHtmlIndex = useStageHtmlIndex()
const isInHtml = useIsInHtml()
const menuOpened = useMenuOpened()
const root = ref(null)
const loaderHasAnimated = useLoaderHasAnimated()
const loaderCompleted = useLoaderCompleted()
const nav = [
  {label: 'Philosophie', value: 'manifeste', to: 'webgl'},
  {label: 'Références', value: 'clients', to: 'html', index: 0},
  {label: 'Notre Maison', value: 'about', to: 'html', index: 1},
  {label: 'Contact', value: 'contact', to: 'html', index: 2},
]
const currentLink = ref(nav[0].value)
const menuNavShow = ref(true)
const activeTitle = ref('manifeste')
const currentLanguage = ref('fr')

const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'fr' ? 'en' : 'fr'
}

// others
const handleMenu = () => {
  updateCurrentLink()
  menuOpened.value = !menuOpened.value
  emitter.emit(MENU_CLICK, menuOpened.value)
}

const fromHtml2Webgl = () => {
  stageHtmlIndex.value = 0
  const index = singleton.webgl.navigation.index
  for(let i = 0; i < index; i++){
    singleton.webgl.navigation.handleBackward()
    singleton.webgl.navigation.current.resetCameraPosition()
  }
  handleMenu()
}

const handleClickLink = (to, index) => {

  const fromWebgl = singleton.webgl.isCurrentWebglStage()

  if(to === "html"){
    // exit webgl
    if(fromWebgl){
      const index = singleton.webgl.navigation.index
      const countTillHtmlStage = singleton.webgl.navigation.list.length - index - 1
      
      for(let i = 0; i < countTillHtmlStage; i++){
        singleton.webgl.navigation.handleForward()
      }
    }

    stageHtmlIndex.value = index
    handleMenu()
  }

  else if(to === "webgl" && !fromWebgl){
    fromHtml2Webgl()
  }


}
const updateCurrentLink = () => {
  if(!isInHtml.value){
    currentLink.value = nav[0].value
  } else {
    currentLink.value = nav[stageHtmlIndex.value + 1].value
  }
}

let handlingLogo = false
const handleLogo = () => {

  if(singleton.webgl.isCurrentWebglStage() || handlingLogo) return;

  handlingLogo = true

  if(!menuOpened.value){
    menuNavShow.value = false
    handleMenu()
    setTimeout(() => {
      fromHtml2Webgl()
      setTimeout(() => {
        menuNavShow.value = true
        handlingLogo = false
      }, 1.5 * 1000)
    }, 1.5 * 1000) // duration of menu opening
  } else {
    fromHtml2Webgl()
    setTimeout(() => {handlingLogo = false}, 1.5 * 1000)
  }

}

// hooks
watch([stageHtmlIndex, isInHtml], () => {
  if(isInHtml.value){
    activeTitle.value = nav[stageHtmlIndex.value + 1].value
  } else {
    activeTitle.value = nav[0].value
  }
})

</script>

<style lang="scss" scoped>
.header{
  position: fixed;
  z-index: 5;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: desktop-vw(40);
  pointer-events: none;

  &.loaderAnimating > *{
    pointer-events: none;
  }

  &.black &{
    &__logo, &__menu{
      svg{
        fill: #000;
      }
    }
    &__nav button{
      color: #000;
    }
  }

  &.opened &{
    &__nav{
      @include visible;
      transition-delay: 0.5s;
    }

    &__menu{
      path:first-child{
        transform: translate(0, 5px);
        opacity: 0;
      }
      path:last-child{
        transform: translate(0, -5px);
        opacity: 0;
      }
    }

    &__logo, &__menu{
      svg{
        fill: #000;
      }
    }
    &__nav button{
      color: #000;
    }
  }

  &__nav, &__logo, &__menu{
    pointer-events: all;
  }

  &__nav{
    @include hidden;
    position: absolute;
    right: calc(#{desktop-vw(40 + 30 + 20)});
    transition: var(--o1) 1s;
    transition-property: opacity, visibility;

    button{
      display: block;
      font-weight: 500;
      font-size: desktop-vw(24);
      color: #FFF;
      transition: color var(--o3) 1.5s, opacity var(--o2) 300ms;
      line-height: 1;
      margin-bottom: desktop-vw(20);

      &.current{
        opacity: 0.15;
        pointer-events: none;
      }
    }
  }


  &__logo, &__menu{
    svg{
      fill: #FFF;
      transition: fill var(--o1) 1.5s;
    }
  }

  &__logo{
    width: desktop-vw(200);
  }

  &__menu{
    width: desktop-vw(30);
    opacity: 0;
    &.loaderCompleted{
      opacity: 1;
      transition: opacity var(--o3) 1s 2s;
    }
    
    path:first-child, path:last-child{
      transition: var(--io1) 600ms;
      transition-property: opacity, transform;
    }
  }

  &__titles{
    color: #FFF;
    font-size: desktop-vw(24);
    position: absolute;
    right: calc(#{desktop-vw(40 + 30 + 20)});
    opacity: 0;

    &.loaderCompleted{
      opacity: 1;
      transition: opacity var(--o3) 1s 2.4s;
    }

    &.menuOpened{
      opacity: 0;
      transition-duration: 300ms;
      transition-delay: 0;
    }

    &-item{
      position: absolute;
      right: 0;
      top: 0;
      white-space: nowrap;
      user-select: none;
      opacity: 0;
      transition: opacity 400ms 1s var(--o2);

      @keyframes fadeout {
        to{
          opacity: 0;
        }
      }

      @keyframes fadein {
        from{opacity: 0}
        to{opacity: 1;}
      }

      &.dark{
        color: #000;
      }

      &.active{
        transition: none;
        animation: fadein 400ms 1s forwards var(--o2), fadeout 1s 3s forwards var(--o2);
      }
    }
  }

  @include mobile(){
    padding: mobile-vw(20);

    &.opened &{
      &__logo{
        opacity: 0;
        transition-delay: 0s;
      }
    }

    &__nav{
      right: auto;
      left: mobile-vw(20);
      
      button{
        font-size: mobile-vw(16);
        margin-bottom: mobile-vw(20);
      }
    }

    &__logo{
      width: mobile-vw(133);
      transition: opacity var(--o1) 1s;
      transition-delay: 0.5s;
    }

    &__menu{
      width: mobile-vw(24);
    }

    &__titles{
      right: calc(#{mobile-vw(20 + 24 + 20)});
      &-item{
        font-size: mobile-vw(16);
      }
    }
  }
}
</style>