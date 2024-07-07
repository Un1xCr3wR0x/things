import { Component, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { WidgetBase } from '../../base/widget-base';

@Component({
  selector: 'dev-toggle-dc',
  templateUrl: './toggle-dc.component.html',
  styleUrls: ['./toggle-dc.component.scss']
})
export class ToggleDcComponent extends WidgetBase implements OnInit {
  constructor(state: StateService) {
    super(state);
    state.heading$.next('Toggle');
    state.hasToggle$.next(false);
  }

  ngOnInit(): void {}
}
