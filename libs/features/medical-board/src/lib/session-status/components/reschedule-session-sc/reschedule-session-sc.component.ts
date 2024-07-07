/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, TemplateRef, Inject, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  convertToYYYYMMDD,
  LookupService,
  markFormGroupTouched,
  startOfDay,
  LanguageToken,
  convertToStringDDMMYYYY,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MBConstants, MbRouteConstants, PersonTypeEnum } from '../../../shared';
import { CreateSessionBaseScComponent } from '../../../shared/components/base';
import {
  AddMemberFilterRequest,
  ContractedMembers,
  RescheduleSessionList,
  RescheduleSessionRequest,
  UnAvailableMemberListRequest
} from '../../../shared/models';
import { CreateSessionService, SessionConfigurationService, SessionStatusService } from '../../../shared/services';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { deepCopy } from '@gosi-ui/features/benefits/lib/shared';
import moment from 'moment';

@Component({
  selector: 'mb-reschedule-session-sc',
  templateUrl: './reschedule-session-sc.component.html',
  styleUrls: ['./reschedule-session-sc.component.scss']
})
export class RescheduleSessionScComponent extends CreateSessionBaseScComponent implements OnInit, OnDestroy {
  //Local Variables
  reScheduleForm: FormGroup = new FormGroup({});
  rescheduleRequest = new RescheduleSessionRequest();
  sessionid: number;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  lang: string;
  isPastTimeError = true;
  /**
   *
   * @param lookupService
   * @param modalService
   * @param statusService
   * @param alertService
   * @param router
   * @param activatedRoute
   * @param configurationService
   * @param sessionService
   * @param location
   */
  constructor(
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly statusService: SessionStatusService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    readonly configurationService: SessionConfigurationService,
    readonly sessionService: CreateSessionService,
    readonly workflowService: WorkflowService,
    readonly location: Location,
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

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.alertService.clearAllSuccessAlerts();
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
    this.activatedRoute.params.subscribe(res => {
      if (res) {
        this.sessionid = res.sessionId;
        this.sessionId = res.sessionId;
      }
      super.getSessionData(this.sessionid);
      super.getLovValues();
    });
  }
  navigateToProfile(identificationNo: number) {
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(identificationNo)]);
    this.hideModal();
  }
  onRescheduleSession() {
    markFormGroupTouched(this.reScheduleForm);
    this.alertService.clearAlerts();
    this.setTimeFromForm();
    const todayDate = convertToYYYYMMDD(new Date().toString());
    const sessionStartDate = convertToYYYYMMDD(this.reScheduleForm.get('session')?.get('startDate.gregorian')?.value.toString());
    this.isPastTimeError = true
    const currentHours = new Date().getHours();
    const currentMin = new Date().getMinutes().toString();
    const valid =
      Number(this.startHour) === Number(this.endHour)
        ? Number(this.startMinute) < Number(this.endMinute)
          ? true
          : false
        : Number(this.startHour) < Number(this.endHour)
          ? true
          : false;
    if (sessionStartDate && sessionStartDate === todayDate) {
      this.isPastTimeError =
        Number(this.startHour) === Number(currentHours)
          ? Number(currentMin) < Number(this.startMinute)
            ? true
            : false
          : Number(currentHours) < Number(this.startHour)
            ? true
            : false;
    }
    if (this.reScheduleForm?.valid && valid && this.isPastTimeError && (this.isPastTimeError || this.isEditMode)) {
      this.rescheduleRequest.sessionDate.gregorian = startOfDay(
        this.reScheduleForm?.get('session')?.get('startDate.gregorian')?.value
      );
      let startTime: string = this.startHour;
      startTime = startTime + '::' + this.startMinute;
      this.rescheduleRequest.startTime = startTime;
      let endTime: string = this.endHour;
      endTime = endTime + '::' + this.endMinute;
      this.rescheduleRequest.endTime = endTime;
      this.rescheduleRequest.addedListOfMembers = this.sessionData?.mbList;
      const tempArray = [];
      this.sessionData?.mbList?.forEach(item => {
        this.unAvailableMemberList?.forEach(data => {
          if (item?.mbProfessionId === data?.mbProfessionId) tempArray.push(data);
        });
      });
      this.unAvailableMemberList = tempArray;
      this.rescheduleRequest.unAvailableListOfMembers = this.unAvailableMemberList;
      this.statusService.rescheduleSesssion(this.rescheduleRequest, this.sessionid).subscribe(
        res => {
          this.location.back();
          this.alertService.showSuccess(res);
        },
        err => this.showError(err)
      );
    } else {
      if (
        !valid &&
        this.endHour != null &&
        this.endMinute != null &&
        this.startHour != null &&
        this.startMinute != null
      ) {
        this.alertService.showError(MBConstants.TIME_ERR_MESSAGE);
      }
      else if (!this.isPastTimeError && !this.isEditMode) {
        this.alertService.showError(MBConstants.PAST_TIME_ERR_MESSAGE);
      }
      else { this.alertService.showMandatoryErrorMessage(); }
    }
  }
  setTimeFromForm() {
    this.startHour = this.reScheduleForm?.get('session')?.get('startTimePicker.injuryHour')?.value;
    this.startMinute = this.reScheduleForm?.get('session')?.get('startTimePicker.injuryMinute')?.value;
    this.endHour = this.reScheduleForm?.get('session')?.get('endTime.injuryHour')?.value;
    this.endMinute = this.reScheduleForm?.get('session')?.get('endTime.injuryMinute')?.value;
  }

  showError(err) {
    if (err && err.error) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  onAddContractedMembers(memberValues: ContractedMembers[]) {
    this.sessionData.endTime = null;
    this.sessionData.startTime = null;
    memberValues?.forEach(members => {
      const memberData: RescheduleSessionList = {
        contractType: members.contractType,
        identity: members.nationalId,
        mbProfessionId: members.mbProfessionalId,
        mobileNo: members.mobileNumber,
        name: members.doctorName,
        specialty: members.speciality ? members.speciality[0] : null,
        subSpecialty: members.subSpeciality,
        inviteeId: null,
        isUnAvailable: false
      };
      this.sessionData?.mbList?.push(memberData);
    });
    this.sessionData = deepCopy(this.sessionData);
    this.sessionData.sessionDate.gregorian = startOfDay(this.reScheduleForm?.get('session')?.get('startDate.gregorian')?.value);
    this.sessionData.endTime = this.endHour + ':' + this.endMinute;
    this.sessionData.startTime = this.startHour + ':' + this.startMinute;
    this.sessionData.startTimeAmOrPm = this.getAMorPM(this.sessionData.startTime);
    this.sessionData.endTimeAmOrPm = this.getAMorPM(this.sessionData.endTime);
    this.sessionData.startTime = this.getTimeFromString(this.sessionData.startTime);
    this.sessionData.endTime = this.getTimeFromString(this.sessionData.endTime);
    if (this.sessionData && this.sessionData?.mbList)
      this.sessionData.mbList = this.sessionData?.mbList?.reduce((acc, val) => {
        if (!acc.find(id => id?.mbProfessionId === val?.mbProfessionId)) {
          acc.push(val);
        }

        return acc;
      }, []);
    this.modalRef?.hide();
    this.showErrors = false;
  }
  /**
   * Method to hide modal
   */
  declineValue() {
    this.modalRef?.hide();
  }
  onAddContractedDoctor(template: TemplateRef<HTMLElement>, isGosiDoctor: boolean) {
    this.setTimeFromForm();
    const sessionDate = convertToYYYYMMDD(this.reScheduleForm?.get('session')?.get('startDate.gregorian')?.value);
    const templateValue = { backdrop: true, ignoreBackdropClick: true, class: `modal-lg modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, templateValue);
    this.dateSession = sessionDate;
    this.sessionRequest.filterData = new AddMemberFilterRequest();
    this.sessionRequest.startTime = this.startHour + '::' + this.startMinute;
    this.sessionRequest.endTime = this.endHour + '::' + this.endMinute;
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
  goBackToHome() {
    this.modalRef.hide();
    this.location.back();
  }
  getUnAvailableList(requestData: UnAvailableMemberListRequest) {
    requestData.mbList = [];
    requestData.sessionId = this.sessionid;
    this.sessionData?.mbList?.forEach((item, i) => {
      requestData.mbList[i] = item?.mbProfessionId;
    });
    this.statusService.getUnavailableMemberList(requestData).subscribe(
      res => {
        this.unAvailableMemberList = res;
        if (this.unAvailableMemberList.length > 0) this.setUnAvailablemembers();
        else {
          this.setAvailableBoolean();
          this.setData();
        }
      },
      err => this.showError(err)
    );
  }
  setUnAvailablemembers() {
    this.unAvailableMemberList?.forEach(value => {
      this.sessionData?.mbList?.forEach(item => {
        if (value?.mbProfessionId === item?.mbProfessionId) {
          item.isUnAvailable = true;
          item.isDisabled = true;
        }
      });
    });
  }
  setAvailableBoolean() {
    this.sessionData?.mbList.forEach(element => {
      element.isUnAvailable = false;
    });
  }

  setData() {
    const noOfGosiDr = this.sessionData?.mbList.filter(val => val.contractType?.english === PersonTypeEnum.GosiDoctor)
      ?.length;
    const noOfConctractedDr = this.sessionData?.mbList.filter(
      val => val.contractType?.english === PersonTypeEnum.ContractedDoctor
    )?.length;
    if (!this.isAmb) {
      // For Primary Medical Board
      this.sessionData?.mbList.forEach(value => {
        if (value.contractType.english === PersonTypeEnum.Nurse) {
          value.canPmbRemove = true;
        } else if (this.sessionData.sessionType.english === 'Regular') {
          //For Regular Session
          if (value.contractType.english === PersonTypeEnum.ContractedDoctor) {
            if (noOfConctractedDr > 1) {
              value.canPmbRemove = true;
            } else value.canPmbRemove = false;
          } else if (value.contractType.english === PersonTypeEnum.GosiDoctor) {
            if (noOfGosiDr > 1) {
              value.canPmbRemove = true;
            } else value.canPmbRemove = false;
          }
        } else {
          // For AdHoc session
          if (value.contractType.english === PersonTypeEnum.ContractedDoctor) {
            if (noOfConctractedDr > 1 || noOfGosiDr > 1) {
              value.canPmbRemove = true;
            } else value.canPmbRemove = false;
          } else if (value.contractType.english === PersonTypeEnum.GosiDoctor) {
            if ((noOfGosiDr > 2 && noOfConctractedDr === 0) || (noOfGosiDr > 1 && noOfConctractedDr > 0)) {
              value.canPmbRemove = true;
            } else value.canPmbRemove = false;
          }
        }
      });
    } else {
      //Appeal Medical Board
      this.sessionData?.mbList.forEach(value => {
        if (value.contractType.english === PersonTypeEnum.ContractedDoctor) {
          if (noOfConctractedDr > 3) {
            //for Regular Session and Adhoc Session
            value.canAmbRemove = true;
          } else value.canAmbRemove = false;
        } else {
          value.canAmbRemove = true;
        }
      });
    }
  }
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
}
