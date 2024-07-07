import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeEnum, BenefitsGosiShowRolesConstants, Channel, CommonIdentity, formatDate, Role } from '@gosi-ui/core';
import {
  AttorneyDetailsWrapper,
  BenefitConstants,
  BenefitType,
  bindQueryParamsToForm,
  Contributor,
  createDetailForm,
  HoldBenefitDetails
} from '../../../shared';
import { TransactionPensionBase } from '../../../shared/component/base/transaction-pension.base';

@Component({
  selector: 'bnt-validator-modify-commitment-sc',
  templateUrl: './validator-modify-commitment-sc.component.html',
  styleUrls: ['./validator-modify-commitment-sc.component.scss']
})
export class ValidatorModifyCommitmentScComponent extends TransactionPensionBase implements OnInit {
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
  Channel = Channel;
  BenefitType = BenefitType;
  validatorCommitmentAccess = BenefitsGosiShowRolesConstants.VALIDATOR_ONE;
  sanedValidatorCommitmentAccess = BenefitsGosiShowRolesConstants.SANED_VALIDATOR;
  
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
    if (this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1) {
      this.directDisabled = false;
    } else if (
      this.routerData.assignedRole === this.rolesEnum.FC_APPROVER ||
      this.routerData.assignedRole === this.rolesEnum.FC_CONTROLLER ||
      this.routerData.assignedRole === this.rolesEnum.CNT_FC_APPROVER ||
      this.routerData.assignedRole === 'FC Approver' ||
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_2
    ) {
      this.directDisabled = true;
    }
    super.getRejectionReason(this.modifyCommitmentForm);
    if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
      this.fetchDocumentsForModify();
    }
  }

  fetchDocumentsForModify() {
    this.transactionKey = this.isModifyBank ? BenefitConstants.MODIFY_ACCOUNT : BenefitConstants.REMOVE_ACCOUNT;
    this.modifyCommitmentType =
      this.channel === Channel.FIELD_OFFICE
        ? BenefitConstants.REQUEST_BENEFIT_FO
        : BenefitConstants.REQUEST_BENEFIT_GOL;
    if (this.isModifyBank) {
      this.benefitDocumentService
        .getModifyBankDocuments(
          this.socialInsuranceNo,
          this.requestId,
          this.referenceNo,
          this.transactionKey,
          this.modifyCommitmentType
        )
        .subscribe(res => {
          this.documentList = res;
        });
    } else {
      this.getDocumentsForModify(this.transactionKey, this.modifyCommitmentType, this.benefitRequestId);
    }
  }
  getDocumentsForModify(transactionKey: string, transactionType: string, benefitRequestId: number) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionKey, transactionType)
      .subscribe(res => {
        this.documentList = res;
      });
  }
  samaDisableVal(disableDto){
    this.disableApprove = disableDto?.disableApprove;
    if(disableDto?.warningDisplay) this.alertService.showWarning(disableDto?.warningDisplay);
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
      (this.routerData.assignedRole === Role.VALIDATOR_1 || this.routerData.assignedRole === Role.VALIDATOR_2) &&
      this.modifyCommitment?.netAdjustmentAmount > 0 &&
      !this.modifyCommitment?.debit &&
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
}
