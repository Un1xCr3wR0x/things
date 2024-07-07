import { OnInit, OnChanges, Component, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dsb-card-carousel-dc',
  templateUrl: './card-carousel-dc.component.html',
  styleUrls: ['./card-carousel-dc.component.scss']
})
export class CardCarouselDcComponent implements OnInit, OnChanges {
  @Input() lang = 'en';
  @Input() showCarouselLeft: boolean = true;
  @Input() showCarouselRight: boolean = true;
  @Output() onLeftClick = new EventEmitter();
  @Output() onRightClick = new EventEmitter();
  @Input() isOH: boolean;
  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.lang && changes.lang.currentValue) this.lang = changes.lang.currentValue;
  }
}
