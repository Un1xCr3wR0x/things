/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * This class is to declare occupational-hazard module constants.
 *
 * @export
 * @class InjuryConstants
 */

export class InjuryConstants {
  public static get WIZARD_INJURY_DETAILS() {
    return 'OCCUPATIONAL-HAZARD.INJURY.WIZARD-INJURY-DETAILS';
  }
  public static get DOCUMENT_TRANSACTION_TYPE(): string {
    return 'ADD_INJURY';
  }
  public static get WIZARD_REOPEN_DETAILS() {
    return 'OCCUPATIONAL-HAZARD.REOPENING-DETAILS';
  }

  public static get EST_ADMIN_REOPEN_INJURY(): number {
    return 3;
  }
  public static get CSR_REOPEN_INJURY(): number {
    return 4;
  }
  public static get ALERT_FOR_CLOSING(): string {
    return 'OCCUPATIONAL-HAZARD.INJURY-STATUS-INFO';
  }
  public static get UPDATE_PAYEE(): string {
    return 'UPDATE_PAYEE';
  }
  public static get INJURY(): string{
    return 'Injury';
  }
}
