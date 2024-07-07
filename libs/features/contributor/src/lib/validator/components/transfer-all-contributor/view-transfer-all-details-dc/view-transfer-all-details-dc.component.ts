/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TransferAllContributorDetails, ContributorCountDetails } from '../../../../shared/models';

@Component({
  selector: 'cnt-view-transfer-all-details-dc',
  templateUrl: './view-transfer-all-details-dc.component.html',
  styleUrls: ['./view-transfer-all-details-dc.component.scss']
})
export class ViewTransferAllDetailsDcComponent {
  /** Input variables */
  @Input() transferAllDetails: TransferAllContributorDetails;
  @Input() contributorDetails: ContributorCountDetails;
  @Input() canEdit: boolean;

  /**Output variables */
  @Output() editEvent = new EventEmitter<null>(null);
}
