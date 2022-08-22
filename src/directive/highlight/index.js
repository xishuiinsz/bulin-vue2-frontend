import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css' // 样式
const install = function (Vue) {
  Vue.directive('highlight', function (el) {
    const blocks = el.querySelectorAll('pre code')
    blocks.forEach(block => {
      hljs.highlightBlock(block)
    })
  })
}

export default install
