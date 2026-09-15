<template>
  <div class="pdf-warp" id="pdfExpoer">
    <!-- 上半部分内容 -->
    <div class="flex">
      <!-- 左边内容 -->
      <div class="flex-1 fs-0 mr40">
        <div class="flex">
          <div class="flex-1">
            <img
              v-if="form.legalEntityTrademarkBase64"
              :src="form.legalEntityTrademarkBase64"
              class="logo"
              alt=""
            />
          </div>
          <div class="fs-0" style="font-size: 16px; font-weight: bold">REQUEST FOR TRIAL MIX</div>
        </div>
        <div class="flexSb">
          <div class="fs-0">To:</div>
          <div>{{ form.plantName }}</div>
          <div class="fs-0">COPY TO TECH,DEPT ISEORET ARY</div>
        </div>
        <div class="flexSb mt10">
          <div class="fs-0 form-label">Attn:</div>
          <div class="flex-1 form-value flexStart">
            {{ form.contactPersonName }}
          </div>
        </div>
        <div class="flexSb">
          <div class="fs-0 form-label">Client:</div>
          <div class="flex-1 form-value flexStart">
            {{ form.businessPartnerName }}
          </div>
        </div>
        <div class="flexSb">
          <div class="fs-0 form-label">Contact Person:</div>
          <div class="flex-1 form-value flexStart">
            {{ form.projectContactPersonNames }}
          </div>
        </div>
        <div class="flexSb">
          <div class="fs-0 form-label">Project:</div>
          <div class="flex-1 form-value flexStart">
            {{ form.projectName }}
          </div>
        </div>
        <div class="flexSb">
          <div class="fs-0 form-label">Location:</div>
          <div class="flex-1 form-value flexStart">
            {{ form.receiveAddressName }}
          </div>
        </div>
        <div class="flexSb">
          <div class="fs-0 form-label">Date/Time of Trial:</div>
          <div class="flex-1 form-value flexStart">
            {{ trialStartTime }}
          </div>
        </div>
        <div class="flexSb">
          <div class="fs-0 form-label">Special Requirement:</div>
          <div class="flex-1 form-value flexStart">
            {{ form.specialRequirement }}
          </div>
        </div>
        <div>
          <div>(non-standard mix design)</div>
          <div>(eg. high earty strength, min. cement content min. w/c)</div>
        </div>
      </div>
      <!-- 右上表格 + 申请人签名 -->
      <div class="flex-1 fs-0 right-top-warp">
        <table class="w100">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Grade</th>
              <th v-for="(th, index) in ageColumns" :key="'th' + index">{{ th.age }}</th>
              <th>Water P</th>
              <th>Spare</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rowItem, index) in comTestQTYtableList" :key="'tr' + index">
              <td>
                <span v-if="!rowItem.isTotal">{{ index + 1 }}</span>
              </td>
              <td>{{ rowItem.mixDesignName }}</td>
              <td v-for="(tdItem, tdIndex) in ageColumns" :key="'tr' + index + 'td' + tdIndex">
                {{ tdItem.mixAgeTestNumData[rowItem.mixDesignId] }}
              </td>
              <td>{{ rowItem.waterP }}</td>
              <td>{{ rowItem.spare }}</td>
              <td>
                <span v-if="rowItem.isTotal">{{ comAllTotal }}</span>
                <span v-else>{{ rowItem.total }}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flexSb mt20">
          <div class="fs-0 form-label">Requester's Name:</div>
          <div class="flex-1 form-value flexStart">
            {{ form.requestBy }}
          </div>
        </div>
        <div class="flexSb mt10">
          <div class="fs-0 form-label">Sign:</div>
          <div class="flex-1 flexStart">
            <div class="fs-0 form-value" style="flex: 6">
              <img
                v-if="form.requestSignatureBase64"
                style="height: 30px"
                :src="form.requestSignatureBase64"
                fit="contain"
              />
            </div>
            <div class="fs-0" style="margin: 0 6px 0 20px">Date:</div>
            <div class="fs-0 form-value" style="flex: 4">{{ parseTime(form.requestTime) }}</div>
          </div>
        </div>
        <div class="flexSb mt10">
          <div class="fs-0 form-label">Approved By:</div>
          <div class="flex-1 flexStart">
            <div class="fs-0 form-value" style="flex: 6">{{ form.approvedBy }}</div>
            <div class="fs-0" style="margin: 0 6px 0 20px">Date:</div>
            <div class="fs-0 form-value" style="flex: 4">{{ parseTime(form.approvedTime) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 下半部分内容 -->
    <div class="mt20" style="font-size: 16px">PRODUCTION</div>
    <div class="flex mt10">
      <div style="flex: 3; margin-right: 20px">
        <table class="w100">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Mix Ref.</th>
              <th>Grade</th>
              <th v-for="(th, index) in materialColumns" :key="'2th' + index">
                {{ th.materialName }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rowItem, index) in tableList" :key="'2tr' + index">
              <td>
                <span>{{ index + 1 }}</span>
              </td>
              <td>{{ rowItem.mixRef }}</td>
              <td>{{ rowItem.mixDesignName }}</td>
              <td
                v-for="(tdItem, tdIndex) in materialColumns"
                :key="'2tr' + index + 'td' + tdIndex"
              >
                {{ $numberStr(tdItem.mixMaterialQtyData[rowItem.mixDesignId], 3, false) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="flex: 2">
        <table class="w100">
          <thead>
            <tr>
              <th>No. of Batches</th>
              <th>Item Code</th>
              <th>Trial Mix Date</th>
              <th>Slump</th>
              <th v-for="(th, index) in ageColumns" :key="'3th' + index">{{ th.age }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rowItem, index) in tableList" :key="'3tr' + index">
              <td>{{ rowItem.productionBatch }}</td>
              <td>{{ rowItem.mixDesignCode }}</td>
              <td>{{ parseTime(rowItem.trialStartTime, fmtForYmd) }}</td>
              <td>{{ $numberStr(rowItem.slump, 3, false) }}</td>
              <td
                style="min-width: 30px"
                v-for="(tdItem, tdIndex) in ageColumns"
                :key="'3tr' + index + 'td' + tdIndex"
              >
                {{ $numberStr(tdItem.mixAgeTestResultData[rowItem.mixDesignId], 3, false) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default {
  props: {
    comTestQTYtableList: {
      type: [Array],
      default() {
        return []
      }
    },
    tableList: {
      type: [Array],
      default() {
        return []
      }
    },
    materialColumns: {
      type: [Array],
      default() {
        return []
      }
    },
    ageColumns: {
      type: [Array],
      default() {
        return []
      }
    },
    comAllTotal: {
      type: [Number],
      default: null
    },
    form: {
      type: [Object],
      default() {
        return {}
      }
    }
  },
  methods: {
    getPdf() {
      const pdfPageWidth = 297
      const pdfPageHeight = 210
      const pdfPadding = 6
      const pdfPageContentWidth = pdfPageWidth - pdfPadding * 2
      const pdfPageContentHeight = pdfPageHeight - pdfPadding * 2

      // 获取页面标题，作为文件名称，也可以使用时间戳生成不重复的文件名使用
      html2Canvas(document.querySelector('#pdfExpoer'), {
        allowTaint: true,
        // 防止页面过宽导致右侧出现黑灰色背景区域
        scale: 2
      })
        .then(function (canvas) {
          const contentWidth = canvas.width
          const contentHeight = canvas.height

          const pageHeight = (contentWidth / pdfPageContentWidth) * pdfPageContentHeight
          let leftHeight = contentHeight
          console.log('contentWidth', contentWidth)
          console.log('contentHeight', contentHeight)
          console.log('pageHeight', pageHeight)
          console.log('pdfPageContentHeight', pdfPageContentHeight)

          let position = 6
          const imgWidth = pdfPageContentWidth
          const imgHeight = (pdfPageContentWidth / contentWidth) * contentHeight
          const pageData = canvas.toDataURL('image/jpeg', 1.0)
          // console.log(pageData)

          const PDF = new JsPDF('landscape', 'mm', 'a4')
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 6, 6, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, 'JPEG', 6, position, imgWidth, imgHeight)
              leftHeight -= pageHeight
              position -= pdfPageContentHeight
              PDF.setFillColor(255, 255, 255)
              PDF.rect(0, pdfPageHeight - 5, 297, 210, 'F')
              PDF.setFillColor(255, 255, 255)
              PDF.rect(0, 0, 297, pdfPadding - 1, 'F')
              if (leftHeight > 0) {
                PDF.addPage()
              }
            }
          }
          // 文件导出生成
          const pdfBlob = PDF.output('blob')
          window.open(URL.createObjectURL(pdfBlob), 'print')
          this.$emit('onSuccess')
        })
        .catch((err) => {
          this.$emit('onSuccess')
          console.log('err', err)
        })
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    trialStartTime() {
      const list = []
      this.tableList.forEach((item) => {
        if (item.trialStartTime) {
          list.push(this.parseTime(item.trialStartTime, this.fmtForYmd))
        }
      })
      const setList = [...new Set(list)]
      return setList.join(' & ')
    }
  }
}
</script>

<style lang="scss">
#pdfExpoer {
  position: absolute;
  top: -9999px;
  right: -9999px;
}
.pdf-warp {
  color: #303133;
  font-size: 12px;
  width: 1200px;
  // min-height: 800px;
  // border: 1px solid #eee;
  background-color: #fff;
  .logo {
    height: 40px;
  }
  .form-label {
    width: 300px;
  }
  .right-top-warp .form-label {
    width: 200px;
  }
  .form-value {
    padding: 4px 0;
    line-height: 1.1;
    min-height: 28px;
    border-bottom: 2px solid #c4c4c4;
  }

  table {
    border-collapse: collapse;
  }
  table,
  th,
  td {
    border: 1px solid #efefef;
    font-size: 12px;
    color: #303133;
  }

  th,
  td {
    padding: 6px 4px;
    text-align: center;
  }
  thead {
    background-color: #001f60;
    th {
      color: #fff !important;
    }
  }
}
</style>
