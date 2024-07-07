/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ADD_MEMBER_COMPONENTS } from './add-member';
import { CONTRIBUTOR_CLARIFICATION_COMPONENT } from './contributor-clarification-sc';
import { MODIFY_CONTRACT_COMPONENTS } from './modify-contract';
import { TERMINATE_CONTRACT_COMPONENTS } from './terminate-contract';
import { ValidatorMedicalBoardSessionScComponent } from './validator-medical-board-session-sc/validator-medical-board-session-sc.component';
import { GOSI_DOCTOR_COMPONENTS } from './gosi-doctor-view';

export const VALIDATOR_COMPONENTS_MEDICAL = [
  ADD_MEMBER_COMPONENTS,
  MODIFY_CONTRACT_COMPONENTS,
  TERMINATE_CONTRACT_COMPONENTS,
  GOSI_DOCTOR_COMPONENTS,
  ValidatorMedicalBoardSessionScComponent,
  CONTRIBUTOR_CLARIFICATION_COMPONENT
];

export * from './add-member';
export * from './modify-contract';
export * from './terminate-contract';
export * from './validator-medical-board-session-sc/validator-medical-board-session-sc.component';
export * from './gosi-doctor-view';
export * from './contributor-clarification-sc'
