export default {
  created() {
    this.$$initColumnVisible('0', this.columnsData[0])
    this.$$initColumnVisible('1', this.columnsData[1])
    this.$$initColumnVisible('7', this.columnsData[7])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'salesOrderNo',
        label: vm.$t('SALES.salesOrderNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesQuotationNo',
        label: vm.$t('SALES.salesQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('SALES.salesOrganization'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },
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
        prop: 'country',
        label: vm.$t('ui.country'),
        minWidth: 140,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesOrderStatusShowStr',
        // propBy: 'salesOrderStatusStr',
        label: vm.$t('ui.status'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'approvedStatus',
        propBy: 'approvedStatusShowStr',
        label: vm.$t('ui.processStatus'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesQuotationTypeShowStr',
        label: vm.$t('SALES.salesOrderType'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'totalAmountShowStr',
        label: vm.$t('SALES.totalAmount'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        align: 'right'
      },
      {
        prop: 'currency',
        label: vm.$t('ui.currency'),
        minWidth: 200,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'incotermAbbreviation',
        label: vm.$t('SALES.incoterm'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'receiveAddress',
        label: vm.$t('SALES.deliveryAddress'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },

      {
        prop: 'deliveryDate',
        label: vm.$t('SALES.committedDate'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
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
      // {
      //   prop: 'modifiedBy',
      //   label: vm.$t('ui.modifiedBy'),
      //   minWidth: 160,
      //   visible: true,
      //   tooltip: true,
      //   sortable: 'custom'
      // },
      // {
      //   prop: 'modifiedTime',
      //   label: vm.$t('ui.modifiedTime'),
      //   minWidth: 160,
      //   visible: true,
      //   tooltip: true,
      //   sortable: 'custom'
      // }
    ]
    const columns1 = [
      {
        prop: 'salesOrderNo',
        label: vm.$t('SALES.salesOrderNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesQuotationNo',
        label: vm.$t('SALES.salesQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('SALES.salesOrganization'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },
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
        prop: 'country',
        label: vm.$t('ui.country'),
        minWidth: 140,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesQuotationTypeShowStr',
        label: vm.$t('SALES.salesOrderType'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'totalAmountShowStr',
        label: vm.$t('SALES.totalAmount'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        align: 'right'
      },
      {
        prop: 'currency',
        label: vm.$t('ui.currency'),
        minWidth: 200,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'incotermAbbreviation',
        label: vm.$t('SALES.incoterm'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'receiveAddress',
        label: vm.$t('SALES.deliveryAddress'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },

      {
        prop: 'deliveryDate',
        label: vm.$t('SALES.committedDate'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
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
      // {
      //   prop: 'modifiedBy',
      //   label: vm.$t('ui.modifiedBy'),
      //   minWidth: 160,
      //   visible: true,
      //   tooltip: true,
      //   sortable: 'custom'
      // },
      // {
      //   prop: 'modifiedTime',
      //   label: vm.$t('ui.modifiedTime'),
      //   minWidth: 160,
      //   visible: true,
      //   tooltip: true,
      //   sortable: 'custom'
      // }
    ]
    const columns7 = [
      {
        prop: 'salesOrderNo',
        label: vm.$t('SALES.salesOrderNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesQuotationNo',
        label: vm.$t('SALES.salesQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('SALES.salesOrganization'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },
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
        prop: 'country',
        label: vm.$t('ui.country'),
        minWidth: 140,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'approvedStatus',
        propBy: 'approvedStatusShowStr',
        label: vm.$t('ui.processStatus'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesQuotationTypeShowStr',
        label: vm.$t('SALES.salesOrderType'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'totalAmountShowStr',
        label: vm.$t('SALES.totalAmount'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        align: 'right'
      },
      {
        prop: 'currency',
        label: vm.$t('ui.currency'),
        minWidth: 200,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'incotermAbbreviation',
        label: vm.$t('SALES.incoterm'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'receiveAddress',
        label: vm.$t('SALES.deliveryAddress'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },

      {
        prop: 'deliveryDate',
        label: vm.$t('SALES.committedDate'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
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
      // {
      //   prop: 'modifiedBy',
      //   label: vm.$t('ui.modifiedBy'),
      //   minWidth: 160,
      //   visible: true,
      //   tooltip: true,
      //   sortable: 'custom'
      // },
      // {
      //   prop: 'modifiedTime',
      //   label: vm.$t('ui.modifiedTime'),
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
          name: this.$t('SALES.all'),
          value: '0'
        },
        {
          name: this.$t('SALES.pendApproval'),
          value: '7'
        },
        {
          name: this.$t('SALES.pendingDelivery'),
          value: '1'
        },
        /* {
          name: this.$t('SALES.partialDelivered'),
          value: '2'
        }, */
        {
          name: this.$t('SALES.completed'),
          value: '3'
        },
        {
          name: this.$t('SALES.cancelled'),
          value: '5'
        }
      ],
      badgeKey: Date.now(),
      tabsKey: Date.now(),
      columnsData: {
        0: columns0,
        7: columns7,
        1: columns1,
        2: columns1,
        3: columns1,
        5: columns1
      },
      columnsSaveKeys: {
        0: '0',
        1: '1',
        2: '1',
        3: '1',
        5: '1',
        7: '2'
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
            { label: this.$t('SALES.salesOrderNo'), value: 'conditionForSO' },
            { label: this.$t('SALES.salesQuotationNo'), value: 'conditionForSQ' }
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
          name: 'salesOrderStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'incotermIdList',
          label: vm.$t('SALES.incoterm'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'incotermId',
          selectLabel: 'incotermAbbreviation',
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
            { label: this.$t('SALES.salesPerson'), value: 'salesPersonIdList' }
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
          name: 'dateRange1',
          label: vm.$t('SALES.committedDate'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateDelivery',
          endDate: 'endDateDelivery'
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
          name: 'salesQuotationTypeList',
          label: vm.$t('SALES.salesOrderType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        }
        // {
        //   name: 'departmentIdList',
        //   label: vm.$t('SALES.salesOrganization'),
        //   type: 'ElcascaderEle',
        //   width: '230px',
        //   mapValue: 'value',
        //   mapLabel: 'label',
        //   selectData: []
        // }
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
            { label: this.$t('SALES.salesOrderNo'), value: 'conditionForSO' },
            { label: this.$t('SALES.salesQuotationNo'), value: 'conditionForSQ' }
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
          label: vm.$t('SALES.incoterm'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'incotermId',
          selectLabel: 'incotermAbbreviation',
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
            { label: this.$t('SALES.salesPerson'), value: 'salesPersonIdList' }
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
          name: 'dateRange1',
          label: vm.$t('SALES.committedDate'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateDelivery',
          endDate: 'endDateDelivery'
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
          name: 'salesQuotationTypeList',
          label: vm.$t('SALES.salesOrderType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        }
        // {
        //   name: 'departmentIdList',
        //   label: vm.$t('SALES.salesOrganization'),
        //   type: 'ElcascaderEle',
        //   width: '230px',
        //   mapValue: 'value',
        //   mapLabel: 'label',
        //   selectData: []
        // }
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
