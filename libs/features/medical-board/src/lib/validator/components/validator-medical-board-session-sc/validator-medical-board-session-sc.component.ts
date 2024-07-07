import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  checkIqamaOrBorderOrPassport,
  convertToYYYYMMDD,
  CoreAdjustmentService,
  CoreBenefitService,
  LanguageToken,
  LookupService,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  StorageService,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  AddMemberFilterRequest,
  AddMemberRequest,
  Assessments,
  ConfigurationTypeEnum,
  ContractedMembers,
  CreateSessionBaseScComponent,
  CreateSessionService,
  DisabilityAssessmentService,
  IndividualSessionDetails,
  MbRouteConstants,
  RescheduleSessionList,
  SessionAssessments,
  SessionConfigurationService,
  SessionStatusService,
  VisitingDoctorList,
  ParticipantDetails,
  ParticipantList
} from '../../../shared';

@Component({
  selector: 'mb-validator-medical-board-session-sc',
  templateUrl: './validator-medical-board-session-sc.component.html',
  styleUrls: ['./validator-medical-board-session-sc.component.scss']
})
export class ValidatorMedicalBoardSessionScComponent extends CreateSessionBaseScComponent implements OnInit {
  lang = 'en';
  sessionId;
  reScheduleForm: FormGroup = new FormGroup({});
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  individualSessionDetails: IndividualSessionDetails = new IndividualSessionDetails();
  participantDetails: ParticipantDetails;
  visitingDoctorList: VisitingDoctorList[];
  sin = 368930709;
  sessionAssessments: SessionAssessments;
  isCompleted = false;
  index = 0;
  isPmbo = false;
  constructor(
    router: Router,
    activatedRoute: ActivatedRoute,
    lookupService: LookupService,
    modalService: BsModalService,
    statusService: SessionStatusService,
    alertService: AlertService,
    sessionService: CreateSessionService,
    configurationService: SessionConfigurationService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private coreAdjustmentService: CoreAdjustmentService,
    private coreBenefitService: CoreBenefitService,
    readonly workflowService: WorkflowService,
    private disabilityAssessmentService: DisabilityAssessmentService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly location: Location,
    readonly storageService: StorageService
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
    this.isCompleted = this.disabilityAssessmentService.isCompleted;
    if (this.isCompleted) {
      this.sessionId = this.disabilityAssessmentService.sessionId;
    } else {
      if (this.routerData) {
        const payload = this.routerData?.payload ? JSON.parse(this.routerData?.payload) : null;
        if (payload) {
          this.sessionId = payload?.sessionId;
          this.storageService.setLocalValue('sessionId', this.sessionId);
        } else {
          this.sessionId = this.storageService.getLocalValue('sessionId');
        }
        if (payload?.assignedRole === Role.MEDICAL_BOARD_OFFICER) {
          this.isPmbo = true;
        }
      }
    }
    // this.sin =  this.coreAdjustmentService.socialNumber;
    this.initialiseData();
  }
  /* Method to get initial data on page load */
  initialiseData() {
    this.getSessionData(this.sessionId);
    this.getParticipantsById();
    this.getVisitingDoctors();
    this.getSessionAssessments();
  }
  /* Method to get completed assessments */
  getSessionAssessments() {
    this.disabilityAssessmentService
      .getSessionAssessments(this.sessionId)
      .subscribe(res => (this.sessionAssessments = res));
  }
  /* Method to get visiting doctors */
  getVisitingDoctors() {
    this.disabilityAssessmentService
      .getVisitingDoctors(this.sessionId)
      .subscribe(res => (this.visitingDoctorList = res));
  }
  /* Method to show modal to select listed members */
  onAddContractedDoctor(template: TemplateRef<HTMLElement>, isGosiDoctor: boolean) {
    this.setTimeFromForm();
    const sessionDate = convertToYYYYMMDD(this.sessionData?.sessionDate?.gregorian.toString());
    // const sessionDate = convertToYYYYMMDD(this.reScheduleForm?.get('session')?.get('startDate.gregorian')?.value);
    const templateValue = { backdrop: true, ignoreBackdropClick: true, class: `modal-lg modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, templateValue);
    this.dateSession = sessionDate;
    this.sessionRequest.filterData = new AddMemberFilterRequest();
    this.sessionRequest.startTime = this.sessionData.startTime;
    this.sessionRequest.endTime = this.sessionData.endTime;
    if (isGosiDoctor) {
      this.sessionRequest.doctorType = 1002;
      this.getcontactedMembers(sessionDate, this.sessionRequest);
    } else {
      this.sessionRequest.doctorType = 1001;
      if (this.isAmb) {
        this.getcontactedMembers(sessionDate, this.sessionRequest);
      } else {
        this.sessionRequest.filterData.medicalBoardType = [
          { english: 'Primary Medical Board', arabic: 'اللجنة الطبية الابتدائية' }
        ];
        this.getcontactedMembers(sessionDate, this.sessionRequest);
      }
    }
  }
  /* Method to set start, end time */
  setTimeFromForm() {
    this.startHour = this.reScheduleForm?.get('session')?.get('startTimePicker.injuryHour')?.value;
    this.startMinute = this.reScheduleForm?.get('session')?.get('startTimePicker.injuryMinute')?.value;
    this.endHour = this.reScheduleForm?.get('session')?.get('endTime.injuryHour')?.value;
    this.endMinute = this.reScheduleForm?.get('session')?.get('endTime.injuryMinute')?.value;
  }
  /* Method to add contract doctors */
  onAddContractedMembers(memberValues: ContractedMembers[]) {
    memberValues?.forEach(members => {
      const memberData: RescheduleSessionList = {
        contractType: members.contractType,
        identity: members.nationalId,
        mbProfessionId: members.mbProfessionalId,
        mobileNo: members.mobileNumber,
        name: members.doctorName,
        specialty: members.speciality ? members.speciality[0] : null,
        subSpecialty: members.subSpeciality,
        inviteeId: members?.inviteeId,
        isUnAvailable: false
      };
      this.sessionData?.mbList?.push(memberData);
    });
    this.sessionData = { ...this.sessionData };
    if (this.sessionData && this.sessionData?.mbList)
      this.sessionData.mbList = this.sessionData?.mbList?.reduce((acc, val) => {
        if (!acc.find(id => id?.mbProfessionId === val?.mbProfessionId)) {
          acc.push(val);
        }

        return acc;
      }, []);
    const addMemberRequest: AddMemberRequest[] = memberValues.map(member => {
      return {
        contractId: member.contractId,
        mbProfessionalId: member.mbProfessionalId,
        memberType: member.contractType
      };
    });
    this.addContractedMembers(addMemberRequest);
    this.modalRef?.hide();
    this.showErrors = false;
  }
  /* Method to navigate to contributor profile */
  navigateToProfile(identificationNo: number) {
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(identificationNo)]);
    this.hideModal();
  }
  /**
   * Method to hide modal
   */
  declineValue() {
    this.modalRef?.hide();
  }
  /* Method to get participant by session id */
  getParticipantsById() {
    this.statusService.getParticipantsBySessionId(this.sessionId).subscribe(res => {
      this.participantDetails = res;
    });
  }
  /* Method to select participant to conduct assessment */
  onParticipantNinClicked(participant: ParticipantList) {
    if (this.sessionData?.sessionStarted) {
      if (participant?.status?.english === 'Assigned' || participant?.status?.english === 'Draft') {
        this.coreAdjustmentService.socialNumber = participant?.sin;
        this.coreBenefitService.injuryId = participant?.injuryId;
        this.coreAdjustmentService.identifier = participant?.personID;
        this.coreBenefitService.assessmentRequestId = participant?.assessmentRequestId;
        this.coreBenefitService.registrationNo = participant?.regNo;
        this.coreBenefitService.benefitRequestId = participant?.benefitReqId;
        this.disabilityAssessmentService.assessmentType = participant?.assessmentType;
        this.disabilityAssessmentService.sessionIdMb = this.sessionId;
        this.disabilityAssessmentService.isCompleted = this.isCompleted;
        this.disabilityAssessmentService.mbassessmentId = participant.disbAssmntId;
        this.disabilityAssessmentService.prevDisabilityAssmntId = participant.prevDisbAssmntId;
        this.disabilityAssessmentService.nationalId = participant.nationalID;
        this.disabilityAssessmentService.assessmentStatus = participant.status;
        this.disabilityAssessmentService.documentReferenceNo = participant.documentReferenceNo;
        this.disabilityAssessmentService.participantPresence = participant?.participantAttendance;
        this.disabilityAssessmentService.isSaudi = participant?.isSaudi;
        this.disabilityAssessmentService.identifier = checkIqamaOrBorderOrPassport(participant.identity)?.id;
        const disabilityUrl =
          RouterConstants.ROUTE_OH_DISABILITY_ASSESSMENT +
          `/${participant?.sin}/${participant?.personID}/${participant?.injuryId || participant?.benefitReqId}`;
        this.router.navigate([disabilityUrl], {
          queryParams: { disabilityType: participant?.assessmentType?.english }
        });
      }
    }
  }
  /* Method to view assessment details by assessment id */
  viewDisabilityAssessment(assessments: Assessments) {
    this.coreAdjustmentService.socialNumber = assessments?.sin;
    this.coreBenefitService.injuryId = assessments?.injuryId;
    this.coreAdjustmentService.identifier = assessments?.identifier;
    this.coreBenefitService.assessmentRequestId = assessments?.assessmentRequestId;
    this.disabilityAssessmentService.disabilityAssessmentId = assessments.disabilityAssmtId;
    this.disabilityAssessmentService.nationalId = assessments?.identifier?.personIdentifier;
    this.disabilityAssessmentService.disabilityType = {
      english: assessments?.disabilityType,
      arabic: assessments?.disabilityType
    };
    this.disabilityAssessmentService.isAmbType = this.isAmb;
    this.router.navigate([MbRouteConstants.ROUTE_ASSESSMENT_VIEW], {
      queryParams: { referenceNo: assessments.referenceNo }
    });
  }
  /* Method to navigate to previous page */
  routeBack() {
    // this.location.back();?
    if(this.routerData && this.routerData.resourceType){
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }else
    this.router.navigate([`/home/medical-board/medical-board-session`]);
  }
  /* Method to remove medical board member */
  removeMember(mbProfessionalId) {
    const index = this.sessionData.mbList
      .map((item: RescheduleSessionList) => item.mbProfessionId)
      .indexOf(mbProfessionalId);
    const inviteeId = this.sessionData.mbList[index].inviteeId;
    this.removeMedicalMember(this.sessionId, inviteeId, ConfigurationTypeEnum.REMOVE_MEMBER);
    this.modalRef?.hide();
    this.initialiseData();
  }
}
