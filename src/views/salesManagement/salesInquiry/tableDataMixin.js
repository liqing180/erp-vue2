export default {
  created() {
    this.$$initColumnVisible('0', this.columnsData[0])
    this.$$initColumnVisible('1', this.columnsData[1])
    this.$$initColumnVisible('2', this.columnsData[2])
    this.$$initColumnVisible('3', this.columnsData[3])
    this.$$initColumnVisible('4', this.columnsData[4])
    this.$$initColumnVisible('5', this.columnsData[5])
    this.$$initColumnVisible('6', this.columnsData[6])
    this.$$initColumnVisible('7', this.columnsData[7])
    this.$$initColumnVisible('8', this.columnsData[8])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'salesInquiryNo',
        label: vm.$t('SALES.salesInquiryNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesInquiryStatus',
        propBy: 'salesInquiryStatusStr',
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
        prop: 'salesQuotationNo',
        label: vm.$t('SALES.salesQuotationNo'),
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
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('SALES.salesOrganization'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },
      {
        prop: 'salesInquiryType',
        propBy: 'salesInquiryTypeStr',
        label: vm.$t('SALES.salesInquiryType'),
        visible: true,
        minWidth: 120,
        sortable: 'custom',
        tooltip: true
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
        prop: 'costProjectCode',
        label: vm.$t('SALES.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'receiveAddress',
        label: vm.$t('SALES.deliveryAddress'),
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
    const columns1 = [
      {
        prop: 'salesInquiryNo',
        label: vm.$t('SALES.salesInquiryNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesInquiryStatus',
        propBy: 'salesInquiryStatusStr',
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
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('SALES.salesOrganization'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },
      {
        prop: 'salesInquiryType',
        propBy: 'salesInquiryTypeStr',
        label: vm.$t('SALES.salesInquiryType'),
        visible: true,
        minWidth: 120,
        sortable: 'custom',
        tooltip: true
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
        prop: 'costProjectCode',
        label: vm.$t('SALES.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'receiveAddress',
        label: vm.$t('SALES.deliveryAddress'),
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
    const columns2 = [
      {
        prop: 'salesInquiryNo',
        label: vm.$t('SALES.salesInquiryNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesInquiryStatus',
        propBy: 'salesInquiryStatusStr',
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
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('SALES.salesOrganization'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },
      {
        prop: 'salesInquiryType',
        propBy: 'salesInquiryTypeStr',
        label: vm.$t('SALES.salesInquiryType'),
        visible: true,
        minWidth: 120,
        sortable: 'custom',
        tooltip: true
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
        prop: 'costProjectCode',
        label: vm.$t('SALES.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'receiveAddress',
        label: vm.$t('SALES.deliveryAddress'),
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
    const columns3 = [
      {
        prop: 'salesInquiryNo',
        label: vm.$t('SALES.salesInquiryNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesInquiryStatus',
        propBy: 'salesInquiryStatusStr',
        label: vm.$t('ui.status'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'projectTaskStatus',
        propBy: 'projectTaskStatusStr',
        label: vm.$t('SALES.projectTaskStatus'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'projectCostStatus',
        propBy: 'projectCostStatusStr',
        label: vm.$t('SALES.projectCostStatus'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'materialListStatus',
        propBy: 'materialListStatusStr',
        label: vm.$t('SALES.materialListStatus'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('SALES.salesOrganization'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },
      {
        prop: 'salesInquiryType',
        propBy: 'salesInquiryTypeStr',
        label: vm.$t('SALES.salesInquiryType'),
        visible: true,
        minWidth: 120,
        sortable: 'custom',
        tooltip: true
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
        prop: 'costProjectCode',
        label: vm.$t('SALES.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'receiveAddress',
        label: vm.$t('SALES.deliveryAddress'),
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
    const columns4 = [
      {
        prop: 'salesInquiryNo',
        label: vm.$t('SALES.salesInquiryNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesInquiryStatus',
        propBy: 'salesInquiryStatusStr',
        label: vm.$t('ui.status'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'productQuotationCountShowStr',
        label: vm.$t('SALES.productQuotation'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('SALES.salesOrganization'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },
      {
        prop: 'salesInquiryType',
        propBy: 'salesInquiryTypeStr',
        label: vm.$t('SALES.salesInquiryType'),
        visible: true,
        minWidth: 120,
        sortable: 'custom',
        tooltip: true
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
        prop: 'costProjectCode',
        label: vm.$t('SALES.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'receiveAddress',
        label: vm.$t('SALES.deliveryAddress'),
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
    const columns5 = [
      {
        prop: 'salesInquiryNo',
        label: vm.$t('SALES.salesInquiryNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesInquiryStatus',
        propBy: 'salesInquiryStatusStr',
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
        prop: 'salesQuotationNo',
        label: vm.$t('SALES.salesQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('SALES.salesOrganization'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },
      {
        prop: 'salesInquiryType',
        propBy: 'salesInquiryTypeStr',
        label: vm.$t('SALES.salesInquiryType'),
        visible: true,
        minWidth: 120,
        sortable: 'custom',
        tooltip: true
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
        prop: 'costProjectCode',
        label: vm.$t('SALES.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'receiveAddress',
        label: vm.$t('SALES.deliveryAddress'),
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
    const columns6 = [
      {
        prop: 'salesInquiryNo',
        label: vm.$t('SALES.salesInquiryNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesInquiryStatus',
        propBy: 'salesInquiryStatusStr',
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
        prop: 'salesQuotationNo',
        label: vm.$t('SALES.salesQuotationNo'),
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
      /*  {
        prop: 'branchCompanyDeptName',
        label: vm.$t('SALES.salesOrganization'),
        visible: true,
        minWidth: 200,
        tooltip: true
      }, */
      {
        prop: 'salesInquiryType',
        propBy: 'salesInquiryTypeStr',
        label: vm.$t('SALES.salesInquiryType'),
        visible: true,
        minWidth: 120,
        sortable: 'custom',
        tooltip: true
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
        prop: 'costProjectCode',
        label: vm.$t('SALES.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'receiveAddress',
        label: vm.$t('SALES.deliveryAddress'),
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
    const columns7 = [
      {
        prop: 'salesInquiryNo',
        label: vm.$t('SALES.salesInquiryNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'salesInquiryStatus',
        propBy: 'salesInquiryStatusStr',
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
      /* {
        prop: 'branchCompanyDeptName',
        label: vm.$t('SALES.salesOrganization'),
        visible: true,
        minWidth: 200,
        tooltip: true
      }, */
      {
        prop: 'salesInquiryType',
        propBy: 'salesInquiryTypeStr',
        label: vm.$t('SALES.salesInquiryType'),
        visible: true,
        minWidth: 120,
        sortable: 'custom',
        tooltip: true
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
        prop: 'costProjectCode',
        label: vm.$t('SALES.projectCode'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'receiveAddress',
        label: vm.$t('SALES.deliveryAddress'),
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
        // {
        //   name: this.$t('SALES.inProgress'),
        //   value: '3'
        // },
        /* {
          name: this.$t('SALES.quotationInProgress'),
          value: '4'
        }, */
        {
          name: this.$t('SALES.pendSupplierQuotation'),
          value: '8'
        },
        {
          name: this.$t('SALES.pendQuotationReview'),
          value: '4'
        },
        {
          name: this.$t('SALES.pendApproval'),
          value: '2'
        },
        {
          name: this.$t('SALES.quoted'),
          value: '5'
        },
        {
          name: this.$t('SALES.ordered'),
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
        2: columns2,
        3: columns3,
        4: columns4,
        5: columns5,
        6: columns6,
        7: columns7,
        8: [...columns5]
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
            { label: this.$t('SALES.salesInquiryNo'), value: 'conditionForSI' },
            { label: this.$t('SALES.salesQuotationNo'), value: 'conditionForSQ' },
            { label: this.$t('SALES.salesOrderNo'), value: 'conditionForSO' }
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
          name: 'salesInquiryStatusList',
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
          name: 'salesInquiryTypeList',
          label: vm.$t('SALES.salesInquiryType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
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
          name: 'receiveAddressList',
          label: vm.$t('SALES.deliveryAddress'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'receiveAddress',
          selectLabel: 'receiveAddress',
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
          placeholder: `${vm.$t('SALES.customerSearch')}`
        },
        {
          name: 'conditionForSI',
          label: vm.$t('SALES.salesInquiryNo'),
          type: 'AutocompleteEle',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        },
        {
          name: 'salesInquiryTypeList',
          label: vm.$t('SALES.salesInquiryType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
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
          name: 'receiveAddressList',
          label: vm.$t('SALES.deliveryAddress'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'receiveAddress',
          selectLabel: 'receiveAddress',
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
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        }
      ],
      searchData3: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('SALES.customerSearch')}`
        },
        {
          name: 'conditionForSI',
          label: vm.$t('SALES.salesInquiryNo'),
          type: 'AutocompleteEle',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
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
          name: 'receiveAddressList',
          label: vm.$t('SALES.deliveryAddress'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'receiveAddress',
          selectLabel: 'receiveAddress',
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
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        }
      ],
      searchData5: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('SALES.customerSearch')}`
        },
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('SALES.salesInquiryNo'), value: 'conditionForSI' },
            { label: this.$t('SALES.salesQuotationNo'), value: 'conditionForSQ' }
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
          name: 'receiveAddressList',
          label: vm.$t('SALES.deliveryAddress'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'receiveAddress',
          selectLabel: 'receiveAddress',
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
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        }
      ],
      searchData6: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('SALES.customerSearch')}`
        },
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('SALES.salesInquiryNo'), value: 'conditionForSI' },
            { label: this.$t('SALES.salesQuotationNo'), value: 'conditionForSQ' },
            { label: this.$t('SALES.salesOrderNo'), value: 'conditionForSO' }
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
          name: 'receiveAddressList',
          label: vm.$t('SALES.deliveryAddress'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'receiveAddress',
          selectLabel: 'receiveAddress',
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
