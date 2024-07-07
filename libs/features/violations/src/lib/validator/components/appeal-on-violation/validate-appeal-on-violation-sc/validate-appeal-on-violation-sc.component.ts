import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BPMMergeUpdateParamEnum,
  BPMUpdateRequest,
  DocumentService,
  LookupService,
  Lov,
  LovList,
  markFormGroupTouched,
  RouterData,
  RouterDataToken,
  scrollToTop,
  TransactionService,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { ViolationsValidatorService, ViolationTransaction } from '@gosi-ui/features/violations/lib/shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  AppealContributors,
  AppealOnViolation
} from '@gosi-ui/features/violations/lib/shared/models/appeal-on-violation';
import { Observable } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppealValidatorRoles } from '../../../../shared/enums/appeal-validator-roles';
import { AppealVlidatorBaseScComponent } from '../../../../shared/components';
import { AppealViolationsService } from '@gosi-ui/features/violations/lib/shared/services/appeal-violations.service';
import { LegalAuditor, LegalManager, LegalReviewer, Reviewer } from '@gosi-ui/features/appeals/lib/shared';
import { AppealClerk } from '@gosi-ui/features/appeals/lib/shared/models/employees/appeal-clerk';

@Component({
  selector: 'validate-appeal-on-violation-sc',
  templateUrl: './validate-appeal-on-violation-sc.component.html',
  styleUrls: ['./validate-appeal-on-violation-sc.component.scss']
})
export class ValidateAppealOnViolationScComponent extends AppealVlidatorBaseScComponent implements OnInit {
  //Local Variables
  transactionNo: number;
  appeal: AppealOnViolation;
  opinionList$: Observable<LovList>;
  legalOpinionList$: Observable<LovList>;
  booleanList: LovList = {
    items: [
      { value: { english: 'Yes', arabic: 'نعم' }, sequence: 0 },
      { value: { english: 'No', arabic: 'لا' }, sequence: 1 }
    ]
  };

  transactionDetails: ViolationTransaction;
  formValidatorAppeal: FormGroup = new FormGroup({});
  validatorMemberForm: FormGroup = new FormGroup({});
  appealSpecialistList: Lov[] = [];
  legalOpinionsList: Lov[];
  appealSearchList: Lov[];
  validMandatory = false;
  sequenceNumber: number;
  /**
   *
   * @param modalService
   * @param alertService
   * @param workflowService
   * @param router
   * @param lookupService
   * @param documentService
   * @param routerDataToken
   */
  constructor(
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly validatorService: ViolationsValidatorService,
    readonly transactionService: TransactionService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appTokenValue: string,
    readonly fb: FormBuilder,
    readonly appealVlcService: AppealViolationsService
  ) {
    super(
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      validatorService,
      appealVlcService,
      router,
      routerDataToken,
      appTokenValue
    );
  }

  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.initialiseParams();
    this.alertService.clearAlerts();
    this.transactionNo = this.referenceNo;
  }

  initialiseParams() {
    if (this.routerDataToken.taskId === undefined || this.routerDataToken.taskId === null) {
      this.routeToInbox();
    }

    this.getLovList();

    super.getDataFromToken(this.routerDataToken);
    super.getViolationDetails();
    this.getLockups();
    super.getAppealDetails();
    this.getDocuments(this.referenceNo);
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, isValid: boolean, isReturn: boolean = false): void {
    if (this.assignedRole === AppealValidatorRoles.Executor_Violation || this.isSpecialist) {
      isValid = false;
    }
    this.alertService.clearAlerts();
    const isRequired = isValid ? this.ValidateForm() && this.ValidateContributor() : true;
    if (isRequired) {
      this.isButtonApprove = true;
      this.modalRef = this.modalService.show(templateRef, {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true
      });
    }
  }
  showReturnModal(templateRef: TemplateRef<HTMLElement>, isValid: boolean): void {
    this.isButtonApprove = true;
    this.modalRef = this.modalService.show(templateRef, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true
    });
  }

  onAssignToSpecialistClicked(template: TemplateRef<HTMLElement>): void {
    this.modalRef = this.modalService.show(template);
  }

  ValidateForm() {
    const index = this.validatorAppealControl?.controls?.findIndex(control => control.invalid);
    if (index == -1) return true;
    else {
      this.appeal.contributors[index].showSaveError = true;
      const element = document.getElementById('contributorSection');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }

      this.formValidatorAppeal.markAllAsTouched();
      this.alertService.showMandatoryErrorMessage();
      scrollToTop();
      return false;
    }
  }

  /**
   * Method to check whether contributor details are saved.
   * @param contributorList
   */
  checkContributorsSaved(contributorList: AppealContributors[]): boolean {
    let isSaved = true;
    contributorList.forEach(element => {
      if (!element?.isSaved) isSaved = false;
    });
    return isSaved;
  }

  ValidateContributor() {
    if (this.checkContributorsSaved(this.appeal?.contributors)) return true;
    else {
      this.appeal.showSaveError = true;
      const element = document.getElementById('contributorSection');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
      return false;
    }
  }

  /**Method to return to inbox */
  confirmCancel() {
    this.modalRef.hide();
    super.routeToInbox();
  }

  /**
   * This method is to check if the transaction is reject.
   */
  isReject() {
    if (!this.validatorAppealControl?.controls) return false;

    let rejected = true;
    switch (this.assignedRole) {
      case AppealValidatorRoles.Establishments_specialist_violation:
      case AppealValidatorRoles.OH_and_pensions_specialist_violation:
      case AppealValidatorRoles.Individuals_Preparation_Specialist_Violation:
      case AppealValidatorRoles.Private_Collection_Specialist_Violation:

      case AppealValidatorRoles.Preparation_Team_Violation:
      case AppealValidatorRoles.Appeal_Clerk_Violation:
      case AppealValidatorRoles.Committee_secretary_violation:
      case AppealValidatorRoles.Executor_Violation:
        rejected = false;

      case AppealValidatorRoles.IS_REVIEWER_VIOLATION:
        loop1: for (const item of this.validatorAppealControl?.controls) {
          if (+item.value.reviewerDecision?.english === 103) {
            rejected = true;
            break loop1; // Break out of the labeled loop
          } else {
            rejected = false;
          }
        }
        break;

      case AppealValidatorRoles.Legal_Reviewer_Violation:
        loop1: for (const item of this.validatorAppealControl?.controls) {
          if (+item.value.legalOpinion?.english === 103) {
            rejected = true;
            break loop1; // Break out of the labeled loop
          } else {
            rejected = false;
          }
        }
        break;

      case AppealValidatorRoles.Legal_Auditor_Violation:
        this.validatorAppealControl?.controls?.some((item, i) => {
          if (item.value.auditorDecision?.english === 'Reject') {
            if (this.appeal.contributors[i].legalOpinion?.english === 'Reject') {
              rejected = false;
            } else {
              rejected = true;
              return true; // Break the loop
            }
          } else {
            if (this.appeal.contributors[i].legalOpinion?.english === 'Reject') {
              rejected = true;
              return true; // Break the loop
            } else {
              rejected = false;
            }
          }
        });

        break;

      case AppealValidatorRoles.Legal_Manger_Violation:
        loop1: for (const item of this.validatorAppealControl?.controls) {
          if (+item.value.finalLegalOpinion?.english === 103) {
            rejected = true;
            break loop1; // Break out of the labeled loop
          } else {
            rejected = false;
          }
        }
        break;
    }

    return rejected;
  }
  /** Method to handle workflow events. */
  manageWorkflowTransaction(currentAction: number) {
    if (!currentAction) currentAction = this.isReject() ? 1 : 0;

    let bpmUpdateRequest = new BPMUpdateRequest();

    bpmUpdateRequest.payload = this.routerDataToken.content;
    bpmUpdateRequest.roleId = this.roleId;

    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.outcome = super.getWorkflowActions(currentAction);
    bpmUpdateRequest = this.setUserToPayload(bpmUpdateRequest);

    if (this.validatorMemberForm.get('rejectionReason'))
      bpmUpdateRequest.rejectionReason = this.validatorMemberForm.get('rejectionReason').value;
    if (this.validatorMemberForm.get('comments'))
      bpmUpdateRequest.comments = this.validatorMemberForm.get('comments').value;
    if (this.validatorMemberForm.get('returnReason'))
      bpmUpdateRequest.returnReason = this.validatorMemberForm.get('returnReason').value;

    if (this.roleId == 171 && WorkFlowActions.RETURN === bpmUpdateRequest.outcome)
      bpmUpdateRequest.isExternalComment = true;

    this.saveWorkflow(bpmUpdateRequest);

    currentAction === 0 ? super.hideModal(true) : super.hideModal();
  }

  get validatorAppealControl(): FormArray {
    return this.formValidatorAppeal.get('contributordetails') as FormArray;
  }

  setUserToPayload(request: BPMUpdateRequest): BPMUpdateRequest {
    request.updateMap.set(BPMMergeUpdateParamEnum.USER_ID, this.routerDataToken.assigneeId);
    request.updateMap.set(BPMMergeUpdateParamEnum.REQUEST_USER_ID, this.routerDataToken.assigneeId);
    request.updateMap.set(BPMMergeUpdateParamEnum.UPDATED_BY, { id: this.routerDataToken.assigneeId });
    request.updateMap.set(BPMMergeUpdateParamEnum.ROLE_ID, request.roleId);
    request.updateMap.set(BPMMergeUpdateParamEnum.REQUEST_ROLE_ID, request.roleId);
    request.updateMap.set(BPMMergeUpdateParamEnum.REQUEST_UPDATED_BY, { id: this.routerDataToken.assigneeId });
    return request;
  }

  submitAppealContributor(i) {
    this.alertService.clearAlerts();
    if (this.validatorAppealControl?.controls[i].valid) {
      let request;

      switch (this.assignedRole) {
        case AppealValidatorRoles.IS_REVIEWER_VIOLATION:
          request = this.mapReviewObject(this.validatorAppealControl?.controls[i].value);
          break;
        case AppealValidatorRoles.Legal_Reviewer_Violation:
          request = this.mapLegalReviewerObject(this.validatorAppealControl?.controls[i].value);
          break;
        case AppealValidatorRoles.Legal_Auditor_Violation:
          request = this.mapLegalAuditorObject(this.validatorAppealControl?.controls[i].value);
          break;
        case AppealValidatorRoles.Legal_Manger_Violation:
          request = this.mapLegalMangerObject(this.validatorAppealControl?.controls[i].value);
          break;
        case AppealValidatorRoles.Executor_Violation:
          request = {
            executorDecision: this.validatorAppealControl?.controls[i].value.executorDecision?.english === 'Approve',
            executorComments: this.validatorAppealControl?.controls[i].value.executorComments
          };
          break;
        case AppealValidatorRoles.Preparation_Team_Violation:
          request = { summary: this.validatorAppealControl?.controls[i].value?.summary };
          break;

        case AppealValidatorRoles.Appeal_Clerk_Violation:
          request = this.mapAppealClerkObject(this.validatorAppealControl?.controls[i].value);
          break;
      }
      if (!request) return;
      request.contributorId = this.validatorAppealControl?.controls[i].value?.contributorId;
      this.appealVlcService.updateAppealDecisionAov(this.appealId, this.roleId, request).subscribe(
        res => {
          this.alertService.showSuccessByKey('VIOLATIONS.APPEAL-CONTRIBUTOR-SAVE');
          this.appeal.contributors[i].isSaved = true;
        },
        err => {
          this.alertService.showError(err.error.message, err.error.details);
          this.appeal.contributors[i].isSaved = false;
        }
      );
    } else {
      markFormGroupTouched(this.validatorAppealControl?.controls[i] as FormGroup);
      this.scrollToContributor();
      this.validMandatory = true;
    }
  }
  getLockups(): void {
    this.lookupService.getAppealLegalOpinionList().subscribe(res => {
      this.legalOpinionsList = res;
    });
    this.lookupService.getAppealSearchList().subscribe(res => {
      this.appealSearchList = res;
    });
  }

  onAssignToSpecialistConfirmed(data): void {
    this.roleId = data.roleId?.english;
    this.validatorMemberForm.addControl('comments', this.fb.control(data.comments));
    this.manageWorkflowTransaction(5);
  }
  onReturnToUserConfirmed(data): void {
    this.validatorMemberForm.addControl('comments', this.fb.control(data.comments));
    this.manageWorkflowTransaction(2);
  }

  mapReviewObject(reviewFormData) {
    let reviewModel = {} as Reviewer;
    reviewModel.reviewerIsAcceptedFormally = reviewFormData.reviewerIsAcceptedFormally.english === 'Approve';
    reviewModel.reviewerComments = reviewFormData.reviewerComments;
    reviewModel.reviewerIsAcceptedObjectively = reviewFormData.reviewerIsAcceptedObjectively.english === 'Approve';
    reviewModel.reviewerObjectionComments = reviewFormData.reviewerObjectionComments;
    reviewModel.reviewerDecision = reviewFormData.reviewerDecision?.english;

    return reviewModel;
  }

  mapLegalReviewerObject(FormValue) {
    let approvalModel = {} as LegalReviewer;
    approvalModel.opinion = FormValue?.opinion?.english;
    approvalModel.opinionComments = FormValue?.opinionComments;
    approvalModel.legalOpinion = FormValue?.legalOpinion?.english;
    approvalModel.legalOpinionComments = FormValue?.legalOpinionComments;
    return approvalModel;
  }
  mapLegalAuditorObject(FormValue) {
    let legalAuditor = {} as LegalAuditor;
    legalAuditor.auditorDecision = FormValue.auditorDecision?.english === 'Approve';
    legalAuditor.auditorComments = FormValue.auditorComments;
    return legalAuditor;
  }

  mapLegalMangerObject(FormValue) {
    let legalManagerModel = {} as LegalManager;
    legalManagerModel.finalOpinion = FormValue?.finalOpinion?.english;
    legalManagerModel.finalOpinionComments = FormValue?.finalOpinionComments;
    legalManagerModel.finalLegalOpinion = FormValue?.finalLegalOpinion?.english;
    legalManagerModel.finalLegalOpinionComments = FormValue?.finalLegalOpinionComments;
    return legalManagerModel;
  }

  mapAppealClerkObject(FormValue) {
    let appealClerkModel = {} as AppealClerk;
    appealClerkModel.finalDecision = FormValue.finalDecision?.english;
    appealClerkModel.finalDecisionDate = FormValue.finalDecisionDate?.gregorian;
    appealClerkModel.finalDecisionComments = FormValue.finalDecisionComments;

    return appealClerkModel;
  }
}
