<template>
  <div class="waybill_card" style="">
    <el-tabs
      tab-position="left"
      v-model="activeName"
      @tab-click="tabClick"
      class="waybill_card_tabs"
      v-if="tabsList.length > 0"
    >
      <el-tab-pane
        class="waybill_card_tabs_item"
        style="flex-shrink: 0"
        v-for="(item, index) in tabsList"
        :key="index"
        :name="index + ''"
      >
        <div slot="label" style="line-height: 20px; text-align: left">
          <div>{{ $t('login.waybill') + (index + 1) }}</div>
          <div class="tabs-address-label">{{ item.waybillNo }}</div>
        </div>

        <div style="height: 100%">
          <el-tabs v-model="childActiveName" class="tabs" @tab-click="childTabClick">
            <el-tab-pane :label="$t('login.trackingNode')" name="0">
              <TrackingNode ref="trackingNode" :form="item" />
            </el-tab-pane>
            <el-tab-pane :label="$t('login.mapTrack')" name="1">
              <MapRoute ref="mapRoute" :query="item" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- <div style="width: 100%; padding-bottom: 10px; overflow: hidden">
      <el-tabs v-model="childActiveName" class="tabs" @tab-click="childTabClick">
        <el-tab-pane :label="$t('login.trackingNode')" name="0">
          <TrackingNode
            ref="trackingNode"
            :form="{
              dispatchType: this.tabsList[activeName].dispatchType,
              waybillId: this.tabsList[activeName].waybillId
            }"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('login.mapTrack')" name="1">
          <MapRoute
            ref="mapRoute"
            :query="{
              dispatchType: this.tabsList[activeName].dispatchType,
              waybillId: this.tabsList[activeName].waybillId
            }"
          />
        </el-tab-pane>
      </el-tabs>
    </div> -->

    <el-empty style="flex: 1" :image-size="200" :description="$t('login.noData')" v-else></el-empty>
  </div>
</template>

<script>
import TrackingNode from '@/views/homeOrderSearch/trackingNode.vue'
import MapRoute from '@/views/homeOrderSearch/MapRoute.vue'
import { queryWaybillMsg } from '@/api/login'
export default {
  components: {
    TrackingNode,
    MapRoute
  },
  props: {
    orderId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tabsList: [],
      activeName: '0',
      childActiveName: '0'
    }
  },
  methods: {
    init() {
      this.activeName = '0'
      this.childActiveName = '0'
      queryWaybillMsg({ orderId: this.orderId })
        .then((res) => {
          this.tabsList = res.data.waybillTrackingList
          this.$nextTick(() => {
            if (this.$refs.trackingNode) {
              this.$refs.trackingNode[0].init()
            }
          })
        })
        .catch(() => {})
    },
    tabClick(e) {
      this.childActiveName = '0'
      this.$nextTick(() => {
        if (this.$refs.trackingNode) {
          this.$refs.trackingNode[this.activeName].init()
        }
      })
    },
    childTabClick(e) {
      switch (e.name) {
        case '0':
          this.$refs.trackingNode[this.activeName].init()
          break
        case '1':
          this.$refs.mapRoute[this.activeName].init()
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// .waybill_card /deep/ .el-tabs--left {
//   flex-shrink: 0;
//   font-size: 12px;
//   max-width: 120px;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   color: #aaa;
// }
.waybill_card {
  height: 100%;
  .waybill_card_tabs_item {
    height: 100%;
  }
}
.waybill_card /deep/ .waybill_card_tabs {
  height: 100%;
}
.waybill_card /deep/ .el-tabs__content {
  display: flex;
  flex-direction: column;
}

.el-tabs__item.is-active .tabs-address-label {
  color: inherit;
}
.el-tabs__item:hover .tabs-address-label {
  color: inherit;
}
.tabs-address-label {
  font-size: 12px;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #aaa;
}
</style>
