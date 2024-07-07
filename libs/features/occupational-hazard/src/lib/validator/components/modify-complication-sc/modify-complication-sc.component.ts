/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Output, EventEmitter, Inject, TemplateRef, HostListener } from '@angular/core';
import {
  OhService,
  InjuryService,
  EstablishmentService,
  ComplicationService,
  ContributorService,
  OhConstants,
  Route,
  WorkFlowType,
  ComplicationReject,
  setWorkFlowDataForInspection,
  setWorkFlowDataForTpa,
  DiseaseService
} from '../../../shared';
import {
  ApplicationTypeToken,
  AlertService,
  RouterDataToken,
  RouterData,
  DocumentService,
  Role,
  RouterConstants,
  markFormGroupUntouched,
  WorkflowService,
  LovList,
  WorkFlowActions,
  LanguageToken,
  AuthTokenService,
  MedicalAssessmentService
} from '@gosi-ui/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { Location, PlatformLocation } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'oh-modify-complication-sc',
  templateUrl: './modify-complication-sc.component.html',
  styleUrls: ['./modify-complication-sc.component.scss']
})
export class ModifyComplicationScComponent extends ValidatorBaseScComponent implements OnInit {
  /**
   * Local variables
   */
  canEdit = false;
  injuryRejectReasonList$: Observable<LovList>;
  injuryRejectDetails: ComplicationReject = new ComplicationReject();
  showConfirmReturnBtnModifyCom = false;
  maxLengthComments = 300;
  showConfirmSubmitBtnModifyCom = false;
  headingTextModifyCom = 'OCCUPATIONAL-HAZARD.COMPLICATION.MODIFY-COMPLICATION-TRANSACTION';
  noteRequestModifyCom: boolean;
  documentsOptionalModifyCom: boolean;
  /**
   * Output variables
   */
  @Output() reset: EventEmitter<null> = new EventEmitter();
  /**
   *Creating  instance
   * @param fb
   * @param routerData
   * @param manageInjuryService
   * @param router
   * @param documentService
   * @param modalService
   * @param validatorRoutingService
   * @param injuryService
   * @param alertService
   */

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly injuryService: InjuryService,
    readonly contributorService: ContributorService,
    readonly ohService: OhService,
    readonly establishmentService: EstablishmentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly alertService: AlertService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly fb: FormBuilder,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    readonly authTokenService: AuthTokenService,
    readonly coreMedicalAssessmentService: MedicalAssessmentService
  ) {
    super(
      language,
      ohService,
      injuryService,
      establishmentService,
      complicationService,
      diseaseService,
      alertService,
      router,
      modalService,
      documentService,
      contributorService,
      workflowService,
      fb,
      routerData,
      location,
      pLocation,
      appToken,
      authTokenService,
      coreMedicalAssessmentService
    );
  }

  /**
   * This method is for initialization tasks
   *
   */
  ngOnInit(): void {
    this.reportInjuryForm = this.createInjuryDetailsForm();
    this.reportInjuryModal = this.createInjuryModalForm();
    this.injuryRejectReasonList$ = this.injuryService.getInjuryRejectReasonList(WorkFlowType.REJECT_INJURY);
    if (this.routerData.taskId === null || this.routerData.taskId === undefined) {
      this.intialiseTheView(this.ohService.getRouterData());
    }
    if (this.routerData.taskId !== null && this.routerData.taskId !== null) {
      this.intialiseTheView(this.routerData);
    }
    this.setEditOption();
    const validatorActions = this.routerData.customActions;
    validatorActions.forEach(action => {
      if (action === WorkFlowActions.RETURN) {
        this.canReturn = true;
      }
    });
  }
  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.navigateToInbox();
  }
  /**
   * Method to navigate to view complication page
   */
  viewComplication() {
    this.ohService.setRoute(Route.MODIFY_COMP);
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/${this.complicationId}/complication/info`
    ]);
  }

  /**
   * Navigate to injury page on validator 1 edit
   */
  navigateToInjuryPage() {
    this.routerData.tabIndicator = 2;
    this.router.navigate(['home/oh/injury/modify']);
  }
  /**
   * Navigate to complication page on validator 1 edit
   */
  navigateToComplicationPage() {
    this.routerData.tabIndicator = 1;
    this.router.navigate(['home/oh/complication/modify']);
  }
  /**
   * Method to navigate to view injury page
   */
  viewInjury() {
    this.ohService.setRoute(Route.MODIFY_COMP);
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.complicationDetails.injuryDetails.injuryId}/injury/info`
    ]);
  }
  /**
   * While rejecting from validator
   */
  rejectModifyComplication() {
    const comments = this.reportInjuryForm?.get('comments')?.value;
    const injuryRejectReason = this.reportInjuryForm.get('injuryRejectionReason')?.value;
    if (injuryRejectReason) {
      this.injuryRejectDetails.comments = comments;
      this.injuryRejectDetails.rejectionReason = injuryRejectReason;
      this.ohService
        .complicationRejection(this.injuryRejectDetails, this.registrationNo, this.socialInsuranceNo)
        .subscribe(
          () => {},
          err => {
            this.showError(err);
          }
        );
    }
    this.confirmReject();
  }

  /**
   * Approving by the validator.
   */
  approveModifyComplication() {
    this.confirmApprove();
  }

  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, templateNameModifyCom = '') {
    this.actionName = WorkFlowActions.SEND_FOR_INSPECTION;
    if (templateNameModifyCom === 'showReturnModifyCom') {
      this.headingTextModifyCom = 'OCCUPATIONAL-HAZARD.COMPLICATION.MODIFY-COMPLICATION-TRANSACTION';
      this.noteRequestModifyCom = true;
      this.documentsOptionalModifyCom = false;
      this.showConfirmSubmitBtnModifyCom = false;
      this.showConfirmReturnBtnModifyCom = true;
      this.requestedDocumentList(false);
    }
    if (templateNameModifyCom === 'showRequestModifyCom') {
      this.actionName = WorkFlowActions.SEND_FOR_INSPECTION;
    }
    if (templateNameModifyCom === 'showSubmitModifyCom') {
      this.headingTextModifyCom = 'OCCUPATIONAL-HAZARD.REQUEST-CLARIFICATION';
      this.returnTpa = true;
      this.requestedDocumentList(this.returnTpa);
      this.noteRequestModifyCom = false;
      this.documentsOptionalModifyCom = true;
      this.showConfirmReturnBtnModifyCom = false;
      this.showConfirmSubmitBtnModifyCom = true;
    }
    this.commentAlert = false;
    markFormGroupUntouched(this.reportInjuryModal);
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  /**
   * when return to establishment action is performed, comments will be shared
   */
  returnModifyComplication() {
    this.returnAction(this.reportInjuryModal);
  }
  requestTpaModifyComplication() {
    const workflowDetail = setWorkFlowDataForInspection(this.routerData, this.reportInjuryForm, 'request');
    const modfiyCompData = setWorkFlowDataForTpa(
      this.routerData,
      workflowDetail,
      this.tpaRequestedDocs,
      this.reportInjuryModal,
      this.transactionNumber,
      this.tpaCode
    );
    if (this.reportInjuryModal && this.reportInjuryModal?.valid) {
      this.confirmInspection(modfiyCompData, WorkFlowActions.SEND_FOR_CLARIFICATION);
    } else {
      this.validateComments(this.reportInjuryModal);
    }
  }

  /**
   * Method to show approve modal
   * @param templateRef
   */
  approveModifyTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  /**
   * This method is used to confirm cancellation of transaction
   */
  confirmCancel() {
    this.modalRef.hide();
    this.reset.emit();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /**
   * Method to show reject modal
   * @param templateRef
   */
  rejectModifyTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }

  /**
   * This method is used to show the cancellation template on click of cancel
   * @param changes
   */

  showCancelTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  /**
   * Navigate to injury page on validator 1 edit
   */
  navigate() {
    this.router.navigate(['home/oh/injury/edit']);
  }
}

