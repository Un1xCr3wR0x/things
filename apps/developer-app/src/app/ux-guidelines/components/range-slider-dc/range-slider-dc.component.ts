import { Component, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { WidgetBase } from '../../base/widget-base';

@Component({
  selector: 'dev-range-slider-dc',
  templateUrl: './range-slider-dc.component.html',
  styleUrls: ['./range-slider-dc.component.scss']
})
export class RangeSliderDcComponent extends WidgetBase implements OnInit {
  constructor(state: StateService) {
    super(state);
    state.heading$.next('Slider');
    state.hasToggle$.next(false);
  }

  ngOnInit(): void {}
}
