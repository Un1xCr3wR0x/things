/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { BilingualText, BankAccount, ApplicationTypeToken } from '@gosi-ui/core';
import { Establishment, EngagementDetails } from '../../../models';
import { ContractAuthConstant } from '../../../constants';

@Component({
  selector: 'cnt-preview-card-dc',
  templateUrl: './preview-card-dc.component.html',
  styleUrls: ['./preview-card-dc.component.scss']
})
export class PreviewCardDcComponent implements OnInit {
  @Input() activeEngagement: EngagementDetails;
  @Input() bankInfo: BankAccount;
  @Input() cardDetails;
  @Input() contractAtDraft;
  @Input() establishment: Establishment;
  @Input() personDetails;
  @Input() probationPeriodInDays;
  @Input() transportationAllowance;

  @Output() onEditClicked: EventEmitter<string> = new EventEmitter();

  contributorAbroadList: BilingualText[];
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}

  ngOnInit(): void {
    this.contributorAbroadList = [
      ContractAuthConstant.setBilingualText('Inside Saudi', 'داخل المملكة'),
      ContractAuthConstant.setBilingualText('Outside Saudi', 'خارج المملكة')
    ];
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
  /** Method to reach Edit page */
  navigateToTab(table) {
    this.onEditClicked.emit(table);
  }
  /** Method to get Number by probationary period */
  getNumberByPeriod(contractAtDraft, index) {
    if (contractAtDraft?.probationPeriodInDays && contractAtDraft?.probationPeriodInDays > 0) {
      return index;
    } else {
      return index - 1;
    }
  }
}
