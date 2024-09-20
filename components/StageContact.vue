<template>
  <div ref="root" id="s-contact" :class="['stage contact', {active}]">
    <div ref="content" class="stage__content">
      <div ref="contactContent" class="contact__content">
        <lenis-scroll start :locked="lenisLocked" @init="initLenis" @reached-start="$emit('back-html')">
          <div class="contact__content-body">
            <!-- Persons -->
            <div class="contact__persons">
              <div v-for="person in cms.contact.list" :key="person._key" class="contact__persons-item">
                <p>{{ person.name }}</p>
                <p>{{ person.role }}</p>
                <p><a :href="`mailto:${person.email}`">{{ person.email }}</a></p>
              </div>
            </div>

            <!-- Address -->
            <div class="contact__address">{{ cms.contact.address }}</div>

            <!-- Socials -->
            <div class="contact__socials">
              <a v-for="social in cms.contact.socials" :key="social._key" :href="social.url" target="_blank" rel="noopener noreferrer" class="contact__socials-item">{{ social.label }}</a>
            </div>

            <a href="https://ensemble.ooo" target="_blank" class="contact__site">site: ensemble.ooo</a>
          </div>

        </lenis-scroll>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps(['active'])
const emit = defineEmits(['back-html'])

// states
const root = ref(null)
const mask = ref(null)
const content = ref(null)
const cms = useCMS()
const contactContent = ref(null)

const lenisParameters = ref(null)
const lenisLocked = computed(() => !props.active)

// others
const initLenis = p => {lenisParameters.value = p}
const onEntered = () => {
  lenisParameters.value.startLenis()
}
const onLeaving = () => {
  lenisParameters.value.stopLenis()
}


useStageBehaviors({props, root, mask, content, onEntered, onLeaving})

</script>

<style lang="scss" scoped>
.contact{
  color: #FFF;
  font-size: desktop-vw(20);
  position: relative;

  :deep(.c-scroll-start), :deep(.c-scroll-end){
    height: desktop-vw(270);

    @include mobile(){
      height: mobile-vw(270);
    }
  }

  :deep(.stage__mask-svg){
    fill: #000;
  }

  :deep(.contact__persons-item){
    &:not(:last-child){
      margin-bottom: desktop-vw(40);
    }

    p{
      &:not(:last-child){
        margin-bottom: desktop-vw(6);
      }

      a{
        text-decoration: underline;
      }
    }
  }

  :deep(.contact__address){
    margin: 0 auto;
    width: desktop-vw(400);
    margin-top: desktop-vw(80);
    white-space: pre-line;
  }

  :deep(.contact__socials){
    margin-top: desktop-vw(40);
  }

  :deep(.contact__socials-item){
    text-decoration: underline;
    display: block;
    line-height: 1.16;
  }

  :deep(.contact__site){
    margin-top: desktop-vw(40);
    color: #4D4D4D; 
    display: block;
  }

  &__content{
    height: var(--100sh);
    &-body{
      padding-top: 25vh;
      padding-bottom: 15vh;
      width: desktop-vw(600);
      margin: 0 auto;
      text-align: center;
      line-height: 1.16;
      display: flex;
      flex-direction: column;
    }
  }

  :deep(.c-scroll-overlay){
    background-color: #000;
  }

  :deep(.c-scroll-bar-content){
    background-color: #FFF;
  }

  @include mobile(){
    font-size: mobile-vw(16);

    &::before{
      content: '';
      position: absolute;
      z-index: 2;
      background: linear-gradient(to bottom, #000, transparent);
      left: 0;
      top: 0;
      width: calc(100% - 7px);
      height: mobile-vw(200);
    }

    :deep(.contact__persons-item){
      &:not(:last-child){
        margin-bottom: mobile-vw(40);
      }
      p{
        &:not(:last-child){
          margin-bottom: mobile-vw(6);
        }
      }
    }

    :deep(.contact__address){
      width: 90%;
      margin-top: mobile-vw(60);
    }

    :deep(.contact__socials){
      margin-top: mobile-vw(20);
    }

    :deep(.contact__site){
      margin-top: mobile-vw(20);
      padding-bottom: mobile-vw(115);
    }

    :deep(.contact__content-body){
      width: mobile-vw(315);
    }
  }
}
</style>