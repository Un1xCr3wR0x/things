/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'cnt-transfer-all-feedback-dc',
  templateUrl: './transfer-all-feedback-dc.component.html',
  styleUrls: ['./transfer-all-feedback-dc.component.scss']
})
export class TransferAllFeedbackDcComponent {
  /** Input variables */
  @Input() message: BilingualText;
}
