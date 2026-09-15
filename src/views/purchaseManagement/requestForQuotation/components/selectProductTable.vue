<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.product')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('PURCHASE.pendInquiryProduct')" name="1" v-if="showPendProduct">
          <pendInquiryProductTable
            ref="pendInquiryProductTable"
            @onSuccess="onSuccess"
            @noData="updateActiveName"
            :rfqId="rfqId"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('PURCHASE.all')" name="2" v-if="showOtherProduct">
          <allProductTable ref="allProductTable" />
        </el-tab-pane>
        <!-- :label="$t('PURCHASE.supplierProduct')" -->
        <el-tab-pane name="3" :disabled="rfqVendorList.length <= 0" v-if="showOtherProduct">
          <span slot="label">
            <el-tooltip
              :disabled="rfqVendorList.length > 0"
              :content="$t('PURCHASE.selectSupplierToAdd')"
              placement="top"
            >
              <span>
                {{ $t('PURCHASE.supplierProduct') }}
              </span>
            </el-tooltip>
          </span>

          <supplierProductTable ref="supplierProductTable" :rfqVendorList="rfqVendorList" />
        </el-tab-pane>
      </el-tabs>
    </el-row>

    <!-- <div v-show="activeName === '1'">
    </div>
    <div v-show="activeName === '2'">
    </div>
    <div v-show="activeName === '3'">
    </div> -->

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('uiBtn.save') }} </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pendInquiryProductTable from './pendInquiryProductTable.vue'
import allProductTable from './allProductTable.vue'
import supplierProductTable from './supplierProductTable.vue'

export default {
  directives: {},
  components: { pendInquiryProductTable, allProductTable, supplierProductTable },
  props: {
    warehouseId: {
      type: String,
      default: ''
    },
    rfqId: {
      type: String,
      default: ''
    },
    rfqVendorList: {
      type: Array,
      default() {
        return []
      }
    },
    showOtherProduct: {
      type: Boolean,
      default: true
    },
    showPendProduct: {
      type: Boolean,
      default: true
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
      visible: false,
      activeName: '1',
      form: {},
      type: undefined
    }
  },

  computed: {},
  watch: {},
  created() {},
  updated() {},
  methods: {
    handleAdd(data = {}) {
      this.form = data
      console.log(this.form, '===================109')
      this.visible = true
      this.$nextTick(() => {
        this.$refs.pendInquiryProductTable &&
          this.$refs.pendInquiryProductTable.handleAdd(
            this.form.pendProduct.selectList,
            this.form.pendProduct.tableList,
            'init'
          )

        this.$refs.allProductTable &&
          this.$refs.allProductTable.handleAdd(this.form.other.tableList, 'init')
        this.$refs.supplierProductTable &&
          this.$refs.supplierProductTable.handleAdd(this.form.other.tableList, 'init')
      })
    },
    updateActiveName() {
      this.activeName = '2'
      this.handleTabClick()
    },
    handleTabClick() {
      const { other, pendProduct } = this.form
      if (this.activeName === '1') {
        this.$refs.pendInquiryProductTable &&
          this.$refs.pendInquiryProductTable.handleAdd(
            pendProduct.selectList,
            pendProduct.tableList
          )
      } else if (this.activeName === '2') {
        this.$refs.allProductTable && this.$refs.allProductTable.handleAdd(other.tableList)
      } else if (this.activeName === '3') {
        this.$refs.supplierProductTable &&
          this.$refs.supplierProductTable.handleAdd(other.tableList)
      }
    },

    handleBack() {
      const vm = this
      vm.visible = false
    },
    closed() {
      this.activeName = '1'
      this.form = {}
    },
    onSuccess(arr, data) {
      this.$emit('updateTableForPendRFQ', arr, data)
      this.visible = false
    },
    updateTable(data) {
      this.$refs.pendInquiryProductTable.submit(data)
    },
    submit() {
      if (this.btnLoading) return
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 2000)
      // let arr = []
      // if (this.activeName === '1') {
      //   this.$refs.pendInquiryProductTable.submit()
      // } else {
      //   if (this.activeName === '2') {
      //     arr = this.$refs.allProductTable.submit()
      //   } else if (this.activeName === '3') {
      //     arr = this.$refs.supplierProductTable.submit()
      //   }
      //   this.$emit('onSuccess', arr)
      //   this.visible = false
      // }

      if (this.showOtherProduct) {
        let list1 = []
        let list2 = []
        if (this.$refs.allProductTable) {
          list1 = this.$refs.allProductTable.submit()
        }
        if (this.$refs.supplierProductTable) {
          list2 = this.$refs.supplierProductTable.submit()
        }
        // console.log(list1, '=========================182')
        // console.log(list2, '=========================183')

        const mergeAndFilter = (arr1, arr2) => {
          const map = new Map()

          // 先放入 list1，再放入 list2（后放入的会覆盖前面的）
          arr1.forEach((item) => map.set(item.productId, item))
          arr2.forEach((item) => map.set(item.productId, item))

          // 将 Map 的值转换回数组
          return Array.from(map.values())
        }

        const list = mergeAndFilter(list1, list2)
        console.log(list, '=========================202')

        // return
        if (!this.showPendProduct) {
          this.$emit('onSuccess', list)
          this.visible = false
        } else {
          if (
            this.$refs.pendInquiryProductTable &&
            this.$refs.pendInquiryProductTable.selectList &&
            this.$refs.pendInquiryProductTable.selectList.length > 0
          ) {
            this.$emit('updateTable1', list)
          } else {
            this.$emit('onSuccess', list)
            this.visible = false
          }
        }
      } else {
        if (
          this.$refs.pendInquiryProductTable &&
          this.$refs.pendInquiryProductTable.selectList &&
          this.$refs.pendInquiryProductTable.selectList.length > 0
        ) {
          this.$emit('updateTable1', this.form.pendProduct.tableList)
        } else {
          this.$emit('onSuccess', [])
          this.visible = false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}

.tree-box {
  flex-shrink: 0;
  position: relative;
  max-height: 600px;
  margin-right: 20px;
  //  transition: width 0.28s;
  border: 1px solid #ccc;
}
.tree {
  min-height: 200px;
  max-height: 500px;
  overflow: hidden auto;
  border-radius: 5px;
}
.collapse-warp {
  position: absolute;
  top: 50%;
  right: -4px;
  z-index: 300;
  font-size: 16px;
  // background-color: #888;
  // right: 100%;
  // border: 1px solid #000;
  background-color: #fff;
  border-radius: 4px;
}
.tree::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: initial;
}

.tree::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(127, 135, 146, 0.5);
}

.tree::-webkit-scrollbar-track {
  width: 10px;
  box-shadow: none;
  border-radius: 0;
  background-color: initial;
}
</style>
