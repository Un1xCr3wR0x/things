/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import {
  scrollToTop,
  LanguageToken,
  RouterDataToken,
  RouterData,
  Role,
  RouterConstants,
  DocumentItem,
  DocumentService,
  TransactionReferenceData,
  LovList,
  LookupService,
  AlertService,
  WorkFlowActions,
  BilingualText,
  CoreAdjustmentService,
  CoreBenefitService,
  CommonIdentity,
  checkIqamaOrBorderOrPassport,
  CoreContributorService
} from '@gosi-ui/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import {
  AdjustmentService,
  ThirdPartyAdjustmentList,
  AdjustmentConstants,
  PaymentService,
  ThirdpartyAdjustmentService,
  PayeeDetails,
  PaymentRoutesEnum,
  BeneficiaryList,
  AdjustmentDetails,
  Adjustment
} from '@gosi-ui/features/payment/lib/shared';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorBaseScComponent } from '../../../base/validator-sc.base-component';
import { map, switchMap, tap } from 'rxjs/operators';
import { BenefitPropertyService } from '@gosi-ui/features/benefits/lib/shared';

@Component({
  selector: 'pmt-validator-modify-thirdparty-adjustment-sc',
  templateUrl: './validator-modify-thirdparty-adjustment-sc.component.html',
  styleUrls: ['./validator-modify-thirdparty-adjustment-sc.component.scss']
})
export class ValidatorModifyThirdpartyAdjustmentScComponent extends ValidatorBaseScComponent implements OnInit {
  /**Local Variables */
  benefitList: BeneficiaryList;
  iBanCode: string;
  ibanAccountNo: string;
  payeeCode: string;
  canEdit = true;
  canReject = true;
  comments: TransactionReferenceData[] = [];
  canReturn = true;
  returnReasonList: Observable<LovList>;
  rejectReasonList: Observable<LovList>;
  modifyTpaValidatorForm: FormGroup;
  comment: TransactionReferenceData[] = [];
  thirdPartyAdjustmentList: Map<number, ThirdPartyAdjustmentList> = new Map();
  docs: DocumentItem[];
  modificationId: number;
  modifiedAdjustmentValues: Adjustment[];
  adjustments: AdjustmentDetails;
  modalRef: BsModalRef;
  payeeDetails: PayeeDetails;
  validatorApproveHeading: string;
  validatorReturnHeading: string;
  validatorRejectHeading: string;
  taskId: string;
  user: string;
  channel: string;
  payeeId: number;
  payeebankName: BilingualText;
  adjustmentid: number;
  allDocuments: DocumentItem[] = [];
  addDocuments: DocumentItem[] = [];
  modifyDocuments: DocumentItem[] = [];
  reactivateDocumnets: DocumentItem[] = [];
  holdDocuments: DocumentItem[] = [];
  stopDocuments: DocumentItem[] = [];
  currentAdjustments: Adjustment[];
  payeesList: PayeeDetails[];
  bankLovDetails: LovList[];
  bankCodeMap: Map<string, BilingualText> = new Map();
  bankCodeList: string[];
  readonly adjustmentConstants = AdjustmentConstants;
  lang = 'en';
  sin: number;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly adjustmentService: AdjustmentService,
    readonly thirdPartyService: ThirdpartyAdjustmentService,
    readonly router: Router,
    readonly paymentService: PaymentService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly coreBenefitService: CoreBenefitService,
    readonly fb: FormBuilder,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly benefitPropertyService: BenefitPropertyService,
    readonly contributorService: CoreContributorService
  ) {
    super(alertService, adjustmentService, coreBenefitService, paymentService, router);
  }

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    scrollToTop();
    this.getPayLoadValues();
    this.modifyTpaValidatorForm = this.createTpaValidatorForm();
  }
  /** Method  to  navigate  to  View Maintain Adjustment */
  viewMaintainAdjustment(adjustmentdetails) {
    this.coreAdjustmentService.identifier = this.personId;
    this.coreAdjustmentService.sin = this.sin;
    this.router.navigate([PaymentRoutesEnum.ADJUSTMENT_DETAIL], { queryParams: { from: adjustmentdetails } });
  }

  // Fetch required values to show validator page
  getPayLoadValues() {
    const payloads = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payloads) {
      this.referenceNumber = payloads.referenceNo ? Number(payloads.referenceNo) : null;
      this.modificationId = payloads.adjustmentModificationId ? Number(payloads.adjustmentModificationId) : null;
      this.personId = payloads.PersonId ? Number(payloads.PersonId) : null;
      this.channel = payloads.channel;
      this.sin = payloads?.socialInsuranceNo;
      this.getLookupValue();
      this.getAdjustmentValidator();
      this.getModifyTpaScreenHeaders();
      this.getContributor();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
    this.taskId = this.routerDataToken.taskId;
    this.user = this.routerDataToken.assigneeId;
    if (this.routerDataToken.assignedRole === Role.VALIDATOR_1) {
      this.canReturn = false;
      this.canEdit = true;
      this.canReject = true;
    }
    if (this.routerDataToken.assignedRole === Role.VALIDATOR_2) {
      this.canEdit = false;
      this.canReject = true;
    }
    if (this.routerDataToken.assignedRole === Role.CNT_FC_APPROVER) {
      this.canEdit = false;
      this.canReject = false;
    }
    if (this.routerDataToken.comments.length > 0) {
      this.comment = this.routerDataToken.comments;
    }
  }
  // Get look up values
  getLookupValue() {
    this.rejectReasonList = this.lookupService.getTpaRejectionReasonList();
    this.returnReasonList = this.lookupService.getRegistrationReturnReasonList();
  }
  // This method is used to fetch validator document details
  getModifyTpaDocuments(modifiedAdjustments: Adjustment[], referenceNumber: number, adjustmentModificationId: number) {
    this.documentService
      .getRequiredDocuments(
        AdjustmentConstants.MAINTAIN_THIRD_PARTY_TRANSACTION_NAME,
        AdjustmentConstants.MAINTAIN_PARTY_TRANSACTION_TYPE
      )
      .pipe(
        tap(docs => {
          docs.forEach(doc => {
            if (AdjustmentConstants.MODIFY_DOCUMENT_TYPE_IDS.includes(doc?.documentTypeId)) {
              this.modifyDocuments.push(doc);
            }
            if (AdjustmentConstants.HOLD_DOCUMENT_TYPE_IDS.includes(doc?.documentTypeId)) {
              this.holdDocuments.push(doc);
            }
            if (AdjustmentConstants.STOP_DOCUMENT_TYPE_IDS.includes(doc?.documentTypeId)) {
              this.stopDocuments.push(doc);
            }
            if (AdjustmentConstants.REACTIVATE_DOCUMENT_TYPE_IDS.includes(doc?.documentTypeId)) {
              this.reactivateDocumnets.push(doc);
            }
            if (AdjustmentConstants.ADD_DOCUMENT_TYPE_IDS.includes(doc?.documentTypeId)) {
              this.addDocuments.push(doc);
            }
          });
        }),
        map(docs => {
          this.allDocuments = docs;
          let documents: DocumentItem[] = [];
          this.allDocuments.forEach(doc => {
            modifiedAdjustments.forEach(adjustment => {
              if (adjustment?.actionType?.english === AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.ADD?.english) {
                documents = [...documents, { ...doc, businessKey: adjustmentModificationId } as DocumentItem];
              } else {
                documents = [...documents, { ...doc, businessKey: adjustment?.adjustmentId } as DocumentItem];
              }
            });
          });
          return documents;
        })
      )
      .subscribe(docs => {
        this.docs = docs;
        this.docs.forEach(doc => {
          if (doc && doc.name) {
            this.documentService
              .refreshDocument(
                doc,
                doc.businessKey,
                AdjustmentConstants.MAINTAIN_THIRD_PARTY_TRANSACTION_NAME,
                AdjustmentConstants.MAINTAIN_PARTY_TRANSACTION_TYPE,
                referenceNumber
              )
              .subscribe(res => {
                if (doc.documentContent) doc = res;
              });
          }
        });
      });
  }
  /** Method to get screen headings*/
  getModifyTpaScreenHeaders() {
    this.validatorApproveHeading = 'ADJUSTMENT.APPROVE-MANAGE-THIRD-PARTY-ADJUSTMENTS';
    this.validatorReturnHeading = 'ADJUSTMENT.RETURN-MANAGE-THIRD-PARTY-ADJUSTMENTS';
    this.validatorRejectHeading = 'ADJUSTMENT.REJECT-MANAGE-THIRD-PARTY-ADJUSTMENTS';
  }
  // Method to navigate third party csr screen on edit
  navigateToMaintainTpaEdit() {
    this.router.navigate([PaymentRoutesEnum.VALIDATOR_EDIT_MAINTAIN_TPA]);
  }
  // This method is to show the modal reference
  showModals(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  // Method to hide
  hideModals() {
    this.modalRef?.hide();
  }
  modifyTpaApproval() {
    const workflowData = this.setWorkFlowData(
      this.modifyTpaValidatorForm,
      this.taskId,
      null,
      this.user,
      this.routerDataToken,
      this.referenceNumber
    );
    workflowData.outcome = WorkFlowActions.APPROVE;
    this.saveWorkflow(workflowData, true, {
      personId: this.personId,
      adjustmentModificationId: this.modificationId
    });
    this.hideModals();
  }
  modifyTpaReturn() {
    const workflowData = this.setWorkFlowData(
      this.modifyTpaValidatorForm,
      this.taskId,
      null,
      this.user,
      this.routerDataToken,
      this.referenceNumber
    );
    workflowData.outcome = WorkFlowActions.RETURN;
    this.saveWorkflow(workflowData, true);
    this.hideModals();
  }
  modifyTpaReject() {
    const workflowData = this.setWorkFlowMergeData(
      this.modifyTpaValidatorForm,
      this.routerDataToken,
      WorkFlowActions.REJECT
    );
    this.saveWorkflow(workflowData, false, null);
    this.hideModals();
  }
  confirmCancel() {
    this.hideModals();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /** Method to create a form for transaction data. */
  createTpaValidatorForm() {
    return this.fb.group({
      taskId: [null],
      user: [null],
      type: [null],
      transactionNo: [null]
    });
  }
  navigateToAdjustmentDetail(val: number) {
    this.router.navigate([PaymentRoutesEnum.THIRD_PARTY_ADJUSTMENT_DETAIL], {
      queryParams: {
        adjustmentId: val,
        personId: this.personId
      }
    });
  }
  getAdjustmentValidator() {
    forkJoin([
      this.thirdPartyService.getBeneficiaryDetails(this.personId, this.sin),
      this.thirdPartyService.getTpaAdjustmentsDetails(this.personId, null, this.sin),
      this.thirdPartyService.getThirdPartyAdjustmentValidatorDetails(this.personId, this.modificationId, true, this.sin)
    ])
      .pipe(
        switchMap(data => {
          this.benefitList = data[0];
          this.currentAdjustments = data[1]?.adjustments;
          this.modifiedAdjustmentValues = data[2]?.adjustments;
          this.getModifyTpaDocuments(this.modifiedAdjustmentValues, this.referenceNumber, this.modificationId);
          this.adjustments = data[2];
          this.requestId = this.modifiedAdjustmentValues[0]?.benefitRequestId;
          const payeeIds: number[] = [];
          const httpcalls: Observable<PayeeDetails>[] = [];
          this.modifiedAdjustmentValues?.forEach(adjustment => {
            if (!payeeIds.includes(adjustment?.payeeId)) {
              payeeIds.push(adjustment?.payeeId);
              httpcalls.push(this.thirdPartyService.getValidatorPayeeDetails(adjustment.payeeId));
            }
          });
          return forkJoin(httpcalls);
        }),
        switchMap(payees => {
          this.payeesList = payees;
          this.bankCodeList = [];
          const bankApis: Observable<LovList>[] = [];
          payees.forEach(payee => {
            const iBanCode = payee?.iban ? String(payee?.iban).slice(4, 6) : null;
            if (iBanCode && !this.bankCodeList.includes(iBanCode)) {
              this.bankCodeList.push(iBanCode);
              bankApis.push(this.lookupService.getBank(iBanCode));
            }
          });
          if (!this.bankCodeList?.length) {
            // Story 577329 - should show the details for TPA even though there is no bank
            this.getThirdPartyAdjList();
          }
          return forkJoin(bankApis);
        })
      )
      .subscribe(
        banks => {
          this.bankCodeList.forEach((code, index) => {
            this.bankCodeMap.set(code, banks[index].items[0]?.value);
          });
          this.getThirdPartyAdjList();
        },
        err => {
          this.alertService.showError(err.error.message);
          this.hideModals();
        }
      );
  }
  getThirdPartyAdjList() {
    this.modifiedAdjustmentValues?.forEach((modifiedAdjustment, index) => {
      const payee = this.payeesList?.find(payeeItem => payeeItem.payeeId === modifiedAdjustment?.payeeId);
      const iBanCode = payee?.iban ? String(payee?.iban).slice(4, 6) : null;
      this.thirdPartyAdjustmentList.set(index, {
        currentAdjustment: this.currentAdjustments.find(
          currentAdjustment => currentAdjustment?.adjustmentId === modifiedAdjustment?.adjustmentId
        ),
        modifiedAdjustment: modifiedAdjustment,
        payee: payee,
        bank: this.bankCodeMap.get(iBanCode),
        benefit: this.benefitList?.beneficiaryBenefitList?.find(
          benefit => benefit?.beneficiaryId === modifiedAdjustment?.beneficiaryId
        ),
        isAdd: modifiedAdjustment?.actionType?.english === AdjustmentConstants?.ADJUSTMENT_ACTION_TYPE?.ADD?.english
      });
    });
  }

  navigateOnLinkClick() {
    //this.router.navigate([RouterConstants.ROUTE_CONTRIBUTOR_PROFILE_ENGAGEMENTS(this.sin)]);
    // this.router.navigate(['/home/billing/vic/dashboard'], {
    //   queryParams: {
    //     idNo: this.adjustments?.person?.identity[0]?.newNin,
    //     isDashboard: 'true'
    //   }
    // });
    this.contributorService.selectedSIN = this.sin;
    this.router.navigate([RouterConstants.ROUTE_INDIVIDUAL(this.sin)]);
  }
  getContributor() {
    this.thirdPartyService.getPersonById(this.personId).subscribe(data => {
      this.sin = data?.socialInsuranceNo;
    });
  }
}
