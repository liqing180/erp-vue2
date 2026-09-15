export default {
  created() {
    this.$$initColumnVisible('0', this.columnsData[0])
  },
  data() {
    const vm = this
    const columns0 = [
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('SALES.salesOrganization'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true,
      //   fixed: true
      // },
      {
        prop: 'salesGoodsReturnNo',
        label: vm.$t('SALES.salesGoodsReturnNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesOrderNo',
        label: vm.$t('SALES.salesOrderNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'deliveryOrderNo',
        label: vm.$t('SALES.deliveryOrderNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesGoodsReturnStatus',
        propBy: 'salesGoodsReturnStatusStr',
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
        prop: 'deliveryStatus',
        propBy: 'deliveryStatusStr',
        label: vm.$t('SALES.deliveryStatus'),
        visible: true,
        minWidth: 120,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('SALES.customer'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'warehouseName',
        label: vm.$t('SALES.warehouse'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'rmaTypeShowStr',
        label: vm.$t('SALES.RMAType'),
        minWidth: 160,
        visible: true,
        tooltip: false
      },
      {
        prop: 'totalReturnedQtyShowStr',
        label: vm.$t('SALES.returnedQTY'),
        minWidth: 140,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'totalReturnedAmountShowStr',
        label: vm.$t('SALES.returnedAmount'),
        minWidth: 140,
        visible: true,
        tooltip: true,
        sortable: 'custom',
        align: 'right'
      },

      {
        prop: 'salesPersonBy',
        label: vm.$t('SALES.salesPerson'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'picUserBy',
        label: vm.$t('ui.pic'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'goodsReceivedNoteNo',
        label: vm.$t('SALES.goodsReceivedNo'),
        visible: true,
        minWidth: 200,
        tooltip: false
        // sortable: 'custom'
      },
      {
        prop: 'deliveryNoticeNo',
        label: vm.$t('SALES.deliveryNoticeNo'),
        visible: true,
        minWidth: 200,
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
          name: this.$t('SALES.all'),
          value: '0'
        },
        {
          name: this.$t('SALES.open'),
          value: '1'
        },
        {
          name: this.$t('SALES.pendApproval'),
          value: '2'
        },
        {
          name: this.$t('SALES.pendInbound'),
          value: '3'
        },
        {
          name: this.$t('SALES.partiallyInbound'),
          value: '4'
        },
        {
          name: this.$t('SALES.pendingOutbound'),
          value: '5'
        },
        {
          name: this.$t('SALES.closed'),
          value: '6'
        },
        {
          name: this.$t('SALES.cancelled'),
          value: '7'
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
        7: columns0
      },
      columnsSaveKeys: {
        0: '0',
        1: '0',
        2: '0',
        3: '0',
        4: '0',
        5: '0',
        6: '0',
        7: '0',
        8: '0',
        9: '0'
      },
      searchData: [],
      searchData0: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('ui.customerSearch')}`
        },
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('SALES.salesGoodsReturnNo'), value: 'conditionForSalesGoodsReturnNo' },
            { label: this.$t('SALES.salesOrderNo'), value: 'conditionForSalesOrderNo' },
            { label: this.$t('SALES.deliveryOrderNo'), value: 'conditionForDeliveryOrderNo' },
            { label: this.$t('SALES.deliveryNoticeNo'), value: 'conditionForDeliveryNoticeNo' },
            { label: this.$t('SALES.goodsReceiptNoteNo'), value: 'conditionForGoodsReceiptNoteNo' }
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
          name: 'salesGoodsReturnStatusList',
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
        // {
        //   name: 'departmentIdList',
        //   label: vm.$t('SALES.salesOrganization'),
        //   type: 'ElcascaderEle',
        //   width: '230px',
        //   mapValue: 'value',
        //   mapLabel: 'label',
        //   selectData: []
        // },
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
          name: 'SelectAnMultipleSelectName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnMultipleSelect',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('ui.createdBy'), value: 'createdIdList' },
            { label: this.$t('SALES.salesPerson'), value: 'salesPersonIdList' },
            { label: this.$t('ui.pic'), value: 'picUserIdList' }
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
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        },
        {
          name: 'dateRange1',
          label: vm.$t('SALES.dateRequired'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateRequiredDate',
          endDate: 'endDateRequiredDate'
        },
        {
          name: 'dateRange2',
          label: vm.$t('SALES.dueDate'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateDueDate',
          endDate: 'endDateDueDate'
        }
      ],
      searchData1: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('ui.customerSearch')}`
        },
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('SALES.salesGoodsReturnNo'), value: 'conditionForSalesGoodsReturnNo' },
            { label: this.$t('SALES.salesOrderNo'), value: 'conditionForSalesOrderNo' }
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
        // {
        //   name: 'departmentIdList',
        //   label: vm.$t('SALES.salesOrganization'),
        //   type: 'ElcascaderEle',
        //   width: '230px',
        //   mapValue: 'value',
        //   mapLabel: 'label',
        //   selectData: []
        // },
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
          name: 'SelectAnMultipleSelectName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnMultipleSelect',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('ui.createdBy'), value: 'createdIdList' },
            { label: this.$t('SALES.salesPerson'), value: 'salesPersonIdList' },
            { label: this.$t('ui.pic'), value: 'picUserIdList' }
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
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        },
        {
          name: 'dateRange1',
          label: vm.$t('SALES.dateRequired'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateRequiredDate',
          endDate: 'endDateRequiredDate'
        },
        {
          name: 'dateRange2',
          label: vm.$t('SALES.dueDate'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateDueDate',
          endDate: 'endDateDueDate'
        }
      ],
      searchData2: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('ui.customerSearch')}`
        },
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('SALES.salesGoodsReturnNo'), value: 'conditionForSalesGoodsReturnNo' },
            { label: this.$t('SALES.salesOrderNo'), value: 'conditionForSalesOrderNo' },
            { label: this.$t('SALES.deliveryNoticeNo'), value: 'conditionForDeliveryNoticeNo' },
            { label: this.$t('SALES.goodsReceiptNoteNo'), value: 'conditionForGoodsReceiptNoteNo' }
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
        // {
        //   name: 'departmentIdList',
        //   label: vm.$t('SALES.salesOrganization'),
        //   type: 'ElcascaderEle',
        //   width: '230px',
        //   mapValue: 'value',
        //   mapLabel: 'label',
        //   selectData: []
        // },
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
          name: 'SelectAnMultipleSelectName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnMultipleSelect',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('ui.createdBy'), value: 'createdIdList' },
            { label: this.$t('SALES.salesPerson'), value: 'salesPersonIdList' },
            { label: this.$t('ui.pic'), value: 'picUserIdList' }
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
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        },
        {
          name: 'dateRange1',
          label: vm.$t('SALES.dateRequired'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateRequiredDate',
          endDate: 'endDateRequiredDate'
        },
        {
          name: 'dateRange2',
          label: vm.$t('SALES.dueDate'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateDueDate',
          endDate: 'endDateDueDate'
        }
      ],
      conditionForPOList: [],
      conditionForDNList: [],
      conditionForDOList: [],

      createdList: [],
      approvedList: [],

      searchFormKey: Date.now()
    }
  }
}
