/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeEnum, BenefitsGosiShowRolesConstants, Channel, RoleIdEnum, formatDate } from '@gosi-ui/core';
import {
  ActiveBenefits,
  AnnuityResponseDto,
  BenefitConstants,
  bindQueryParamsToForm,
  createDetailForm,
  createModalForm,
  ImprisonmentDetails,
  RecalculationConstants,
  UITransactionType
} from '../../../shared';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';

@Component({
  selector: 'bnt-validators-imprisonment-modify-sc',
  templateUrl: './validators-imprisonment-modify-sc.component.html',
  styleUrls: ['./validators-imprisonment-modify-sc.component.scss']
})
export class ValidatorsImprisonmentModifyScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  annuityBenefitDetails: AnnuityResponseDto;
  imprisonmentForm: FormGroup;
  imprisonmentFormModal: FormGroup;
  accessRole = [RoleIdEnum.FC, RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER];
  rejectAccess = [RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER];
  imprisonmentAdjustments: ImprisonmentDetails;
  Channel = Channel;
  isImprisonEdit = false; 
  ngOnInit(): void {
    this.isImprisonEdit = this.menuService.isUserEntitled(BenefitsGosiShowRolesConstants.VALIDATOR_ROLES);
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.imprisonmentForm = createDetailForm(this.fb);
    this.imprisonmentFormModal = createModalForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.imprisonmentForm);
    this.intialiseTheView(this.routerData);
    super.getRejectionReason(this.imprisonmentForm);
    if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
      this.getImprisonmentModifyDetails(this.socialInsuranceNo, this.requestId, this.referenceNo);
    }
    if (this.socialInsuranceNo && this.requestId) {
      this.getImprisonmentAdjustments(this.socialInsuranceNo, this.requestId);
    }
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
  /**
   * Approving by the validator.
   */
  confirmApproveLumpsum() {
    this.confirmApprove(this.imprisonmentForm);
  }
  /**
   * While rejecting from validator
   */
  confirmRejectLumpsum() {
    this.confirmReject(this.imprisonmentForm);
  }
  /**
   * when return to establishment action is performed, comments will be shared
   */
  returnLumpsum() {
    this.confirmReturn(this.imprisonmentForm);
  }
  /**
   * Method to fetch the Imprisonment details
   */
  getImprisonmentModifyDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.manageBenefitService.getAnnuityBenefitRequestDetail(sin, benefitRequestId, referenceNo).subscribe(
      res => {
        this.annuityBenefitDetails = res;
        // Story 345564 overlapping engmnt implementation 4.1.1
        if (this.annuityBenefitDetails?.hasOverlappingEngagements) {
          this.coreBenefitService.getOverlappedEngmt(this.annuityBenefitDetails?.contributorId).subscribe(
            res => {
              // if(res[0]?.inspectionTypeInfo?.status === 'Initiated'){
              //   this.disableApprove = true;
              // }
            },
            err => {
              this.showError(err);
            }
          );
        }
        this.fetchDocumentsForImprisonmentModify();
      },
      err => {
        this.showError(err);
      }
    );
  }
  /** method to fetch imprisonment details  */
  getImprisonmentAdjustments(socialInsuranceNo: number, requestId: number) {
    this.dependentService.getImprisonmentDetails(socialInsuranceNo, requestId).subscribe(
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
  /**to fetch documents */
  fetchDocumentsForImprisonmentModify() {
    this.transactionKey = UITransactionType.REQUEST_MODIFY_IMPRISONMENT_TRANSACTION;
    this.transactionType =
      this.channel === Channel.FIELD_OFFICE ? UITransactionType.FO_REQUEST_SANED : UITransactionType.GOL_REQUEST_SANED;
    this.getDocumentsForImprisonmentModify(
      this.transactionKey,
      this.transactionType,
      this.benefitRequestId,
      this.referenceNo
    );
  }

  getDocumentsForImprisonmentModify(
    transactionKey: string,
    transactionType: string,
    benefitRequestId: number,
    referenceNo: number
  ) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionKey, transactionType, referenceNo)
      .subscribe(res => {
        this.documentList = res;
      });
  }
  navigateToInjuryDetails() {
    this.router.navigate([
      `home/profile/contributor/${this.registrationNo}/${this.contributor.socialInsuranceNo}/info`
    ]);
  }
  navigateToPrevAdjustment() {
    this.adjustmentPaymentService.identifier = this.annuityBenefitDetails?.personId;
    this.adjustmentPaymentService.socialNumber = this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], {
      queryParams: { from: RecalculationConstants.IMPRISONMENT_MODIFY }
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
  /**
   *
   * This method is to perform cleanup activities when an instance of component is destroyed.
   * @memberof BaseComponent
   */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
