import { Component, OnInit } from '@angular/core';
import { WidgetBase } from '../../base/widget-base';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'dev-monthrange-dc',
  templateUrl: './monthrange-dc.component.html',
  styleUrls: ['./monthrange-dc.component.scss']
})
export class MonthrangeDcComponent extends WidgetBase implements OnInit {
  constructor(state: StateService) {
    super(state);
    state.heading$.next('MonthRange');
    state.hasToggle$.next(false);
    state.hasFullWidth = true;
  }

  ngOnInit(): void {}
}
