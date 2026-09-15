import { queryRevisionVersions as productVersions, compareRevisionDiff as productDiff } from '@/api/productManagement/productInfo'
import productSchema from './schemas/product'
import { queryRevisionVersions as transferOrderVersions, compareRevisionDiff as transferOrderDiff } from '@/api/inventoryManagement/transferOrder'
import transferOrderSchema from './schemas/transferOrder'
import { queryRevisionVersions as storeIssueChitVersions, compareRevisionDiff as storeIssueChitDiff } from '@/api/projectManagement/storeIssueChit'
import storeIssueChitSchema from './schemas/storeIssueChit'
import { queryRevisionVersions as inventoryInitializationVersions, compareRevisionDiff as inventoryInitializationDiff } from '@/api/inventoryManagement/inventoryInitialization'
import inventoryInitializationSchema from './schemas/inventoryInitialization'
import { queryRevisionVersions as emergencyGoodsReceiptVersions, compareRevisionDiff as emergencyGoodsReceiptDiff } from '@/api/inventoryManagement/emergencyGoodsReceipt'
import emergencyGoodsReceiptSchema from './schemas/emergencyGoodsReceipt'
import { queryRevisionVersions as scrapVersions, compareRevisionDiff as scrapDiff } from '@/api/inventoryManagement/labelScrap'
import scrapSchema from './schemas/scrap'
import { queryRevisionVersions as purchaseRequisiteVersions, compareRevisionDiff as purchaseRequisiteDiff } from '@/api/purchaseManagement/purchaseRequisition'
import purchaseRequisiteSchema from './schemas/purchaseRequisite'
import { queryRevisionVersions as purchaseReturnVersions, compareRevisionDiff as purchaseReturnDiff } from '@/api/purchaseManagement/purchaseReturnOrder'
import purchaseReturnSchema from './schemas/purchaseReturn'
import { queryRevisionVersions as consignmentOrderVersions, compareRevisionDiff as consignmentOrderDiff } from '@/api/purchaseManagement/consignmentOrder'
import consignmentOrderSchema from './schemas/consignmentOrder'
import { queryRevisionVersions as approvedSupplierVersions, compareRevisionDiff as approvedSupplierDiff } from '@/api/purchaseManagement/asl'
import approvedSupplierSchema from './schemas/approvedSupplier'
import { queryRevisionVersions as salesInquiryVersions, compareRevisionDiff as salesInquiryDiff } from '@/api/salesManagement/salesInquiry'
import salesInquirySchema from './schemas/salesInquiry'
import { queryRevisionVersions as salesQuotationVersions, compareRevisionDiff as salesQuotationDiff } from '@/api/salesManagement/salesQuotation'
import salesQuotationSchema from './schemas/salesQuotation'
import { queryRevisionVersions as salesGoodsReturnVersions, compareRevisionDiff as salesGoodsReturnDiff } from '@/api/salesManagement/salesGoodsReturn'
import salesGoodsReturnSchema from './schemas/salesGoodsReturn'
import { queryRevisionVersions as salesPriceVersions, compareRevisionDiff as salesPriceDiff } from '@/api/salesManagement/salesPrice'
import salesPriceSchema from './schemas/salesPrice'
import { queryRevisionVersions as proformaInvoiceVersions, compareRevisionDiff as proformaInvoiceDiff } from '@/api/salesManagement/proformaInvoice'
import proformaInvoiceSchema from './schemas/proformaInvoice'
import { queryRevisionVersions as businessPartnerVersions, compareRevisionDiff as businessPartnerDiff } from '@/api/businessPartner/businessPartner'
import businessPartnerSchema from './schemas/businessPartner'

export const revisionModules = {
  product: { loadVersions: productVersions, compare: productDiff, schema: productSchema },
  transferOrder: { loadVersions: transferOrderVersions, compare: transferOrderDiff, schema: transferOrderSchema },
  storeIssueChit: { loadVersions: storeIssueChitVersions, compare: storeIssueChitDiff, schema: storeIssueChitSchema },
  inventoryInitialization: { loadVersions: inventoryInitializationVersions, compare: inventoryInitializationDiff, schema: inventoryInitializationSchema },
  emergencyGoodsReceipt: { loadVersions: emergencyGoodsReceiptVersions, compare: emergencyGoodsReceiptDiff, schema: emergencyGoodsReceiptSchema },
  scrap: { loadVersions: scrapVersions, compare: scrapDiff, schema: scrapSchema },
  purchaseRequisite: { loadVersions: purchaseRequisiteVersions, compare: purchaseRequisiteDiff, schema: purchaseRequisiteSchema },
  purchaseReturn: { loadVersions: purchaseReturnVersions, compare: purchaseReturnDiff, schema: purchaseReturnSchema },
  consignmentOrder: { loadVersions: consignmentOrderVersions, compare: consignmentOrderDiff, schema: consignmentOrderSchema },
  approvedSupplier: { loadVersions: approvedSupplierVersions, compare: approvedSupplierDiff, schema: approvedSupplierSchema },
  salesInquiry: { loadVersions: salesInquiryVersions, compare: salesInquiryDiff, schema: salesInquirySchema },
  salesQuotation: { loadVersions: salesQuotationVersions, compare: salesQuotationDiff, schema: salesQuotationSchema },
  salesGoodsReturn: { loadVersions: salesGoodsReturnVersions, compare: salesGoodsReturnDiff, schema: salesGoodsReturnSchema },
  salesPrice: { loadVersions: salesPriceVersions, compare: salesPriceDiff, schema: salesPriceSchema },
  proformaInvoice: { loadVersions: proformaInvoiceVersions, compare: proformaInvoiceDiff, schema: proformaInvoiceSchema },
  businessPartner: { loadVersions: businessPartnerVersions, compare: businessPartnerDiff, schema: businessPartnerSchema }
}
