import { ApplicationTypeEnum, BilingualText, RouterConstants } from '@gosi-ui/core';

export class ManagePersonConstants {
  // Icon Male location
  public static get MALE_ICON_LOCATION(): string {
    return 'assets/icons/man.svg';
  }
  // Icon Female location
  public static get FEMALE_ICON_LOCATION(): string {
    return 'assets/icons/female.svg';
  }

  //PASSPORT DOCUMENT KEY
  public static get PASSPORT_DOCUMENT_KEY(): string {
    return 'ADD_PASSPORT';
  }
  //PASSPORT DOCUMENT TYPE
  public static get PASSPORT_DOCUMENT_TYPE(): string {
    return 'ADD_PASSPORT';
  }
  //ADDNIN DOCUMENT KEY
  public static get ADDNIN_DOCUMENT_KEY(): string {
    return 'ADD_NIN';
  }
  //ADDNIN DOCUMENT TYPE
  public static get ADDNIN_DOCUMENT_TYPE(): string {
    return 'ADD_NIN';
  }
 //IQAMA DOCUMENT KEY
 public static get IQAMA_DOCUMENT_KEY(): string {
  return 'UPDATE_IQAMA_NUMBER';
}
//IQAMA DOCUMENT TYPE
public static get IQAMA_DOCUMENT_TYPE(): string {
  return 'UPDATE_IQAMA_NUMBER';
}

  //IQAMA DOCUMENT TRANSLATIONID
  public static get IQAMA_DOCUMENT_ID(): number {
    return 300301;
  }
  //BORDER DOCUMENT KEY
  public static get BORDER_DOCUMENT_KEY(): string {
    return 'UPDATE_BORDER_NUMBER ';
  }
  //BORDER DOCUMENT TYPE
  public static get BORDER_DOCUMENT_TYPE(): string {
    return 'UPDATE_BORDER_NUMBER ';
  }

  // If the transaction is in the returned state
  public static get STATUS_RETURNED(): string {
    return 'VALIDATOR RETURNED';
  }
  //BORDER DOCUMENT TRANSLATIONID
  public static get BORDER_DOCUMENT_ID(): number {
    return 300302;
  }

  //Navigation Indicator for submitting and cancelling the transaction

  //First submit
  public static get NAV_INDEX_SUBMIT(): number {
    return 0;
  }

  //Re enter after return
  public static get NAV_INDEX_RE_ENTER(): number {
    return 1;
  }

  //Validator edit and modify
  public static get NAV_INDEX_VALIDATOR_SUBMIT(): number {
    return 2;
  }

  public static get NONSAUDI_DOCUMENT_TRANSACTION_KEY(): string {
    return 'UPDATE_NON_SAUDI_IBAN';
  }

  public static get DOCUMENT_TRANSACTION_TYPE(): string {
    return 'NON_SAUDI_IBAN_VERIFICATION';
  }

  //Rejection Reason
  public static get REJECTION_REASON_OTHERS(): string {
    return 'Others';
  }

  public static get HEADING_ADD_IQAMA(): string {
    return 'CUSTOMER-INFORMATION.ADD-IQAMA';
  }

  public static get HEADING_ADD_BORDER(): string {
    return 'CUSTOMER-INFORMATION.ADD-BORDER';
  }
  public static get HEADING_ADD_PASSPORT(): string {
    return 'CUSTOMER-INFORMATION.ADD-PASSPORT';
  }
  public static get HEADING_ADD_NIN(): string {
    return 'CUSTOMER-INFORMATION.ADD-MODIFY-NIN';
  }
  public static get HEADING_VERIFY_PERSON(): string {
    return 'CUSTOMER-INFORMATION.VERIFY-PERSON';
  }

  //Rejection and Return headings
  public static get HEADING_REJECT_ADD_IQAMA(): string {
    return 'CUSTOMER-INFORMATION.REJECT-IQAMA-ADD';
  }
  public static get HEADING_RETURN_ADD_IQAMA(): string {
    return 'CUSTOMER-INFORMATION.RETURN-IQAMA-ADD';
  }
  public static get HEADING_REJECT_ADD_BORDER(): string {
    return 'CUSTOMER-INFORMATION.REJECT-BORDER-ADD';
  }
  public static get HEADING_REJECT_ADD_PASSPORT(): string {
    return 'CUSTOMER-INFORMATION.REJECT-PASSPORT-ADD';
  }
  public static get HEADING_REJECT_ADD_NIN(): string {
    return 'CUSTOMER-INFORMATION.REJECT-NIN-ADD';
  }
  public static get HEADING_REJECT_EDIT_NIN(): string {
    return 'CUSTOMER-INFORMATION.REJECT-NIN-EDIT';
  }
  public static get HEADING_RETURN_ADD_PASSPORT(): string {
    return 'CUSTOMER-INFORMATION.RETURN-PASSPORT-ADD';
  }
  public static get HEADING_RETURN_ADD_BORDER(): string {
    return 'CUSTOMER-INFORMATION.RETURN-BORDER-ADD';
  }

  public static ROUTE_CONTRIBUTOR_PROFILE_INJURY_HISTORY(socialInsuranceNo): string {
    return `home/profile/contributor/injury/history/${socialInsuranceNo}`;
  }

  public static ROUTE_CONTRIBUTOR_PROFILE(regNo, sin): string {
    return `home/profile/contributor/${regNo}/${sin}`;
  }
  public static get SAUDI_BANK(): BilingualText {
    return { english: 'Saudi Arabia', arabic: 'السعودية' };
  }
  public static get NON_SAUDI_BANK(): BilingualText {
    return { english: 'Outside Saudi Arabia', arabic: 'خارج السعودية' };
  }

  public static ROUTE_CONTRIBUTOR_PROFILE_INFO(regNo, sin) {
    return `${ManagePersonConstants.ROUTE_CONTRIBUTOR_PROFILE(regNo, sin)}/info`;
  }

  public static ROUTE_CONTRIBUTOR_PROFILE_ENGAGEMENT(regNo, sin) {
    return `${ManagePersonConstants.ROUTE_CONTRIBUTOR_PROFILE(regNo, sin)}/engagement`;
  }

  public static ROUTE_CONTRIBUTOR_UNIFIED_PROFILE(sin) {
    return `home/profile/contributor/${sin}/engagement/unified`;
  }

  public static ROUTE_CONTRIBUTOR_PROFILE_DOCUMENTS(regNo, sin) {
    return `${ManagePersonConstants.ROUTE_CONTRIBUTOR_PROFILE(regNo, sin)}/documents`;
  }

  public static ROUTE_CONTRIBUTOR_PROFILE_INJURY(regNo, sin) {
    return `${ManagePersonConstants.ROUTE_CONTRIBUTOR_PROFILE(regNo, sin)}/injury`;
  }

  public static ROUTE_CONTRIBUTOR_PROFILE_ENGAGEMENT_HISTORY(regNo, sin) {
    return `${ManagePersonConstants.ROUTE_CONTRIBUTOR_PROFILE(regNo, sin)}/history`;
  }

  public static ROUTE_PROFILE_INJURY_HISTORY(regNo, socialInsuranceNo): string {
    return `${ManagePersonConstants.ROUTE_CONTRIBUTOR_PROFILE(
      regNo,
      socialInsuranceNo
    )}/injury/history/${socialInsuranceNo}`;
  }

  public static IND_PROFILE_UPLOAD_DOC_ROUTE(personId: number): string {
    return `/home/profile/${personId}/document-upload`;
  }

  public static get NO_OF_OTP_RETRIES(): number {
    return 3;
  }

  public static get ACTIVE_DEAD_PERSON_TERMINATE_MESSAGE_KEY(): string {
    return 'CUSTOMER-INFORMATION.DEAD-PERSON-TERMINATE-MESSAGE';
  }

  public static get ACTIVE_GOVT_EMPLOYEE_TERMINATE_MESSAGE_KEY(): string {
    return 'CUSTOMER-INFORMATION.GOVT-EMPLOYEE-TERMINATE-MESSAGE';
  }

  public static get ACTIVE_DEAD_PERSON_CANCEL_MESSAGE_KEY(): string {
    return 'CUSTOMER-INFORMATION.DEAD-PERSON-CANCEL-MESSAGE';
  }

  public static get ACTIVE_GOVT_EMPLOYEE_CANCEL_MESSAGE_KEY(): string {
    return 'CUSTOMER-INFORMATION.GOVT-EMPLOYEE-CANCEL-MESSAGE';
  }

  public static get DEAD_BEFORE_JOINING_CANCEL_MESSAGE_KEY(): string {
    return 'CUSTOMER-INFORMATION.DEAD-BEFORE-JOININ-CANCEL-MESSAGE-KEY';
  }

  public static get DEAD_PERSON_LEAVING_REASON(): string {
    return 'Termination due to Contributor is Deceased';
  }
  public static get MODIFY_NATIONALITY(): string {
    return 'Modify Nationality Non Saudi to Non Saudi';
  }
  public static get GOVT_EMPLOYEE_LEAVING_REASON(): string {
    return 'Government Job Joining';
  }
  public static ROUTE_TO_INBOX(appType: String): string {
    if (appType === ApplicationTypeEnum.PRIVATE) {
      return RouterConstants.ROUTE_INBOX;
    } else {
      return RouterConstants.ROUTE_TODOLIST;
    }
  }

  public static get ARABIC(): BilingualText {
    return { english: 'Arabic', arabic: 'عربى' };
  }
  public static get ENGLISH(): BilingualText {
    return { english: 'English', arabic: 'الإنجليزية' };
  }

  public static get SELECT_CONTRIBUTOR(): BilingualText {
    return { english: 'Select Contributor', arabic: 'اختيار المشترك' };
  }

  public static get ADD_BANK(): string {
    return 'CUSTOMER-INFORMATION.BANK-DETAILS';
  }

  public static get ADD_BANK_VERIFY(): string {
    return 'CUSTOMER-INFORMATION.VERIFY';
  }
}
