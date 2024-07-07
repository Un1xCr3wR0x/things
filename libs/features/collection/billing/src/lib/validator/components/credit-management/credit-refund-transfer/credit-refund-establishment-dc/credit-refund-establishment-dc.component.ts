/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BilingualText, getArabicName, LanguageToken, scrollToTop } from '@gosi-ui/core';
import { VicContributorDetails } from '@gosi-ui/features/collection/billing/lib/shared/models/vic-contributor-details';
import { BehaviorSubject } from 'rxjs';
import {
  EstablishmentDetails,
  CreditBalanceDetails,
  VicCreditRefundIbanDetails,
  CreditRefundDetails
} from '../../../../../shared/models';

@Component({
  selector: 'blg-credit-refund-establishment-dc',
  templateUrl: './credit-refund-establishment-dc.component.html',
  styleUrls: ['./credit-refund-establishment-dc.component.scss']
})
export class CreditRefundEstablishmentDcComponent implements OnInit, OnChanges {
  //Local Variable
  iban: string;
  lang = 'en';
  arabicName = '';
  contributorStatus: string;
  vicAccountNo: string;
  vicBankName: BilingualText;
  // Input Variables
  @Input() establishmentDetails: EstablishmentDetails;
  @Input() creditBalanceDetails: CreditBalanceDetails;
  @Input() editFlag: boolean;
  @Input() CreditRefundDetails: CreditRefundDetails;
  @Input() contributorDetails: VicContributorDetails;
  @Input() vicCreditRefundIbanDetails: VicCreditRefundIbanDetails;
  @Input() fromPage: string;
  @Input() iscreditRefund: Boolean;
  @Input() bankName: BilingualText;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /** Initializes the component. */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });

    scrollToTop();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.establishmentDetails?.currentValue) {
      this.establishmentDetails = changes?.establishmentDetails?.currentValue;
    }
    if (changes && changes.CreditRefundDetails && changes.CreditRefundDetails.currentValue) {
      this.CreditRefundDetails = changes?.CreditRefundDetails?.currentValue;
      this.iban = this.CreditRefundDetails?.iban;
    }

    if (changes?.contributorDetails?.currentValue) {
      this.contributorDetails = changes?.contributorDetails?.currentValue;
      this.contributorStatus = this.contributorDetails.statusType ? 'BILLING.ACTIVE' : 'BILLING.INACTIVE';
      this.arabicName = getArabicName(changes.contributorDetails?.currentValue?.person?.name.arabic);
    }
    if (changes?.vicCreditRefundIbanDetails?.currentValue) {
      this.vicCreditRefundIbanDetails = changes?.vicCreditRefundIbanDetails?.currentValue;
      this.vicCreditRefundIbanDetails.bankAccountList.forEach(res => {
        this.vicAccountNo = res.ibanBankAccountNo;
        this.vicBankName = res.bankName;
      });
    }
  }
}
