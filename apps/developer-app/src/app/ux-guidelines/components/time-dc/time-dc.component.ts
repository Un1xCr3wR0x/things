import { Component, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { WidgetBase } from '../../base/widget-base';

@Component({
  selector: 'dev-time-dc',
  templateUrl: './time-dc.component.html',
  styleUrls: ['./time-dc.component.scss']
})
export class TimeDcComponent extends WidgetBase implements OnInit {
  constructor(state: StateService) {
    super(state);
    state.heading$.next('Time');
    state.hasToggle$.next(false);
    state.hasFullWidth = true;
  }

  ngOnInit(): void {}
}
