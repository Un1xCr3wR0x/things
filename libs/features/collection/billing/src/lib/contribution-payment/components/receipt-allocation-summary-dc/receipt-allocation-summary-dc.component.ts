import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { PaymentDetails, BranchDetails, CurrencyDetails, EstablishmentDetails } from '../../../shared/models';

@Component({
  selector: 'blg-receipt-allocation-summary-dc',
  templateUrl: './receipt-allocation-summary-dc.component.html',
  styleUrls: ['./receipt-allocation-summary-dc.component.scss']
})
export class ReceiptAllocationSummaryDcComponent implements OnChanges {
  /***
   * local variable
   */
  insideTotal = 0;
  outsideTotal = 0;
  total;
  establishmentInfo: Array<EstablishmentDetails>[] = [];
  insideAllocationFlag = false;
  /**
   *Input variable
   */
  @Input() receiptPaymentSummaryDetails: PaymentDetails;
  @Input() branchSummary: BranchDetails[];
  @Input() gccCurrency;
  @Input() gccFlag: boolean;
  @Input() mofFlag: boolean;
  @Input() currencyDetails: CurrencyDetails;
  @Input() establishmentValues: EstablishmentDetails;
  /**
   * create an instance of ReceiptAllocationSummaryDcComponent
   */
  constructor() {}
  /**
   * detect changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.receiptPaymentSummaryDetails && changes.receiptPaymentSummaryDetails.currentValue) {
      if (!this.mofFlag) {
        this.insideTotal = 0;
        this.outsideTotal = 0;
        this.findTotalAllocatedAmount();
      }
    }
    if (
      changes.establishmentValues &&
      changes.establishmentValues.currentValue &&
      !changes.establishmentValues.isFirstChange()
    ) {
      this.establishmentInfo.push(changes.establishmentValues.currentValue);
    }
  }

  /** Method to find total contribution amoount. */
  findTotalAllocatedAmount() {
    this.receiptPaymentSummaryDetails.branchAmount.forEach(item => {
      if (item.outsideGroup === false) {
        this.insideAllocationFlag = true;
        this.insideTotal += item.allocatedAmount.amount;
      } else {
        this.outsideTotal += item.allocatedAmount.amount;
      }
    });
  }
}
