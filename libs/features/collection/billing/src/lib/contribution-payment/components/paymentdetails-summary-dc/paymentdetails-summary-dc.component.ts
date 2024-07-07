import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { PaymentDetails, BranchDetails, CurrencyDetails, EstablishmentDetails } from '../../../shared/models';
import { NationalityTypeEnum } from '@gosi-ui/core';

@Component({
  selector: 'blg-paymentdetails-summary-dc',
  templateUrl: './paymentdetails-summary-dc.component.html',
  styleUrls: ['./paymentdetails-summary-dc.component.scss']
})
export class PaymentdetailsSummaryDcComponent implements OnChanges {
  /**
   * Local Variable
   */
  isOtherBank: boolean;
  isLocalBank: boolean;
  countryFlag = false;
  internationalFlag = false;

  /**
   * Input variable
   */

  @Input() establishmentDetails: EstablishmentDetails;
  @Input() successMessage: string;
  @Input() receiptPaymentSummaryDetails: PaymentDetails;
  @Input() branchSummary: BranchDetails[];
  @Input() currencyDetails: CurrencyDetails;
  @Input() gccFlag: boolean;
  @Input() gccCurrency;
  @Input() mofFlag: boolean;
  @Input() establishmentValues = [];

  /**
   * Creates an instance of PaymentDetailsSummaryDcComponent.
   */
  constructor() {}

  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.receiptPaymentSummaryDetails && changes.receiptPaymentSummaryDetails.currentValue) {
      this.receiptPaymentSummaryDetails = changes.receiptPaymentSummaryDetails.currentValue;
      this.setFlagsForView();
      if (this.receiptPaymentSummaryDetails.bank.country.english === NationalityTypeEnum.SAUDI_NATIONAL) {
        this.countryFlag = true;
      }
      if (
        this.receiptPaymentSummaryDetails.bank.nonListedBank !== null &&
        this.receiptPaymentSummaryDetails.bank.type.english !== 'GCC Bank'
      ) {
        this.internationalFlag = true;
        this.countryFlag = false;
      } else {
        this.internationalFlag = false;
      }
    }
    if (changes && changes?.currencyDetails?.currentValue) {
      this.currencyDetails = changes?.currencyDetails?.currentValue;
    }
  }

  /** Method to set flags for view. */
  setFlagsForView() {
    if (this.receiptPaymentSummaryDetails.receiptMode.english) {
      if (
        this.receiptPaymentSummaryDetails.bank.name === null ||
        this.receiptPaymentSummaryDetails.bank.name.english === 'Other'
      ) {
        this.isOtherBank = true;
      }
      if (this.receiptPaymentSummaryDetails.bank.type.english === 'Local Bank') {
        this.isLocalBank = true;
      }
    }
  }
}
