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
      //   tooltip: true
      // },
      {
        prop: 'preDeliveryNoticeNo',
        label: vm.$t('SALES.preDeliveryNoticeNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'documentNo',
        label: vm.$t('SALES.documentNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      // {
      //   prop: 'purchaseOrderNo',
      //   label: vm.$t('SALES.purchaseOrderNo'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true,
      //   sortable: 'custom'
      // },
      {
        prop: 'deliveryNoticeNo',
        label: vm.$t('SALES.deliveryNoticeNo'),
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
        prop: 'shipWarehouseName',
        label: vm.$t('SALES.deliveryWarehouse'),
        minWidth: 140,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'preDeliveryNoticeStatus',
        propBy: 'preDeliveryNoticeStatusStr',
        label: vm.$t('ui.status'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },

      {
        prop: 'totalQtyShowStr',
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
          name: this.$t('SALES.open1'),
          value: '1'
        },
        {
          name: this.$t('SALES.pendingPick'),
          value: '2'
        },
        {
          name: this.$t('SALES.picking'),
          value: '3'
        },
        // {
        //   name: this.$t('SALES.checking'),
        //   value: '4'
        // },
        // {
        //   name: this.$t('SALES.reviewing'),
        //   value: '5'
        // },
        // {
        //   name: this.$t('SALES.packing'),
        //   value: '6'
        // },
        {
          name: this.$t('SALES.pendingOutbound'),
          value: '7'
        },
        {
          name: this.$t('SALES.closed'),
          value: '8'
        },
        {
          name: this.$t('SALES.cancelled'),
          value: '9'
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
        8: columns0,
        9: columns0
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
            {
              label: this.$t('SALES.preDeliveryNoticeNo'),
              value: 'conditionForPreDeliveryNoticeNo'
            },
            { label: this.$t('SALES.documentNo'), value: 'conditionForDocumentNo' },
            { label: this.$t('SALES.deliveryNoticeNo'), value: 'conditionForDeliveryNoticeNo' }
            // { label: this.$t('SALES.purchaseOrder'), value: 'conditionForPurchaseOrderNo' }
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
          name: 'preDeliveryNoticeStatusList',
          label: vm.$t('ui.status'),
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
          label: vm.$t('SALES.deliveryAddress'),
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
            {
              label: this.$t('SALES.preDeliveryNoticeNo'),
              value: 'conditionForPreDeliveryNoticeNo'
            },
            { label: this.$t('SALES.documentNo'), value: 'conditionForDocumentNo' }
            // { label: this.$t('SALES.purchaseOrder'), value: 'conditionForPurchaseOrderNo' }
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
          label: vm.$t('SALES.deliveryAddress'),
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
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            {
              label: this.$t('SALES.preDeliveryNoticeNo'),
              value: 'conditionForPreDeliveryNoticeNo'
            },
            { label: this.$t('SALES.documentNo'), value: 'conditionForDocumentNo' },
            { label: this.$t('SALES.deliveryNoticeNo'), value: 'conditionForDeliveryNoticeNo' }
            // { label: this.$t('SALES.purchaseOrder'), value: 'conditionForPurchaseOrderNo' }
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
          label: vm.$t('SALES.deliveryAddress'),
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
      conditionForDeliveryNoticeNoList: [],
      conditionForPurchaseOrderNoList: [],

      createdList: [],
      approvedList: [],
      purchasePersonList: [],

      searchFormKey: Date.now()
    }
  }
}
