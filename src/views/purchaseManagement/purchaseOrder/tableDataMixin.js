export default {
  created() {
    this.$$initColumnVisible(this.saveKey, this.columnsData[0])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'purchaseOrderNo',
        label: vm.$t('PURCHASE.purchaseOrderNo'),
        visible: true,
        minWidth: 200,
        padding: 30,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'documentNoListShowStr',
        label: vm.$t('PURCHASE.DocNo'),
        visible: true,
        minWidth: 160,
        tooltip: false
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
        prop: 'costProjectCode',
        label: vm.$t('PURCHASE.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'country',
        label: vm.$t('PURCHASE.country'),
        visible: true,
        minWidth: 120,
        sortable: 'custom',
        tooltip: true
      },
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('PURCHASE.purchasingOrganization'),
      //   visible: true,
      //   minWidth: 160,
      //   tooltip: true
      // },
      {
        prop: 'purchaseOrderStatus',
        propBy: 'purchaseOrderStatusStr',
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
        prop: 'totalAmountShowStr',
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
      // {
      //   prop: 'committedDate',
      //   label: vm.$t('PURCHASE.committedDate'),
      //   minWidth: 160,
      //   visible: true,
      //   tooltip: true,
      //   sortable: 'custom'
      // },
      // {
      //   prop: 'committedDate',
      //   label: vm.$t('PURCHASE.committedDate'),
      //   minWidth: 160,
      //   visible: true,
      //   tooltip: true,
      //   sortable: 'custom'
      // },
      {
        prop: 'leadTimeForDayShowStr',
        label: vm.$t('PURCHASE.leadTimeDays'),
        minWidth: 160,
        visible: true,
        tooltip: true
        // sortable: 'custom'
      },
      {
        prop: 'dropShipping',
        label: vm.$t('PURCHASE.dropShipping'),
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
        // {
        //   name: this.$t('PURCHASE.poIssued'),
        //   value: '3'
        // },
        // {
        //   name: this.$t('PURCHASE.pendInbound'),
        //   value: '4'
        // },
        // {
        //   name: this.$t('PURCHASE.partiallyInbound'),
        //   value: '5'
        // },
        {
          name: this.$t('PURCHASE.pendReceive'),
          value: '9'
        },
        {
          name: this.$t('PURCHASE.partiallyReceive'),
          value: '10'
        },
        {
          name: this.$t('PURCHASE.completed'),
          value: '6'
        },
        {
          name: this.$t('PURCHASE.closed'),
          value: '7'
        },
        {
          name: this.$t('PURCHASE.cancelled'),
          value: '8'
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
        9: columns0,
        10: columns0
      },
      searchData: [],
      searchData0: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('PURCHASE.projectCode')} / ${vm.$t('PURCHASE.supplierNameCode')}`
        },
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('PURCHASE.PONo'), value: 'conditionForPO' },
            { label: this.$t('PURCHASE.DocNo'), value: 'conditionForDN' },
            { label: this.$t('PURCHASE.DONo'), value: 'conditionForDO' }
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
          name: 'businessPartnerIdList',
          label: vm.$t('PRODUCT.supplier'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
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
          name: 'receiveAddressNameList',
          label: vm.$t('PURCHASE.deliveryAddress'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'receiveAddressName',
          selectLabel: 'receiveAddressName',
          selectData: []
        },
        {
          name: 'purchaseOrderStatusList',
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
        // {
        //   name: 'departmentIdList',
        //   label: vm.$t('PURCHASE.purchasingOrganization'),
        //   type: 'ElcascaderEle',
        //   width: '230px',
        //   mapValue: 'value',
        //   mapLabel: 'label',
        //   selectData: []
        // },
        {
          name: 'dropShippingList',
          label: vm.$t('PURCHASE.dropShipping'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          selectData: [
            {
              dictValue: '1',
              dictLabel: vm.$t('uiBtn.active')
            },
            {
              dictValue: '0',
              dictLabel: vm.$t('uiBtn.inactive')
            }
          ]
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
          placeholder: `${vm.$t('PURCHASE.projectCode')} / ${vm.$t('PURCHASE.supplierNameCode')}`
        },
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('PURCHASE.PONo'), value: 'conditionForPO' },
            { label: this.$t('PURCHASE.DocNo'), value: 'conditionForDN' },
            { label: this.$t('PURCHASE.DONo'), value: 'conditionForDO' }
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
          name: 'businessPartnerIdList',
          label: vm.$t('PRODUCT.supplier'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
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
          name: 'receiveAddressNameList',
          label: vm.$t('PURCHASE.deliveryAddress'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'receiveAddressName',
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
        // {
        //   name: 'departmentIdList',
        //   label: vm.$t('PURCHASE.purchasingOrganization'),
        //   type: 'ElcascaderEle',
        //   width: '230px',
        //   mapValue: 'value',
        //   mapLabel: 'label',
        //   selectData: []
        // },
        {
          name: 'dropShippingList',
          label: vm.$t('PURCHASE.dropShipping'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          selectData: [
            {
              dictValue: '1',
              dictLabel: vm.$t('uiBtn.active')
            },
            {
              dictValue: '0',
              dictLabel: vm.$t('uiBtn.inactive')
            }
          ]
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
