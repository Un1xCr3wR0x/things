import { Component, OnInit } from '@angular/core';
import {
  DisabilityAssessmentDetails,
  RecalculationConstants,
  createDetailForm,
  bindQueryParamsToForm,
  BenefitConstants
} from '../../../../shared';
import { BenefitRecalculationBaseScComponent } from '../../../base/benefit-recalculation-sc.base.component';
import { CoreActiveBenefits } from '@gosi-ui/core';

@Component({
  selector: 'bnt-disability-assessment-sc',
  templateUrl: './disability-assessment-sc.component.html',
  styleUrls: ['./disability-assessment-sc.component.scss']
})
export class DisabilityAssessmentScComponent extends BenefitRecalculationBaseScComponent implements OnInit {
  pensionToLumpsum = false;
  disabilityAssessmentData: DisabilityAssessmentDetails;
  readonly recalculationConstants = RecalculationConstants;

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
  viewInjuryDetails(injuryId) {
    this.ohService.setRegistrationNo(this.benefitDetails?.injuryEstablishmentRegNo);
    // this.ohService.setInjuryNumber(this.injuryNumber);
    this.ohService.setInjuryId(injuryId);
    this.ohService.setComplicationId(this.benefitDetails?.complicationId);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    if (this.benefitDetails?.complicationId) {
      this.router.navigate([
        `/home/oh/view/${this.benefitDetails?.injuryEstablishmentRegNo}/${this.socialInsuranceNo}/${injuryId}/${this.benefitDetails?.complicationId}/complication/info`
      ]);
    } else {
      this.router.navigate(
        [
          `home/oh/view/${this.benefitDetails?.injuryEstablishmentRegNo}/${this.socialInsuranceNo}/${injuryId}/injury/info`
        ],
        { state: { navigatedFrom: this.router.url } }
      );
    }
    this.alertService.clearAlerts();
  }
}
