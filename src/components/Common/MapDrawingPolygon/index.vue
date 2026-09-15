<template>
  <div>
    <div class="input-switch-box">
      <div class="con-left">
        <el-input
          :disabled="true"
          :value="showText"
          :title="showText"
          maxlength="200"
          :size="size"
        />
      </div>
      <div class="con-right" v-show="iconShow">
        <svg-icon
          @click="handleOpen"
          icon-class="location"
          :style="`height: ${iconSize}px; width: ${iconSize}px; cursor: pointer`"
        />
      </div>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      v-dialogDrag
      :title="dlgTitle"
      v-dialogDragWidth
      :visible.sync="open"
      width="1200px"
      append-to-body
      @opened="opened"
    >
      <div class="dialog-content-height" @mousewheel.prevent>
        <div v-show="false">
          <div ref="btnWarpRef" class="content-btn-warp">
            <el-button v-if="!disabled" type="primary" @click="drawingNewPolygon">{{
              $t('mapLang.createPolygonalGeofencing')
            }}</el-button>
            <el-button v-if="!disabled" type="primary" @click="drawingNewCircle">{{
              $t('mapLang.createCircularGeofencing')
            }}</el-button>
            <el-button v-if="!disabled" type="primary" @click="clear">{{
              $t('uiBtn.clear')
            }}</el-button>
          </div>

          <div ref="pacInputRef" class="input-box">
            <input
              v-show="!disabled"
              v-model="inputValue"
              ref="InputRef"
              class="pac-input"
              clearable
              type="text"
              :placeholder="$t('uiBtn.search')"
            />
            <div class="clear-icon" v-if="inputValue">
              <i
                @click.stop="clearInput"
                class="el-input__icon el-icon-circle-close el-input__clear"
              ></i>
            </div>
          </div>
        </div>

        <div class="ol-map" ref="olMap" id="map"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-form>
          <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
          <el-button v-if="!disabled" type="primary" @click="addClick">{{
            $t('uiBtn.submit')
          }}</el-button>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MapClass from './mapClass'
const mapClass = new MapClass()
export default {
  props: {
    // input 显示文本为空时默认展示geofenceType对应的字典值
    inputText: {
      type: String,
      default: null
    },
    /* 围栏字段 */
    geofenceType: {
      type: String,
      default: ''
    },
    latLngList: {
      type: Array,
      default() {
        return []
      }
    },
    circleLatLng: {
      type: String,
      default: ''
    },
    circleRadius: {
      type: Number,
      default: 0
    },

    /* 显示地址信息 */
    markerText: {
      type: String,
      default: ''
    },
    markerLatLng: {
      type: String,
      default: ''
    },

    iconShow: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    dlgTitle: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    iconSize: {
      type: String,
      default: '26'
    }
  },

  data() {
    return {
      open: false,
      initMap: false,

      // 地图点击时临时存储 只有点击 Add 才会更新到外部
      storage_latLngList: [],
      storage_circleLatLng: undefined,
      storage_circleRadius: undefined,
      inputValue: '',
      pacInputRef: null
    }
  },
  computed: {
    showText() {
      let text = ''
      if (this.inputText !== null) {
        text = this.inputText
      } else if (this.geofenceType === '1') {
        text = this.$t('mapLang.polygon')
      } else if (this.geofenceType === '2') {
        text = this.$t('mapLang.circle')
      }
      return text
    }
  },
  methods: {
    clearInput() {
      this.inputValue = ''
      this.$nextTick(() => {
        this.$refs.InputRef.focus()
      })
    },
    drawingNewPolygon() {
      mapClass.drawingNewPolygon('1')
    },
    drawingNewCircle() {
      mapClass.drawingNewPolygon('2')
    },
    clear() {
      mapClass.clear()
    },
    /** 新增按钮操作 */
    handleOpen() {
      this.reset()
      this.storage_latLngList = (this.latLngList || []).map((item) => {
        return this.getLatLng(item)
      })
      this.storage_circleLatLng = this.getLatLng(this.circleLatLng)
      this.storage_circleRadius = this.circleRadius
      this.open = true
    },
    getLatLng(LatLng) {
      // {lat: -34, lng: 151}
      if (LatLng) {
        const data = LatLng.split(',')
        return { lat: Number(data[0]), lng: Number(data[1]) }
      }
      return null
    },
    getLatLngStr(LatLng) {
      // {lat: -34, lng: 151}
      if (LatLng && LatLng.lat && LatLng.lng) {
        return LatLng.lat + ',' + LatLng.lng
      }
      return null
    },
    opened() {
      const location = this.getLatLng(this.markerLatLng)
      const center = { lat: 1.3553976, lng: 103.86775 }

      mapClass.initMap({
        dom: this.$refs.olMap,
        latLngList: this.storage_latLngList,
        circleLatLng: this.getLatLng(this.circleLatLng),
        circleRadius: this.circleRadius,
        markerLatLng: location,
        markerText: this.markerText,
        center,
        btnWarpDom: this.$refs.btnWarpRef,
        disabled: this.disabled,
        inputWarpDom: this.$refs.pacInputRef,
        inputDom: this.$refs.InputRef,
        backFn: this.backFn
      })
      this.initMap = true
    },
    backFn(data) {
      this.storage_latLngList = data.latLngList
      this.storage_circleLatLng = data.circleLatLng
      this.storage_circleRadius = data.circleRadius
    },
    addClick() {
      const circleLatLngStr = this.getLatLngStr(this.storage_circleLatLng)
      if (this.storage_latLngList.length < 3 && !circleLatLngStr) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.dlgTitle))
      } else {
        let geofenceType
        if (this.storage_latLngList.length > 0) {
          geofenceType = '1'
        } else if (circleLatLngStr) {
          geofenceType = '2'
        }
        this.$emit('change', {
          latLngList: (this.storage_latLngList || []).map((item) => {
            return this.getLatLngStr(item)
          }),
          circleLatLng: geofenceType === '2' ? circleLatLngStr : undefined,
          circleRadius: geofenceType === '2' ? this.storage_circleRadius : undefined,
          geofenceType
        })
        this.cancel()
      }
    },
    cancel() {
      this.open = false
      // 同个页面多次使用会干扰，目前先每次打开弹窗都重置地图
      this.initMap = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.inputValue = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.input-box {
  display: inline-block;
  position: relative;
  .clear-icon {
    position: absolute;
    right: 3px;
    bottom: 3px;
    height: 30px;
    width: 26px;
    background-color: #fff;
    font-size: 16px;
    display: flex;
    align-items: center;
    .el-input__icon {
      position: absolute;
      right: 3px;
      bottom: 3px;
      cursor: pointer;
    }
  }
}
.pac-input {
  background-color: #fff;
  font-family: Roboto;
  font-size: 15px;
  font-weight: 300;
  margin-left: 12px;
  padding: 0 11px 0 13px;
  text-overflow: ellipsis;
  width: 280px;
  margin-top: 10px;
  height: 36px;
  border-radius: 6px;
}

.pac-input:focus {
  border-color: #4d90fe;
}

.input-switch-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .con-left {
    flex: 1;
  }
  .con-right {
    margin-left: 10px;
    line-height: 0;
  }
}

.content-btn-warp {
  margin: 10px;
}

.ol-map {
  height: 100%;
  width: 100%;
  background: #999;
}
</style>
