import { Component, OnInit } from '@angular/core';
import { WidgetBase } from '../../base/widget-base';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'dev-daterange-dc',
  templateUrl: './daterange-dc.component.html',
  styleUrls: ['./daterange-dc.component.scss']
})
export class DaterangeDcComponent extends WidgetBase implements OnInit {
  constructor(state: StateService) {
    super(state);
    state.heading$.next('DateRange');
    state.hasToggle$.next(false);
    state.hasFullWidth = true;
  }

  ngOnInit(): void {}
}
