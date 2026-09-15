<template>
  <i-frame :src="url" />
</template>
<script>
import iFrame from '@/components/iFrame/index'
export default {
  name: 'Metabase',
  components: { iFrame },
  data() {
    return {
      url: process.env.VUE_APP_URL + '/metabase'
    }
  }
}
</script>
