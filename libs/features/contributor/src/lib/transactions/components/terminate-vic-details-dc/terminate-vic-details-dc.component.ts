import { Component, Input } from '@angular/core';
import { BankAccount } from '@gosi-ui/core';
import { TerminateContributorDetails, VicContributionDetails } from '../../../shared/models';

@Component({
  selector: 'cnt-terminate-vic-details-dc',
  templateUrl: './terminate-vic-details-dc.component.html',
  styleUrls: ['./terminate-vic-details-dc.component.scss']
})
export class TerminateVicDetailsDcComponent {
  @Input() vicTerminate: TerminateContributorDetails;
  @Input() vicContributionDetails: VicContributionDetails;
  @Input() bankDetails: BankAccount;
  @Input() lang: string;
  @Input() isPREligible: boolean;
}
