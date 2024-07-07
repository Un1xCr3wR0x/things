import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, CoreAdjustmentService, CoreBenefitService, LanguageToken, LookupService, RouterConstants, RouterData, RouterDataToken, WorkFlowActions, WorkflowService } from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, noop, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { Assessments, CreateSessionBaseScComponent, CreateSessionService, DisabilityAssessmentService, DoctorService, MbRouteConstants, SessionAssessments, SessionConfigurationService, SessionStatusService } from '../../../shared';
import { ContributorBPMRequest } from '@gosi-ui/features/contributor';
import { catchError, tap } from 'rxjs/operators';


@Component({
  selector: 'mb-contract-doctor-esign-sc',
  templateUrl: './contract-doctor-esign-sc.component.html',
  styleUrls: ['./contract-doctor-esign-sc.component.scss']
})
export class ContractDoctorEsignScComponent extends CreateSessionBaseScComponent implements OnInit {

  sessionId: number;
  sessionAssessments: SessionAssessments;
  lang = 'en';
  isCotractDoctor = true;
  professionalId:number;
  transactionId: number;
  @ViewChild('esignTemplate', { static: true })
  esignTemplate: TemplateRef<HTMLElement>;
  constructor(
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly statusService: SessionStatusService,
    readonly alertService: AlertService,
    readonly sessionService: CreateSessionService,
    readonly configurationService: SessionConfigurationService,
    private disabilityAssessmentService: DisabilityAssessmentService,
    private coreAdjustmentService: CoreAdjustmentService,
    private coreBenefitService: CoreBenefitService,
    readonly doctorService: DoctorService,
    readonly workflowService: WorkflowService,
    readonly location: Location,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
  ) {
    super(
      router,
      activatedRoute,
      lookupService,
      modalService,
      statusService,
      alertService,
      sessionService,
      workflowService,
      configurationService
    );
  }

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.isCotractDoctor = true;
    const payload =JSON.parse(this.routerData.payload)
    this.sessionId = payload?.mbSessionId;
    // this.sessionId = 5615;
    this.professionalId=payload.mbProfessionalId;
    this.transactionId = payload.referenceNo;
    this.getSessionDetails(this.sessionId);
    this.getSessionAssessments();
  }
  showModal() {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(this.esignTemplate, config);
  }
  getSessionAssessments() {
    this.disabilityAssessmentService
      .getSessionAssessments(this.sessionId, this.professionalId)
      .subscribe(res => (this.sessionAssessments = res));
  }
  viewDisabilityAssessment(assessments: Assessments) {
    this.coreAdjustmentService.socialNumber = assessments?.sin;
    this.coreBenefitService.injuryId = assessments?.injuryId;
    this.coreAdjustmentService.identifier = 407100;
    this.disabilityAssessmentService.isContractDoctor = this.isCotractDoctor;
    this.disabilityAssessmentService.disabilityAssessmentId = assessments.disabilityAssmtId;
    this.disabilityAssessmentService.nationalID = assessments.identifier?.personIdentifier;
    this.disabilityAssessmentService.transactionTraceId = this.transactionId;
    this.disabilityAssessmentService.disabilityType = { english: assessments?.disabilityType, arabic: assessments?.disabilityType};
  this.router.navigate([MbRouteConstants.ROUTE_ASSESSMENT_VIEW]);
  }
  esignConfirmed(){
    // this.doctorService.saveEsignWorkitem(this.professionalId,this.transactionId,this.sessionId).subscribe(res => {
    //   this.alertService.clearAlerts();
      let action;
      action = WorkFlowActions.APPROVE;
      const datas = this.setWorkflowData(this.routerData, action);
      this.saveWorkflow(datas);
      this.alertService.showSuccessByKey('MEDICAL-BOARD.ESIGN-SUCCESS')
    // });
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
    this.modalService.hide();
  }
  routeBack() {
    if (this.routerData && this.routerData.payload) this.router.navigate([RouterConstants.ROUTE_INBOX]);
    else this.location.back();
  }
   /** Method to set workflow details. */
   setWorkflowData(routerData: RouterData, action: string): ContributorBPMRequest {
    const datas = new ContributorBPMRequest();
    datas.user = routerData.assigneeId;
    datas.outcome = action;
    datas.taskId = routerData.taskId;
    return datas;
  }
  /**
   * Method to save workflow details.
   * @param data workflow data
   */
  saveWorkflow(data: ContributorBPMRequest): void {
    this.workflowService
      .updateTaskWorkflow(data)
      .pipe(
        tap(() => {
          this.router.navigate([RouterConstants.ROUTE_INBOX]);
        }),
        catchError(err => {
          this.handledError(err, false);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  /** Method to navigate to inbox on error during view initialization. */
  handledError(error, flag: boolean): void {
    this.alertService.showError(error.error.message);
    if (flag) this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  getSessionDetails(sessionId:number){
    this.statusService.getRescheduleSessionData(sessionId).subscribe(res => {
      this.sessionData = res;
    })
  }
}
