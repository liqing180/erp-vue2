export default {
  created() {
    this.$$initColumnVisible('0', this.columnsData[0])
    this.$$initColumnVisible('1', this.columnsData[1])
    this.$$initColumnVisible('2', this.columnsData[2])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'businessPartnerName',
        label: vm.$t('ui.businessPartnerName'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        fixed: true
      },
      {
        prop: 'businessPartnerNo',
        label: vm.$t('ui.businessPartnerCode'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'abbreviation',
        label: vm.$t('ui.abbreviation'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerType',
        propBy: 'businessPartnerTypeShowStr',
        label: vm.$t('ui.category'),
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
        prop: 'currency',
        label: vm.$t('ui.currency'),
        minWidth: 200,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      }
    ]
    const columns1 = [
      {
        prop: 'businessPartnerName',
        label: vm.$t('ui.businessPartnerName'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        fixed: true
      },
      {
        prop: 'businessPartnerNo',
        label: vm.$t('ui.businessPartnerCode'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'abbreviation',
        label: vm.$t('ui.abbreviation'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerType',
        propBy: 'businessPartnerTypeShowStr',
        label: vm.$t('ui.category'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'customerType',
        label: vm.$t('ui.customerType'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'customerGroup',
        label: vm.$t('ui.customerGroup'),
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
        prop: 'currency',
        label: vm.$t('ui.currency'),
        minWidth: 200,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      }
    ]
    const columns2 = [
      {
        prop: 'businessPartnerName',
        label: vm.$t('ui.businessPartnerName'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        fixed: true
      },
      {
        prop: 'businessPartnerNo',
        label: vm.$t('ui.businessPartnerCode'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'abbreviation',
        label: vm.$t('ui.abbreviation'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerType',
        propBy: 'businessPartnerTypeShowStr',
        label: vm.$t('ui.category'),
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
        prop: 'customerType',
        label: vm.$t('ui.customerType'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'customerGroup',
        label: vm.$t('ui.customerGroup'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'corporateNameShow',
        label: vm.$t('menu.corporate'),
        minWidth: 140,
        visible: true,
        tooltip: false
      },

      {
        prop: 'createdBy',
        label: vm.$t('ui.createdBy'),
        minWidth: 160,
        visible: true,
        tooltip: true
      },
      {
        prop: 'createdTime',
        label: vm.$t('ui.createdTime'),
        minWidth: 160,
        visible: true,
        tooltip: true
      },
      {
        prop: 'modifiedBy',
        label: vm.$t('ui.modifiedBy'),
        minWidth: 160,
        visible: true,
        tooltip: true
      },
      {
        prop: 'modifiedTime',
        label: vm.$t('ui.modifiedTime'),
        minWidth: 160,
        visible: true,
        tooltip: true
      }
    ]
    return {
      activeName: '0',
      tabs: [
        {
          name: this.$t('ui.supplierAssign'),
          value: '0'
        },
        {
          name: this.$t('ui.customerAssign'),
          value: '1'
        },
        {
          name: this.$t('ui.assigned'),
          value: '2'
        }
      ],
      badgeKey: Date.now(),
      tabsKey: Date.now(),
      columnsData: {
        0: columns0,
        1: columns1,
        2: columns2
      },
      searchData: [],
      searchData0: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: vm.$t('ui.bpSearch')
        },
        {
          name: 'supplierTypeList',
          label: vm.$t('ui.supplierType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
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
          placeholder: vm.$t('ui.bpSearch')
        },
        {
          name: 'customerTypeList',
          label: vm.$t('ui.customerType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'customerGroupList',
          label: vm.$t('ui.customerGroup'),
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
      searchData2: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: vm.$t('ui.bpSearch')
        },
        {
          name: 'supplierTypeList',
          label: vm.$t('ui.supplierType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
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
        {
          name: 'customerTypeList',
          label: vm.$t('ui.customerType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'customerGroupList',
          label: vm.$t('ui.customerGroup'),
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
        },
        {
          name: 'businessPartnerTypeList',
          label: vm.$t('ui.category'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'corporateIdList',
          label: this.$t('menu.corporate'),
          type: 'ElcascaderEle',
          width: '230px',
          mapValue: 'id',
          mapLabel: 'name',
          checkStrictly: true,
          multiple: false,
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
