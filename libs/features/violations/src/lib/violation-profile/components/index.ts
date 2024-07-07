import { DocumentsDcComponent } from './documents-dc/documents-dc.component';
import { EffectedContributorsDcComponent } from './effected-contributors-dc/effected-contributors-dc.component';
import { ViolationProfileScComponent } from './violation-profile-sc/violation-profile-sc.component';
import { ViolationDetailsDcComponent } from './violation-details-dc/violation-details-dc.component';
import { InspectionDetailsDcComponent } from './inspection-details-dc/inspection-details-dc.component';
import { MODIFY_PENALTY_COMPONENTS } from './modify-penalty';
import { CANCEL_VIOLATION_COMPONENTS } from './cancel-violation';

export const VIOLATION_PROFILE_COMPONENTS = [
  ViolationProfileScComponent,
  EffectedContributorsDcComponent,
  DocumentsDcComponent,
  ViolationDetailsDcComponent,
  InspectionDetailsDcComponent,
  CANCEL_VIOLATION_COMPONENTS,
  MODIFY_PENALTY_COMPONENTS
];

export * from './violation-profile-sc/violation-profile-sc.component';
export * from './effected-contributors-dc/effected-contributors-dc.component';
export * from './documents-dc/documents-dc.component';
export * from './violation-details-dc/violation-details-dc.component';
export * from './inspection-details-dc/inspection-details-dc.component';
export * from './modify-penalty/index';
export * from './cancel-violation';
