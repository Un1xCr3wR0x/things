import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DebitCreditDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-account-details-dc',
  templateUrl: './account-details-dc.component.html',
  styleUrls: ['./account-details-dc.component.scss']
})
export class AccountDetailsDcComponent implements OnInit, OnChanges {
  @Input() accountDetails: DebitCreditDetails;
  totalAdjustmentCredit = 0;
  totalOhAdjcredit = 0;
  totalUiAdjcredit = 0;
  totalAnAdjcredit = 0;
  totalCurrentMonthCont = 0;
  totalPenalty = 0;
  totalAdjPenaltyDebit = 0;
  totalAdjContributionDebit = 0;
  totalDebit = 0;

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.accountDetails) this.accountDetails = changes.accountDetails.currentValue;
    this.totalAdjustmentCredit =
      this.accountDetails.TOTAL_CON_CREDIT_ADJ +
      this.accountDetails.TOTAL_FREE_PENALTY +
      this.accountDetails.VIOLATION_DEDUCTION_REFUND_CREDIT +
      this.accountDetails.INJURY_DEDUCTION_REFUND_CREDIT;

    this.totalOhAdjcredit = this.accountDetails.OHCONAMOUNT_CREDIT_ADJ + this.accountDetails.OHPENAMOUNT;

    this.totalUiAdjcredit = this.accountDetails.UICONAMOUNT_CREDIT_ADJ + this.accountDetails.UIPENAMOUNT;

    this.totalAnAdjcredit = this.accountDetails.ANNCONAMOUNT_CREDIT_ADJ + this.accountDetails.ANNPENAMOUNT;

    this.totalCurrentMonthCont =
      this.accountDetails.CURRNT_CON_OH + this.accountDetails.CURRNT_CON_UI + this.accountDetails.CURRNT_CON_ANN;

    this.totalPenalty =
      this.accountDetails.CURRNT_PEN_OH + this.accountDetails.CURRNT_PEN_UI + this.accountDetails.CURRNT_PEN_ANN;

    this.totalAdjContributionDebit =
      this.accountDetails.CURRNT_ADJ_OH + this.accountDetails.CURRNT_ADJ_UI + this.accountDetails.CURRNT_ADJ_ANN;

    this.totalAdjPenaltyDebit =
      this.accountDetails.CURRNT_ADJPEN_OH +
      this.accountDetails.CURRNT_ADJPEN_UI +
      this.accountDetails.CURRNT_ADJPEN_ANN;

    this.totalDebit =
      this.totalCurrentMonthCont +
      this.totalPenalty +
      this.totalAdjContributionDebit +
      this.totalAdjPenaltyDebit +
      this.accountDetails.VIOLATIONS +
      this.accountDetails.REJECTED_OH;
  }
}
