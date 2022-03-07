<script>
export default {
  name: 'ClipSelectionBox',
  functional: true,
  render(h, context) {
    const { dataRect, keepRatio = false } = context.props
    const { x, y, width, height } = dataRect
    const lineLeng = 12
    const tlLine = {
      points: [x, y + lineLeng, x, y, x + lineLeng, y],
      type: 'line'
    }
    const tcLine = {
      points: [
        x + width / 2 - lineLeng / 2,
        y,
        x + width / 2 + lineLeng / 2,
        y
      ],
      type: 'line'
    }
    const trLine = {
      points: [x + width - lineLeng, y, x + width, y, x + width, y + lineLeng],
      type: 'line'
    }
    const rcLine = {
      points: [
        x + width,
        y + height / 2 - lineLeng / 2,
        x + width,
        y + height / 2 + lineLeng / 2
      ],
      type: 'line'
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
      type: 'line'
    }
    const bcLine = {
      points: [
        x + width / 2 - lineLeng / 2,
        y + height,
        x + width / 2 + lineLeng / 2,
        y + height
      ],
      type: 'line'
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
      type: 'line'
    }
    const vnodesList = [
      dataRect,
      tlLine,
      tcLine,
      trLine,
      rcLine,
      brLine,
      bcLine,
      blLine
    ]
    if (keepRatio) {
      vnodesList.splice(2, 1)
      vnodesList.splice(3, 1)
    }
    const vnodes = (
      <v-group config={{ draggable: true }}>
        {vnodesList.map(node => {
          if (node.type === 'line') {
            Object.assign(node, {
              stroke: 'red',
              strokeWidth: 4,
              lineCap: 'round',
              lineJoin: 'round',
              type: 'line'
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
