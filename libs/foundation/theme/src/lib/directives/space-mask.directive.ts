/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[gosiSpaceMask]'
})
export class SpaceMaskDirective {
  private readonly regexp: RegExp = new RegExp(/[\s]/g);
  @HostListener('keypress', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key?.match(this.regexp)) event.preventDefault();
  }
  @HostListener('paste', ['$event'])
  onPaste(event) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');

    if (pastedText.match(this.regexp)) {
      event.preventDefault();
    }
  }
}
