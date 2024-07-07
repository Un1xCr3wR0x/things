import { BULK_WAGE_COMPONENTS } from './bulk-wage';
import { ConfirmModalDcComponent } from './confirm-modal-dc/confirm-modal-dc.component';
import { ContributorListActionDcComponent } from './contributor-list-action-dc/contributor-list-action-dc.component';
import { EmployeeDetailsDcComponent } from './employee-details-dc/employee-details-dc.component';
import { IndividualCertificatesScComponent } from './individual-certificates-sc/individual-certificates-sc.component';
import { IndividualCertificatesDcComponent } from './individual-certificates-dc/individual-certificates-dc.component';
import { INDIVIDUAL_WAGE_COMPONENTS } from './individual-wage';
import { ManageWageTabsScComponent } from './manage-wage-tabs-sc/manage-wage-tabs-sc.component';
import { MULTIPLE_WAGE_COMPONENTS } from './multiple-wage';
import { VIC_UPDATE_WAGE_COMPONENTS } from './vic-individual-wage';
import { UNIFIED_ENGAGEMENT_COMPONENTS } from './unified-engagement';
import { INDIVIDUAL_ENGAGEMENT_COMPONENTS } from './individual-engagement/components';
import { INDIVIDUAL_MODIFY_ENGAGEMENT_COMPONENTS } from './individual-modify-engagement';

// Manage wage components
export const MANAGE_WAGE_COMPONENTS = [
  INDIVIDUAL_WAGE_COMPONENTS,
  BULK_WAGE_COMPONENTS,
  MULTIPLE_WAGE_COMPONENTS,
  VIC_UPDATE_WAGE_COMPONENTS,
  UNIFIED_ENGAGEMENT_COMPONENTS,
  ConfirmModalDcComponent,
  EmployeeDetailsDcComponent,
  ManageWageTabsScComponent,
  ContributorListActionDcComponent,
  INDIVIDUAL_ENGAGEMENT_COMPONENTS,
  INDIVIDUAL_MODIFY_ENGAGEMENT_COMPONENTS,
  IndividualCertificatesScComponent,
  IndividualCertificatesDcComponent
];

export * from './bulk-wage';
export * from './confirm-modal-dc/confirm-modal-dc.component';
export * from './contributor-list-action-dc/contributor-list-action-dc.component';
export * from './employee-details-dc/employee-details-dc.component';
export * from './individual-wage';
export * from './manage-wage-tabs-sc/manage-wage-tabs-sc.component';
export * from './multiple-wage';
export * from './individual-engagement/components';
export * from './individual-modify-engagement';
export * from './individual-certificates-sc/individual-certificates-sc.component';
export * from './individual-certificates-dc/individual-certificates-dc.component';
