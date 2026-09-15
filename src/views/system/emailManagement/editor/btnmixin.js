export default {
  props: {
    title: {
      type: [String, Number],
      default: ''
    }
  },
  methods: {
    btnClick(e) {
      this.$emit('click', e)
    }
  }
}
