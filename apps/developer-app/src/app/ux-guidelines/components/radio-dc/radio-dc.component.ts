import { Component, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { WidgetBase } from '../../base/widget-base';

@Component({
  selector: 'dev-radio-dc',
  templateUrl: './radio-dc.component.html',
  styleUrls: ['./radio-dc.component.scss']
})
export class RadioDcComponent extends WidgetBase implements OnInit {
  constructor(state: StateService) {
    super(state);
    state.heading$.next('Radio');
    state.hasToggle$.next(false);
  }

  ngOnInit(): void {}
}
