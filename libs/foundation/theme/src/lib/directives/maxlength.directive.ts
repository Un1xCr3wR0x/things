/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, HostListener, Input, ElementRef, AfterViewChecked } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[gosiMaxLength]'
})
export class MaxlengthDirective implements AfterViewChecked {
  constructor(private el: ElementRef) {}
  @Input() maxByteLength: number;
  @Input() control: FormControl;
  @HostListener('input', ['$event'])
  onInputEvent() {
    this.sliceText();
  }
  ngAfterViewChecked() {
    this.sliceText();
  }
  sliceText() {
    const value = this.el.nativeElement.getElementsByClassName('form-control')[0].value;
    const enco = new window.TextEncoder();
    const deco = new window.TextDecoder('utf-8');
    const uint8 = enco.encode(value);
    if (uint8.length > this.maxByteLength) {
      const section = uint8.slice(0, this.maxByteLength);
      let result = deco.decode(section);
      if (result.includes('�')) result = result.replace(/[�]/g, '');
      this.el.nativeElement.getElementsByClassName('form-control')[0].value = result;
      this.control.setValue(result);
    }
  }
}
