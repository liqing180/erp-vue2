<template>
  <button :title="title" class="editor-btn" @click="btnClick($event)">
    <svg viewBox="0 0 1024 1024" class="btn-svg-box">
      <path
        d="M102.4 204.8h819.2v102.4H102.4V204.8z m0 256h512v102.4H102.4V460.8z m0 256h307.2v102.4H102.4v-102.4z"
      />
    </svg>
  </button>
</template>

<script>
import btnmixin from '../btnmixin'
export default {
  name: 'BtnJustifyLeft',
  mixins: [btnmixin]
}
</script>
