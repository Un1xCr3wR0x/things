import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DocumentItem } from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  PersonalInformation,
  createDetailForm,
  bindQueryParamsToForm,
  isOccBenefit,
  ActiveBenefits,
  BenefitConstants,
  BenefitType
} from '../../../../shared';
import { BenefitRecalculationBaseScComponent } from '../../../base/benefit-recalculation-sc.base.component';

@Component({
  selector: 'bnt-benefit-recalculation-sc',
  templateUrl: './benefit-recalculation-sc.component.html',
  styleUrls: ['./benefit-recalculation-sc.component.scss']
})
export class BenefitRecalculationScComponent extends BenefitRecalculationBaseScComponent implements OnInit {
  documents: DocumentItem[];
  lang = 'en';
  personDetails: PersonalInformation;

  /**
   * ViewChild components
   */

  @ViewChild('cancelRecalculationTemplate', { static: true })
  cancelRecalculationTemplate: TemplateRef<HTMLElement>;

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
    this.showComments = true;
    this.getBenefits();
    this.getBenefitRecalculation(this.referenceNo);
    this.calculationModalTitle = { title1: 'BENEFITS.NEW-BENEFIT', title2: 'BENEFITS.CURRENT-BENEFIT' };
  }
  /**
   * Method to get benefit details
   */
  getBenefits() {
    this.manageBenefitService.getBenefitDetails(this.personId, this.requestId).subscribe(res => {
      this.benefitDetails = res;
      this.benefitType = this.benefitDetails.benefitType.english;
      this.isOccBenefit = isOccBenefit(this.benefitType);
      if (this.payload?.resource === 'Benefit Adjustment' && this.payload?.subResource === 'Engagement Change') {
        if (this.benefitDetails?.paymentDetails?.length) {
          if (this.benefitDetails?.paymentDetails[0]?.lastPaidDate)
            this.benefitDetails.paymentDetails[0].lastPaidDate = null;
          if (this.benefitDetails?.paymentDetails[0]?.totalPaidAmount)
            this.benefitDetails.paymentDetails[0].totalPaidAmount = null;
          if (this.benefitDetails.paymentDetails[0].paidMonths) {
            this.benefitDetails.paymentDetails[0].paidMonths = null;
          }
        }
        this.benefitDetails.nextPaymentDate = null;
        this.benefitDetails.totalPaidDependentAmount = null;
      }
    });
  }

  onViewBenefitDetails() {
    const data = new ActiveBenefits(
      this.socialInsuranceNo,
      this.requestId,
      this.benefitDetails.benefitType,
      this.referenceNo
    );
    this.coreBenefitService.setActiveBenefit(data);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
  }
  /** Method to show calculation details */
  howToCalculateRejoining(period) {
    this.benefitCalculationDetails = period;
    this.calculationModalTitle = { title1: 'BENEFITS.AFTER-RECALCULATION', title2: 'BENEFITS.BEFORE-RECALCULATION' };
    this.howToCalculate(null);
  }
}
