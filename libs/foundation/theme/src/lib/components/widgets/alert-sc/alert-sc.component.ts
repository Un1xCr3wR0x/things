/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { Alert, AlertService, BaseComponent } from '@gosi-ui/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'gosi-alert-sc',
  templateUrl: './alert-sc.component.html',
  styleUrls: ['./alert-sc.component.scss']
})
export class AlertScComponent extends BaseComponent implements OnInit {
  alerts$: Observable<Alert[]> = null;

  @Input() noSpacing: boolean;

  constructor(readonly alertService: AlertService) {
    super();
  }

  ngOnInit() {
    this.alerts$ = this.alertService.getAlerts();
  }

  closed(alert: Alert) {
    this.alertService.clearAlert(alert);
  }
}
