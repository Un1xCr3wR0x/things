import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeEnum, Channel, RoleIdEnum } from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  BenefitConstants,
  BenefitType,
  bindQueryParamsToForm,
  createDetailForm,
  createModalForm,
  ReturnLumpsumDetails,
  UITransactionType
} from '../../../shared';
import { TransactionPensionBase } from '../../../shared/component/base/transaction-pension.base';

@Component({
  selector: 'bnt-validator-return-lumpsum-sc',
  templateUrl: './validator-return-lumpsum-sc.component.html',
  styleUrls: ['./validator-return-lumpsum-sc.component.scss']
})
export class ValidatorReturnLumpsumScComponent extends TransactionPensionBase implements OnInit {
  comments: null;
  nin: number;
  returnBenefitDetails: ReturnLumpsumDetails;
  returnLumpsumForm: FormGroup;
  returnLumpsumModal: FormGroup;
  commonModalRef: BsModalRef;
  heading: string;
  isValidatorScreen = true;
  isValidatorCanEditPayment = false;
  isJailedLumpsum = false;
  isHazardous = false;
  isHeir = false;
  isOcc = false;
  isNonOcc = false;
  isWomenLumpsum = false;
  enabledRestoration: Boolean;
  isSadad: Boolean;
  enableLumpsumRepaymentId: number;
  reqDocList = [];
  accessRole = [RoleIdEnum.FC, RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER];
  rejectAccess = [RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER];
  Channel = Channel;

  /**
   *
   * This method is to initialize the component
   */
  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.returnLumpsumForm = createDetailForm(this.fb);
    this.returnLumpsumModal = createModalForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.returnLumpsumForm);
    this.intialiseTheView(this.routerData);
    super.getRejectionReason(this.returnLumpsumForm);
    this.getLumpsumRepaymentDetails(this.socialInsuranceNo, this.requestId, this.repayId);
  }

  /**
   * this function will redirect validator to return lumpsum amount screen
   */
  navigateToEdit() {
    this.routerData.tabIndicator = 2;
    this.routerData.selectWizard = BenefitConstants.UI_DOCUMENTS;
    this.router.navigate([BenefitConstants.ROUTE_RETURN_LUMPSUM_BENEFIT], {
      queryParams: {
        edit: true
      }
    });
  }
  /**
   * this function will redirect validator to restore lumpsum screen
   */
  navigateToRestore() {
    this.routerData.tabIndicator = 2;
    this.routerData.selectWizard = BenefitConstants.UI_DOCUMENTS;
    this.router.navigate([BenefitConstants.ROUTE_RESTORE_LUMPSUM_BENEFIT], {
      queryParams: {
        edit: true
      }
    });
  }

  /**
   * Method to show approve modal.
   * @param templateRef
   */
  showTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }

  /**
   * Approving by the validator.
   */
  confirmApproveLumpsum() {
    this.confirmApprove(this.returnLumpsumForm);
  }
  /**
   * While rejecting from validator
   */
  confirmRejectLumpsum() {
    this.confirmReject(this.returnLumpsumForm);
  }
  /**
   * when return to establishment action is performed, comments will be shared
   */
  returnLumpsum() {
    this.confirmReturn(this.returnLumpsumForm);
  }
  /**
   * Method to fetch the return lumpsum  details
   */
  getLumpsumRepaymentDetails(sin: number, benefitRequestId: number, repayID: number) {
    this.returnLumpsumService.getLumpsumRepaymentDetails(sin, benefitRequestId, repayID).subscribe(
      res => {
        this.returnBenefitDetails = res;
        this.nin = this.returnBenefitDetails.nin;
        this.benefitType = this.returnBenefitDetails.benefitType.english;
        this.enabledRestoration = this.returnBenefitDetails.enabledRestoration;
        this.enableLumpsumRepaymentId = this.returnBenefitDetails.enableLumpsumRepaymentId;
        this.isSadad = this.returnBenefitDetails.repaymentDetails.paymentMethod.english === 'SADAD';
        if (!this.isSadad) {
          this.fetchDocumentsForOtherPayment();
          this.canValidatorCanEditPayment();
        }
        if (this.enabledRestoration) {
          this.fetchDocumentsForRestore(this.benefitRequestId);
        }
        this.returnLumpsumService.setRepayId(repayID);
        this.returnLumpsumService.setBenefitReqId(benefitRequestId);
        this.setBenefitVariables(this.benefitType);
      },
      err => {
        this.showError(err);
      }
    );
  }
  /**to fetch documents */
  fetchDocumentsForOtherPayment() {
    this.transactionKey = UITransactionType.REPAY_LUMPSUM_BENEFIT;
    this.transactionType =
      this.channel === Channel.FIELD_OFFICE ? UITransactionType.FO_REQUEST_SANED : UITransactionType.GOL_REQUEST_SANED;
    this.getDocumentsForOtherPayment(
      this.transactionKey,
      this.transactionType,
      this.benefitRequestId,
      this.referenceNo
    );
  }

  getDocumentsForOtherPayment(
    transactionKey: string,
    transactionType: string,
    benefitRequestId: number,
    referenceNo: number
  ) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionKey, transactionType, referenceNo)
      .subscribe(res => {
        this.documentList = res;
        this.reqDocList.push(...this.documentList);
        this.reqDocList = [...this.reqDocList];
      });
  }
  fetchDocumentsForRestore(enableLumpsumRepaymentId: number) {
    this.transactionKey = UITransactionType.RESTORE_LUMPSUM_BENEFIT;
    this.transactionType = UITransactionType.FO_REQUEST_SANED;
    this.getDocumentsForRestore(this.transactionKey, this.transactionType, enableLumpsumRepaymentId);
  }
  getDocumentsForRestore(transactionKey: string, transactionType: string, enableLumpsumRepaymentId: number) {
    this.benefitDocumentService
      .getUploadedDocuments(enableLumpsumRepaymentId, transactionKey, transactionType)
      .subscribe(response => {
        this.documentList = response.filter(eachDoc => eachDoc.documentContent !== null);
        this.reqDocList.push(...this.documentList);
        this.reqDocList = [...this.reqDocList];
      });
  }
  setBenefitVariables(benefitType: string) {
    if (benefitType === BenefitType.hazardousLumpsum) {
      this.isHazardous = true;
    } else if (benefitType === BenefitType.jailedContributorLumpsum) {
      this.isJailedLumpsum = true;
    } else if (benefitType === BenefitType.occLumpsum) {
      this.isOcc = true;
    } else if (benefitType === BenefitType.nonOccLumpsumBenefitType) {
      this.isNonOcc = true;
    } else if (benefitType === BenefitType.womanLumpsum) {
      this.isWomenLumpsum = true;
    } else if (benefitType === BenefitType.heirLumpsum) {
      this.isHeir = true;
    }
  }

  canValidatorCanEditPayment() {
    if (
      this.returnBenefitDetails?.repaymentDetails?.receiptMode.english === 'Account Transfer' ||
      this.returnBenefitDetails?.repaymentDetails?.receiptMode.english === 'Cash Deposit'
    ) {
      this.isValidatorCanEditPayment = true;
    }
    if (this.rejectAccess) {
      this.isValidatorCanEditPayment = true;
    }
  }
  navigateToInjuryDetails() {
    this.router.navigate([
      `home/profile/contributor/${this.registrationNo}/${this.contributor.socialInsuranceNo}/info`
    ]);
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
}
