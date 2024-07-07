/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input } from '@angular/core';
import { Establishment, TerminateContributorDetails } from '../../../../shared/models';
import { BankAccount } from '@gosi-ui/core/lib/models';

@Component({
  selector: 'cnt-view-terminate-details-dc',
  templateUrl: './view-terminate-details-dc.component.html',
  styleUrls: ['./view-terminate-details-dc.component.scss']
})
export class ViewTerminateDetailsDcComponent {
  /** Input variables */
  @Input() establishment: Establishment;
  @Input() terminationDetails: TerminateContributorDetails;
  @Input() showbankDetails = false;
  @Input() bankDetails: BankAccount;
}
