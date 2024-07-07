/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input } from '@angular/core';
import { Establishment, TransferContributorDetails } from '../../../../shared/models';

@Component({
  selector: 'cnt-view-transfer-details-dc',
  templateUrl: './view-transfer-details-dc.component.html',
  styleUrls: ['./view-transfer-details-dc.component.scss']
})
export class ViewTransferDetailsDcComponent {
  /** Input variables */
  @Input() establishment: Establishment;
  @Input() transferDetails: TransferContributorDetails;
}
