/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input } from '@angular/core';
import { CancelContributorDetails, Establishment } from '../../../../shared/models';

@Component({
  selector: 'cnt-view-cancellation-details-dc',
  templateUrl: './view-cancellation-details-dc.component.html',
  styleUrls: ['./view-cancellation-details-dc.component.scss']
})
export class ViewCancellationDetailsDcComponent {
  /** Input variables. */
  @Input() establishment: Establishment;
  @Input() cancellationDetails: CancelContributorDetails;
}
