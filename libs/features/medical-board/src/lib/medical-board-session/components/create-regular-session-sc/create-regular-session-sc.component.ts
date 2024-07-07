/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, BilingualText, LookupService, LovList, WorkflowService, markFormGroupTouched, startOfDay } from '@gosi-ui/core';
import moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SessionChannelEnum } from '../../../shared';
import { CreateSessionBaseScComponent } from '../../../shared/components';
import { MBConstants } from '../../../shared/constants';
import { RegisterMedicalSessionDetails, SessionDetails } from '../../../shared/models';
import { CreateSessionService, SessionConfigurationService, SessionStatusService } from '../../../shared/services';

@Component({
  selector: 'mb-create-regular-session-sc',
  templateUrl: './create-regular-session-sc.component.html',
  styleUrls: ['./create-regular-session-sc.component.scss']
})
export class CreateRegularSessionScComponent extends CreateSessionBaseScComponent implements OnInit {
  /**
   * Local Variables
   * */
  sessionList: LovList;
  sessionDifference: number;
  invitationDay: number;
  templateId: number;
  allocationPercentage: number;
  dayArray: BilingualText[];
  sessionDetails: SessionDetails;
  specialityValues = [];
  isRequired: boolean;
  registerSessionDetails: RegisterMedicalSessionDetails = new RegisterMedicalSessionDetails();
  /**
   *
   * @param lookupService
   * @param alertService
   * @param modalService
   * @param sessionService
   */
  constructor(
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly configurationService: SessionConfigurationService,
    readonly activatedRoute: ActivatedRoute,
    readonly sessionService: CreateSessionService,
    readonly workflowService: WorkflowService,
    readonly statusService: SessionStatusService
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
  /**
   * Method to intialise tasks
   */
  ngOnInit() {
    this.alertService.clearAlerts();
    super.getEditMode();
    this.getSpecialityList();
    this.getSessionFrequency();
    if (!this.isEditMode) super.getMbDetails().subscribe();
  }
  onChangeValue(channel: string) {
    if (channel !== SessionChannelEnum.VIRTUAL) this.isRequired = true;
    else this.isRequired = false;
  }
  onOfficeLocationChange(gosiOfficeLocation: BilingualText){
    this.officeLocation = gosiOfficeLocation;
  }
  
  /**
   * Method to create sessions
   */
  onCreateSession() {    
    markFormGroupTouched(this.regularSessionForm);
    const startHour = this.regularSessionForm.get('inviteForm').get('startTimePicker.injuryHour').value;
    const startMinute = this.regularSessionForm.get('inviteForm').get('startTimePicker.injuryMinute').value;
    const endHour = this.regularSessionForm.get('inviteForm').get('timePicker.injuryHour').value;
    const endMinute = this.regularSessionForm.get('inviteForm').get('timePicker.injuryMinute').value;
    const valid =
      Number(startHour) === Number(endHour)
        ? Number(startMinute) < Number(endMinute)
          ? true
          : false
        : Number(startHour) < Number(endHour)
        ? true
        : false;
    if (this.regularSessionForm?.valid && valid) {
      if (this.regularSessionForm.get('sessionDetails')) {
        this.registerSessionDetails.channel = this.regularSessionForm.get('sessionDetails')?.value?.sessionChannelList;
        this.dayArray = [];
        if (this.registerSessionDetails.channel.english !== SessionChannelEnum.VIRTUAL)
          this.registerSessionDetails.beneficiarySlotOpenDays = Number(
            this.regularSessionForm.get('sessionSlotForm')?.value?.noOfSessionPriorDays
          );
        else this.registerSessionDetails.beneficiarySlotOpenDays = 0;
        const dateValue = this.regularSessionForm.get('sessionDetails')?.value.day;
        if (dateValue)
          Object.entries(dateValue).forEach(key => {
            if (key[1] === true) {
              this.dayArray.push(MBConstants.DAYS_WEEK.find(val => val.value === key[0]).label);
            }
          });
        this.registerSessionDetails.days = this.dayArray;
        this.registerSessionDetails.doctorInviteCancelGraceDays = Number(
          this.regularSessionForm.get('invitationForm')?.value?.noOfCancellationDays
        );
        this.registerSessionDetails.endDate.gregorian = moment(new Date()).toDate();
        const endTimePicker =
          this.regularSessionForm.get('sessionDetails')?.value?.timePicker.injuryHour +
          '::' +
          this.regularSessionForm.get('sessionDetails')?.value?.timePicker.injuryMinute;
        this.registerSessionDetails.endTime = endTimePicker;
        this.registerSessionDetails.frequency = this.regularSessionForm.get('sessionDetails')?.value?.sessionFrequency;
        this.registerSessionDetails.isDoctorInviteCancelAllowed =
          this.regularSessionForm.get('invitationForm')?.value.doctorAcceptance.english === 'No' ? false : true;
        this.registerSessionDetails.maximumBeneficiaries = Number(
          this.regularSessionForm.get('sessionSlotForm')?.value?.noOfbeneficiaries
        );
        this.registerSessionDetails.medicalBoardType =
          this.regularSessionForm.get('sessionDetails')?.value?.medicalBoardList;
        this.registerSessionDetails.minimumBeneficiaries = Number(
          this.regularSessionForm.get('sessionSlotForm')?.value?.noOfSessionDays
        );
        this.registerSessionDetails.officeLocation =
          this.regularSessionForm.get('sessionDetails')?.value?.officeLocation;
        this.registerSessionDetails.sessionCreationGraceDays = Number(
          this.regularSessionForm.get('invitationForm')?.value?.noOfInvitationDays
        );
        if (this.isPrimaryMedicalBoard) {
          this.specialityValues = [];
          this.registerSessionDetails.sessionMemberDetails = [];
          this.specialityValues = this.regularSessionForm.get('primarymedicalForm')?.value;
        } else {
          this.specialityValues = [];
          this.registerSessionDetails.sessionMemberDetails = [];
          this.specialityValues = this.regularSessionForm.get('appealmedicalForm')?.value;
        }
        if (this.isEditMode) {
          if(this.sessionService.getNewDate()){
            this.registerSessionDetails.startDate.gregorian = this.sessionService.getNewDate();
          }else{
            this.registerSessionDetails.startDate = this.configurationDetails?.startDate;
          }
         
          this.specialityValues?.forEach((member, i) => {
            const memberDetail = {
              sessionSpecialityId: this.configurationDetails?.doctorDetails[i]?.sessionSpecialityId
                ? this.configurationDetails?.doctorDetails[i]?.sessionSpecialityId
                : null,
              memberType: { english: 'Contracted Doctor', arabic: '' },
              //Defect 542593 removed API speciality values of [0]
              // speciality: i === 0 ? this.configurationDetails?.doctorDetails[i].speciality : member.speciality,
              speciality: member.speciality,
              subSpeciality: member?.subspeciality,
              percent: member?.allocationPercentage.toString()
            };
            this.registerSessionDetails.sessionMemberDetails.push(memberDetail);
          });
        } else {
          const sessionDetails = this.regularSessionForm.get('sessionDetails')?.value;
          this.registerSessionDetails.startDate.gregorian = startOfDay(sessionDetails?.startDate.gregorian);
          this.specialityValues?.forEach(member => {
            const memberDetail = {
              memberType: { english: 'Contracted Doctor', arabic: '' },
              speciality: member.speciality,
              subSpeciality: member.subspeciality,
              percent: member?.allocationPercentage
            };
            this.registerSessionDetails.sessionMemberDetails.push(memberDetail);
          });
        }
        const startTimePicker =
          this.regularSessionForm.get('sessionDetails')?.value?.startTimePicker.injuryHour +
          '::' +
          this.regularSessionForm.get('sessionDetails')?.value?.startTimePicker.injuryMinute;
        this.registerSessionDetails.startTime = startTimePicker;
        if (!this.isEditMode) {
          this.sessionService.registerMedicalBoardSession(this.registerSessionDetails).subscribe(
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
          this.sessionService.updateRegularMedicalBoardSession(this.registerSessionDetails, this.templateId).subscribe(
            res => {
              this.alertService.clearAlerts();
              this.router.navigate([MBConstants.ROUTE_MEDICAL_BOARD_SESSION_DETAILS]);
              this.alertService.showSuccess(res, null, 5);
            },
            err => {
              this.alertService.showError(err.error.message, err.error.details);
            }
          );
        }
      }
    } else {
      if (startHour !== null && endHour !== null && startMinute !== null && endMinute !== null && !valid) {
        this.alertService.showError(MBConstants.TIME_ERR_MESSAGE);
      } else {
        markFormGroupTouched(this.regularSessionForm);
        this.alertService.showMandatoryErrorMessage();
      }
    }
  }
  /**
   * Method to get session difference
   * @param difference
   */
  getSessionDifference(difference) {
    this.sessionDifference = difference;
  }
  /**
   * Method to set Invitation Date
   * @param difference
   */
  setInvitationDate(invitationDay) {
    this.invitationDay = invitationDay;
  }
  getSpecialty() {
    this.getSpecialityList();
  }
}
