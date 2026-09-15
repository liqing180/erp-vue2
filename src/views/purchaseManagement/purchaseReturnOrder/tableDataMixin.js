export default {
  created() {
    this.$$initColumnVisible('0', this.columnsData[0])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'purchaseReturnNo',
        label: vm.$t('PURCHASE.purchaseReturnOrderNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        fixed: true
      },
      {
        prop: 'documentNo',
        label: vm.$t('PURCHASE.DocNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'purchaseReturnStatus',
        propBy: 'purchaseReturnStatusStr',
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
        prop: 'businessPartnerName',
        label: vm.$t('PURCHASE.supplier'),
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
        prop: 'warehouseName',
        label: vm.$t('organization.warehouse'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'totalReturnedQtyShowStr',
        label: vm.$t('PURCHASE.returnedQTY'),
        minWidth: 140,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'totalReturnedAmountShowStr',
        label: vm.$t('PURCHASE.returnedAmount'),
        minWidth: 140,
        visible: true,
        tooltip: true,
        sortable: 'custom',
        align: 'right'
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
        prop: 'purchasePersonBy',
        label: vm.$t('PURCHASE.purchasePerson'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'purchaseReturnType',
        propBy: 'purchaseReturnTypeStr',
        label: vm.$t('PURCHASE.returnType'),
        minWidth: 160,
        visible: true,
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
        prop: 'goodsReceivedNoteNo',
        label: vm.$t('PURCHASE.goodsReceivedNo'),
        visible: true,
        minWidth: 200,
        tooltip: false
        // sortable: 'custom'
      },
      {
        prop: 'returnDate',
        label: vm.$t('PURCHASE.returnDate'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      // {
      //   prop: 'picUserBy',
      //   label: vm.$t('PURCHASE.pic'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true,
      //   sortable: 'custom'
      // },
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
        // {
        //   name: this.$t('PURCHASE.inProgress'),
        //   value: '4'
        // },
        {
          name: this.$t('PURCHASE.pendInbound'),
          value: '5'
        },
        {
          name: this.$t('PURCHASE.closed'),
          value: '6'
        },
        {
          name: this.$t('PURCHASE.cancelled'),
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
          placeholder: `${vm.$t('PURCHASE.projectCode')} / ${vm.$t('ui.supplierSearch')}`
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
              label: this.$t('PURCHASE.purchaseReturnOrderNo'),
              value: 'conditionForPurchaseReturnNo'
            },
            { label: this.$t('PURCHASE.DocNo'), value: 'conditionForDocumentNo' },
            { label: this.$t('PURCHASE.deliveryNoticeNo'), value: 'conditionForDeliveryNoticeNo' },
            {
              label: this.$t('PURCHASE.goodsReceiptNoteNo'),
              value: 'conditionForGoodsReceiptNoteNo'
            }
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
          name: 'purchaseReturnStatusList',
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
          name: 'warehouseIdList',
          label: vm.$t('organization.warehouse'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'warehouseId',
          selectLabel: 'warehouseName',
          selectData: []
        },
        {
          name: 'purchaseReturnTypeList',
          label: vm.$t('PURCHASE.returnType'),
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
            { label: this.$t('PURCHASE.purchasePerson'), value: 'purchasePersonIdList' }
            // { label: this.$t('ui.pic'), value: 'picUserIdList' }
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
          label: vm.$t('PURCHASE.returnDate'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateReturnDate',
          endDate: 'endDateReturnDate'
        }
      ],
      searchData1: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('PURCHASE.projectCode')} / ${vm.$t('ui.supplierSearch')}`
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
              label: this.$t('PURCHASE.purchaseReturnOrderNo'),
              value: 'conditionForPurchaseReturnNo'
            },
            { label: this.$t('PURCHASE.DocNo'), value: 'conditionForDocumentNo' }
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
          name: 'warehouseIdList',
          label: vm.$t('organization.warehouse'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'warehouseId',
          selectLabel: 'warehouseName',
          selectData: []
        },
        {
          name: 'purchaseReturnTypeList',
          label: vm.$t('PURCHASE.returnType'),
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
            { label: this.$t('PURCHASE.purchasePerson'), value: 'purchasePersonIdList' }
            // { label: this.$t('ui.pic'), value: 'picUserIdList' }
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
          label: vm.$t('PURCHASE.returnDate'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateReturnDate',
          endDate: 'endDateReturnDate'
        }
      ],
      searchData2: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('PURCHASE.projectCode')} / ${vm.$t('ui.supplierSearch')}`
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
              label: this.$t('PURCHASE.purchaseReturnOrderNo'),
              value: 'conditionForPurchaseReturnNo'
            },
            { label: this.$t('PURCHASE.DocNo'), value: 'conditionForDocumentNo' },
            { label: this.$t('PURCHASE.deliveryNoticeNo'), value: 'conditionForDeliveryNoticeNo' },
            {
              label: this.$t('PURCHASE.goodsReceiptNoteNo'),
              value: 'conditionForGoodsReceiptNoteNo'
            }
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
          name: 'warehouseIdList',
          label: vm.$t('organization.warehouse'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'warehouseId',
          selectLabel: 'warehouseName',
          selectData: []
        },
        {
          name: 'purchaseReturnTypeList',
          label: vm.$t('PURCHASE.returnType'),
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
            { label: this.$t('PURCHASE.purchasePerson'), value: 'purchasePersonIdList' }
            // { label: this.$t('ui.pic'), value: 'picUserIdList' }
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
          label: vm.$t('PURCHASE.returnDate'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateReturnDate',
          endDate: 'endDateReturnDate'
        }
      ],
      searchData45: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('PURCHASE.projectCode')} / ${vm.$t('ui.supplierSearch')}`
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
              label: this.$t('PURCHASE.purchaseReturnOrderNo'),
              value: 'conditionForPurchaseReturnNo'
            },
            { label: this.$t('PURCHASE.DocNo'), value: 'conditionForDocumentNo' },
            { label: this.$t('PURCHASE.deliveryNoticeNo'), value: 'conditionForDeliveryNoticeNo' },
            {
              label: this.$t('PURCHASE.goodsReceiptNoteNo'),
              value: 'conditionForGoodsReceiptNoteNo'
            }
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
          name: 'warehouseIdList',
          label: vm.$t('organization.warehouse'),
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
            { label: this.$t('PURCHASE.purchasePerson'), value: 'purchasePersonIdList' }
            // { label: this.$t('ui.pic'), value: 'picUserIdList' }
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
          label: vm.$t('PURCHASE.returnDate'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateReturnDate',
          endDate: 'endDateReturnDate'
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
