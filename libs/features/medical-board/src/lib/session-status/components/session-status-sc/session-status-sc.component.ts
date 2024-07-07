/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  BilingualText,
  convertToYYYYMMDD,
  LookupService,
  LovList,
  statusBadgeType,
  RoleIdEnum,
  startOfDay,
  LanguageToken,
  LovStatus,
  MenuService,
  AuthTokenService
} from '@gosi-ui/core';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigurationTypeEnum } from '../../../shared/enums';
import { ScheduledSessionsBaseScComponent } from '../../../shared/components';
import { ConfigurationFilterConstants, MBConstants, MbRouteConstants } from '../../../shared/constants';
import {
  AddParticipantsList,
  BulkParticipants,
  SessionRequest,
  SessionRequestActions,
  AddMemberFilterRequest,
  SessionDate,
  ChangeMemberDto
} from '../../../shared/models';
import {
  CreateSessionService,
  MedicalBoardService,
  SessionCalendarService,
  SessionStatusService
} from '../../../shared/services';
import { HoldReason } from '../../../shared/models/hold-Reason';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'mb-session-status-sc',
  templateUrl: './session-status-sc.component.html',
  styleUrls: ['./session-status-sc.component.scss']
})
export class SessionStatusScComponent extends ScheduledSessionsBaseScComponent implements OnInit, OnDestroy {
  /**
   * Local Variables
   */
  allowedMedicalOfficerRole = [RoleIdEnum.BOARD_OFFICER, RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER];
  medicalTab = MBConstants.SESSION_MEMBERS;
  modalRef: BsModalRef;
  participantsDetails: AddParticipantsList[];
  reasonForCancellationList$: Observable<LovList>;
  reasonForCancellationList: LovList[];
  replaceIndex: number;
  sessionStatusForm: FormGroup = new FormGroup({});
  totalParticipants: number;
  value = 'status';
  lang = 'en';
  sessionParticipantList: LovList;
  setList: boolean;
  addbulkParticipants: BulkParticipants[] = [];
  selectValue: string;
  mbOfficer = 'name of officer ';
  assessmentSlotSequence: number;
  assessmentSession: number;
  sessionnumber: number;
  isSessionstatus: boolean;
  searchedParticipant: AddParticipantsList;
  gosiscp;


  //viewChild components
  @ViewChild('cancelSessionModal') cancelSessionModal: TemplateRef<HTMLElement>;
  @ViewChild('addByNinModal') addByNinModal: TemplateRef<HTMLElement>;
  /**
   *
   * @param lookupService
   * @param router
   * @param sessionStatusService
   * @param sessionCalendarService
   * @param alertService
   * @param activatedRoute
   * @param modalService
   * @param lookUpService
   * @param sessionService
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly lookupService: LookupService,
    readonly router: Router,
    readonly sessionStatusService: SessionStatusService,
    readonly sessionCalendarService: SessionCalendarService,
    readonly alertService: AlertService,
    readonly activatedRoute: ActivatedRoute,
    readonly modalService: BsModalService,
    readonly lookUpService: LookupService,
    readonly sessionService: CreateSessionService,
    readonly medicalBoardService: MedicalBoardService,
    private route: ActivatedRoute,
    readonly menuService: MenuService,
    readonly authTokenService: AuthTokenService
  ) {
    super(
      alertService,
      sessionStatusService,
      modalService,
      router,
      lookUpService,
      sessionCalendarService,
      sessionService,
      menuService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    const fullurl = this.router.url;
    this.gosiscp = this.authTokenService.getEntitlements();
    this.gosiscp[0].role.forEach(val => {
      if (RoleIdEnum.BOARD_OFFICER.toString() === val.toString()) {
        this.primaryMBOfficer = true;
      }
      if (RoleIdEnum.MEDICAL_SERVICES_DEPARTMENT_MANAGER.toString() === val.toString()) {
        this.mbManager = true;
      }
      if(RoleIdEnum. APPEAL_MEDICAL_BOARD_OFFICER.toString() === val?.toString()){
        this.isAppealMBO = true;
      }
    });
    this.isSessionstatus = fullurl.includes('medical-board-session-status');
    this.setLookUpLists();
    this.activatedRoute?.queryParams?.subscribe(res => {
      if (res) {
        this.sessionId = Number(res.sessionId);
        this.templateId = Number(res.templateId);
        this.sessionType = res.sessionType;
        this.sessionService.setTemplateId(this.templateId);
        if (
          this.sessionType ===
          (ConfigurationFilterConstants.FILTER_FOR_SESSION_TYPE[1]?.value?.english).replace(/\s/g, '')
        ) {
          this.isRegular = false;
        } else if (
          this.sessionType ===
          (ConfigurationFilterConstants.FILTER_FOR_SESSION_TYPE[0]?.value?.english).replace(/\s/g, '')
        ) {
          this.isRegular = true;
        }
        this.getSessionstatusDetails(this.sessionId);
      }
    });
    this.getMbDetails().subscribe();
  }

  /**
   *
   * @param status method to set status
   */
  statusBadgeTypes(status: string) {
    return statusBadgeType(status);
  }

  /**
   * Method to get session status details
   */
  navigateToSession() {
    if (
      this.sessionStatusDetails?.sessionType?.english ===
      ConfigurationFilterConstants.FILTER_FOR_SESSION_TYPE[0]?.value?.english
    ) {
      this.router.navigate([MbRouteConstants.ROUTE_SESSION_CONFIGURATION_DETAILS], {
        queryParams: {
          templateId: this.templateId,
          sessionType: (this.sessionStatusDetails?.sessionType?.english).replace(/\s/g, '')
        }
      });
    } else {
      this.router.navigate([MbRouteConstants.ROUTE_SESSION_CONFIGURATION_DETAILS], {
        queryParams: {
          sessionId: this.sessionId,
          sessionType: (this.sessionStatusDetails?.sessionType?.english).replace(/\s/g, '')
        }
      });
    }
  }

  navigateToReschedule() {
    this.router.navigate([`/home/medical-board/medical-board-session-status/${this.sessionId}/reschedule-session`]);
  }
  navigateToParticipantProfile(identificationNo: number) {
    this.router.navigate([MbRouteConstants.ROUTE_PARTICIPANT_PROFILE(identificationNo)]);
    this.hideModal();
  }
  onMedicalBoardToNewTab(accountTab: string) {
    this.medicalTab = accountTab;
    if (this.medicalTab === 'MEDICAL-BOARD.MEDICAL-BOARD-OFFICER') {
      this.getMbOfficerDetails();
    }
  }
  /**
   * Method to add participants
   * @param TemplateValue
   * @param action
   */

  navigateToBulkAddition(TemplateValue: TemplateRef<HTMLElement>, action: string) {
    this.action = action;
    this.getLovValues();
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-lg modal-dialog-centered` };
    this.modalRef = this.modalService.show(TemplateValue, config);
    this.getParticipants(this.sessionRequest, this.isPrimaryMedicalBoard);
  }
  /**
   * Method to replace participants
   * @param paricipant
   */
  replaceParticipant(participant: BulkParticipants[]) {
    this.removeMedicalMember(
      this.sessionId,
      this.sessionStatusDetails?.participantList[this.replaceIndex]?.inviteeId,
      ConfigurationTypeEnum.REPLACE_STATUS_PARTICIPANT,
      true
    );
    this.addBulkParticipantsMember(
      participant,
      this.value,
      ConfigurationTypeEnum.REPLACE_STATUS_PARTICIPANT,
      true
    ).subscribe();
    this.modalRef?.hide();
  }
  /**
   * Method to open hold session modal
   */
  cancelSession(template) {
    const size = 'md';
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
    this.getCancellationReasonList();
  }
  onCancelSession(request: SessionRequestActions) {
    this.alertService.clearAlerts();
    if (this.sessionStatusForm?.get('cancelSessionForm')?.valid) {
      this.sessionStatusService.cancelSesssion(this.sessionId, request).subscribe(
        (response: BilingualText) => {
          this.router.navigate([MBConstants.ROUTE_MEDICAL_BOARD_SESSION_DETAILS]);
          this.hideModal();
          this.getSessionstatusDetails(this.sessionId);
          this.alertService.clearAlerts();
          this.alertService.showSuccess(response, null, 5);
        },
        err => {
          this.hideModal();
          this.alertService.showError(err.error?.message);
        }
      );
    }
  }
  getCancellationReasonList() {
    this.reasonForCancellationList$ = this.lookUpService.getCancelReasonList();
  }
  addByNinModalPopup() {
    // this.getNinParticipants(this.sessionRequest, this.sessionId, this.isPrimaryMedicalBoard);
    this.searchedParticipant = new AddParticipantsList();
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-lg modal-dialog-centered` };
    this.modalRef = this.modalService.show(this.addByNinModal, config);
  }

  /** Api to fetch all participants while clicking  */

  getNinParticipants(sessionParticipantRequest: SessionRequest, sessionId: number, isPmb?: boolean) {
    this.sessionStatusService.getAddParticipants(sessionParticipantRequest, this.sessionId, isPmb).subscribe(
      res => {
        this.participantsDetails = res.participantsList;
        this.totalParticipants = res.count;
      },
      err => {
        this.alertService.showError(err.error?.message);
      }
    );
  }

  hideCancelModal() {
    this.sessionStatusForm?.get('cancelSessionForm')?.get('comments')?.reset();
    this.sessionStatusForm?.get('cancelSessionForm')?.get('reason')?.reset();
    if (this.modalRef) this.modalRef.hide();
  }
  /**
   * Method to set index
   * @param i
   */
  setReplaceIndex(i: number) {
    this.replaceIndex = i;
  }
  confirmHold(request: SessionRequestActions) {
    this.holdReason = new HoldReason();
    this.holdReason.reason = request.reason;
    this.sessionStatusService.holdMedicalBoardSession(this.sessionId, request).subscribe(
      (response: BilingualText) => {
        this.hideModal();
        this.getSessionstatusDetails(this.sessionId);
        this.alertService.showSuccess(response, null, 5);
      },
      err => {
        this.hideModal();
        this.alertService.showError(err.error?.message);
      }
    );
  }
  confirmUnHold(request: SessionRequestActions) {
    this.sessionStatusService.unholdMedicalBoardSession(this.sessionId, request).subscribe(
      (response: BilingualText) => {
        this.hideModal();
        this.getSessionstatusDetails(this.sessionId);
        this.alertService.showSuccess(response, null, 5);
      },
      err => {
        this.hideModal();
        this.alertService.showError(err.error?.message);
      }
    );
  }
  showHoldModal(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  cancelHold() {
    this.modalRef.hide();
  }
  cancelUnHold() {
    this.modalRef.hide();
  }
  showAddParticipantBYNIN(eventDataNIN): void {
    this.hideModal();
    const temp = eventDataNIN.temp;
    // const selectedAddparticipant = this.searchedParticipant;
    const selectedAddparticipant = eventDataNIN.selectedAddparticipantbyNIN;
    const type = eventDataNIN.typeNIn;
    this.searchedParticipant = selectedAddparticipant;
    this.alertService.clearAlerts();
    this.modalRef = this.modalService.show(temp, selectedAddparticipant);
    this.selectValue = moment(this.sessionDateParticipant?.gregorian)?.format('YYYY-MM-DD');
    this.getParticipantSessionDetails(this.selectValue);
  }
  showAddParticipant(eventData): void {
    this.hideModal();
    const temp = eventData.temp;
    const selectedAddparticipant = eventData.selectedAddparticipant;
    this.addbulkParticipants = selectedAddparticipant;
    this.alertService.clearAlerts();
    this.modalRef = this.modalService.show(temp, selectedAddparticipant);
    this.selectValue = moment(this.sessionDateParticipant?.gregorian)?.format('YYYY-MM-DD');
    this.getParticipantSessionDetails(this.selectValue);
  }
  addParticipants(participant: BulkParticipants[]) {
    this.addBulkParticipantsMember(participant, this.value).subscribe();
    this.alertService.showSuccessByKey('MEDICAL-BOARD.ADD_PARTICIPANT_SUCCESSFULLY', null, 5);
    this.hideModal();
  }
  addParticipantsbyMB(participant: BulkParticipants[]) {
    this.addBulkParticipantsMemberByMB(this.assessmentSlotSequence, participant, this.value).subscribe();
    this.alertService.showSuccessByKey('MEDICAL-BOARD.ADD_PARTICIPANT_SUCCESSFULLY', null, 5);
    this.hideModal();
  }
  navigateToAddMembers() {
    this.router.navigate([`/home/medical-board/medical-board-session-status/add-members`], {
      queryParams: {
        sessionDate: convertToYYYYMMDD(moment(this.sessionStatusDetails?.sessionDate?.gregorian).toDate().toString())
      }
    });
  }
  navigateToAddDoctors() {
    this.router.navigate([`/home/medical-board/medical-board-session-status/add-doctors`]);
  }

  getParticipants(sessionParticipantRequest?: SessionRequest, isPmb?: boolean) {
    if (!this.sessionRequest.filterData.touched) {
      this.sessionRequest.filterData = new AddMemberFilterRequest();
      this.sessionStatusDetails.mbList.forEach(item => {
        if (item.specialty) {
          this.sessionRequest.filterData.speciality.push(item.specialty);
        }
      });
      this.sessionStatusDetails.mbList.forEach(item => item.specialty);
      if (this.sessionStatusDetails.officeLocation) {
        this.sessionRequest.filterData.location.push(this.sessionStatusDetails.officeLocation);
      }
    }
    this.sessionStatusService.getAddParticipants(sessionParticipantRequest, this.sessionId, isPmb).subscribe(
      details => {
        this.participantsDetails = details.participantsList;
        this.totalParticipants = details.count;
      },

      err => {
        this.alertService.showError(err.error?.message);
      }
    );
  }
  getselectPageNo(selectedpageNo) {
    this.sessionRequest.limit.pageNo = selectedpageNo?.pageNo;
    this.getNinParticipants(this.sessionRequest, this.sessionId, this.isPrimaryMedicalBoard);
  }
  ngOnDestroy() {
    // this.alertService.clearAllErrorAlerts();
    // this.alertService.clearAlerts();
  }
  getParticipantSessionDetails(selectedDate: string, sessionRequest?: SessionRequest) {
    this.sessionCalendarService.getRescheduleDateSessionDetails(selectedDate, sessionRequest).subscribe(
      res => {
        this.individualSessionEvents = res;
        this.sessionParticipantList = new LovList([]);
        const sessionTimeList = new LovList([]);
        const lovarr: LovStatus[] = [];
        this.individualSessionEvents.forEach((item, index) => {
          this.setList = true;
          item.sessionSlotDetails.forEach((resValue, j) => {
            const arabicchannel = item.channel.arabic;
            const englishchannel = item.channel.english;
            if (resValue.isSlotsFilled || !resValue.isSlotsFilled) {
              const sessionTime = resValue.slotTime.english;
              const arTime = sessionTime.split('-');
              if (arTime[0].indexOf('AM') >= 0) {
                {
                  arTime[0] = arTime[0].replace('AM', '');
                  arTime[0] = arTime[0] + 'ص';
                }
              } else if (arTime[0].indexOf('PM') >= 0) {
                {
                  arTime[0] = arTime[0].replace('PM', '');
                  arTime[0] = arTime[0] + 'م';
                }
              }
              if (arTime[1].indexOf('AM') >= 1) {
                {
                  arTime[1] = arTime[1].replace('AM', '');
                  arTime[1] = arTime[1] + 'ص';
                }
              } else if (arTime[1].indexOf('PM') >= 1) {
                {
                  arTime[1] = arTime[1].replace('PM', '');
                  arTime[1] = arTime[1] + 'م';
                }
              }
              const arabicTime = arTime[0] + '-' + arTime[1];
              // this.sessionTimeList.push(sessionTime);
              lovarr.forEach(itemValue => {
                if (sessionTime === itemValue.value.english) {
                  this.setList = false;
                }
              });
              if (this.setList) {
                {
                  lovarr.push({
                    sequence: resValue.slotSequence,
                    value: { english: sessionTime, arabic: arabicTime },
                    code: item.sessionId,
                    status: item?.status,
                    channel: { english: arabicchannel, arabic: englishchannel }
                  });
                }
              }
              sessionTimeList.items = lovarr;
            }
          });
        });
        this.sessionParticipantList = sessionTimeList;
      },
      err => {
        // this.isNoSessions = true;
        this.alertService.showError(err.error?.message);
      }
    );
  }
  BindParticipantTime(value: LovStatus) {
    this.assessmentSlotSequence = value.sequence;
    this.assessmentSession = value.code;
    this.sessionnumber = value.code;
  }
  changeOfficerTemplate(TemplateValue: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-lg modal-dialog-centered` };
    this.modalRef = this.modalService.show(TemplateValue, config);
    this.getMbOfficerList();
  }
  getMbOfficerDetails() {
    this.sessionService.getMBODetails(this.sessionId).subscribe(
      res => {
        this.mboDetail = res;
      },
      err => this.alertService.showError(err?.error?.message)
    );
  }
  getMbOfficerList(searchValue?, filterValue?) {
    this.sessionService
      .getMBOList(
        this.sessionId,
        this.initiatorLocation,
        searchValue,
        filterValue
      )
      .subscribe(
        res => {
          this.mbOfficerList = res;
        },
        err => {
          this.alertService.showError(err?.error?.message);
        }
      );
  }
  selectedMBOPageChange(selectedpageNo) {
    this.sessionRequest.limit.pageNo = selectedpageNo?.pageNo;
  }
  cancelModal() {
    this.modalRef?.hide();
  }
  selectedMBO(selectedData) {
    this.sessionService.updateChangeMBODetail(this.sessionId, selectedData?.userId).subscribe(
      res => {
        this.alertService.showSuccess(res);
        if (this.modalRef) this.modalRef?.hide();
        this.getMbOfficerDetails();
      },
      err => {
        this.alertService.showError(err?.error?.message);
        if (this.modalRef) this.modalRef?.hide();
      }
    );
  }
  navigateMboProfile(nationalId) {
    this.router.navigate([]);
  }
  searchAreaInput(searchValue) {
    this.getMbOfficerList(searchValue);
  }
  applyFilter(filteredData: ChangeMemberDto) {
    this.getMbOfficerList(null, filteredData);
  }
}
