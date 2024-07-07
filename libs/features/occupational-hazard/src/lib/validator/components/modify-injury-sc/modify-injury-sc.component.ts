/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */ import { Component, EventEmitter, Inject, OnInit, Output, TemplateRef, HostListener } from '@angular/core';
 import { FormBuilder } from '@angular/forms';
 import { Router } from '@angular/router';
 import {
   AlertService,
   ApplicationTypeToken,
   DocumentService,
   Role,
   RouterConstants,
   RouterData,
   RouterDataToken,
   markFormGroupUntouched,
   WorkflowService,
   WorkFlowActions,
   LanguageToken,
   AuthTokenService,
   MedicalAssessmentService
 } from '@gosi-ui/core';
 import { BsModalService } from 'ngx-bootstrap/modal';
 import { OhConstants, Route, setWorkFlowDataForInspection, setWorkFlowDataForTpa } from '../../../shared';
 import {
   ComplicationService,
   ContributorService,
   EstablishmentService,
   InjuryService,
   OhService,
   DiseaseService
 } from '../../../shared/services';
 import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
 import { Location, PlatformLocation } from '@angular/common';
 import { BehaviorSubject } from 'rxjs';

 @Component({
   selector: 'oh-modify-injury-sc',
   templateUrl: './modify-injury-sc.component.html',
   styleUrls: ['./modify-injury-sc.component.scss']
 })
 export class ModifyInjuryScComponent extends ValidatorBaseScComponent implements OnInit {
   /**
    * Local variables
    */
   canEdit = false;
   showConfirmReturnBtnModify = false;
   showConfirmSubmitBtnModify = false;
   maxLengthComments = 300;
   headingTextModify = 'OCCUPATIONAL-HAZARD.MODIFY-INJURY-TRANSACTION';
   noteRequestModify: boolean;
   documentsOptionalModify: boolean;
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
    */

   constructor(
     @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
     readonly ohService: OhService,
     readonly injuryService: InjuryService,
     readonly establishmentService: EstablishmentService,
     @Inject(ApplicationTypeToken) readonly appToken: string,
     readonly complicationService: ComplicationService,
     readonly diseaseService: DiseaseService,
     readonly contributorService: ContributorService,
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
    * This method is for initializing tasks
    */
   ngOnInit(): void {
     this.reportInjuryModal = this.createInjuryModalForm();
     this.reportInjuryForm = this.createInjuryDetailsForm();
     if (this.routerData.taskId === null) {
       this.intialiseTheView(this.ohService.getRouterData());
     }
     if (this.routerData.taskId !== null) {
       this.intialiseTheView(this.routerData);
     }
     this.setEditOption();
   }
   /**
    * Navigate to injury page on validator 1 edit
    */
   navigateToInjuryPage() {
     this.routerData.tabIndicator = 2;
     this.router.navigate(['home/oh/injury/modify']);
   }
   /**
    *  Method to navigate to scan documents screen on edit.
    */
   navigateToScan() {
     this.routerData.tabIndicator = 3;
     this.router.navigate(['home/oh/injury/edit?activeTab=3']);
   }
   /**
    * While rejecting from validator
    */
   confirmRejectInjury() {
     this.confirmReject();
   }
   /**
    * Method to navigate to view injury page
    */
   viewInjury() {
     this.ohService.setRoute(Route.MODIFY_INJURY);
     this.router.navigate([
       `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryDetailsWrapper.injuryDetailsDto.injuryId}/injury/info`
     ]);
   }

   /**
    * Approving by the validator.
    */
   confirmModifyInjury() {
     this.confirmApprove();
   }

   /**
    * when return to establishment action is performed, comments will be shared
    */
   returnModifyInjury() {
    this.returnAction(this.reportInjuryModal);
   }
   requestTpaModify() {
     const workflowData = setWorkFlowDataForInspection(this.routerData, this.reportInjuryForm, 'request');
     const modfiyInjuryData = setWorkFlowDataForTpa(
       this.routerData,
       workflowData,
       this.tpaRequestedDocs,
       this.reportInjuryModal,
       this.transactionNumber,
       this.tpaCode
     );
     if (this.reportInjuryModal && this.reportInjuryModal?.valid) {
       this.confirmInspection(modfiyInjuryData, WorkFlowActions.SEND_FOR_CLARIFICATION);
     } else {
       this.validateComments(this.reportInjuryModal);
     }
   }

   /**
    * This method is to show the modal reference
    * @param modalRef
    */
   showModal(templateRef: TemplateRef<HTMLElement>, templateNameModify = '') {
     if (templateNameModify === 'showRequestModify') {
       this.actionName = WorkFlowActions.SEND_FOR_INSPECTION;
     }
     if (templateNameModify === 'showReturnModify') {
       this.headingTextModify = 'OCCUPATIONAL-HAZARD.MODIFY-INJURY-TRANSACTION';
       this.noteRequestModify = true;
       this.documentsOptionalModify = false;
       this.requestedDocumentList(false);
       this.showConfirmSubmitBtnModify = false;
       this.showConfirmReturnBtnModify = true;
     }
     if (templateNameModify === 'showSubmitModify') {
       this.headingTextModify = 'OCCUPATIONAL-HAZARD.REQUEST-CLARIFICATION';
       this.noteRequestModify = false;
       this.returnTpa = true;
       this.requestedDocumentList(this.returnTpa);
       this.documentsOptionalModify = true;
       this.showConfirmReturnBtnModify = false;
       this.showConfirmSubmitBtnModify = true;
     }
     this.commentAlert = false;
     markFormGroupUntouched(this.reportInjuryModal);
     this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
   }

   /**
    * Method to show approve modal
    * @param templateRef
    */
   approveModifyTransaction(templateRef: TemplateRef<HTMLElement>) {
     this.showModal(templateRef);
   }

   /**
    * Method to show reject modal
    * @param templateRef
    */
   rejectModifyTransaction(templateRef: TemplateRef<HTMLElement>) {
     this.showModal(templateRef);
   }

   /**
    * Navigate to injury page on validator 1 edit
    */
   navigate() {
     this.router.navigate(['home/oh/injury/edit']);
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
    * This method is used to confirm cancellation of transaction
    */
   confirmCancel() {
     this.modalRef.hide();
     this.reset.emit();
     this.router.navigate([RouterConstants.ROUTE_INBOX]);
   }
   /**
    * Catching the browser back button
    */
   @HostListener('window:popstate', ['$event'])
   onPopState() {
     this.navigateToInbox();
   }
 }


