import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BilingualText, LanguageToken, scrollToTop } from '@gosi-ui/core';
import { ContributorDetails } from '@gosi-ui/features/violations/lib/shared';
import { BehaviorSubject } from 'rxjs';
import { CreditRefundDetails, VicCreditRefundIbanDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-credit-refund-details-dc',
  templateUrl: './credit-refund-details-dc.component.html',
  styleUrls: ['./credit-refund-details-dc.component.scss']
})
export class CreditRefundDetailsDcComponent implements OnInit, OnChanges {
  @Input() contributorDetails: ContributorDetails;
  @Input() CreditRefundDetails: CreditRefundDetails;
  @Input() fromPage: string;
  @Input() iscreditRefund: Boolean;
  @Input() bankName: BilingualText;
  @Input() vicCreditRefundIbanDetails: VicCreditRefundIbanDetails;

  lang = 'en';
  iban: string;
  vicAccountNo: string;
  vicBankName: BilingualText;

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });

    scrollToTop();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.CreditRefundDetails && changes.CreditRefundDetails.currentValue) {
      this.CreditRefundDetails = changes?.CreditRefundDetails?.currentValue;
      this.iban = this.CreditRefundDetails?.iban;
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
