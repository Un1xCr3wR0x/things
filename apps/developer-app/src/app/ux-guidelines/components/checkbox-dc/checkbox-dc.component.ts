import { Component, OnInit } from '@angular/core';
import { WidgetBase } from '../../base/widget-base';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'dev-checkbox-dc',
  templateUrl: './checkbox-dc.component.html',
  styleUrls: ['./checkbox-dc.component.scss']
})
export class CheckboxDcComponent extends WidgetBase implements OnInit {
  constructor(state: StateService) {
    super(state);
    state.heading$.next('Checkbox');
    state.hasToggle$.next(false);
  }

  ngOnInit(): void {}
}
