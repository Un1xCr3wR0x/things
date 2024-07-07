/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[gosiRestrictNumber]'
})
export class RestrictNumberDirective {
  readonly regex: RegExp = new RegExp(/^([^0-9]*)$/); // characters other than numbers
  readonly arabicRegex: RegExp = new RegExp(/^([^\u0660-\u0669]*)$/); // characters other than arabic numbers
  constructor() {}

  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
    const hasNumber = !event?.key?.match(this.regex);
    const hasArabicNumber = !event?.key?.match(this.arabicRegex);
    if (hasNumber || hasArabicNumber) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');

    if (!pastedText.match(this.regex) || !pastedText.match(this.arabicRegex)) {
      event.preventDefault();
    }
  }
}
