/**
 *  指令常规使用方法：v-textarea="{ prop: 'mark', row: row }"
 *  prop指定当前input关联的属性，
 *  row指定当前行数据
 */
// 保存数据
const wm = new WeakMap()
// 文本域失焦事件
function textareaBlurevt() {
  const input = wm.get(this)
  const value = wm.get(input)
  if (value) {
    Object.assign(value.row, { [value.prop]: this.value })
  }
  this.parentElement && this.parentElement.remove()
}
// 输入框聚焦事件
function focusInputEvt() {
  const textareaWrap = document.createElement('div')
  textareaWrap.classList.add('el-textarea')
  const elTextarea = document.createElement('textarea')
  elTextarea.value = this.value
  elTextarea.setAttribute('rows', 3)
  elTextarea.setAttribute('autocomplete', 'off')
  elTextarea.style.minHeight = '100px'
  elTextarea.classList.add('el-textarea__inner')
  textareaWrap.appendChild(elTextarea)
  textareaWrap.style.position = 'absolute'
  const { x, y } = this.getBoundingClientRect()
  textareaWrap.style.left = `${x + 1}px`
  textareaWrap.style.top = `${y + 1}px`
  textareaWrap.style.width = getComputedStyle(this).width
  document.body.appendChild(textareaWrap)
  setTimeout(() => {
    elTextarea.focus()
  })
  elTextarea.addEventListener('blur', textareaBlurevt)
  wm.set(elTextarea, this)
}
// 主函数
function main(el, binding) {
  const [child] = el.children
  if (child && child instanceof HTMLInputElement) {
    binding.value && wm.set(child, binding.value)
    child.addEventListener('focus', focusInputEvt)
  }
}
export default {
  inserted(el, binding) {
    const keys = ['prop', 'row']
    if (!binding.value || keys.some(key => Object.prototype.hasOwnProperty.call(binding.value, key) === false)) {
      throw new Error(`${keys.join('|')} 未指定`)
    }
    main(el, binding)
  },
  update(el, binding) {},
  unbind(el) {
    const [child] = el.children
    if (child && child instanceof HTMLInputElement) {
      child.removeEventListener('focus', focusInputEvt)
    }
  }
}
