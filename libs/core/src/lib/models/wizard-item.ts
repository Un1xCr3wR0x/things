/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * Wrapper class to hold wizard item details
 *
 * @export
 * @class WizardItem
 */
export class WizardItem {
  key: string = undefined;
  label: string = undefined;
  id: string = undefined;
  icon: string = undefined;
  isActive = false;
  isDisabled = true;
  isDone = false;
  required = true;
  isImage? = false;
  length: any;
  hide? = false;

  /**
   * Creates an instance of WizardItem
   * @memberof  WizardItem
   *
   */
  constructor(key, icon, required?: boolean) {
    this.key = key;
    this.label = key;
    this.icon = icon;
    if (required === false) {
      this.required = false;
    }
  }
}
