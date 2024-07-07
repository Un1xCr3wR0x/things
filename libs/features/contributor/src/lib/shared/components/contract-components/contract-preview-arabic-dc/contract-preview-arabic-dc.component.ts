import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { BilingualText, BankAccount, ApplicationTypeToken, CommonIdentity, getIdentityByType } from '@gosi-ui/core';
import { Establishment, EngagementDetails } from '../../../models';
import { ContractAuthConstant } from '../../../constants';

@Component({
  selector: 'cnt-contract-preview-arabic-dc',
  templateUrl: './contract-preview-arabic-dc.component.html',
  styleUrls: ['./contract-preview-arabic-dc.component.scss']
})
export class ContractPreviewArabicDcComponent implements OnInit {
  @Input() activeEngagement: EngagementDetails;
  @Input() bankInfo: BankAccount;
  @Input() cardDetails;
  @Input() contractAtDraft;
  @Input() establishment: Establishment;
  @Input() personDetails;
  @Input() probationPeriodInDays;
  @Input() transportationAllowance;
  @Input() section;

  contributorAbroadList: BilingualText[];
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}

  ngOnInit(): void {
    this.contributorAbroadList = [
      ContractAuthConstant.setBilingualText('Inside Saudi', 'داخل المملكة'),
      ContractAuthConstant.setBilingualText('Outside Saudi', 'خارج المملكة')
    ];
  }
  /**Method to fetch person identity*/
  getPersonIdentity(personDetails): CommonIdentity {
    return getIdentityByType(personDetails?.person?.identity, personDetails?.person?.nationality?.english);
  }
  /** Method to return national address
   * @param addresses
   */
  getNationalAddress(addresses) {
    if (addresses && addresses.length > 0) {
      const national = addresses.filter(address => address['type'] === 'NATIONAL');
      if (national.length > 0) {
        return national[0];
      }
    }
  }
}
