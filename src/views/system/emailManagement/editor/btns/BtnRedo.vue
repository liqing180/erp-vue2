<template>
  <button :title="title" class="editor-btn" @click="btnClick($event)">
    <svg viewBox="0 0 1024 1024" class="btn-svg-box">
      <path
        d="M681.344 425.344a32 32 0 0 0-3.648 40.832l3.648 4.48a32 32 0 0 0 40.832 3.648l4.48-3.648 128-128a32 32 0 0 0 3.648-40.832l-3.648-4.48-128-128a32 32 0 0 0-48.96 40.832l3.648 4.48L754.816 288H448a288 288 0 0 0-13.568 575.68L448 864h384a32 32 0 0 0 5.76-63.488L832 800H448a224 224 0 0 1-12.288-447.68L448 352h306.816l-73.472 73.344z"
      />
    </svg>
  </button>
</template>

<script>
import btnmixin from '../btnmixin'
export default {
  name: 'BtnBackColor',
  mixins: [btnmixin]
}
</script>
