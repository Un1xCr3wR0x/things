/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit, TemplateRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Location, PlatformLocation } from '@angular/common';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  markFormGroupUntouched,
  WorkflowService,
  markFormGroupTouched,
  WorkFlowActions,
  LanguageToken,
  AuthTokenService,
  MedicalAssessmentService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  DiseaseService
} from '../../../shared/services';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { Route, setWorkFlowDataForInspection, setWorkFlowDataForTpa } from '../../../shared';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'oh-vtr-reject-injury-sc',
  templateUrl: './reject-injury-sc.component.html',
  styleUrls: ['./reject-injury-sc.component.scss']
})
export class RejectInjuryScComponent extends ValidatorBaseScComponent implements OnInit {
  /**
   * Local variables
   */
  reportInjuryForm: FormGroup;
  reportInjuryModal: FormGroup;
  resourceType: string;
  role: string;
  maxLengthComments = 300;
  showConfirmReturnBtnRejectInjury = false;
  showConfirmSubmitBtnRejectInjury = false;
  headingTextRejectInjury = 'OCCUPATIONAL-HAZARD.INJURY.REJECT-INJURY-TRANSACTION';
  noteRequestRejectInjury: boolean;

  /**
   *Creating  instance
   * @param documentService
   * @param fb
   * @param routerData
   * @param manageInjuryService
   * @param router
   * @param modalService
   * @param validatorRoutingService
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly ohService: OhService,
    readonly injuryService: InjuryService,
    readonly establishmentService: EstablishmentService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly contributorService: ContributorService,
    readonly workflowService: WorkflowService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly alertService: AlertService,
    readonly fb: FormBuilder,
    @Inject(ApplicationTypeToken) readonly appToken: string,
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
   * This method is for initializing the component tasks
   */
  ngOnInit() {
    this.reportInjuryModal = this.createInjuryModalForm();
    this.reportInjuryForm = this.createInjuryDetailsForm();
    this.showComments = true;
    if (this.routerData.taskId !== null) {
      this.intialiseTheView(this.routerData);
      this.resourceType = this.routerData.resourceType;
      this.role = this.routerData.assignedRole;
    } else {
      this.navigateToInbox();
      this.alertService.clearAlerts();
    }
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
   * Method to show reject modal
   * @param templateRef
   */
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  /**
   * This method is used to confirm cancellation of transaction
   */
  confirmCancel() {
    this.modalRef.hide();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.navigateToInbox();
  }
  /**
   * Approving by the validator.
   */
  confirmApproveInjury() {
    this.confirmApprove();
  }

  /**
   *  Method to navigate to scan documents screen on edit.
   */
  navigateToScan() {
    this.routerData.tabIndicator = 3;
    this.router.navigate(['home/oh/injury/edit?activeTab=3']);
  }

  /**
   * This method is to show the modal reference
   * @param templateRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, templateNameRejectInjury = '') {
    if (templateNameRejectInjury === 'showReturnRejectInjury') {
      this.headingTextRejectInjury = 'OCCUPATIONAL-HAZARD.INJURY.REJECT-INJURY-TRANSACTION';
      this.noteRequestRejectInjury = true;
      this.showConfirmSubmitBtnRejectInjury = false;
      this.showConfirmReturnBtnRejectInjury = true;
      this.requestedDocumentList(false);
    }
    if (templateNameRejectInjury === 'showSubmitRejectInjury') {
      this.headingTextRejectInjury = 'OCCUPATIONAL-HAZARD.REQUEST-CLARIFICATION';
      this.noteRequestRejectInjury = false;
      this.returnTpa = true;
      this.requestedDocumentList(this.returnTpa);
      this.showConfirmReturnBtnRejectInjury = false;
      this.showConfirmSubmitBtnRejectInjury = true;
    }
    this.commentAlert = false;
    markFormGroupUntouched(this.reportInjuryModal);
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  /**
   * Method to navigate to view injury page
   */
  viewInjury() {
    this.ohService.setRoute(Route.REJECT_INJURY);
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`
    ]);
  }

  /**
   * when return to establishment action is performed, comments will be shared
   */
  returnInjury() {
    this.returnAction(this.reportInjuryModal);
  }
  requestTpaReject() {
    const workflowDetail = setWorkFlowDataForInspection(this.routerData, this.reportInjuryForm, 'request');
    const dataforRejectInjury = setWorkFlowDataForTpa(
      this.routerData,
      workflowDetail,
      this.tpaRequestedDocs,
      this.reportInjuryModal,
      this.transactionNumber,
      this.tpaCode
    );
    if (this.reportInjuryModal && this.reportInjuryModal?.valid) {
      this.confirmInspection(dataforRejectInjury, WorkFlowActions.SEND_FOR_CLARIFICATION);
    } else {
      this.validateComments(this.reportInjuryModal);
    }
  }
  /**
   * While rejecting from validator
   */
  confirmRejectInjury() {
    this.confirmReject();
  }
  /**
   * Method to show approve modal
   * @param templateRef
   */
  approveTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
}

