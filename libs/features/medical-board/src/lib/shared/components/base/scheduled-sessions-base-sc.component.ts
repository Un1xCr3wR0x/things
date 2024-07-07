/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, LookupService, LovList, MenuService } from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MedicalMembersBaseScComponent } from './medical-members-base-sc.component';
import { MBConstants } from '../../constants';
import {
  IndividualSessionEvents,
  SessionCalendar,
  SessionFilterRequest,
  SessionRequest,
  EventDetails
} from '../../models';
import { CreateSessionService, SessionCalendarService, SessionStatusService } from '../../services';
@Directive()
export class ScheduledSessionsBaseScComponent extends MedicalMembersBaseScComponent implements OnInit {
  /**
   * Local Variables
   * */
  currentValue: string;
  eventDetails: EventDetails[] = [];
  filterRequest: SessionFilterRequest;
  individualSessionEvents: IndividualSessionEvents[] = [];
  isFiltered = false;
  isMonthchanged = false;
  isNoSessions = true;
  isReset: boolean;
  outerArr: SessionCalendar = new SessionCalendar();
  participantsInQueue: number;
  selectedDate: string;
  selectedMonth: number;
  selectedYear: number;
  sessionCalendar: SessionCalendar = new SessionCalendar();
  sessionRequest: SessionRequest = new SessionRequest();
  totalSessions: number;


  //Observables
  channelList$: Observable<LovList>;
  medicalBoardTypeList$: Observable<LovList>;
  statusLists$: Observable<LovList>;
  holdReasonList$: Observable<LovList>;
  unholdReasonList$: Observable<LovList>;
  initiatorLocation;
  /**
   *
   * @param router
   * @param lookupService
   * @param alertService
   * @param sessionCalendarService
   */
  constructor(
    readonly alertService: AlertService,
    readonly sessionStatusService: SessionStatusService,
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly lookupService: LookupService,
    readonly sessionCalendarService: SessionCalendarService,
    readonly sessionService: CreateSessionService,
    readonly menuService: MenuService
  ) {
    super(alertService, sessionStatusService, modalService, lookupService, router, sessionService);
  }

  ngOnInit(): void {
    this.initiatorLocation = this.menuService.getLocation();
    this.sessionRequest = {...this.sessionRequest, filter: {...this.sessionRequest.filter, initiatorLocation: this.initiatorLocation}};
  }
  /**
   * Method to get current Month Details
   * @param currentMonth
   * @param currentYear
   */
  getCurrentMonthDetails(currentMonth: number, currentYear: number, sessionRequest?: SessionRequest) {
    this.sessionCalendarService.getSessionDetails(currentMonth, currentYear, sessionRequest).subscribe(
      res => {
        this.sessionCalendar = res;
        this.totalSessions = res.totalCount;
        this.participantsInQueue = res.participantsInQueue;
        this.eventDetails = new Array(this.sessionCalendar?.sessionDetails?.length);
      },
      err => {
        this.alertService.showError(err.error?.message);
      }
    );
  }

  /** Method to set all lov lists on component load */
  setLookUpLists() {
    this.medicalBoardTypeList$ = this.lookupService.getMedicalBoardTypeList();
    this.channelList$ = this.lookupService.getSessionChannel();
    this.statusLists$ =this.lookupService.getSessionStatus();
    this.holdReasonList$ = this.lookupService.getHoldReasonsList();
    this.unholdReasonList$ = this.lookupService.getUnHoldReasonsList();
    this.getLocationLists();
  }
  /**
   * Method to get Individual Session Details
   * @param selectedDate
   */
  getIndividualSessionDetails(selectedDate: string, sessionRequest?: SessionRequest) {
    this.sessionCalendarService.getDateSessionDetails(selectedDate, sessionRequest).subscribe(
      res => {
        this.individualSessionEvents = res;
        this.isNoSessions = false;
        if (this.individualSessionEvents?.length === 0) this.isNoSessions = true;
      },
      err => {
        this.isNoSessions = true;
        this.alertService.showError(err.error?.message);
      }
    );
    this.isMonthchanged = false;
  }
  /**
   * MEthod to filter the sessions
   * @param request
   */
  onFilter(request: SessionFilterRequest) {
    if (this.sessionRequest) {
      this.sessionRequest.filterData.touched = true
      this.isFiltered = true;
      this.filterRequest = request;
      this.sessionRequest.filter = request;
      this.sessionCalendarService.setCalendarfilter(this.sessionRequest.filter, this.isFiltered);
      this.getCurrentMonthDetails(this.selectedMonth, this.selectedYear, this.sessionRequest);
      this.getIndividualSessionDetails(this.selectedDate, this.sessionRequest);
    }
  }
  navigateToParticipant() {
    this.router.navigate([MBConstants.ROUTE_PARTICIPANTS_QUEUE],
      {state: {sessionRequest : this.sessionRequest}});
  }
}
