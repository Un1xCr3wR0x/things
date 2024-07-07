/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { RoleIdEnum } from '@gosi-ui/core';

export class FlagConstants {
  /**
   * method to get the eligible roles to perfoem the add or modify flag transaction
   */
  public static get ADD_FLAG_ACCESS_ROLES(): RoleIdEnum[] {
    return [RoleIdEnum.CUSTOMER_SERVICE_SUPERVISOR];
  }

  /**
   * method to get the eligible roles to view the flag details
   */
  public static get VIEW_FLAG_ACCESS_ROLES(): RoleIdEnum[] {
    return [
      RoleIdEnum.COLLECTIONS_DEPARTMENT_MANAGER,
      RoleIdEnum.CSR,
      RoleIdEnum.GCC_CSR,
      RoleIdEnum.CUSTOMER_CARE_DEPARTMENT_MANAGER,
      RoleIdEnum.REGISTRATION_CONTRIBUTIONS_OPERATIONS_OFFICER,
      RoleIdEnum.CUSTOMER_SERVICE_AND_BRANCHES_GENERAL_DIRECTOR,
      RoleIdEnum.GENERAL_DIRECTOR_FOR_INSPECTION_AND_COLLECTION,
      RoleIdEnum.GDISO,
      RoleIdEnum.FC,
      RoleIdEnum.FEATURE_360_ALL_USER,
      RoleIdEnum.CLM_MGR,
      RoleIdEnum.MC_OFFICER,
      RoleIdEnum.DOCTOR,
      RoleIdEnum.CUSTOMER_CARE_OFFICER,
      RoleIdEnum.COLLECTION_OFFICER,
      RoleIdEnum.CUSTOMER_SERVICE_SUPERVISOR,
      RoleIdEnum.CUSTOMER_CARE_SENIOR_OFFICER,
      RoleIdEnum.INSURANCE_BENEFIT_SECTION_MANAGER,
      RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER,
      RoleIdEnum.MEDICAL_BOARD_SECRETARY,
      RoleIdEnum.MEDICAL_SERVICES_DEPARTMENT_MANAGER,
      RoleIdEnum.MS_OFFICER,
      RoleIdEnum.VIOLATION_COMMITTEE_MEMBER,
      RoleIdEnum.WORK_INJURIES_OCCUPATIONAL_DISEASES_SPECIALIST,
      RoleIdEnum.WORK_INJURIES_OCUPATIONAL_DISEASES_DOCTOR,
      RoleIdEnum.VIOLATION_COMMITTEE_HEAD,
      RoleIdEnum.SENIOR_OPERATION_ANALYST,
      RoleIdEnum.COMPLAINT_CLERK,
      RoleIdEnum.COMPLAINT_MANAGER,
      RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
      RoleIdEnum.OH_OFFICER,
      RoleIdEnum.OH_FC,
      RoleIdEnum.INSURANCE_PRTN_EXTN_SPVR,
      RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER,
      RoleIdEnum.BRANCH_MANAGER,
      RoleIdEnum.INS_PROT_EXT_SPVSR,
      RoleIdEnum.RELATION_OFFICER,
      RoleIdEnum.CALL_CENTRE_AGENT,
      RoleIdEnum.INS_BENF_OFFICER_SPVR,
      RoleIdEnum.FC_SUPERVISOR,
      RoleIdEnum.SOCIAL_INS_INSP,
      RoleIdEnum.REG_CONT_OPER_SPVSR,
      RoleIdEnum.MEDICA_AUDITOR,
      RoleIdEnum.GD_MS_OS
    ];
  }
}
