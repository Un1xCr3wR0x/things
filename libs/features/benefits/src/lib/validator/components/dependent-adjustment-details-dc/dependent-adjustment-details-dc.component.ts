import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'bnt-dependent-adjustment-details-dc',
  templateUrl: './dependent-adjustment-details-dc.component.html',
  styleUrls: ['./dependent-adjustment-details-dc.component.scss']
})
export class DependentAdjustmentDetailsDcComponent implements OnInit, OnChanges {
  @Input() adjustmentDetails: any;
  @Input() lang = 'en';
  readonly Math = Math;
  adjustments = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.adjustmentDetails?.currentValue) {
      this.adjustmentDetails = changes?.adjustmentDetails?.currentValue;
      this.setAdjustments();
    }
  }

  setAdjustments() {
    this.adjustmentDetails.reCalculationDetails.forEach(calculation => {
      if (calculation?.adjustmentCalculationDetails?.length > 0) {
        calculation?.adjustmentCalculationDetails?.forEach(adjustment => {
          this.adjustments.push(adjustment);
        });
      }
    });
  }

  showAdjustmentDate(eachAdjustment) {
    return (
      eachAdjustment?.adjustmentStartDate?.hijiri ||
      eachAdjustment?.adjustmentStartDate?.gregorian ||
      eachAdjustment?.adjustmentEndDate?.hijiri ||
      eachAdjustment?.adjustmentEndDate?.gregorian
    );
  }
}
