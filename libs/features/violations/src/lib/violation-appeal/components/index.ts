import { DeclarationAppealModalDcComponent } from "./declaration-appeal/declaration-appeal-modal-dc.component";
import { ViolationAppealContributorDetailsDcComponent } from "./violation-appeal-contributor-details-dc/violation-appeal-contributor-details-dc.component";
import { ViolationAppealContributorSelectionDcComponent } from "./violation-appeal-contributor-selection-dc/violation-appeal-contributor-selection-dc.component";
import { ViolationAppealScComponent } from "./violation-appeal-sc/violation-appeal-sc.component";
import {AppealModalDcComponent} from "./appeal-modal-dc/appeal-modal-dc.component";




export const VIOLATION_APPEAL = [
  ViolationAppealScComponent,
  ViolationAppealContributorSelectionDcComponent,
  ViolationAppealContributorDetailsDcComponent,
  DeclarationAppealModalDcComponent,
  AppealModalDcComponent
]

export * from "./violation-appeal-contributor-details-dc/violation-appeal-contributor-details-dc.component";
export * from "./violation-appeal-contributor-selection-dc/violation-appeal-contributor-selection-dc.component";
export * from "./violation-appeal-sc/violation-appeal-sc.component";
export * from "./declaration-appeal/declaration-appeal-modal-dc.component";
export * from "./appeal-modal-dc/appeal-modal-dc.component";

