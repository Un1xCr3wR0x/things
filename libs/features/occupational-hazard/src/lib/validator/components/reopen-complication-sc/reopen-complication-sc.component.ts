import { Component, EventEmitter, Inject, OnInit, Output, TemplateRef, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  markFormGroupUntouched,
  WorkflowService,
  LovList,
  WorkFlowActions,
  Channel,
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
import { Location, PlatformLocation } from '@angular/common';
import {
  Route,
  WorkFlowType,
  ComplicationReject,
  setWorkFlowDataForInspection,
  setWorkFlowDataForTpa,
  Disease
} from '../../../shared';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'oh-reopen-complication-sc',
  templateUrl: './reopen-complication-sc.component.html',
  styleUrls: ['./reopen-complication-sc.component.scss']
})
export class ReopenComplicationScComponent extends ValidatorBaseScComponent implements OnInit {
  /**
   * Local variables
   */
  canEdit = false;
  maxLengthComments = 300;
  injuryRejectReasonList$: Observable<LovList>;
  injuryRejectDetails: ComplicationReject = new ComplicationReject();
  showConfirmReturnBtnReopenComplication = false;
  showConfirmSubmitBtnReopenComplication = false;
  disableActions = false;
  headingTextReopenComplication = 'OCCUPATIONAL-HAZARD.COMPLICATION.REOPEN-COMPLICATION-TRANSACTION';
  noteRequestReopenComplication: boolean;

  /**
   * Output variables
   */
  @Output() reset: EventEmitter<null> = new EventEmitter();
  /**
   *Creating  instance
   * @param modalService
   * @param validatorRoutingService
   * @param fb
   * @param routerData
   * @param manageInjuryService
   * @param router
   * @param documentService
*/
constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly ohService: OhService,
    readonly establishmentService: EstablishmentService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly contributorService: ContributorService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly injuryService: InjuryService,
    readonly alertService: AlertService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly router: Router,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
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
   */
  ngOnInit(): void {
    this.reportInjuryForm = this.createInjuryDetailsForm();
    this.reportInjuryModal = this.createInjuryModalForm();
    this.fetchSystemParameters();
    this.injuryRejectReasonList$ = this.injuryService.getInjuryRejectReasonList(WorkFlowType.REJECT_INJURY);
    if (this.routerData.taskId) {
      this.intialiseTheView(this.routerData);
    } else {
      this.navigateToInbox();
      this.alertService.clearAlerts();
    }
    const payload = JSON.parse(this.routerData.payload);
    this.setEditOption();
    if (this.channel === Channel.TPA && payload.isValidator1 === 'TRUE') {
      if (payload.isAdminInitiated === 'TRUE') {
        this.canEdit = false;
        this.returnToEstAdmin = true;
      } else {
        this.canEdit = true;
        this.returnToEstAdmin = false;
      }
    }
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
   * Method to navigate to view complication page
   */
  viewComplication() {
    this.ohService.setRoute(Route.REOPEN_COMP);
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
  /**
   *  Method to navigate to scan documents screen on edit.
   */
  navigateToScan() {
    this.routerData.tabIndicator = 3;
    this.router.navigate(['home/oh/complication/edit?activeTab=3']);
  }
  /**
   * While rejecting from validator
   */
  confirmRejectComplication() {
    if (this.reportInjuryModal) {
      const comments = this.reportInjuryModal?.get('comments')?.value;
      const injuryRejectReason = this.reportInjuryModal.get('rejectionReason')?.value;
      if (injuryRejectReason) {
        this.injuryRejectDetails.comments = comments;
        this.injuryRejectDetails.rejectionReason = injuryRejectReason;
        this.ohService
          .complicationRejection(this.injuryRejectDetails, this.registrationNo, this.socialInsuranceNo)
          .subscribe(
            res => {},
            err => {
              this.showError(err);
            }
          );
      }
    }
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
  showModal(templateRef: TemplateRef<HTMLElement>, templateNameReopenComplication = '') {
    if (templateNameReopenComplication === 'showRequestReopenComp') {
      this.actionName = WorkFlowActions.SEND_FOR_INSPECTION;
    }
    if (templateNameReopenComplication === 'showReopenComplicationReturn') {
      this.noteRequestReopenComplication = true;
      this.showConfirmSubmitBtnReopenComplication = false;
      this.showConfirmReturnBtnReopenComplication = true;
      this.headingTextReopenComplication = 'OCCUPATIONAL-HAZARD.COMPLICATION.REOPEN-COMPLICATION-TRANSACTION';
      this.requestedDocumentList(false);
    }
    if (templateNameReopenComplication === 'showReopenComplicationSubmit') {
      this.noteRequestReopenComplication = false;
      this.returnTpa = true;
      this.requestedDocumentList(this.returnTpa);
      this.showConfirmReturnBtnReopenComplication = false;
      this.showConfirmSubmitBtnReopenComplication = true;
      this.headingTextReopenComplication = 'OCCUPATIONAL-HAZARD.REQUEST-CLARIFICATION';
    }
    this.commentAlert = false;
    markFormGroupUntouched(this.reportInjuryModal);
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  /**
   * Navigate to injury page on validator 1 edit
   */
  navigateToComplicationPage() {
    this.routerData.tabIndicator = 2;
    this.router.navigate(['home/oh/complication/re-open']);
  }
  /**
   * when return to establishment action is performed, comments will be shared
   */
  returnComplication() {
    this.returnAction(this.reportInjuryModal);
  }
  requestTpaReopenComplication() {
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
    this.ohService.setRoute(Route.REOPEN_COMP);
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.transientComplicationDetails.injuryDetails.injuryId}/injury/info`
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

