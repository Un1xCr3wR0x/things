import { Component, OnInit } from '@angular/core';
import { DocumentItem } from '@gosi-ui/core';
import { bindQueryParamsToForm, createDetailForm } from '../../../shared';
import { BenefitRecalculationBaseComponent } from '../../../shared/component/base/benefit-recalculation.base.component';

@Component({
  selector: 'bnt-validator-benefit-recalculation-sc',
  templateUrl: './validator-benefit-recalculation-sc.component.html',
  styleUrls: ['./validator-benefit-recalculation-sc.component.scss']
})
export class ValidatorBenefitRecalculationScComponent extends BenefitRecalculationBaseComponent implements OnInit {
  documents: DocumentItem[];
  lang = 'en';

  ngOnInit(): void {
    this.retirementForm = createDetailForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.retirementForm);
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.initialiseView(this.routerData);
    this.calculationModalTitle = { title1: 'BENEFITS.NEW-BENEFIT', title2: 'BENEFITS.CURRENT-BENEFIT' };
  }
}
