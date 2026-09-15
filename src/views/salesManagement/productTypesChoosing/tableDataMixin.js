export default {
  created() {
    this.$$initColumnVisible('0', this.columnsData[0])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'lectotypeSource',
        label: vm.$t('SALES.lectotypeSource'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        fixed: true
      },
      {
        prop: 'lectotypeCode',
        label: vm.$t('SALES.lectotypeCode'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        fixed: true
      },
      {
        prop: 'productNameExternal',
        label: vm.$t('SALES.productNameExternal'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        fixed: true
      },
      {
        prop: 'productDescriptionExternal',
        label: vm.$t('SALES.productDescriptionExternal'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        fixed: true
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
        prop: 'remarks',
        label: vm.$t('ui.remarks'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'productName',
        label: vm.$t('PRODUCT.productName'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        fixed: true
      },
      {
        prop: 'internalPartNo',
        label: vm.$t('PRODUCT.internalPartNo'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'description',
        label: vm.$t('SALES.productDescription'),
        visible: true,
        minWidth: 200,
        tooltip: false
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
          name: this.$t('SALES.approved'),
          value: '3'
        },
        {
          name: this.$t('SALES.cancelled'),
          value: '4'
        }
      ],
      badgeKey: Date.now(),
      tabsKey: Date.now(),
      columnsData: {
        0: columns0,
        1: columns0,
        2: columns0,
        3: columns0,
        4: columns0
      },
      columnsSaveKeys: {
        0: '0',
        1: '0',
        2: '0',
        3: '0',
        4: '0'
      },
      searchData: [],
      searchData0: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('ui.productSearch')}`
        },
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
        {
          name: 'salesOrganizationIdList',
          label: vm.$t('SALES.salesOrganization'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'salesOrganizationId',
          selectLabel: 'salesOrganizationName',
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

      searchFormKey: Date.now()
    }
  }
}
