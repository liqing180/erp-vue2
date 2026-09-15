<template>
  <el-select
    class="header-search right-menu-item"
    placeholder=" "
    size="small"
    :value="legalEntityId"
    :title="legalEntityName"
    :style="`width: ${getLegalEntityNameWidth(legalEntityName)}px`"
    @change="change"
    :disabled="loading || isDis"
    :key="legalEntityIdKey"
  >
    <el-option
      v-for="dict in legalEntityList"
      :key="dict.id"
      :label="dict.legalEntityName"
      :value="dict.id"
    ></el-option>
  </el-select>
</template>

<script>
import {
  queryUserOfLegalEntityList,
  refreshLegalEntity,
  querySystemAllUomList
} from '@/api/system/user'
import getTextWidth from 'text-width'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      legalEntityIdKey: Date.now(),
      legalEntityId: '',
      legalEntityName: '',
      legalEntityList: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['topbarRouters', 'legalEntityKey']),

    isDis() {
      const route = this.$route
      let isDis = true
      const { name } = route
      if (route.path === '/index') {
        return false
      }
      if (route.path === '/groupBusinessOverview') {
        return true
      }
      this.topbarRouters.forEach((item1) => {
        if (item1.children && item1.children.length > 0) {
          item1.children.forEach((item2) => {
            if (item2.name === name) {
              isDis = false
            }
            if (item2.children && item2.children.length > 0) {
              item2.children.forEach((item3) => {
                if (item3.name === name) {
                  isDis = false
                }
              })
            }
          })
        }
      })
      return isDis
    }
  },
  watch: {
    legalEntityKey: function (newVal) {
      console.log('2')
      this.queryUserOfLegalEntityList('reload')
    }
  },
  created() {
    this.queryUserOfLegalEntityList()
  },
  inject: ['reload'],
  methods: {
    getLegalEntityNameWidth(legalEntityName) {
      if (!legalEntityName) {
        return 120
      }
      const width1 = getTextWidth(legalEntityName, {
        family:
          'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif',
        size: 12,
        weight: 'normal'
      })
      console.log(width1)
      let num = width1 + 70
      if (num < 120) {
        num = 120
      }
      if (num > 400) {
        num = 400
      }
      return num
    },
    queryUserOfLegalEntityList(type) {
      queryUserOfLegalEntityList().then((res) => {
        this.legalEntityList = res.data || []
        let row = this.legalEntityList.find((item) => item.isDefault) || {}
        if (JSON.stringify(row) === '{}') {
          row = this.legalEntityList[0]
          if (type === 'reload') {
            this.refreshLegalEntity(row.id)
          }
          return
        }
        const legalEntityAddress = row.legalEntityAddress || {}
        this.legalEntityId = row.id
        this.legalEntityName = row.legalEntityName
        this.$store.commit('SET_LEGAL_ENTITY', {
          legalEntityId: row.id,
          legalEntityName: row.legalEntityName,
          currency: row.currency,
          currencyId: row.currencyId,
          currencyCode: row.currencyCode,
          country: legalEntityAddress.country,
          countryId: legalEntityAddress.countryId,
          city: legalEntityAddress.city,
          currencySymbol: row.currencySymbol,
          localization: row.localization,
          isSystemDocking: row.isSystemDocking
        })
        this.querySystemAllUomList()
        this.$nextTick(() => {
          this.legalEntityIdKey = Date.now()
        })
      })
    },
    refreshLegalEntity(legalEntityId, refreshPage = false) {
      const params = {
        legalEntityId
      }
      this.loading = true
      refreshLegalEntity(params)
        .then((res) => {
          let row = this.legalEntityList.find((item) => item.id === legalEntityId) || {}
          if (JSON.stringify(row) === '{}') {
            row = this.legalEntityList[0]
          }
          this.legalEntityId = legalEntityId || row.legalEntityId
          this.legalEntityName = row.legalEntityName
          const legalEntityAddress = row.legalEntityAddress || {}
          this.$store.commit('SET_LEGAL_ENTITY', {
            legalEntityId: row.id,
            legalEntityName: row.legalEntityName,
            currency: row.currency,
            currencyId: row.currencyId,
            currencyCode: row.currencyCode,
            country: legalEntityAddress.country,
            countryId: legalEntityAddress.countryId,
            city: legalEntityAddress.city,
            currencySymbol: row.currencySymbol,
            localization: row.localization,
            isSystemDocking: row.isSystemDocking
          })
          // this.querySystemAllUomList()
          this.loading = false
          if (refreshPage) {
            this.$router.replace({ path: '/index' }).catch(() => {})
            location.reload()
          } else {
            this.reload()
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    querySystemAllUomList() {
      querySystemAllUomList({}).then((res) => {
        this.$store.commit('SET_UOM_LIST', res.data || [])
      })
    },
    change(value) {
      this.refreshLegalEntity(value, true)
    }
  }
}
</script>

<style></style>
