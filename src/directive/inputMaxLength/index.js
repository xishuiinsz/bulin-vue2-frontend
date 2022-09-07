import inputMaxLength from './inputMaxLength'

const install = function (Vue) {
  Vue.directive('inputMaxLength', inputMaxLength)
}

inputMaxLength.install = install
export default inputMaxLength
