import { HealthInsuranceScComponent } from "./health-insurance-sc/health-insurance-sc.component";
import { HealthInsuranceDetailsDcComponent } from "@gosi-ui/features/contributor/lib/health-insurance/components/health-insurance-details-dc/health-insurance-details-dc.component";
import { CntHealthInsuranceTabsDcComponent } from "@gosi-ui/features/contributor/lib/health-insurance/components/cnt-health-insurance-tabs-dc/cnt-health-insurance-tabs-dc.component";
import { CntHealthInsuranceTableDcComponent } from "@gosi-ui/features/contributor/lib/health-insurance/components/cnt-health-insurance-table-dc/cnt-health-insurance-table-dc.component";

export const HEALTH_INSURANCE_COMPONENTS = [
  HealthInsuranceScComponent,
    HealthInsuranceDetailsDcComponent,
    CntHealthInsuranceTabsDcComponent,
    CntHealthInsuranceTableDcComponent
];

export * from './health-insurance-sc/health-insurance-sc.component';
export * from './cnt-health-insurance-tabs-dc/cnt-health-insurance-tabs-dc.component';
export * from './health-insurance-details-dc/health-insurance-details-dc.component';

