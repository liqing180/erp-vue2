<template>
  <div v-loading="loading" :style="'height:' + height">
    <iframe :src="src" frameborder="no" style="width: 100%; height: 100%" scrolling="auto" />
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    otherHeight: {
      type: Number
    }
  },
  watch: {
    otherHeight() {
      this.temp()
    }
  },
  data() {
    return {
      height: document.documentElement.clientHeight - (this.otherHeight || 94.5) + 'px;',
      loading: true,
      url: this.src
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.temp)
  },
  mounted() {
    setTimeout(() => {
      this.loading = false
    }, 300)
    this.temp()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.temp)
  },
  methods: {
    temp() {
      setTimeout(() => {
        const that = this
        that.height = document.documentElement.clientHeight - (that.otherHeight || 94.5) + 'px;'
      }, 100)
    }
  }
}
</script>
