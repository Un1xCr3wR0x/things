/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location, PlatformLocation } from '@angular/common';
import { Component, HostListener, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  WorkflowService,
  WorkFlowActions,
  LanguageToken,
  AuthTokenService,
  MedicalAssessmentService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { OHTransactionType, Route } from '../../../shared/enums';
import { ReimbursementRequestDetails } from '../../../shared/models';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  DiseaseService
} from '../../../shared/services';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { setWorkFlowDataForInspection, setWorkFlowDataForTpa } from '../../../shared';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'oh-reimbursement-details-sc',
  templateUrl: './reimbursement-details-sc.component.html',
  styleUrls: ['./reimbursement-details-sc.component.scss']
})
export class ReimbursementDetailsScComponent extends ValidatorBaseScComponent implements OnInit {
  reimbDetails: ReimbursementRequestDetails;
  reimbComment = [];
  reimbId:number;
  maxLengthComments = 300;
  reportInjuryForm:FormGroup;
  /**
   * Creating Instance
   * @param manageInjuryService
   * @param router
   * @param modalService
   * @param validatorRoutingService
   * @param documentService
   * @param fb
   * @param routerData
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly ohService: OhService,
    readonly injuryService: InjuryService,
    readonly establishmentService: EstablishmentService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly contributorService: ContributorService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly fb: FormBuilder,
    readonly claimService: OhClaimsService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
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
   * This method if for initialization tasks
   */
  ngOnInit() {
    if (this.routerData.taskId === null || this.routerData.taskId === undefined) {
      this.intialiseTheView(this.ohService.getRouterData());
    }
    if (this.routerData.taskId !== null && this.routerData.taskId !== null) {
      this.intialiseTheView(this.routerData);
    }
    const payload = JSON.parse(this.routerData.payload);
    this.reportInjuryForm = this.createInjuryDetailsForm();
    this.reportInjuryModal = this.createInjuryModalForm();
    this.reimbId= payload.reimbId;
    this.injuryId =payload.injuryId;
    this.getReimbDetails();
    this.getEstablishment();
    this.getReimbursmentDocuments();
    this.getContributor();
    this.alertService.clearAlerts();
    this.setEditOption();
  }
  viewInjury() {
    this.ohService.setRoute(Route.REIMBURSEMENT);
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`
    ]);
  }
  getReimbursmentDocuments() {
    this.documentService
      .getMultipleDocuments(this.injuryId,
        null,
        OHTransactionType.REIMBURSEMENT_CLAIM,
        this.transactionNumber
      )
      .subscribe(documentsResponse => {
        if (documentsResponse.length > 0) {
          this.documents = documentsResponse?.filter(item => item.documentContent !== null);
        }
      });
  }
  /**
   * Get Reimbursement Details
   */
  getReimbDetails() {
    this.claimService.getReimbClaim(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.reimbId).subscribe(
      response => {

        this.reimbDetails = response;
        this.reimbComment = [];
        const comments = new TransactionReferenceData();
        comments.comments = this.reimbDetails.comments;
        comments.role.english = this.reimbDetails.roleid;
        comments.userName.english = this.reimbDetails.userId;
        comments.createdDate = this.reimbDetails.actionedDate;
        this.reimbComment.push(comments);
      },
      err => {
        this.showError(err);
      }
    );
  }
  requestTpaResult() {
    const workflowData = setWorkFlowDataForInspection(this.routerData, this.reportInjuryForm, 'request');
    const dataforCloseComp = setWorkFlowDataForTpa(
      this.routerData,
      workflowData,
      this.tpaRequestedDocs,
      this.reportInjuryModal,
      this.transactionNumber,
      this.tpaCode
    );
    this.reportInjuryModal.get('comments').clearValidators();
    this.reportInjuryModal.get('comments').setValidators(null);
    if (this.reportInjuryModal) {
      this.confirmInspection(dataforCloseComp, WorkFlowActions.SEND_FOR_CLARIFICATION);
    }
  }
  /**
   * This method is used to confirm cancellation of transaction
   */
  confirmCancel() {
    this.modalRef.hide();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /**
   * Approving by the validator.
   */
  confirmApproveInjury() {
    this.confirmApprove();
  }
   /**
   * While rejecting from validator
   */
  confirmRejectReimbursment() {
    this.confirmReject();
  }
  /**
   * Method to show approve modal
   * @param templateRef
   */
  approveTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModalBySize(templateRef, 'modal-lg');
  }
  /**
   * Method to show reject modal
   * @param templateRef
   */
   rejectTransactionReimb(templateRef: TemplateRef<HTMLElement>) {
    this.showModalBySize(templateRef, 'modal-lg');
  }
  /**
   * Method to show reject modal
   * @param templateRef
   */
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModalBySize(templateRef, 'modal-lg');
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
   * This method is to show the modal reference
   * @param modalRef
   */
  showModalBySize(templateRef: TemplateRef<HTMLElement>, size) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: size }));
  }

  /**
   * Navigate to injury page on validator 1 edit
   */
  navigate() {
    this.router.navigate(['home/oh/injury/edit']);
  }

  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.navigateToInbox();
  }
}



