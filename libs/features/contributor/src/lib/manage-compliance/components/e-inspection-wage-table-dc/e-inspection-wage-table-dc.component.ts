import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'cnt-e-inspection-wage-table-dc',
  templateUrl: './e-inspection-wage-table-dc.component.html',
  styleUrls: ['./e-inspection-wage-table-dc.component.scss']
})
export class EInspectionWageTableDcComponent implements OnChanges {
  totalWage: number;
  @Input() violationDetails;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.violationDetails?.currentValue) {
      this.totalWage =
        this.violationDetails.wage.basicWage +
        this.violationDetails.wage.commission +
        this.violationDetails.wage.housingBenefit +
        this.violationDetails.wage.otherAllowance;
    }
  }
}
