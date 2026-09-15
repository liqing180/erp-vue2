<template>
  <button :title="title" class="editor-btn" @click="btnClick($event)">
    <svg viewBox="0 0 1025 1024" class="btn-svg-box">
      <path
        d="M448 0C341.96 0 256 85.96 256 192s85.96 192 192 192v320h64V64h64v640h64V64h128V0H448z m320 832v160l192-192-192-192v160H256v64z"
      />
    </svg>
  </button>
</template>

<script>
import btnmixin from '../btnmixin'
export default {
  name: 'BtnDirLtr',
  mixins: [btnmixin]
}
</script>
