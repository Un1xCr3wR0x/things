/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[gosiNumberMask]'
})
export class NumberMaskDirective {
  constructor(private el: ElementRef) {}

  private readonly regexpArabic: RegExp = new RegExp(
    /[\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufbc1]|[\ufbd3-\ufd3f]|[\ufd50-\ufd8f]|[\ufd92-\ufdc7]|[\ufe70-\ufefc]|[\uFDF0-\uFDFD]+$/
  );
  private readonly regexp: RegExp = new RegExp('^[0-9.]+$');
  private specialKeysPressedValue: Array<string> = [
    'Backspace',
    'ArrowLeft',
    'End',
    'Home',
    'Ctrl',
    'ArrowRight',
    'Delete',
    'Tab'
  ];

  @HostListener('keydown', ['$event'])
  onKeyDownEvent(event: KeyboardEvent) {
    if (this.specialKeysPressedValue.indexOf(event.key) !== -1) {
      return;
    }
    const position = this.el.nativeElement.getElementsByClassName('form-control')[0].selectionStart;
    const currentValue: string = this.el.nativeElement.getElementsByClassName('form-control')[0].value;
    const nextValue: string = [currentValue.slice(0, position), event.key, currentValue.slice(position)].join('');
    if (nextValue && !String(nextValue).match(this.regexp)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');

    if (pastedText.match(this.regexpArabic)) {
      event.preventDefault();
    }
  }
}
