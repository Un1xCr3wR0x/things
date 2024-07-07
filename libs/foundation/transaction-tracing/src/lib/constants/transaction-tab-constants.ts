import { RoleIdEnum, RouterConstants, Tab } from '@gosi-ui/core';
import { AppealValidatorRolesNumber } from '@gosi-ui/features/appeals/lib/shared/enums/appeal-validator-roles-id';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class TransactionTabConstants {
  public static getTransactionTabs(isAppPrivate: boolean, isAppPublic: boolean): Tab[] {
    return [
      {
        icon: isAppPublic ? 'inbox' : 'tasks',
        label: isAppPublic ? 'ESTABLISHMENT-INBOX' : 'MY-WORK-LIST',

        url: RouterConstants.ROUTE_TODOLIST,
        allowedRoles: [
          RoleIdEnum.SUPER_ADMIN,
          RoleIdEnum.GCC_ADMIN,
          RoleIdEnum.BRANCH_ADMIN,
          RoleIdEnum.REG_ADMIN,
          RoleIdEnum.OH_ADMIN,
          RoleIdEnum.CNT_ADMIN,
          RoleIdEnum.SUBSCRIBER,
          RoleIdEnum.VIC,
          RoleIdEnum.GUEST,
          RoleIdEnum.MISC_VALIDATOR,
          RoleIdEnum.FC_FOR_ACCOUNT_ADJUSTMENT,
          RoleIdEnum.CONTRACTED_DOCTOR,
          RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER
        ]
      },
      {
        icon: 'inbox',
        label: 'MY-WORK-LIST',
        url: RouterConstants.ROUTE_INBOX,
        allowedRoles: [
          RoleIdEnum.INSURANCE_PRTN_EXTN_SPVR,
          RoleIdEnum.REGISTRATION_CONTRIBUTIONS_OPERATIONS_OFFICER,
          RoleIdEnum.BRANCH_MANAGER,
          RoleIdEnum.INS_PROT_EXT_SPVSR,
          RoleIdEnum.GCC_CSR,
          RoleIdEnum.FC,
          RoleIdEnum.OH_FC,
          RoleIdEnum.RELATION_OFFICER,
          RoleIdEnum.OH_OFFICER,
          RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER,
          RoleIdEnum.FEATURE_360_ALL_USER,
          RoleIdEnum.INS_BENF_OFFICER_SPVR,
          RoleIdEnum.ROLE_DOCTOR,
          RoleIdEnum.FC_SUPERVISOR,
          RoleIdEnum.SOCIAL_INS_INSP,
          RoleIdEnum.REG_CONT_OPER_SPVSR,
          RoleIdEnum.CLM_MGR,
          RoleIdEnum.COLLECTION_OFFICER,
          RoleIdEnum.COLLECTIONS_DEPARTMENT_MANAGER,
          RoleIdEnum.CUSTOMER_CARE_OFFICER,
          RoleIdEnum.Legal_reviewer_private,
          RoleIdEnum.CUSTOMER_CARE_SENIOR_OFFICER,
          RoleIdEnum.CUSTOMER_SERVICE_AND_BRANCHES_GENERAL_DIRECTOR,
          RoleIdEnum.CUSTOMER_SERVICE_SUPERVISOR,
          RoleIdEnum.GENERAL_DIRECTOR_FOR_INSPECTION_AND_COLLECTION,
          RoleIdEnum.GDISO,
          RoleIdEnum.GDES,
          RoleIdEnum.INSURANCE_BENEFIT_SECTION_MANAGER,
          RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
          RoleIdEnum.MEDICAL_BOARD_SECRETARY,
          RoleIdEnum.MEDICAL_SERVICES_DEPARTMENT_MANAGER,
          RoleIdEnum.MS_OFFICER,
          RoleIdEnum.SENIOR_OPERATION_ANALYST,
          RoleIdEnum.VIOLATION_COMMITTEE_HEAD,
          RoleIdEnum.VIOLATION_COMMITTEE_MEMBER,
          RoleIdEnum.WORK_INJURIES_OCUPATIONAL_DISEASES_DOCTOR,
          RoleIdEnum.OCCUPATIONAL_HEALTH_SAFETY_ENGINEER,
          RoleIdEnum.WORK_INJURIES_OCCUPATIONAL_DISEASES_SPECIALIST,
          RoleIdEnum.MEDICAL_AUDITOR,
          RoleIdEnum.GD_MS_OS,
          RoleIdEnum.COMPLAINT_MANAGER,
          RoleIdEnum.COMPLAINT_CLERK,
          RoleIdEnum.MEDICA_AUDITOR,
          RoleIdEnum.CUSTOMER_CARE_DEPARTMENT_HEAD,
          RoleIdEnum.MISC_VALIDATOR,
          RoleIdEnum.FC_FOR_ACCOUNT_ADJUSTMENT,
          RoleIdEnum.GOVERNOR,
          RoleIdEnum.ASSISTANT_GOVERNOR,
          RoleIdEnum.COMPLIANCE_MANAGER,
          RoleIdEnum.FINANCIAL_CONTROLLER_ANN_ONE,
          RoleIdEnum.FINANCIAL_CONTROLLER_ANN_TWO,
          RoleIdEnum.INSURANCE_BENEFIT_OPERATIONAL_OFFICER_TWO,
          RoleIdEnum.BENEFIT_SEARCH_READ,
          RoleIdEnum.INSURANCE_BENEFIT_OPERATIONAL_OFFICER_ONE,
          RoleIdEnum.SANED_VALIDATION_COMMITTEE,
          RoleIdEnum.BENEFICIARIES_AND_WORKERS_ABROAD_SECTION_HEAD,
          RoleIdEnum.SAFETY_AND_HEALTH_OFFICER,
          RoleIdEnum.INDIVIDUAL_COLLECTION_SPECIALIST_PUBLIC,
          RoleIdEnum.ESTABLISHMENTS_SPECIALIST_PUBLIC,
          ...this.allAppealValidatorRolesNumber(),
          RoleIdEnum.HEAD_OFFICE_DOCTOR,
          RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER,
          RoleIdEnum.BENEFICIARIES_AND_WORKERS_ABROAD_SECTION_HEAD,
          RoleIdEnum.AOV_REVIEWER,
          RoleIdEnum.AOV_APPROVER_1,
          RoleIdEnum.AOV_APPROVER_2,
          RoleIdEnum.AOV_APPROVER_3,
          RoleIdEnum.AOV_EXECUTER,
        ]
      },
      {
        icon: 'exchange-alt',
        label: isAppPrivate ? 'MY-TRANSACTIONS' : 'TRANSACTIONS',
        url: RouterConstants.ROUTE_TRANSACTION_HISTORY,
        allowedRoles: [
          RoleIdEnum.SUPER_ADMIN,
          RoleIdEnum.GCC_ADMIN,
          RoleIdEnum.BRANCH_ADMIN,
          RoleIdEnum.REG_ADMIN,
          RoleIdEnum.OH_ADMIN,
          RoleIdEnum.CNT_ADMIN,
          RoleIdEnum.INSURANCE_PRTN_EXTN_SPVR,
          RoleIdEnum.REGISTRATION_CONTRIBUTIONS_OPERATIONS_OFFICER,
          RoleIdEnum.BRANCH_MANAGER,
          RoleIdEnum.INS_PROT_EXT_SPVSR,
          RoleIdEnum.GCC_CSR,
          RoleIdEnum.FC,
          RoleIdEnum.OH_FC,
          RoleIdEnum.RELATION_OFFICER,
          RoleIdEnum.OH_OFFICER,
          RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER,
          RoleIdEnum.FEATURE_360_ALL_USER,
          RoleIdEnum.INS_BENF_OFFICER_SPVR,
          RoleIdEnum.ROLE_DOCTOR,
          RoleIdEnum.FC_SUPERVISOR,
          RoleIdEnum.SOCIAL_INS_INSP,
          RoleIdEnum.REG_CONT_OPER_SPVSR,
          RoleIdEnum.CLM_MGR,
          RoleIdEnum.COLLECTION_OFFICER,
          RoleIdEnum.COLLECTIONS_DEPARTMENT_MANAGER,
          RoleIdEnum.CUSTOMER_CARE_OFFICER,
          RoleIdEnum.Legal_reviewer_private,
          RoleIdEnum.CUSTOMER_CARE_SENIOR_OFFICER,
          RoleIdEnum.CUSTOMER_SERVICE_AND_BRANCHES_GENERAL_DIRECTOR,
          RoleIdEnum.CUSTOMER_SERVICE_SUPERVISOR,
          RoleIdEnum.GENERAL_DIRECTOR_FOR_INSPECTION_AND_COLLECTION,
          RoleIdEnum.GDISO,
          RoleIdEnum.GDES,
          RoleIdEnum.INSURANCE_BENEFIT_SECTION_MANAGER,
          RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
          RoleIdEnum.MEDICAL_BOARD_SECRETARY,
          RoleIdEnum.MEDICAL_SERVICES_DEPARTMENT_MANAGER,
          RoleIdEnum.MS_OFFICER,
          RoleIdEnum.SENIOR_OPERATION_ANALYST,
          RoleIdEnum.VIOLATION_COMMITTEE_HEAD,
          RoleIdEnum.VIOLATION_COMMITTEE_MEMBER,
          RoleIdEnum.WORK_INJURIES_OCUPATIONAL_DISEASES_DOCTOR,
          RoleIdEnum.OCCUPATIONAL_HEALTH_SAFETY_ENGINEER,
          RoleIdEnum.WORK_INJURIES_OCCUPATIONAL_DISEASES_SPECIALIST,
          RoleIdEnum.MEDICAL_AUDITOR,
          RoleIdEnum.GD_MS_OS,
          RoleIdEnum.COMPLAINT_MANAGER,
          RoleIdEnum.COMPLAINT_CLERK,
          RoleIdEnum.MEDICA_AUDITOR,
          RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE,
          RoleIdEnum.CALL_CENTRE_AGENT,
          RoleIdEnum.CUSTOMER_CARE_DEPARTMENT_HEAD,
          RoleIdEnum.MC_OFFICER,
          RoleIdEnum.SUBSCRIBER,
          RoleIdEnum.VIC,
          RoleIdEnum.GUEST,
          RoleIdEnum.MISC_VALIDATOR,
          RoleIdEnum.GOVERNOR,
          RoleIdEnum.ASSISTANT_GOVERNOR,
          RoleIdEnum.FINANCIAL_CONTROLLER_ANN_ONE,
          RoleIdEnum.FINANCIAL_CONTROLLER_ANN_TWO,
          RoleIdEnum.INSURANCE_BENEFIT_OPERATIONAL_OFFICER_TWO,
          RoleIdEnum.BENEFIT_SEARCH_READ,
          RoleIdEnum.INSURANCE_BENEFIT_OPERATIONAL_OFFICER_ONE,
          RoleIdEnum.SANED_VALIDATION_COMMITTEE,
          RoleIdEnum.BENEFICIARIES_AND_WORKERS_ABROAD_SECTION_HEAD,
          RoleIdEnum.INDIVIDUAL_COLLECTION_SPECIALIST_PUBLIC,
          RoleIdEnum.SAFETY_AND_HEALTH_OFFICER,
          RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER,
          RoleIdEnum.BENEFICIARIES_AND_WORKERS_ABROAD_SECTION_HEAD,
          RoleIdEnum.AOV_REVIEWER,
          RoleIdEnum.AOV_APPROVER_1,
          RoleIdEnum.AOV_APPROVER_2,
          RoleIdEnum.AOV_APPROVER_3,
          RoleIdEnum.AOV_EXECUTER
        ]
      },
      {
        icon: 'bell',
        label: 'NOTIFICATIONS',
        url: RouterConstants.ROUTE_NOTIFICATIONS,
        allowedRoles: [
          RoleIdEnum.SUPER_ADMIN,
          RoleIdEnum.GCC_ADMIN,
          RoleIdEnum.BRANCH_ADMIN,
          RoleIdEnum.REG_ADMIN,
          RoleIdEnum.OH_ADMIN,
          RoleIdEnum.CNT_ADMIN,
          RoleIdEnum.SUBSCRIBER,
          RoleIdEnum.VIC
        ]
      }
    ];
  }

  public static allAppealValidatorRolesNumber() {
    return Object.values(AppealValidatorRolesNumber) as unknown as RoleIdEnum[];
  }
}
