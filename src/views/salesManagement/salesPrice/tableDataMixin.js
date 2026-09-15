export default {
  created() {
    this.$$initColumnVisible('0', this.columnsData[0])
    this.$$initColumnVisible('1', this.columnsData[1])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'salesOrganizationName',
        label: vm.$t('SALES.salesOrganization'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesPriceNo',
        label: vm.$t('SALES.rrpCode1'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesPriceStatus',
        propBy: 'salesPriceStatusStr',
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
        prop: 'productCount',
        label: vm.$t('SALES.assignedProduct'),
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
    const columns1 = [
      {
        prop: 'salesQuotationNo',
        label: vm.$t('SALES.salesQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesQuotationType',
        propBy: 'salesQuotationTypeStr',
        label: vm.$t('SALES.salesQuotationType'),
        visible: true,
        minWidth: 120,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'salesOrganizationName',
        label: vm.$t('SALES.salesOrganization'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'documentNo',
        label: vm.$t('SALES.docNo'),
        visible: true,
        minWidth: 200,
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
        prop: 'country',
        label: vm.$t('ui.country'),
        minWidth: 140,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesQuotationStatus',
        propBy: 'salesQuotationStatusStr',
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
        prop: 'totalAmount',
        label: vm.$t('SALES.estimatedAmount'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        align: 'right',
        padding: 50,
        sortable: 'custom'
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
          name: this.$t('SALES.pendingOrder'),
          value: '3'
        },
        {
          name: this.$t('SALES.ordered'),
          value: '4'
        },
        {
          name: this.$t('SALES.completed'),
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
        1: columns1,
        2: columns1,
        3: columns1,
        4: columns0,
        5: columns0,
        6: columns0,
        7: columns0
      },
      columnsSaveKeys: {
        0: '0',
        1: '1',
        2: '1',
        3: '1',
        4: '0',
        5: '0',
        6: '0',
        7: '0'
      },
      searchData: [],
      searchData0: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('ui.productSearch')}`
        },
        /* {
          name: 'conditionForSalesPriceNo',
          label: this.$t('SALES.rrpCode'),
          type: 'AutocompleteEle',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        }, */
        {
          name: 'salesPriceStatusList',
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
          name: 'SelectAnMultipleSelectName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnMultipleSelect',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('ui.createdBy'), value: 'createdIdList' },
            { label: this.$t('ui.modifiedBy'), value: 'modifiedIdList' },
            { label: this.$t('ui.approvedBy'), value: 'approvedIdList' }
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
          label: vm.$t('ui.modifiedTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateModifiedTime',
          endDate: 'endDateModifiedTime'
        },
        {
          name: 'dateRange2',
          label: vm.$t('ui.approvedTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateApprovedTime',
          endDate: 'endDateApprovedTime'
        }
      ],
      searchData1: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('ui.customerSearch')}`
        },
        {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('SALES.salesQuotationNo'), value: 'conditionForSQ' },
            { label: this.$t('SALES.docNo'), value: 'conditionForDocumentNo' }
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
          name: 'salesQuotationTypeList',
          label: vm.$t('SALES.salesQuotationType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
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
            { label: this.$t('ui.modifiedBy'), value: 'modifiedIdList' },
            { label: this.$t('ui.approvedBy'), value: 'approvedIdList' },
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
          name: 'receiveAddressIdList',
          label: vm.$t('SALES.deliveryAddress'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'receiveAddressId',
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
        }
      ],
      searchData2: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('ui.customerSearch')}`
        },
        {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('SALES.salesQuotationNo'), value: 'conditionForSQ' },
            { label: this.$t('SALES.salesOrderNo'), value: 'conditionForSO' },
            { label: this.$t('SALES.docNo'), value: 'conditionForDocumentNo' }
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
          name: 'salesQuotationTypeList',
          label: vm.$t('SALES.salesQuotationType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
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
            { label: this.$t('ui.modifiedBy'), value: 'modifiedIdList' },
            { label: this.$t('ui.approvedBy'), value: 'approvedIdList' },
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
          name: 'receiveAddressIdList',
          label: vm.$t('SALES.deliveryAddress'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'receiveAddressId',
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
