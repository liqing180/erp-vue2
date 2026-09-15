<template>
  <button :title="title" class="editor-btn" @click="btnClick($event)">
    <svg viewBox="0 0 1024 1024" class="btn-svg-box">
      <path
        d="M416.256 496.426667L192.938667 379.434667l22.912-80.64 604.16 319.317333-20.352 79.274667-280.106667-146.773334-76.885333 376.618667-110.762667-17.834667 84.352-412.970666z m23.210667-113.664l32.512-159.146667H191.445333l20.437334-97.450667h673.152l-20.394667 97.408h-278.272l-44.544 218.24L439.466667 382.762667z"
      />
    </svg>
  </button>
</template>

<script>
import btnmixin from '../btnmixin'
export default {
  name: 'BtnRemoveFormat',
  mixins: [btnmixin]
}
</script>
