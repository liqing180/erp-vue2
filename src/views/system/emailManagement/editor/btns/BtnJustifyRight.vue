<template>
  <button :title="title" class="editor-btn" @click="btnClick($event)">
    <svg viewBox="0 0 1024 1024" class="btn-svg-box">
      <path
        d="M921.6 204.8H102.4v102.4h819.2V204.8z m0 256H409.6v102.4h512V460.8z m0 256h-307.2v102.4h307.2v-102.4z"
      />
    </svg>
  </button>
</template>

<script>
import btnmixin from '../btnmixin'
export default {
  name: 'BtnJustifyRight',
  mixins: [btnmixin]
}
</script>
