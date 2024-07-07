import { Component, OnInit } from '@angular/core';
import { WidgetBase } from '../../base/widget-base';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'dev-dropdown-dc',
  templateUrl: './dropdown-dc.component.html',
  styleUrls: ['./dropdown-dc.component.scss']
})
export class DropdownDcComponent extends WidgetBase implements OnInit {
  constructor(state: StateService) {
    super(state);
    state.heading$.next('Dropdown');
    state.hasToggle$.next(false);
  }

  ngOnInit(): void {}
}
