<template>
  <div style="padding-bottom: 20px">
    <!-- <div>
      <el-radio-group v-model="radioValue" @change="radioChange" :disabled="!editAuth">
        <el-radio v-for="dict in dict.type.dp_type_vendor" :key="dict.value" :label="dict.value">
          {{ dict.label }}</el-radio
        >
      </el-radio-group>
    </div> -->

    <el-checkbox
      :label="$t('organization.all')"
      class="mt10"
      v-model="isAll"
      @change="allChange"
      :disabled="!editAuth"
    ></el-checkbox>
    <el-checkbox-group v-model="checkedValue" @change="checkboxChange" :disabled="!editAuth">
      <el-checkbox
        v-for="(item, index) in checkboxList"
        :key="index"
        :label="item.warehouseId"
        class="mt10"
        >{{ item.warehouseName }}</el-checkbox
      >
    </el-checkbox-group>
  </div>
</template>

<script>
import {
  getRoleDpForWarehouse
  //  getRoleDataPermissionsType
} from '@/api/organization/role'
export default {
  dicts: ['dp_type_vendor'],
  props: {
    comDisFrom: Boolean,
    formData: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  data() {
    return {
      radioValue: '0',
      checkedValue: [],
      checkboxList: [],
      roleId: '',
      timeId: '',
      isAll: false
    }
  },
  computed: {
    editAuth() {
      if (this.comDisFrom) {
        return false
      }
      return this.checkPermi(['organization:role:warehouse:edit'])
    }
  },
  watch: {
    'formData.dpTypeWarehouse': {
      immediate: true,
      handler: function (newVal) {
        // this.radioValue = newVal || '0'
        if (this.formData && this.formData.roleId) {
          this.isAll = newVal === '0'
        }
      }
    }
  },
  created() {
    this.roleId = this.$route.query.roleId
    this.timeId = this.$route.query.timeId
    this.getList()
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.roleId = this.$route.query.roleId
      this.getList()
    }
  },
  methods: {
    getList() {
      // if (this.roleId) {
      // getRoleDataPermissionsType(this.roleId).then((res) => {
      //   const data = res.data || {}
      //   this.isAll = data.dpTypeWarehouse === '0'
      // })
      // }

      getRoleDpForWarehouse({ roleId: this.roleId }).then((res) => {
        const { warehouseList, warehouseIdList } = res.data
        this.checkboxList = warehouseList || []
        this.checkedValue = warehouseIdList || []
        if (!this.roleId) {
          this.isAll = true
          this.allChange(true)
        }
      })
    },
    radioChange(e) {},
    selectChange(e) {
      this.value = e
    },
    allChange(e) {
      if (e) {
        this.checkedValue = this.checkboxList.map((x) => x.warehouseId)
      } else {
        this.checkedValue = []
      }
    },
    checkboxChange(e) {
      this.isAll = this.checkboxList.length === this.checkedValue.length
    },
    submitForm() {
      this.radioValue = this.isAll ? '0' : '1'
      return {
        dpTypeWarehouse: this.radioValue,
        roleId: this.roleId,
        warehouseIdList: this.checkedValue
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
