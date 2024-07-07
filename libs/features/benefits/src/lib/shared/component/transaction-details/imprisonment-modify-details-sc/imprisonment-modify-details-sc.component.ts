import { Component, Input, OnInit } from '@angular/core';
import { BenefitsGosiShowRolesConstants, RouterData } from '@gosi-ui/core';
import { BenefitConstants, RecalculationConstants } from '../../../constants';
import { ActiveBenefits, ImprisonmentDetails } from '../../../models';
import { TransactionPensionBase } from '../../base/transaction-pension.base';

@Component({
  selector: 'bnt-imprisonment-modify-details-sc',
  templateUrl: './imprisonment-modify-details-sc.component.html',
  styleUrls: ['./imprisonment-modify-details-sc.component.scss']
})
export class ImprisonmentModifyDetailsScComponent extends TransactionPensionBase implements OnInit {
  imprisonmentAdjustments: ImprisonmentDetails;
  isImprisonEdit = false;
  /** Input Variables */

  @Input() lang = 'en';
  @Input() socialInsuranceNo: number;
  @Input() requestId: number;
  @Input() referenceNo: number;
  @Input() isTransactionScreen = false;
  @Input() isRejectedTransaction = false;
  @Input() routerData: RouterData;

  ngOnInit(): void {
    this.isImprisonEdit = this.menuService.isUserEntitled(BenefitsGosiShowRolesConstants.VALIDATOR_ROLES);
    if (!this.isTransactionScreen) {
      this.setRouterDataValues(this.routerData);
    }
    if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
      this.getImprisonmentModifyDetails(this.isIndividualApp ? this.authTokenService.getIndividual() : this.socialInsuranceNo, this.requestId, this.referenceNo);
    }
    if (this.socialInsuranceNo && this.requestId) {
      this.getImprisonmentAdjustments(this.isIndividualApp ? this.authTokenService.getIndividual() : this.socialInsuranceNo, this.requestId, this.referenceNo);
    }
  }

  /**
   * Method to fetch the Imprisonment details
   */
  getImprisonmentModifyDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.manageBenefitService.getAnnuityBenefitRequestDetail(sin, benefitRequestId, referenceNo).subscribe(
      res => {
        this.annuityBenefitDetails = res;
      },
      err => {
        this.showError(err);
      }
    );
  }
  /** method to fetch imprisonment details  */
  getImprisonmentAdjustments(socialInsuranceNo: number, requestId: number, referenceNo?: number) {
    this.dependentService.getImprisonmentDetails(socialInsuranceNo, requestId, referenceNo).subscribe(
      res => {
        if (res) {
          this.imprisonmentAdjustments = res;
        }
      },
      err => {
        this.showError(err);
      }
    );
  }

  navigateToImprisonmentEdit() {
    this.routerData.tabIndicator = 2;
    this.routerData.selectWizard = BenefitConstants.UI_DOCUMENTS;
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_IMPRISONMENT_DETAILS], {
      queryParams: {
        edit: true
      }
    });
  }

  onViewBenefitDetails() {
    const data = new ActiveBenefits(
      this.socialInsuranceNo,
      this.requestId,
      this.annuityBenefitDetails?.benefitType,
      this.referenceNo
    );
    this.coreBenefitService.setActiveBenefit(data);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
  }

  navigateToPrevAdjustment() {
    this.adjustmentPaymentService.identifier = this.annuityBenefitDetails?.personId;
    this.adjustmentPaymentService.socialNumber = this.isIndividualApp ? this.authTokenService.getIndividual() : this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], {
      queryParams: { from: RecalculationConstants.IMPRISONMENT_MODIFY }
    });
  }
}
