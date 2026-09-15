<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    title=""
    :visible.sync="visible"
    width="1200px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div style="display: flex">
      <el-radio-group v-model="type" size="medium" class="radio-card" @input="radioChange">
        <el-radio-button label="imageForLogistics">{{ $t('PURCHASE.order') }}</el-radio-button>
        <el-radio-button label="imageForShippingAgent">{{
          $t('PURCHASE.shippingAgent')
        }}</el-radio-button>
      </el-radio-group>
    </div>

    <div class="mt20" style="display: flex; justify-content: end; padding-right: 50px">
      <div v-for="(item, index) in legendData" :key="index" effect="plain" class="mr20">
        <span class="mark" :style="{ backgroundColor: tagColors[index] }"></span>
        {{ item }}
      </div>
    </div>

    <div style="height: 500px">
      <div ref="chart" style="width: 100%; height: 500px"></div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryImageForProductDocumentLogistics } from '@/api/reportManagement/inventoryCostAnalysis'
import * as echarts from 'echarts'

export default {
  name: 'chartDlg',
  data() {
    return {
      visible: false,
      form: {},
      queryParams: {},
      legendData: [this.$t('PURCHASE.purchaseCost'), this.$t('PURCHASE.deliveryTimeDays')],
      tagColors: ['#409EFF', '#0000F7'],
      chart: null,
      type: 'imageForLogistics'
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  created() {},
  methods: {
    openChart(row = {}) {
      this.type = 'imageForLogistics'
      this.visible = true
      const { productId, documentId } = row
      this.$set(this.queryParams, 'productId', productId || undefined)
      this.$set(this.queryParams, 'documentId', documentId || undefined)
      this.queryImageForProductDocumentLogistics()
    },
    queryImageForProductDocumentLogistics() {
      queryImageForProductDocumentLogistics(this.queryParams).then((res) => {
        this.form = res.data || {}
        this.$nextTick(() => {
          if (this.form && this.form[this.type]) {
            this.chart = echarts.init(this.$refs.chart)
            const params = this.handler(this.form[this.type])
            this.setOptions(params)
          }
        })
      })
    },
    radioChange() {
      this.chart && this.chart.clear()
      if (this.form && this.form[this.type]) {
        const params = this.handler(this.form[this.type])
        this.setOptions(params)
      }
    },
    handler(row) {
      const that = this
      const { imageXList, imageColumnList } = row
      const { currencySymbol } = this.form

      if (!(imageXList && imageXList.length > 0)) return
      const barWidth = 30
      let xAxisData = []
      const barObj = {
        type: 'bar',
        name: that.$t('PURCHASE.purchaseCost'),
        data: [],
        itemStyle: {
          color: that.tagColors[0]
        },
        barWidth,
        markLine: {},
        label: {
          show: true,
          position: 'top',
          distance: 10,
          formatter(params) {
            return that.$numberStr(params.value, 2)
          },
          textStyle: {
            color: '#000'
          }
        }
      }
      const lineObj = {
        name: that.$t('PURCHASE.deliveryTimeDays'),
        data: [],
        type: 'line',
        connectNulls: true,
        yAxisIndex: 1,
        itemStyle: {
          normal: {
            color: that.tagColors[1],
            lineStyle: {
              color: that.tagColors[1]
            }
          }
        },
        label: {
          show: true,
          position: 'top',
          formatter(params) {
            return params.value
          }
        }
      }
      if (this.type === 'imageForLogistics') {
        xAxisData = imageXList.map((x) => x.logisticsNo)
      } else if (this.type === 'imageForShippingAgent') {
        xAxisData = imageXList.map((x) => x.shippingAgentName)
      }
      barObj.data = imageColumnList.map((x) => x.purchaseCost)
      lineObj.data = imageColumnList.map((x) => x.deliveryTimeDays)
      barObj.markLine = {
        symbol: 'none',
        data: [
          {
            name: '',
            yAxis: barObj.data[0],
            silent: true,
            label: {
              // formatter: `${this.$t('SALES.maxProductionRate')} {c}`,
              formatter: '',
              position: 'middle'
            }
          }
        ],
        lineStyle: {
          type: 'dashed',
          color: that.tagColors[0]
        },
        label: {
          distance: [5, 10]
        }
      }
      const seriesData = []
      seriesData.push(barObj)
      seriesData.push(lineObj)
      const perList = imageColumnList.map((x, i) => {
        return [i, x.purchaseCost, barObj.data[0]]
      })
      console.log(perList)
      const customObj = {
        type: 'custom',
        name: 'custom',
        itemStyle: {
          borderWidth: 1
        },
        renderItem: function (params, api) {
          if (params.dataIndex === 0) return
          const { dataIndex } = params
          const { addSubType, floatingPercentage } = imageColumnList[dataIndex]
          if (addSubType === '0') return
          const xValue = api.value(0)
          const highPoint = api.coord([xValue, api.value(1)])
          const lowPoint = api.coord([xValue, api.value(2)])
          // 图标宽高
          const pathWH = 10
          const color = addSubType === '1' ? '#f00' : '#0f0'
          // 图标x,y轴坐标
          // const x = addSubType === '1' ? highPoint[0] + barWidth / 2 : highPoint[0] - pathWH / 2
          // const y = addSubType === '1' ? highPoint[1] : highPoint[1] - pathWH
          // 线条x, y轴上下坐标
          const x1 = addSubType === '1' ? highPoint[0] + (barWidth + pathWH) / 2 : highPoint[0]
          const x2 = addSubType === '1' ? lowPoint[0] + (barWidth + pathWH) / 2 : lowPoint[0]
          const y1 = highPoint[1]
          const y2 = lowPoint[1]
          // 文字x,y轴坐标
          const textX = addSubType === '1' ? highPoint[0] + barWidth : highPoint[0] + pathWH / 2
          const textY = (highPoint[1] + lowPoint[1]) / 2
          // 三角形位置坐标
          let points = []
          if (addSubType === '1') {
            const currentX = highPoint[0] + barWidth / 2
            const currentY = highPoint[1] + pathWH
            points = [
              [currentX, currentY],
              [currentX + pathWH, currentY],
              [currentX + pathWH / 2, currentY - pathWH]
            ]
          } else {
            const currentX = highPoint[0] - pathWH / 2
            const currentY = highPoint[1] - pathWH
            points = [
              [currentX, currentY],
              [currentX + pathWH, currentY],
              [currentX + pathWH / 2, currentY + pathWH]
            ]
          }
          // 图标形状
          // const path =
          //   addSubType === '1'
          //     ? 'M695.79207697 677.93784306l-368.49388885 0c-20.39307156 0-36.88727925-16.36607601-36.88727925-36.75731713 0-9.48357452 3.63710917-18.05558369 9.48357452-24.55002924l182.23253143-243.15182184c12.21094878-16.1043213 35.19960203-19.48333666 51.43754636-7.27421833 2.85916684 2.07939407 5.32478639 4.54684407 7.27421833 7.27421832L725.14704409 619.22790881c12.0791562 16.10615175 8.83010297 39.22476712-7.40418045 51.30575379C711.1166255 675.60035519 703.45435124 677.93784306 695.79207697 677.93784306L695.79207697 677.93784306z'
          //     : 'M328.20792303 346.06215694l368.49388885 0c20.39307156 0 36.88727925 16.36607601 36.88727925 36.75731713 0 9.48357452-3.63710917 18.05558369-9.48357452 24.55002924l-182.23253143 243.15182184c-12.21094878 16.1043213-35.19960203 19.48333666-51.43754636 7.27421833-2.85916684-2.07939407-5.32478639-4.54684407-7.27421833-7.27421832L298.85295591 404.77209119c-12.0791562-16.10615175-8.83010297-39.22476712 7.40418045-51.30575379C312.8833745 348.39964481 320.54564876 346.06215694 328.20792303 346.06215694L328.20792303 346.06215694z'
          // 图标颜色
          const style = api.style({
            stroke: color,
            lineDash: 'dashed'
          })
          return {
            type: 'group',
            children: [
              {
                type: 'polygon',
                shape: {
                  points
                },
                style: {
                  fill: color
                }
              },
              // {
              //   type: 'path',
              //   shape: {
              //     d: path,
              //     x,
              //     y,
              //     height: pathWH,
              //     width: pathWH,
              //     layout: 'cover'
              //   },
              //   style: {
              //     fill: color
              //   }
              // },
              {
                type: 'line',
                transition: ['shape'],
                shape: {
                  x1,
                  y1,
                  x2,
                  y2
                },
                style: style
              },
              {
                type: 'text',
                style: {
                  text: that.$num(floatingPercentage, 2) + '%',
                  fill: color
                },
                scale: [1, 1],
                rotation: 0,
                x: textX,
                y: textY
              }
            ]
          }
        },
        encode: {
          x: 0,
          y: [1, 2]
        },
        data: perList,
        z: 100
      }
      seriesData.push(customObj)
      let maxNum
      if (lineObj.data && lineObj.data.filter((x) => x !== undefined).length > 0) {
        maxNum = Math.max(lineObj.data.filter((x) => x !== undefined))
      }
      console.log(maxNum, '===')
      const yAxisData = [
        {
          type: 'value',
          name: currencySymbol,
          position: 'left',
          alignTicks: true,
          minInterval: 1,
          axisLine: {
            show: true
          },
          splitLine: {
            show: false
          }
        },
        {
          type: 'value',
          name: that.$t('PURCHASE.days1'),
          position: 'right',
          alignTicks: true,
          minInterval: 1,
          min: 0,
          max: maxNum === 0 ? 100 : undefined,
          axisLine: {
            show: true
          },
          axisLabel: {
            // show: maxNum !== 0,
            formatter: function (value) {
              return Math.floor(value)
            }
          },
          splitLine: {
            show: false
          }
        },
        {
          type: 'value',
          name: '',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ]
      const tooltip = {
        trigger: 'axis',
        backgroundColor: '#ffffff',
        textStyle: {
          color: '#333333'
        },
        formatter: function (params) {
          const { dataIndex, axisValue } = params[0]
          const { purchaseCost, deliveryTimeDays } = imageColumnList[dataIndex]
          let res = `<table>
                <tr>
                  <td colspan="2">${axisValue}</td>
                </tr>
                <tr>
                  <td style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color: ${
                    that.tagColors[0]
                  };"></td>
                  <td style="text-align: right;">${that.$t('PURCHASE.purchaseCost')} : </td>
                  <td>${that.$numberStr(purchaseCost, 2)}</td>
                </tr>`
          if (deliveryTimeDays) {
            res += ` <tr>
                  <td style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color: ${
                    that.tagColors[1]
                  };"></td>
                  <td style="text-align: right;">${that.$t('PURCHASE.deliveryTimeDays')} : </td>
                  <td>${deliveryTimeDays}</td>
                </tr>`
          }
          res += '</table>'
          return res
        }
      }
      const params = {
        xAxisData,
        seriesData,
        yAxisData,
        tooltip
      }

      return params
    },
    setOptions(params = {}) {
      const { xAxisData, seriesData, yAxisData, tooltip } = params
      if (!(xAxisData && xAxisData.length > 0)) return
      const endPercent = (10 / xAxisData.length) * 100
      const option = {
        dataZoom: [
          {
            type: 'slider', // 显示拖拽功能
            start: 0, // 滚动条开始位置
            end: endPercent // 滚动条结束位置
          }
        ],
        grid: {
          left: 50,
          right: 60,
          bottom: 60,
          containLabel: true
        },
        xAxis: {
          name: '',
          type: 'category',
          data: xAxisData,
          axisTick: {
            alignWithLabel: true
          }
          // boundaryGap: false
        },
        yAxis: yAxisData,
        series: seriesData,
        tooltip
      }
      this.chart && this.chart.clear()
      this.chart && this.chart.setOption(option)
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    closed() {
      this.chart && this.chart.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
.right-title {
  flex: 1;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  span {
    display: inline-block;
    max-width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.mark {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin-right: 5px;
  vertical-align: middle;
  background-color: #fff;
  border-radius: 50%;
}
</style>
