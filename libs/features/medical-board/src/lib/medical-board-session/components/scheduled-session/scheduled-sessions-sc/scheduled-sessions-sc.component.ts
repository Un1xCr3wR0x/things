/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  BilingualText,
  convertToStringDDMMYYYY,
  convertToYYYYMMDD,
  LanguageToken,
  LookupService,
  MenuService
} from '@gosi-ui/core';
import {
  GeneralEnum,
  IndividualSessionEvents,
  MBConstants,
  SessionFilterRequest
} from '../../../../shared';
import moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ScheduledSessionsBaseScComponent } from '../../../../shared/components';
import { CreateSessionService, DisabilityAssessmentService, SessionCalendarService, SessionStatusService } from '../../../../shared/services';
import { ConfigurationFilterDcComponent } from '../../shared/configuration-filter-dc/configuration-filter-dc.component';
import { MbRouteConstants } from '../../../../shared';
@Component({
  selector: 'mb-scheduled-sessions-sc',
  templateUrl: './scheduled-sessions-sc.component.html',
  styleUrls: ['./scheduled-sessions-sc.component.scss']
})
export class ScheduledSessionsScComponent extends ScheduledSessionsBaseScComponent implements OnInit {
  @ViewChild('configurationFilter') configurationFilter: ConfigurationFilterDcComponent;
  /**
   *
   * @param sessionCalendarService
   * @param router
   * @param lookupService
   * @param alertService
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly sessionStatusService: SessionStatusService,
    readonly modalService: BsModalService,
    readonly sessionCalendarService: SessionCalendarService,
    readonly router: Router,
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly sessionService: CreateSessionService,
    readonly disabilityAssessmentService: DisabilityAssessmentService,
    readonly menuService: MenuService
  ) {
    super(
      alertService,
      sessionStatusService,
      modalService,
      router,
      lookupService,
      sessionCalendarService,
      sessionService,
      menuService
    );
  }
  today: BilingualText;
  lang = 'en';
  todayDate: string;
  /**
   * Method to initialise tasks
   */
  ngOnInit() {
    super.ngOnInit();
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.getOfficeLists();
    this.setLookUpLists();
    this.isFiltered = false;
    // this.currentValue = moment(new Date()).format('DD/MM/YYYY');
    //To get Current date 
    this.currentValue = new Date().toDateString();
    this.selectedDate = convertToYYYYMMDD(moment(new Date()).toDate().toString());
    this.selectedMonth = moment(new Date()).toDate().getMonth() + 1;
    this.selectedYear = moment(new Date()).toDate().getFullYear();
    super.getCurrentMonthDetails(this.selectedMonth, this.selectedYear, this.sessionRequest);
    const currentdate = convertToYYYYMMDD(moment(new Date()).toDate().toString());
    this.todayDate = new Date().toDateString();
    this.getIndividualSessionDetails(currentdate, this.sessionRequest);
  }
  setResetFilter() {
    this.configurationFilter.clearAllFilter();
  }
  /**
   * Method to get selected month session details
   */
  getSelectedSession(selectedValues) {
    this.selectedMonth = selectedValues.selectedMonth + 1;
    this.selectedYear = selectedValues.selectedYear;
    this.sessionRequest.filter = new SessionFilterRequest();
    this.isMonthchanged = true;
    const selectedDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    this.getCurrentValue(selectedDate);
    //defect - 535696
    if (this.isFiltered) {
      this.onFilter(this.filterRequest);
    } else {
      super.getCurrentMonthDetails(this.selectedMonth, this.selectedYear);
    }
  }
  /**
   * Methos to get selected date session events
   * @param date
   */
  getCurrentValue(date: Date) {
    this.currentValue = date.toDateString();
    // this.currentValue = moment(date).format('DD/MM/YYYY');
    this.selectedDate = convertToYYYYMMDD(moment(date).toDate().toString());
    this.isFiltered = this.sessionCalendarService.getIsFiltered();
    if (!this.isMonthchanged && this.isFiltered) {
      this.sessionRequest.filter = this.sessionCalendarService.getCalendarfilter();
      super.getIndividualSessionDetails(this.selectedDate, this.sessionRequest);
    } else super.getIndividualSessionDetails(this.selectedDate);
  }
  navigateToSessionStatus(session: IndividualSessionEvents) {
    if (session.status?.english !== GeneralEnum.CANCEL) {
      this.disabilityAssessmentService.sessionId = session.sessionId;
      if(session.status?.english === GeneralEnum.COMPLETED) {
        this.disabilityAssessmentService.isCompleted = true;
        this.router.navigate([MbRouteConstants.ROUTE_MEDICAL_SESSION]);
      } else {
        this.router.navigate([MBConstants.SESSION_STATUS], {
          queryParams: {
            sessionId: Number(session.sessionId),
            templateId: Number(session.templateId),
            sessionType: (session?.sessionType?.english).replace(/\s/g, '')
          }
        });  
      }
    }
  }
}
