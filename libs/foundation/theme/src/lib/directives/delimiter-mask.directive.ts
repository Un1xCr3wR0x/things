import { Directive, HostListener, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[gosiDelimiterMask]'
})
export class DelimiterMaskDirective {
  constructor() {}
  @Input() control: FormControl;
  private readonly regexp: RegExp = new RegExp(/[::]{2,}/g);
  @HostListener('input', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const value = (event.target as HTMLInputElement).value;
    if (value.match(this.regexp)) {
      this.control.setValue(value.replace(/[::]{2,}/g, ':'));
    }
  }
}
