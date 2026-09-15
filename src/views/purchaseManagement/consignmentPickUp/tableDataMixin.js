export default {
  created() {
    this.$$initColumnVisible(this.saveKey, this.columnsData[0])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'consignmentPickupNo',
        label: vm.$t('PURCHASE.consignmentPickupNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'deliveryNoticeNo',
        label: vm.$t('PURCHASE.deliveryNoticeNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('PURCHASE.supplier'),
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
        prop: 'consignmentPickupStatus',
        propBy: 'consignmentPickupStatusStr',
        label: vm.$t('ui.status'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'approvedStatus',
        propBy: 'approvedStatusStr',
        label: vm.$t('ui.processStatus'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'totalPickupAmount',
        propBy: 'totalPickupAmountShowStr',
        label: vm.$t('PURCHASE.totalAmount'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        align: 'right',
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
        prop: 'receiveAddressName',
        label: vm.$t('PURCHASE.deliveryAddress'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'committedDate',
        label: vm.$t('PURCHASE.committedDate'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'purchasePersonBy',
        label: vm.$t('PURCHASE.purchasePerson'),
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
      },
      {
        prop: 'approvedBy',
        label: vm.$t('ui.approvedBy'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'approvedTime',
        label: vm.$t('ui.approvedTime'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      }
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
          name: this.$t('PURCHASE.pendApproval'),
          value: '2'
        },
        {
          name: this.$t('PURCHASE.pendingOutbound'),
          value: '3'
        },
        {
          name: this.$t('PURCHASE.completed'),
          value: '4'
        },
        {
          name: this.$t('PURCHASE.cancelled'),
          value: '5'
        }
      ],
      badgeKey: Date.now(),
      tabsKey: Date.now(),
      columnsData: {
        0: columns0,
        1: columns0,
        2: columns0,
        3: columns0,
        4: columns0,
        5: columns0,
        6: columns0,
        7: columns0,
        8: columns0
      },
      searchData: [],
      searchData0: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('PURCHASE.supplierNameCode')}`
        },
        {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            {
              label: this.$t('PURCHASE.consignmentPickupNo'),
              value: 'conditionForConsignmentPickupNo'
            },
            { label: this.$t('PURCHASE.deliveryNoticeNo'), value: 'conditionForDeliveryNoticeNo' }
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
        },
        {
          name: 'SelectAnMultipleSelectName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnMultipleSelect',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('ui.createdBy'), value: 'createdIdList' },
            { label: this.$t('ui.approvedBy'), value: 'approvedIdList' },
            { label: this.$t('PURCHASE.purchasePerson'), value: 'purchasePersonIdList' }
          ],
          selectName: 'selectId2',
          inputName: 'inputVal2',
          selectId: 'createdIdList',
          inputVal: [],
          filterable: true,
          selectData2: [],
          selectValue2: 'value',
          selectLabel2: 'label'
        },
        {
          name: 'receiveAddressIdList',
          label: vm.$t('PURCHASE.deliveryAddress'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'receiveAddressId',
          selectLabel: 'receiveAddressName',
          selectData: []
        },
        {
          name: 'consignmentPickupStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'approvedStatusList',
          label: vm.$t('ui.processStatus'),
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
          width: '200px',
          filterable: true,
          selectValue: 'incotermId',
          selectLabel: 'incotermAbbreviation',
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        }
      ],
      searchData1: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('PURCHASE.supplierNameCode')}`
        },
        {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            {
              label: this.$t('PURCHASE.consignmentPickupNo'),
              value: 'conditionForConsignmentPickupNo'
            },
            { label: this.$t('PURCHASE.deliveryNoticeNo'), value: 'conditionForDeliveryNoticeNo' }
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
        },

        {
          name: 'SelectAnMultipleSelectName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnMultipleSelect',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('ui.createdBy'), value: 'createdIdList' },
            { label: this.$t('ui.approvedBy'), value: 'approvedIdList' },
            { label: this.$t('PURCHASE.purchasePerson'), value: 'purchasePersonIdList' }
          ],
          selectName: 'selectId2',
          inputName: 'inputVal2',
          selectId: 'createdIdList',
          inputVal: [],
          filterable: true,
          selectData2: [
            {
              value: '1',
              label: '创建人1'
            },
            {
              value: '2',
              label: '创建人2'
            }
          ],
          selectValue2: 'value',
          selectLabel2: 'label'
        },

        {
          name: 'receiveAddressIdList',
          label: vm.$t('PURCHASE.deliveryAddress'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'receiveAddressId',
          selectLabel: 'receiveAddressName',
          selectData: []
        },
        {
          name: 'incotermIdList',
          label: vm.$t('PURCHASE.incoterm'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'incotermId',
          selectLabel: 'incotermAbbreviation',
          selectData: []
        },

        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        }
      ],
      conditionForConsignmentOrderNoList: [],
      conditionForDeliveryOrderNoList: [],

      createdList: [],
      approvedList: [],
      purchasePersonList: [],

      searchFormKey: Date.now()
    }
  }
}
