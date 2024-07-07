/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  Inject,
  Input,
  SimpleChanges,
  OnChanges,
  ViewChild,
  EventEmitter,
  Output
} from '@angular/core';
import { CalendarOptions, FullCalendarComponent, EventClickArg, Calendar } from '@fullcalendar/angular';
import moment from 'moment';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { GeneralEnum } from '../../../../shared/enums';
import { EventDetails, SessionCalendar } from '../../../../shared/models';

@Component({
  selector: 'mb-session-calendar-dc',
  templateUrl: './session-calendar-dc.component.html',
  styleUrls: ['./session-calendar-dc.component.scss']
})
export class SessionCalendarDcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  currentdate: Date;
  lang = 'en';
  calendarOptions: CalendarOptions;
  sessionDetails1 = [];
  sessionDetails2 = [];
  isSlotsAvailable = true;
  eventDetails: EventDetails[] = [];
  isReset = false;
  //View child components
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  //Input variables
  @Input() sessionCalendar: SessionCalendar = new SessionCalendar();
  //Output variables
  @Output() currentValue: EventEmitter<Date> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() selectedValues = new EventEmitter<{ selectedMonth: number; selectedYear: number }>();

  onDateClick(res) {
    this.currentdate = moment(res.dateStr).toDate();
    this.currentValue.emit(this.currentdate);
  }
  /**
   *
   * @param language
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
      this.getCalendarOptions();
    });
  }
  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.eventDetails) this.eventDetails = changes.eventDetails.currentValue;
    if (changes && changes.sessionCalendar) this.sessionCalendar = changes.sessionCalendar.currentValue;

    this.getEventDetails();
  }
  /**
   * Method to get calendar options
   */
  getCalendarOptions() {
    this.calendarOptions = {
      headerToolbar: {
        left: 'prev',
        center: 'title',
        right: 'next today'
      },
      initialView: 'dayGridMonth',
      eventColor: '#adadad',
      eventDisplay: 'block',
      eventTextColor: '#ffffff',
      dateClick: this.onDateClick.bind(this),
      events: this.eventDetails,
      locale: this.lang === GeneralEnum.ENGLISH ? 'en' : 'ar',
      selectable: true,
      editable: false,
      droppable: false,
      unselectAuto: false,
      customButtons: {
        prev: {
          text: 'prev',
          click: this.prevClick.bind(this)
        },
        next: {
          text: 'next',
          click: this.nextClick.bind(this)
        }
      }
    };
  }
  getEventDetails() {
    this.eventDetails = [];
    this.sessionCalendar?.sessionDetails?.forEach((session, index) => {
      const eventDetail: EventDetails = {
        backgroundColor: session.isSlotsAvailable ? '#59981A' : '#ff0000',
        borderColor: session.isSlotsAvailable ? '#59981A' : '#ff0000',
        start: session.dateString,
        title: session.count?.toString(),
        id: session?.sessionId?.toString()
      };
      this.eventDetails.push(eventDetail);
    });
    this.getCalendarOptions();
  }

  prevClick(event: EventClickArg) {
    const prevApi = this.calendarComponent.getApi();
    prevApi.prev();
    const prevMonth = prevApi.getDate().getMonth();
    const prevYear = prevApi.getDate().getFullYear();
    this.selectedValues.emit({
      selectedMonth: prevMonth,
      selectedYear: prevYear
    });
    // this.reset.emit();
  }

  nextClick(event: EventClickArg) {
    const nextApi = this.calendarComponent.getApi();
    nextApi.next();
    const nextMonth = nextApi.getDate().getMonth();
    const nextYear = nextApi.getDate().getFullYear();
    this.selectedValues.emit({
      selectedMonth: nextMonth,
      selectedYear: nextYear
    });
    //defect - 535696
    // this.reset.emit();
  }
}
