import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import {
  AlertService,
  BPMUpdateRequest,
  Channel,
  CommonIdentity,
  Contributor,
  DocumentItem,
  LovList,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  WorkFlowActions,
  checkIqamaOrBorderOrPassport,
  getPersonNameAsBilingual,
  CoreAdjustmentService
} from '@gosi-ui/core';
import {
  BenefitConstants,
  BenefitDocumentService,
  DirectPaymentService,
  ManageBenefitService,
  UIPayloadKeyEnum,
  WorkFlowType,
  bindQueryParamsToForm,
  createDetailForm,
  setWorkFlowData,
  setWorkFlowDataForMerge
} from '../../../shared';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PaymentService } from '@gosi-ui/features/payment/lib/shared';

@Component({
  selector: 'bnt-validator-direct-payment-sc',
  templateUrl: './validator-direct-payment-sc.component.html',
  styleUrls: ['./validator-direct-payment-sc.component.scss']
})
export class ValidatorDirectPaymentScComponent implements OnInit {
  validatorCanEdit = false;
  socialInsuranceNo: number;
  referenceNo: number;
  commonModalRef: BsModalRef;
  documentList: DocumentItem[];
  transactionRefData: TransactionReferenceData[] = [];
  rolesEnum = Role;
  channel: string;
  Channel = Channel;
  isSmallScreen = false;
  directPaymentForm: FormGroup;
  rejectReasonList$: Observable<LovList> = new Observable<LovList>(null);
  returnReasonList$: Observable<LovList> = new Observable<LovList>(null);
  //To be removed
  identity: CommonIdentity;
  contributorDetails: Contributor;
  heirDetails: any;
  annuityBenefitDetails: any;
  workflowType: WorkFlowType;
  taskId: string;
  user: string;
  comments;
  canReturn = false;
  canReject = false;
  bankTransferValue = { arabic: 'التحويل المصرفي', english: 'Bank Transfer' };

  constructor(
    private alertService: AlertService,
    readonly benefitDocumentService: BenefitDocumentService,
    private directPaymentService: DirectPaymentService,
    private manageBenefitService: ManageBenefitService,
    readonly paymentService: PaymentService,
    readonly router: Router,
    readonly fb: FormBuilder,
    readonly modalService: BsModalService,
    readonly adjustmentPaymentService: CoreAdjustmentService,
    @Inject(RouterDataToken) readonly routerData: RouterData
  ) { }

  ngOnInit(): void {
    // this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.rejectReasonList$ = this.paymentService.getPaymentRejectReasonList();
    this.returnReasonList$ = this.paymentService.getPaymentReturnReasonList();
    this.directPaymentForm = createDetailForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.directPaymentForm);
    this.initialiseTheView(this.routerData);
    this.getHeirDetails(this.socialInsuranceNo, this.referenceNo);
    this.getscannedDocuments(this.socialInsuranceNo, this.referenceNo);
   /*  this.activeBenefit = this.coreBenefitService.getSavedActiveBenefit();
    if (this.isEditMode) {
      this.referenceNo = this.directPaymentService.getReferenceNo();
      const paymentSourceId = this.directPaymentService.getPaymentSourceId();
      this.activeBenefit = new CoreActiveBenefits(paymentSourceId, null, null, this.referenceNo);
    } */
  }

  initialiseTheView(routerData: RouterData) {
    this.setButtonConditions(routerData.assignedRole);
    this.transactionRefData = this.routerData.comments;
    if (routerData.payload) {
      const payload = JSON.parse(routerData.payload);
      this.socialInsuranceNo = +this.routerData.idParams.get(UIPayloadKeyEnum.ID);
      this.workflowType = this.routerData.idParams.get(UIPayloadKeyEnum.RESOURCE);
      this.referenceNo = this.routerData.idParams.get(UIPayloadKeyEnum.REFERENCE_NO);
      this.channel = payload.channel;
      this.taskId = this.routerData.taskId;
      this.user = this.routerData.assigneeId;
      this.comments = this.routerData.comments;
      this.transactionRefData = this.routerData.comments;
      if (this.channel === Channel.FIELD_OFFICE && this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1) {
        this.validatorCanEdit = true; // Validator 1 can edit the transaction
      }
    }
  }
  getHeirDetails(socialInsuranceNo, referenceNo) {
    this.directPaymentService.getHeirListForDirectPayment(socialInsuranceNo, referenceNo).subscribe(res => {
      this.heirDetails = res;
      this.heirDetails.heirs = this.heirDetails?.heirs?.map(heir => {
        heir.identity = checkIqamaOrBorderOrPassport(heir?.person?.identity);
        heir.person.nameBilingual = getPersonNameAsBilingual(heir?.person?.name);
        if (heir?.directPaymentOpted) return heir;
      });
      this.heirDetails.contributorDetails.nameBilingual = getPersonNameAsBilingual(
        this.heirDetails?.contributorDetails?.name
      );
      if (res?.contributorDetails?.identity)
        this.identity = checkIqamaOrBorderOrPassport(res?.contributorDetails?.identity);
    });
  }
  getscannedDocuments(sin, referenceNo) {
    this.directPaymentService.getUploadedDocuments(sin, referenceNo).subscribe(res => {
      this.documentList = res;
    });
  }
  navigateToEdit() {
    this.directPaymentService.setReferenceNo(this.referenceNo);
    this.directPaymentService.setPaymentSourceId(this.socialInsuranceNo);
    this.router.navigate([BenefitConstants.ROUTE_HEIR_DIRECT_PAYMENT], {
      queryParams: {
        isEdit: true
      }
    });
  }

  /*To show Button conditions*/
  setButtonConditions(assignedRole) {
    switch (assignedRole) {
      case this.rolesEnum.VALIDATOR_1:
        {
          this.canReject = true;
          if (this.channel === Channel.GOSI_ONLINE) {
            this.canReturn = true;
          }
        }
        break;
      case this.rolesEnum.VALIDATOR_2:
        this.canReturn = true;
        this.canReject = true;
        break;
      case this.rolesEnum.FC_APPROVER_ANNUITY:
        this.canReturn = true;
        break;
      case this.rolesEnum.CNT_FC_APPROVER:
        this.canReturn = true;
        break;
    }
  }
  viewContributorDetails() {
      this.router.navigate([BenefitConstants.ROUTE_INDIVIDUAL(this.socialInsuranceNo)]);
   }

  /** Validator action related functions */
  // This method is to show the modal reference
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  // This method is used to show the cancellation template on click of cancel
  showCancelTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.commonModalRef = this.modalService.show(template, config);
  }
  //This method is used to confirm cancellation of transaction
  confirmCancel() {
    this.commonModalRef.hide();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  //  This method is to hide the modal reference
  hideModal() {
    if (this.commonModalRef) {
      this.commonModalRef.hide();
    }
  }

  confirmApproveBenefit() {
    const workflowData = setWorkFlowData(this.directPaymentForm, this.routerData, this.referenceNo);
    workflowData.outcome = WorkFlowActions.APPROVE;
    this.saveWorkflow(workflowData);
    this.hideModal();
  }

  confirmRejectBenefit() {
    const workflowData = setWorkFlowDataForMerge(this.routerData, this.directPaymentForm, WorkFlowActions.REJECT);
    this.saveWorkflow(workflowData);
    this.hideModal();
  }

  returnBenefit() {
    const workflowData = setWorkFlowDataForMerge(this.routerData, this.directPaymentForm, WorkFlowActions.RETURN);
    //const workflowData = setWorkFlowData(childCompForm, this.routerData, this.referenceNo);
    workflowData.outcome = WorkFlowActions.RETURN;
    this.saveWorkflow(workflowData);
    this.hideModal();
  }

  //Method to sae workflow details.
  saveWorkflow(data: BPMUpdateRequest) {
    this.manageBenefitService.updateAnnuityWorkflow(data).subscribe(
      () => {
        if (data.outcome === WorkFlowActions.APPROVE) {
          this.alertService.showSuccessByKey('BENEFITS.REQUEST_STATUS_APPROVED');
        } else if (data.outcome === WorkFlowActions.REJECT) {
          this.alertService.showSuccessByKey('BENEFITS.REQUEST_STATUS_REJECTED');
        } else if (data.outcome === WorkFlowActions.RETURN) {
          this.alertService.showSuccessByKey('BENEFITS.REQUEST_STATUS_RETURNED');
        } else if (data.outcome === WorkFlowActions.SEND_FOR_INSPECTION) {
          this.alertService.showSuccessByKey('BENEFITS.REQUEST_STATUS_INSPECTION');
        }
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
      },
      err => {
        if (err.status === 400 || err.status === 422) {
          this.alertService.showError(err.error.message);
        }
        if (err.status === 500 || err.status === 404) {
          this.alertService.showErrorByKey('BENEFITS.SUBMIT-FAILED-MSG');
        }
      }
    );
  }

  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }

  viewAdjustmentDetails(heir){
    this.adjustmentPaymentService.identifier = heir?.person?.personId
    this.adjustmentPaymentService.socialNumber = this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT]);
  } 
}
