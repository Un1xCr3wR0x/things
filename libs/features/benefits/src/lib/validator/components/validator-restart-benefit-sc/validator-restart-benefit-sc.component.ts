/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ApplicationTypeEnum,
  Channel,
  checkIqamaOrBorderOrPassport,
  CommonIdentity,
  Role,
  formatDate
} from '@gosi-ui/core';
import { BreadcrumbDcComponent } from '@gosi-ui/foundation-theme/src';
import {
  BenefitConstants,
  BenefitType,
  bindQueryParamsToForm,
  createDetailForm,
  getIdentityLabel,
  HoldBenefitDetails,
  RecalculationConstants
} from '../../../shared';
import { ActiveBenefits, BenefitDetails, Contributor, RestartBenefitHeading } from '../../../shared/models';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';

@Component({
  selector: 'bnt-validator-restart-benefit-sc',
  templateUrl: './validator-restart-benefit-sc.component.html',
  styleUrls: ['./validator-restart-benefit-sc.component.scss']
})
export class ValidatorRestartBenefitScComponent extends ValidatorBaseScComponent implements OnInit {
  /**
   * Local Variables
   */
  checkForm: FormGroup;
  restartDetails: HoldBenefitDetails;
  restartCalculations: HoldBenefitDetails;
  stopBenefitType: string;
  restartHeading: string;
  restartTransactionType: string;
  readMore = false;
  iscolsix = true;
  showMoreText = 'BENEFITS.READ-FULL-NOTE';
  limitvalue: number;
  limit = 100;
  contributorDetails: Contributor;
  identity: CommonIdentity | null;
  directDisabled: boolean;
  checkBenefitType = BenefitType.restartbenefit;
  benefitCalculation: BenefitDetails;
  Channel = Channel;

  @ViewChild('brdcmb', { static: false })
  RestartBenefitBrdcmb: BreadcrumbDcComponent;
  identityLabel = ' ';
  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.limitvalue = this.limit;
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.checkForm = this.fb.group({
      checkBoxFlag: [false]
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.retirementForm = createDetailForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.retirementForm);
    this.intialiseTheView(this.routerData);
    if (
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1 ||
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_2
    ) {
      this.directDisabled = false;
    } else if (
      this.routerData.assignedRole === this.rolesEnum.FC_APPROVER ||
      this.routerData.assignedRole === this.rolesEnum.FC_CONTROLLER ||
      this.routerData.assignedRole === this.rolesEnum.CNT_FC_APPROVER ||
      this.routerData.assignedRole === 'FC Approver'
    ) {
      this.directDisabled = true;
    }
    super.getRejectionReason(this.retirementForm);
    if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
      this.getRestartBenefitDetails(this.socialInsuranceNo, this.requestId, this.referenceNo);
      this.getRestartCalcDetails();
      this.getBenefitCalculationDetails(this.socialInsuranceNo, this.requestId);
    }
  }
  // fetch stop benefit details
  getRestartBenefitDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.modifyBenefitService.getRestartDetails(sin, benefitRequestId, referenceNo).subscribe(
      res => {
        this.restartDetails = res;
        if(this.restartDetails?.modifyPayee?.bankAccount?.disableApprove) {
          this.disableApprove = this.restartDetails?.modifyPayee?.bankAccount?.disableApprove;
          if(this.restartDetails?.modifyPayee?.bankAccount?.bankWarningMessage) this.alertService.showWarning(this.restartDetails?.modifyPayee?.bankAccount?.bankWarningMessage);
        }    
        this.benefitType = res?.pension?.annuityBenefitType?.english;
        this.restartHeading = new RestartBenefitHeading(
          this.restartDetails?.pension?.annuityBenefitType?.english
        ).getHeading();
        if (this.route.routeConfig) {
          this.route.routeConfig.data = { breadcrumb: this.restartHeading };
          this.RestartBenefitBrdcmb.breadcrumbs = this.RestartBenefitBrdcmb.buildBreadCrumb(this.route.root);
        }
        this.contributorDetails = res?.contributor;
        this.identity = checkIqamaOrBorderOrPassport(this.contributorDetails?.identity);
        this.identityLabel = getIdentityLabel(this.identity);
        this.fetchDocumentsForRestart();
        this.checkForm.get('checkBoxFlag').setValue(this.restartDetails?.isDirectPaymentOpted);
      },
      err => this.showError(err)
    );
  }
  getRestartCalcDetails() {
    this.modifyBenefitService.getRestartCalculation(this.socialInsuranceNo, this.requestId, this.referenceNo).subscribe(
      res => {
        this.restartCalculations = res;
        //this.checkForm.get('checkBoxFlag').setValue(this.restartCalculations?.isDirectPaymentOpted);
      },
      err => this.showError(err)
    );
  }
  getBenefitCalculationDetails(sin: number, benefitRequestId: number) {
    if (sin && benefitRequestId) {
      this.manageBenefitService
        .getBenefitCalculationDetailsByRequestId(sin, benefitRequestId)
        .subscribe(calculation => {
          this.benefitCalculation = calculation;
        });
    }
  }
  fetchDocumentsForRestart() {
    this.transactionKey = 'RESTART_BENEFIT';
    this.restartTransactionType = this.channel === Channel.FIELD_OFFICE ? 'REQUEST_BENEFIT_FO' : 'REQUEST_BENEFIT_GOL';
    this.getDocumentsForRestart(this.transactionKey, this.restartTransactionType, this.benefitRequestId);
  }
  getDocumentsForRestart(transactionKey: string, transactionType: string, benefitRequestId: number) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionKey, transactionType, this.referenceNo)
      .subscribe(res => {
        this.documentList = res;
      });
  }
  navigateToEdit() {
    this.router.navigate([BenefitConstants.ROUTE_RESTART_PENSION], {
      queryParams: {
        edit: true
      }
    });
  }
  navigateToPrevAdjustment() {
    this.adjustmentPaymentService.identifier = this.restartDetails?.modifyPayee?.personId;
    this.adjustmentPaymentService.socialNumber = this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], {
      queryParams: { from: RecalculationConstants.RESTART_CONTRIBUTOR }
    });
  }
  confirmApproveBenefit() {
    if (
      (this.routerData.assignedRole === Role.VALIDATOR_1 ||
        this.routerData.assignedRole === this.rolesEnum.VALIDATOR_2) &&
      this.restartCalculations?.netAdjustmentAmount > 0 &&
      !this.restartCalculations?.debit &&
      this.checkForm.get('checkBoxFlag').value !== null &&
      this.checkForm.get('checkBoxFlag').value !== undefined
      // &&
      // this.restartCalculations?.adjustments?.length > 0
    ) {
      this.modifyBenefitService
        .restartDirectPayment(
          this.socialInsuranceNo,
          this.requestId,
          this.referenceNo,
          this.checkForm.get('checkBoxFlag').value
        )
        .subscribe(
          () => {
            this.confirmApprove(this.retirementForm);
          },
          err => {
            this.alertService.showError(err.error.message);
          }
        );
    } else {
      this.confirmApprove(this.retirementForm);
    }
  }
  confirmRejectBenefit() {
    this.confirmReject(this.retirementForm);
  }
  returnBenefit() {
    this.confirmReturn(this.retirementForm);
  }
  readFullNote(noteText) {
    this.readMore = !this.readMore;
    if (this.readMore) {
      this.limit = noteText.length;
      this.showMoreText = 'BENEFITS.READ-LESS-NOTE';
    } else {
      this.limit = this.limitvalue;
      this.showMoreText = 'BENEFITS.READ-FULL-NOTE';
    }
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal1(modalRef: TemplateRef<HTMLElement>, size?: string) {
    this.commonModalRef = this.modalService.show(
      modalRef,
      Object.assign(
        {},
        {
          class: `modal-${size ? size : 'lg'}`,
          backdrop: true,
          ignoreBackdropClick: true
        }
      )
    );
  }
  hideModal() {
    this.commonModalRef.hide();
  }
  onViewBenefitDetails() {
    //this.modifyPensionService.setActiveBenefit();
    const data = new ActiveBenefits(
      this.socialInsuranceNo,
      this.requestId,
      this.restartDetails?.pension?.annuityBenefitType,
      this.referenceNo
    );
    this.coreBenefitService.setActiveBenefit(data);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
