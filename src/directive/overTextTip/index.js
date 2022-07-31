import overTextTip from './overTextTip'

const install = function (Vue) {
  Vue.directive('overTextTip', overTextTip)
}

if (window.Vue) {
  window['overTextTip'] = overTextTip
  window.Vue.use(install)
}

overTextTip.install = install
export default overTextTip
