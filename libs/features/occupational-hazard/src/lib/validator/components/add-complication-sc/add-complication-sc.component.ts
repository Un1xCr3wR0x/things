/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, OnInit, Output, TemplateRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  Channel,
  Role,
  markFormGroupUntouched,
  WorkflowService,
  LovList,
  WorkFlowActions,
  BPMMergeUpdateParamEnum,
  LanguageToken,
  AuthTokenService,
  MedicalAssessmentService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ContributorService, EstablishmentService, DiseaseService } from '../../../shared/services';
import { ComplicationService } from '../../../shared/services/complication.service';
import { InjuryService } from '../../../shared/services/injury.service';
import { OhService } from '../../../shared/services/oh.service';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { Location, PlatformLocation } from '@angular/common';
import {
  Route,
  WorkFlowType,
  ComplicationReject,
  setWorkFlowDataForInspection,
  setWorkFlowDataForTpa
} from '../../../shared';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'oh-add-complication-sc',
  templateUrl: './add-complication-sc.component.html',
  styleUrls: ['./add-complication-sc.component.scss']
})
export class AddComplicationScComponent extends ValidatorBaseScComponent implements OnInit {
  /**
   *
   * @param router
   * @param modalService
   * @param documentService
   * @param routerData
   * @param injuryService
   * @param ohService
   * @param establishmentService
   * @param complicationService
   * @param contributorService
   * @param alertService
   * @param fb
   * @param appToken
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly injuryService: InjuryService,
    readonly ohService: OhService,
    readonly establishmentService: EstablishmentService,
    readonly complicationService: ComplicationService,
    readonly diseaseServce: DiseaseService,
    readonly contributorService: ContributorService,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
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
      diseaseServce,
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
   * Local variables
   */
  maxLengthComments = 300;
  reportInjuryForm: FormGroup;
  reportInjuryModal: FormGroup;
  injuryRejectReasonList$: Observable<LovList>;
  isComplication = true;
  result = [];
  injuryRejectDetails: ComplicationReject = new ComplicationReject();
  warning = 'OCCUPATIONAL-HAZARD.REJECT-TRANSACTION-INFO';
  type = 'warning';
  showConfirmReturnBtn = false;
  showConfirmSubmitBtn = false;
  headingText = 'OCCUPATIONAL-HAZARD.INJURY.REPORT-OCCUPATIONAL-HAZARD';
  noteRequest: boolean;
  /**
   * Output variables
   */
  @Output() reset: EventEmitter<null> = new EventEmitter();

  /**
   *
   * This method is to initialize the component
   */
  ngOnInit() {
    if (this.routerData.taskId !== null) {
      this.intialiseTheView(this.routerData);
    } else if (this.routerData.taskId === null) {
      this.intialiseTheView(this.ohService.getRouterData());
    }
    this.injuryRejectReasonList$ = this.injuryService.getInjuryRejectReasonList(WorkFlowType.REJECT_INJURY);
    this.setEditOption();
  }
  /**
   * Navigate to Personal details
   */
  navigateToEdit() {
    this.routerData.tabIndicator = 2;
    this.router.navigate(['home/oh/complication/edit']);
  }

  /**
   * Navigate to document scan page
   */
  navigateToScan() {
    this.routerData.tabIndicator = 2;
    this.router.navigate(['home/oh/complication/edit']);
  }
  /**
   * when return to establishment action is performed, comments will be shared
   */
  returnComplication() {
    this.returnAction(this.reportInjuryModal);
  }

  requestTpaAddComplication() {
    this.returnTpa = true;
    const workflow = setWorkFlowDataForInspection(this.routerData, this.reportInjuryForm, 'request');
    const dataforAddComp = setWorkFlowDataForTpa(
      this.routerData,
      workflow,
      this.tpaRequestedDocs,
      this.reportInjuryModal,
      this.transactionNumber,
      this.tpaCode
    );
    if (this.reportInjuryModal?.valid) {
      this.confirmInspection(dataforAddComp, WorkFlowActions.SEND_FOR_CLARIFICATION);
    } else {
      this.validateComments(this.reportInjuryModal);
    }
  }

  /**
   * Approving by the validator.
   */
  confirmApproveComplication() {
    this.confirmApprove();
  }

  /**
   * Method to show approve modal.
   * @param templateRef
   */
  showTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, templateName = '') {
    this.actionName = WorkFlowActions.SEND_FOR_INSPECTION;
    if (templateName === 'showAddComplicationReturn') {
      this.headingText = 'OCCUPATIONAL-HAZARD.INJURY.REPORT-OCCUPATIONAL-HAZARD';
      this.showConfirmSubmitBtn = false;
      this.showConfirmReturnBtn = true;
      this.noteRequest = true;
      this.requestedDocumentList(false);
    }
    if (templateName === 'showRequestAddComplication') {
      this.actionName = WorkFlowActions.SEND_FOR_INSPECTION;
    }
    if (templateName === 'showAddComplicationSubmit') {
      this.headingText = 'OCCUPATIONAL-HAZARD.REQUEST-CLARIFICATION';
      this.noteRequest = false;
      this.returnTpa = true;
      this.requestedDocumentList(this.returnTpa);
      this.showConfirmSubmitBtn = true;
      this.showConfirmReturnBtn = false;
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
   * Show modal for rejection
   */
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }

  /**
   * While rejecting from validator
   */
  confirmRejectComplication() {
    const comments = this.reportInjuryForm.get('comments')?.value;
    const injuryRejectReason = this.reportInjuryForm.get('injuryRejectionReason')?.value;
    const parentInjuryRejectFlag = this.reportInjuryForm.get('parentInjuryRejectFlag')?.value;
    const injuryRejectFlag = this.reportInjuryForm.get('injuryRejectFlag')?.value;
   /*  if (this.isEstClosed && !parentInjuryRejectFlag) {
      this.warning = 'OCCUPATIONAL-HAZARD.ERR-FLAG-NOT-CHECKED';
      this.type = 'danger';
    } else { */
      if (injuryRejectReason) {
        this.injuryRejectDetails.foregoExpenses = parentInjuryRejectFlag === undefined ? false : parentInjuryRejectFlag;
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
      this.reportInjuryForm.get('status').setValue('REJECT');
      this.reportInjuryForm.updateValueAndValidity();
      const formData = this.reportInjuryForm.getRawValue();
      const ComplicationReason = formData.rejectionReason.english;
      const workflowData = setWorkFlowDataForInspection(this.routerData, this.reportInjuryForm, 'reject');
      workflowData.payload = this.routerData.content;
      this.rejectReasonList.subscribe(element => {
        this.result = element.items.filter(item => item.value.english === ComplicationReason);
        if (this.result[0]) {
          workflowData.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON, this.result[0].code);
          workflowData.updateMap.set(
            BPMMergeUpdateParamEnum.FOREGOEXPENSES,
            parentInjuryRejectFlag === undefined ? false : parentInjuryRejectFlag
          );
          this.workflowService.mergeAndUpdateTask(workflowData).subscribe(
            () => {
              this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.ERR-COMPLICATION-REJECTION');
              this.hideModal();
              this.router.navigate([RouterConstants.ROUTE_INBOX]);
            },
            err => {
              this.showError(err);
              this.hideModal();
            }
          );
        }
      });
    //}
  }

  /**
   * This method is used to show the cancellation template on click of cancel
   * @param changes //TODO: no such parameter
   */

  showCancelTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  /**
   * Method to navigate to view injury page
   */
  viewInjury() {
    this.ohService.setRoute(Route.ADD_COMPLICATION);
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.ohService.getInjuryId()}/injury/info`
    ]);
  }
  /**
   * Method to navigate to view complication page
   */
  viewComplication() {
    this.ohService.setRoute(Route.ADD_COMPLICATION);
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/${this.complicationId}/complication/info`
    ]);
  }

  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.navigateToInbox();
  }
}

