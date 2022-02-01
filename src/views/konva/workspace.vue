<script>
export default {
  name: 'Workspace',
  functional: true,
  render(h, context) {
    const vnodes = []
    context.props.eleList.forEach(node => {
      if (node.type === 'text') {
        vnodes.push(<v-text config={node} />)
      }
      if (node.type === 'rect') {
        vnodes.push(<v-rect config={node} />)
      }
      if (node.type === 'circle') {
        vnodes.push(<v-circle config={node} />)
      }
      if (node.type === 'line') {
        vnodes.push(<v-line config={node} />)
      }
      if (node.type === 'group') {
        if (node.children && node.children.length) {
          vnodes.push(
            <v-group config={node}>
              <workspace eleList={node.children}></workspace>
            </v-group>
          )
        }
      }
    })
    return vnodes
  }
}
</script>
