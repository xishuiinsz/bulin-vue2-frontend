<script>
export default {
  name: 'ClipSelectionBox',
  functional: true,
  render(h, context) {
    const { dataRect, keepRatio = false } = context.props
    const { x, y, width, height, draggable, stroke, isFixedSize } = dataRect
    const lineLeng = 12
    const configGroup = { draggable }
    const rectBox = {
      x,
      y,
      width,
      height,
      type: 'rect',
      id: 'rectBox',
      strokeWidth: 1,
      stroke
    }
    if (isFixedSize) {
      return (
        <v-group config={configGroup}>
          <v-rect config={rectBox} />
        </v-group>
      )
    }
    const tlLine = {
      points: [x, y + lineLeng, x, y, x + lineLeng, y],
      type: 'line',
      id: 'tl'
    }
    const tcLine = {
      points: [
        x + width / 2 - lineLeng / 2,
        y,
        x + width / 2 + lineLeng / 2,
        y
      ],
      type: 'line',
      id: 'tc'
    }
    const trLine = {
      points: [x + width - lineLeng, y, x + width, y, x + width, y + lineLeng],
      type: 'line',
      id: 'tr'
    }
    const rcLine = {
      points: [
        x + width,
        y + height / 2 - lineLeng / 2,
        x + width,
        y + height / 2 + lineLeng / 2
      ],
      type: 'line',
      id: 'rc'
    }
    const brLine = {
      points: [
        x + width,
        y + height - lineLeng,
        x + width,
        y + height,
        x + width - lineLeng,
        y + height
      ],
      type: 'line',
      id: 'br'
    }
    const bcLine = {
      points: [
        x + width / 2 - lineLeng / 2,
        y + height,
        x + width / 2 + lineLeng / 2,
        y + height
      ],
      type: 'line',
      id: 'bc'
    }
    const blLine = {
      points: [
        x,
        y + height - lineLeng,
        x,
        y + height,
        x + lineLeng,
        y + height
      ],
      type: 'line',
      id: 'bl'
    }
    const lcLine = {
      points: [
        x,
        y + height / 2 - lineLeng / 2,
        x,
        y + height / 2 + lineLeng / 2
      ],
      type: 'line',
      id: 'lc'
    }
    const vnodesList = [
      rectBox,
      tlLine,
      trLine,
      brLine,
      blLine,
      tcLine,
      rcLine,
      bcLine,
      lcLine
    ]

    if (keepRatio) {
      vnodesList.splice(5, 4)
      Object.assign(configGroup, { keepRatio: true })
    }
    const vnodes = (
      <v-group config={configGroup}>
        {vnodesList.map(node => {
          if (node.type === 'line') {
            Object.assign(node, {
              stroke: 'red',
              strokeWidth: 4,
              lineCap: 'round',
              lineJoin: 'round'
            })
            return <v-line config={node} />
          }
          if (node.type === 'rect') {
            return <v-rect config={node} />
          }
        })}
      </v-group>
    )
    return vnodes
  }
}
</script>
