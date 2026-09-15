<template>
  <button :title="title" class="editor-btn" @click="btnClick($event)">
    <svg viewBox="0 0 1024 1024" class="btn-svg-box">
      <path d="M422.829 156.277h243.336v89.729H422.829zM359.762 796.406h243.336v89.729H359.762z" />
      <path d="M513.709 183h89.389l-84.587 658.271h-80.382" />
    </svg>
  </button>
</template>

<script>
import btnmixin from '../btnmixin'
export default {
  name: 'BtnItalic',
  mixins: [btnmixin]
}
</script>
