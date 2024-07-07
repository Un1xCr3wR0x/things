import { Component, OnInit } from '@angular/core';
import { DocumentItem } from '@gosi-ui/core';
import { bindQueryParamsToForm, createDetailForm } from '../../../shared';
import { BenefitRecalculationBaseComponent } from '../../../shared/component/base/benefit-recalculation.base.component';

@Component({
  selector: 'bnt-validator-rejoining-sc',
  templateUrl: './validator-rejoining-sc.component.html',
  styleUrls: ['./validator-rejoining-sc.component.scss']
})
export class ValidatorRejoiningScComponent extends BenefitRecalculationBaseComponent implements OnInit {
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
    this.initialiseView(this.routerData);
  }
}
