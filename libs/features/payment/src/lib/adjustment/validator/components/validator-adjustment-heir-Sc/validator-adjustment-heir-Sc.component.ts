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
  checkIqamaOrBorderOrPassport,
  BPMUpdateRequest
} from '@gosi-ui/core';
import {
  AdjustmentDetails,
  PersonalInformation,
  AdjustmentService,
  PaymentService,
  PaymentRoutesEnum,
  createDetailForm,
  AdjustmentConstants,
  HeirAdjustments,
  AnnuityResponseDto,
  BenefitConstants
} from '../../../../shared';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { map, switchMap } from 'rxjs/operators';
import { HeirActiveService } from '@gosi-ui/features/benefits/lib/shared/services/heir-active.service';
import { BenefitPropertyService } from '@gosi-ui/features/benefits/lib/shared/services';

@Component({
  selector: 'pmt-validator-adjustment-heir-Sc',
  templateUrl: './validator-adjustment-heir-Sc.component.html',
  styleUrls: ['./validator-adjustment-heir-Sc.component.scss']
})
export class ValidatorAdjustmentHeirScComponent extends ValidatorBaseScComponent implements OnInit {
  /**Local Variables */
  activeAdjustments: HeirAdjustments;
  adjustments: AdjustmentDetails;
  approveComments: boolean;
  personId: number;
  adjModificationId: number;
  documents: DocumentItem[];
  comments;
  checkForm: FormArray;
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
  Math = Math;
  disableDirectPayment = false;
  benefitDetails: AnnuityResponseDto;

  constructor(
    readonly adjustmentService: AdjustmentService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    readonly fb: FormBuilder,
    readonly paymentService: PaymentService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly contributorService: CoreContributorService,
    readonly documentService: DocumentService,
    readonly heirActiveService: HeirActiveService,
    readonly benefitPropertyService: BenefitPropertyService
  ) {
    super(alertService, adjustmentService, coreBenefitService, paymentService, router);
  }

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.initialiseView(this.routerData);
    this.form = createDetailForm(this.fb);
    this.checkForm = this.fb.array([]);
    this.getContributor();
    this.getAdjustmentById();
    this.getHeirRequiredDocument(AdjustmentConstants.HEIR_ADJUSTMENT_ID, AdjustmentConstants.HEIR_ADJUSTMENT_TYPE);
  }
  initialiseView(routerData) {
    if (routerData.payload) {
      this.payload = JSON.parse(routerData.payload);
      this.personId = this.payload?.PersonId;
      this.adjModificationId = this.payload?.adjustmentModificationId;
      this.registrationNo = this.payload.registrationNo;
      this.referenceNo = this.payload.referenceNo;
      this.requestId = +this.routerData.idParams.get('id');
      this.socialInsuranceNo = +this.routerData.idParams.get('socialInsuranceNo');
      this.sin = this.payload.socialInsuranceNo;
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
  getContributor() {
    this.adjustmentService
      .getPersonDetails(this.socialInsuranceNo, this.requestId)
      .pipe(
        map(data => (this.benefitDetails = data)),
        switchMap(data => this.getPersonDetails(data.personId))
      )
      .subscribe(res => {
        this.personId = res.personId;
        this.personDetails = res;
      });
  }
  getPersonDetails(personId) {
    return this.adjustmentService.getPerson(personId);
  }
  getAdjustmentById() {
    if(this.socialInsuranceNo && this.requestId && this.adjModificationId){
    this.adjustmentService
      .getHeirAdjustmentById(this.socialInsuranceNo, this.requestId, this.adjModificationId)
      .subscribe(adjustments => {
        this.activeAdjustments = adjustments;
        this.activeAdjustments.heirList.forEach(heir => {
          this.checkForm.push(
            this.fb.group({
              directPayment: [heir.directPaymentStatus],
              personId: [heir.heirPersonId]
            })
          );
        });
      });
    }  
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
    this.approveHeirWorkflow(workflowData);
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
    this.router.navigate(['home/adjustment/heir-adjustment'], { queryParams: { from: 'validator' } });
  }
  navigateToBenefitDetails(adjustment) {
    this.coreAdjustmentService.identifier = this.personId;
    this.coreAdjustmentService.benefitType = adjustment?.benefitType?.english;
    this.coreAdjustmentService.benefitDetails = adjustment;
    this.contributorService.personId = this.personId;
    this.coreBenefitService.setActiveBenefit(
      new CoreActiveBenefits(adjustment?.sin, adjustment?.benefitRequestId, adjustment?.benefitType, this.referenceNo)
    );
    this.router.navigate([PaymentRoutesEnum.ROUTE_MODIFY_RETIREMENT]);
  }
  naviagteToAdjustmentView(adjustment) {
    this.coreAdjustmentService.identifier = this.personId;
    this.router.navigate(['/home/adjustment/benefit-adjustment'], {
      queryParams: { adjustmentId: adjustment?.adjustmentId }
    });
  }
  /** Method to navigate to Contributor */
  viewContributorInfo() {
    this.router.navigate([`home/profile/contributor/${this.socialInsuranceNo}/info`]);
  }
  // viewAdjustmentDetails(heirPersonId: number) {
  //   this.coreAdjustmentService.identifier = heirPersonId;
  //   this.coreAdjustmentService.sin = this.sin;
  //   this.router.navigate([AdjustmentConstants.ROUTE_ADJUSTMENT]);
  // }
  navigateToHeirDetails(heirPersonId) {
    const activeHeirDetail = {
      personId: heirPersonId,
      sin: this.sin,
      benefitRequestId: this.requestId,
      benefitType: this.benefitDetails.benefitType
    };
    this.heirActiveService.setActiveHeirDetails(activeHeirDetail);
    this.router.navigate([BenefitConstants.ROUTE_ACTIVE_HEIR_DETAILS]);
  }
  /** Method to get required document list. */
  getHeirRequiredDocument(transactionId: string, transactionType: string) {
    this.documentService.getRequiredDocuments(transactionId, transactionType).subscribe(doc => {
      this.documents = doc;
      this.documents.forEach(docItem => {
        this.refreshHeirDocument(docItem);
      });
    });
  }
  /**
   * Method to refresh documents after scan.
   * @param doc document
   */
  refreshHeirDocument(doc: DocumentItem) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          this.adjModificationId,
          AdjustmentConstants.HEIR_ADJUSTMENT_ID,
          AdjustmentConstants.HEIR_ADJUSTMENT_TYPE,
          this.referenceNumber
        )
        .subscribe(res => {
          if (res?.name?.english === 'Benefit Application Form' && res?.documentContent !== null) {
            this.rejectWarningMessage = 'PAYMENT.INFO-VALIDATOR-REJECTION';
          }
          this.isDocuments = true;
          doc = res;
        });
    }
  }
  getHeir(identity) {
    return checkIqamaOrBorderOrPassport(identity);
  }
  approveHeirWorkflow(data: BPMUpdateRequest) {
    this.paymentService.handleAnnuityWorkflowActions(data).subscribe(
      () => {
        this.alertService.showSuccessByKey('ADJUSTMENT.TRANSACTION-APPROVED');
        if (data.assignedRole === 'Validator1' || data.assignedRole === 'Validator2') {
          this.adjustmentService
            .editHeirDirectPayment(this.socialInsuranceNo, this.requestId, this.adjModificationId, {
              directPaymentStatusUpdate: this.checkForm.value
            })
            .subscribe();
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
}
