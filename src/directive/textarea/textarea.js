/**
 *  指令常规使用方法：v-textarea="{ prop: 'mark', row: row, blur: function(){} }"
 *  prop指定当前input关联的数据的属性名，必填项
 *  row指定当前行数据，必填项
 *  blur指定文本域失焦时的回调
 *  rows指定文本域的行数
 *  当下仅支持el-input组件或原生input元素
 */
// 保存数据
const wm = new WeakMap()
// 文本域失焦事件
function textareaBlurevt() {
  const input = wm.get(this)
  const op = wm.get(input)
  if (op) {
    Object.assign(op.row, { [op.prop]: this.value })
    typeof op.blur === 'function' && op.blur(op.prop, op.row)
  }
  this.parentElement.remove()
}
// 输入框聚焦事件
function inputFocusEvt() {
  const textareaWrap = document.createElement('div')
  textareaWrap.classList.add('el-textarea')
  const elTextarea = document.createElement('textarea')
  elTextarea.value = this.value
  let rows = 3
  const op = wm.get(this)
  if (op) {
    if (op.rows) {
      rows = op.rows
    }
    const customClass = op['customClass'] || op['custom-class']
    customClass && textareaWrap.classList.add(customClass)
  }
  elTextarea.classList.add('el-textarea__inner')
  elTextarea.setAttribute('rows', rows)
  elTextarea.setAttribute('autocomplete', 'off')
  elTextarea.style.minHeight = '100px'
  textareaWrap.appendChild(elTextarea)
  textareaWrap.style.position = 'absolute'
  const { x, y } = this.getBoundingClientRect()
  textareaWrap.style.left = `${x}px`
  textareaWrap.style.top = `${y}px`
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
  if (el instanceof HTMLInputElement) {
    binding.value && wm.set(el, binding.value)
    el.addEventListener('focus', inputFocusEvt)
    return
  }
  const input = el.querySelector('input')
  if (input && input instanceof HTMLInputElement) {
    binding.value && wm.set(input, binding.value)
    input.addEventListener('focus', inputFocusEvt)
    return
  }
  throw new Error(`[${binding.rawName}]指令当前不支持非Input元素`)
}
export default {
  inserted(el, binding) {
    if (!binding.value) {
      throw new Error(`[${binding.rawName}]需要指定参数`)
    }
    const keys = ['prop', 'row']
    if (keys.some(key => Object.prototype.hasOwnProperty.call(binding.value, key) === false)) {
      throw new Error(`[${binding.rawName}]需要指定参数${keys.join('、')}`)
    }
    main(el, binding)
  },
  update(el, binding) {},
  unbind(el) {
    if (el instanceof HTMLInputElement) {
      el.removeEventListener('focus', inputFocusEvt)
      return
    }
    const input = el.querySelector('input')
    if (input && input instanceof HTMLInputElement) {
      input.removeEventListener('focus', inputFocusEvt)
    }
  }
}
