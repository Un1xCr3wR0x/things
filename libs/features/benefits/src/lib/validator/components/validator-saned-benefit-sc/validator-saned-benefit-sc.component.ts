import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BilingualText, Channel, Role } from '@gosi-ui/core';
import * as moment from 'moment';
import {
  BenefitConstants,
  Benefits,
  BenefitType,
  bindQueryParamsToForm,
  createDetailForm,
  showErrorMessage,
  UITransactionType,
  BenefitValues,
  isRequest,
  UiApply,
  PatchPersonBankDetails,
  BenefitDetails
} from '../../../shared';
import { TransactionPensionBase } from '../../../shared/component/base/transaction-pension.base';

@Component({
  selector: 'bnt-validator-saned-benefit-sc',
  templateUrl: './validator-saned-benefit-sc.component.html',
  styleUrls: ['./validator-saned-benefit-sc.component.scss']
})
export class ValidatorSanedBenefitScComponent extends TransactionPensionBase implements OnInit {
  comments: null;
  requestSanedForm: FormGroup;
  uiEligibility: Benefits;
  selectedInspection: BilingualText;
  eligibilityApiResponseSaned: Benefits;
  validatorAppealCanEdit = false;
  Channel = Channel;
  returnType: string;
  calculateDetails: BenefitDetails;
  isSanedAppeal: boolean;
  eligibleForPensionReform: boolean;
  ngOnInit(): void {
    this.requestSanedForm = createDetailForm(this.fb);
    this.retirementForm = this.fb.group({
      checkBoxFlag: [false]
    });
    this.setRouterDataValues(this.routerData);
    bindQueryParamsToForm(this.routerData, this.requestSanedForm);
    this.intialiseTheView(this.routerData);
    if (
      (this.channel === Channel.FIELD_OFFICE && this.routerData.assignedRole === this.rolesEnum.VC) ||
      (this.appealLateRequest && this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1)
    ) {
      this.validatorCanEdit = true; // Validator 1 can edit the transaction
    } else if (
      (this.channel === Channel.FIELD_OFFICE || this.channel === Channel.TAMINATY) &&
      (this.routerData.assignedRole === this.rolesEnum.VCSANED ||
        this.routerData.assignedRole === this.rolesEnum.VCAPPEAL)
    ) {
      this.validatorAppealCanEdit = true;
    }
    /* Setting rejection Indicatior */
    super.getRejectionReason(this.requestSanedForm);
    this.transactionType = UITransactionType.FO_REQUEST_SANED;
    if (this.channel === Channel.GOSI_ONLINE || this.channel === Channel.TAMINATY) {
      this.transactionType = UITransactionType.GOL_REQUEST_SANED;
    }
    this.getBenefitRequestDetails();
  }

  /** method to get reason for benefit*/
  getUIEligibilityDetails(sin: number, benefitType: string) {
    this.uiBenefitService
      .getEligibleUiBenefitByType(
        sin,
        benefitType,
        moment(this.requestDate.gregorian, 'YYYY-MM-DD').format('YYYY-MM-DD')
      )
      .subscribe(
        eligibilityResponse => {
          if (eligibilityResponse) {
            this.isSanedAppeal = eligibilityResponse.appeal;
            //Story 586039
            if (eligibilityResponse?.warningMessages && eligibilityResponse?.warningMessages.length > 0) {
              this.alertService.showWarning(eligibilityResponse?.warningMessages[0]);
            }
            //US: 524388
            if (
              !eligibilityResponse.eligible &&
              isRequest(this.routerData?.resourceType) &&
              this.routerData?.resourceType !== 'UI Benefit Adjustment'
            ) {
              this.eligibilityApiResponseSaned = eligibilityResponse;
              this.confirmReject(
                this.fb.group({
                  rejectionReason: this.fb.group({
                    arabic: ['غير مؤهل للمنفعة'],
                    english: ['Ineligible for the benefit']
                  }),
                  comments: 'Ineligible for the benefit’ (غير مؤهل للمنفعة)'
                }),
                false
              );
              this.showModal(this.eligibilityCriteria, { class: 'modal-lg', ignoreBackdropClick: true });
            } else {
              this.uiEligibility = eligibilityResponse;
              this.inspectionList = this.sanedBenefitService.getSanedInspectionType();
              this.inspectionList.subscribe(inspection => {
                this.selectedInspection = inspection.items[0].value;
              });
              let transactionKey = UITransactionType.REQUEST_SANED;
              if (this.uiEligibility?.appeal) {
                transactionKey = UITransactionType.APPEAL_UNEMPLOYMENT_INSURANCE;
              }
              this.getDocuments(transactionKey, this.transactionType, this.requestId);
              if (eligibilityResponse.benefitType && eligibilityResponse.benefitType.english === this.benefitType) {
                if (eligibilityResponse.warningMessages) {
                  this.alertService.showWarning(eligibilityResponse.warningMessages[0]);
                }
              }
              this.isReopenCase = this.uiEligibility?.status === BenefitValues.reopen;
              if (this.uiEligibility?.isReopen && this.uiEligibility?.status === BenefitValues.workflow) {
                // this.isReopenCase = this.uiEligibility.isReopen;
                this.coreBenefitService.isReopenCase = this.isReopenCase;
              }
            }
          }
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
  }

  getDocuments(transactionKey: string, transactionType: string, benefitRequestId: number) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionKey, transactionType)
      .subscribe(res => {
        this.documentList = res;
      });
  }
  calculateOutput(data: BenefitDetails) {
    this.calculateDetails = data;
  }
  /**
   * Navigate to document scan page
   */
  navigateToScan() {
    this.routerData.tabIndicator = 2;
    this.routerData.selectWizard = BenefitConstants.UI_DOCUMENTS;
    this.uiBenefitService.setBenefitStatus(BenefitConstants.VAL_EDIT_BENEFIT);
    this.manageBenefitService.setRequestDate(this.benefitRequest.requestDate);
    this.router.navigate([BenefitConstants.ROUTE_APPLY_BENEFIT]);
  }

  /**
   * Method to show approve modal.
   * @param templateRef
   */
  showTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }

  /**
   * While rejecting from validator
   */
  confirmRejectSaned() {
    this.confirmReject(this.requestSanedForm);
  }

  /**
   * Approving by the validator.
   */
  confirmApproveSaned() {
    if (this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1) {
      const uiPayload: UiApply = new UiApply();
      uiPayload.referenceNo = this.referenceNo;
      uiPayload.requestDate = this.benefitRequest.requestDate;
      uiPayload.appealReason = this.benefitRequest.appealReason;
      uiPayload.reasonDescription = this.benefitRequest.reasonDescription;
      uiPayload.eligiblePeriod = {
        startDate: { gregorian: new Date(this.calculateDetails.uiEligibilityPeriods.periodStartDate) },
        endDate: { gregorian: new Date(this.calculateDetails.uiEligibilityPeriods.periodStopDate) }
      };
      const savedBankDetails = new PatchPersonBankDetails();
      savedBankDetails.bankCode = this.benefitRequest.bankAccount.bankCode;
      savedBankDetails.bankName = this.benefitRequest.bankAccount.bankName;
      savedBankDetails.ibanBankAccountNo = this.benefitRequest.bankAccount.ibanBankAccountNo;
      savedBankDetails.isNewlyAdded = this.benefitRequest.bankAccount.isNewlyAdded;
      uiPayload.bankAccount = savedBankDetails;
      uiPayload.directPayment = this.retirementForm.get('checkBoxFlag') ? this.retirementForm.get('checkBoxFlag').value : this.benefitRequest.directPayment;
      this.confirmApprove(this.requestSanedForm, uiPayload);
    } else {
      this.confirmApprove(this.requestSanedForm);
    }
  }

  /**
   * when return to establishment action is performed, comments will be shared
   */
  returnSaned() {
    this.confirmReturn(this.requestSanedForm);
  }
  returnMoreSaned() {
    this.confirmReturn(this.requestSanedForm, this.returnType);
  }
  returnSanedTransaction(templateRef: TemplateRef<HTMLElement>, templateNameModifyCom = '') {
    if (templateNameModifyCom === this.rolesEnum.CONTRIBUTOR) {
      this.returnType = this.rolesEnum.CONTRIBUTOR_SANED;
    } else if (templateNameModifyCom === this.rolesEnum.VC) {
      this.returnType = this.rolesEnum.VC;
    }
    this.showModal(templateRef);
  }

  getBenefitRequestDetails() {
    this.sanedBenefitService
      .getBenefitRequestDetails(this.socialInsuranceNo, this.requestId, this.referenceNo)
      .subscribe(
        res => {
          if (res) {
            this.benefitRequest = res;
            this.eligibleForPensionReform = this.benefitRequest?.pensionReformEligibility?.english === this.pensionReformEligibilityEnum?.Eligible;
            if (this.benefitRequest?.bankAccount) {
              this.setBankDetails(this.benefitRequest?.bankAccount);
            }
            this.requestDate = this.benefitRequest.requestDate;
            this.isReopenCase = this.benefitRequest?.status?.english === BenefitValues.reactivated;
            this.getUIEligibilityDetails(this.socialInsuranceNo, BenefitType.ui);
          }
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
  }
}
