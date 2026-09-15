export default {
  created() {
    this.$$initColumnVisible(this.saveKey, this.columnsData[0])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'purchaseRequisiteNo',
        label: vm.$t('PURCHASE.purchaseRequisitionNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        fixed: true
      },
      {
        prop: 'requiredType',
        propBy: 'requiredTypeStr',
        label: vm.$t('PURCHASE.requiredFrom'),
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
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'requiredBy',
        label: vm.$t('PURCHASE.requiredBy'),
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
        prop: 'branchCompanyDeptName',
        label: vm.$t('PURCHASE.department'),
        visible: true,
        minWidth: 200,
        tooltip: true
      },
      {
        prop: 'purchaseRequisiteStatusShowStr',
        label: vm.$t('ui.status'),
        visible: true,
        minWidth: 160,
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
        prop: 'productName',
        label: vm.$t('PURCHASE.productName'),
        minWidth: 160,
        visible: true,
        tooltip: false
      },
      {
        prop: 'deliveryDate',
        label: vm.$t('PURCHASE.requestedReceiptDate'),
        minWidth: 160,
        visible: true,
        tooltip: false,
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
        {
          name: this.$t('PURCHASE.pendPurchase'),
          value: '3'
        },
        // {
        //   name: this.$t('PURCHASE.partiallyPurchased'),
        //   value: '4'
        // },
        // {
        //   name: this.$t('PURCHASE.completed'),
        //   value: '5'
        // },
        {
          name: this.$t('PURCHASE.allPurchase'),
          value: '8'
        },
        {
          name: this.$t('PURCHASE.completed'),
          value: '9'
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
        7: columns0,
        8: columns0,
        9: columns0
      }
    }
  }
}
