import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import {
  DocumentItem,
  DocumentService,
  RouterDataToken,
  RouterData,
  Channel,
  Role,
  LanguageToken,
  RouterConstants,
  LovList,
  AlertService,
  WorkFlowActions,
  CoreAdjustmentService,
  CoreBenefitService,
  CoreActiveBenefits,
  CoreContributorService,
  BilingualText,
  Alert
} from '@gosi-ui/core';
import {
  AdjustmentDetails,
  AdjustmentPaymentDetails,
  PersonalInformation,
  AdjustmentService,
  PaymentService,
  PaymentRoutesEnum,
  createDetailForm,
  bindQueryParamsToForm,
  AdjustmentConstants,
  ThirdpartyAdjustmentService
} from '../../../../shared';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { isHeirBenefit } from '@gosi-ui/features/benefits/lib/shared/utils';
import { ActiveBenefits } from '@gosi-ui/features/benefits/lib/shared/models';
import { BenefitPropertyService, HeirActiveService } from '@gosi-ui/features/benefits/lib/shared/services';
import { BenefitConstants } from '@gosi-ui/features/benefits/lib/shared';

@Component({
  selector: 'pmt-validator-adjustment-sc',
  templateUrl: './validator-adjustment-sc.component.html',
  styleUrls: ['./validator-adjustment-sc.component.scss']
})
export class ValidatorAdjustmentScComponent extends ValidatorBaseScComponent implements OnInit {
  /**Local Variables */
  activeAdjustments: AdjustmentDetails;
  adjustments: AdjustmentDetails;
  adjustmentInfoMessageList: Array<BilingualText>;
  adjustmentPaymentDetails: AdjustmentPaymentDetails;
  approveComments: boolean;
  personId: number;
  adjModificationId: number;
  documents: DocumentItem[];
  comments;
  checkForm: FormGroup;
  transactionNumber;
  registrationNo;
  requestId: number;
  socialInsuranceNo: number;
  workflowType;
  channel;
  taskId: string;
  user: string;
  adjustmentId: string;
  validatorCanEdit: boolean;
  modalRef: BsModalRef;
  adjustmentType: string;
  canApprove = true;
  disableApprove = false;
  canReject = false;
  canReturn = false;
  gosiEligibilityInfoMsg: Alert;
  isAdustValidPaymenterror = true;
  isAddModify = false;
  lang = 'en';
  payload;
  personDetails: PersonalInformation;
  form: FormGroup;
  returnReasonList: Observable<LovList>;
  rejectReasonList: Observable<LovList>;
  RoleConst = Role;
  rejectWarningMessage = 'PAYMENT.INFO-VALIDATOR-REJECTION-NO-CONTRIBUTOR';
  isDocuments = false;
  referenceNo;

  constructor(
    readonly alertService: AlertService,
    readonly paymentService: PaymentService,
    readonly adjustmentService: AdjustmentService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly documentService: DocumentService,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    readonly modalService: BsModalService,
    readonly coreBenefitService: CoreBenefitService,
    readonly fb: FormBuilder,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly contributorService: CoreContributorService,
    readonly thirdPartyService: ThirdpartyAdjustmentService,
    readonly heirActiveService: HeirActiveService,
    readonly benefitPropertyService: BenefitPropertyService
  ) {
    super(alertService, adjustmentService, coreBenefitService, paymentService, router);
  }

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.alertService.clearAllSuccessAlerts();
    this.personId = this.adjustmentService.personId;
    this.adjModificationId = this.adjustmentService.adjModificationId;
    this.initialiseView(this.routerData);
    this.checkForm = this.createCheckForm();
    this.form = createDetailForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.form);
    this.getContributor();
    this.getAdjustments();
    this.getAdjustmentValidator();
    this.adjustmentId = 'MAINTAIN_ADJUSTMENT';
    this.adjustmentType = 'MAINTAIN_ADJUSTMENT_REQUEST';
    this.getRequiredDocuments();
    this.getadjustmentValidatorPayment();
  }
  initialiseView(routerData) {
    if (routerData.payload) {
      this.payload = JSON.parse(routerData.payload);
      this.personId = this.payload?.PersonId;
      this.adjModificationId = this.payload?.adjustmentModificationId;
      this.registrationNo = this.payload.registrationNo;
      this.referenceNo = this.payload.referenceNo;
      this.sin = this.payload.socialInsuranceNo;
      this.requestId = +this.routerData.idParams.get('id');
      this.socialInsuranceNo = +this.routerData.idParams.get('socialInsuranceNo');
      this.workflowType = this.routerData.idParams.get('resource');
      this.transactionNumber = this.routerData.idParams.get('referenceNo');
      this.channel = this.payload.channel;
      this.taskId = this.routerData.taskId;
      this.user = this.routerData.assigneeId;
      this.comments = this.routerData.comments;
      if (this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1 && this.channel === Channel.FIELD_OFFICE) {
        this.validatorCanEdit = true; // Validator 1 can edit the transaction
      }
      this.setButtonPrivilege(this.payload.assignedRole);
    }
    this.rejectReasonList = this.paymentService.getPaymentRejectReasonList();
    this.returnReasonList = this.paymentService.getPaymentReturnReasonList();
  }
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
  getContributor() {
    if (this.personId) {
      this.adjustmentService.getPerson(this.personId).subscribe(res => {
        this.personDetails = res;
      });
    }
  }
  getAdjustments() {
    if (this.personId && this.sin) {
      this.adjustmentService
        .getAdjustmentsByDualStatus(this.personId, AdjustmentConstants.ACTIVE, AdjustmentConstants.NEW, this.sin)
        .subscribe(adjustmentDetail => {
          this.adjustments = adjustmentDetail;
          if (adjustmentDetail && adjustmentDetail.adjustments && adjustmentDetail.adjustments.length)
            this.isAddModify = true;
          else this.isAddModify = false;
        });
    }
  }
  getAdjustmentValidator() {
    if (this.personId && this.adjModificationId && this.sin) {
      this.adjustmentService.adjustmentValidator(this.personId, this.adjModificationId, this.sin).subscribe(data => {
        this.activeAdjustments = data;
        this.activeAdjustments = {
          adjustments: this.activeAdjustments.adjustments.map(adjustment => {
            if (adjustment?.actionType?.english === 'Modify' && adjustment?.modificationDetails?.afterModification) {
              return {
                ...adjustment,
                notes: adjustment?.modificationDetails?.notes
              };
            } else if (adjustment?.actionType?.english === 'Cancel' && adjustment.cancellationDetails) {
              return { ...adjustment, ...adjustment?.cancellationDetails };
            } else {
              return adjustment;
            }
          }),
          person: this.activeAdjustments.person,
          infoMessages: this.activeAdjustments.infoMessages
        };
        this.adjustmentInfoMessageList = this.activeAdjustments?.gosiEligibilityInfoMsg
          ? this.activeAdjustments?.gosiEligibilityInfoMsg
          : this.activeAdjustments?.infoMessages;

        if (this.adjustmentInfoMessageList && this.adjustmentInfoMessageList?.length > 0) {
          // To do : confirm if list of info msgd are required - (Defect 526399)
          this.alertService.showWarning(this.adjustmentInfoMessageList[0]);
          this.gosiEligibilityInfoMsg = this.thirdPartyService.mapMessagesToAlert({
            details: this.adjustmentInfoMessageList,
            message: null
          });
        }
      });
    }
  }
  createCheckForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [false, { validators: Validators.required }]
    });
  }
  getadjustmentValidatorPayment() {
    if (this.personId && this.adjModificationId && this.sin) {
      this.adjustmentService.adjustmentValidatorPayment(this.personId, this.adjModificationId, this.sin).subscribe(
        pay => {
          this.adjustmentPaymentDetails = pay;
          this.checkForm.get('checkBoxFlag').setValue(this.adjustmentPaymentDetails?.directPaymentStatus);
        },
        err => {
          if (err.status === 400) {
            this.isAdustValidPaymenterror = false;
          }
        }
      );
    }
  }
  getRequiredDocuments() {
    this.documentService.getRequiredDocuments(this.adjustmentId, this.adjustmentType).subscribe(res => {
      this.documents = res;
      this.documents.forEach(doc => {
        this.refreshDocument(doc);
      });
    });
  }
  refreshDocument(doc: DocumentItem) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          this.adjModificationId,
          'MAINTAIN_ADJUSTMENT',
          'MAINTAIN_ADJUSTMENT_REQUEST',
          this.transactionNumber
        )
        .subscribe(res => {
          if (res?.name?.english === 'Benefit Application Form' && res?.documentContent !== null) {
            this.rejectWarningMessage = 'PAYMENT.INFO-VALIDATOR-REJECTION';
          }
          if (res.contentId) {
            this.isDocuments = true;
          }
          doc = res;
        });
    }
  }
  approveTransaction(template) {
    this.showModal(template);
  }
  rejectTransaction(template) {
    this.showModal(template);
  }
  returnTransaction(template) {
    this.showModal(template);
  }
  // This method is to show the modal reference
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  showCancelTemplate(template) {
    this.modalRef = this.modalService.show(template);
  }
  confirmCancel() {
    this.modalRef.hide();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  hideModal() {
    this.modalRef.hide();
  }
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
    this.saveWorkflow(workflowData, true, {
      personId: this.personId,
      adjustmentModificationId: this.adjModificationId,
      initiatePayment: this.checkForm.get('checkBoxFlag').value
    });
    this.hideModal();
  }
  confirmRejectPayment() {
    const workflowData = this.setWorkFlowMergeData(this.form, this.routerData, WorkFlowActions.REJECT);
    this.saveWorkflow(workflowData, true);
    this.hideModal();
  }
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
    this.saveWorkflow(workflowData, true);
    this.hideModal();
  }
  navigateToEdit() {
    this.coreAdjustmentService.identifier = this.personId;
    this.adjustmentService.adjModificationId = this.adjModificationId;
    this.adjustmentService.referenceNumber = this.transactionNumber;
    this.router.navigate(['home/adjustment/add-modify'], { queryParams: { from: 'validator' } });
  }
  navigateToBenefitDetails(adjustment) {
    this.coreAdjustmentService.identifier = this.personId;
    this.coreAdjustmentService.benefitType = adjustment?.benefitType?.english;
    this.coreAdjustmentService.benefitDetails = adjustment;
    this.contributorService.personId = this.personId;
    this.coreBenefitService.setActiveBenefit(
      new CoreActiveBenefits(adjustment?.sin, adjustment?.benefitRequestId, adjustment?.benefitType, this.referenceNo)
    );
    if (
      isHeirBenefit(adjustment?.benefitType?.english) ||
      adjustment?.benefitType?.english === "Survivor's Pension" ||
      adjustment?.benefitType?.english === "Survivor's Pension(Missing Worker)"
    ) {
      const activeHeirDetail = {
        personId: this.personId,
        sin: adjustment?.sin,
        benefitRequestId: adjustment?.benefitRequestId,
        benefitType: adjustment?.benefitType?.english
      };
      this.heirActiveService.setActiveHeirDetails(activeHeirDetail);
      this.router.navigate([PaymentRoutesEnum.ROUTE_ACTIVE_HEIR_DETAILS]);
      //this.router.navigate([PaymentRoutesEnum.ROUTE_ACTIVE_HEIR_BENEFIT]);
    } else {
      this.router.navigate([PaymentRoutesEnum.ROUTE_MODIFY_RETIREMENT]);
    }
  }
  naviagteToAdjustmentView(adjustment) {
    this.coreAdjustmentService.identifier = this.personId;
    this.coreAdjustmentService.sin = this.sin;
    this.router.navigate(['/home/adjustment/benefit-adjustment'], {
      queryParams: { adjustmentId: adjustment?.adjustmentId }
    });
  }
  /** Method to navigate to Contributor */
  viewContributorInfo() {
    this.router.navigate([BenefitConstants.ROUTE_INDIVIDUAL(this.sin)]);
  }
}
