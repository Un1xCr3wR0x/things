/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[gosiSpecialCharacters]'
})
export class SpecialCharactersDirective {
  private readonly regexp: RegExp = new RegExp(/^[a-zA-Z ]+$/);
  private readonly regexpArabic: RegExp = new RegExp(
    /[\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufbc1]|[\ufbd3-\ufd3f]|[\ufd50-\ufd8f]|[\ufd92-\ufdc7]|[\ufe70-\ufefc]|[\uFDF0-\uFDFD]+$/
  );
  private readonly regexpNumber: RegExp = new RegExp('^[0-9]+$');
  private readonly regexpAlphaNumeric: RegExp = new RegExp(/^[a-zA-Z0-9]+$/);
  constructor() {}
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    return this.handleSpecialCharacters(event.key);
  }

  @HostListener('paste', ['$event'])
  onPaste(value) {
    return this.handleSpecialCharacters(value.clipboardData.getData('text'));
  }

  @HostListener('drop', ['$event.target.value'])
  onmousedown(event) {
    return this.handleSpecialCharacters(event);
  }

  /**Method to handle special characters */
  handleSpecialCharacters(allowedChars: string): boolean {
    if (
      !String(allowedChars).match(this.regexp) &&
      !String(allowedChars).match(this.regexpArabic) &&
      !String(allowedChars).match(this.regexpNumber) &&
      !String(allowedChars).match(this.regexpAlphaNumeric)
    )
      return false;
    else return true;
  }
}
