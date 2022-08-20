import textarea from './textarea'

const install = function (Vue) {
  Vue.directive('textarea', textarea)
}

if (window.Vue) {
  window['textarea'] = textarea
  window.Vue.use(install)
}

textarea.install = install
export default textarea
