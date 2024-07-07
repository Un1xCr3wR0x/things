import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '@gosi-ui/core';
import { BenefitConstants, RecalculationConstants } from '../../../constants';
import { RecalculationTypes } from '../../../enum';
import { DisabilityAssessmentDetails } from '../../../models';
import { BenefitRecalculationBaseComponent } from '../../base/benefit-recalculation.base.component';

@Component({
  selector: 'bnt-disability-assessment-details-sc',
  templateUrl: './disability-assessment-details-sc.component.html',
  styleUrls: ['./disability-assessment-details-sc.component.scss']
})
export class DisabilityAssessmentDetailsScComponent extends BenefitRecalculationBaseComponent implements OnInit {
  @Input() isTransactionScreen = false;
  @Input() transaction: Transaction;
  @Input() payForm;

  pensionToLumpsum = false;
  disabilityAssessmentData: DisabilityAssessmentDetails;
  readonly recalculationConstants = RecalculationConstants;

  ngOnInit(): void {
    if (this.isTransactionScreen) {
      this.setInitialValues(this.transaction);
    } else {
      this.initialiseView(this.routerData);
    }
    this.getRecalculationReason(this.transaction?.title?.english);
    this.getBenefits();
    this.getBenefitRecalculation(this.referenceNo);
  }

  setInitialValues(transaction: Transaction) {
    if (transaction) {
      this.personId = transaction.params.SIN;
      this.requestId = transaction.params.BENEFIT_REQUEST_ID;
      this.socialInsuranceNo = transaction.params.SIN;
      this.nin = transaction.params.NIN;
      this.contributorService.personId = this.personId;
    }
  }

  getRecalculationReason(title: string) {
    const transactionTitle = title?.trim().toLocaleUpperCase();
    if (transactionTitle === String('Disability Decision Change Benefit Adjustments').trim().toUpperCase()) {
      this.benefitRecalculationReason = RecalculationTypes.DECISION_CHANGE;
    }
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
  onViewBenefitDetails() {
    this.routerData.stopNavigationToValidator = true;
    this.contributorService.selectedSIN = this.socialInsuranceNo;
    this.coreBenefitService.setFromRecalculation(true);
    this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.socialInsuranceNo)], {
      state: { loadPageWithLabel: 'BENEFITS' }
    });
  }
}
// this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.socialInsuranceNo)]);
