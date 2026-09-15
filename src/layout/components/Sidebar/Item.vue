<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon} />)
    }
    const titleStr = context.parent.getMenuTitle(title)
    if (titleStr) {
      if (titleStr.length > 5) {
        vnodes.push(
          <span slot="title" title={titleStr}>
            {titleStr}
          </span>
        )
      } else {
        vnodes.push(<span slot="title">{titleStr}</span>)
      }
    }
    return vnodes
  }
}
</script>
