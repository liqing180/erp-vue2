export default {
  created() {
    this.$$initColumnVisible('0', this.columnsData[0])
    this.$$initColumnVisible('1', this.columnsData[1])
    this.$$initColumnVisible('2', this.columnsData[2])
    this.$$initColumnVisible('7', this.columnsData[2])
    this.$$initColumnVisible('3', this.columnsData[3])
    this.$$initColumnVisible('4', this.columnsData[4])
    this.$$initColumnVisible('5', this.columnsData[5])
    this.$$initColumnVisible('6', this.columnsData[6])
    this.$$initColumnVisible('7', this.columnsData[7])
    this.$$initColumnVisible('8', this.columnsData[8])
    this.$$initColumnVisible('9', this.columnsData[9])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'rfqNo',
        label: vm.$t('PURCHASE.requestForQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        fixed: true
      },
      {
        prop: 'productName',
        label: vm.$t('PURCHASE.productName'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'internalPartNo',
        label: vm.$t('PURCHASE.internalPartNo'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'productCount',
        label: vm.$t('PURCHASE.productQty'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('PURCHASE.supplierName'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'purchaseQuotationNo',
        label: vm.$t('PURCHASE.purchaseQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'purchaseOrderNo',
        label: vm.$t('PURCHASE.purchaseOrderNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'documentNo',
        label: vm.$t('PURCHASE.DocNo'),
        visible: true,
        minWidth: 160,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'rfqStatus',
        propBy: 'rfqStatusStr',
        label: vm.$t('ui.status'),
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
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('PURCHASE.department'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },

      {
        prop: 'receiveAddressName',
        label: vm.$t('PURCHASE.deliveryAddress'),
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
    ]
    const columns1 = [
      /* {
        prop: 'rfqNo',
        label: vm.$t('PURCHASE.requestForQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        fixed: true
      }, */
      {
        prop: 'productName',
        label: vm.$t('PURCHASE.productName'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        fixed: true
      },
      {
        prop: 'internalPartNo',
        label: vm.$t('PURCHASE.internalPartNo'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'description',
        label: vm.$t('ui.description'),
        visible: true,
        minWidth: 200,
        tooltip: false
      },
      {
        prop: 'documentNo',
        label: vm.$t('PURCHASE.DocNo'),
        visible: true,
        minWidth: 160,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'rfqDetailStatus',
        propBy: 'rfqDetailStatusStr',
        label: vm.$t('ui.status'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'purchaseQty',
        label: vm.$t('PURCHASE.purchaseQTY'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: true,
        sortable: 'custom'
      },
      // {
      //   prop: 'prBalanceBasicQty',
      //   label: vm.$t('PURCHASE.pendPurchaseQTY'),
      //   visible: true,
      //   minWidth: 200,
      //   padding: 60,
      //   tooltip: true,
      //   sortable: 'custom'
      // },
      {
        prop: 'purchaseUom',
        label: vm.$t('PURCHASE.purchaseUOM'),
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
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('PURCHASE.department'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },
      {
        prop: 'requiredBy',
        label: vm.$t('PURCHASE.requiredBy'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'deliveryDate',
        label: vm.$t('PURCHASE.requestedReceiptDate'),
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
    ]
    const columns2 = [
      {
        prop: 'rfqNo',
        label: vm.$t('PURCHASE.requestForQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        fixed: true
      },
      {
        prop: 'productName',
        label: vm.$t('PURCHASE.productName'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'internalPartNo',
        label: vm.$t('PURCHASE.internalPartNo'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'productCount',
        label: vm.$t('PURCHASE.productQty'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('PURCHASE.supplierName'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'purchaseQuotationNo',
        label: vm.$t('PURCHASE.purchaseQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'documentNo',
        label: vm.$t('PURCHASE.DocNo'),
        visible: true,
        minWidth: 160,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'rfqStatus',
        propBy: 'rfqStatusStr',
        label: vm.$t('ui.status'),
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
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('PURCHASE.department'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },

      {
        prop: 'receiveAddressName',
        label: vm.$t('PURCHASE.deliveryAddress'),
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
    ]
    const columns3 = [
      {
        prop: 'rfqNo',
        label: vm.$t('PURCHASE.requestForQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        fixed: true
      },
      {
        prop: 'productName',
        label: vm.$t('PURCHASE.productName'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'internalPartNo',
        label: vm.$t('PURCHASE.internalPartNo'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'productCount',
        label: vm.$t('PURCHASE.productQty'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('PURCHASE.supplierName'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'purchaseQuotationNo',
        label: vm.$t('PURCHASE.purchaseQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'documentNo',
        label: vm.$t('PURCHASE.DocNo'),
        visible: true,
        minWidth: 160,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'rfqStatus',
        propBy: 'rfqStatusStr',
        label: vm.$t('ui.status'),
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
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('PURCHASE.department'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },
      {
        prop: 'receiveAddressName',
        label: vm.$t('PURCHASE.deliveryAddress'),
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
    ]
    const columns4 = [
      {
        prop: 'rfqNo',
        label: vm.$t('PURCHASE.requestForQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        fixed: true
      },
      {
        prop: 'productName',
        label: vm.$t('PURCHASE.productName'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'internalPartNo',
        label: vm.$t('PURCHASE.internalPartNo'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'productCount',
        label: vm.$t('PURCHASE.productQty'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('PURCHASE.supplierName'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'purchaseQuotationNo',
        label: vm.$t('PURCHASE.purchaseQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'documentNo',
        label: vm.$t('PURCHASE.DocNo'),
        visible: true,
        minWidth: 160,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'rfqStatus',
        propBy: 'rfqStatusStr',
        label: vm.$t('ui.status'),
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
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('PURCHASE.department'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },
      {
        prop: 'receiveAddressName',
        label: vm.$t('PURCHASE.deliveryAddress'),
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
        prop: 'rfqNo',
        label: vm.$t('PURCHASE.requestForQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        fixed: true
      },
      {
        prop: 'productName',
        label: vm.$t('PURCHASE.productName'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'internalPartNo',
        label: vm.$t('PURCHASE.internalPartNo'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'productCount',
        label: vm.$t('PURCHASE.productQty'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('PURCHASE.supplierName'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'documentNo',
        label: vm.$t('PURCHASE.DocNo'),
        visible: true,
        minWidth: 160,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'rfqStatus',
        propBy: 'rfqStatusStr',
        label: vm.$t('ui.status'),
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
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('PURCHASE.department'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },
      {
        prop: 'receiveAddressName',
        label: vm.$t('PURCHASE.deliveryAddress'),
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
        prop: 'rfqNo',
        label: vm.$t('PURCHASE.requestForQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        fixed: true
      },
      {
        prop: 'productName',
        label: vm.$t('PURCHASE.productName'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'internalPartNo',
        label: vm.$t('PURCHASE.internalPartNo'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'productCount',
        label: vm.$t('PURCHASE.productQty'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'businessPartnerName',
        label: vm.$t('PURCHASE.supplierName'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'purchaseQuotationNo',
        label: vm.$t('PURCHASE.purchaseQuotationNo'),
        visible: true,
        minWidth: 200,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'documentNo',
        label: vm.$t('PURCHASE.DocNo'),
        visible: true,
        minWidth: 160,
        tooltip: false,
        sortable: 'custom'
      },
      {
        prop: 'rfqStatus',
        propBy: 'rfqStatusStr',
        label: vm.$t('ui.status'),
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
      // {
      //   prop: 'branchCompanyDeptName',
      //   label: vm.$t('PURCHASE.department'),
      //   visible: true,
      //   minWidth: 200,
      //   tooltip: true
      // },
      {
        prop: 'receiveAddressName',
        label: vm.$t('PURCHASE.deliveryAddress'),
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
    ]
    return {
      activeName: '1',
      tabs: [
        {
          name: this.$t('PURCHASE.all'),
          value: '0'
        },
        {
          name: this.$t('PURCHASE.pendInquiry'),
          value: '1',
          auth: 'purchaseManagement:requestForQuotation:pendInquiry'
        },
        {
          name: this.$t('PURCHASE.open'),
          value: '7',
          auth: 'purchaseManagement:requestForQuotation:open'
        },
        {
          name: this.$t('PURCHASE.pendQuote'),
          value: '2',
          auth: 'purchaseManagement:requestForQuotation:pendQuote'
        },
        {
          name: this.$t('PURCHASE.quoted'),
          value: '3',
          auth: 'purchaseManagement:requestForQuotation:quoted'
        },
        // {
        //   name: this.$t('PURCHASE.partiallyPurchased'),
        //   value: '8',
        //   auth: 'purchaseManagement:requestForQuotation:partiallyPurchased'
        // },
        {
          name: this.$t('PURCHASE.purchased'),
          value: '9',
          auth: 'purchaseManagement:requestForQuotation:purchased'
        },
        {
          name: this.$t('PURCHASE.cancelled'),
          value: '5',
          auth: 'purchaseManagement:requestForQuotation:cancelled'
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
        7: columns2,
        8: columns3,
        9: columns3
      },
      searchData: [],
      searchData0: [
        {
          name: 'condition',
          placeholder: `${vm.$t('PURCHASE.projectCode')} / ${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        },
        /* {
          name: 'selectAnInputName',
          label: '',
          minSelectWidth: 140,
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('PURCHASE.RFQNo'), value: 'conditionForRFQ' },
            { label: this.$t('PURCHASE.DocNo'), value: 'conditionForPR' },
            { label: this.$t('PURCHASE.PQNo'), value: 'conditionForPQ' }
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
          label: vm.$t('PURCHASE.supplier'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        },
        {
          name: 'departmentIdList',
          label: vm.$t('PURCHASE.department'),
          type: 'ElcascaderEle',
          width: '230px',
          mapValue: 'value',
          mapLabel: 'label',
          selectData: []
        },
        {
          name: 'rfqStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'receiveAddressNameList',
          label: vm.$t('PURCHASE.deliveryAddress'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'receiveAddressName',
          selectLabel: 'receiveAddressName',
          selectData: []
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
          placeholder: `${vm.$t('PURCHASE.projectCode')} / ${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        },
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          // selectData: [{ label: this.$t('PURCHASE.DocNo'), value: 'conditionForPR' }],
          selectData: [{ label: this.$t('PURCHASE.DocNo'), value: 'conditionForDocumentNo' }],
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
          name: 'departmentIdList',
          label: vm.$t('PURCHASE.department'),
          type: 'ElcascaderEle',
          width: '230px',
          mapValue: 'value',
          mapLabel: 'label',
          selectData: []
        },
        {
          name: 'receiveAddressNameList',
          label: vm.$t('PURCHASE.deliveryAddress'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'receiveAddressName',
          selectLabel: 'receiveAddressName',
          selectData: []
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
          placeholder: `${vm.$t('PURCHASE.projectCode')} / ${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        },
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('PURCHASE.RFQNo'), value: 'conditionForRFQ' },
            { label: this.$t('PURCHASE.DocNo'), value: 'conditionForPR' }
            // { label: this.$t('PURCHASE.PONo'), value: 'conditionForPQ' }
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
          label: vm.$t('PURCHASE.supplier'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        },
        {
          name: 'departmentIdList',
          label: vm.$t('PURCHASE.department'),
          type: 'ElcascaderEle',
          width: '230px',
          mapValue: 'value',
          mapLabel: 'label',
          selectData: []
        },
        {
          name: 'receiveAddressNameList',
          label: vm.$t('PURCHASE.deliveryAddress'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'receiveAddressName',
          selectLabel: 'receiveAddressName',
          selectData: []
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
          placeholder: `${vm.$t('PURCHASE.projectCode')} / ${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        },
        /* {
          name: 'selectAnInputName',
          label: '',
          minSelectWidth: 140,
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('PURCHASE.RFQNo'), value: 'conditionForRFQ' },
            { label: this.$t('PURCHASE.DocNo'), value: 'conditionForPR' },
            { label: this.$t('PURCHASE.PQNo'), value: 'conditionForPQ' }
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
          label: vm.$t('PURCHASE.supplier'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        },
        {
          name: 'departmentIdList',
          label: vm.$t('PURCHASE.department'),
          type: 'ElcascaderEle',
          width: '230px',
          mapValue: 'value',
          mapLabel: 'label',
          selectData: []
        },
        {
          name: 'receiveAddressNameList',
          label: vm.$t('PURCHASE.deliveryAddress'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'receiveAddressName',
          selectLabel: 'receiveAddressName',
          selectData: []
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
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        }
      ],

      conditionForRFQList: [],
      conditionForPRList: [],
      conditionForPQList: [],

      searchFormKey: Date.now()
    }
  }
}
