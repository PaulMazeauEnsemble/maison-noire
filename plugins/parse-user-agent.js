import Sniffer from 'snifferjs'
import MobileDetect from 'mobile-detect'

/**
 * Parse user-agent string and return environment browser/os/device
 *
 * @param  {string} userAgent
 * @return {Object} ENV
 */
function parseUserAgent (userAgent = '') {
  const ua = Sniffer(userAgent)
  let browser = { name: ua.browser.name, version: ua.browser.majorVersion }
  let os = { name: ua.os.name, version: ua.os.majorVersion }
  
  const mobileDetect = new MobileDetect(userAgent)
  let device = mobileDetect.tablet() ? 'tablet' : mobileDetect.mobile() ? 'mobile' : 'desktop'
  // let isTouch = device !== 'desktop'

  // if (typeof window !== 'undefined') {
  //   isTouch = !!('ontouchstart' in window || ('DocumentTouch' in window && document instanceof window.DocumentTouch))
  //   if (isTouch === false) {
  //     device = 'desktop'
  //   }
  // }

  return {
    userAgent,
    browser, os,
    device, 
    // isTouch
  }
}


export default defineNuxtPlugin({
  async setup (nuxtApp) {
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : typeof req !== 'undefined' ? req.headers['user-agent'] : ''
    const ENV = parseUserAgent(userAgent)
    
    nuxtApp.userAgent = ENV.userAgent
    nuxtApp.browser = ENV.browser
    nuxtApp.os = ENV.os
    nuxtApp.device = ENV.device
    // nuxtApp.isTouch = ENV.isTouch
  },

})