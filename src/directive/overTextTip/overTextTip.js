/* eslint-disable no-unused-vars */
const map = new Map()

function main(el, binding) {
  let target = [el]
  if (typeof binding.value === 'object') {
    const { selector } = binding.value
    if (typeof selector === 'string') {
      if (selector.includes(',')) {
        const selctorList = selector.split(',')
        target = selctorList.map(mySelector => [...el.querySelectorAll(mySelector)])
        target = target.reduce((a, b) => a.concat(b))
      } else {
        target = el.querySelectorAll(selector)
      }
    }
    const mouseenterHandlerCallback = mouseenterHandler(binding)
    target.length &&
      target.forEach(element => {
        // 注册mouseenter事件
        element.addEventListener('mouseenter', mouseenterHandlerCallback)
        // 注册mouseleave事件
        element.addEventListener('mouseleave', mouseleaveHandler)
        map.set(element, { mouseenterHandlerCallback })
      })
  }
}

function mouseenterHandler(binding) {
  return function () {
    let txt
    if (this instanceof HTMLInputElement === true) {
      txt = this.value
    } else {
      txt = this.textContent
    }
    if (!txt || !txt.trim()) return
    const fontStyleList = ['fontSize', 'fontWeight', 'fontFamily']
    const computedStyleList = ['borderLeftWidth', 'borderRightWidth', 'paddingLeft', 'paddingRight']
    let usedWidth = computedStyleList.map(item => getComputedStyle(this)[item])
    usedWidth = usedWidth.map(item => parseInt(item, 10))
    usedWidth = usedWidth.reduce((a, b) => a + b)
    // 计算出可用宽度
    const usefullWidth = this.offsetWidth - usedWidth
    const divTooltip = document.createElement('div')
    divTooltip.style.position = 'absolute'
    divTooltip.style.top = '-10000px'
    divTooltip.textContent = txt
    fontStyleList.forEach(item => {
      divTooltip.style[item] = getComputedStyle(this)[item]
    })
    document.body.appendChild(divTooltip)
    if (divTooltip.offsetWidth > usefullWidth) {
      const { x, y } = this.getBoundingClientRect()
      divTooltip.style.transform = 'translateY(-100%)'
      divTooltip.classList.add('el-tooltip__popper')
      divTooltip.classList.add('is-dark')
      divTooltip.setAttribute('x-placement', 'top')
      attachArrow(divTooltip)
      divTooltip.style.left = `${x}px`
      divTooltip.style.top = `${y - 12}px`
      const values = map.get(this)
      Object.assign(values, { domToolTip: divTooltip })
    } else {
      divTooltip.remove()
    }
  }
}
// 添加箭头
function attachArrow(element) {
  const arrow = document.createElement('div')
  arrow.classList.add('popper__arrow')
  arrow.style.left = `${element.offsetWidth / 2 - 6}px`
  arrow.setAttribute('x-arrow', '')
  element.appendChild(arrow)
}

// 鼠标离开hover元素事件
function mouseleaveHandler() {
  const values = map.get(this)
  if (values.domToolTip) {
    values.domToolTip.remove()
  }
}

export default {
  inserted(el, binding) {
    main(el, binding)
  },
  update(el, binding) {
    map.forEach(values => {
      if (values.domToolTip) {
        values.domToolTip.remove()
      }
    })
  },
  unbind(el) {
    map.forEach((value, element) => {
      const { mouseenterHandlerCallback } = value
      // 卸载mouseenter事件
      element.removeEventListener('mouseenter', mouseenterHandlerCallback)
    })
  }
}
