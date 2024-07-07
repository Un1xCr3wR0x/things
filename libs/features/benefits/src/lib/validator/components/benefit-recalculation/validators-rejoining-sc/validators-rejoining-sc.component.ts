import { Component, OnInit } from '@angular/core';
import { DocumentItem } from '@gosi-ui/core';
import { BenefitRecalculationBaseScComponent } from '../../../base/benefit-recalculation-sc.base.component';
import { createDetailForm, bindQueryParamsToForm } from '../../../../shared';

@Component({
  selector: 'bnt-validators-rejoining-sc',
  templateUrl: './validators-rejoining-sc.component.html',
  styleUrls: ['./validators-rejoining-sc.component.scss']
})
export class ValidatorsRejoiningScComponent extends BenefitRecalculationBaseScComponent implements OnInit {
  isDocuments = false;
  documents: DocumentItem[];
  payload;
  transactionNumber;

  ngOnInit(): void {
    this.retirementForm = createDetailForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.retirementForm);
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.payForm = this.fb.group({
      checkBoxFlag: [false]
    });
    this.initialiseView(this.routerData);
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
