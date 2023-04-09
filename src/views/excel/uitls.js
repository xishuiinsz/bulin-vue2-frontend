export const getParentElementBySelector = (el, className) => {
  if (el === document.body || el === null) {
    return null
  } else if (el.classList.contains(className)) {
    return el
  } else {
    return getParentElementBySelector(el.parentElement, className)
  }
}

export const getElementCenterPoint = el => {
  const { x, y, width, height } = el.getBoundingClientRect()
  return { x: x + width / 2, y: y + height / 2 }
}

export const getTransformByKey = (el, key) => {
  let result = ''
  const transform = el.style.transform
  if (transform) {
    const transformList = transform.split(' ')
    const [transformer] = transformList.filter(item => item.startsWith(key))
    if (transformer) {
      const reg = /(?<=\()[^\(\)]+(?=\))/g
      const resultList = transformer.match(reg)
      if (resultList) {
        result = resultList[0]
      }
    }
  }
  return result
}

export const getDistanceByPoints = (point1, point2) => {
  const dx = point1.x - point2.x
  const dy = point1.y - point2.y
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
}
// 获取三点夹角(p所在的角)
export const getAngle = (p, p1, p2) => {
  const p_p1 = getDistanceByPoints(p, p1)
  const p_p2 = getDistanceByPoints(p, p2)
  const p2_p1 = getDistanceByPoints(p2, p1)
  const cosP = (p_p1 * p_p1 + p_p2 * p_p2 - p2_p1 * p2_p1) / (2 * p_p1 * p_p2)
  const angle = Math.round((Math.acos(cosP) * 180) / Math.PI)
  const direct = p1.x * p2.y - p1.y * p2.x
  return direct < 0 ? -angle : angle
}
