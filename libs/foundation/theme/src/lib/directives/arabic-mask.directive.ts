/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[gosiArabicMask]'
})
export class ArabicMaskDirective {
  @Input() excludeOnlyEng = false;
  constructor(private el: ElementRef) {}

  private readonly regex: RegExp = new RegExp(/[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF ]+$/);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'Ctrl', '-', 'ArrowLeft', 'ArrowRight'];
  private readonly engRegex: RegExp = new RegExp(/^[a-zA-Z ]+$/);
  private readonly excludeEngRegex = new RegExp(
    /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]+$/
  );
  @HostListener('keypress', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const currentVal: string = this.el.nativeElement.getElementsByClassName('form-control')[0].value;
    const position = this.el.nativeElement.getElementsByClassName('form-control')[0].selectionStart;
    const next: string = [currentVal.slice(0, position), event.key, currentVal.slice(position)].join('');
    this.validateCharacter(next, event);
  }

  @HostListener('paste', ['$event'])
  onPaste(event) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    this.validateCharacter(pastedText, event);
  }
  @HostListener('ondragstart', ['$event'])
  onmousedown(event) {
    event.preventDefault();
    return false;
  }

  validateCharacter(nextChar: string, event) {
    if (this.excludeOnlyEng) {
      if (nextChar && !this.excludeEngRegex.test(String(nextChar))) {
        event.preventDefault();
      }
    } else {
      if (nextChar && !String(nextChar).match(this.regex)) {
        event.preventDefault();
      }
    }
  }
}
