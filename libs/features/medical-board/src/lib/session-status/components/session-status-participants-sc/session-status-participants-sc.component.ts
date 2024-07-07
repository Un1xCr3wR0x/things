/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  BilingualText,
  convertToYYYYMMDD,
  LanguageToken,
  LookupService,
  MenuService,
  RoleIdEnum,
  startOfDay
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';
import {
  ConfigurationTypeEnum,
  CreateSessionService,
  MBConstants,
  MbRouteConstants,
  ParticipantsList,
  ScheduledSessionsBaseScComponent,
  SessionCalendarService,
  SessionStatusDetails,
  SessionStatusService
} from '../../../shared';

@Component({
  selector: 'mb-session-status-participants-sc',
  templateUrl: './session-status-participants-sc.component.html',
  styleUrls: ['./session-status-participants-sc.component.scss']
})
export class SessionStatusParticipantsScComponent
  extends ScheduledSessionsBaseScComponent
  implements OnInit, OnChanges
{
  lang = 'en';
  index = 0;
  canHide: boolean;
  dateSession: string;
  currentDate = startOfDay(new Date());
  // type = 'participant_status';
  modalRef: BsModalRef;
  participantname: BilingualText = new BilingualText();
  itemsPerPage = 10;
  paginationId = 'paginationId';
  totalRecords = 0;
  message: BilingualText;
  sessionId: number;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  currentPage = 1;
  rotatedeg = 360;
  allowedMedicalOfficerRole = [RoleIdEnum.BOARD_OFFICER, RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER];
  participantSelected;

  @Input() sessionStatusDetails: SessionStatusDetails = new SessionStatusDetails();
  @Input() isDisablePartcipants: boolean;
  @Input() mbManager = false;
  @Output() replace: EventEmitter<number> = new EventEmitter();
  @Output() onReplace: EventEmitter<null> = new EventEmitter();
  constructor(
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly alertService: AlertService,
    readonly sessionStatusService: SessionStatusService,
    readonly lookUpService: LookupService,
    readonly sessionCalendarService: SessionCalendarService,
    readonly sessionService: CreateSessionService,
    readonly activatedRoute: ActivatedRoute,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly menuService: MenuService
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
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.activatedRoute?.queryParams?.subscribe(res => {
      this.sessionId = Number(res.sessionId);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.isDisablePartcipants && changes.isDisablePartcipants?.currentValue) {
      this.isDisablePartcipants = changes.isDisablePartcipants?.currentValue;
    }
    if (changes && changes.sessionStatusDetails && changes.sessionStatusDetails?.currentValue) {
      this.sessionStatusDetails = changes.sessionStatusDetails?.currentValue;
      this.initializeTheViewDetails();
    }
  }
  /**
   * Method to get selected page
   * @param page
   */
  selectPage(page: number) {
    this.pageDetails.currentPage = this.currentPage = page;
  }
  isPhoneClicked(p: number) {
    if (this.sessionStatusDetails.participantList[p])
      this.sessionStatusDetails.participantList[p].isPhoneClicked = true;
  }
  navigateToProfile(identificationNo: number) {
    // this.router.navigate([MbRouteConstants.ROUTE_PARTICIPANT_PROFILE(identificationNo)]);
    this.router.navigate([`home/profile/individual/internal/${identificationNo}/personal-details`]);
  }
  // setValue(index) {
  //   this.index = index;
  //   const isVdRequired = this.sessionStatusDetails?.participantList[index]?.isVdRequired;
  //   const participantName = this.sessionStatusDetails?.participantList[index]?.name;
  //   if (participantName?.english === null || participantName?.english?.length === 0)
  //     participantName.english = participantName?.arabic;
  //   this.participantname = isVdRequired
  //     ? MBConstants.REMOVEPARTICIPANTVDREQUIRED()
  //     : MBConstants.REMOVEPARTICIPANT(participantName);
  // }
  setValue(participant) {
    this.participantSelected = participant;
    const isVdRequired = participant?.isVdRequired;
    const participantName = participant?.name;
    if (participantName?.english === null || participantName?.english?.length === 0)
      participantName.english = participantName?.arabic;
    this.participantname = isVdRequired
      ? MBConstants.REMOVEPARTICIPANTVDREQUIRED()
      : MBConstants.REMOVEPARTICIPANT(participantName);
  }
  replaceParticipants() {
    this.replace.emit(this.index);
    this.onReplace.emit();
  }
  /**
   * Method to hide the remove button if current date exceeds
   */

  initializeTheViewDetails() {
    const dateSession = convertToYYYYMMDD(this.sessionStatusDetails?.sessionDate?.gregorian.toString());
    const currentDate = convertToYYYYMMDD(new Date().toString());
    this.getTimeDateComparison(dateSession, currentDate);
  }

  /**Method to fetch isd code */
  getISDCodePrefix(participant: ParticipantsList) {
    let prefix = '';
    Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === participant.isdCode) {
        prefix = AppConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
  removeParticipant() {
    this.removeMedicalMember(
      this.sessionId,
      this.participantSelected?.inviteeId,
      ConfigurationTypeEnum.REMOVE_PARTICIPANT
    );
    this.modalRef?.hide();
    // setTimeout(() => {
    //   this.reload();
    // }, 1000);
  }
  // reload() {
  //   window.location.reload();
  // }
  getListNo(listSequenceNo) {
    const particListNo = this.currentPage > 1 ? (this.currentPage - 1) * 10 + (listSequenceNo + 1) : listSequenceNo + 1;
    return particListNo;
  }
}
