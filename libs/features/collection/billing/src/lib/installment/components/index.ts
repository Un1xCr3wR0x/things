/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { InstallmentAccountDetailsDcComponent } from './installment-account-details-dc/installment-account-details-dc.component';
import { InstallmentDetailsScComponent } from './installment-details-sc/installment-details-sc.component';
import { InstallmentDetailsViewDcComponent } from './installment-details-view-dc/installment-details-view-dc.component';
import { InstallmentDownPaymentDcComponent } from './installment-down-payment-dc/installment-down-payment-dc.component';
import { InstallmentFileUploadDcComponent } from './installment-file-upload-dc/installment-file-upload-dc.component';
import { InstallmentGracePeriodExtendedDcComponent } from './installment-grace-period-extended-dc/installment-grace-period-extended-dc.component';
import { InstallmentGuaranteeDetailsDcComponent } from './installment-guarantee-details-dc/installment-guarantee-details-dc.component';
import { InstallmentHeaderInfoDcComponent } from './installment-header-info-dc/installment-header-info-dc.component';
import { InstallmentSummaryDcComponent } from './installment-summary-dc/installment-summary-dc.component';
import { InstallmentSummaryScComponent } from './installment-summary-sc/installment-summary-sc.component';
import { InstallmentGuaranteeViewDcComponent } from './installment-guarantee-view-dc/installment-guarantee-view-dc.component';
import { InstallmentHistoryScComponent } from './installment-history-sc/installment-history-sc.component';

export const INSTALLMENT_COMPONENTS = [
  InstallmentDetailsScComponent,
  InstallmentAccountDetailsDcComponent,
  InstallmentGuaranteeDetailsDcComponent,
  InstallmentDetailsViewDcComponent,
  InstallmentHistoryScComponent,
  InstallmentHeaderInfoDcComponent,
  InstallmentDownPaymentDcComponent,
  InstallmentHeaderInfoDcComponent,
  InstallmentFileUploadDcComponent,
  InstallmentGracePeriodExtendedDcComponent,
  InstallmentSummaryDcComponent,
  InstallmentSummaryScComponent,
  InstallmentGuaranteeViewDcComponent
];

export * from './installment-details-sc/installment-details-sc.component';
export * from './installment-account-details-dc/installment-account-details-dc.component';
export * from './installment-details-view-dc/installment-details-view-dc.component';
export * from './installment-header-info-dc/installment-header-info-dc.component';
export * from './installment-history-sc/installment-history-sc.component';
export * from './installment-down-payment-dc/installment-down-payment-dc.component';
export * from './installment-file-upload-dc/installment-file-upload-dc.component';
export * from './installment-grace-period-extended-dc/installment-grace-period-extended-dc.component';
export * from './installment-summary-dc/installment-summary-dc.component';
export * from './installment-summary-sc/installment-summary-sc.component';
export * from './installment-guarantee-view-dc/installment-guarantee-view-dc.component';
