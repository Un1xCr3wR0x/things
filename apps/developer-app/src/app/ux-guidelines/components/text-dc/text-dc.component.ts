import { Component, OnInit } from '@angular/core';
import { WidgetBase } from '../../base/widget-base';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'dev-text-dc',
  templateUrl: './text-dc.component.html',
  styleUrls: ['./text-dc.component.scss']
})
export class TextDcComponent extends WidgetBase implements OnInit {
  constructor(state: StateService) {
    super(state);
    state.heading$.next('Text Field');
  }

  ngOnInit(): void {}
}
