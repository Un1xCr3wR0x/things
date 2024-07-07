import { Component, Input, OnInit } from '@angular/core';
import { BenefitRecalculationBaseComponent } from '../../base/benefit-recalculation.base.component';

@Component({
  selector: 'bnt-rejoining-details-sc',
  templateUrl: './rejoining-details-sc.component.html',
  styleUrls: ['./rejoining-details-sc.component.scss']
})
export class RejoiningDetailsScComponent extends BenefitRecalculationBaseComponent implements OnInit {
  @Input() personId: number;
  @Input() requestId: number;
  @Input() referenceNo: number;

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.payForm = this.fb.group({
      checkBoxFlag: [false]
    });

    
    this.getBenefits();
    this.getBenefitRecalculation();
  }

  /** Method to show calculation details */
  howToCalculateRejoining(period) {
    this.benefitCalculationDetails = period;
    this.calculationModalTitle = { title1: 'BENEFITS.AFTER-RECALCULATION', title2: 'BENEFITS.BEFORE-RECALCULATION' };
    this.howToCalculate(null);
  }
  /** Method to navigate to EngagementDetails */
  navigateToEngagementDetails() {}
}
