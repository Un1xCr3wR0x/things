/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[gosiGreaterLessSignNegate]'
})
export class GreaterLessSignNegateDirective {
  @Input('gosiGreaterLessSignNegate') inputControl: FormControl;
  private readonly regexpGtLt: RegExp = new RegExp('[<>]+', 'g');

  constructor(private el: ElementRef) {}
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    return this.handleSpecialCharacters(event.key);
  }

  @HostListener('paste', ['$event'])
  onPaste() {
    this.validateFields();
  }

  @HostListener('drop', ['$event.target.value'])
  onmousedown() {
    this.validateFields();
  }

  /**Method to negate greater than, less than sign characters */
  handleSpecialCharacters(allowedChars: string): boolean {
    if (String(allowedChars).match(this.regexpGtLt)) return false;
    else return true;
  }

  /**Method to replace greater than, less than sign characters to null */
  validateFields() {
    setTimeout(() => {
      const value = this.el.nativeElement.value.replace(this.regexpGtLt, '');
      if (value === '') {
        this.inputControl.reset();
        this.inputControl.markAsTouched();
      } else {
        this.el.nativeElement.value = value;
      }
    }, 0);
  }
}
