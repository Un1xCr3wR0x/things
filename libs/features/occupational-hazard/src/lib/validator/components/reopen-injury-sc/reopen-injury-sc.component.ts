/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, OnInit, Output, TemplateRef, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  Role,
  RouterData,
  RouterDataToken,
  RouterConstants,
  Channel,
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
import { OhConstants, Route, setWorkFlowDataForInspection, setWorkFlowDataForTpa } from '../../../shared';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { Location, PlatformLocation } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'oh-reopen-injury-sc',
  templateUrl: './reopen-injury-sc.component.html',
  styleUrls: ['./reopen-injury-sc.component.scss']
})
export class ReopenInjuryScComponent extends ValidatorBaseScComponent implements OnInit {
  /**
   * Local variables
   */
  canEdit = false;
  maxLengthComments = 300;
  showConfirmReturnBtnReopenInjury = false;
  showConfirmSubmitBtnReopenInjury = false;
  disableActions = false;
  headingTextReopenInjury = 'OCCUPATIONAL-HAZARD.REOPEN-INJURY-TRANSACTION';
  noteRequestReopenInjury: boolean;
  /**
   * Output variables
   */
  @Output() reset: EventEmitter<null> = new EventEmitter();
  /**
   *Creating  instance
   * @param ohService
   * @param injuryService
   * @param lookupService
   * @param coreContributorService
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
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly establishmentService: EstablishmentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly contributorService: ContributorService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly workflowService: WorkflowService,
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
    this.fetchSystemParameters();
    if (this.routerData.taskId !== null) {
      this.intialiseTheView(this.routerData);
    } else {
      this.alertService.clearAlerts();
      this.navigateToInbox();
    }
    if (this.routerData.payload !== null) {
      const payload = JSON.parse(this.routerData?.payload);
      this.channel = payload?.channel;
    }
    this.setEditOption();
    const value = JSON.parse(this.routerData?.payload);
    if (this.channel === Channel.TPA && value.isValidator1 === 'TRUE') {
      if (value.isAdminInitiated === 'TRUE') {
        this.returnToEstAdmin = true;
        this.canEdit = false;
      } else {
        this.canEdit = true;
        this.returnToEstAdmin = false;
      }
    }
  }
  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.navigateToInbox();
  }
  /** Method to get system parameter like maximum backdated joining date. */
  fetchSystemParameters(): void {
    this.ohService.getSystemParams().subscribe(res => {
      if (res) {
        res.forEach(object => {
          if (object.name === 'BILL_BATCH_INDICATOR' && object.value === '1') {
            this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.SERVICE-UNAVILABLE');
            this.disableActions = true;
          }
        });
      }
    });
  }

  /**
   * Navigate to injury page on validator 1 edit
   */
  navigateToInjuryPage() {
    this.routerData.tabIndicator = 2;
    this.router.navigate(['home/oh/injury/reopen']);
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
   * Method to show approve modal
   * @param templateRef
   */
  approveTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  /**
   * This method is to show the modal reference
   * @param templateRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, templateNameReopenInjury = '') {
    if (templateNameReopenInjury === 'showRequestReopenInjury') {
      this.actionName = WorkFlowActions.SEND_FOR_INSPECTION;
    }
    if (templateNameReopenInjury === 'showReturnReopenInjury') {
      this.headingTextReopenInjury = 'OCCUPATIONAL-HAZARD.REOPEN-INJURY-TRANSACTION';
      this.noteRequestReopenInjury = true;
      this.showConfirmReturnBtnReopenInjury = true;
      this.showConfirmSubmitBtnReopenInjury = false;
      this.requestedDocumentList(false);
    }
    if (templateNameReopenInjury === 'showSubmitReopenInjury') {
      this.headingTextReopenInjury = 'OCCUPATIONAL-HAZARD.REQUEST-CLARIFICATION';
      this.noteRequestReopenInjury = false;
      this.returnTpa = true;
      this.requestedDocumentList(this.returnTpa);
      this.showConfirmReturnBtnReopenInjury = false;
      this.showConfirmSubmitBtnReopenInjury = true;
    }
    this.commentAlert = false;
    markFormGroupUntouched(this.reportInjuryModal);
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  /**
   * when return to establishment action is performed, comments will be shared
   */
  returnInjury() {
    this.returnAction(this.reportInjuryModal);
  }
  requestTpaReopen() {
    this.returnTpa = true;
    const workflowInfo = setWorkFlowDataForInspection(this.routerData, this.reportInjuryForm, 'request');
    const reopenInjuryData = setWorkFlowDataForTpa(
      this.routerData,
      workflowInfo,
      this.tpaRequestedDocs,
      this.reportInjuryModal,
      this.transactionNumber,
      this.tpaCode
    );
    if (this.reportInjuryModal && this.reportInjuryModal.valid) {
      this.workflowService.mergeAndUpdateTask(reopenInjuryData).subscribe(
        reslt => {
          this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.TRANSACTION-CLARIFICATION');
          this.router.navigate([RouterConstants.ROUTE_INBOX]);
          this.hideModal();
        },
        err => {
          this.showError(err);
          this.hideModal();
        }
      );
    } else {
      this.commentsEstAdmin = this.reportInjuryModal.get('comments').value;
      if (this.commentsEstAdmin.length > 0) {
        this.alertService.clearAlerts();
        this.commentAlert = true;
        markFormGroupTouched(this.reportInjuryModal);
      }
    }
  }
  /**
   * Method to show reject modal
   * @param templateRef
   */
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  /**
   * Method to navigate to view injury page
   */
  viewInjury() {
    this.ohService.setRoute(Route.REOPEN_INJURY);
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryDetailsWrapper.injuryDetailsDto.injuryId}/injury/info`
    ]);
  }
  /**
   * This method is used to confirm cancellation of transaction
   */
  confirmCancel() {
    this.modalRef.hide();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /**
   * This method is used to show the cancellation template on click of cancel
   * @param template
   */

  showCancelTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
}

