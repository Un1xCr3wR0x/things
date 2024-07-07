import { Component, Input, OnInit } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { ContributorDetails } from '@gosi-ui/features/violations/lib/shared';
import { CreditRefundDetails, VicCreditRefundIbanDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-current-credit-balance-details-dc',
  templateUrl: './current-credit-balance-details-dc.component.html',
  styleUrls: ['./current-credit-balance-details-dc.component.scss']
})
export class CurrentCreditBalanceDetailsDcComponent implements OnInit {
  @Input() contributorDetails: ContributorDetails;
  @Input() CreditRefundDetails: CreditRefundDetails;
  @Input() fromPage: string;
  @Input() iscreditRefund: Boolean;
  @Input() bankName: BilingualText;
  @Input() vicCreditRefundIbanDetails: VicCreditRefundIbanDetails;
  constructor() {}

  ngOnInit(): void {}
}
