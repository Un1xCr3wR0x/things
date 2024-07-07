import { Component, OnInit } from '@angular/core';
import { BenefitRecalculationBaseScComponent } from '../../../base/benefit-recalculation-sc.base.component';
import {
  createDetailForm,
  RecalculationConstants,
  BenefitConstants,
  DirectPayment,
  BenefitRecalculation,
  ActiveBenefits,
  bindQueryParamsToForm
} from '../../../../shared';
import { Role } from '@gosi-ui/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'bnt-heir-recalculation-sc',
  templateUrl: './heir-recalculation-sc.component.html',
  styleUrls: ['./heir-recalculation-sc.component.scss']
})
export class HeirRecalculationScComponent extends BenefitRecalculationBaseScComponent implements OnInit {
  directPaymentArray: DirectPayment[] = [];
  paymentFormArray: FormArray;
  pensionToLumpsum = true;
  ngOnInit(): void {
    this.retirementForm = createDetailForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.retirementForm);
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.paymentFormArray = this.fb.array([]);
    this.initialiseView(this.routerData);
    this.getBenefits();
    this.getHeirBenefitRecalculation();
  }
  /** Method to get heir benefit recalculation details */
  getHeirBenefitRecalculation() {
    this.manageBenefitService
      .getBenefitRecalculation(this.personId, this.requestId)
      .subscribe((res: BenefitRecalculation) => {
        this.benefitRecalculationDetails = res;
        this.benefitRecalculationDetails.heirRecalculationDetails.netAdjustmentDetails.forEach(adjustment => {
          this.paymentFormArray.push(
            this.fb.group({
              personId: new FormControl(adjustment.personId),
              directPaymentStatus: new FormControl(adjustment.directPaymentStatus)
            })
          );
        });
      });
  }
  /** Method to navigate to benefit tab */
  navigateToBenefitTab(benefitDetails) {
    this.coreBenefitService.setActiveBenefit(
      new ActiveBenefits(
        benefitDetails?.sin,
        benefitDetails?.benefitRequestId,
        { english: benefitDetails?.benefitType, arabic: benefitDetails?.benefitType },
        this.referenceNo
      )
    );
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
  }
  /** Method to navigate to adjustment page */
  navigateToAdjustmentForHeir(personId) {
    this.adjustmentPaymentService.identifier = personId;
    this.adjustmentPaymentService.sin = this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], {
      queryParams: { from: RecalculationConstants.HeirRecalculation }
    });
  }
  /** Method to set direct payment request */
  setDirectPaymentRequest(directPaymentObj: DirectPayment) {
    const index = this.directPaymentArray.map(directObj => directObj.personId).indexOf(directPaymentObj.personId);
    if (index > -1) {
      this.directPaymentArray.splice(index, 1, directPaymentObj);
    } else {
      this.directPaymentArray.push(directPaymentObj);
    }
  }
  /** Method to approve heir benefit */
  approveHeirBenefit(approveForm) {
    if (this.payload.assignedRole === Role.VALIDATOR_1) {
      this.sanedBenefitService
        .editHeirDirectPayment(this.personId, this.requestId, true, {
          directPaymentStatusUpdate: this.directPaymentArray
        })
        .subscribe(
          () => {
            this.confirmApprove(approveForm);
          },
          err => {
            this.alertService.showError(err.error.message);
          }
        );
    } else {
      this.confirmApprove(approveForm);
    }
  }
}
