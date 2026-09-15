<template>
  <div>
    <div>
      <ul class="step">
        <li
          class="step-item"
          v-for="(child, index) in statusOverviewList"
          :key="index"
          :style="{ flexBasis: index === 0 ? 'auto' : '20%' }"
        >
          <div class="top" :style="{ justifyContent: index === 0 ? 'flex-end' : 'flex-Start' }">
            <div class="step-item-space" v-if="index !== 0">
              <div style="height: 30px">
                <span v-if="child.timeConsuming && index < statusOverviewList.length - 1">{{
                  child.timeConsuming
                }}</span>
              </div>
              <div
                :class="[
                  'step-item-space-line',
                  handle(child.waybillStatus, child.pendingWaybillStatus) ? 'active' : ''
                ]"
              ></div>
              <div style="height: 30px"></div>
            </div>
            <div
              :class="[
                'step-item-text',
                handle(child.waybillStatus, child.pendingWaybillStatus) ? 'active' : ''
              ]"
            >
              {{ child.value }}
            </div>
          </div>
          <div style="float: right; max-width: 210px">
            <div style="text-align: right; word-wrap: break-word; word-break: normal">
              {{ child.label }}
            </div>
            <div class="mt10" style="text-align: right" v-if="child.createTimeShow">
              {{ child.createTimeShow }}
            </div>
          </div>
        </li>
      </ul>
      <el-row :gutter="20" style="margin-top: 20px; padding: 0 30px">
        <el-col :span="8" style="margin-top: 10px">
          <div></div>
        </el-col>
        <el-col :span="8" style="margin-top: 10px">
          <div>
            {{ $t('BusinessManager.actualShippingDate1') }}:
            {{ info.actualShippingDateShow }}
          </div>
        </el-col>
        <el-col :span="8" style="margin-top: 10px">
          <div>
            {{ $t('BusinessManager.scheduledReceiveDate') }}:
            {{ info.scheduledReceiveDateShow }}
          </div>
        </el-col>
        <el-col :span="8" style="margin-top: 10px">
          <div>
            {{ $t('BusinessManager.actualDeliveryDate') }}:
            {{ info.actualDeliveryDateShow }}
          </div>
        </el-col>
        <el-col :span="8" style="margin-top: 10px">
          <div>{{ $t('BusinessManager.distance') }}: {{ info.distance }}</div>
        </el-col>
        <el-col :span="8" style="margin-top: 10px">
          <div>{{ $t('BusinessManager.timeConsumed') }}: {{ info.timeConsuming }}</div>
        </el-col>
      </el-row>

      <ul class="card">
        <li class="item" v-for="(item, index) in trackingNodeList" :key="index">
          <div class="time">{{ item.timeConsuming }}</div>
          <div class="info">
            <div class="line-card">
              <div class="tag"></div>
              <div class="line"></div>
            </div>
            <div class="content">
              <div>{{ item.createTimeShow }}</div>
              <el-card class="mt20">
                <div style="display: flex; justify-content: space-between; margin-top: 10px">
                  <div
                    style="flex-shrink: 0; font-size: 15px; font-weight: 700; margin-right: 20px"
                    v-if="form.dispatchType === '1'"
                  >
                    {{ item.pendingWaybillStatusShow }}
                  </div>
                  <div
                    style="flex-shrink: 0; font-size: 15px; font-weight: 700; margin-right: 20px"
                    v-else
                  >
                    {{ item.waybillStatusShow }}
                  </div>
                  <div>{{ item.exceptionDescription }}</div>
                </div>
                <el-divider></el-divider>
                <div style="margin-top: 20px">
                  <!-- <div class="">{{ $t('BusinessManager.tripNo') }}: {{ item.tripPlanningNo }}</div> -->
                  <div class="">{{ $t('BusinessManager.vehicleNo') }}：{{ item.vehicleNo }}</div>
                  <div class="mt10">{{ $t('BusinessManager.driver') }}：{{ item.driverName }}</div>
                  <div class="mt10">{{ item.contentText }}</div>
                  <div class="mt10" v-if="item.locationAddressDescription">
                    {{ $t('BusinessManager.pointLocation') }}：{{ item.locationAddressDescription }}
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { queryTrackingNodeMsg, queryMapMsg } from '@/api/login'
export default {
  name: 'TrackingNode',
  props: {
    form: {
      type: Object
    }
  },
  data() {
    return {
      // 步骤条
      statusOverviewList: [],
      // 跟踪节点列表
      trackingNodeList: [],
      info: {}
    }
  },
  methods: {
    init() {
      this.info = {}
      this.trackingNodeList = []
      if (this.form.dispatchType === '1') {
        this.statusOverviewList = [
          {
            status: '2',
            label: this.$t('BusinessManager.stowed'),
            value: this.$t('BusinessManager.sw')
          },
          {
            status: '3',
            label: this.$t('BusinessManager.driverReceived'),
            value: this.$t('BusinessManager.dr')
          },
          {
            status: '5',
            label: this.$t('BusinessManager.pickedUp'),
            value: this.$t('BusinessManager.pu')
          },
          {
            status: '6',
            label: this.$t('BusinessManager.delivered'),
            value: this.$t('BusinessManager.dl')
          },
          {
            status: '6',
            label: this.$t('BusinessManager.completed'),
            value: this.$t('BusinessManager.cp')
          }
        ]
      } else {
        this.statusOverviewList = [
          {
            status: '2',
            label: this.$t('BusinessManager.stowed'),
            value: this.$t('BusinessManager.sw')
          },
          {
            status: '7',
            label: this.$t('BusinessManager.driverReceived'),
            value: this.$t('BusinessManager.dr')
          },
          {
            status: '3',
            label: this.$t('BusinessManager.pickedUp'),
            value: this.$t('BusinessManager.pu')
          },
          {
            status: '6',
            label: this.$t('BusinessManager.delivered'),
            value: this.$t('BusinessManager.dl')
          },
          {
            status: '6',
            label: this.$t('BusinessManager.completed'),
            value: this.$t('BusinessManager.cp')
          }
        ]
      }

      if (this.form.waybillStatus === '10') {
        this.statusOverviewList.splice(4, 1, {
          status: '10',
          label: this.$t('BusinessManager.cancelled'),
          value: this.$t('BusinessManager.ca')
        })
      }
      this.getList()
      this.getMapDistance()
    },
    getMapDistance() {
      const param = {
        waybillId: this.form.waybillId,
        dispatchType: this.form.dispatchType
      }
      queryMapMsg(param).then((response) => {
        const data = response.data || {}
        let startLatLng = null
        let endLatLng = null
        if (data.addressShippingType === '1') {
          startLatLng = this.getLatLng(data.orderAddressShipping.latLng)
        } else {
          startLatLng = this.getLatLng(data.mdmServicePoint.latLng)
        }
        if (data.addressReceiveType === '1') {
          endLatLng = this.getLatLng(data.orderAddressReceive.latLng)
        } else {
          endLatLng = this.getLatLng(data.mdmServicePoint.latLng)
        }

        const directionsService = new window.google.maps.DirectionsService()
        directionsService
          .route({
            origin: startLatLng,
            destination: endLatLng,
            optimizeWaypoints: false, // 重新排序提供的中间航路点以最小化路线
            travelMode: window.google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: false // 是否应提供备选路线
          })
          .then((res) => {
            const text = res.routes[0].legs[0].distance.text
            this.$set(this.info, 'distance', text)
          })
          .catch((e) => {
            // if (e.code === 'UNKNOWN_ERROR') {
            //   this.$modal.msgError(this.$t('errorCode.default'))
            // } else {
            //   this.$modal.msgError(this.$t('mapLang.routeNoFound'))
            // }
            this.$set(this.info, 'distance', '')
          })
      })
    },
    getLatLng(LatLng) {
      // {lat: -34, lng: 151}
      if (LatLng) {
        const data = LatLng.split(',')
        return { lat: Number(data[0]), lng: Number(data[1]) }
      }
      return null
    },
    // 跟踪节点列表
    getList() {
      queryTrackingNodeMsg({
        waybillId: this.form.waybillId,
        dispatchType: this.form.dispatchType
      }).then((res) => {
        this.trackingNodeList = res.data.logList || []
        this.info = Object.assign(this.info, res.data.otherMsg)
        if (res.data.progressBar && res.data.progressBar.length > 0) {
          this.statusOverviewList.forEach((x, i) => {
            res.data.progressBar.forEach((k) => {
              if (this.form.dispatchType === '1') {
                if (x.status.indexOf(k.pendingWaybillStatus) !== -1) {
                  this.$set(this.statusOverviewList, i, Object.assign(x, k))
                }
              } else {
                if (x.status.indexOf(k.waybillStatus) !== -1) {
                  this.$set(this.statusOverviewList, i, Object.assign(x, k))
                }
              }
            })
          })
        }
      })
    },
    // 映射
    handle(status, pendingStatus) {
      if (this.form.dispatchType === '1') {
        return ['2', '3', '5', '6', '10'].indexOf(pendingStatus) !== -1
      } else {
        return ['2', '7', '3', '6', '10'].indexOf(status) !== -1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
ul,
li {
  margin: 0;
  padding: 0;
  text-decoration: none;
  list-style: none;
}
.step {
  display: flex;
  justify-content: space-around;
  padding: 20px 30px;
  &-item {
    flex: 1;
    &-text {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid #999;
    }
    &-space {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 10px;
      &-line {
        width: 100%;
        height: 0;
        border: 1px solid #999;
      }
    }
  }
  .active {
    font-weight: 700;
    color: #409eff;
    border: 1px solid #409eff;
  }
  .top {
    flex: 1;
    display: flex;
    align-items: center;
    height: 62px;
  }
}
.card {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  padding-right: 20px;
  // max-height: 400px;
  // overflow: hidden;
  // overflow-y: auto;
  .item {
    display: flex;
    align-items: center;
    .info {
      flex: 1;
      display: flex;
      margin: 0 20px;
      .content {
        flex: 1;
        padding-bottom: 30px;
      }
      .date {
        display: flex;
      }
    }
    .line-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      width: 50px;
      .tag {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        // background-color: #ccc;
        background-color: #fff;
        border: 3px solid #1890ff;
      }
      .line {
        flex: 1;
        width: 2px;
        background-color: #ccc;
      }
    }
    .time {
      width: 180px;
      flex-shrink: 0;
      text-align: right;
    }
  }
}

.card::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: initial;
}

.card::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(127, 135, 146, 0.5);
}

.card::-webkit-scrollbar-track {
  width: 10px;
  box-shadow: none;
  border-radius: 0;
  background-color: initial;
}
</style>
