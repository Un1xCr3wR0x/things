/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input } from '@angular/core';
export enum StatusTypeEnum {
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
  DANGER = 'danger',
  DISABLED = 'disabled',
  CANCEL = 'cancel'
}

@Component({
  selector: 'gosi-card-status-dc',
  templateUrl: './card-status-dc.component.html',
  styleUrls: ['./card-status-dc.component.scss']
})
export class CardStatusDcComponent {
  category = StatusTypeEnum;
  @Input() value: string;
  @Input() type: string;
  @Input() isBold = true;
  constructor() {}
}
