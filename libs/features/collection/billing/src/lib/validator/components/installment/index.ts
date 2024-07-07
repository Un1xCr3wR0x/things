import { InstallmentEstablishmentDetailsDcComponent } from './installment-establishment-details-dc/installment-establishment-details-dc.component';
import { InstallmentGuarandeeDetailsDcComponent } from './installment-guarandee-details-dc/installment-guarandee-details-dc.component';
import { ValidateInstallmentScComponent } from './validate-installment-sc/validate-installment-sc.component';
import { InstallmentScheduleDcComponent } from './installment-schedule-dc/installment-schedule-dc.component';

export const BILLING_INSTALLMENT_VALIDATOR_COMPONENTS = [
  ValidateInstallmentScComponent,
  InstallmentGuarandeeDetailsDcComponent,
  InstallmentEstablishmentDetailsDcComponent,
  InstallmentScheduleDcComponent
];
export * from './validate-installment-sc/validate-installment-sc.component';
export * from './installment-guarandee-details-dc/installment-guarandee-details-dc.component';
export * from './installment-establishment-details-dc/installment-establishment-details-dc.component';
export * from './installment-schedule-dc/installment-schedule-dc.component';
