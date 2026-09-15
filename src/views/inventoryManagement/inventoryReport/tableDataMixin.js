export default {
  created() {
    this.$$initColumnVisible('0', this.columnsData[0])
    this.$$initColumnVisible('1', this.columnsData[1])
  },
  data() {
    const vm = this
    const columns0 = [
      {
        prop: 'productName',
        label: vm.$t('PURCHASE.productName'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true,
        fixed: true
      },
      {
        prop: 'internalPartNo',
        label: vm.$t('PURCHASE.internalPartNo'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        padding: 60,
        tooltip: true
      },
      {
        prop: 'alias',
        label: vm.$t('PURCHASE.alias'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'warehouseName',
        label: vm.$t('PURCHASE.warehouseName'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'uom',
        label: vm.$t('INVENTORY.uom1'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true
      },
      // {
      //   prop: 'qtyOnHandInWarehouse',
      //   label: vm.$t('INVENTORY.actualStock'),
      //   visible: true,
      //   minWidth: 200,
      //   sortable: 'custom',
      //   padding: 60,
      //   tooltip: true
      // },
      {
        prop: 'putAwayQty',
        label: vm.$t('INVENTORY.shelvedQty'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        padding: 60,
        tooltip: true
      },
      // {
      //   prop: 'unqualifiedQty',
      //   label: vm.$t('PURCHASE.unqualifiedQTY'),
      //   visible: true,
      //   minWidth: 200,
      //   sortable: 'custom',
      //   padding: 60,
      //   tooltip: true
      // },
      {
        prop: 'occupiedQty',
        label: vm.$t('PURCHASE.reservedQTY'),
        visible: true,
        minWidth: 200,
        padding: 60,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'availableQty',
        label: vm.$t('PURCHASE.availableQTY'),
        visible: true,
        minWidth: 200,
        padding: 60,
        // sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'inTransitQty',
        label: vm.$t('PURCHASE.inTransitQTY'),
        visible: true,
        minWidth: 200,
        padding: 60,
        sortable: 'custom',
        tooltip: true
      },
      // {
      //   prop: 'anticipateQty',
      //   label: vm.$t('INVENTORY.anticipateQty'),
      //   visible: true,
      //   minWidth: 200,
      //   padding: 60,
      //   tooltip: true
      // },
      // {
      //   prop: 'sicQty',
      //   label: vm.$t('INVENTORY.sicQty'),
      //   visible: true,
      //   minWidth: 200,
      //   padding: 60,
      //   tooltip: true
      // },
      {
        prop: 'lockedAvailableQty',
        label: vm.$t('INVENTORY.numberOfLocks'),
        visible: true,
        minWidth: 200,
        padding: 60,
        tooltip: true
      }
    ]
    const columns1 = [
      {
        prop: 'batchNo',
        label: vm.$t('INVENTORY.batchNo'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true,
        fixed: true
      },
      {
        prop: 'productName',
        label: vm.$t('PURCHASE.productName'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'internalPartNo',
        label: vm.$t('PURCHASE.internalPartNo'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        padding: 60,
        tooltip: true
      },
      {
        prop: 'alias',
        label: vm.$t('PURCHASE.alias'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'warehouseName',
        label: vm.$t('PURCHASE.warehouseName'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'uom',
        label: vm.$t('INVENTORY.uom1'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        tooltip: true
      },
      // {
      //   prop: 'qtyOnHandInWarehouse',
      //   label: vm.$t('INVENTORY.actualStock'),
      //   visible: true,
      //   minWidth: 200,
      //   padding: 60,
      //   sortable: 'custom',
      //   tooltip: true
      // },
      {
        prop: 'putAwayQty',
        label: vm.$t('INVENTORY.shelvedQty'),
        visible: true,
        minWidth: 200,
        sortable: 'custom',
        padding: 60,
        tooltip: true
      },
      {
        prop: 'availableQty',
        label: vm.$t('PURCHASE.availableQTY'),
        visible: true,
        minWidth: 200,
        padding: 60,
        sortable: 'custom',
        tooltip: true
      },
      {
        prop: 'reservedQty',
        label: vm.$t('PURCHASE.reservedQTY'),
        visible: true,
        minWidth: 200,
        padding: 60,
        sortable: 'custom',
        tooltip: true
      }
      // {
      //   prop: 'lockedQty',
      //   label: vm.$t('INVENTORY.numberOfLocks'),
      //   visible: true,
      //   minWidth: 200,
      //   padding: 60,
      //   tooltip: true
      // }
    ]
    return {
      activeName: '0',
      badgeKey: Date.now(),
      columnsData: {
        0: columns0,
        1: columns1
      },
      searchData0: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${this.$t('ui.productSearch')}`
        },
        {
          name: 'productCategoryId',
          label: this.$t('PRODUCT.productCategory1'),
          type: 'ElcascaderEle',
          width: '230px',
          mapValue: 'id',
          mapLabel: 'categoryName',
          checkStrictly: true,
          multiple: true,
          selectData: []
        },
        {
          name: 'warehouseIdList',
          label: vm.$t('INVENTORY.warehouseName'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'warehouseId',
          selectLabel: 'warehouseName',
          selectData: []
        }
      ],
      searchData1: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        },
        {
          name: 'productCategoryId',
          label: this.$t('PRODUCT.productCategory1'),
          type: 'ElcascaderEle',
          width: '230px',
          mapValue: 'id',
          mapLabel: 'categoryName',
          checkStrictly: true,
          multiple: true,
          selectData: []
        },
        {
          name: 'warehouseIdList',
          label: vm.$t('INVENTORY.warehouseName'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'warehouseId',
          selectLabel: 'warehouseName',
          selectData: []
        },
        {
          name: 'conditionForBatchNo',
          label: vm.$t('INVENTORY.batchNo'),
          type: 'InputEle',
          isLine: false
        }
      ],
      searchFormKey: Date.now()
    }
  }
}
