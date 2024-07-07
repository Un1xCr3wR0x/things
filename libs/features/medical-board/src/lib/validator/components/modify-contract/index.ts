/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DoctorDetailsDcComponent } from './doctor-details-dc/doctor-details-dc.component';
import { ValidateModifyContractScComponent } from './validate-modify-contract-sc/validate-modify-contract-sc.component';
import { ContractDetailsModifyDcComponent } from './contract-details-modify-dc/contract-details-modify-dc.component';

export const MODIFY_CONTRACT_COMPONENTS = [
  ContractDetailsModifyDcComponent,
  DoctorDetailsDcComponent,
  ValidateModifyContractScComponent
];

export * from './contract-details-modify-dc/contract-details-modify-dc.component';
export * from './doctor-details-dc/doctor-details-dc.component';
export * from './validate-modify-contract-sc/validate-modify-contract-sc.component';
