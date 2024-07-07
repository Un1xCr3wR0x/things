import { Component, Inject, OnDestroy, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  LanguageToken,
  LookupService,
  markFormGroupTouched,
  startOfDay,
  convertToYYYYMMDD,
  WorkflowService
} from '@gosi-ui/core';
import moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, noop, Subscription, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  AddParticipantsList,
  BulkParticipants,
  ContractedMembers,
  IndividualSessionDetails,
  RegisterMedicalSessionDetails,
  SessionDetails,
  SessionLimitRequest,
  SessionRequest,
  UnAvailableMemberListRequest
} from '../../../shared/models';
import { ConfigurationTypeEnum, PersonTypeEnum, SessionChannelEnum } from '../../../shared/enums';
import { MBConstants, MbRouteConstants } from '../../../shared/constants';
import { CreateSessionBaseScComponent } from '../../../shared/components';
import { CreateSessionService, SessionConfigurationService, SessionStatusService } from '../../../shared/services';
import { ParticipantSpeciality } from '../../../shared/models/participant-speciality';

@Component({
  selector: 'mb-create-adhoc-session-sc',
  templateUrl: './create-adhoc-session-sc.component.html',
  styleUrls: ['./create-adhoc-session-sc.component.scss']
})
export class CreateAdhocSessionScComponent extends CreateSessionBaseScComponent implements OnInit, OnDestroy {
  /**
   * Local variables
   */
  lang = 'en';
  isRequired: boolean;
  arrayList: BilingualText[];
  templateId: number;
  removeIndex: number;
  inviteId: number;
  memberRemoveIndex: number;
  selectParticipants: AddParticipantsList[] = [];
  registerSessionDetails: RegisterMedicalSessionDetails = new RegisterMedicalSessionDetails();
  removeMessage: BilingualText;
  memberRemoveMessage: BilingualText;
  isPrimaryMedicalBoard = true;
  isEditMode = false;
  bulkParticipants: BulkParticipants[] = [];
  selectedDoctors: ContractedMembers[] = [];
  replaceIndex = 0;
  specialityValues = [];
  selectassignparticipant = [];
  sessionDetails: SessionDetails;
  sessionRequest: SessionRequest = new SessionRequest();
  selectedMembersSubscription: Subscription;
  isNoPastTimeError = true;
  submitDisable = false;
  isAddparticpantbyMb = false;
  participantLength: number;
  requiredDate: number;
  /**
   *
   * @param lookupService
   * @param activatedRoute
   * @param modalService
   * @param statusService
   * @param alertService
   * @param sessionService
   * @param router
   * @param configurationService
   */
  constructor(
    readonly lookupService: LookupService,
    readonly activatedRoute: ActivatedRoute,
    readonly modalService: BsModalService,
    readonly statusService: SessionStatusService,
    readonly alertService: AlertService,
    readonly sessionService: CreateSessionService,
    readonly router: Router,
    readonly workflowService: WorkflowService,
    readonly configurationService: SessionConfigurationService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
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
  ngOnInit() {
    this.alertService.clearAlerts();
    this.selectassignparticipant = history.state.adhocdata?.participantSpeciality;
    this.language.subscribe(lang => (this.lang = lang));
    super.getEditMode();
    this.getSpecialityList();
    this.getSessionFrequency();
    if (!this.isEditMode) super.getMbDetails().subscribe();
    super.getLovValues();
    this.isMbofficer();
    if (this.isEditMode) {
      this.getSessionstatusDetails(this.sessionId);
    }
    if (this.selectassignparticipant != null) {
      this.isAddparticpantbyMb = true;
      this.participantLength = this.selectassignparticipant.length;
      this.selectassignparticipant.forEach(val => {
        this.selectParticipants?.push(val);
      });
      this.configurationDetails.participantList = this.selectParticipants;
      this.registerSessionDetails.participantsList = this.selectParticipants;
    }
  }

  onAddContractedDoctor(template: TemplateRef<HTMLElement>, isDoctor?: boolean) {
    const rawRegularFormValue = this.regularSessionForm.getRawValue();
    if(rawRegularFormValue?.sessionDetails?.startDate?.gregorian) {
    this.showContractedMemberModal(template, isDoctor);
    } else {
      this.alertService.showError(this.invalidDateMsg)
    }
  }
  /** Method to hide modal*/
  declineValue() {
    this.sessionRequest = new SessionRequest();
    this.modalRef.hide();
  }

  onLimit(limit: SessionLimitRequest) {
    if (this.sessionRequest) {
      this.sessionRequest.limit = limit;
      this.getcontactedMembers(this.dateSession,this.sessionRequest);
    }
  }
  onChangeValue(channel: string) {
    if (channel !== SessionChannelEnum.VIRTUAL) this.isRequired = true;
    else this.isRequired = false;
  }
  bulkParticipant(participant: BulkParticipants[]) {
    this.bulkParticipants = participant;
  }

  onCreateAdhocSession() {
    markFormGroupTouched(this.regularSessionForm);
    if (this.isEditMode) this.registerSessionDetails.startDate = this.configurationDetails?.startDate;
    else {
      const sessionDetailsValue = this.regularSessionForm.get('sessionDetails')?.value;
      this.registerSessionDetails.startDate.gregorian = startOfDay(sessionDetailsValue?.startDate.gregorian);
    }
    const startHours = this.regularSessionForm?.get('inviteForm').get('startTimePicker.injuryHour')?.value;
    const startMinutes = this.regularSessionForm?.get('inviteForm')?.get('startTimePicker.injuryMinute')?.value;
    const endHours = this.regularSessionForm?.get('inviteForm')?.get('timePicker.injuryHour')?.value;
    const endMinutes = this.regularSessionForm?.get('inviteForm')?.get('timePicker.injuryMinute')?.value;
    const isNoTimeError =
      Number(startHours) === Number(endHours)
        ? Number(startMinutes) < Number(endMinutes)
          ? true
          : false
        : Number(startHours) < Number(endHours)
        ? true
        : false;
    const currentHours = new Date().getHours();
    const currentMin = new Date().getMinutes().toString();
    const sessionDetails = this.regularSessionForm.get('sessionDetails')?.value;
    const startDate = convertToYYYYMMDD(this.registerSessionDetails.startDate?.gregorian?.toString());
    const currentDate = convertToYYYYMMDD(new Date().toString());
    this.isNoPastTimeError = true;
    if (startDate && startDate === currentDate) {
      this.isNoPastTimeError =
        Number(startHours) === Number(currentHours)
          ? Number(currentMin) < Number(startMinutes)
            ? true
            : false
          : Number(currentHours) < Number(startHours)
          ? true
          : false;
    }
    if (this.regularSessionForm?.valid && isNoTimeError && (this.isNoPastTimeError || this.isEditMode)) {
      if (this.regularSessionForm.get('sessionDetails')) {
        this.arrayList = [];
        this.registerSessionDetails.channel = this.regularSessionForm.get('sessionDetails')?.value?.sessionChannelList;
        if (this.registerSessionDetails.channel.english !== SessionChannelEnum.VIRTUAL)
          this.registerSessionDetails.beneficiarySlotOpenDays = Number(
            this.regularSessionForm.get('sessionSlotForm')?.value?.noOfSessionPriorDays
          );
        else this.registerSessionDetails.beneficiarySlotOpenDays = 0;
        const dateValues = this.regularSessionForm.get('sessionDetails')?.value.day;
        if (dateValues)
          Object.entries(dateValues).forEach(key => {
            if (key[1] === true) {
              this.arrayList.push(MBConstants.DAYS_WEEK.find(val => val.value === key[0]).label);
            }
          });
        this.registerSessionDetails.days = this.arrayList;
        this.registerSessionDetails.doctorInviteCancelGraceDays = 7;
        this.registerSessionDetails.isDoctorInviteCancelAllowed = true;
        this.registerSessionDetails.endDate.gregorian = moment(new Date()).toDate();
        const endTimePickers =
          this.regularSessionForm.get('sessionDetails')?.value?.timePicker.injuryHour +
          '::' +
          this.regularSessionForm.get('sessionDetails')?.value?.timePicker.injuryMinute;
        this.registerSessionDetails.endTime = endTimePickers;
        this.registerSessionDetails.frequency = this.regularSessionForm.get('sessionDetails')?.value?.sessionFrequency;
        this.registerSessionDetails.minimumBeneficiaries = Number(
          this.regularSessionForm.get('sessionSlotForm')?.value?.noOfSessionDays
        );
        this.registerSessionDetails.maximumBeneficiaries = Number(
          this.regularSessionForm.getRawValue().sessionSlotForm.noOfbeneficiaries
        );
        // this.registerSessionDetails.maximumBeneficiaries = Number(
        //   this.regularSessionForm.get('sessionSlotForm')?.value?.noOfbeneficiaries
        // );
        this.registerSessionDetails.medicalBoardType =
          this.regularSessionForm.get('sessionDetails')?.value?.medicalBoardList;
        this.registerSessionDetails.sessionCreationGraceDays = 21;
        this.registerSessionDetails.officeLocation =
          this.regularSessionForm.get('sessionDetails')?.value?.officeLocation;
        this.registerSessionDetails.sessionMemberDetails = [];
        // const list = this.originalList.length > 0 ? this.originalList : this.selectedMembers;
        const list = this.selectedMembers;
        list?.forEach(member => {
          const memberDetail = {
            isRemoved: this.selectedMembers.includes(member) ? 0 : 1,
            contractId: member.contractId,
            inviteeId: member.inviteeId,
            mbProfessionalId: member.mbProfessionalId,
            memberType: member.contractType
          };
          this.registerSessionDetails.sessionMemberDetails.push(memberDetail);
        });

        const startTimePickers =
          this.regularSessionForm.get('sessionDetails')?.value?.startTimePicker.injuryHour +
          '::' +
          this.regularSessionForm.get('sessionDetails')?.value?.startTimePicker.injuryMinute;
        this.registerSessionDetails.startTime = startTimePickers;
        if (!this.isEditMode) {
          this.sessionService.registerAdhocSession(this.registerSessionDetails).subscribe(
            res => {
              this.alertService.clearAlerts();
              this.router.navigate([MBConstants.ROUTE_MEDICAL_BOARD_SESSION_DETAILS]);
              this.alertService.showSuccess(res.message, null, 10);
            },
            err => {
              this.alertService.clearAlerts();
              this.alertService.showError(err.error.message, err.error.details);
            }
          );
        } else {
          this.sessionService
            .updateAdhocMedicalBoardSession(this.registerSessionDetails, this.sessionId)
            .pipe(
              tap(res => {
                this.alertService.clearAlerts();
                this.router.navigate([MBConstants.ROUTE_MEDICAL_BOARD_SESSION_DETAILS]);
                this.alertService.showSuccess(res.message, null, 10);
              }),
              switchMap(() => {
                if (this.removeInvitee)
                  this.removeMedicalMember(
                    this.sessionId,
                    this.removeInvitee,
                    ConfigurationTypeEnum.REMOVE_ADHOC_PARTICIPANT
                  );
                return this.addBulkParticipantsMember(this.bulkParticipants, 'adhoc', '', true);
              }),
              catchError(err => {
                this.handleError(err);
                return throwError(err);
              })
            )
            .subscribe(noop, noop);
        }
      }
    } else {
      if (startHours !== null && endHours !== null && startMinutes !== null && endMinutes !== null && !isNoTimeError) {
        this.alertService.showError(MBConstants.TIME_ERR_MESSAGE);
      } else if (!this.isNoPastTimeError && !this.isEditMode) {
        this.alertService.showError(MBConstants.PAST_TIME_ERR_MESSAGE);
      } else {
        markFormGroupTouched(this.regularSessionForm);
        this.alertService.showMandatoryErrorMessage();
      }
    }
  }
  onAddContractedMembers(memberValues: ContractedMembers[]) {
    memberValues.forEach(member => {
      this.selectedMembers?.push(member);
    });
    this.selectedMembers = this.selectedMembers.filter(
      (value, index, self) => index === self.findIndex(t => t.nationalId === value.nationalId)
    );
    this.declineValue();
  }
  onAddDoctorMembers(doctorValues: ContractedMembers[]) {
    doctorValues.forEach(doctor => {
      this.selectedDoctors.push(doctor);
      this.selectedMembers.push(doctor);
    });
    doctorValues = doctorValues.filter(
      (value, index, self) => index === self.findIndex(t => t.nationalId === value.nationalId)
    );

    this.declineValue();
  }
  /**
   * Method to add participant
   * @param addParticipantsList
   */
  addParticipants(addParticipantsList: AddParticipantsList[]) {
    this.selectParticipants = [];
    addParticipantsList.forEach(val => {
      this.selectParticipants?.push(val);
    });
    this.configurationDetails?.participantList?.push.apply(
      this.configurationDetails?.participantList,
      this.selectParticipants
    );
    this.modalRef?.hide();
  }
  /**
   * Method to set index
   * @param i
   */
  setReplaceIndex(i: number) {
    this.replaceIndex = i;
  }
  getNewParticipantList() {
    this.bulkParticipants = [];
    this.configurationDetails?.participantList?.forEach(participant => {
      const bulkParticipant: BulkParticipants = {
        participantId: participant.participantId,
        assessmentType: participant.assessmentType,
        noOfDaysInQueue: participant.noOfDaysInQueue,
        mobileNumber: participant.mobileNumber,
        identityNumber: participant.identityNumber,
        location: participant.location
      };
      this.bulkParticipants.push.apply(bulkParticipant);
    });
  }
  removeParticipant() {
    this.removeInvitee = this.configurationDetails?.participantList[this.removeIndex].inviteeId;
    this.bulkParticipants.splice(this.removeIndex, 1);
    this.configurationDetails?.participantList.splice(this.removeIndex, 1);
    this.modalRef?.hide();
  }
  getUnAvailableList(requestData: UnAvailableMemberListRequest) {
    requestData.mbList = [];
    requestData.sessionId = this.sessionId;
    this.configurationDetails?.memberDetails?.forEach((item, i) => {
      requestData.mbList[i] = item?.professionalId;
    });
    this.statusService.getUnavailableMemberList(requestData).subscribe(
      res => {
        this.unAvailableMemberList = res;
        if (this.unAvailableMemberList.length > 0) {
          this.submitDisable = true;
        } else {
          this.submitDisable = false;
        }
      },
      err => this.showError(err)
    );
    // this.disableSubmit();
  }

  showError(err) {
    if (err && err.error) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  setRemoveIndex(i: number) {
    this.removeIndex = i;
    const name = this.configurationDetails?.participantList[i]?.name;
    if (name?.english === null || name?.english?.length === 0) name.english = name?.arabic;
    this.removeMessage = MBConstants.REMOVEMEMBER(name);
  }
  onRemoveIndex(index: number) {
    this.memberRemoveIndex = index;
    this.inviteId = this.selectedMembers?.[index]?.inviteeId;
    const memberName = this.selectedMembers?.[index]?.doctorName;
    if (memberName?.english === null || memberName?.english?.length === 0) memberName.english = memberName?.arabic;
    this.memberRemoveMessage = MBConstants.REMOVEMEMBER(memberName);
  }
  removeAddedMember() {
    this.selectedMembers.splice(this.memberRemoveIndex, 1);
    this.configurationDetails?.memberDetails?.splice(this.memberRemoveIndex, 1);
    this.sessionService.setSelectedMembers(this.selectedMembers);
    this.modalRef?.hide();
    this.disableSubmit();
  }
  navigateToProfile(identificationNo: number) {
    // this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(identificationNo)]);
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      url = '/establishment-private/#' + MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(identificationNo);
    } else {
      url = '/establishment-public/#' + MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(identificationNo);
    }
    window.open(url, '_blank');
    this.hideModal();
  }
  disableSubmit() {
    this.submitDisable = false;
    this.selectedMembers.forEach(member => {
      this.unAvailableMemberList.filter(unavilable => {
        if (member.nationalId === unavilable.identity) {
          this.submitDisable = true;
        }
      });
    });
  }
  navigateToParticipantProfile(identificationNo: number) {
    this.router.navigate([MbRouteConstants.ROUTE_PARTICIPANT_PROFILE(identificationNo)]);
    this.hideModal();
  }
  /**
   * Method to replace member
   * @param paricipant
   */
  replaceMember(replaceValues) {
    this.replaceInvitee = this.configurationDetails?.participantList[this.replaceIndex].inviteeId;
    this.configurationDetails?.participantList.splice(this.replaceIndex, 1, replaceValues.replacedMember);
    this.bulkParticipants.push(replaceValues?.replacedParticipants);
    this.modalRef?.hide();
  }
  /**
   *
   * This method is to calculate the difference between currentdate and session date.
   */
  /**
   *
   * This method is to perform cleanup activities when an instance of component is destroyed.
   */
  ngOnDestroy(): void {
    this.statusService.selectedMembers.next([]);
    if (this.selectedMembersSubscription !== undefined) this.selectedMembersSubscription.unsubscribe();
  }
}
