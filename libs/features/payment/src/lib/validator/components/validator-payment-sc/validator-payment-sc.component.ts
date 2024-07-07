import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import {
  DocumentItem,
  RouterDataToken,
  RouterData,
  Channel,
  Role,
  LovList,
  TransactionStatus,
  RouterConstants,
  WorkFlowActions,
  AlertService,
  DocumentService,
  BilingualText,
  LookupService,
  LanguageToken,
  Contributor,
  SamaVerificationStatus,
  RoleIdEnum,
  BenefitsGosiShowRolesConstants
} from '@gosi-ui/core';
import { PaymentService, MiscellaneousPaymentRequest, AdjustmentService, PersonBankDetails } from '../../../shared';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'pmt-validator-payment-sc',
  templateUrl: './validator-payment-sc.component.html',
  styleUrls: ['./validator-payment-sc.component.scss']
})
export class ValidatorPaymentScComponent extends ValidatorBaseScComponent implements OnInit {
  /**Local Variables */
  comments;
  documents: DocumentItem[];
  validDetails: MiscellaneousPaymentRequest;
  disableApprove = false;
  canApprove = true;
  canReject = false;
  canReturn = false;
  form: FormGroup;
  personId: number;
  returnReasonList: Observable<LovList>;
  rejectReasonList: Observable<LovList>;
  transactionNumber;
  registrationNo;
  requestId: number;
  socialInsuranceNo: number;
  workflowType;
  channel;
  taskId: string;
  user: string;
  transactionId: string;
  transactionType: string;
  validatorCanEdit: boolean;
  modalRef: BsModalRef;
  transactionReference;
  userName;
  approveComments: boolean;
  isIbanVerified = true;
  miscPaymentId;
  paymentSuccessMsg: BilingualText;
  bankName;
  isSaveDisabled: boolean;
  bankDetails: PersonBankDetails;
  RoleConst = Role;
  lang = 'en';
  isDocuments = false;
  contributor: Contributor;
  payeeSourceId: number;
  validatorAccess = BenefitsGosiShowRolesConstants.VALIDATOR_ROLES;

  constructor(
    readonly alertService: AlertService,
    readonly paymentService: PaymentService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly lookupService: LookupService,
    readonly adjustmentService: AdjustmentService
  ) {
    super(alertService, paymentService, router);
  }

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.initialiseView(this.routerData);
    this.form = createDetailForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.form);
  }
  /**The method to call the Contributor details */
  getValidatorDetailService() {
    this.paymentService.validatorDetails(this.routerData.idParams.get('id'), this.miscPaymentId, this.payeeSourceId).subscribe(data => {
      this.validDetails = data;
      this.bankDetails = this.validDetails?.bankAccountList[0];
      if(this.bankDetails?.bankWarningMessage) this.alertService.showWarning(this.bankDetails?.bankWarningMessage);
      if (this.bankDetails && this.bankDetails?.verificationStatus === SamaVerificationStatus.SAMA_VERIFICATION_FAILED)
        this.disableApprove = true;
      this.paymentService.bankDetails = this.bankDetails;
      this.disableApprove = this.bankDetails?.disableApprove;
      if(this.bankDetails?.bankWarningMessage) this.alertService.showWarning(this.bankDetails?.bankWarningMessage);
    });
  }
  /** Method to cancel payment flow and return to inbox */
  confirmCancel() {
    this.modalRef.hide();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /** Method to hide modal */
  hideModal() {
    this.modalRef.hide();
  }
  /** Method to reject transaction */
  confirmRejectPayment() {
    const workflowData = this.setWorkFlowMergeData(this.form, this.routerData, WorkFlowActions.REJECT);
    this.saveWorkflow(workflowData);
    this.hideModal();
  }
  /** Method to return transaction */
  returnPayment() {
    const workflowData = this.setWorkFlowData(
      this.form,
      this.taskId,
      this.registrationNo,
      this.user,
      this.routerData,
      this.transactionNumber
    );
    workflowData.outcome = WorkFlowActions.RETURN;
    this.saveWorkflow(workflowData);
    this.hideModal();
  }
  /** Method to assign router data to properties */
  initialiseView(routerData) {
    if (routerData.payload) {
      const payload = JSON.parse(routerData.payload);
      this.registrationNo = payload.registrationNo;
      this.personId = payload.socialInsuranceNo;
      this.requestId = +this.routerData.idParams.get('id');
      this.socialInsuranceNo = +this.routerData.idParams.get('socialInsuranceNo');
      this.workflowType = this.routerData.idParams.get('resource');
      this.transactionNumber = this.routerData.idParams.get('referenceNo');
      this.miscPaymentId = this.routerData.idParams.get('miscPaymentId');
      this.payeeSourceId = payload.payeeSourceId;
      this.channel = payload.channel;
      this.taskId = this.routerData.taskId;
      this.user = this.routerData.assigneeId;
      this.comments = this.routerData.comments;
      if (this.routerData.assignedRole === Role.VALIDATOR_1 && this.channel === Channel.FIELD_OFFICE) {
        this.validatorCanEdit = true; // Validator 1 can edit the transaction
      }
      this.transactionId = 'MISCELLANEOUS_PAYMENT';
      this.transactionType = 'MISCELLANEOUS_PAYMENT_REQUEST';
      this.getValidatorDetailService();
      this.setButtonPrivilege(payload.assignedRole);
      this.trackTransaction();
      this.getRequiredDocuments();
      this.getPersonDetailsByNin();
    }
    this.rejectReasonList = this.paymentService.getPaymentRejectReasonList();
    this.returnReasonList = this.paymentService.getPaymentReturnReasonList();
  }
  getPersonDetailsByNin() {
    this.paymentService
      .getPersonByNin(this.requestId)
      .pipe(
        switchMap(res => {
          return this.getPersonDetailsById(res?.listOfPersons[0]?.personId);
        })
      )
      .subscribe(res => (this.contributor = res));
  }
  getPersonDetailsById(personId) {
    return this.adjustmentService.getPersonById(personId);
  }
  /** Method to set button privilege */
  setButtonPrivilege(role) {
    if (role === Role.VALIDATOR_1) {
      this.canReject = true;
    } else if (role === Role.VALIDATOR_2) {
      this.canReturn = true;
      this.canReject = true;
    } else if (role === 'FC Approver') {
      this.canReturn = true;
    }
  }
  // This method is to show the modal reference
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  /** Method to confirm Approve transaction */
  confirmApprovePayment() {
    const workflowData = this.setWorkFlowData(
      this.form,
      this.taskId,
      this.registrationNo,
      this.user,
      this.routerData,
      this.transactionNumber
    );
    workflowData.outcome = WorkFlowActions.APPROVE;
    this.saveWorkflow(workflowData);
    this.hideModal();
  }
  // Method to track transaction of Validator 1
  trackTransaction() {
    if (this.comments) {
      this.transactionReference = this.comments;
      if (this.comments.length > 0) {
        const transRefData = [];
        this.comments.forEach(data => {
          if (data.comments !== null) {
            transRefData.push(data);
          }
        });
        this.userName = this.comments[0].userName;
      }
      // todo: KP need to revisit transaction step status check
      this.transactionReference.forEach(item => {
        if (
          item &&
          item.role?.english === 'First Validator' &&
          item.transactionStepStatus?.toLowerCase() === 'validator submit'
        ) {
          if (item.transactionStatus?.toLowerCase() === TransactionStatus.COMPLETED.toLowerCase()) {
            if (this.routerData.assignedRole === Role.VALIDATOR_1) {
              this.approveComments = true;
              return;
            } else {
              this.approveComments = false;
            }
          } else if (item?.transactionStatus?.toLowerCase() === TransactionStatus.IN_PROGRESS.toLowerCase()) {
            if (this.routerData.assignedRole === Role.VALIDATOR_1) {
              this.disableApprove = true;
              return;
            } else {
              this.disableApprove = false;
            }
          }
        }
      });
    }
  }
  /** Method to get required documents */
  getRequiredDocuments() {
    this.documentService.getRequiredDocuments(this.transactionId, this.transactionType).subscribe(res => {
      this.documents = res;
      this.documents.forEach(doc => {
        this.refreshDocument(doc);
      });
    });
  }
  /** Method to refresh documents */
  refreshDocument(doc: DocumentItem) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          this.miscPaymentId,
          'MISCELLANEOUS_PAYMENT',
          'MISCELLANEOUS_PAYMENT_REQUEST',
          this.transactionNumber
        )
        .subscribe(res => {
          if (res.contentId) {
            this.isDocuments = true;
          }
          doc = res;
        });
    }
  }
  /** Method to navigate to payonline by validator */
  navigateToEdit() {
    this.router.navigate(['/home/payment/payonline'], { queryParams: { from: 'validator' } });
  }
  /**
   * Method to navigate to contributor profile
   */
  navigateToContributorDetails() {
    this.router.navigate([`/home/profile/individual/internal/${this.contributor?.socialInsuranceNo}`]);
  }
}
export const createDetailForm = function (fb: FormBuilder) {
  let form: FormGroup;
  form = fb.group({
    taskId: [null],
    user: [null],
    status: [null],
    rejectionIndicator: [null]
  });
  return form;
};
export const bindQueryParamsToForm = function (routerData: RouterData, childForm: FormGroup) {
  if (routerData) {
    childForm.get('taskId').setValue(routerData.taskId);
    childForm.get('user').setValue(routerData.assigneeId);
  }
};
