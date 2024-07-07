/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, TemplateRef, HostListener } from '@angular/core';
import { Location, PlatformLocation } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  DiseaseService
} from '../../../shared/services';
import {
  AlertService,
  DocumentService,
  RouterData,
  ApplicationTypeToken,
  RouterConstants,
  RouterDataToken,
  markFormGroupUntouched,
  WorkflowService,
  LovList,
  WorkFlowActions,
  LanguageToken,
  AuthTokenService,
  MedicalAssessmentService
} from '@gosi-ui/core';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import {
  Route,
  WorkFlowType,
  ComplicationReject,
  setWorkFlowDataForInspection,
  setWorkFlowDataForTpa
} from '../../../shared';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'oh-reject-complication-sc',
  templateUrl: './reject-complication-sc.component.html',
  styleUrls: ['./reject-complication-sc.component.scss']
})
export class RejectComplicationScComponent extends ValidatorBaseScComponent implements OnInit {
  /**
   *Creating  instance
   * @param manageInjuryService
   *  @param documentService
   * @param fb
   * @param routerData
   * @param router
   * @param modalService
   * @param validatorRoutingService
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly alertService: AlertService,
    readonly complicationService: ComplicationService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly establishmentService: EstablishmentService,
    readonly workflowService: WorkflowService,
    readonly injuryService: InjuryService,
    readonly modalService: BsModalService,
    readonly ohService: OhService,
    readonly diseaseService: DiseaseService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly router: Router,
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
  // Local variables
  reportInjuryForm: FormGroup;
  maxLengthComments = 300;
  reportInjuryModal: FormGroup;
  injuryRejectReasonList$: Observable<LovList>;
  injuryRejectDetails: ComplicationReject = new ComplicationReject();
  showConfirmReturnBtnRejectComp = false;
  showConfirmSubmitBtnRejectComp = false;
  headingTextRejectComp = 'OCCUPATIONAL-HAZARD.COMPLICATION.REJECT-COMPLICATION-TRANSACTION';
  noteRequestRejectComp: boolean;

  /**
   * This method if for initialization tasks
   */
  ngOnInit() {
    this.reportInjuryModal = this.createInjuryModalForm();
    this.reportInjuryForm = this.createInjuryDetailsForm();
    this.showComments = true;
    if (this.routerData.taskId !== null) {
      this.intialiseTheView(this.routerData);
    } else {
      this.navigateToInbox();
    }
    this.getComplicationDetails();
    this.injuryRejectReasonList$ = this.injuryService.getInjuryRejectReasonList(WorkFlowType.REJECT_INJURY);
  }

  /**
   * Method to show approve modal
   * @param templateRef
   */
  approveRejectComplicationTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  /**
   * Method to show reject modal
   * @param templateRef
   */
  rejectComplicationTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }

  /**
   * This method is to show the modal reference
   * @param templateRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, templateNameRejectComp = '') {
    if (templateNameRejectComp === 'showReturnRejectComp') {
      this.headingTextRejectComp = 'OCCUPATIONAL-HAZARD.COMPLICATION.REJECT-COMPLICATION-TRANSACTION';
      this.noteRequestRejectComp = true;
      this.showConfirmReturnBtnRejectComp = true;
      this.showConfirmSubmitBtnRejectComp = false;
      this.requestedDocumentList(false);
    }
    if (templateNameRejectComp === 'showSubmitRejectComp') {
      this.headingTextRejectComp = 'OCCUPATIONAL-HAZARD.REQUEST-CLARIFICATION';
      this.noteRequestRejectComp = false;
      this.returnTpa = true;
      this.requestedDocumentList(this.returnTpa);
      this.showConfirmReturnBtnRejectComp = false;
      this.showConfirmSubmitBtnRejectComp = true;
    }
    this.commentAlert = false;
    markFormGroupUntouched(this.reportInjuryModal);
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  /**
   * This method is used to show the cancellation template on click of cancel
   * @param template
   */

  showCancelTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  /**
   * This method is used to confirm cancellation of transaction
   */
  confirmCancelRejection() {
    this.modalRef.hide();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  /**
   *  Method to navigate to scan documents screen on edit.
   */
  navigateToScan() {
    this.routerData.tabIndicator = 3;
    this.router.navigate(['home/oh/injury/edit?activeTab=3']);
  }

  /**
   * Method to navigate to view complication page
   */
  viewComplication() {
    this.ohService.setRoute(Route.REJECT_COMP);
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/${this.complicationId}/complication/info`
    ]);
  }
  /**
   * Method to navigate to view injury page
   */
  viewInjury() {
    this.ohService.setRoute(Route.REJECT_COMP);
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.complicationDetails.injuryDetails.injuryId}/injury/info`
    ]);
  }

  /**
   * when return to establishment action is performed, comments will be shared
   */
  returnRejectComplication() {
    this.returnAction(this.reportInjuryModal);
  }
  requestTpaRejectComplication() {
    const workflowData = setWorkFlowDataForInspection(this.routerData, this.reportInjuryForm, 'request');
    const dataforRejectComp = setWorkFlowDataForTpa(
      this.routerData,
      workflowData,
      this.tpaRequestedDocs,
      this.reportInjuryModal,
      this.transactionNumber,
      this.tpaCode
    );
    if (this.reportInjuryModal && this.reportInjuryModal?.valid) {
      this.confirmInspection(dataforRejectComp, WorkFlowActions.SEND_FOR_CLARIFICATION);
    } else {
      this.validateComments(this.reportInjuryModal);
    }
  }
  /**
   * While rejecting from validator
   */
  confirmRejectComplication() {
    const comments = this.reportInjuryForm.get('comments').value;
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
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.navigateToInbox();
  }
}

