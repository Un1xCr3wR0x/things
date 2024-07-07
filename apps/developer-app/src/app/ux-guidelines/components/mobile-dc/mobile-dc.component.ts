import { Component, OnInit } from '@angular/core';
import { WidgetBase } from '../../base/widget-base';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'dev-mobile-dc',
  templateUrl: './mobile-dc.component.html',
  styleUrls: ['./mobile-dc.component.scss']
})
export class MobileDcComponent extends WidgetBase implements OnInit {
  constructor(state: StateService) {
    super(state);
    state.heading$.next('Mobile');
    state.hasToggle$.next(false);
  }

  ngOnInit(): void {}
}
