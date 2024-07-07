import { Component, OnInit } from '@angular/core';
import { WidgetBase } from '../../base/widget-base';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'dev-date-gregorian-dc',
  templateUrl: './date-gregorian-dc.component.html',
  styleUrls: ['./date-gregorian-dc.component.scss']
})
export class DateGregorianDcComponent extends WidgetBase implements OnInit {
  constructor(state: StateService) {
    super(state);
    state.heading$.next('Date - Gregorian');
  }

  ngOnInit(): void {}
}
