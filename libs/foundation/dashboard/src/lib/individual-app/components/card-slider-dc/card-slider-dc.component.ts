import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'dsb-card-slider-dc',
  templateUrl: './card-slider-dc.component.html',
  styleUrls: ['./card-slider-dc.component.scss']
})
export class CardSliderDcComponent implements OnInit, OnChanges {
  @Input() showLeft: boolean;
  @Input() showRight: boolean;
  @Output() onLeftClick = new EventEmitter();
  @Output() onRightClick = new EventEmitter();
  @Input() lang = 'en';
  @Input() isOH: boolean;
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.lang && changes.lang.currentValue) this.lang = changes.lang.currentValue;
  }
}
