export default {
  created() {
    this.$$initColumnVisible('0', this.columnsData[0])
    this.$$initColumnVisible('1', this.columnsData[1])
    this.$$initColumnVisible('2', this.columnsData[3])
    this.$$initColumnVisible('3', this.columnsData[5])
    this.$$initColumnVisible('4', this.columnsData[7])
    this.$$initColumnVisible('5', this.columnsData[8])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'storeIssueChitNo',
        label: vm.$t('SALES.storeIssueChitNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'storeIssueChitStatus',
        propBy: 'storeIssueChitStatusStr',
        label: vm.$t('ui.status'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'storeIssueChitType',
        propBy: 'storeIssueChitTypeStr',
        label: vm.$t('ui.type'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'warehouseName',
        label: vm.$t('SALES.warehouse'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'serviceOrderNo',
        label: vm.$t('SALES.serviceOrderNo'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'deliveryNoticeNo',
        label: vm.$t('SALES.deliveryNotice'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'goodsReceivedNoteNo',
        label: vm.$t('SALES.goodsReceivedNo'),
        visible: true,
        minWidth: 160,
        tooltip: false
        // sortable: 'custom'
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('SALES.customerName'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'costProjectCode',
        label: vm.$t('SALES.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'totalQty',
        label: vm.$t('SALES.productQty'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'requiredBy',
        label: vm.$t('SALES.requiredBy'),
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
      }
    ]
    const columns1 = [
      {
        prop: 'storeIssueChitNo',
        label: vm.$t('SALES.storeIssueChitNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'storeIssueChitStatus',
        propBy: 'storeIssueChitStatusStr',
        label: vm.$t('ui.status'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'storeIssueChitType',
        propBy: 'storeIssueChitTypeStr',
        label: vm.$t('ui.type'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'warehouseName',
        label: vm.$t('SALES.warehouse'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('SALES.customerName'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'costProjectCode',
        label: vm.$t('SALES.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'totalQty',
        label: vm.$t('SALES.productQty'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'requiredBy',
        label: vm.$t('SALES.requiredBy'),
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
      }
    ]
    const columns2 = [
      {
        prop: 'storeIssueChitNo',
        label: vm.$t('SALES.storeIssueChitNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'storeIssueChitStatus',
        propBy: 'storeIssueChitStatusStr',
        label: vm.$t('ui.status'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'storeIssueChitType',
        propBy: 'storeIssueChitTypeStr',
        label: vm.$t('ui.type'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'warehouseName',
        label: vm.$t('SALES.warehouse'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'deliveryNoticeNo',
        label: vm.$t('SALES.deliveryNotice'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('SALES.customerName'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'costProjectCode',
        label: vm.$t('SALES.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'totalQty',
        label: vm.$t('SALES.productQty'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'requiredBy',
        label: vm.$t('SALES.requiredBy'),
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
      }
    ]
    const columns3 = [
      {
        prop: 'storeIssueChitNo',
        label: vm.$t('SALES.storeIssueChitNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'storeIssueChitStatus',
        propBy: 'storeIssueChitStatusStr',
        label: vm.$t('ui.status'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'balanceQty',
        label: vm.$t('SALES.quantityToBeReturned'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: true
        // sortable: 'custom'
      },
      {
        prop: 'storeIssueChitType',
        propBy: 'storeIssueChitTypeStr',
        label: vm.$t('ui.type'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'warehouseName',
        label: vm.$t('SALES.warehouse'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'serviceOrderNo',
        label: vm.$t('SALES.serviceOrderNo'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'deliveryNoticeNo',
        label: vm.$t('SALES.deliveryNotice'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('SALES.customerName'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'costProjectCode',
        label: vm.$t('SALES.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'totalQty',
        label: vm.$t('SALES.productQty'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'returnBy',
        label: vm.$t('SALES.returnBy'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },

      {
        prop: 'requiredBy',
        label: vm.$t('SALES.requiredBy'),
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
      }
    ]
    const columns4 = [
      {
        prop: 'storeIssueChitNo',
        label: vm.$t('SALES.storeIssueChitNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'storeIssueChitStatus',
        propBy: 'storeIssueChitStatusStr',
        label: vm.$t('ui.status'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'storeIssueChitType',
        propBy: 'storeIssueChitTypeStr',
        label: vm.$t('ui.type'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'warehouseName',
        label: vm.$t('SALES.warehouse'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'serviceOrderNo',
        label: vm.$t('SALES.serviceOrderNo'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'deliveryNoticeNo',
        label: vm.$t('SALES.deliveryNotice'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'goodsReceiptNoteNo',
        label: vm.$t('SALES.goodsReceiptNoteNo'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('SALES.customerName'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'costProjectCode',
        label: vm.$t('SALES.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'totalQty',
        label: vm.$t('SALES.productQty'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'requiredBy',
        label: vm.$t('SALES.requiredBy'),
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
        prop: 'closedBy',
        label: vm.$t('SALES.closedBy'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'closedTime',
        label: vm.$t('SALES.dateClosed'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      }
    ]
    const columns5 = [
      {
        prop: 'storeIssueChitNo',
        label: vm.$t('SALES.storeIssueChitNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'storeIssueChitStatus',
        propBy: 'storeIssueChitStatusStr',
        label: vm.$t('ui.status'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'storeIssueChitType',
        propBy: 'storeIssueChitTypeStr',
        label: vm.$t('ui.type'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'warehouseName',
        label: vm.$t('SALES.warehouse'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('SALES.customerName'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'costProjectCode',
        label: vm.$t('SALES.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'totalQty',
        label: vm.$t('SALES.productQty'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'requiredBy',
        label: vm.$t('SALES.requiredBy'),
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
        prop: 'cancelledBy',
        label: vm.$t('ui.cancelledBy'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'cancelledTime',
        label: vm.$t('ui.cancelledTime'),
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
          name: this.$t('SALES.all'),
          value: '0'
        },
        {
          name: this.$t('SALES.open'),
          value: '1'
        },
        {
          name: this.$t('SALES.pendingOutbound'),
          value: '3'
        },
        {
          name: this.$t('SALES.pendingReturn'),
          value: '5'
        },
        {
          name: this.$t('SALES.completed'),
          value: '6'
        },
        {
          name: this.$t('SALES.closed'),
          value: '7'
        },
        {
          name: this.$t('SALES.cancelled'),
          value: '8'
        }
      ],
      badgeKey: Date.now(),
      tabsKey: Date.now(),
      columnsData: {
        0: columns0,
        1: columns1,
        3: columns2,
        5: columns3,
        6: columns0,
        7: columns4,
        8: columns5
      },
      columnsSaveKeys: {
        0: '0',
        1: '1',
        3: '3',
        5: '5',
        6: '0',
        7: '7',
        8: '8'
      },
      searchData: [],
      searchData0: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('SALES.storeIssueChitNo')}`
        },
        {
          name: 'storeIssueChitStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'approvedStatusList',
          label: vm.$t('SALES.processApproval'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'storeIssueChitTypeList',
          label: vm.$t('ui.type'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'businessPartnerIdList',
          label: vm.$t('SALES.customerName'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        },
        {
          name: 'warehouseIdList',
          label: vm.$t('SALES.warehouse'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'warehouseId',
          selectLabel: 'warehouseName',
          selectData: []
        },
        {
          name: 'requiredIdList',
          label: vm.$t('SALES.requiredBy'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'createdId',
          selectLabel: 'createdBy',
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
          placeholder: `${vm.$t('SALES.storeIssueChitNo')}`
        },
        {
          name: 'storeIssueChitTypeList',
          label: vm.$t('ui.type'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'businessPartnerIdList',
          label: vm.$t('SALES.customerName'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        },
        {
          name: 'warehouseIdList',
          label: vm.$t('SALES.warehouse'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'warehouseId',
          selectLabel: 'warehouseName',
          selectData: []
        },
        {
          name: 'requiredIdList',
          label: vm.$t('SALES.requiredBy'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'createdId',
          selectLabel: 'createdBy',
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

      conditionForPOList: [],
      conditionForDNList: [],
      conditionForDOList: [],

      createdList: [],
      approvedList: [],
      purchasePersonList: [],

      searchFormKey: Date.now()
    }
  }
}
