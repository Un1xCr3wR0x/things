/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[gosiByteLimit]'
})
export class ByteLimitDirective {
  @Input() maxLength: number;
  @Input() maxByteLength: number;
  @Input() isMaxChar = false;
  @Input() control: FormControl;
  constructor(private el: ElementRef) {}
  @HostListener('input', ['$event'])
  onInputEvent() {
    const value = this.el.nativeElement.getElementsByClassName('form-control')[0].value;
    const resultString = this.isMaxChar
      ? this.truncateByChars(value, this.maxByteLength, this.maxLength)
      : this.truncateByBytes(value, this.maxLength);
    this.el.nativeElement.getElementsByClassName('form-control')[0].value = resultString;
    this.control.setValue(resultString);
  }
  private byteCount(string) {
    return new TextEncoder().encode(string).length;
  }
  private truncateByBytes(string, byteSize) {
    if (this.byteCount(string) > byteSize) {
      const charsArray = string.split('');
      const truncatedStringArray = [];
      let bytesCounter = 0;
      for (let i = 0; i < charsArray.length; i++) {
        bytesCounter += this.byteCount(charsArray[i]);
        if (bytesCounter <= byteSize) {
          truncatedStringArray.push(charsArray[i]);
        } else {
          break;
        }
      }
      return truncatedStringArray.join('');
    }
    return string;
  }
  private truncateByChars(string, byteSize, charSize) {
    if (this.byteCount(string) > byteSize && string.length >= charSize) {
      const charsArray = string.split('');
      const truncatedStringArray = [];
      let bytesCounter = 0;
      let charCounter = 0;
      for (let i = 0; i < charsArray.length; i++) {
        bytesCounter += this.byteCount(charsArray[i]);
        charCounter += charsArray[i].length;
        if (bytesCounter <= byteSize && charCounter <= charSize) {
          truncatedStringArray.push(charsArray[i]);
        } else {
          break;
        }
      }
      return truncatedStringArray.join('');
    }
    return string;
  }
}
