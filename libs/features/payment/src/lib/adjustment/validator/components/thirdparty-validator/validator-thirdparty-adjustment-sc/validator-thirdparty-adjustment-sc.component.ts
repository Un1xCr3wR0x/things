/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import {
  AlertService,
  BankAccount,
  BilingualText,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService,
  LovList,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  scrollToTop,
  TransactionReferenceData,
  WorkFlowActions,
  WorkflowService,
  CoreBenefitService,
  CoreContributorService
} from '@gosi-ui/core';
import {
  AdjustmentDetails,
  AdjustmentService,
  PayeeDetails,
  PaymentRoutesEnum,
  ThirdpartyAdjustmentService,
  AdjustmentConstants,
  BeneficiaryList,
  BenefitDetails,
  PaymentService
} from '@gosi-ui/features/payment/lib/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorBaseScComponent } from '../../../base/validator-sc.base-component';
import { BenefitPropertyService } from '@gosi-ui/features/benefits/lib/shared';

@Component({
  selector: 'pmt-validator-thirdparty-adjustment-sc',
  templateUrl: './validator-thirdparty-adjustment-sc.component.html',
  styleUrls: ['./validator-thirdparty-adjustment-sc.component.scss']
})
export class ValidatorThirdpartyAdjustmentScComponent extends ValidatorBaseScComponent implements OnInit {
  /**Local Variables */
  lang = 'en';
  returnReasonList: Observable<LovList>;
  rejectReasonList: Observable<LovList>;
  modalRef: BsModalRef;
  documents: DocumentItem[];
  adjustmentId: string;
  adjustmentType: string;
  adjModificationNo: number;
  rejectWarningMessage: string;
  comments: TransactionReferenceData[] = [];
  adjustmentValues: AdjustmentDetails;
  approveHeading: string;
  returnHeading: string;
  rejectHeading: string;
  tpaValidatorForm: FormGroup;
  canReturn: boolean;
  modificationId: number;
  payeeDetails: PayeeDetails;
  payeebankName: BilingualText;
  payeeId: number;
  benefitValues: BeneficiaryList;
  canReject = true;
  benefit: BenefitDetails[];
  subsequentAmount = 0;
  initialAmount = 0;
  helperAmount = 0;
  dependentAmount = 0;
  basicBenefitAmount = 0;
  canEdit = false;
  taskId: string;
  user: string;
  channel: string;
  benefitAmountAfterDeduction = 0;
  benefitAmount: number;
  beneficiaryId: number;
  benefitStatus: BilingualText;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly thirdPartyService: ThirdpartyAdjustmentService,
    readonly modalService: BsModalService,
    readonly coreBenefitService: CoreBenefitService,
    readonly paymentService: PaymentService,
    private lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly adjustmentService: AdjustmentService,
    readonly workflowService: WorkflowService,
    private fb: FormBuilder,
    readonly router: Router,
    readonly contributorService: CoreContributorService,
    readonly benefitPropertyService: BenefitPropertyService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
    super(alertService, adjustmentService, coreBenefitService, paymentService, router);
  }

  ngOnInit(): void {
    scrollToTop();
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.initialiseView();
    this.tpaValidatorForm = this.createForms();
  }
  initialiseView() {
    const payloads = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payloads) {
      this.referenceNumber = payloads.referenceNo ? Number(payloads.referenceNo) : null;
      this.modificationId = payloads.adjustmentModificationId ? Number(payloads.adjustmentModificationId) : null;
      this.personId = payloads.PersonId ? Number(payloads.PersonId) : null;
      this.channel = payloads.channel;
      this.sin = payloads?.socialInsuranceNo;
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
    this.taskId = this.routerDataToken.taskId;
    this.user = this.routerDataToken.assigneeId;
    if (this.routerDataToken.comments.length > 0) {
      this.comments = this.routerDataToken.comments;
    }
    if (this.routerDataToken.assignedRole === Role.VALIDATOR_1) {
      this.canReturn = false;
      this.canEdit = true;
      this.canReject = true;
    } else if (this.routerDataToken.assignedRole === Role.VALIDATOR_2) {
      this.canReturn = true;
      this.canReject = true;
    } else if (this.routerDataToken.assignedRole === Role.CNT_FC_APPROVER) {
      this.canReturn = true;
      this.canReject = false;
    }
    if (payloads) {
      this.fetchLookupVal();
      this.getValidatorView();
      this.getBenefitDetails(this.personId);
      this.getRequiredTpaDocuments(this.referenceNumber);
      this.getTpaScreenHeaders();
      this.getContributor();
    }
  }
  getContributor() {
    this.thirdPartyService.getPersonById(this.personId).subscribe(data => {
      this.sin = data?.socialInsuranceNo;
    });
  }
  fetchLookupVal() {
    this.rejectReasonList = this.lookupService.getTpaRejectionReasonList();
    this.returnReasonList = this.lookupService.getRegistrationReturnReasonList();
  }
  /** Method to create a form for transaction data. */
  createForms() {
    return this.fb.group({
      taskId: [null],
      user: [null],
      type: [null],
      transactionNo: [null]
    });
  }
  // Method to navigate third party csr screen on edit
  navigateToTpaEdit() {
    this.router.navigate([PaymentRoutesEnum.VALIDATOR_EDIT_TPA]);
  }
  // Method to cancel popup
  confirmCancel() {
    this.hideModal();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  // Method to reject tpa workflow
  confirmRejectTpAdjustment() {
    const workflowData = this.setWorkFlowMergeData(this.tpaValidatorForm, this.routerDataToken, WorkFlowActions.REJECT);
    this.saveWorkflow(workflowData, false, null);
    this.hideModal();
  }
  // Method to approve tpa workflow
  confirmApproveTpAdjustment() {
    const workflowData = this.setWorkFlowData(
      this.tpaValidatorForm,
      this.taskId,
      null,
      this.user,
      this.routerDataToken,
      this.referenceNumber
    );
    workflowData.outcome = WorkFlowActions.APPROVE;
    this.saveWorkflow(workflowData, true, {
      personId: this.personId,
      adjustmentModificationId: this.modificationId,
      initiatePayment: false
    });
    this.hideModal();
  }
  // Method to rturn tpa workflow
  confirmReturnTpAdjustment() {
    const workflowData = this.setWorkFlowData(
      this.tpaValidatorForm,
      this.taskId,
      null,
      this.user,
      this.routerDataToken,
      this.referenceNumber
    );
    workflowData.outcome = WorkFlowActions.RETURN;
    this.saveWorkflow(workflowData, true);
    this.hideModal();
  }
  // Method to hide
  hideModal() {
    this.modalRef?.hide();
  }
  // This method is to show the modal reference
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  // Method to navigate to benefit details screen view
  navigatetoBenefitDetailsView() {}
  // THE METHOD USED TO FETCH DOCUMENT  IN VALIDATOR VIEW
  getRequiredTpaDocuments(referenceNumber) {
    this.documentService
      .getDocuments(
        AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_NAME,
        AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_TYPE,
        this.modificationId,
        referenceNumber
      )
      .subscribe(resp => {
        this.documents = resp;
      });
  }
  /** Method to get screen headings*/
  getTpaScreenHeaders() {
    this.approveHeading = 'ADJUSTMENT.APPROVE-THIRD-PARTY-ADJUSTMENT';
    this.returnHeading = 'ADJUSTMENT.RETURN-THIRD-PARTY-ADJUSTMENT';
    this.rejectHeading = 'ADJUSTMENT.REJECT-THIRD-PARTY-ADJUSTMENT';
  }
  /** Method to get adjustment details for validator view*/
  getValidatorView() {
    this.thirdPartyService
      .getThirdPartyAdjustmentValidatorDetails(this.personId, this.modificationId, true, this.sin)
      .subscribe(
        res => {
          this.adjustmentValues = res;
          this.beneficiaryId = res?.adjustments[0]?.beneficiaryId;
          this.payeeId = res?.adjustments[0]?.payeeId;
          this.getValidatorPayeeDetails(this.payeeId);
          this.requestId = res?.adjustments[0]?.benefitRequestId;
        },
        err => {
          this.alertService.showError(err.error.message);
          this.hideModal();
        }
      );
  }
  getBenefitDetails(personId) {
    this.thirdPartyService.getBeneficiaryDetails(personId, this.sin).subscribe(res => {
      this.benefitValues = res;
      this.benefitValues.beneficiaryBenefitList.forEach((data, index) => {
        if (data.beneficiaryId === this.beneficiaryId) {
          this.subsequentAmount = this.benefitValues.beneficiaryBenefitList[index].subsequentBenefitAmount;
          this.initialAmount = this.benefitValues.beneficiaryBenefitList[index].initialBenefitAmount;
          this.helperAmount = this.benefitValues.beneficiaryBenefitList[index].helperComponentAmount;
          this.dependentAmount = this.benefitValues.beneficiaryBenefitList[index].dependentComponentAmount;
          this.basicBenefitAmount = this.benefitValues.beneficiaryBenefitList[index].basicBenefitAmount;
          this.benefitAmount = this.benefitValues.beneficiaryBenefitList[index].benefitAmount;
          this.benefitAmountAfterDeduction =
            this.benefitValues.beneficiaryBenefitList[index].benefitAmountAfterDeduction;
          this.benefitStatus = this.benefitValues.beneficiaryBenefitList[index].benefitStatus;
        }
      });
    });
  }
  getValidatorPayeeDetails(payeeId: number) {
    this.thirdPartyService.getValidatorPayeeDetails(payeeId).subscribe(
      data => {
        this.payeeDetails = data;
        const iBanCode = this.payeeDetails?.iban ? String(this.payeeDetails?.iban).slice(4, 6) : null;
        if (iBanCode) {
          this.lookupService.getBank(iBanCode).subscribe(bankDetails => {
            if (bankDetails?.items?.length > 0) {
              const bank = new BankAccount();
              bank.ibanAccountNo = this.payeeDetails?.iban;
              bank.bankName = bankDetails?.items[0]?.value;
              this.payeebankName = bankDetails?.items[0]?.value;
            }
          });
        }
      },
      err => {
        this.alertService.showError(err.error.message);
        this.hideModal();
      }
    );
  }
  navigateOnLinkClick() {
    this.contributorService.selectedSIN = this.sin;
    this.router.navigate([RouterConstants.ROUTE_INDIVIDUAL(this.sin)]);
  }
}
