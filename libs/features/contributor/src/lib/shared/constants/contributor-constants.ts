/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, LovList } from '@gosi-ui/core';

export class ContributorConstants {
  public static get NON_SAUDI_EXCLUDED_NATIONALITIES() {
    return ['Saudi Arabia', 'Mixed', 'Immigrated Tribes', 'Non Saudi', 'Invalid nationality'];
  }
  public static get EXCLUDED_OCCUPATIONS(): string[] {
    return [
      'Body guard',
      'Agricultural worker',
      'Cattle breeding worker',
      'Sport coach',
      'Private driver',
      'Investor',
      'Private Car Driver',
      'Farm worker',
      'Animal farm worker',
      'Sports Coach',
      'Fitness Coach',
      'Security Guard'
    ];
  }
  public static get EXCLUDED_WORK_TYPE(): string[] {
    return ['Distance Working', 'Part Time'];
  }

  public static get OCCUPATION_EXPLOITER(): string {
    return 'Exploiter';
  }

  //Nationality
  public static get SAUDI_NATIONAL(): string {
    return 'Saudi';
  }

  //Request or response parameter names
  public static get DATE_OF_BIRTH(): string {
    return 'dateOfBirth';
  }
  public static get BIRTH_DATE(): string {
    return 'birthDate';
  }
  public static get IDENTITY(): string {
    return 'identity';
  }

  public static get NAME(): string {
    return 'name';
  }
  public static get CONTACT_DETAIL(): string {
    return 'contactDetail';
  }
  public static get OCCUPATION_DETAIL(): string {
    return 'occupationDetail';
  }

  //Age of person
  public static get AGE_SIXTY(): number {
    return 60;
  }
  public static get WAGE_SEPARATOR_LIMIT(): number {
    return 1000000000000;
  }
  //dates
  public static get MAX_REGULAR_JOINING_DATE(): string {
    return 'MAX_REGULAR_JOINING_DATE';
  }
  public static get MAX_BACKDATED_JOINING_DATE(): string {
    return 'MAX_BACKDATED_JOINING_DATE';
  }

  //Request or response parameter names
  public static get DISTANCE_WORKING(): string {
    return 'Distance Working';
  }

  //date in dd/mm/yyyy format
  public static get DATE_FORMAT(): string {
    return 'DD/MM/YYYY';
  }

  public static get EMPLOYMENT_NUMBER_MAX_LENGTH(): number {
    return 15;
  }

  public static get DEAD_LEAVING_REASONS(): string[] {
    return [
      'Death Due To Non-Occupational Injury',
      'Death Due To Occupational Injury',
      'Death Due To Occupational Disease',
      'Natural death',
      'Work related death',
      'Death during military operations (martyrdom)'
    ];
  }

  public static get AUTO_LEAVING_REASONS(): string[] {
    return [
      'Obtained Saudi Nationality',
      'Backdated Engagement',
      'Transfer',
      'Termination due to Contributor is Dead',
      'Cancelled Engagement'
    ];
  }

  public static get LIFE_STATUS_ALIVE(): string {
    return 'Alive';
  }
  public static get GOV_JOB_JOINING(): string {
    return 'Government Job Joining';
  }

  public static get NAV_FIRST_VAL_SUBMIT(): string {
    return 'First Validator Submit';
  }
  public static get NAV_ADMIN_EDIT_SUBMIT(): string {
    return 'Establishment Admin Edit';
  }
  public static get LEAVING_REASON_BACKDATED(): string {
    return 'Backdated Engagement';
  }

  public static get WORKFLOW_IN_ADD_ENGAGEMENT(): string {
    return 'WORKFLOW IN ADD ENGAGEMENT';
  }
  public static get ENGAGEMENT_INACTIVE_STATUS(): string[] {
    return ['TO_BE_MADE_HISTORY', 'HISTORY'];
  }
  public static get ENGAGEMENT_ACTIVE_STATUS(): string[] {
    return [
      'LIVE',
      'TO_BE_MADE_LIVE',
      'PENDING',
      'JOIN_IN_PROGRESS',
      'PENDING_FOR_WAGE_UPDATE',
      'TERMINATION_IN_PROGRESS'
    ];
  }
  public static get ENGAGEMENT_CANCELLED_STATUS(): string {
    return 'CANCELLED';
  }
  public static get CANCEL_ENGAGEMENT_PROGRESS_STATUS(): string {
    return 'CANCEL_IN_PROGRESS';
  }
  //Constant for other in the cancel reason list.
  public static get OTHER_CANCEL_REASON(): string {
    return 'Other';
  }

  //Document others
  public static get DOCUMENT_OTHER(): string[] {
    return ['Other', 'Others'];
  }

  public static get TRN_STATE_RETURN(): string {
    return 'RETURN';
  }

  // Names of user certificates
  public static get PRINT_CONTRIBUTION_CERTIFICATE(): string {
    return 'CONTRIBUTION_CERTIFICATE.pdf';
  }
  public static get PRINT_WAGES_CERTIFICATE(): string {
    return 'WAGES_CERTIFICATE.pdf';
  }
  public static get PRINT_ANNUITY_VALUE_CERTIFICATE(): string {
    return 'ANNUITY_VALUE.pdf';
  }
  public static get PRINT_ANNUITY_DETAILED_VALUE_CERTIFICATE(): string {
    return 'ANNUITY_DETAILED_VALUE.pdf';
  }
  public static get PRINT_OBLIGATION_OF_TRANSFERRING_BENEFITS_CERTIFICATE(): string {
    return 'OBLIGATION_OF_TRANSFERRING_BENEFITS.pdf';
  }

  //Cancellation reason for engagement due to transfer on same date of joining
  public static get CANCEL_DUE_TO_TRANSFER_REASON(): string {
    return 'Transfer to another branch';
  }

  public static get COMMENTS_MAX_LENGTH(): number {
    return 100;
  }

  public static get MARITAL_STATUS_EXCLUDE_LIST(): string[] {
    return ['Widower', 'Divorcee'];
  }

  public static get CONTRIBUTOR_BANNER_COMMON_FIELDS(): string[] {
    return ['nameBilingual', 'nationality', 'dob', 'identifier', 'status'];
  }

  public static get VALIDATOR_SEND_FOR_INSPECTION_CANCEL(): string {
    return 'CONTRIBUTOR.SUCCESS-MESSAGES.CANCEL-INSPECTION-SUCCESS-MESSAGE';
  }
  public static get VALIDATOR_SEND_FOR_INSPECTION_MODIFY(): string {
    return 'CONTRIBUTOR.SUCCESS-MESSAGES.MODIFY-INSPECTION-SUCCESS-MESSAGE';
  }
  public static get VALIDATOR_SEND_FOR_INSPECTION_TERMINATE(): string {
    return 'CONTRIBUTOR.SUCCESS-MESSAGES.TERMINATE-INSPECTION-SUCCESS-MESSAGE';
  }
  public static get VALIDATOR_CANNOT_SEND_FOR_INSPECTION(): string {
    return 'CONTRIBUTOR.SUCCESS-MESSAGES.INSPECTION-NOT-POSSIBLE-MESSAGE';
  }
  public static get EST_ADMIN_DISAGREE_CANCEL_INSPECTION(): string {
    return 'CONTRIBUTOR.SUCCESS-MESSAGES.EST-ADMIN-DISAGREE-CANCEL-INSPECTION';
  }
  public static get EST_ADMIN_DISAGREE_MODIFY_INSPECTION(): string {
    return 'CONTRIBUTOR.SUCCESS-MESSAGES.EST-ADMIN-DISAGREE-MODIFY-INSPECTION';
  }
  public static get EST_ADMIN_DISAGREE_TERMINATE_INSPECTION(): string {
    return 'CONTRIBUTOR.SUCCESS-MESSAGES.EST-ADMIN-DISAGREE-TERMINATE-INSPECTION';
  }
  public static get PRINT_CONTRACT_FILE_NAME(): string {
    return 'EMPLOYEE_CONTRACT.pdf';
  }
  public static get IBAN_DOCUMENT(): string {
    return 'IBAN';
  }
  public static get ValidABSHERVerificationStatus(): string[] {
    return ['Success', 'Not Applicable'];
  }
  public static get GOVERNMENT_LEGAL_ENTITIES(): string[] {
    return ['Government', 'Semi Government'];
  }
  public static get ENGAGEMENT_DETAILS(): string {
    return 'CONTRIBUTOR.ENGAGEMENT-DETAILS';
  }
  public static get DOCUMENTS(): string {
    return 'CORE.DOCUMENTS';
  }
  public static get VERIFY(): string {
    return 'CONTRIBUTOR.VERIFY';
  }
  public static get HEALTH_INSURANCE_HOVER_LABEL(): string {
    return 'CONTRIBUTOR.HEALTH-INSURANCE.COMMITMENT-RATE';
  }

  public static get DOWNLOAD_INACTIVE_CONTRIBUTOR_FILE_NAME(): BilingualText {
    const FILE_NAME = new BilingualText();
    FILE_NAME.english = 'Inactive Contributor list';
    FILE_NAME.arabic = 'قائمة المشتركين الغير نشطين';
    return FILE_NAME;
  }
  public static get DOWNLOAD_ACTIVE_CONTRIBUTOR_FILE_NAME(): BilingualText {
    const FILE_NAME = new BilingualText();
    FILE_NAME.english = 'Active Contributor list';
    FILE_NAME.arabic = 'قائمة المشتركين النشطين';
    return FILE_NAME;
  }
  public static get WITH_COLLECTION(): string {
    return 'With Collection';
  }

  public static get DOWNLOAD_ALL_CONTRIBUTOR_LIST_FILE_NAME(): BilingualText {
    const FILE_NAME = new BilingualText();
    FILE_NAME.english = 'All Contributor list';
    FILE_NAME.arabic = 'قائمة جميع المشتركين';
    return FILE_NAME;
  }
  public static get DOWNLOAD_ALL_CONTRIBUTOR_ENGAGEMENT_FILE_NAME(): BilingualText {
    const FILE_NAME = new BilingualText();
    FILE_NAME.english = 'The list of engagements';
    FILE_NAME.arabic = 'قائمة مدد الإشتراك';
    return FILE_NAME;
  }

  public static get CONTRIBUTOR_SORT_LIST(): LovList {
    return {
      items: [
        { value: { english: 'Joining Date', arabic: 'تاريخ الالتحاق' }, sequence: 0 },
        { value: { english: 'Leaving Date', arabic: 'تاريخ الاستبعاد' }, sequence: 1 },
        { value: { english: 'Contributor Name', arabic: 'اسم المشترك' }, sequence: 2 },
        { value: { english: 'Wage', arabic: 'الأجر' }, sequence: 3 },
        { value: { english: 'Nationality', arabic: 'الجنسية' }, sequence: 4 }
      ]
    };
  }
  public static get DEAD_INJURY_LEAVING_REASONS(): string[] {
    return [
      'Death Due To Non-Occupational Injury',
      'Death Due To Occupational Injury',
      'Disability Due To Occupational Injury'
    ];
  }
  public static get TERMINATE_CONTRIBUTOR_VALIDATOR_HEADING(): BilingualText {
    return { english: 'Terminate Contributor', arabic: 'استبعاد المشترك' };
  }
  public static get EXCLUDED_NATIONALITIES() {
    return ['Saudi Arabia', 'Mixed', 'Non Saudi', 'Invalid nationality'];
  }
  public static get MODIFY_NATIONALITY_IMMIGRATED_TRIBES_TO_GCC(): string {
    return 'MODIFY_NATIONALITY_IMMIGRATED_TRIBES_TO_GCC';
  }
  public static get MODIFY_NATIONALITY_GCC_TO_GCC(): string {
    return 'MODIFY_NATIONALITY_GCC_TO_GCC';
  }
  public static get MODIFY_NATIONALITY_NON_SAUDI_TO_GCC(): string {
    return 'MODIFY_NATIONALITY_NON_SAUDI_TO_GCC';
  }
  public static get MODIFY_NATIONALITY_NON_SAUDI_TO_IMMIGRATED_TRIBES(): string {
    return 'MODIFY_NATIONALITY_NON_SAUDI_TO_IMMIGRATED_TRIBES';
  }
  public static get MODIFY_NATIONALITY_IMMIGRATED_TRIBES_TO_NON_SAUDI(): string {
    return 'MODIFY_NATIONALITY_IMMIGRATED_TRIBES_TO_NON_SAUDI';
  }
  public static get MODIFY_NATIONALITY_GCC_TO_NON_SAUDI(): string {
    return 'MODIFY_NATIONALITY_GCC_TO_NON_SAUDI';
  }
  public static get MODIFY_NATIONALITY_GCC_TO_IMMIGRATED_TRIBES(): string {
    return 'MODIFY_NATIONALITY_GCC_TO_IMMIGRATED_TRIBES';
  }
  public static get NATIONALITY_TRANSACTIONID(): string {
    return 'MODIFY_NATIONALITY_NON_SAUDI_TO_NON_SAUDI';
  }
}
