import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PaymentDetails, CurrencyDetails } from '../../../../shared/models';
import { CurrencySar } from '@gosi-ui/core';
import { ReceiptApprovalStatus } from '../../../../shared/enums';
import { BillingConstants } from '../../../../shared/constants/billing-constants';

@Component({
  selector: 'blg-receive-payment-details-dc',
  templateUrl: './receive-payment-details-dc.component.html',
  styleUrls: ['./receive-payment-details-dc.component.scss']
})
export class ReceivePaymentDetailsDcComponent implements OnChanges {
  /** Local variables */
  isOtherBank = false;
  isLocalBank = false;
  isAmountFlag = false;
  otherCurrency = false;
  isCancelReceipt = false;
  penaltyLabel: string;
  /** Input variables */
  @Input() receipt: PaymentDetails;
  @Input() currencyDetails: CurrencyDetails;
  @Input() gccFlag: boolean;
  @Input() isMOF: boolean;
  establishmentType: string;
  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.receipt && changes.receipt.currentValue) this.setFlagsForView();
  }
  setFlagsForView() {
    if (this.receipt.receiptMode.english) {
      if (this.receipt.bank.name === null || this.receipt.bank.name.english === 'Other') {
        this.isOtherBank = true;
      }
      if (this.receipt.bank.type.english === 'Local Bank') {
        this.isLocalBank = true;
      }
    }
    if(this.receipt.mofIndicator === BillingConstants.MOF_GOSI_ESTABLISHMENT) {
      this.establishmentType = 'GOSI';
    }
    if(this.receipt.mofIndicator === BillingConstants.MOF_PPA_ESTABLISHMENT) this.establishmentType = 'PPA';
    if (this.receipt.amountReceived.amount) {
      this.isAmountFlag = true;
    }
    if (this.receipt.amountReceived.currency !== CurrencySar.ENGLISH) {
      this.otherCurrency = true;
    }
    if (this.receipt.status?.english === ReceiptApprovalStatus.TO_BE_CANCELLED) {
      this.isCancelReceipt = true;
      this.penaltyLabel = 'BILLING.CALCULATE-LATE-FEES';
    } else {
      this.isCancelReceipt = false;
      this.penaltyLabel = 'BILLING.REMOVE-LATE-FEES';
    }
  }
}
