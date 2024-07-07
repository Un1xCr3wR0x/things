/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BankAccount } from '@gosi-ui/core';
import { CancelContributorDetails, VicContributionDetails } from '../../../../shared/models';

@Component({
  selector: 'cnt-view-cancel-vic-details-dc',
  templateUrl: './view-cancel-vic-details-dc.component.html',
  styleUrls: ['./view-cancel-vic-details-dc.component.scss']
})
export class ViewCancelVicDetailsDcComponent {
  /**Input variables */
  @Input() canEdit: boolean;
  @Input() vicCancelDetails: CancelContributorDetails;
  @Input() contributionDetails: VicContributionDetails;
  @Input() bankAccountDetails: BankAccount;
  @Input() isPREligible: boolean;
  @Input() lang: string;

  /** Output variables */
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  /** Method to handle edit. */
  editTerminateDetails() {
    this.onEdit.emit();
  }
}
