import { Directive, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  BaseComponent,
  BilingualText,
  convertToYYYYMMDD,
  GosiCalendar,
  LookupService,
  LovList,
  startOfDay
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { delay, map, tap, timestamp } from 'rxjs/operators';
import { MBConstants, MbRouteConstants, ConfigurationFilterConstants } from '../../constants';
import { ConfigurationTypeEnum, GeneralEnum, MemberMonths, PersonTypeEnum } from '../../enums';
import {
  AddMemberFilterRequest,
  AddMemberRequest,
  AddParticipantsList,
  BulkParticipants,
  ContractedMembers,
  IndividualSessionDetails,
  MBODetail,
  MBODetailList,
  MbDetails,
  ParticipantDetailsList,
  SessionDate,
  SessionLimitRequest,
  SessionRequest,
  SessionStatusDetails
} from '../../models';
import { CreateSessionService, SessionStatusService } from '../../services';
import { AddContractedMembersDcComponent } from '../add-contracted-members-dc/add-contracted-members-dc.component';
import { AddParticipantResponse } from '../../models/contracted-members copy';
import { HoldReason } from '../../models/hold-Reason';
import { getTime } from 'ngx-bootstrap/chronos/utils/date-getters';

@Directive()
export abstract class MedicalMembersBaseScComponent extends BaseComponent implements OnInit {
  currentDate = startOfDay(new Date());
  canHide = false;
  action: string;
  addMemberRequest: AddMemberRequest[] = [];
  assessmentTypeLists$: Observable<LovList>;
  canAmbRemove: boolean;
  canPmbRemove: boolean;
  configurationDetails: IndividualSessionDetails = new IndividualSessionDetails();
  contractedMembers: ContractedMembers[];
  dateSession: string;
  fieldOfficeList$: Observable<LovList>;
  region$: Observable<LovList>;
  isAmb: boolean;
  isAmpOffice = false;
  isCancel = false;
  isDisableMembers = false;
  isEditMode = false;
  isHold = false;
  isPrimaryMedicalBoard = true;
  showErrorMsg = false;
  isAdhocAmb = true;
  locationList$: Observable<LovList>;
  maximumParticipants: number;
  mbDetails: MbDetails = new MbDetails();
  medicalBoardTabs = [];
  modalRef: BsModalRef;
  searchedParticipant: AddParticipantsList = new AddParticipantsList();
  officeLocation: BilingualText;
  amOrPm: BilingualText;
  participantsDetails: AddParticipantsList[];
  regularSessionForm: FormGroup = new FormGroup({});
  removeInvitee: number;
  replaceInvitee: number;
  searchParams: string;
  sessionDateParticipant: GosiCalendar = new GosiCalendar();
  sessionDate: SessionDate = new SessionDate();
  sessionId: number;
  sessionType: string;
  isRegular: boolean;
  sessionMonth = '';
  sessionRequest: SessionRequest = new SessionRequest();
  sessionStatusDetails: SessionStatusDetails = new SessionStatusDetails();
  specialityList$: Observable<LovList>;
  templateId: number;
  totalNoOfParticipantRecords = 0;
  totalParticipants: number;
  totalResponse: number;
  startingHour: string;
  startingMinute: string;
  endingHour: string;
  endingMinute: string;
  startTime: string;
  endTime: string;
  @ViewChild('addMembersList', { static: false }) addMembersList: AddContractedMembersDcComponent;
  availableMsg: BilingualText;
  showErrors: boolean;
  availableParticipantMsg: BilingualText;
  showParticipantErrors: boolean;
  holdReason: HoldReason = new HoldReason();
  isInCharge: boolean;
  isSessionStarted: boolean;
  isNotOfficer: boolean;
  sessionPassedInRegular = false;
  mboDetail: MBODetail;
  mbOfficerList: MBODetailList;
  isAppealMBO = false;
  primaryMBOfficer = false;
  mbManager = false;
  invalidDateMsg = {
    arabic: "إدخال التاريخ إما فارغ أو غير صالح.",
    english: "The date entry is either empty or invalid."
}

  constructor(
    readonly alertService: AlertService,
    readonly sessionStatusService: SessionStatusService,
    readonly modalService: BsModalService,
    readonly lookupService: LookupService,
    readonly router: Router,
    readonly sessionService: CreateSessionService
  ) {
    super();
  }
  ngOnInit(): void {}
  setTimeForm() {
    this.startingHour = this.regularSessionForm?.get('sessionDetails')?.get('startTimePicker.injuryHour')?.value;
    this.startingMinute = this.regularSessionForm?.get('sessionDetails')?.get('startTimePicker.injuryMinute')?.value;
    this.endingHour = this.regularSessionForm?.get('sessionDetails')?.get('timePicker.injuryHour')?.value;
    this.endingMinute = this.regularSessionForm?.get('sessionDetails')?.get('timePicker.injuryMinute')?.value;
  }

  showContractedDrModal(template, isDoctor?: boolean) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-lg modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
    this.getLovValues();
    this.sessionRequest.startTime = this.startTime;
    this.sessionRequest.endTime = this.endTime;
    if (isDoctor) {
      this.sessionRequest.doctorType = 1002;
      this.getcontactedMembers(this.dateSession, this.sessionRequest);
    } else {
      this.sessionRequest.doctorType = 1001;
      if (this.isAmb) {
        this.sessionRequest.filterData = new AddMemberFilterRequest();
        this.getcontactedMembers(this.dateSession, this.sessionRequest);
      } else {
        this.sessionRequest.filterData = new AddMemberFilterRequest();
        this.sessionRequest.filterData.medicalBoardType = [
          { english: 'Primary Medical Board', arabic: 'اللجنة الطبية الابتدائية' }
        ];
        this.getcontactedMembers(this.dateSession, this.sessionRequest);
      }
    }
  }
  showContractedMemberModal(template, isGosiDoctor?: boolean) {
    this.setTimeForm();
    const configValue = { backdrop: true, ignoreBackdropClick: true, class: `modal-lg modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, configValue);
    if (this.isEditMode) {
      this.dateSession = convertToYYYYMMDD(moment(this.configurationDetails?.startDate?.gregorian).toDate().toString());
    } else
      this.dateSession = convertToYYYYMMDD(this.regularSessionForm.get('sessionDetails')?.value?.startDate?.gregorian);
    if (
      this.regularSessionForm?.get('sessionDetails')?.get('startTimePicker.injuryHour')?.value ||
      this.regularSessionForm?.get('sessionDetails')?.get('timePicker.injuryHour')?.value
    ) {
      this.sessionRequest.startTime = this.startingHour + '::' + this.startingMinute;
      this.sessionRequest.endTime = this.endingHour + '::' + this.endingMinute;
    }
    if (isGosiDoctor) {
      this.sessionRequest.doctorType = 1002;
      this.getcontactedMembers(this.dateSession, this.sessionRequest);
    } else {
      this.sessionRequest.doctorType = 1001;
      if (this.isAmb) {
        this.sessionRequest.filterData = new AddMemberFilterRequest();
        this.getcontactedMembers(this.dateSession, this.sessionRequest);
      } else {
        this.sessionRequest.filterData = new AddMemberFilterRequest();
        this.sessionRequest.filterData.medicalBoardType = [
          { english: 'Primary Medical Board', arabic: 'اللجنة الطبية الابتدائية' }
        ];
        this.getcontactedMembers(this.dateSession, this.sessionRequest);
      }
    }
  }
  //Method to get contracted members list
  getcontactedMembers(dateSession: string, sessionRequest?: SessionRequest) {
    this.sessionStatusService.getContractedMembers(dateSession, sessionRequest).subscribe(
      res => {
        this.contractedMembers = res.sessionMembers;
        this.totalResponse = res.totalCount;
      },
      err => {
        this.alertService.showError(err.error.message);
        this.contractedMembers = [];
        this.totalResponse = 0;
        this.modalRef?.hide();
      }
    );
  }
  onLimit(limit: SessionLimitRequest) {
    if (this.sessionRequest) {
      this.sessionRequest.limit = limit;
      this.getcontactedMembers(this.dateSession,this.sessionRequest);
    }
  }
  onSearchMember(searchKey: string) {
    if (this.sessionRequest) this.sessionRequest.searchKey = searchKey;
    this.resetFilter();
    this.onResetPagination();
    this.getcontactedMembers(this.dateSession, this.sessionRequest);
  }
  // Method to hide modal.
  hideModal(): void {
    this.sessionRequest = new SessionRequest();
    if (this.modalRef) this.modalRef.hide();
    this.showErrors = false;
  }
  addContractedMembers(addMemberRequest) {
    this.sessionStatusService.addContractedMemberSesssion(this.sessionId, addMemberRequest).subscribe(
      res => {
        this.getSessionstatusDetails(this.sessionId);
        this.alertService.showSuccess(res, null, 5);
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
    this.hideModal();
  }
  getSessionstatusDetails(sessionId: number) {
    this.sessionStatusService.getSessionStatusDetails(sessionId).subscribe(
      res => {
        this.sessionStatusDetails = res;
        this.sessionDateParticipant = this.sessionStatusDetails?.sessionDate;
        this.startTime = this.sessionStatusDetails?.startTime;
        this.endTime = this.sessionStatusDetails?.endTime;
        if (this.sessionStatusDetails?.mbList.length <= 0) {
          // Defect 539943 : need to show error msg when there are no members
          this.showErrorMsg = true;
        } else {
          // If members are added, we should be able to add participants
          this.showErrorMsg = false;
        }
        this.maximumParticipants = res.maximumBeneficiaries;
        this.totalNoOfParticipantRecords = res.totalNoOfParticipantRecords;
        if (this.sessionStatusDetails.medicalBoardType.english === GeneralEnum.AMB) this.isAmb = true;
        else this.isAmb = false;
        const noOfGosiDr = this.sessionStatusDetails?.mbList.filter(
          val => val.contractType?.english === PersonTypeEnum.GosiDoctor
        )?.length;
        const noOfConctractedDr = this.sessionStatusDetails?.mbList.filter(
          val => val.contractType?.english === PersonTypeEnum.ContractedDoctor
        )?.length;
        // isAmb -> minimum 3 C.Dr (for enabling 'remove member')
        // isPmb -> IsRegular(min 1 C.Dr & 1gosi Dr) , IsAdhoc(min (1 C.Dr & 1 gosi.Dr) OR (2 gosi Dr) )
        if (!this.isAmb) {
          // if PMB
          this.sessionStatusDetails?.mbList.forEach(value => {
            if (value.contractType.english === PersonTypeEnum.Nurse) {
              value.canPmbRemove = true;
            } else if (this.isRegular) {
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
              // if adhoc session
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
          // if AMB
          this.sessionStatusDetails?.mbList.forEach(value => {
            if (value.contractType.english === PersonTypeEnum.ContractedDoctor) {
              if (noOfConctractedDr > 3) {
                value.canAmbRemove = true;
              } else value.canAmbRemove = false;
            } else {
              // Nurse or Gosi Dr
              value.canAmbRemove = true;
            }
          });
        }
        this.dateSession = convertToYYYYMMDD(
          moment(startOfDay(this.sessionStatusDetails?.sessionDate?.gregorian)).toDate().toString()
        );
        if (this.sessionStatusDetails) {
          this.isSessionAlreadyStarted();
        }
        this.isHold = this.sessionStatusDetails.status.english === GeneralEnum.HOLD ? true : false;
        this.isCancel = this.sessionStatusDetails.status.english === GeneralEnum.CANCEL ? true : false;
        this.getAccountTabsetDetails(this.sessionStatusDetails);
        this.getSessionTime();
        this.getDateDetails();
        this.checkOfficerType();
        this.setHoldReason();
        if (
          this.sessionStatusDetails.sessionType.english ===
          (ConfigurationFilterConstants.FILTER_FOR_SESSION_TYPE[1]?.value?.english).replace(/\s/g, '')
        ) {
          this.isRegular = false;
        } else if (
          this.sessionStatusDetails.sessionType.english ===
          (ConfigurationFilterConstants.FILTER_FOR_SESSION_TYPE[0]?.value?.english).replace(/\s/g, '')
        ) {
          this.isRegular = true;
        }
        // if (!this.isRegular) {
        // For regular session also we have to disable actions btn if its passed session : Defect 518435
        this.initializeTheViewDetails();
        // } else {
        //   this.canHide = false;
        // }
      },
      err => {
        this.alertService.showError(err?.error?.message);
      }
    );
  }

  /**
   * Method to compare current date with session date for passed session
   */

  initializeTheViewDetails() {
    const dateSession = convertToYYYYMMDD(this.sessionStatusDetails?.sessionDate?.gregorian.toString());
    const currentDate = convertToYYYYMMDD(new Date().toString());
    this.getTimeDateComparison(dateSession, currentDate);
  }
  getTimeDateComparison(dateSession, todayDate) {
    if (dateSession < todayDate) {
      this.canHide = !this.isRegular ? true : false;
      this.sessionPassedInRegular = this.isRegular ? true : false;
    } else if (dateSession === todayDate) {
      const hours = new Date().getHours();
      let _min = new Date().getMinutes().toString();
      _min = _min.length === 1 ? '0' + _min.toString() : _min;
      //hours = ((hours + 11) % 12 + 1);
      const strTime = hours.toString() + ':' + _min;
      const endTime = this.sessionStatusDetails.endTime.split(' ');
      let endHourMin = endTime[0].split(':');
      let endHour = Number(endHourMin[0]);
      let endMin = 0;
      if (endHourMin.length === 3) {
        endMin = Number(endHourMin[2]);
      } else {
        endMin = Number(endHourMin[1]);
      }
      if (this.sessionStatusDetails.endTimeAmOrPm.english === 'PM' && endHour < 12) endHour = endHour + 12;
      if (this.sessionStatusDetails.endTimeAmOrPm.english === 'AM' && endHour === 12) endHour = endHour - 12;
      let sHours = endHour.toString();
      let sMinutes = endMin.toString();
      if (endHour < 10) sHours = '0' + sHours;
      if (endMin < 10) sMinutes = '0' + sMinutes;
      const sessionEndTime = sHours + ':' + sMinutes;
      dateSession = dateSession + ' ' + sessionEndTime;
      todayDate = todayDate + ' ' + strTime;
      if (new Date(Date.parse(todayDate)) > new Date(Date.parse(dateSession))) {
        this.canHide = !this.isRegular ? true : false;
        this.sessionPassedInRegular = this.isRegular ? true : false;
      }
    }
  }
  setHoldReason() {
    this.holdReason.reason = this.sessionStatusDetails.holdReason;
  }

  checkOfficerType() {
    this.isAmpOffice = this.sessionStatusDetails.fieldOfficeCode === 0 ? true : false;
    if (
      this.sessionStatusDetails.medicalBoardType.english === GeneralEnum.AMB &&
      this.isAmpOffice &&
      this.sessionStatusDetails.isAmbUser
    )
      this.isDisableMembers = false;
    else if (
      this.sessionStatusDetails.medicalBoardType.english === GeneralEnum.PMB &&
      !this.isAmpOffice &&
      !this.sessionStatusDetails.isAmbUser
    )
      this.isDisableMembers = false;
    else this.isDisableMembers = true;
  }

  getDateDetails() {
    const sessionDate = moment(startOfDay(this.sessionStatusDetails.sessionDate.gregorian)).toDate();
    this.sessionDate = this.formatSessionDates(sessionDate);
    this.sessionMonth = this.getMonthFromDate(sessionDate);
  }
  /**
   * Method to format date
   */
  formatSessionDates(date: Date): SessionDate {
    const formattedDate: SessionDate = new SessionDate();
    formattedDate.date = this.getDayFromDate(date);
    formattedDate.year = this.getYearFromDate(date);
    return formattedDate;
  }
  /**
   * Method to get year from a given date
   * @param date date
   */
  getYearFromDate(date: Date): string {
    return moment(date).toDate().getFullYear().toString();
  }
  /**
   * Method to get month form date
   * @param date
   */
  getMonthFromDate(date: Date): string {
    return Object.values(MemberMonths)[moment(date).toDate().getMonth()];
  }
  /**
   * Method to get day from a given date
   * @param date date
   */
  getDayFromDate(date: Date): string {
    return moment(date).toDate().getDate().toString();
  }
  /**
   * Method to get session time
   */
  getSessionTime() {
    if (this.sessionStatusDetails) {
      const dateArray = this.sessionStatusDetails?.startTime?.split('::');
      const endDateArray = this.sessionStatusDetails?.endTime?.split('::');
      if (dateArray) dateArray[1] = dateArray[1] !== undefined ? dateArray[1] : '00';
      if (endDateArray) endDateArray[1] = endDateArray[1] !== undefined ? endDateArray[1] : '00';
      if (dateArray && dateArray[0] && Number(dateArray[0]) >= 12) {
        if (Number(dateArray[0]) > 12) {
          this.sessionStatusDetails.startTime = Number(dateArray[0]) - 12 + ':' + dateArray[1] + ' ';
        }
        if (Number(dateArray[0]) === 12) {
          this.sessionStatusDetails.startTime = Number(dateArray[0]) + ':' + dateArray[1] + ' ';
        }
        this.sessionStatusDetails.startTimeAmOrPm = MBConstants.PM;
      } else {
        this.sessionStatusDetails.startTimeAmOrPm = MBConstants.AM;
        if (dateArray && dateArray[0] === '00') {
          this.sessionStatusDetails.startTime = '12:' + dateArray[1] + ' ';
        } else {
          this.sessionStatusDetails.startTime = dateArray[0] + ':' + dateArray[1] + ' ';
        }
      }
      if (endDateArray && endDateArray[0] && Number(endDateArray[0]) >= 12) {
        if (Number(endDateArray[0]) > 12) {
          this.sessionStatusDetails.endTime = Number(endDateArray[0]) - 12 + ':' + endDateArray[1] + ' ';
        }
        if (Number(endDateArray[0]) === 12) {
          this.sessionStatusDetails.endTime = Number(endDateArray[0]) + ':' + endDateArray[1] + ' ';
        }
        this.sessionStatusDetails.endTimeAmOrPm = MBConstants.PM;
      } else {
        this.sessionStatusDetails.endTimeAmOrPm = MBConstants.AM;
        if (endDateArray && endDateArray[0] === '00') {
          this.sessionStatusDetails.endTime = '12:' + endDateArray[1] + ' ';
        } else {
          this.sessionStatusDetails.endTime = endDateArray[0] + ':' + endDateArray[1] + ' ';
        }
      }
    }
  }
  /**
   * converting string time to AM/PM
   */
  getTimeFromString(time: string): string {
    let timeArray = [];
    if (time.includes(':')) timeArray = time?.split(':');
    if (time.includes('::')) timeArray = time?.split('::');
    if (timeArray) {
      timeArray[1] = timeArray[1] !== undefined ? timeArray[1] : '00';
    }
    if (timeArray && timeArray[0] && Number(timeArray[0]) > 12) {
      time = Number(timeArray[0]) - 12 + ':' + timeArray[1];
    } else {
      if (timeArray && Number(timeArray[0]) === 0) {
        time = 12 + ':' + timeArray[1];
      } else if (timeArray && timeArray[0] && Number(timeArray[0]) !== 0) {
        time = timeArray[0] + ':' + timeArray[1];
      }
    }
    return time;
  }

  getAMorPM(time: string): BilingualText {
    let timeArray = [];
    if (time.includes(':')) timeArray = time?.split(':');
    if (time.includes('::')) timeArray = time?.split('::');
    if (timeArray) {
      timeArray[1] = timeArray[1] !== undefined ? timeArray[1] : '00';
    }
    if (timeArray && timeArray[0] && Number(timeArray[0]) >= 12) {
      this.amOrPm = MBConstants.PM;
    } else {
      if (timeArray && Number(timeArray[0]) === 0) {
        this.amOrPm = MBConstants.AM;
      } else if (timeArray && timeArray[0] && Number(timeArray[0]) !== 0) {
        this.amOrPm = MBConstants.AM;
      }
    }
    return this.amOrPm;
  }

  /**
   * MEthod to get tabset details
   */
  getAccountTabsetDetails(sessionStatusDetails: SessionStatusDetails) {
    this.medicalBoardTabs = [];
    this.medicalBoardTabs.push({
      tabName: MBConstants.SESSION_MEMBERS,
      count: sessionStatusDetails?.noOfDoctorsAccepted,
      totalCount: sessionStatusDetails?.noOfDoctorsInvited
    });
    this.medicalBoardTabs.push({
      tabName: MBConstants.SESSION_PARTICIPANTS,
      count: sessionStatusDetails?.totalNoOfParticipantRecords,
      totalCount: sessionStatusDetails?.maximumBeneficiaries
    });
    // if (this.isRegular)
    if(this.mbManager || this.primaryMBOfficer || this.isAppealMBO) {
    this.medicalBoardTabs.push({
      tabName: MBConstants.MEDICAL_BOARD_OFFICER
    });
  }
  }
  onAddMembers(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-xl modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
    if (this.sessionId) {
      this.getPartcipants(this.sessionRequest, this.isPrimaryMedicalBoard);
    }
    //Defect 540033 - getParticipants API not required while add/remove members in create and modify adhoc session.
  }
  onAddParticipants(template: TemplateRef<HTMLElement>, action: string) {
    this.action = action;
    this.onAddMembers(template);
    this.getPartcipants(this.sessionRequest, this.isPrimaryMedicalBoard);
  }
  getPartcipants(sessionParticipantRequest?: SessionRequest, isPmb?: boolean) {
    this.sessionStatusService.getAddParticipants(sessionParticipantRequest, this.sessionId, isPmb).subscribe(
      res => {
        this.participantsDetails = res['participantsList'];
        if (res && res['participantsList'] && res['participantsList'][0])
          this.searchedParticipant = res['participantsList'][0];
        this.totalParticipants = res.count;
      },

      err => {
        this.alertService.showError(err.error?.message);
      }
    );
  }

  onSearchParticipants(searchKey: string,addedBy?:string) {
    if (this.sessionRequest) this.sessionRequest.searchKey = searchKey;
    if(addedBy ==='AddByBulk'){
      this.sessionRequest.filterData.speciality=[];
      this.sessionRequest.filterData.location =[];
    }
    this.onResetPagination();
    this.getPartcipants(this.sessionRequest, !this.isAmb);
  }
  getLovValues() {
    this.specialityList$ = this.lookupService.getSpecialityList();
    this.getOfficeLists();
    this.getAssessmentTypes();
    this.getLocationLists();
    this.region$ = this.lookupService.getRegionsList(); //TODO Use Camel Case
  }
  getAssessmentTypes() {
    this.assessmentTypeLists$ = this.lookupService.getAssessmentTypeList();
  }
  onFilterValue(value: AddMemberFilterRequest) {
    if (this.sessionRequest) this.sessionRequest.filterData = value;
    this.onResetPagination();
    this.getPartcipants(this.sessionRequest, !this.isAmb);
  }
  /**
   * Method to get the office list
   */
  getLocationLists() {
    this.locationList$ = this.lookupService.getFieldOfficeList().pipe(
      map((lists: LovList) => {
        if (lists) {
          lists.items.forEach(item => {
            item.value.arabic = item.value.arabic.trim();
            item.value.english = item.value.english.trim();
          });
          return lists;
        }
      })
    );
  }
  /**
   * Method to add bulk participants
   * @param bulkParticipants
   * @param value
   */

  addBulkParticipantsMember(
    bulkParticipants,
    value?: string,
    type?: string,
    isReplaced?: boolean
  ): Observable<AddParticipantResponse[]> {
    return this.sessionStatusService.addBulkParticipants(this.sessionId, bulkParticipants, isReplaced).pipe(
      tap(
        res => {
          this.getSessionstatusDetails(this.sessionId);
          if (value === 'adhoc') {
            if (this.replaceInvitee)
              this.removeMedicalMember(
                this.sessionId,
                this.replaceInvitee,
                ConfigurationTypeEnum.REPLACE_ADHOC_PARTICIPANT,
                true
              );
          }
          if (value === 'status' && type !== ConfigurationTypeEnum.REPLACE_STATUS_PARTICIPANT) {
            res.forEach(item => {
              if (item.type === 'Success') {
                this.alertService.showSuccess(item.message, null, 5);
              } else if (item.type === 'Warning') {
                this.alertService.showWarning(item.message, null);
              }
            });
          }
          this.cancelAddParticipants();
        },
        err => {
          this.alertService.showError(err.error.message);
          this.cancelAddParticipants();
        }
      )
    );
  }
  addBulkParticipantsMemberByMB(
    slotSequence: number,
    bulkParticipants,
    value?: string,
    type?: string,
    isReplaced?: boolean
  ): Observable<AddParticipantResponse[]> {
    return this.sessionStatusService
      .addBulkParticipantsbyMB(this.sessionId, slotSequence, bulkParticipants, isReplaced)
      .pipe(
        tap(
          res => {
            this.getSessionstatusDetails(this.sessionId);
            if (value === 'adhoc') {
              if (this.replaceInvitee)
                this.removeMedicalMember(
                  this.sessionId,
                  this.replaceInvitee,
                  ConfigurationTypeEnum.REPLACE_ADHOC_PARTICIPANT,
                  true
                );
            }
            if (value === 'status' && type !== ConfigurationTypeEnum.REPLACE_STATUS_PARTICIPANT) {
              res.forEach(item => {
                if (item.type === 'Success') {
                  this.alertService.showSuccess(item.message, null, 5);
                } else if (item.type === 'Warning') {
                  this.alertService.showWarning(item.message, null);
                }
              });
            }
            this.cancelAddParticipants();
          },
          err => {
            this.alertService.showError(err.error.message);
            this.cancelAddParticipants();
          }
        )
      );
  }
  cancelAddParticipants() {
    this.sessionRequest = new SessionRequest();
    this.modalRef?.hide();
  }
  isSessionAlreadyStarted() {
    this.isSessionStarted = false;
    const starttime = this.sessionStatusDetails?.startTime.split('::');
    starttime[1] = starttime[1] !== undefined ? starttime[1] : '00';
    const startTime = starttime[0] + ':' + starttime[1];
    let hours = new Date().getHours().toString();
    hours = hours.length === 1 ? '0' + hours.toString() : hours;
    let _min = new Date().getMinutes().toString();
    _min = _min.length === 1 ? '0' + _min.toString() : _min;
    const currentTime = hours + ':' + _min;
    if (moment(this.sessionStatusDetails?.sessionDate?.gregorian).isBefore(startOfDay(new Date()))) {
      this.isSessionStarted = true;
    } else if (
      moment(this.sessionStatusDetails?.sessionDate?.gregorian).isSame(startOfDay(new Date())) &&
      startTime < currentTime
    ) {
      this.isSessionStarted = true;
    }
  }
  navigateToProfile(identificationNo: number) {
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(identificationNo)]);
    this.hideModal();
  }
  onFilterApply(filterData: AddMemberFilterRequest) {
    if (this.sessionRequest) this.sessionRequest.filterData = filterData;
    this.onResetPagination();
    this.getcontactedMembers(this.dateSession, this.sessionRequest);
  }
  resetFilter() {}
  onResetPagination() {
    this.sessionRequest.limit = new SessionLimitRequest();
    if (this.addMembersList) this.addMembersList.resetPagination();
  }
  /**
   * Method to get Session mb Details
   */
  getMbDetails(): Observable<MbDetails> {
    return this.sessionService.getMbDetails().pipe(
      tap(res => {
        this.mbDetails = res;
        if (this.configurationDetails?.officeLocation?.english && this.mbDetails?.officeLocation?.english) {
          this.isInCharge =
            this.configurationDetails?.officeLocation?.english === this.mbDetails?.officeLocation?.english;
        }
        if (this.mbDetails?.medicalBoardType?.english === GeneralEnum.PMB) {
          this.isPrimaryMedicalBoard = true;
          this.isAdhocAmb = false;
        } else {
          this.isPrimaryMedicalBoard = false;
          this.isAdhocAmb = true;
        }
        if (this.mbDetails.medicalBoardType.english === GeneralEnum.AMB) this.isAmb = true;
        else this.isAmb = false;
        this.officeLocation = res?.officeLocation;
      }),
      delay(100),
      tap(() => {
        if (this.mbDetails.officeLocation.english && this.sessionStatusDetails.officeLocation.english) {
          this.isMbofficer();
        }
      })
    );
  }
  isMbofficer() {
    this.isNotOfficer = false;
    if (this.mbDetails.officeLocation.english !== this.sessionStatusDetails.officeLocation.english) {
      this.isNotOfficer = true;
    }
  }
  /**
   * Method to get the office list
   */
  getOfficeLists() {
    this.fieldOfficeList$ = this.lookupService.getMbLocations().pipe(
      map((lists: LovList) => {
        if (lists) {
          lists.items.forEach(values => {
            values.value.arabic = values.value.arabic.trim();
            values.value.english = values.value.english.trim();
          });
          return lists;
        }
      })
    );
  }
  removeMedicalMember(sessionid: number, inviteeId: number, type, isReplaced?: boolean) {
    this.sessionStatusService.removeMembers(sessionid, inviteeId, isReplaced).subscribe(
      res => {
        this.hideModal();
        if (type === ConfigurationTypeEnum.REMOVE_MEMBER) {
          this.alertService.showSuccessByKey('MEDICAL-BOARD.MEMBER-REMOVAL-MESSAGE', null, 5);
          this.getSessionstatusDetails(this.sessionId);
        } else {
          if (
            type === ConfigurationTypeEnum.REMOVE_PARTICIPANT ||
            type === ConfigurationTypeEnum.REPLACE_STATUS_PARTICIPANT
          )
            this.getSessionstatusDetails(this.sessionId);
          if (type === ConfigurationTypeEnum.REPLACE_STATUS_PARTICIPANT)
            this.alertService.showSuccessByKey('MEDICAL-BOARD.PARTICIPANT-REPLACE-MESSAGE', null, 5);
          else if (
            type !== ConfigurationTypeEnum.REPLACE_ADHOC_PARTICIPANT &&
            type !== ConfigurationTypeEnum.REMOVE_ADHOC_PARTICIPANT
          )
            this.alertService.showSuccess(res, null, 5);
        }
      },
      err => {
        this.hideModal();
        this.alertService.showError(err.error.message);
      }
    );
  }
  onSearchDoctors(searchKey: string) {
    if (this.sessionRequest) this.sessionRequest.searchKey = searchKey;
    this.resetFilter();
    this.onResetPagination();
    this.getcontactedMembers(this.dateSession, this.sessionRequest);
  }

  onCheckAvailability(request: AddMemberRequest) {
    request.sessionId = this.sessionId;
    this.sessionService.checkAvailability(request).subscribe(
      res => {
        this.availableMsg = res;
        this.showErrors = false;
      },
      err => {
        this.availableMsg = err?.error?.message;
        this.showErrors = true;
      }
    );
  }
  onCheckParticipantAvailbilty(request: BulkParticipants) {
    request.sessionId = this.sessionId;
    this.sessionService.checkParticipantAvailabilty(request).subscribe(
      res => {
        this.availableParticipantMsg = res;
        this.showParticipantErrors = false;
      },
      err => {
        this.availableParticipantMsg = err?.error?.message;
        this.showParticipantErrors = true;
      }
    );
  }
}
