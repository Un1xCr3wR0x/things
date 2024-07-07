/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { RoleIdEnum } from '@gosi-ui/core';

export class EligibleRoleConstants {
  /**
   * method to get the eligible internal roles to view the violation details
   */
  public static get ELIGIBLE_INTERNAL_ROLES(): RoleIdEnum[] {
    return [
      RoleIdEnum.CSR,
      RoleIdEnum.INSURANCE_PRTN_EXTN_SPVR,
      RoleIdEnum.REGISTRATION_CONTRIBUTIONS_OPERATIONS_OFFICER,
      RoleIdEnum.BRANCH_MANAGER,
      RoleIdEnum.INS_PROT_EXT_SPVSR,
      RoleIdEnum.GCC_CSR,
      RoleIdEnum.FC,
      RoleIdEnum.FEATURE_360_ALL_USER,
      RoleIdEnum.RELATION_OFFICER,
      RoleIdEnum.CALL_CENTRE_AGENT,
      RoleIdEnum.OH_OFFICER,
      RoleIdEnum.OH_FC,
      RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER,
      RoleIdEnum.INS_BENF_OFFICER_SPVR,
      RoleIdEnum.DOCTOR,
      RoleIdEnum.FC_SUPERVISOR,
      RoleIdEnum.SOCIAL_INS_INSP,
      RoleIdEnum.REG_CONT_OPER_SPVSR,
      RoleIdEnum.CLM_MGR,
      RoleIdEnum.COLLECTION_OFFICER,
      RoleIdEnum.COLLECTIONS_DEPARTMENT_MANAGER,
      RoleIdEnum.CUSTOMER_CARE_DEPARTMENT_MANAGER,
      RoleIdEnum.CUSTOMER_CARE_OFFICER,
      RoleIdEnum.CUSTOMER_CARE_SENIOR_OFFICER,
      RoleIdEnum.CUSTOMER_SERVICE_AND_BRANCHES_GENERAL_DIRECTOR,
      RoleIdEnum.CUSTOMER_SERVICE_SUPERVISOR,
      RoleIdEnum.GENERAL_DIRECTOR_FOR_INSPECTION_AND_COLLECTION,
      RoleIdEnum.GDISO,
      RoleIdEnum.INSURANCE_BENEFIT_SECTION_MANAGER,
      RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
      RoleIdEnum.MEDICAL_BOARD_SECRETARY,
      RoleIdEnum.MC_OFFICER,
      RoleIdEnum.MEDICAL_SERVICES_DEPARTMENT_MANAGER,
      RoleIdEnum.BOARD_OFFICER,
      RoleIdEnum.MS_OFFICER,
      RoleIdEnum.SENIOR_OPERATION_ANALYST,
      RoleIdEnum.VIOLATION_COMMITTEE_HEAD,
      RoleIdEnum.VIOLATION_COMMITTEE_MEMBER,
      RoleIdEnum.WORK_INJURIES_OCUPATIONAL_DISEASES_DOCTOR,
      RoleIdEnum.WORK_INJURIES_OCCUPATIONAL_DISEASES_SPECIALIST,
      RoleIdEnum.MEDICA_AUDITOR,
      RoleIdEnum.GD_MS_OS,
      RoleIdEnum.COMPLAINT_MANAGER,
      RoleIdEnum.COMPLAINT_CLERK,
      RoleIdEnum.ROLE_DOCTOR,
      RoleIdEnum.MEDICAL_AUDITOR
    ];
  }

  /**
   * method to get the eligible external roles to view the violation details
   */
  public static get ELIGIBLE_EXTERNAL_ROLES(): RoleIdEnum[] {
    return [RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN];
  }

  /**
   * method to get the eligible csr roles
   */
  public static get ELIGIBLE_CSR_ROLES(): RoleIdEnum[] {
    return [RoleIdEnum.CSR, RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE];
  }
}
