import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'gosi-tag-dc',
  templateUrl: './tag-dc.component.html',
  styleUrls: ['./tag-dc.component.scss']
})
export class TagDcComponent implements OnInit {
  _value: string;
  _bilingualValue: BilingualText;
  @Input()
  get value() {
    return this._value || this._bilingualValue;
  }
  set value(inputValue: string | BilingualText) {
    if ((inputValue as BilingualText)?.english || (inputValue as BilingualText)?.arabic) {
      this._bilingualValue = inputValue as BilingualText;
      this._value = undefined;
    } else {
      this._value = inputValue as string;
      this._bilingualValue = undefined;
    }
  }
  @Input() values: BilingualText[];
  @Input() rangeValues: number[] = [];
  @Input() isActive = false;
  @Input() isLast = false;
  @Input() isFirst = false;
  @Input() showClose = false;
  @Input() showArrow = false;
  @Input() isEngScreen = true;

  @Output() chooseTag = new EventEmitter();
  @Output() clearTag = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
