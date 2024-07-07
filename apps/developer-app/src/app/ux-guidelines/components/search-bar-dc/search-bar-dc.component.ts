import { Component, OnInit } from '@angular/core';
import { WidgetBase } from '../../base/widget-base';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'dev-search-bar-dc',
  templateUrl: './search-bar-dc.component.html',
  styleUrls: ['./search-bar-dc.component.scss']
})
export class SearchBarDcComponent extends WidgetBase implements OnInit {
  constructor(state: StateService) {
    super(state);
    state.heading$.next('Search');
    state.hasToggle$.next(false);
  }
  ngOnInit(): void {}

  search(searchParams: String) {}
}
