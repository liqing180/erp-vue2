<template>
  <div>
    <div class="input-switch-box">
      <div class="con-left" :title="title">
        <el-input
          :size="size"
          v-if="externalEdit"
          :disabled="true"
          :value="copy_address"
          :title="copy_address"
          maxlength="200"
        />
        <el-input
          :size="size"
          v-else-if="showLatLng"
          :disabled="true"
          :value="copy_latLng"
          maxlength="200"
        />
        <el-input
          v-else
          :disabled="!latLng || disabled"
          v-model="copy_addressEdit"
          maxlength="200"
          :size="size"
        />
      </div>
      <div class="con-right">
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
      :title="$t('mapLang.address')"
      v-dialogDragWidth
      :visible.sync="open"
      width="1200px"
      append-to-body
      @opened="opened"
    >
      <div class="dialog-content-height" @mousewheel.prevent>
        <div v-show="false">
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
                @click.stop="clear"
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
            $t('uiBtn.add')
          }}</el-button>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MapClass from './mapClass'
import emitter from 'element-ui/src/mixins/emitter'
import { queryCountriesName } from '@/api/countries'
const mapClass = new MapClass()
export default {
  mixins: [emitter],
  props: {
    value: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    externalEdit: {
      type: Boolean,
      default: false
    },
    // 对外部显示经纬度
    showLatLng: {
      type: Boolean,
      default: false
    },
    // 是否将国家省份城市与地址分开
    splitCountry: {
      type: Boolean,
      default: false
    },
    address: {
      type: String,
      default: ''
    },
    latLng: {
      type: String,
      default: ''
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
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    return {
      open: false,
      initMap: false,
      inputValue: '',
      pacInputRef: null,
      copy_latLng: '',
      copy_address: '',
      copy_addressEdit: '',

      // 地图点击时临时存储 只有点击 Add 才会更新到外部
      storage_latLng: '',
      storage_address: '',
      addressData: null
    }
  },
  watch: {
    value: {
      handler(val) {
        this.copy_addressEdit = val
      },
      immediate: true
    },
    address: {
      handler(val) {
        this.copy_address = val
      },
      immediate: true
    },
    latLng: {
      handler(val) {
        this.copy_latLng = val
        this.storage_latLng = val
      },
      immediate: true
    },

    copy_addressEdit(val) {
      this.$emit('input', val)
      if (val === undefined) return
      this.dispatch('ElFormItem', 'el.form.change', [val])
    }
  },
  created() {
    console.log('created')
  },
  activated() {
    this.initMap = false
  },
  mounted() {},
  methods: {
    clear() {
      this.inputValue = ''
      this.$nextTick(() => {
        this.$refs.InputRef.focus()
      })
    },
    /** 新增按钮操作 */
    handleOpen() {
      this.reset()
      this.storage_latLng = this.latLng
      this.open = true
    },
    opened() {
      let location
      if (this.latLng) {
        const latLngArr = this.latLng.split(',')
        location = { lat: Number(latLngArr[0]), lng: Number(latLngArr[1]) }
      }
      const center = { lat: 1.3553976, lng: 103.86775 }

      if (this.initMap) {
        mapClass.clearOverlays(mapClass.infoWindow)
        if (location) {
          mapClass.setMarkerOrInfo({
            location,
            address: this.address,
            addressEdit: this.copy_addressEdit
          })
        } else {
          mapClass.setCurrentPosition(mapClass.map)
        }
      } else {
        this.pacInputRef = this.$refs.pacInputRef
        mapClass.initMap({
          dom: this.$refs.olMap,
          center,
          disabled: this.disabled,
          inputWarpDom: this.$refs.pacInputRef,
          inputDom: this.$refs.InputRef,
          backFn: this.backFn,
          splitCountry: this.splitCountry
        })
        this.initMap = true
        if (location) {
          mapClass.setMarkerOrInfo({
            location,
            address: this.address,
            addressEdit: this.copy_addressEdit
          })
        }
      }
    },
    backFn(data) {
      console.log(data, '=====================')

      // const vm = this
      // locationLatitude 位置维度
      // locationLongitude 位置经度
      // vm.$set(vm.form, 'locationCurrent', data.address)
      // vm.$set(vm.form, 'locationLatitude', data.lat)
      // vm.$set(vm.form, 'locationLongitude', data.lng)
      this.storage_latLng = data.lat + ',' + data.lng
      this.storage_address = data.address
      this.addressData = data.addressData
    },
    addClick() {
      if (!this.storage_latLng) {
        this.$modal.msgError(this.$t('ui.reqMsg').replace('$1', this.dlgTitle))
      } else if (this.storage_latLng === this.latLng) {
        this.open = false
      } else {
        if (this.splitCountry) {
          queryCountriesName({ countriesName: this.addressData.country }).then((res) => {
            this.$emit('change', {
              latLng: this.storage_latLng,
              address: this.storage_address,
              addressData: this.addressData
            })
            this.open = false
            // 同个页面多次使用会干扰，目前先每次打开弹窗都重置地图
            this.initMap = false
          })
        } else {
          this.$emit('change', {
            latLng: this.storage_latLng,
            address: this.storage_address
          })
          this.open = false
          // 同个页面多次使用会干扰，目前先每次打开弹窗都重置地图
          this.initMap = false
        }
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
      if (this.initMap) {
        mapClass.clearOverlays(mapClass.infoWindow)
      }
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

.ol-map {
  height: 100%;
  width: 100%;
  background: #999;
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
  margin-top: 16px;
  height: 36px;
  border-radius: 6px;
}

.pac-input:focus {
  border-color: #4d90fe;
}
</style>
<style>
.pac-container {
  z-index: 3000 !important;
}
</style>
