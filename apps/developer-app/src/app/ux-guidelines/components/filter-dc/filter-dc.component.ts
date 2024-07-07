import { Component, OnInit } from '@angular/core';
import { WidgetBase } from '../../base/widget-base';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'dev-filter-dc',
  templateUrl: './filter-dc.component.html',
  styleUrls: ['./filter-dc.component.scss']
})
export class FilterDcComponent extends WidgetBase implements OnInit {
  constructor(state: StateService) {
    super(state);
    state.heading$.next('Filter');
    state.hasToggle$.next(false);
  }

  ngOnInit(): void {}
}
