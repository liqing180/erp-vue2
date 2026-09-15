<template>
  <div>
    <el-collapse v-model="activeNames">
      <div class="form-card">
        <el-collapse-item name="1">
          <FormCollapseItemTitle slot="title" :title="$t('PURCHASE.supplier')">
          </FormCollapseItemTitle>
          <div>
            <SupplierTable
              :rfqVendorList="initRfqVendorList"
              :comDisFrom="true"
              :showPdf="true"
              @handlePdfRow="handlePdfRow"
              :loading="loading"
            />
          </div>
        </el-collapse-item>
      </div>
      <div class="form-card mt10">
        <el-collapse-item name="2">
          <FormCollapseItemTitle slot="title" :title="$t('PURCHASE.productInfo')">
          </FormCollapseItemTitle>
          <div>
            <ProductTable
              ref="ProductTable"
              :rfqProductList="initRfqDetailList"
              :linkPR="mergeForm.rfqType === '2'"
              :comDisFrom="true"
              :loading="loading"
            />
          </div>
        </el-collapse-item>
      </div>
    </el-collapse>
  </div>
</template>

<script>
import SupplierTable from '@/views/purchaseManagement/requestForQuotation/supplierTable.vue'
import ProductTable from '@/views/purchaseManagement/requestForQuotation/productTable.vue'
import { mergeRFQDetail, preview } from '@/api/purchaseManagement/requestForQuotation'
import { getToken } from '@/utils/auth'
export default {
  components: {
    SupplierTable,
    ProductTable
  },
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    rfqDetailList: {
      type: Array,
      default() {
        return []
      }
    },
    rfqVendorList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  created() {
    console.log('created')
    setTimeout(() => {
      this.mergeRFQDetail()
    }, 200)
  },
  data() {
    return {
      loading: true,
      mergeForm: {},
      initRfqVendorList: [],
      initRfqDetailList: [],
      activeNames: ['1', '2']
    }
  },
  methods: {
    mergeRFQDetail() {
      this.loading = true

      let param = { ...this.form }
      param.rfqDetailList = this.rfqDetailList
      param.rfqVendorList = this.rfqVendorList
      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
      mergeRFQDetail(param)
        .then((res) => {
          const data = res.data || {}
          this.mergeForm = data
          this.initRfqVendorList = data.rfqVendorList.map((item) => {
            // item.pdfLoading = false
            this.$set(item, 'pdfLoading', false)
            return item
          })
          this.initRfqDetailList = data.mergeRfqDetailList

          this.loading = false
          console.log(res)
        })
        .catch(() => {
          this.loading = false
        })
    },
    handlePdfRow(row) {
      let param = { ...this.form }
      param.rfqDetailList = this.rfqDetailList
      param.rfqVendorList = [row]
      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
      const token = getToken()

      if (row.rfqId) {
        const myUrl =
          process.env.VUE_APP_BASE_API +
          '/purchase/requestForQuotation/preview' +
          `/${row.rfqId}/${row.rfqVendorId}` +
          '?token=' +
          `${token}`
        window.open(myUrl, 'print')
      } else {
        this.$set(row, 'pdfLoading', true)

        preview(param)
          .then((res) => {
            this.$set(row, 'pdfLoading', false)
            const fileID = res.data || ''
            if (fileID) {
              const myUrl =
                process.env.VUE_APP_BASE_API +
                '/system/oss/filePreview/' +
                `${fileID}` +
                '?token=' +
                `${token}`
              window.open(myUrl, 'print')
            }
          })
          .catch(() => {
            this.$set(row, 'pdfLoading', false)
          })
      }
    }
  }
}
</script>

<style></style>
