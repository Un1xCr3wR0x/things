import { Component, OnInit } from '@angular/core';
import { WidgetBase } from '../../base/widget-base';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'dev-buttons-dc',
  templateUrl: './buttons-dc.component.html',
  styleUrls: ['./buttons-dc.component.scss']
})
export class ButtonsDcComponent extends WidgetBase implements OnInit {
  onlyOutline: boolean = false;
  isSmall = false;
  mobFullWidth = false;
  constructor(state: StateService) {
    super(state);
    state.heading$.next('Button');
    state.hasToggle$.next(false);
    state.hasFullWidth = true;
  }
  ngOnInit(): void {}
}
