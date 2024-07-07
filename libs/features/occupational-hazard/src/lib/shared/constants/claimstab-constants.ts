import { RoleIdEnum, Tab } from '@gosi-ui/core';
import { TabSetVariables } from '../enums';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ClaimsTabConstants {
  public static getTransactionTabs(isAppPrivate: boolean): Tab[] {
    return [
      {
        icon: '',
        id: TabSetVariables.Injury,
        label: 'OCCUPATIONAL-HAZARD.REQUEST-DETAILS',
        allowedRoles: isAppPrivate
          ? [
              RoleIdEnum.CSR,
              RoleIdEnum.OH_OFFICER,
              RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
              RoleIdEnum.MEDICAL_AUDITOR,
              RoleIdEnum.MEDICA_AUDITOR,
              RoleIdEnum.MEDICAL_BOARD_SECRETARY,
              RoleIdEnum.CUSTOMER_CARE_OFFICER,
              RoleIdEnum.CUSTOMER_CARE_SENIOR_OFFICER,
              RoleIdEnum.CALL_CENTRE_AGENT,
              RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
              RoleIdEnum.INSURANCE_BENEFIT_SECTION_MANAGER,
              RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER,
              RoleIdEnum.FEATURE_360_ALL_USER,
              RoleIdEnum.WORK_INJURIES_OCCUPATIONAL_DISEASES_SPECIALIST,
              RoleIdEnum.FC,
              RoleIdEnum.OH_FC,
              RoleIdEnum.GDISO,
              RoleIdEnum.GCC_CSR,
              RoleIdEnum.BOARD_OFFICER,
              RoleIdEnum.CLM_MGR,
              RoleIdEnum.DOCTOR,
              RoleIdEnum.REGISTRATION_CONTRIBUTIONS_OPERATIONS_OFFICER
            ]
          : [RoleIdEnum.OH_ADMIN, RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN, RoleIdEnum.SUBSCRIBER]
      },
      {
        icon: '',
        id: TabSetVariables.Allowance,
        label: 'OCCUPATIONAL-HAZARD.ALLOWANCE-DETAILS',
        allowedRoles: isAppPrivate
          ? [
              RoleIdEnum.CSR,
              RoleIdEnum.OH_OFFICER,
              RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
              RoleIdEnum.MEDICAL_AUDITOR,
              RoleIdEnum.MEDICA_AUDITOR,
              RoleIdEnum.CUSTOMER_CARE_OFFICER,
              RoleIdEnum.CUSTOMER_CARE_SENIOR_OFFICER,
              RoleIdEnum.CALL_CENTRE_AGENT,
              RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
              RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER,
              RoleIdEnum.INSURANCE_BENEFIT_SECTION_MANAGER,
              RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER,
              RoleIdEnum.FEATURE_360_ALL_USER,
              RoleIdEnum.WORK_INJURIES_OCCUPATIONAL_DISEASES_SPECIALIST,
              RoleIdEnum.FC,
              RoleIdEnum.OH_FC,
              RoleIdEnum.GDISO,
              RoleIdEnum.DOCTOR,
              RoleIdEnum.CLM_MGR,
              RoleIdEnum.BOARD_OFFICER
            ]
          : [RoleIdEnum.OH_ADMIN, RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN, RoleIdEnum.SUBSCRIBER]
      },
      {
        icon: '',
        id: TabSetVariables.Claims,
        label: 'OCCUPATIONAL-HAZARD.CLAIMS-DETAILS',
        allowedRoles: isAppPrivate
          ? [
              RoleIdEnum.CSR,
              RoleIdEnum.OH_OFFICER,
              RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
              RoleIdEnum.MEDICAL_AUDITOR,
              RoleIdEnum.FC,
              RoleIdEnum.OH_FC,
              RoleIdEnum.CUSTOMER_CARE_OFFICER,
              RoleIdEnum.CUSTOMER_CARE_SENIOR_OFFICER,
              RoleIdEnum.FEATURE_360_ALL_USER,
              RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
              RoleIdEnum.CALL_CENTRE_AGENT,
              RoleIdEnum.MEDICA_AUDITOR,
              RoleIdEnum.GDISO,
              RoleIdEnum.DOCTOR,
              RoleIdEnum.CLM_MGR
            ]
          : [RoleIdEnum.OH_ADMIN, RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN]
      }
    ];
  }
}
