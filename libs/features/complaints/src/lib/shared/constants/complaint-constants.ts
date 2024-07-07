/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ComplaintConstants {
  public static get DESCRIPTION_LABEL() {
    return 'YOUR-MESSAGE';
  }
  public static get TYPE_PLACEHOLDER() {
    return 'TYPE';
  }
  public static get SUBTYPE_PLACEHOLDER() {
    return 'SUB-TYPE';
  }
  public static get TYPE_LABEL() {
    return 'TYPE-LABEL';
  }
  public static get SUBTYPE_LABEL() {
    return 'SUB-TYPE-LABEL';
  }
  public static get COMPLAINTS_DESCRIPTION() {
    return ComplaintConstants.COMPLAINTS + 'DESCRIPTION';
  }
  public static get COMPLAINTS_COMMENTS() {
    return ComplaintConstants.COMPLAINTS + 'COMMENTS';
  }
  public static get YOUR_MESSAGE() {
    return ComplaintConstants.COMPLAINTS + ComplaintConstants.DESCRIPTION_LABEL;
  }
  public static get COMPLAINTS() {
    return 'COMPLAINTS.';
  }
  public static get COMPLAINTS_SUGGESTION() {
    return ComplaintConstants.COMPLAINTS + 'COMPLAINTS-SUGGESTIONS';
  }
  public static get WRITE_US() {
    return ComplaintConstants.COMPLAINTS + 'WRITE-TO-US';
  }
  public static get PROVIDE_INFO() {
    return 'PROVIDE-INFO';
  }
  public static get REOPEN() {
    return 'RE-OPEN';
  }
  public static get INDIVIDUAL() {
    return 'INDIVIDUAL';
  }
  public static get ESTABLISHMENT_ADMIN() {
    return 'ESTABLISHMENT-ADMIN';
  }
  public static get COMPLAINT() {
    return 'COMPLAINT';
  }
  public static get COMPLAINT_AGAINST() {
    return ComplaintConstants.COMPLAINTS + 'COMPLAINT-AGAINST';
  }
  public static get APPEAL_AGAINST() {
    return ComplaintConstants.COMPLAINTS + 'APPEAL-AGAINST';
  }
  public static get PLEA_AGAINST() {
    return ComplaintConstants.COMPLAINTS + 'PLEA-AGAINST';
  }
  public static get COMPLAINT_HEADER() {
    return 'COMPLAINT-HEADER';
  }
  public static get SUBMIT() {
    return 'SUBMIT';
  }
  public static get CUSTOMER_SUMMARY() {
    return ComplaintConstants.COMPLAINTS + 'CUSTOMER-SUMMARY';
  }
  public static get ESTABLISHMENT_SUMMARY() {
    return ComplaintConstants.COMPLAINTS + 'ESTABLISHMENT-SUMMARY';
  }
  public static get COMPLAINT_DETAILS() {
    return 'COMPLAINT-DETAILS';
  }
  public static get ENQUIRY_DETAILS() {
    return 'ENQUIRY-DETAILS';
  }
  public static get APPEAL_DETAILS() {
    return 'APPEAL-DETAILS';
  }
  public static get PLEA_DETAILS() {
    return 'PLEA-DETAILS';
  }
  public static get SUGGESTION_DETAILS() {
    return 'SUGGESTION-DETAILS';
  }
  public static get RAISE_ITSM_SUCCESS() {
    return ComplaintConstants.COMPLAINTS + 'RAISE-ITSM-SUCCESS';
  }
  public static get REOPEN_ITSM_SUCCESS() {
    return ComplaintConstants.COMPLAINTS + 'REOPEN-ITSM-SUCCESS';
  }
  public static get SUGGESTION_ALERT() {
    return ComplaintConstants.COMPLAINTS + 'NO-RESULTS';
  }
  public static get MODIFY_SUMMARY_SUCCESS_MESSAGE() {
    return ComplaintConstants.COMPLAINTS + 'COMPLAINT-DETAILS-UPDATED';
  }
}
