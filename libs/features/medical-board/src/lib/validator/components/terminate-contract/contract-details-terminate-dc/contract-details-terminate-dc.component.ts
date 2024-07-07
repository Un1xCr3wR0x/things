import { Component, Input } from '@angular/core';
import { MemberDetails } from '../../../../shared/models';

@Component({
  selector: 'mb-contract-details-terminate-dc',
  templateUrl: './contract-details-terminate-dc.component.html',
  styleUrls: ['./contract-details-terminate-dc.component.scss']
})
export class ContractDetailsTerminateDcComponent {
  /**Input variables */
  @Input() contractDetails: MemberDetails;
}
