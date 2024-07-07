import { Component, OnInit } from '@angular/core';
import { AlertTypeEnum, LovList } from '@gosi-ui/core';
import { WidgetBase } from '../../base/widget-base';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'dev-alerts-dc',
  templateUrl: './alerts-dc.component.html',
  styleUrls: ['./alerts-dc.component.scss']
})
export class AlertsDcComponent extends WidgetBase implements OnInit {
  onlyOutline = false;
  message = `${this.bilingualControl.get('english').value || 'Custom'} Alert`;
  constructor(state: StateService) {
    super(state);
    state.heading$.next('Alerts');
    state.hasToggle$.next(false);
    state.hasFullWidth = true;
  }

  ngOnInit(): void {}

  alert_types: LovList = {
    items: [
      {
        value: { english: AlertTypeEnum.SUCCESS, arabic: 'نعم' },
        sequence: 1
      },
      {
        value: { english: AlertTypeEnum.DANGER, arabic: 'نعم' },
        sequence: 1
      },
      {
        value: { english: AlertTypeEnum.WARNING, arabic: 'نعم' },
        sequence: 1
      },
      {
        value: { english: AlertTypeEnum.INFO, arabic: 'نعم' },
        sequence: 1
      }
    ]
  };
}
