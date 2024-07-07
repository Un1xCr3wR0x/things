import { InstallmentDetailsScComponent } from './installment-details-sc/installment-details-sc.component';
import { InstallmentGuaranteeDetailsDcComponent } from './installment-guarantee-details-dc/installment-guarantee-details-dc.component';
import { InstallmentEstablishmentDetailsDcComponent } from './installment-establishment-details-dc/installment-establishment-details-dc.component';
import { InstallmentDetailsDcComponent } from './installment-details-dc/installment-details-dc.component';
import { InstallmentAccountDetailsDcComponent } from './installment-account-details-dc/installment-account-details-dc.component';
import { InstallmentScheduleViewDcComponent } from './installment-schedule-view-dc/installment-schedule-view-dc.component';

export const BILLING_INSTALLMENT_COMPONENTS = [
  InstallmentDetailsScComponent,
  InstallmentDetailsDcComponent,
  InstallmentEstablishmentDetailsDcComponent,
  InstallmentGuaranteeDetailsDcComponent,
  InstallmentAccountDetailsDcComponent,
  InstallmentScheduleViewDcComponent
];

export * from './installment-details-sc/installment-details-sc.component';
export * from './installment-guarantee-details-dc/installment-guarantee-details-dc.component';
export * from './installment-establishment-details-dc/installment-establishment-details-dc.component';
export * from './installment-details-dc/installment-details-dc.component';
export * from './installment-account-details-dc/installment-account-details-dc.component';
export * from './installment-schedule-view-dc/installment-schedule-view-dc.component';
