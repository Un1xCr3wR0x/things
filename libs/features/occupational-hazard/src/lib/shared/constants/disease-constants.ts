/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * This class is to declare occupational-hazard disease module constants.
 *
 * @export
 * @class DiseaseConstants
 */

export class DiseaseConstants {
  public static get WIZARD_DISEASE_DETAILS() {
    return 'OCCUPATIONAL-HAZARD.DISEASE.WIZARD-DISEASE-DETAILS';
  }
  public static get WIZARD_CONTACT_PAYMENT_DETAILS() {
      return 'OCCUPATIONAL-HAZARD.DISEASE.CONTACT-PAYMENT-DETAILS';
    }
  public static get DOCUMENT_TRANSACTION_TYPE(): string {
    return 'ADD_DISEASE';
  }
  public static get WIZARD_REOPEN_DETAILS() {
    return 'OCCUPATIONAL-HAZARD.REOPENING-DETAILS';
  }

  public static get EST_ADMIN_REOPEN_DISEASE(): number {
    return 3;
  }
  public static get CSR_REOPEN_DISEASE(): number {
    return 4;
  }
  public static get ALERT_FOR_CLOSING(): string {
    return 'OCCUPATIONAL-HAZARD.DISEASE-STATUS-INFO';
  }
  public static get UPDATE_PAYEE(): string {
    return 'UPDATE_PAYEE';
  }
  public static get DESC_MAX_LENGTH(): number {
    return 1500;
  }
  public static get DISEASE(): string{
    return 'Disease';
  }
  public static get OCCUPATION_LIST_CONTRIBUTOR(): string{
    return 'Contributors occupation list';
  }
  
  public static get MANUAL_OCCUPATION(): string{
    return 'Manual Occupation';
  }
  public static get REGISTERED_OCCUPATION(): string{
    return 'Registered Occupation';
  }
  public static get NONREGISTERED_OCCUPATION(): string{
    return 'Non Registered Occupation';
  }

}

