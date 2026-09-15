export default {
  created() {
    this.$$initColumnVisible('0', this.columnsData[0])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'approvedSupplierNo',
        label: vm.$t('PURCHASE.aslNo'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'internalPartNo',
        label: vm.$t('PRODUCT.internalPartNo'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'productName',
        label: vm.$t('PRODUCT.productName'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'externalPartNo',
        label: vm.$t('PURCHASE.externalPartNo'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'approvedSupplierStatus',
        propBy: 'approvedSupplierStatusStr',
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
        label: vm.$t('PRODUCT.supplierName'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'businessPartnerNo',
        label: vm.$t('PRODUCT.supplierCode'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true
      },
      /* {
        prop: 'dropShipping',
        label: vm.$t('PURCHASE.dropShipping'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'receiveAddressName',
        label: vm.$t('PURCHASE.deliveryAddress'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true
      }, */
      {
        prop: 'unitPriceShowStr',
        label: vm.$t('PURCHASE.contractedPrice'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        padding: 50,
        align: 'right',
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
        prop: 'effectiveDate',
        label: vm.$t('PURCHASE.effectiveDate'),
        minWidth: 200,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'expiryDate',
        label: vm.$t('PURCHASE.expiryDate'),
        minWidth: 200,
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
      /* {
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
      } */
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
        0: columns0
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
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('ui.productSearch')}`
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
          name: 'approvedSupplierStatusList',
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
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        },
        {
          name: 'createdIdList',
          label: vm.$t('ui.createdBy'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'createdId',
          selectLabel: 'createdBy',
          selectData: []
        },
        {
          name: 'productCategoryIds',
          label: this.$t('PRODUCT.productCategory1'),
          type: 'ATreeSelectCustom',
          width: '230px',
          mapValue: 'id',
          mapLabel: 'categoryName',
          checkStrictly: false,
          emitPath: false,
          multiple: true,
          selectData: []
        }
      ],
      approvedList: [],
      searchFormKey: Date.now()
    }
  }
}
