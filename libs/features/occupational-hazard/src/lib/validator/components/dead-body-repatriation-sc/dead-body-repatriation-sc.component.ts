/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, OnInit, Output, TemplateRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  Channel,
  DocumentService,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  markFormGroupUntouched,
  WorkflowService,
  LovList,
  WorkFlowActions,
  BPMMergeUpdateParamEnum,
  LanguageToken,
  Lov,
  AuthTokenService,
  MedicalAssessmentService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Location, PlatformLocation } from '@angular/common';
import {
  OhService,
  EstablishmentService,
  ContributorService,
  ComplicationService,
  InjuryService,
  DiseaseService
} from '../../../shared/services';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { ClaimWrapper, Route, setWorkFlowDataForInspection, setWorkFlowDataForTpa } from '../../../shared';
import { BehaviorSubject } from 'rxjs';
import { RepatriationDto } from '../../../shared/models/dead-body-repatriation';

@Component({
  selector: 'oh-dead-body-repatriation-sc',
  templateUrl: './dead-body-repatriation-sc.component.html',
  styleUrls: ['./dead-body-repatriation-sc.component.scss']
})
export class DeadBodyRepatriationScComponent extends ValidatorBaseScComponent implements OnInit {

  reportInjuryForm: FormGroup;
  reportInjuryModal: FormGroup;
  maxLengthComments = 300;
  result = [];
  reasonList: LovList = new LovList([]);
  warning = 'OCCUPATIONAL-HAZARD.REJECT-TRANSACTION-INFO';
  type = 'warning';
  showConfirmReturnBtnAddInjury = false;
  showConfirmSubmitBtnAddInjury = false;
  headingTextAddInjury = 'OCCUPATIONAL-HAZARD.REIMBURSE-DEAD-BODY-REPATRIATION';
  noteRequestAddInjury: boolean;
  allowanceDetailsWrapper: ClaimWrapper;
  // report injury admin inbox
  payeeList : LovList= null;
  maxLength: number = 500;
  payee: Lov[] = [];
  personNameEnglish: string = null;
  personNameArabic: String = null;
  contributorIdentity: number;
  repatriationButton: boolean = false;
  modifiedRepatriation: RepatriationDto;
  /**
   * Output variables
   */
  @Output() reset: EventEmitter<null> = new EventEmitter();

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
    this.language.subscribe(res => (this.lang = res));
  }

  /**
   * This method if for initialization tasks
   */
  ngOnInit() {
    const resourceType = this.routerData.resourceType;
    const channel = this.routerData.channel;
    const payload = JSON.parse(this.routerData.payload);
    this.registrationNo = payload.registrationNo;
    this.socialInsuranceNo = payload.socialInsuranceNo;
    this.injuryId = payload.id;
    this.referenceNo = payload.referenceNo;
    const assignedRole = payload.assignedRole;

    // for complication
    // this.injuryId = 30717300;
    // this.complicationId = 1001631908;
    if (payload?.injuryType === 'complication') {
      this.complicationIndicator = true;
      this.complicationId = payload.id;
      this.injuryId = payload.injuryIdentifier;
    }


    if (resourceType === "Injury" && channel === "taminaty" && assignedRole === "Admin") {
      this.allowanceFlag = true;
    } else if (resourceType === "Injury" && channel === "taminaty" && assignedRole === "Occupational Hazard Operations Officer") {
      this.allowanceFlagVal = true;
    } else if (resourceType === "Injury" && channel === "taminaty" && assignedRole === Role.OH_INSURANCE_DIRECTOR) {
      this.allowanceFlagVal3 = true;
    } else if (resourceType === "Injury" && channel === "taminaty" && assignedRole === Role.OH_FCAPPROVER) {
      this.allowanceFlagVal4 = true;
    } else if (resourceType === "Add dead body repatriation" && (channel === "field-office" || channel === "gosi-online")){
      this.repatriation = true;
    }
    if (payload.previousOutcome === "RETURN") {
      this.allowanceFlagReturn = true;
    }
    if(assignedRole === "Occupational Hazard Operations Officer" && resourceType === "Add dead body repatriation") {
      this.repatriationButton = true;
      this.ohService.setRepatriationButton(this.repatriationButton);
    } else {
      this.ohService.setRepatriationButton(this.repatriationButton);
    }

    if (this.routerData.taskId === null || this.routerData.taskId === undefined) {
      this.intialiseTheView(this.ohService.getRouterData());
    }
    if (this.routerData.taskId !== null && this.routerData.taskId !== undefined) {
      this.intialiseTheView(this.routerData);
      this.getModifiedRepatriation();
    }
    this.alertService.clearAlerts();
    this.setEditOption();

  // report injury admin inbox
    if (this.allowanceFlag) {
      this.allowancePaymentForm = this.createAllowanceForm();
      this.payee.push({ value: { english: 'Contributor', arabic: ' مشترك' }, sequence: 1 });
      this.payee.push({ value: { english: 'Establishment', arabic: 'منشأة' }, sequence: 2 });
      this.payeeList = new LovList(this.payee);
    }
    this.getAllowance();

    this.canReject = true;
    this.canReturn = true;
  }
  getAllowance(){
// this.ohService
//       .getallowanceDetail(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.referenceNo)
//       .subscribe(
//         response => { 
    if(this.complicationIndicator) {
      this.ohService.getallowanceDetail(this.registrationNo, this.socialInsuranceNo, this.complicationId, this.referenceNo).subscribe(res=>{
        this.allowanceDetailsWrapper=res;
      })
    } else {
      this.ohService.getallowanceDetail(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.referenceNo).subscribe(res=>{
        this.allowanceDetailsWrapper=res;
      })
    }
  }

  getModifiedRepatriation() {
    if(this.complicationIndicator) {
      this.ohService.getModifiedRepatriation(this.registrationNo, this.socialInsuranceNo, this.complicationId, this.referenceNo).subscribe((res) => {
        this.modifiedRepatriation = res;
      });
    } else {
      this.ohService.getModifiedRepatriation(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.referenceNo).subscribe((res) => {
        this.modifiedRepatriation = res;
      });
    }
  }

  /**
   * when return to establishment action is performed, comments will be shared
   */
  returnInjury() {
    this.returnAction(this.reportInjuryModal);
  }
  requestTpa() {
    const workflowDatas = setWorkFlowDataForInspection(this.routerData, this.reportInjuryForm, 'request');
    const dataforAddInjury = setWorkFlowDataForTpa(
      this.routerData,
      workflowDatas,
      this.tpaRequestedDocs,
      this.reportInjuryModal,
      this.transactionNumber,
      this.tpaCode
    );
    if (this.reportInjuryModal && this.reportInjuryModal?.valid) {
      this.confirmInspection(dataforAddInjury, WorkFlowActions.SEND_FOR_CLARIFICATION);
    } else {
      this.validateComments(this.reportInjuryModal);
    }
  }
  /**
   * Navigate to injury page on validator 1 edit
   */
  navigateToInjuryPage() {

    // report injury admin inbox
    if(this.allowanceFlag) {
      this.routerData.resourceId = 'admin';
      this.routerData.tabIndicator = 2;
      this.router.navigate(['home/oh/injury/edit']);
    } else {
      this.routerData.tabIndicator = 2;
      this.router.navigate(['home/oh/injury/edit']);
    }
  }

  /**
   * While rejecting from validator
   */
  confirmRejectInjury() {
    this.reportInjuryForm.get('status').setValue('REJECT');
    this.reportInjuryForm.updateValueAndValidity();
    const formData = this.reportInjuryForm.getRawValue();
    const reason = formData.rejectionReason.english;
    const workflowData = setWorkFlowDataForInspection(this.routerData, this.reportInjuryForm, 'reject');
    const injuryRejectFlag = this.reportInjuryForm.get('injuryRejectFlag')?.value;
    if (this.isEstClosed && !injuryRejectFlag) {
      this.warning = 'OCCUPATIONAL-HAZARD.ERR-FLAG-NOT-CHECKED';
      this.type = 'danger';
    } else {
      if (this.rejectReasonList) {
        this.rejectReasonList.subscribe(element => {
          this.result = element.items.filter(item => item.value.english === reason);
          if (this.result) {
            workflowData.updateMap.set(
              BPMMergeUpdateParamEnum.FOREGOEXPENSES,
              injuryRejectFlag === undefined ? false : injuryRejectFlag
            );
            workflowData.isExternalComment = true;
            workflowData.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON, this.result[0].code);
            if (this.allowanceFlag) {
              this.workflowService.updateTaskWorkflow(workflowData).subscribe(
                () => {
                  this.injuryService.rejectInjury(this.result[0].code, this.injuryId).subscribe(
                    () => {
                      this.navigateToInbox(WorkFlowActions.REJECT);
                      this.hideModal();
                    },
                    err => {
                      this.showError(err);
                      this.hideModal();
                    }
                  );
                },
                err => {
                  this.showError(err);
                  this.hideModal();
                }
              );
            } else {
              workflowData.payload = this.routerData.content;
              this.workflowService.mergeAndUpdateTask(workflowData).subscribe(
                () => {
                  this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.REPATRIATION-REJECTION-MESSAGE');
                  this.router.navigate([RouterConstants.ROUTE_INBOX]);
                  this.hideModal();
                },
                err => {
                  this.showError(err);
                  this.hideModal();
                }
              );
            }
          }
        });
      }
    }
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
    this.router.navigate(['home/oh/injury/edit']);
  }

  /**
   * for validator to view the injury occured place in google map
   */
  createMap() {
    this.latitude = Number(this.injury.latitude);
    this.longitude = Number(this.injury.longitude);
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
  showModal(templateRef: TemplateRef<HTMLElement>, templateNameAddInjury = '') {
    if (templateNameAddInjury === 'showReturnAddInjury') {
      this.headingTextAddInjury = 'OCCUPATIONAL-HAZARD.REIMBURSE-DEAD-BODY-REPATRIATION';
      this.noteRequestAddInjury = true;
      this.returnToEstAdmin = true;
      this.requestedDocumentList(false);
      this.showConfirmSubmitBtnAddInjury = false;
      this.showConfirmReturnBtnAddInjury = true;
    }
    if (templateNameAddInjury === 'showRequestAddInjury') {
      this.actionName = WorkFlowActions.SEND_FOR_INSPECTION;
    }
    if (templateNameAddInjury === 'showSubmitAddInjury') {
      this.headingTextAddInjury = 'OCCUPATIONAL-HAZARD.REQUEST-CLARIFICATION';
      this.returnTpa = true;
      this.requestedDocumentList(this.returnTpa);
      this.noteRequestAddInjury = false;
      this.showConfirmReturnBtnAddInjury = false;
      this.showConfirmSubmitBtnAddInjury = true;
    }
    this.commentAlert = false;
    markFormGroupUntouched(this.reportInjuryModal);
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
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
   * Method to show approve modal
   * @param templateRef
   */
  approveTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }

  /**
   * Method to show reject modal
   * @param templateRef
   */
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
    if (this.allowanceFlagVal) {
      this.warning = 'OCCUPATIONAL-HAZARD.REJECT-TRANSACTION-INFO-VALIDATOR';
    }
  }

  /**
   * Navigate to injury page on validator 1 edit
   */
  navigate() {
    this.router.navigate(['home/oh/injury/edit']);
  }
  /**
   * Method to navigate to view injury page
   */
  viewInjury() {
    this.ohService.setRoute(Route.REPATRIATION);
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`
    ]);
  }
  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.navigateToInbox();
  }

  // report injury admin inbox
  onAdminApprove(){
    if(this.allowancePaymentForm.valid){

    }
    else{
      this.allowancePaymentForm.markAllAsTouched();
      this.alertService.showMandatoryErrorMessage();
    }
  }
  createAllowanceForm(){
    return this.fb.group({
      payeeType: this.fb.group({
        english: ['', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      checkBoxFlag:[false, { validators: Validators.requiredTrue }],
      delayByEmployer: [null,{ validators: Validators.required }],

    });
  }

  /*This method to select Payee List*/
  selectedpayeeList(type) {
    if (type === 'Contributor') {
      this.allowancePaymentForm.get('payeeType.english').setValue('Contributor');
      this.payeeT = 2;
    } else if (type === 'Establishment') {
      this.allowancePaymentForm.get('payeeType.english').setValue('Establishment');
      this.payeeT = 1;
    }
  }

  nameRegulation(event) {
    this.personNameArabic = event.personNameArabic;
    this.personNameEnglish = event.personNameEnglish;
    this.contributorIdentity = event.id;
    if (this.personNameEnglish == null) {
      this.personNameEnglish = event.personNameArabic;
    }
  }

  /**
   * Method to navigate to view complication page
   */
  viewComplication() {
    this.ohService.setRoute(Route.REPATRIATION);
    this.ohService.setInjuryNumber(this.injuryNo);
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryNo}/${this.complicationId}/complication/info`
    ]);
  }

  /**
   * Method to navigate to view injury page
   */
  viewInjuryComplication() {
    this.ohService.setRoute(Route.REPATRIATION);
    this.ohService.setInjuryId(this.injuryId);
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`
    ]);
  }
}
