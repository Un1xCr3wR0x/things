/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input } from '@angular/core';
import { HealthRecordDetails } from '../../../../shared/models';

@Component({
  selector: 'cnt-view-health-record-detail-dc',
  templateUrl: './view-health-record-detail-dc.component.html',
  styleUrls: ['./view-health-record-detail-dc.component.scss']
})
export class ViewHealthRecordDetailDcComponent {
  /** Input variables */
  @Input() healthDetails: HealthRecordDetails;
  @Input() doctorVerificationStatus: string;
  @Input() isOpen: boolean;
}
