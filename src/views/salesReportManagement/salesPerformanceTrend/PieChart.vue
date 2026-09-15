<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts' // echarts theme
import resize from '@/views/dashboard/mixins/resize'
require('echarts/theme/macarons')

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.initChart()
    // })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(data) {
      const options = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: data.legendData || [],
          left: '3%',
          icon: 'roundRect'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },

        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisTick: {
            alignWithLabel: true
          },
          data: data.xAxisData || []
        },
        yAxis: {
          name: data.yAxisTitle || '',
          type: 'value'
        },
        series: data.series || []
      }
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }

      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption(options)
    }
  }
}
</script>
