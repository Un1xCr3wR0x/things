import { Component, OnInit } from '@angular/core';
import { DocumentItem } from '@gosi-ui/core';
import { bindQueryParamsToForm, createDetailForm, isDocumentsValid } from '../../../shared';
import { BenefitRecalculationBaseComponent } from '../../../shared/component/base/benefit-recalculation.base.component';

@Component({
  selector: 'bnt-validator-disability-assessment-sc',
  templateUrl: './validator-disability-assessment-sc.component.html',
  styleUrls: ['./validator-disability-assessment-sc.component.scss']
})
export class ValidatorDisabilityAssessmentScComponent extends BenefitRecalculationBaseComponent implements OnInit {
  documents: DocumentItem[];
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
    this.getBenefitRecalculation();
    this.getTransactionDocuments();
  }

  getTransactionDocuments() {
    this.documentService.getAllDocuments(null, this.referenceNo).subscribe(docs => {
      this.reqList = docs;
      if (isDocumentsValid(this.reqList)) {
        this.documents = this.reqList;
      }
    });
  }
}
