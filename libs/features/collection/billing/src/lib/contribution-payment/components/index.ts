/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ContributionPaymentScComponent } from './contribution-payment-sc/contribution-payment-sc.component';
import { EstablishmentInfoDcComponent } from './establishment-info-dc/establishment-info-dc.component';
import { EstablishmentSearchDcComponent } from './establishment-search-dc/establishment-search-dc.component';
import { PaymentDetailsDcComponent } from './payment-details-dc/payment-details-dc.component';
import { PaymentFileUploadDcComponent } from './payment-file-upload-dc/payment-file-upload-dc.component';
import { PaymentSummaryDcComponent } from './payment-summary-dc/payment-summary-dc.component';
import { ReceiptAllocationDcComponent } from './receipt-allocation-dc/receipt-allocation-dc.component';
import { RecieptFilterDcComponent } from './reciept-filter-dc/reciept-filter-dc.component';
import { PaymentdetailsSummaryDcComponent } from './paymentdetails-summary-dc/paymentdetails-summary-dc.component';
import { ReceiptAllocationSummaryDcComponent } from './receipt-allocation-summary-dc/receipt-allocation-summary-dc.component';
import { CANCEL_RECEIPT_COMPONENTS } from './cancel-receipts';

export const CONTRIBUTION_PAYMENT_COMPONENTS = [
  ContributionPaymentScComponent,
  PaymentDetailsDcComponent,
  PaymentFileUploadDcComponent,
  EstablishmentSearchDcComponent,
  PaymentSummaryDcComponent,
  ReceiptAllocationDcComponent,
  EstablishmentInfoDcComponent,
  RecieptFilterDcComponent,
  PaymentdetailsSummaryDcComponent,
  ReceiptAllocationSummaryDcComponent,
  CANCEL_RECEIPT_COMPONENTS
];

export * from './contribution-payment-sc/contribution-payment-sc.component';
export * from './establishment-info-dc/establishment-info-dc.component';
export * from './establishment-search-dc/establishment-search-dc.component';
export * from './payment-details-dc/payment-details-dc.component';
export * from './payment-file-upload-dc/payment-file-upload-dc.component';
export * from './payment-summary-dc/payment-summary-dc.component';
export * from './receipt-allocation-dc/receipt-allocation-dc.component';
export * from './reciept-filter-dc/reciept-filter-dc.component';
export * from './paymentdetails-summary-dc/paymentdetails-summary-dc.component';
export * from './receipt-allocation-summary-dc/receipt-allocation-summary-dc.component';
export * from './cancel-receipts';
