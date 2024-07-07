import { Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[pmtMaxCharacters]'
})
export class MaxCharactersDirective {
  @Input() pmtMaxCharacters;
  constructor(private el: ElementRef) {}
  @HostListener('paste', ['$event'])
  onPaste(event) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    if (pastedText.length > this.pmtMaxCharacters) {
      this.el.nativeElement.value = pastedText.toString().substring(0, this.pmtMaxCharacters);
    }
  }
}
