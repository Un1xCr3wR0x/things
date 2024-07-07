/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * This class is to declare occupational-hazard module constants.
 *
 * @export
 * @class ComplicationConstants
 */
export class ComplicationConstants {
  public static get TABS_TOTAL_LOAD(): number {
    return 5;
  }
  public static get PAGE_LIMIT_LOAD(): number {
    return 5;
  }
  public static get CURRENT_PAGE_TAB(): number {
    return 0;
  }
  public static get SEC_SELECT_INJURY(): string {
    return 'OCCUPATIONAL-HAZARD.SEC-SELECT-INJURY';
  }
  public static get WIZARD_COMPLICATION() {
    return 'OCCUPATIONAL-HAZARD.COMPLICATION.WIZARD-COMPLICATION';
  }
  public static get COMPLICATION(): string{
    return 'Complication';
  }
}
