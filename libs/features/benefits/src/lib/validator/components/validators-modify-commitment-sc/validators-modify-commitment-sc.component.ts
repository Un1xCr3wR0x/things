/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ApplicationTypeEnum,
  Channel,
  checkIqamaOrBorderOrPassport,
  CommonIdentity,
  Role,
  formatDate,
  HeirBenefitDetails
} from '@gosi-ui/core';
import { BenefitConstants, bindQueryParamsToForm, createDetailForm, getIdentityLabel } from '../../../shared';
import { BenefitType } from '../../../shared/enum';
import { ActiveBenefits, AttorneyDetailsWrapper, Contributor, HoldBenefitDetails } from '../../../shared/models';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';

@Component({
  selector: 'bnt-validators-modify-commitment-sc',
  templateUrl: './validators-modify-commitment-sc.component.html',
  styleUrls: ['./validators-modify-commitment-sc.component.scss']
})
export class ValidatorsModifyCommitmentScComponent extends ValidatorBaseScComponent implements OnInit {
  /**
   * Local Variables
   */
  modifyCommitmentForm: FormGroup;
  checkForm: FormGroup;
  modifyCommitment: HoldBenefitDetails;
  modifyCommitmentType: string;
  isModifyBank = false;
  isRemoveBank = false;
  iscolfour = true;
  showMoreText = 'BENEFITS.READ-FULL-NOTE';
  limitvalue: number;
  limit = 100;
  contributorDetails: Contributor;
  benefitAttorney: AttorneyDetailsWrapper;
  identity: CommonIdentity | null;
  authorizedIdentity: CommonIdentity | null;
  directDisabled: boolean;
  checkBenefitType = BenefitType.modifyCommitment;
  identityLabel = '';
  Channel = Channel;

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.checkForm = this.fb.group({
      checkBoxFlag: [false]
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.isModifyBank = params.modifybank === 'true';
        this.isRemoveBank = params.removebank === 'true';
      }
    });
    this.modifyCommitmentForm = createDetailForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.modifyCommitmentForm);
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
    super.getRejectionReason(this.modifyCommitmentForm);
    if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
      this.getModifyCommitmentDetails(this.socialInsuranceNo, this.requestId, this.referenceNo);
    }
  }
  // fetch modify Remove bank  details
  getModifyCommitmentDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.modifyBenefitService.getModifyCommitment(sin, benefitRequestId, referenceNo, this.isModifyBank).subscribe(
      res => {
        this.modifyCommitment = res;
        this.contributorDetails = res?.contributor;
        this.benefitAttorney = res?.benefitAttorney;
        this.identity = checkIqamaOrBorderOrPassport(this.contributorDetails?.identity);
        this.identityLabel = getIdentityLabel(this.identity);
        if (this.benefitAttorney?.identity)
          this.authorizedIdentity = checkIqamaOrBorderOrPassport(this.benefitAttorney?.identity);
        //this.setAuthorizedIdentity();
        this.fetchDocumentsForModify();
        this.checkForm.get('checkBoxFlag').setValue(this.modifyCommitment?.isDirectPaymentOpted);
      },
      err => this.showError(err)
    );
  }
  fetchDocumentsForModify() {
    this.transactionKey = this.isModifyBank ? BenefitConstants.MODIFY_ACCOUNT : BenefitConstants.REMOVE_ACCOUNT;
    this.modifyCommitmentType =
      this.channel === Channel.FIELD_OFFICE
        ? BenefitConstants.REQUEST_BENEFIT_FO
        : BenefitConstants.REQUEST_BENEFIT_GOL;
    this.getDocumentsForModify(this.transactionKey, this.modifyCommitmentType, this.benefitRequestId);
  }
  getDocumentsForModify(transactionKey: string, transactionType: string, benefitRequestId: number) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionKey, transactionType)
      .subscribe(res => {
        this.documentList = res;
      });
  }
  navigateToEdit() {
    if (this.isModifyBank) {
      this.router.navigate([BenefitConstants.ROUTE_MODIFY_COMMITMENT], {
        queryParams: {
          edit: true
        }
      });
    } else {
      this.router.navigate([BenefitConstants.ROUTE_REMOVE_COMMITMENT], {
        queryParams: {
          edit: true
        }
      });
    }
  }
  confirmApproveBenefit() {
    if (
      (this.routerData.assignedRole === Role.VALIDATOR_1 ||
        this.routerData.assignedRole === this.rolesEnum.VALIDATOR_2) &&
      this.modifyCommitment?.netAdjustmentAmount > 0 &&
      !this.modifyCommitment?.debit &&
      this.checkForm.get('checkBoxFlag') &&
      this.checkForm.get('checkBoxFlag').value !== null &&
      this.checkForm.get('checkBoxFlag').value !== undefined
    ) {
      this.modifyBenefitService
        .modifyBankDirectPayment(
          this.socialInsuranceNo,
          this.requestId,
          this.referenceNo,
          this.checkForm.get('checkBoxFlag').value
        )
        .subscribe(
          () => {
            this.confirmApprove(this.modifyCommitmentForm);
          },
          err => {
            this.alertService.showError(err.error.message);
          }
        );
    } else {
      this.confirmApprove(this.modifyCommitmentForm);
    }
  }
  confirmRejectBenefit() {
    this.confirmReject(this.modifyCommitmentForm);
  }
  returnBenefit() {
    this.confirmReturn(this.modifyCommitmentForm);
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
  getDateFormat(lang) {
    return formatDate(lang);
  }
  onViewBenefitDetails() {
    const data = new ActiveBenefits(
      this.socialInsuranceNo,
      this.requestId,
      this.modifyCommitment?.pension?.annuityBenefitType,
      this.referenceNo
    );
    this.coreBenefitService.setActiveBenefit(data);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
  }
  navigateToAdjustmentDetails() {
    this.adjustmentPaymentService.identifier = this.modifyCommitment?.modifyPayee?.personId;
    this.adjustmentPaymentService.socialNumber = this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT]);
  }
  navigateToContributorDetails() {
    this.routerData.stopNavigationToValidator = true;
    this.router.navigate([`home/profile/contributor/${this.socialInsuranceNo}/info`]);
  }
}
