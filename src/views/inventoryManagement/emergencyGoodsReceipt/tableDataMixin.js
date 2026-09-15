export default {
  created() {
    this.$$initColumnVisible(this.saveKey, this.columnsData[0])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'emergencyGoodsReceiptNo',
        label: vm.$t('PURCHASE.emergencyGoodsReceiptNo'),
        visible: true,
        minWidth: 200,
        tooltip: true,
        sortable: 'custom',
        fixed: true
      },
      {
        prop: 'deliveryOrderNo',
        label: vm.$t('PURCHASE.deliveryOrderNo1'),
        visible: true,
        minWidth: 160,
        tooltip: true,
        sortable: 'custom'
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
        prop: 'emergencyGoodsStatus',
        propBy: 'purchaseRequisiteStatusStr',
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
        prop: 'purchaseRequisiteNo',
        label: vm.$t('PURCHASE.purchaseRequisitionNo'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      {
        prop: 'purchaseOrderNo',
        label: vm.$t('PURCHASE.purchaseOrderNo'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      // {
      //   prop: 'purchaseOrderStatusShowStr',
      //   label: vm.$t('PURCHASE.poStatus'),
      //   minWidth: 160,
      //   visible: true,
      //   tooltip: true,
      //   sortable: 'custom'
      // },
      {
        prop: 'receivedDate',
        label: vm.$t('PURCHASE.receivedDate'),
        minWidth: 160,
        visible: true,
        tooltip: true,
        sortable: 'custom'
      },
      // {
      //   prop: 'stockInType',
      //   propBy: 'stockInTypeStr',
      //   label: vm.$t('PURCHASE.stockInType'),
      //   minWidth: 160,
      //   visible: true,
      //   tooltip: true
      // },
      // {
      //   prop: 'goodsReceiptNoteNo',
      //   label: vm.$t('PURCHASE.goodsReceiptNoteNo'),
      //   minWidth: 160,
      //   visible: true,
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
        /* {
          name: this.$t('menu.penPOApproval'),
          value: '3'
        }, */
        {
          name: this.$t('PURCHASE.pendInbound'),
          value: '6'
        },
        {
          name: this.$t('PURCHASE.partiallyInbound'),
          value: '7'
        },
        {
          name: this.$t('PURCHASE.completed'),
          value: '4'
        },
        {
          name: this.$t('PURCHASE.cancelled'),
          value: '5'
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
      }
    }
  }
}
