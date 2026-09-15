<template>
  <button :title="title" class="editor-btn" @click="btnClick($event)">
    <svg viewBox="0 0 1024 1024" class="btn-svg-box">
      <path
        d="M0.0005 170.581a106.667 106.667 0 1 0 213.333 0 106.667 106.667 0 1 0-213.333 0z m362.667 42.752h618.666a42.667 42.667 0 0 0 0-85.333H362.6675a42.667 42.667 0 0 0 0 85.333zM0.0005 511.915a106.667 106.667 0 1 0 213.333 0 106.667 106.667 0 1 0-213.333 0z m981.333-42.582H362.6675a42.667 42.667 0 0 0 0 85.334h618.666a42.667 42.667 0 0 0 0-85.334zM0.0005 853.248a106.667 106.667 0 1 0 213.333 0 106.667 106.667 0 1 0-213.333 0z m981.333-42.581H362.6675a42.667 42.667 0 0 0 0 85.333h618.666a42.667 42.667 0 0 0 0-85.333z"
      />
    </svg>
  </button>
</template>

<script>
import btnmixin from '../btnmixin'
export default {
  name: 'BtnUnorderList',
  mixins: [btnmixin]
}
</script>
