export default {
  created() {
    this.$$initColumnVisible(this.saveKey, this.columnsData[0])
    this.$$initColumnVisible('1', this.columnsData[1])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'purchaseQuotationNo',
        label: vm.$t('PURCHASE.purchaseQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        padding: 70,
        sortable: 'custom'
      },
      {
        prop: 'rfqNo',
        label: vm.$t('PURCHASE.requestForQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'purchaseRequisiteNo',
        label: vm.$t('PURCHASE.DocNo'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'costProjectCode',
        label: vm.$t('PURCHASE.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'purchaseQuotationStatus',
        propBy: 'purchaseQuotationStatusStr',
        label: vm.$t('ui.status'),
        visible: true,
        minWidth: 200,
        padding: 50,
        tooltip: true,
        sortable: 'custom'
      },

      /* {
        prop: 'quoteFrom',
        label: vm.$t('PURCHASE.quoteFrom'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      }, */
      {
        prop: 'productName',
        label: vm.$t('PURCHASE.productName'),
        minWidth: 160,
        visible: true,
        tooltip: false
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('PURCHASE.supplierName'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'country',
        label: vm.$t('PURCHASE.country'),
        visible: true,
        minWidth: 120,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'deliveryDate',
        label: vm.$t('PURCHASE.scheduledDeliveryDate'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'receiveAddressName',
        label: vm.$t('PURCHASE.deliveryAddress'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'validity',
        label: vm.$t('PURCHASE.validityDays'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'currency',
        label: vm.$t('ui.currency'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'incotermAbbreviation',
        label: vm.$t('PURCHASE.incoterm'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },

      {
        prop: 'createdBy',
        label: vm.$t('ui.createdBy'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'createdTime',
        label: vm.$t('ui.createdTime'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'modifiedBy',
        label: vm.$t('ui.modifiedBy'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'modifiedTime',
        label: vm.$t('ui.modifiedTime'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      }
      // {
      //   prop: 'approvedBy',
      //   label: vm.$t('ui.approvedBy'),
      //   minWidth: 160,
      //   visible: true,
      //   tooltip: true,
      //   sortable: 'custom'
      // },
      // {
      //   prop: 'approvedTime',
      //   label: vm.$t('ui.approvedTime'),
      //   minWidth: 160,
      //   visible: true,
      //   tooltip: true,
      //   sortable: 'custom'
      // }
    ]
    const columns1 = [
      // {
      //   prop: 'purchaseQuotationNo',
      //   label: vm.$t('PURCHASE.purchaseQuotationNo'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true,
      //   sortable: 'custom'
      // },
      {
        prop: 'rfqNo',
        label: vm.$t('PURCHASE.requestForQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        padding: 70,
        sortable: 'custom'
      },
      {
        prop: 'purchaseRequisiteNo',
        label: vm.$t('PURCHASE.DocNo'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'costProjectCode',
        label: vm.$t('PURCHASE.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'purchaseQuotationStatus',
        propBy: 'purchaseQuotationStatusStr',
        label: vm.$t('ui.status'),
        visible: true,
        minWidth: 200,
        padding: 50,
        tooltip: true,
        sortable: 'custom'
      },

      // {
      //   prop: 'quoteFrom',
      //   label: vm.$t('PURCHASE.quoteFrom'),
      //   visible: true,
      //   minWidth: 160,
      //   tooltip: true,
      //   sortable: 'custom'
      // },
      {
        prop: 'productName',
        label: vm.$t('PURCHASE.productName'),
        minWidth: 160,
        visible: true,
        tooltip: false
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('PURCHASE.supplierName'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'country',
        label: vm.$t('PURCHASE.country'),
        visible: true,
        minWidth: 120,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'deliveryDate',
        label: vm.$t('PURCHASE.scheduledDeliveryDate'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'receiveAddressName',
        label: vm.$t('PURCHASE.deliveryAddress'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'validity',
        label: vm.$t('PURCHASE.validityDays'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'currency',
        label: vm.$t('ui.currency'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'incotermAbbreviation',
        label: vm.$t('PURCHASE.incoterm'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },

      {
        prop: 'createdBy',
        label: vm.$t('ui.createdBy'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'createdTime',
        label: vm.$t('ui.createdTime'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'modifiedBy',
        label: vm.$t('ui.modifiedBy'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'modifiedTime',
        label: vm.$t('ui.modifiedTime'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      }
      // {
      //   prop: 'approvedBy',
      //   label: vm.$t('ui.approvedBy'),
      //   minWidth: 160,
      //   visible: true,
      //   tooltip: true,
      //   sortable: 'custom'
      // },
      // {
      //   prop: 'approvedTime',
      //   label: vm.$t('ui.approvedTime'),
      //   minWidth: 160,
      //   visible: true,
      //   tooltip: true,
      //   sortable: 'custom'
      // }
    ]
    return {
      activeName: '0',
      tabs: [
        {
          name: this.$t('PURCHASE.all'),
          value: '0'
        },
        {
          name: this.$t('PURCHASE.open'),
          value: '1'
        },
        {
          name: this.$t('PURCHASE.valid'),
          value: '7'
        },
        {
          name: this.$t('PURCHASE.notPurchased'),
          value: '9'
        },
        /* {
          name: this.$t('PURCHASE.partiallyConverted'),
          value: '8'
        }, */
        {
          name: this.$t('PURCHASE.purchased'),
          value: '6'
        },
        {
          name: this.$t('PURCHASE.invalid'),
          value: '5'
        },
        {
          name: this.$t('PURCHASE.cancelled'),
          value: '4'
        }
      ],
      badgeKey: Date.now(),
      tabsKey: Date.now(),
      columnsData: {
        0: columns0,
        1: columns1,
        5: columns0,
        6: columns0,
        7: columns0,
        8: columns0,
        9: columns0,
        4: columns0
      },
      searchData: [],
      searchData0: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('PURCHASE.projectCode')} / ${this.$t('ui.productSearch')}`
        },
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('PURCHASE.PQNo'), value: 'conditionForPQ' },
            { label: this.$t('PURCHASE.DocNo'), value: 'conditionForPR' },
            { label: this.$t('PURCHASE.RFQNo'), value: 'conditionForRFQ' }
          ],
          selectName: 'selectId',
          inputName: 'inputVal',
          selectId: '',
          inputVal: '',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        }, */
        {
          name: 'purchaseQuotationStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'incotermIdList',
          label: vm.$t('PURCHASE.incoterm'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'incotermId',
          selectLabel: 'incotermAbbreviation',
          selectData: []
        },
        {
          name: 'businessPartnerIdList',
          label: vm.$t('PURCHASE.supplier'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        },
        {
          name: 'receiveAddressNameList',
          label: vm.$t('PURCHASE.deliveryAddress'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'receiveAddressName',
          selectLabel: 'receiveAddressName',
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        },
        {
          name: 'modifiedIdList',
          label: vm.$t('ui.modifiedBy'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'modifiedId',
          selectLabel: 'modifiedBy',
          selectData: []
        }
      ],
      searchData1: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('PURCHASE.projectCode')} / ${this.$t('ui.productSearch')}`
        },
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('PURCHASE.PQNo'), value: 'conditionForPQ' },
            { label: this.$t('PURCHASE.DocNo'), value: 'conditionForPR' },
            { label: this.$t('PURCHASE.RFQNo'), value: 'conditionForRFQ' }
          ],
          selectName: 'selectId',
          inputName: 'inputVal',
          selectId: '',
          inputVal: '',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        }, */
        {
          name: 'incotermIdList',
          label: vm.$t('PURCHASE.incoterm'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'incotermId',
          selectLabel: 'incotermAbbreviation',
          selectData: []
        },
        {
          name: 'businessPartnerIdList',
          label: vm.$t('PURCHASE.supplier'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        },
        {
          name: 'receiveAddressNameList',
          label: vm.$t('PURCHASE.deliveryAddress'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'receiveAddressName',
          selectLabel: 'receiveAddressName',
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        },
        {
          name: 'modifiedIdList',
          label: vm.$t('ui.modifiedBy'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'modifiedId',
          selectLabel: 'modifiedBy',
          selectData: []
        }
      ],
      conditionForPQList: [],
      conditionForPRList: [],
      conditionForRFQList: [],
      searchFormKey: Date.now()
    }
  }
}
