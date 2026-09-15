<template>
  <div class="flexSb flex-1 flow1" style="width: 100%">
    <div class="flow1" :title="row.productName">{{ row.productName }}</div>
    <div
      v-if="row.defaultImageUrl"
      style="flex-shrink: 0; line-height: 0; width: 30px; height: 30px"
    >
      <el-image
        style="width: 100%; height: 100%"
        fit="contain"
        :src="row.defaultImageUrl"
        :preview-src-list="
          row.commonFileListForImage && row.commonFileListForImage.length > 0
            ? row.commonFileListForImage.map((x) => x.url)
            : [row.defaultImageUrl]
        "
        @click.stop="preview"
      >
      </el-image>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      index: 0
    }
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    preview() {}
  }
}
</script>

<style scoped>
.flow1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
