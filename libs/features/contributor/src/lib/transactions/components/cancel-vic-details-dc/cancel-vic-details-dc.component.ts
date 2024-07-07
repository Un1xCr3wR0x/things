import { Component, Input } from '@angular/core';
import { BankAccount } from '@gosi-ui/core';
import { CancelContributorDetails, VicContributionDetails } from '../../../shared/models';

@Component({
  selector: 'cnt-cancel-vic-details-dc',
  templateUrl: './cancel-vic-details-dc.component.html',
  styleUrls: ['./cancel-vic-details-dc.component.scss']
})
export class CancelVicDetailsDcComponent {
  /**Input variables */

  @Input() vicCancelDetails: CancelContributorDetails;
  @Input() contributionDetails: VicContributionDetails;
  @Input() bankAccountDetails: BankAccount;
  @Input() isPREligible: boolean;
  @Input() lang: string;
}
