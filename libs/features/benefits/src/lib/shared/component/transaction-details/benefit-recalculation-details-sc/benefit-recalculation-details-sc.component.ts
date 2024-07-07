import { Component, Input, OnInit } from '@angular/core';
import { Transaction, TransactionStatus } from '@gosi-ui/core';

import { ActiveBenefits } from '../../../models';
import { BenefitConstants } from '../../../constants';
import { BenefitRecalculationBaseComponent } from '../../base/benefit-recalculation.base.component';
import { FormGroup } from '@angular/forms';
import { RecalculationTypes } from '../../../enum';

@Component({
  selector: 'bnt-benefit-recalculation-details-sc',
  templateUrl: './benefit-recalculation-details-sc.component.html',
  styleUrls: ['./benefit-recalculation-details-sc.component.scss']
})
export class BenefitRecalculationDetailsScComponent extends BenefitRecalculationBaseComponent implements OnInit {
  payForm: FormGroup;
  isTransactionCompleted = false;

  /** Input Variables */
  @Input() transaction: Transaction;
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
    this.isTransactionCompleted = this.transaction?.status?.english.toUpperCase() === TransactionStatus.COMPLETED;
    //this.initialiseView(this.routerData);
    this.getRecalculationReason(this.transaction?.title?.english);
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
      if (this.benefitDetails && this.transaction?.transactionId === 302026) {
        if (this.benefitDetails?.paymentDetails?.length) {
          if (this.benefitDetails?.paymentDetails[0]?.lastPaidDate)
            this.benefitDetails.paymentDetails[0].lastPaidDate = null;
          if (this.benefitDetails?.paymentDetails[0]?.totalPaidAmount)
            this.benefitDetails.paymentDetails[0].totalPaidAmount = null;
          if (this.benefitDetails.paymentDetails[0]?.paidMonths)
            this.benefitDetails.paymentDetails[0].paidMonths = null;
        }
        this.benefitDetails.nextPaymentDate = null;
        this.benefitDetails.totalPaidDependentAmount = null;
      }
    });
  }
  getRecalculationReason(title: string) {
    const transactionTitle = title.trim().toLocaleUpperCase();
    if (transactionTitle === String('Benefit Recalculation due to Engagement Change').trim().toUpperCase()) {
      this.benefitRecalculationReason = RecalculationTypes.ENGAGEMENT_CHANGE;
    }
    if (transactionTitle === String('Benefit Recalculation due to Disability Decision Change').trim().toUpperCase()) {
      this.benefitRecalculationReason = RecalculationTypes.DECISION_CHANGE;
    }
  }
  viewMaintainAdjustment(benefitParam) {
    this.adjustmentPaymentService.identifier = this.benefitDetails?.personId;
    this.adjustmentPaymentService.sin = this.transaction?.params?.SIN;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], { queryParams: { from: benefitParam } });
  }
  onViewBenefitDetails() {
    const data = new ActiveBenefits(this.personId, this.requestId, this.benefitDetails.benefitType, this.referenceNo);
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
