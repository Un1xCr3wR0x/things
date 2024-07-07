import { ReactivateDcComponent } from "./reactivate-dc/reactivate-dc.component";
import { ReactivateDocumentDcComponent } from "./reactivate-document-dc/reactivate-document-dc.component";
import { ReactivateEngagementDetailsDcComponent } from "./reactivate-engagement-details-dc/reactivate-engagement-details-dc.component";
import { ReactivateScComponent } from "./reactivate-sc/reactivate-sc.component";
import { ReactivateWageTableDcComponent } from "./reactivate-wage-table-dc/reactivate-wage-table-dc.component";


export const REACTIVATE_COMPONENTS = [
  ReactivateScComponent ,
  ReactivateEngagementDetailsDcComponent,
  ReactivateDocumentDcComponent,
  ReactivateDcComponent,
  ReactivateWageTableDcComponent
];

export * from './reactivate-sc/reactivate-sc.component';
export * from './reactivate-dc/reactivate-dc.component';
export * from './reactivate-document-dc/reactivate-document-dc.component';
export * from './reactivate-engagement-details-dc/reactivate-engagement-details-dc.component';
export * from './reactivate-wage-table-dc/reactivate-wage-table-dc.component';

