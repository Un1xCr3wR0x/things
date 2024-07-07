/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export enum DocumentTransactionType {
  REGISTER_CONTRIBUTOR_IN_GOVT = 'GOVT',
  REGISTER_CONTRIBUTOR_IN_NON_GOVT = 'NON_GOVT',
  REGISTER_CONTRIBUTOR_IN_NON_SAUDI = 'NON_SAUDI',
  REGISTER_CONTRIBUTOR_IN_SPECIAL_FOREIGNER = 'REGISTER_SPECIAL_FOREIGNER',
  REGISTER_DECEASED_CONTRIBUTOR_IN_GOVT = 'GOVT_DECEASED_CONTRIBUTOR',
  REGISTER_DECEASED_GOVT_CONTRIBUTOR_IN_NON_GOVT = 'NON_GOVT_DECEASED_GOVT_CONTRIBUTOR',
  REGISTER_DECEASED_CONTRIBUTOR_IN_NON_GOVT = 'NON_GOVT_DECEASED_CONTRIBUTOR',
  REGISTER_GOVT_CONTRIBUTOR_IN_NON_GOVT_EST = 'NON_GOVT_EST_WITH_GOVT_CONTRIBUTOR',
  REGISTER_CONTRIBUTOR_OMAN = 'GCC_OMAN',
  REGISTER_CONTRIBUTOR_KUWAIT = 'GCC_KUWAIT',
  REGISTER_CONTRIBUTOR_QATAR = 'GCC_QATAR',
  REGISTER_CONTRIBUTOR_BAHRAIN = 'GCC_BAHRAIN',
  REGISTER_CONTRIBUTOR_UAE = 'GCC_UAE',
  REGISTER_CONTRIBUTOR_IN_GCC = 'REGISTER_CONTRIBUTOR_IN_GCC_EST',
  CHANGE_ENGAGEMENT = 'CHANGE_ENGAGEMENT',
  CHANGE_ENGAGEMENT_IN_GCC = 'CHANGE_ENGAGEMENT_IN_GCC_EST',
  MANAGE_WAGE = 'MANAGE_WAGE',
  REGISTER_SECONDMENT = 'REGISTER_SECONDMENT',
  REGISTER_STUDY_LEAVE = 'REGISTER_STUDY_LEAVE',
  TERMINATE_SECONDMENT = 'TERMINATE_SECONDMENT',
  TERMINATE_STUDY_LEAVE = 'TERMINATE_STUDY_LEAVE',
  TERMINATE_CONTRIBUTOR = 'TERMINATE_ENGAGEMENT',
  TERMINATE_CONTRIBUTOR_IN_GCC = 'TERMINATE_ENGAGEMENT_IN_GCC_EST',
  CANCEL_CONTRIBUTOR = 'CANCEL_ENGAGEMENT',
  CANCEL_CONTRIBUTOR_IN_GCC = 'CANCEL_ENGAGEMENT_IN_GCC_EST',
  CANCEL_CONTRIBUTOR_PPA = 'CANCEL_ENGAGEMENT_PPA',
  CANCEL_PPA_WRONG_REG = 'CANCEL_ENGAGEMENT_PPA_WRONG_REG',
  ADD_SECONDED_FO = 'REGISTER_SECONDED_FO',
  ADD_SECONDED_GOL = 'REGISTER_SECONDED_GOL',
  TRANSFER_ENGAGEMENT = 'TRANSFER_ENGAGEMENT',
  TRANSFER_ALL_ENGAGEMENT = 'TRANSFER_ALL_ENGAGEMENT',
  REGISTER_VIC_CONTRIBUTOR_FO = 'REGISTER_VIC_CONTRIBUTOR_FO',
  REGISTER_GOV_VIC_CONTRIBUTOR_NOT_IN_PPA = 'REGISTER_GOV_VIC_CONTRIBUTOR_NOT_IN_PPA',
  REGISTER_VIC_CONTRIBUTOR_FREELANCER_OR_PROFESSIONAL = 'REGISTER_VIC_CONTRIBUTOR_FREELANCER_OR_PROFESSIONAL',
  REGISTER_VIC_CONTRIBUTOR_FREELANCER = 'REGISTER_VIC_CONTRIBUTOR_FREELANCER',
  REGISTER_VIC_CONTRIBUTOR_GOL = 'REGISTER_VIC_CONTRIBUTOR_GOL',
  REGISTER_VIC_CONTRIBUTOR_IN_MILITORY_OR_POLITICAL_MISSIONS = 'REGISTER_VIC_CONTRIBUTOR_IN_MILITORY_OR_POLITICAL_MISSIONS',
  REGISTER_VIC_CONTRIBUTOR_IN_OUTSIDE_SAUDI = 'REGISTER_VIC_CONTRIBUTOR_IN_OUTSIDE_SAUDI',
  REGISTER_VIC_DOCTOR_MODIFY = 'DOCTOR_MODIFY_VIC_HEALTH_RECORDS',
  MANAGE_VIC_WAGE = 'MANAGE_VIC_WAGE',
  TERMINATE_VIC = 'TERMINATE_VIC',
  BANK_UPDATE = 'BANK_UPDATE',
  CANCEL_VIC = 'CANCEL_VIC',
  ADD_CONTRACT = 'REGISTER_CONTRACT',
  CANCEL_CONTRACT = 'CANCEL_CONTRACT',
  CANCEL_ENGAGEMENT_VIOLATION = 'REGISTER_CANCEL_ENGAGEMENT_VIOLATION',
  CHANGE_ENGAGEMENT_VIOLATION_JOINING_DATE = 'REGISTER_CHANGE_ENGAGEMENT_VIOLATION_JOINING_DATE',
  CHANGE_ENGAGEMENT_VIOLATION_LEAVING_DATE = 'REGISTER_CHANGE_ENGAGEMENT_VIOLATION_LEAVING_DATE',
  TERMINATE_ENGAGEMENT_VIOLATION = 'REGISTER_TERMINATE_ENGAGEMENT_VIOLATION',
  CONTRACT_DOCUMENT = 'CONTRACT_AUTHENTICATION_DOCUMENT',
  ADD_AUTHORIZATION = 'ADD_AUTHORIZATION_FO',
  PREMIUM_RESIDENTS = 'REGISTER_PREMIUM_RESIDENT',
  CHANGE_ENGAGEMENT_VIOLATION_UPDATE_WAGE = 'REGISTER_CHANGE_ENGAGEMENT_VIOLATION_WAGE_AND_OCCUPATION',
  MODIFY_COVERAGE = 'MODIFY_COVERAGE',
  MODIFY_PERSONAL_DETAILS = 'MODIFY_PERSONAL_DETAILS',
  MODIFY_PERSONAL_DETAILS_NON_SAUDI = 'MODIFY_PERSONAL_DETAILS_NON_SAUDI',
  MODIFY_PERSONAL_DETAILS_SAUDI = 'MODIFY_PERSONAL_DETAILS_SAUDI',
  ADD_FAMILY_DETAILS = 'ADD_FAMILY_DETAILS',
  MODIFY_FAMILY_DETAILS = 'MODIFY_FAMILY_DETAILS',
  UPDATE_BORDER_NUMBER = 'UPDATE_BORDER_NUMBER',
  UPDATE_IQAMA_NUMBER = 'UPDATE_IQAMA_NUMBER',
  UPLOAD_DOCUMENTS = 'UPLOAD_DOCUMENTS',
  ADD_ENGAGEMENT_E_INSPECTION = 'ADD_ENGAGEMENT_E_INSPECTION',
  REACTIVATE_ENGAGEMENT = 'REACTIVATE_ENGAGEMENT',
  REACTIVATE_VIC_ENGAGEMENT = 'REACTIVATE_VIC_ENGAGEMENT',
  MODIFY_PASSPORT_DETAILS_NON_SAUDI = 'MODIFY_PERSONAL_DETAILS_PASSPORT_NON_SAUDI',
  MODIFY_PASSPORT_DETAILS_SAUDI = 'MODIFY_PERSONAL_DETAILS_PASSPORT_SAUDI',
  MODIFY_PERSONAL_DETAILS_DATE_OF_BIRTH_NON_SAUDI = 'MODIFY_PERSONAL_DETAILS_DATE_OF_BIRTH_NON_SAUDI',
  MODIFY_PERSONAL_DETAILS_BORDER_NO = 'MODIFY_PERSONAL_DETAILS_BORDER_NO',
  MODIFY_PERSONAL_DETAILS_NAME_NON_SAUDI = 'MODIFY_PERSONAL_DETAILS_NAME_NON_SAUDI',
  CANCEL_ENGAGEMENT_INDIVIDUAL = 'CANCEL_ENGAGEMENT_INDIVIDUAL',
  CANCEL_ENGAGEMENT_INDIVIDUAL_ADMIN = 'CANCEL_ENGAGEMENT_INDIVIDUAL_ADMIN_WITHOUT_DOCUMENT',
  CANCEL_INDIVIDUAL_ADMIN_WITH_DOCS = 'CANCEL_ENGAGEMENT_INDIVIDUAL_ADMIN_WITH_DOCUMENT',
  CHANGE_ENGAGEMENT_WAGE_INDIVIDUAL = 'CHANGE_ENGAGEMENT_WAGE_INDIVIDUAL',
  CHANGE_ENGAGEMENT_JOINING_DATE_INDIVIDUAL = 'CHANGE_ENGAGEMENT_JOINING_DATE_INDIVIDUAL',
  CHANGE_ENGAGEMENT_LEAVING_DATE_INDIVIDUAL = 'CHANGE_ENGAGEMENT_LEAVING_DATE_INDIVIDUAL',
  CHANGE_ENGAGEMENT_WAGE_INDIVIDUAL_ADMIN = 'CHANGE_ENGAGEMENT_WAGE_INDIVIDUAL_ADMIN',
  CHANGE_ENGAGEMENT_JOINING_DATE_INDIVIDUAL_ADMIN = 'CHANGE_ENGAGEMENT_JOINING_DATE_INDIVIDUAL_ADMIN',
  CHANGE_ENGAGEMENT_LEAVING_DATE_INDIVIDUAL_ADMIN = 'CHANGE_ENGAGEMENT_LEAVING_DATE_INDIVIDUAL_ADMIN',
  TERMINATE_ENGAGEMENT_INDIVIDUAL = 'TERMINATE_ENGAGEMENT_INDIVIDUAL',
  TERMINATE_ENGAGEMENT_INDIVIDUAL_ADMIN = 'TERMINATE_ENGAGEMENT_INDIVIDUAL_ADMIN',
  ADD_NIN = 'ADD_NIN',
  EDIT_NIN = 'EDIT_NIN',
  ENTER_RPA_AGGREGATION = 'ENTER_RPA_FIRST_SCHEME',
  ENTER_RPA_AGGREGATION_PPA = 'ENTER_RPA_LAST_SCHEME',
  ADD_ENGAGEMENT_E_INSPECTION_PPA = 'ADD_ENGAGEMENT_E_INSPECTION_PPA',
  ADD_ENGAGEMENT_E_INSPECTION_PPA_ADMIN_REJECT = 'ADD_ENGAGEMENT_E_INSPECTION_PPA_ADMIN_REJECT',
  TERMINATE_ENGAGEMENT_INDIVIDUAL_ADMIN_WITHOUT_DOCUMENT = 'TERMINATE_ENGAGEMENT_INDIVIDUAL_ADMIN_WITHOUT_DOCUMENT',
  ADD_ENGAGEMENT_E_INSPECTION_PPA_ADMIN_WITH_DOCUMENT = 'ADD_ENGAGEMENT_E_INSPECTION_PPA_ADMIN_WITH_DOCUMENT',
  ADD_ENGAGEMENT_E_INSPECTION_PPA_ADMIN_WITHOUT_DOCUMENT = 'ADD_ENGAGEMENT_E_INSPECTION_PPA_ADMIN_WITHOUT_DOCUMENT',
  CHANGE_ENGAGEMENT_INDIVIDUAL_ADMIN_WITH_DOCUMENT = 'CHANGE_ENGAGEMENT_INDIVIDUAL_ADMIN_WITH_DOCUMENT',
  CHANGE_ENGAGEMENT_INDIVIDUAL_ADMIN_WITHOUT_DOCUMENT = 'CHANGE_ENGAGEMENT_INDIVIDUAL_ADMIN_WITHOUT_DOCUMENT'
}
