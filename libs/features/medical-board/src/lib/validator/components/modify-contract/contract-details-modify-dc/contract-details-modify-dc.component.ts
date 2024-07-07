import { Component, Input } from '@angular/core';
import { MemberDetails } from '../../../../shared/models';
import { checkBilingualTextNull } from '@gosi-ui/core';

@Component({
  selector: 'mb-contract-details-modify-dc',
  templateUrl: './contract-details-modify-dc.component.html',
  styleUrls: ['./contract-details-modify-dc.component.scss']
})
export class ContractDetailsModifyDcComponent {
  /**Input variables */
  @Input() contractDetails: MemberDetails;
}
