/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  ApplicationTypeEnum,
  BilingualText,
  Establishment,
  GCCBankDomain,
  GccCountryEnum,
  RoleIdEnum,
  RouterConstants,
  Tab
} from '@gosi-ui/core';
import { AdminRoleEnum, LegalEntityEnum } from '../enums';

export class EstablishmentConstants {
  /**
   * Gcc Countries array
   */
  public static get GCC_NATIONAL(): string[] {
    return [
      GccCountryEnum.KUWAIT,
      GccCountryEnum.UAE,
      GccCountryEnum.QATAR,
      GccCountryEnum.BAHRAIN,
      GccCountryEnum.OMAN
    ];
  }

  public static get LICENSE_MAX_LENGTH(): number {
    return 15;
  }

  public static get GCC_REG_NO_MAX_LENGTH(): number {
    return 50;
  }

  public static get EST_NAME_ARABIC_MAX_LENGTH(): number {
    return 120;
  }

  public static get EST_NAME_ENGLISH_MAX_LENGTH(): number {
    return 60;
  }

  public static get PERSON_NAME_ARABIC_MAX_LENGTH(): number {
    return 60;
  }

  public static get PERSON_NAME_ENGLISH_MAX_LENGTH(): number {
    return 60;
  }

  public static get PERSON_NAME_MIN_LENGTH(): number {
    return 2;
  }

  public static get CRN_MAX_LENGTH(): number {
    return 10;
  }

  public static get RECRUITMENT_MAX_LENGTH(): number {
    return 10;
  }

  public static get MAIN_EST_REG_NUMBER(): number {
    return 9;
  }
  public static get ISD_PREFIX_MAPPING() {
    return {
      sa: '+966',
      kw: '+965',
      bh: '+973',
      om: '+968',
      qa: '+974',
      ae: '+971'
    };
  }
  public static get EST_DOC_DESCRIPTION_MAX_LENGTH(): number {
    return 100;
  }

  /*ADD- ESTABLISHMENT CONSTANTS*/

  //Number Of Tabs
  public static get TABS_NO_WITH_ADMIN(): number {
    return 5;
  }
  public static get TABS_NO_WITHOUT_ADMIN(): number {
    return 4;
  }

  public static get TABS_WITHOUT_OWNER_PAYMENT(): number {
    return 4;
  }
  public static get TABS_WITH_OWNER_GCC(): number {
    return 6;
  }
  public static get TABS_WITH_PAYMENT_GCC(): number {
    return 5;
  }

  //Establishment Roles
  public static get EST_ADMIN(): string {
    return 'EstablishmentAdmin';
  }

  //Changes corresponding toe GCC Country
  public static get DEFAULT_GCCID_LENGTH(): number {
    return 15;
  }
  //Changes corresponding toe GCC Country
  public static get DEFAULT_MIN_GCCID_LENGTH(): number {
    return 15;
  }

  public static get GCC_REG_MAX_LENGTH(): number {
    return 50;
  }
  public static get SAFETY_EVALUATION_REASON_LENGTH(): number {
    return 1200;
  }
  public static get LEGAL_ENTITY_PROACTIVE(): string[] {
    return [LegalEntityEnum.GOVERNMENT, LegalEntityEnum.SEMI_GOV, LegalEntityEnum.SOCIETY, LegalEntityEnum.PARTNERSHIP];
  }
  public static get LEGAL_ENTITY_WITHOUT_OWNER(): string[] {
    return [
      LegalEntityEnum.GOVERNMENT,
      LegalEntityEnum.SEMI_GOV,
      LegalEntityEnum.SOCIETY,
      LegalEntityEnum.ORG_REGIONAL
    ];
  }

  public static get LEGAL_ENTITY_PARTNERSHIP(): string[] {
    return [
      LegalEntityEnum.LIMITED_LIABILITY,
      LegalEntityEnum.LIMITED_PARTNERSHIP,
      LegalEntityEnum.PARTNERSHIP,
      LegalEntityEnum.SHARE_STOCK_COMPANY,
      LegalEntityEnum.VOCATIONAL_ESTABLISHMENT
    ];
  }
  //Licence Issuing Authority
  public static get LICENCE_ISSUING_AUTH_ROYAL_DECREE(): string {
    return 'Royal Decree';
  }

  //Rejection Reason
  public static get REJECTION_REASON_OTHERS(): string {
    return 'Others';
  }

  //Payment Types
  //MOF
  public static get EST_PAYMENT_MOF(): string {
    return 'MOF';
  }
  //SELF
  public static get EST_PAYMENT_SELF(): string {
    return 'Self';
  }

  public static get EST_OWNER_ROLE(): string {
    return 'Owner';
  }

  public static get TERMINATE_TRANSFER_REASON_CODE(): number {
    return 1022;
  }

  /*Different Sections in Establishment*/
  /** Establishment Details */
  public static get SEC_EST_DETAILS(): string {
    return 'ESTABLISHMENT.SEC-EST-DETAILS';
  }

  /** Payment Details */
  public static get SEC_PAYMENT_DETAILS(): string {
    return 'ESTABLISHMENT.SEC-PAYMENT-DETAILS';
  }

  /** Payment Details */
  public static get SEC_OWNER_DETAILS(): string {
    return 'ESTABLISHMENT.SEC-OWNER-DETAILS';
  }

  /** Admin Details */
  public static get SEC_EST_ADMIN_DETAILS(): string {
    return 'ESTABLISHMENT.SEC-EST-ADMIN-DETAILS';
  }
  /** Reopen Details */
  public static get SEC_EST_REOPEN_DETAILS(): string {
    return 'ESTABLISHMENT.REOPEN-ESTABLISHMENT';
  }
  public static get SEC_PERSON_DETAILS(): string {
    return 'ESTABLISHMENT.AUTHORIZED-PERSON-DETAILS';
  }

  /** Document Details */
  public static get SEC_DOCUMENT_DETAILS(): string {
    return 'ESTABLISHMENT.SEC-DOCUMENTS';
  }

  public static EST_PROFILE_ROUTE(regNo: number): string {
    return `/home/establishment/profile/${regNo}/view`;
  }

  public static EST_PROFILE_DOC_ROUTE(regNo: number): string {
    return `/home/establishment/profile/${regNo}/view/documents`;
  }

  public static EST_PROFILE_UPLOAD_DOC_ROUTE(regNo: number): string {
    return `/home/establishment/profile/${regNo}/view/documents/upload`;
  }
  public static EST_PROFILE_ADMIN_ROUTE(regNo: number, adminId: number): string {
    return `/home/establishment/profile/${regNo}/user/${adminId}`;
  }

  public static GROUP_PROFILE_ROUTE(regNo: number): string {
    return `/home/establishment/profile/group/${regNo}`;
  }

  public static GROUP_ADMIN_PROFILE_ROUTE(adminId: number): string {
    return `/home/establishment/profile/group/user/${adminId}`;
  }
  public static GROUP_ADMINS_ADMIN_ID_ROUTE(regNo: number, adminId: number): string {
    return `/home/establishment/admin/group/${regNo}/user/${adminId}`;
  }
  public static REGISTER_PROACTIVE_ROUTE(regNo: number): string {
    return `/home/establishment/register/proactive/${regNo}/missing-details`;
  }

  public static PROACTIVE_ADMIN_REENTER_ROUTE(): string {
    return `/home/establishment/register/proactive/edit/missing-details`;
  }

  public static EST_ADMINS_ADMIN_ID_ROUTE(regNo: number, adminId: number): string {
    return `/home/establishment/admin/branch/${regNo}/user/${adminId}`;
  }

  public static REPLACE_SUPER_ADMIN_ROUTE(registrationNo: number): string {
    return `/home/establishment/admin/${registrationNo}/replace-admin`;
  }
  public static VALIDATE_REPLACE_SUPER_ADMIN_ROUTE(registrationNo: number): string {
    return `/home/establishment/admin/${registrationNo}/validate-replace-admin`;
  }

  public static REPLACE_EST_ADMIN_ROUTE(adminId: number, registrationNo: number): string {
    return `/home/establishment/admin/${adminId}/${registrationNo}/replace`;
  }

  public static ADD_ADMIN_ROUTE(registrationNo: number, adminId: number) {
    return `/home/establishment/admin/${registrationNo}/${adminId}/add`;
  }

  public static MODIFY_ADMIN_ROUTE(registrationNo: number, adminId: number) {
    return `/home/establishment/admin/${registrationNo}/${adminId}/modify`;
  }

  public static ASSIGN_ADMIN_ROUTE(registrationNo: number, adminId: number) {
    return `/home/establishment/admin/${registrationNo}/${adminId}/assign-branches`;
  }

  public static ROUTE_REGISTER_SUPER_ADMIN(registrationNo: number) {
    return `/home/establishment/admin/${registrationNo}/register`;
  }
  public static ROUTE_VALIDATE_REGISTER_SUPER_ADMIN(registrationNo: number) {
    return `/home/establishment/admin/${registrationNo}/validate/register`;
  }
  public static ROUTE_MISSING_ADMIN_DETAILS(registrationNo: number, adminId: number) {
    return `/home/establishment/admin/${registrationNo}/missing-details/${adminId}`;
  }

  public static VIEW_FLAGS(registrationNo: number) {
    return `/home/establishment/flags/${registrationNo}/view`;
  }
  public static ADD_FLAG_ROUTE() {
    return `/home/establishment/flags/add-flag`;
  }
  public static MODIFY_FLAG_ROUTE(registrationNo, flagId) {
    return `/home/establishment/flags/${registrationNo}/${flagId}`;
  }
  public static VIEW_CERITICATES_ROUTE(registrationNo: number) {
    return `/home/establishment/certificates/${registrationNo}/view`;
  }
  public static ZAKAT_CERTIFICATE_ROUTE(registrationNo: number) {
    return `/home/establishment/certificates/${registrationNo}/zakat-certificate`;
  }
  public static ZAKAT_CERTIFICATE_MAIN_ROUTE(registrationNo: number) {
    return `/home/establishment/certificates/${registrationNo}/main/zakat-certificate`;
  }
  public static ZAKAT_CERTIFICATE_GROUP_ROUTE(registrationNo: number) {
    return `/home/establishment/certificates/${registrationNo}/group/zakat-certificate`;
  }
  public static GOSI_CERTIFICATE_ROUTE(registrationNo: number) {
    return `/home/establishment/certificates/${registrationNo}/gosi-certificate`;
  }
  public static CERTIFICATE_ELIGIBILITY_ROUTE(registrationNo: number) {
    return `/home/establishment/certificates/${registrationNo}/not-eligible`;
  }
  public static OH_CERTIFICATE_ROUTE(registrationNo: number) {
    return `/home/establishment/certificates/${registrationNo}/oh-certificate`;
  }
  public static getAdminRoles(): string[] {
    return Object.values(AdminRoleEnum);
  }

  public static COLLECTION_DASHBOARD_ROUTE(regNo: number): string {
    return `/home/billing/establishment/${regNo}/dashboard`;
  }
  public static FLAG_TRACK_ROUTE(transactionId: number) {
    return `/home/transactions/view/300322/${transactionId}/establishment/transactions/add-flag`;
  }
  public static REQUEST_REINSPECTION_ROUTE(): string {
    return `/home/establishment/oh-safety/request-reinspection`;
  }
  public static INITIATE_SAFETY_CHECK_ROUTE(): string {
    return `/home/establishment/oh-safety/initiate-safety-check`;
  }
  public static RELATIONSHIP_MANAGER(registrationNo: number): string {
    return `/home/establishment/relationship-manager/${registrationNo}/add`;
  }
  public static RELATIONSHIP_MANAGER_MODIFY(registrationNo: number): string {
    return `/home/establishment/relationship-manager/${registrationNo}/modify`;
  }
  public static ROUTE_TO_INBOX(appType: String): string {
    if (appType === ApplicationTypeEnum.PRIVATE) {
      return RouterConstants.ROUTE_INBOX;
    } else {
      return RouterConstants.ROUTE_TODOLIST;
    }
  }

  public static get UNIFIED_NATIONAL_NO_LENGTH() {
    return 10;
  }

  /**
   * method to get the eligible roles to perfoem the delink transaction
   */
  public static get CREATE_DELINK_ACCESS_ROLES(): RoleIdEnum[] {
    return [RoleIdEnum.CSR, RoleIdEnum.SUPER_ADMIN];
  }

  /**
   * method to get the eligible roles to perfoem the CBM transaction
   */
  public static get CREATE_CBM_ACCESS_ROLES(): RoleIdEnum[] {
    return [RoleIdEnum.CSR, RoleIdEnum.SUPER_ADMIN];
  }
  /**
   * method to get the profile tab details
   */
  public static getProfileTabs(regNo: number, identifier: number, isAppPrivate: boolean): Tab[] {
    return [
      {
        icon: 'building',
        label: 'ESTABLISHMENT-DETAILS',
        url: isAppPrivate ? this.EST_PROFILE_ROUTE(regNo) : this.EST_PROFILE_ADMIN_ROUTE(regNo, identifier)
      },
      {
        icon: 'file-invoice',
        label: 'BILL-ACCOUNT-DETAILS',
        url: isAppPrivate
          ? RouterConstants.ROUTE_PROFILE_PRIVATE_BILL_DASHBOARD(regNo)
          : RouterConstants.ROUTE_PROFILE_BILL_DASHBOARD(regNo, identifier),
        allowedRoles: [...this.CREATE_BILL_DASHBOARD_ACCESS_ROLES]
      },
      {
        icon: 'users',
        label: 'ENGAGEMENTS',
        url: isAppPrivate
          ? RouterConstants.ROUTE_PROFILE_PRIVATE_CONTRIBUTOR_LIST(regNo)
          : RouterConstants.ROUTE_PROFILE_CONTRIBUTOR_LIST(regNo, identifier),
        allowedRoles: [...this.CREATE_CONTRIBUTOR_LIST_ACCESS_ROLES]
      },
      {
        icon: 'file-alt',
        label: 'EST-DOCUMENTS',
        url: isAppPrivate ? this.EST_PROFILE_DOC_ROUTE(regNo) : this.EST_PROFILE_DOC_ROUTE(regNo),
        allowedRoles: [...this.ESTABLISHMENT_DOCUMENT_ACCESS_ROLES]
      }
    ];
  }
  /**
   * method to get the eligible roles to access engagements
   */
  public static get CREATE_CONTRIBUTOR_LIST_ACCESS_ROLES(): RoleIdEnum[] {
    return [
      RoleIdEnum.SUPER_ADMIN,
      RoleIdEnum.GCC_ADMIN,
      RoleIdEnum.OH_ADMIN,
      RoleIdEnum.BRANCH_ADMIN,
      RoleIdEnum.REG_ADMIN,
      RoleIdEnum.OH_ADMIN,
      RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE,
      RoleIdEnum.GCC_CSR,
      RoleIdEnum.OH_OFFICER,
      RoleIdEnum.OH_FC,
      RoleIdEnum.REGISTRATION_CONTRIBUTIONS_OPERATIONS_OFFICER,
      RoleIdEnum.FEATURE_360_ALL_USER,
      RoleIdEnum.DOCTOR,
      RoleIdEnum.MEDICA_AUDITOR,
      RoleIdEnum.MEDICAL_BOARD_SECRETARY,
      RoleIdEnum.MC_OFFICER,
      RoleIdEnum.MEDICAL_AUDITOR,
      RoleIdEnum.CALL_CENTRE_AGENT,
      RoleIdEnum.CUSTOMER_CARE_OFFICER,
      RoleIdEnum.CUSTOMER_CARE_SENIOR_OFFICER,
      RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
      RoleIdEnum.INSURANCE_BENEFIT_SECTION_MANAGER,
      RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER,
      RoleIdEnum.WORK_INJURIES_OCCUPATIONAL_DISEASES_SPECIALIST,
      RoleIdEnum.SAFETY_AND_HEALTH_OFFICER
    ];
  }
  /**
   * method to get the eligible roles to access bill details
   */
  public static get CREATE_BILL_DASHBOARD_ACCESS_ROLES(): RoleIdEnum[] {
    return [RoleIdEnum.SUPER_ADMIN, RoleIdEnum.GCC_ADMIN];
  }
  /**
   * method to get the eligible FO roles to generate establishment certificates
   */
  public static get GENERATE_CERTIFICATE_ACCESS_ROLES(): RoleIdEnum[] {
    return [RoleIdEnum.BRANCH_MANAGER];
  }
  public static GCC_BANK(establishment: Establishment): string {
    return GCCBankDomain[establishment.gccEstablishment?.country?.english?.replace(/\s/g, '_').toUpperCase()];
  }

  public static get CERITIFICATE_INELIGIBILTY_ROLES(): RoleIdEnum[] {
    return [
      RoleIdEnum.COLLECTIONS_DEPARTMENT_MANAGER,
      RoleIdEnum.CSR,
      RoleIdEnum.GCC_CSR,
      RoleIdEnum.CUSTOMER_CARE_DEPARTMENT_HEAD,
      RoleIdEnum.REGISTRATION_CONTRIBUTIONS_OPERATIONS_OFFICER,
      RoleIdEnum.CUSTOMER_SERVICE_AND_BRANCHES_GENERAL_DIRECTOR,
      RoleIdEnum.OH_OFFICER,
      RoleIdEnum.GENERAL_DIRECTOR_FOR_INSPECTION_AND_COLLECTION,
      RoleIdEnum.GDISO,
      RoleIdEnum.MEDICAL_AUDITOR,
      RoleIdEnum.FC,
      RoleIdEnum.CLM_MGR,
      RoleIdEnum.MC_OFFICER,
      RoleIdEnum.ROLE_DOCTOR,
      RoleIdEnum.CUSTOMER_CARE_OFFICER,
      RoleIdEnum.CUSTOMER_CARE_SENIOR_OFFICER,
      RoleIdEnum.INSURANCE_OPERATIONS_MANAGER,
      RoleIdEnum.GDISO,
      RoleIdEnum.GD_MS_OS,
      RoleIdEnum.COLLECTION_OFFICER,
      RoleIdEnum.CUSTOMER_SERVICE_SUPERVISOR,
      RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER,
      RoleIdEnum.INSURANCE_BENEFIT_SECTION_MANAGER,
      RoleIdEnum.MEDICAL_BOARD_SECRETARY,
      RoleIdEnum.MEDICAL_SERVICES_DEPARTMENT_MANAGER,
      RoleIdEnum.BOARD_OFFICER,
      RoleIdEnum.VIOLATION_COMMITTEE_HEAD,
      RoleIdEnum.VIOLATION_COMMITTEE_MEMBER,
      RoleIdEnum.WORK_INJURIES_OCCUPATIONAL_DISEASES_SPECIALIST,
      RoleIdEnum.WORK_INJURIES_OCUPATIONAL_DISEASES_DOCTOR,
      RoleIdEnum.SENIOR_OPERATION_ANALYST,
      RoleIdEnum.COMPLAINT_MANAGER,
      RoleIdEnum.COMPLAINT_CLERK,
      RoleIdEnum.CALL_CENTRE_AGENT,
      RoleIdEnum.SOCIAL_INS_INSP,
      RoleIdEnum.RELATION_OFFICER,
      RoleIdEnum.BRANCH_ADMIN,
      RoleIdEnum.SUPER_ADMIN,
      RoleIdEnum.GCC_ADMIN
    ];
  }
  /**
   * method to get the eligible roles to access documents
   */
  public static get ESTABLISHMENT_DOCUMENT_ACCESS_ROLES(): RoleIdEnum[] {
    return [
      RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE,
      RoleIdEnum.INSURANCE_PRTN_EXTN_SPVR,
      RoleIdEnum.REGISTRATION_CONTRIBUTIONS_OPERATIONS_OFFICER,
      RoleIdEnum.BRANCH_MANAGER,
      RoleIdEnum.INS_PROT_EXT_SPVSR,
      RoleIdEnum.GCC_CSR,
      RoleIdEnum.FC,
      RoleIdEnum.RELATION_OFFICER,
      RoleIdEnum.CALL_CENTRE_AGENT,
      RoleIdEnum.OH_FC,
      RoleIdEnum.OH_OFFICER,
      RoleIdEnum.INS_BENF_OFFICER_SPVR,
      RoleIdEnum.ROLE_DOCTOR,
      RoleIdEnum.FC_SUPERVISOR,
      RoleIdEnum.SOCIAL_INS_INSP,
      RoleIdEnum.REG_CONT_OPER_SPVSR,
      RoleIdEnum.CLM_MGR,
      RoleIdEnum.COLLECTION_OFFICER,
      RoleIdEnum.COLLECTIONS_DEPARTMENT_MANAGER,
      RoleIdEnum.CUSTOMER_CARE_DEPARTMENT_MANAGER,
      RoleIdEnum.CUSTOMER_CARE_DEPARTMENT_HEAD,
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
      RoleIdEnum.MEDICAL_AUDITOR,
      RoleIdEnum.GD_MS_OS,
      RoleIdEnum.COMPLAINT_MANAGER,
      RoleIdEnum.COMPLAINT_CLERK,
      RoleIdEnum.AMEEN_USER,
      RoleIdEnum.AMEEN_INTERNAL_SUPERVISOR,
      RoleIdEnum.MEDICA_AUDITOR,
      RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER,
      RoleIdEnum.FEATURE_360_ALL_USER,
      RoleIdEnum.SEND_SMS,
      RoleIdEnum.SAFETY_AND_HEALTH_OFFICER
    ];
  }

  /**
   * method to get the eligible roles to access documents
   */
  public static get ESTABLISHMENT_UPLOAD_DOCUMENT_ACCESS_ROLES(): RoleIdEnum[] {
    return [
      RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE,
      RoleIdEnum.GCC_CSR,
      RoleIdEnum.FC,
      RoleIdEnum.RELATION_OFFICER,
      RoleIdEnum.OH_OFFICER,
      RoleIdEnum.SOCIAL_INS_INSP,
      RoleIdEnum.COLLECTION_OFFICER,
      RoleIdEnum.CUSTOMER_CARE_OFFICER
    ];
  }
  /**
   * method to get the intermediate info message while generating report
   */
  public static get ZAKAT_FOR_GROUP_CERT_GENERATION_INFO_MSG(): BilingualText {
    return {
      arabic: 'يتم الان اصدار الشهادة، لحظات من فضلك ',
      english: 'Please wait while your certificate is generated'
    };
  }
  public static get ESTABLISHMENT_RELATIONSHIP_SUPERVISOR_ROLES(): RoleIdEnum[] {
    return [RoleIdEnum.RELATIONSHIP_SUPERVISOR];
  }
  /**
   * Constant for getting manage owner URL
   */
  public static get ADD_OWNER_AR(): string {
    return 'href="#/home/establishment/change/owners"';
  }

  /**
   * Constant for getting add admin gpt English URL
   */
  public static get ADD_OWNER_EN(): string {
    return 'href="#/home/establishment/change/owners"';
  }
  // public static get ADD_ADMIN_EN(): string{
  //   return 'href="#/gositest.gosi.ins/GOSIOnline/Establishment_Admin_Access?locale=en_US"'
  // }
  // public static get ADD_ADMIN_AR(): string{
  //   return 'href="#/gositest.gosi.ins/GOSIOnline/Establishment_Admin_Access?locale=en_US"'
  // }

  public static get REOPEN_REASON_MAX_LENGTH(): number {
    return 60;
  }
  public static get COMPLIANCE_DETAILS_SUCCESS():string {
    return 'Success';
  }

  public static get HEALTH_INSURANCE_DETAILS_ROUTE():string {
    return `home/contributor/health-insurance`;
  }
}
