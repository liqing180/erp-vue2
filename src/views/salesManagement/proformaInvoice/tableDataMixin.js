export default {
  created() {
    this.$$initColumnVisible('1', this.columnsData[0])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'proformaInvoiceNo',
        label: vm.$t('SALES.piNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'documentNo',
        label: vm.$t('SALES.sourceDocNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('SALES.businessPartner'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'soTotalAmount',
        label: vm.$t('SALES.soTotalAmount'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        align: 'right'
      },
      {
        prop: 'paymentTermStageName',
        label: vm.$t('SALES.paymentStage'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'paymentTermStagePercentage',
        label: vm.$t('SALES.stagePercentage'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'proformaInvoiceAmount',
        label: vm.$t('SALES.piAmount'),
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
        prop: 'proformaInvoiceStatus',
        propBy: 'proformaInvoiceStatusShowStr',
        label: vm.$t('ui.status'),
        visible: true,
        colMinWidth: 100,
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
        prop: 'incotermAbbreviation',
        label: vm.$t('SALES.incoterm'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'receivePortName',
        label: vm.$t('ui.port'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'proformaInvoiceDate',
        label: vm.$t('SALES.piDate'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'issueDate',
        label: vm.$t('SALES.issueDate'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'dueDate',
        label: vm.$t('SALES.dueDate1'),
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
          name: this.$t('SALES.confirmed'),
          value: '3'
        },
        {
          name: this.$t('SALES.issued'),
          value: '4'
        },
        {
          name: this.$t('SALES.cancelled'),
          value: '5'
        },
        {
          name: this.$t('SALES.superseded'),
          value: '6'
        }
      ],
      badgeKey: Date.now(),
      tabsKey: Date.now(),
      columnsData: {
        0: columns0
      },
      searchData: [],
      searchData0: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('SALES.piNo')} / ${vm.$t('SALES.sourceDocNo')} / ${vm.$t('SALES.businessPartner')} / ${vm.$t('SALES.yourRef')}`
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
          name: 'currencyIdList',
          label: vm.$t('ui.currency'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'currencyId',
          selectLabel: 'currency',
          selectData: []
        },
        {
          name: 'proformaInvoiceStatusList',
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
          width: '200px',
          selectValue: 'createdId',
          selectLabel: 'createdBy',
          selectData: []
        }
      ],
      searchData1: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('SALES.piNo')} / ${vm.$t('SALES.sourceDocNo')} / ${vm.$t('SALES.businessPartner')} / ${vm.$t('SALES.yourRef')}`
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
          name: 'currencyIdList',
          label: vm.$t('ui.currency'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'currencyId',
          selectLabel: 'currency',
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
          width: '200px',
          selectValue: 'createdId',
          selectLabel: 'createdBy',
          selectData: []
        }
      ],
      approvedList: [],
      searchFormKey: Date.now()
    }
  }
}
