/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BankAccount } from '@gosi-ui/core';
import { TerminateContributorDetails, VicContributionDetails } from '../../../../shared/models';

@Component({
  selector: 'cnt-view-terminate-vic-details-dc',
  templateUrl: './view-terminate-vic-details-dc.component.html',
  styleUrls: ['./view-terminate-vic-details-dc.component.scss']
})
export class ViewTerminateVicDetailsDcComponent {
  /**Input variables */
  @Input() canEdit: boolean;
  @Input() vicTerminate: TerminateContributorDetails;
  @Input() vicContributionDetails: VicContributionDetails;
  @Input() bankDetails: BankAccount;
  @Input() lang: string;
  @Input() isPREligible: boolean;

  /** Output variables */
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  /** Method to handle edit. */
  editTerminateDetails() {
    this.onEdit.emit();
  }
}
