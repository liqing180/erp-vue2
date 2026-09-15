export default {
  created() {
    this.$$initColumnVisible('10', this.columnsData[0])
    this.$$initColumnVisible('1', this.columnsData[1])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'productName',
        label: vm.$t('PRODUCT.productName'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        fixed: true
      },
      {
        prop: 'internalPartNo',
        label: vm.$t('PRODUCT.internalPartNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'categoryNameShowStr',
        label: vm.$t('PRODUCT.productCategory'),
        visible: true,
        minWidth: 200
        // tooltip: true
        // sortable: 'custom' // 不能排序
      },
      {
        prop: 'externalPartNo',
        label: vm.$t('PRODUCT.externalPartNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'isActive',
        label: vm.$t('ui.isActive'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('PRODUCT.supplierName'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerNo',
        label: vm.$t('PRODUCT.supplierCode'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'supplierType',
        label: vm.$t('ui.supplierType'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'supplierGroup',
        label: vm.$t('ui.supplierGroup'),
        minWidth: 160,
        visible: true,
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
    ]
    const columns1 = [
      {
        prop: 'productName',
        label: vm.$t('PRODUCT.productName'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        fixed: true
      },
      {
        prop: 'internalPartNo',
        label: vm.$t('PRODUCT.internalPartNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'categoryNameShowStr',
        label: vm.$t('PRODUCT.productCategory'),
        visible: true,
        minWidth: 200
        // tooltip: true
        // sortable: 'custom' // 不能排序
      },
      {
        prop: 'salesName',
        label: vm.$t('PRODUCT.salesName'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesPartNo',
        label: vm.$t('PRODUCT.salesPartNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesUom',
        label: vm.$t('PRODUCT.salesUom'),
        visible: true,
        minWidth: 160,
        tooltip: true
      },
      {
        prop: 'uomCoefficient',
        label: vm.$t('PRODUCT.ratio'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'uom',
        label: vm.$t('PRODUCT.inventoryUOM1'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'isActive',
        label: vm.$t('ui.isActive'),
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
      }
    ]

    return {
      activeName: '1',
      tabs: [
        // {
        //   name: this.$t('PRODUCT.purchaseExpansionInformation'),
        //   value: '0'
        // },
        {
          name: this.$t('PRODUCT.salesExpansionInformation'),
          value: '1'
        }
      ],
      badgeKey: Date.now(),
      tabsKey: Date.now(),
      columnsData: {
        0: columns0,
        1: columns1
      },
      searchData: [],
      searchData0: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: vm.$t('ui.productSearch')
        },
        {
          name: 'conditionForExternalPartNo',
          label: vm.$t('PRODUCT.externalPartNo'),
          type: 'AutocompleteEle',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        },
        {
          name: 'businessPartnerIdList',
          label: vm.$t('PRODUCT.supplierName'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        },
        // {
        //   name: 'supplierGroupList',
        //   label: vm.$t('ui.supplierGroup'),
        //   type: 'MultipleSelectEle',
        //   width: '200px',
        //   selectValue: 'value',
        //   selectLabel: 'label',
        //   selectData: []
        // },
        // {
        //   name: 'productCategoryIds',
        //   label: this.$t('PRODUCT.productCategory1'),
        //   type: 'ElcascaderEle',
        //   width: '230px',
        //   mapValue: 'id',
        //   mapLabel: 'categoryName',
        //   checkStrictly: true,
        //   multiple: true,
        //   selectData: []
        // },
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
        },
        {
          name: 'isActiveList',
          label: vm.$t('ui.isActive'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'countryIdList',
          label: vm.$t('ui.country'),
          type: 'MultipleSelectEle',
          filterable: true,
          selectValue: 'countryId',
          selectLabel: 'country',
          width: '200px',
          selectData: []
        }
      ],
      searchData1: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: vm.$t('ui.productSearch')
        },
        {
          name: 'conditionForSalesPartNo',
          label: vm.$t('PRODUCT.salesPartNo'),
          type: 'AutocompleteEle',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        },
        // {
        //   name: 'productCategoryIds',
        //   label: this.$t('PRODUCT.productCategory1'),
        //   type: 'ElcascaderEle',
        //   width: '230px',
        //   mapValue: 'id',
        //   mapLabel: 'categoryName',
        //   checkStrictly: true,
        //   multiple: true,
        //   selectData: []
        // },
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
        },
        {
          name: 'isActiveList',
          label: vm.$t('ui.isActive'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        }
      ],
      conditionForPQList: [],
      conditionForPRList: [],
      conditionForRFQList: [],
      searchFormKey: Date.now()
    }
  }
}
