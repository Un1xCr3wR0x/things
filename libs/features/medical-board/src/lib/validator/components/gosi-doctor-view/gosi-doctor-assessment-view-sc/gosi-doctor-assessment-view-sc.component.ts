import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  checkIqamaOrBorderOrPassport,
  CommonIdentity,
  CoreAdjustmentService,
  CoreBenefitService,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService,
  LovList,
  MedicalAssessmentService,
  MedicalboardAssessmentService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { ContributorService } from '@gosi-ui/features/contributor';
import {
  Contributor,
  DisabilityAssessmentService,
  DoctorService,
  getIdentityLabel,
  MedicalBoardService,
  MbRouteConstants,
  MemberService,
  ValidatorMemberBaseScComponent,
  ValidatorRoles,
  ApproveSuccessResponse,
  DisabilityDetails,
  AssessmentDetails,
  AssessmentConstants,
  MBConstants
} from '../../../../shared';
import { AssessmentDetail } from '../../../../shared';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';
import { NumberMaskDirective } from '@gosi-ui/foundation-theme';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'mb-gosi-doctor-assessment-view-sc',
  templateUrl: './gosi-doctor-assessment-view-sc.component.html',
  styleUrls: ['./gosi-doctor-assessment-view-sc.component.scss']
})
export class GosiDoctorAssessmentViewScComponent extends ValidatorMemberBaseScComponent implements OnInit {
  contributor: Contributor;
  documents: DocumentItem[] = [];
  complicationDocumentList: DocumentItem[] = [];
  collapseView: boolean;
  identity: CommonIdentity | null;
  identityLabel = ' ';
  // personId : number;
  assessmentDetails: AssessmentDetail;
  canReturn: boolean;
  modalRef: BsModalRef;
  returnReasonList: Observable<LovList>;
  referenceNo: number;
  injuryId: number;
  // sessionId = 5428;
  key: number;
  assessmentDocuments: DocumentItem[] = [];
  approveAssessment: ApproveSuccessResponse = new ApproveSuccessResponse();
  lang = 'en';
  previousDisabilityDetails: DisabilityDetails;
  isEdited = false;
  injuryType;
  transactionId: number;
  contributorDocuments: DocumentItem[] = [];
  referenceNumber: number;
  constructor(
    readonly doctorService: DoctorService,
    readonly medicalBoardService: MedicalBoardService,
    readonly disabilityAssessmentService: DisabilityAssessmentService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly ohService: OhService,
    readonly medicalboardAssessmentService: MedicalboardAssessmentService,
    readonly coreMedicalAssessmentService: MedicalAssessmentService,
    // readonly contributorService: ContributorService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly memberService: MemberService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    private lookUpService: LookupService,
    private coreBenefitService: CoreBenefitService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
    super(
      doctorService,
      medicalBoardService,
      memberService,
      lookUpService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router,
      routerDataToken
    );
  }

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isEdited = this.disabilityAssessmentService.isModified;
    this.getDataFromToken(this.routerDataToken);
    this.getRolesForView(this.routerDataToken);
    this.getContributor();

    this.getAssessmentDetailsView();
    this.returnReasonList = this.lookUpService.getEstablishmentRejectReasonList();
    this.getPreviousDisability();
  }
  /** Method to identify validator actions. */
  // identifyValidatorActions(role: string): void {
  //   if (role === ValidatorRoles.VALIDATOR_ONE) {
  //     this.canReject = true;
  //     this.canReturn = false;
  //   } else if (role === ValidatorRoles.VALIDATOR_TWO) {
  //     this.canReject = true;
  //     this.canReturn = true;
  //   }
  // }
  getContributor() {
    this.disabilityAssessmentService.getContributorBySin(this.socialInsuranceNo).subscribe(res => {
      this.contributor = res;
      this.identity = checkIqamaOrBorderOrPassport(this.contributor?.person?.identity);
      this.identityLabel = getIdentityLabel(this.identity);
    });
  }
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }

  getDocument() {
    this.coreMedicalAssessmentService
      .getMedicalBoardDocuments(this.identifier, this.disabilityAssessmentId)
      .subscribe(documents => {
        this.assessmentDocuments = documents?.filter(item => item.documentContent !== null);
      });
  }


  documentFetch(personId, referenceNo?, transactionId?, transactionType?) {
    this.documentService.getEveryDocuments(transactionId, referenceNo).subscribe(documentsResponse => {
      const doc1 = documentsResponse?.filter(item => item.documentContent !== null);
      this.assessmentDocuments = [...doc1];
      this.getOtherDoc([...doc1]);
    });
  }
  getOtherDoc(document) {
    this.documentService
      .getEveryDocuments(this.disabilityAssessmentId, null, this.businessType)
      .subscribe(documentsResponse => {
        const doc2 = documentsResponse?.filter(item => item.documentContent !== null);
        if (doc2.length > 0) {
          this.assessmentDocuments = [...document, ...doc2];
        } else {
          this.assessmentDocuments = [document];
        }
      });
  }
  onCollapse(value: boolean) {
    this.collapseView = value;
  }
  getAssessmentDetailsView() {
    this.doctorService
      .getAssessmentDetails(this.identifier, this.disabilityAssessmentId, this.referenceNo)
      .subscribe(res => {
        this.assessmentDetails = res;
        this.injuryId = res?.injuryId;

        this.disabilityAssessmentService.setRegNo(this.assessmentDetails?.regNo);

        if (this.assessmentDetails?.ohType === 0) {
          this.injuryType = this.injuryBusinessType;
          this.transactionId = this.injuryId;
          this.referenceNumber = this.assessmentDetails?.docReferenceNo;
        } else if (this.assessmentDetails?.ohType === 2) {
          this.injuryType = this.complicationBusinessType;
          this.transactionId = this.injuryId;
          this.referenceNumber = this.assessmentDetails?.docReferenceNo;
        } else if (this.isReassessment) {
          this.injuryType = this.reassessmentType;
          this.transactionId = this.assmntReqId;
          this.referenceNumber = this.assmntReqId;
        } else if (this.isNonOcc) {
          this.injuryType = this.nonOccBusinessType;
          this.transactionId = this.assessmentDetails?.benefitRequestId;
          this.referenceNumber = this.assessmentDetails?.docReferenceNo;
        } else {
          this.injuryType = this.heirBusinessType;
          this.referenceNumber = this.assessmentDetails?.docReferenceNo;
          this.transactionId = this.assessmentDetails?.benefitRequestId;
        }
        this.getDocument();
        // this.documentFetch(
        //   this.personId,
        //   this.referenceNumber ? this.referenceNumber : null,
        //   this.transactionId,
        //   this.injuryType
        // );
        // this.getinjuryDocuments(this.injuryId, this.injuryType);
      });
  }
  confirmCancel() {
    this.decline();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  decline(): void {
    this.modalRef.hide();
  }
  hideModal() {
    this.modalRef.hide();
  }
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  confirmReturn(key) {
    const action = WorkFlowActions.RETURN;
    const data = super.setWorkflowData(this.routerDataToken, action);
    super.saveWorkflow(data);
    super.hideModal();
  }
  confirmApprove() {
    let action;
    if (
      !this.assessmentDetails?.modifiedDetails?.isParticipantPresent &&
      this.assessmentDetails?.modifiedDetails?.assessmentChannel?.english === MBConstants.RESCHEDULE_ASSESSMENT &&
      this.assessmentDetails?.isVdRequired
    ) {
      action = WorkFlowActions.MODIFY_VISITING_DOCTOR;
    } else if (
      this.assessmentDetails?.modifiedDetails?.isParticipantPresent === false &&
      this.assessmentDetails?.modifiedDetails?.assessmentChannel?.english === MBConstants.RESCHEDULE_ASSESSMENT &&
      !this.assessmentDetails?.isVdRequired
    ) {
      action = WorkFlowActions.APPROVE;
    } else if (
      this.assessmentDetails?.modifiedDetails?.assessmentResult?.english === MBConstants.RESCHEDULE_ASSESSMENT &&
      (this.assessmentDetails?.modifiedDetails?.rescheduleReason?.english ===
        MBConstants.REQUEST_CLARIFICATION_FROM_HEIR ||
        this.assessmentDetails?.modifiedDetails?.rescheduleReason?.english ===
          MBConstants.REQUEST_CLARIFICATION_FROM_CONTRIBUTOR)
    ) {
      action = WorkFlowActions.REQUEST_CLARIFICATION_FROM_CONTRIBUTOR;
    } else if (
      this.assessmentDetails?.modifiedDetails?.assessmentResult?.english === MBConstants.RESCHEDULE_ASSESSMENT &&
      (this.assessmentDetails?.modifiedDetails?.rescheduleReason?.english ===
        MBConstants.VISITING_DOCTOR_UNAVAILABILITY ||
        this.assessmentDetails?.modifiedDetails?.rescheduleReason?.english === MBConstants.ADD_ANOTHER_SPECIALITY)
    ) {
      action = WorkFlowActions.MODIFY_VISITING_DOCTOR;
    } else {
      action = this.isGosiDoctor ? WorkFlowActions.SUBMIT : WorkFlowActions.APPROVE;
    }
    const datas = this.setWorkflowData(this.routerDataToken, action);
    this.saveWorkflow(datas);
    this.hideModal();
  }

  navigateToGosiDoctorEdit() {
    this.disabilityAssessmentService.modifyAssessmentDetails = true;
    this.coreBenefitService.assessmentRequestId = this.assessmentDetails?.assessmentRequestId;
    this.disabilityAssessmentService.sessionIdMb = this.sessionId;
    this.disabilityAssessmentService.isGosiDr = true;
    this.disabilityAssessmentService.isHoReturn = this.isHoReturn;
    this.coreBenefitService.injuryId = this.injuryId;
    this.disabilityAssessmentService.transactionTraceId = this.referenceNo;
    this.disabilityAssessmentService.mbassessmentId = this.disabilityAssessmentId;
    this.disabilityAssessmentService.personid = this.personId;
    this.disabilityAssessmentService.personIdentifier = this.identifier;
    this.disabilityAssessmentService.assessmentType = this.assessmentDetails?.assessmentType;
    const disabilityUrl =
      RouterConstants.ROUTE_OH_DISABILITY_ASSESSMENT +
      `/${this.socialInsuranceNo}/${this.personId}/${this.injuryId || this.assessmentDetails?.benefitRequestId}`;
    this.router.navigate([disabilityUrl], {
      queryParams: { disabilityType: this.assessmentDetails?.assessmentType?.english }
    });
  }
  navigateToAppealHistory() {
    this.medicalboardAssessmentService.disabilityAssessmentId = this.disabilityAssessmentId;
    this.ohService.setRegistrationNo(this.registrationNo);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohService.setInjuryId(this.injuryId);
    this.ohService.setDisabilityType(this.assessmentDetails?.assessmentType?.english);
    this.ohService.setIdentifier(this.identifier);
    this.ohService.setIsHoWorkitem(true);
    this.medicalboardAssessmentService.isWithdraw = false;
    this.router.navigate([MbRouteConstants.ROUTE_GOSI_DOCTOR_APPEAL_VIEW]);
  }
  viewInjuryHistory() {
    // this.router.navigate(['/home/oh/injury/history']);
    this.router.navigate([`/home/oh/injury/history/${this.socialInsuranceNo}/true`]);
  }
  //Method tp get previous disability details
  getPreviousDisability() {
    this.disabilityAssessmentService.getPreviousDisability(this.identifier).subscribe(res => {
      this.previousDisabilityDetails = res;
    });
  }
  viewAssessmentById(data: AssessmentDetails) {
    this.coreAdjustmentService.identifier = this.identifier;
    this.coreAdjustmentService.socialNumber = this.socialInsuranceNo;
    this.coreBenefitService.injuryId = this.injuryId;
    this.coreBenefitService.regNo = this.registrationNo;
    this.disabilityAssessmentService.disabilityAssessmentId = data.assessmentId;
    this.disabilityAssessmentService.disabilityType = data.disabilityType;
    this.disabilityAssessmentService.contractDoctor = false;
    this.disabilityAssessmentService.assessmentTypes = data?.assessmentType;
    this.disabilityAssessmentService.benefitReqId = data?.benefitReqId;
    this.disabilityAssessmentService.referenceNo = data?.referenceNo;
    this.router.navigate([AssessmentConstants.ROUTE_VIEW_ASSESSMENT]);
  }
  viewContributorDetails(identifier) {
    this.router.navigate([RouterConstants.ROUTE_INDIVIDUAL_PROFILE_INFO(identifier)]);
  }
}
