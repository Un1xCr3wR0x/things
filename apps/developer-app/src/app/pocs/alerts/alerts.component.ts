import { Component, OnInit } from '@angular/core';
import { AlertService } from '@gosi-ui/core';

@Component({
  selector: 'dev-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.showSuccessByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
    this.alertService.setInfoByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
    this.alertService.showWarningByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
    this.alertService.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
    this.alertService.showSuccessByKey('CORE.ERROR.UPLOAD-MANDATORY-DOCUMENTS');
  }
}
