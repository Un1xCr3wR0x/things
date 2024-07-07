import { Component, Input } from '@angular/core';
import { MemberDetails } from '../../../../shared/models';

@Component({
  selector: 'mb-contract-details-dc',
  templateUrl: './contract-details-dc.component.html',
  styleUrls: ['./contract-details-dc.component.scss']
})
export class ContractDetailsDcComponent {
  /**Input variables */
  @Input() contractDetails: MemberDetails;
}
