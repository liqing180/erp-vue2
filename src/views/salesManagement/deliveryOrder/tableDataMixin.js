export default {
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  data() {
    const vm = this
    const columns0 = [
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('SALES.salesOrganization'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },
      {
        prop: 'deliveryOrderNo',
        label: vm.$t('SALES.deliveryOrderNo'),
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
        prop: 'businessPartnerName',
        label: vm.$t('SALES.customerName'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
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
        prop: 'preDeliveryNoticeNo',
        label: vm.$t('SALES.preDeliveryNoticeNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'shipWarehouseName',
        label: vm.$t('SALES.deliveryWarehouse'),
        minWidth: 140,
        visible: true,
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
        prop: 'deliveryOrderStatus',
        propBy: 'deliveryOrderStatusStr',
        label: vm.$t('ui.status'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },

      {
        prop: 'totalQty',
        label: vm.$t('SALES.totalQTY'),
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
      /* {
        prop: 'logisticsType',
        propBy: 'logisticsTypeStr',
        label: vm.$t('SALES.logisticsType'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      }, */
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
        prop: 'completedBy',
        label: vm.$t('SALES.completedBy'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'completedTime',
        label: vm.$t('SALES.completedTime'),
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
      columns: columns0,
      searchData: [
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
            { label: this.$t('SALES.deliveryOrderNo'), value: 'conditionForDeliveryOrderNo' },
            {
              label: this.$t('SALES.preDeliveryNoticeNo'),
              value: 'conditionForPreDeliveryNoticeNo'
            },
            { label: this.$t('SALES.salesOrderNo'), value: 'conditionForSO' },
            { label: this.$t('SALES.deliveryNoticeNo'), value: 'conditionForDeliveryNoticeNo' }
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
          name: 'deliveryOrderStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'hasRejection',
          label: vm.$t('SALES.hasRejection'),
          type: 'SelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'system_active',
          selectData: []
        },
        {
          name: 'shipWarehouseIdList',
          label: vm.$t('SALES.deliveryWarehouse'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'shipWarehouseId',
          selectLabel: 'shipWarehouseName',
          selectData: []
        },
        /* {
          name: 'receiveAddressIdList',
          label: vm.$t('SALES.address'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'receiveAddressId',
          selectLabel: 'receiveAddressName',
          selectData: []
        }, */
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
            { label: this.$t('SALES.completedBy'), value: 'completedByList' }
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
        }
      ],

      conditionForPOList: [],
      conditionForDNList: [],
      conditionForDOList: [],

      createdList: [],
      approvedList: [],
      purchasePersonList: []
    }
  }
}
