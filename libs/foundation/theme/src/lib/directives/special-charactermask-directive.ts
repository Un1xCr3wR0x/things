/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[gosiSpecialCharacterMask]'
})
export class SpecialCharacterMaskDirective {
  @Input() removeExtraSpecialCharacters = false;
  @Input() removeSpecialCharacters = false;
  @Input() onlyAlphaNumerics = false;
  @Input() onlyDigits = false;
  @Input() enableValidation = true;
  // @Input() enableWhiteSpace = true;
  private readonly regexp: RegExp = new RegExp(/[a-zA-Z \n\r\t]/g);
  private readonly regexpSpecialCharacters: RegExp = new RegExp(/[.,-/:]/g);
  private readonly regexpExtraSpecialCharacters: RegExp = new RegExp(/[?&=%_*@#\\]/g);
  private readonly regexpArabic: RegExp = new RegExp(
    /[\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufbc1]|[\ufbd3-\ufd3f]|[\ufd50-\ufd8f]|[\ufd92-\ufdc7]|[\ufe70-\ufefc]|[\uFDF0-\uFDFD]/g
  );
  private readonly regexpArabicAlphabets: RegExp = new RegExp(/[\u0621-\u064A]/g);
  private readonly regexpNumber: RegExp = new RegExp(/[0-9]/g);
  private readonly regexpArabicNumber: RegExp = new RegExp(/[۰۱۲۳٤٥٦٧۸۹]/g);
  private readonly regexpArabicSpecialCharacters: RegExp = new RegExp('[ْلآآ؟،ـألألإإ؛لآلألإ]+$');
  private readonly _whiteSpace = new RegExp(/\s+/g);
  private specialKeysPressed: Array<string> = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    'Ctrl',
    'ArrowLeft',
    'ArrowRight',
    'Delete'
  ];
  constructor() {}
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (
      this.specialKeysPressed.indexOf(event.key) !== -1 ||
      ((event.ctrlKey || event.metaKey) && event.key.toUpperCase() === 'V') ||
      ((event.ctrlKey || event.metaKey) && event.key.toUpperCase() === 'A') ||
      ((event.ctrlKey || event.metaKey) && event.key.toUpperCase() === 'C')
    ) {
      return true;
    }
    return this.handleSpecialCharacters(event.key);
  }
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (this.onlyDigits) {
      if (
        this.specialKeysPressed.indexOf(event.key) !== -1 ||
        ((event.ctrlKey || event.metaKey) && event.key.toUpperCase() === 'V') ||
        ((event.ctrlKey || event.metaKey) && event.key.toUpperCase() === 'A') ||
        ((event.ctrlKey || event.metaKey) && event.key.toUpperCase() === 'C')
      ) {
        return true;
      }
      return this.handleSpecialCharacters(event.key);
    }
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
    if (allowedChars) allowedChars = allowedChars.trim();
    // if (allowedChars) allowedChars = this.enableWhiteSpace ? allowedChars.trim() : allowedChars;
    if (!this.enableValidation) return true;
    let str = allowedChars;
    if (this.onlyDigits) {
      str = str.replace(this.regexpNumber, '');
    } else {
      if (this.onlyAlphaNumerics) {
        if (str.includes('؟')) return false;
        if (str.includes('لإ')) return false;
        str = str.replace(this.regexpArabicAlphabets, '');
      }
      str = str.replace(this.regexp, '');
      str = str.replace(this.regexpNumber, '');
      str = str.replace(this.regexpArabicNumber, '');
      if (!this.onlyAlphaNumerics) {
        str = str.replace(this.regexpArabic, '');
        if (!this.removeSpecialCharacters) {
          str = str.replace(this.regexpSpecialCharacters, '');
        }
        if (!this.removeExtraSpecialCharacters) str = str.replace(this.regexpExtraSpecialCharacters, '');
      }
    }
    return str.length > 0 ? false : true;
  }
}
