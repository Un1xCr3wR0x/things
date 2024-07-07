/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[gosiLanguageMask]'
})
export class LanguageMaskDirective {
  constructor(private el: ElementRef) {}

  private readonly regex: RegExp = new RegExp(/[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]+$/);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'Ctrl', '-', 'ArrowLeft', 'ArrowRight'];

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key, current.slice(position)].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
