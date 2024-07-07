import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DebitCreditDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-allocation-details-dc',
  templateUrl: './allocation-details-dc.component.html',
  styleUrls: ['./allocation-details-dc.component.scss']
})
export class AllocationDetailsDcComponent implements OnInit, OnChanges {
  @Input() allocationValues: DebitCreditDetails;
  totalValue: number;
  totalAdjustmentCredit = 0;
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.allocationValues) {
      this.allocationValues = changes.allocationValues.currentValue;
      if (this.allocationValues) {
        this.totalAdjustmentCredit =
          this.allocationValues.TOTAL_CON_CREDIT_ADJ +
          this.allocationValues.TOTAL_FREE_PENALTY +
          this.allocationValues.VIOLATION_DEDUCTION_REFUND_CREDIT +
          this.allocationValues.INJURY_DEDUCTION_REFUND_CREDIT;

        this.totalValue =
          (this.allocationValues.OPENINGBALANCECREDIT ? this.allocationValues.OPENINGBALANCECREDIT : 0) +
          (this.totalAdjustmentCredit ? this.totalAdjustmentCredit : 0) +
          (this.allocationValues.TRANSFERCREDIT ? this.allocationValues.TRANSFERCREDIT : 0) +
          (this.allocationValues.TOTALRECEIPTS ? this.allocationValues.TOTALRECEIPTS : 0);

        this.totalAdjustmentCredit =
          this.allocationValues.TOTAL_CON_CREDIT_ADJ +
          this.allocationValues.TOTAL_FREE_PENALTY +
          this.allocationValues.VIOLATION_DEDUCTION_REFUND_CREDIT +
          this.allocationValues.INJURY_DEDUCTION_REFUND_CREDIT;
      }
    }
  }
}
