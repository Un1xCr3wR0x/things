import { Options } from '@angular-slider/ngx-slider';
import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gosi-range-slider-dc',
  templateUrl: './range-slider-dc.component.html',
  styleUrls: ['./range-slider-dc.component.scss']
})
export class RangeSliderDcComponent implements OnInit, OnChanges {
  @Input() label: string;
  @Input() control: FormGroup;
  @Input() floor = 0;
  @Input() isFilter = false;
  @Input() ceil = 0;
  @Input() placeholder: string;
  @Input() hideOptionalLabel = true;
  @Input() noSwitching = false;

  @Output() mouseUp: EventEmitter<null> = new EventEmitter();
  @Output() pointerup: EventEmitter<null> = new EventEmitter();
  @ViewChild('sliderSection', { static: true }) sliderSection: ElementRef;

  lang: string;
  options = this.setOptionsValue();

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.ceil && changes?.ceil?.currentValue) {
      this.ceil = changes.ceil.currentValue;
      this.options = this.setOptionsValue(this.floor, this.ceil, 1, this.noSwitching);
    }
    if (changes?.floor && changes?.floor?.currentValue) {
      this.floor = changes.floor.currentValue;
      this.options = this.setOptionsValue(this.floor, this.ceil, 1, this.noSwitching);
    }
    if (changes?.noSwitching?.currentValue) {
      this.noSwitching = changes?.noSwitching?.currentValue;
      this.options = this.setOptionsValue(this.floor, this.ceil, 1, this.noSwitching);
    }
  }
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    this.sliderSection?.nativeElement?.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  ngOnInit(): void {
    this.language.subscribe(curruntLang => {
      this.lang = curruntLang;
      this.options.rightToLeft = curruntLang === 'ar' ? true : false;
    });
  }

  onMouseUp() {
    this.mouseUp.emit();
  }
  onPointerUp(){
    this.pointerup.emit();
  }
  setOptionsValue(floor = 0, ceil = 0, step = 1, noSwitching = false): Options {
    const options = new Options();
    options.floor = floor;
    options.ceil = ceil;
    options.step = step;
    options.noSwitching = noSwitching;

    return options;
  }
}
