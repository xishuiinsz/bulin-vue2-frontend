/* eslint-disable no-unused-vars */
function getWestChar(text) {
  const reg = /[^ -~]/g
  const _text = text.replace(reg, '01')
  return _text.length
}
// 监听 粘贴 事件
function pasteEvt(option) {
  return e => {
    Object.assign(option, { flagPaste: true })
    // event.preventDefault()
    const pasteValue = (e.clipboardData || window.clipboardData).getData('text')
    const length = getWestChar(pasteValue)
    console.log(length)
    console.log(option)
  }
}
// 监听 输入 事件
function inputEvt(option) {
  return e => {
    console.log(e, option)
  }
}
export default {
  inserted(el, binding) {
    let inputEl
    if (el instanceof HTMLInputElement) {
      inputEl = el
    }
    const child = el.querySelector('input')
    if (child && child instanceof HTMLInputElement) {
      inputEl = child
    }
    if (!inputEl) {
      throw new Error(`[${binding.rawName}]指令必须绑定Input或包含Input的元素`)
    }
    if (!binding.value || !binding.value.maxlength) {
      throw new Error(`[${binding.rawName}]指令必须指定maxlength值`)
    }
    const option = binding.value || {}
    window.addEventListener('paste', pasteEvt(option))
    window.addEventListener('input', inputEvt(option))
  }
}
