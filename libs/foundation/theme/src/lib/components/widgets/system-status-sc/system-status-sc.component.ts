/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit } from '@angular/core';
import { PopupIcon, SystemService, SystemStatus, SystemStatusEnum } from '@gosi-ui/core';

@Component({
  selector: 'gosi-ui-system-status-sc',
  templateUrl: './system-status-sc.component.html',
  styleUrls: ['./system-status-sc.component.scss']
})
export class SystemStatusScComponent implements OnInit {
  status: SystemStatus;
  customIcon: PopupIcon;

  constructor(private systemService: SystemService) {}

  ngOnInit(): void {
    this.status = this.systemService.status;
    this.checkIcon(this.status?.code);
  }

  checkIcon(statusCode: SystemStatusEnum) {
    switch (statusCode) {
      case SystemStatusEnum.MAINTANANCE: {
        this.customIcon = PopupIcon.MAINTANANCE;
        break;
      }
      case SystemStatusEnum.UNAUTHORISED: {
        this.customIcon = PopupIcon.MAINTANANCE;
        break;
      }
    }
  }
}
