import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en' // 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import VueKonva from 'vue-konva'

Vue.use(VueKonva)
import Fragment from 'vue-fragment'
Vue.use(Fragment.Plugin)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.directive('overLengthTip', {
  inserted(el, binding) {
    const input = el.querySelector('input')

    const mouseenterHandler = () => {
      if (!input.value || !input.value.trim()) return
      let paddingLeft = getComputedStyle(input).paddingLeft
      let paddingRight = getComputedStyle(input).paddingRight
      const styleList = ['fontSize', 'fontFamily', 'fontWeight']
      paddingLeft = parseInt(paddingLeft)
      paddingRight = parseInt(paddingRight)
      const text = input.value
      const span = document.createElement('span')
      span.style.position = 'fixed'
      span.style.top = 0
      span.style.transform = 'translateY(-100%)'
      span.innerText = text
      styleList.forEach(item => {
        span.style[item] = getComputedStyle(input)[item]
      })

      const usedWidth = input.offsetWidth - paddingLeft - paddingRight
      document.body.appendChild(span)
      if (span.offsetWidth > usedWidth) {
        // span.style.transform = 'translateY(0)'
        const { x, y } = el.getBoundingClientRect()
        span.style.top = `${y}px`
        span.style.left = `${x}px`
        span.classList.add('el-tooltip__popper')
        span.classList.add('is-dark')
        el.addEventListener('mouseleave', () => {
          span.remove()
        })
      } else {
        span.remove()
      }
    }
    el.addEventListener('mouseenter', mouseenterHandler)
  }
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
