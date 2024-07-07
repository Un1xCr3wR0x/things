/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit } from '@angular/core';
import { BenefitConstants, InjuryDetails } from '../../shared';
import { PensionBaseComponent } from '../base/pension.base-component';
import { ApplicationTypeEnum } from '@gosi-ui/core/lib/enums/application-type';
import { InjuryWrapper } from '@gosi-ui/features/occupational-hazard/lib/shared/models/injury-wrapper';

@Component({
  selector: 'bnt-injury-details-sc',
  templateUrl: './injury-details-sc.component.html',
  styleUrls: ['./injury-details-sc.component.scss']
})
export class InjuryDetailsScComponent extends PensionBaseComponent implements OnInit {
  lang = 'en';
  injuryDetails: InjuryDetails[];
  injurySummary: InjuryWrapper = new InjuryWrapper();
  injuryId: number;
  ngOnInit(): void {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.acitveBenefit = this.coreBenefitService.getSavedActiveBenefit();
    this.injuryId = this.coreBenefitService.getInjuryId();
    if (this.acitveBenefit) {
      this.sin = this.isIndividualApp ? this.authTokenService.getIndividual() : this.acitveBenefit.sin;
      this.benefitRequestId = this.acitveBenefit.benefitRequestId;
      this.benefitType = this.acitveBenefit.benefitType.english;
    }
    this.getInjuryAssessment(this.sin, this.benefitRequestId);
    this.getInjurySummary();
  }

  routeBack() {
    this.location.back();
  }

  getDisabilityDetails() {
    this.injuryService.getInjuryDetails().subscribe(res => {
      this.injuryDetails = [];
      this.injuryDetails.push(res);
    });
  }
  getInjurySummary() {
    this.injuryService.getInjurySummary(this.sin, this.injuryId).subscribe(res => {
      this.injurySummary = res;
    });
  }
  onAccept(assessmentId: number) {
    this.bypassReaassessmentService.accceptMedicalAssessment(this.sin, this.benefitRequestId, assessmentId).subscribe(
      res => {
        this.benefitResponse = res;
        this.router.navigate([BenefitConstants.ROUTE_ASSESSMENT_DISPLAY], {
          queryParams: {
            assessmentId: assessmentId
          }
        });
      },
      err => this.alertService.showError(err.error.message)
    );
  }
}
