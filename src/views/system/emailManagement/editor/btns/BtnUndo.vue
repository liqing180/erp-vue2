<template>
  <button :title="title" class="editor-btn" @click="btnClick($event)">
    <svg viewBox="0 0 1024 1024" class="btn-svg-box">
      <path
        d="M596.16 284.064h-337.6l101.376-101.44a31.968 31.968 0 1 0-45.248-45.216L178.56 273.504c-11.904 11.872-18.496 27.84-18.56 44.8a63.04 63.04 0 0 0 18.56 45.28l136.128 136.16a31.904 31.904 0 0 0 45.248 0 31.968 31.968 0 0 0 0-45.248L253.184 348H596.16c114.88 0 208.32 93.312 208.32 208s-93.44 208-208.32 208H372.8a32 32 0 0 0 0 64h223.36c150.144 0 272.32-122.016 272.32-272 0-149.984-122.176-272-272.32-272"
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
