import { Component, OnInit, ViewChild } from '@angular/core';
import {
  CalendarOptions,
  FullCalendarComponent,
  DateSelectArg,
  EventClickArg,
  CalendarApi,
  EventMountArg
} from '@fullcalendar/angular';
import moment from 'moment';

@Component({
  selector: 'dev-full-calendar-dc',
  templateUrl: './full-calendar-dc.component.html',
  styleUrls: ['./full-calendar-dc.component.scss']
})
export class FullCalendarDcComponent implements OnInit {
  currentdate: string;
  isSlotsAvailable: boolean = false;
  calendarControlApi: CalendarApi;

  @ViewChild('calendar', { static: true }) calendarComponent: FullCalendarComponent;

  sampleOne = [
    {
      title: '5',
      date: '2021-11-01'
    },
    {
      title: '5',
      date: '2021-11-05'
    }
  ];

  sessionDetails = [
    {
      backgroundColor: this.isSlotsAvailable ? '#59981A' : '#ff0000',
      borderColor: this.isSlotsAvailable ? '#59981A' : '#ff0000',
      start: '2021-12-15',
      title: '12',
      id: '36'
    },
    {
      backgroundColor: this.isSlotsAvailable ? '#59981A' : '#ff0000',
      borderColor: this.isSlotsAvailable ? '#59981A' : '#ff0000',
      start: '2021-11-20',
      title: '10',
      id: '37'
    }
  ];

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
    initialView: 'dayGridMonth',
    eventDisplay: 'block',
    eventTextColor: '#ffffff',
    dateClick: this.onDateClick.bind(this),
    events: this.sessionDetails,
    selectable: true,
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

  onDateClick(res) {
    this.currentdate = moment(res.dateStr).format('DD/MM/YYYY');
  }

  prevClick(event: DateSelectArg) {
    const prevApi = this.calendarComponent.getApi();
    prevApi.prev();
    const prevMonth = prevApi.getDate().getMonth() + 1;
    const prevYear = prevApi.getDate().getFullYear();
  }

  nextClick(event: DateSelectArg) {
    const nextApi = this.calendarComponent.getApi();
    nextApi.next();
    const prevMonth = nextApi.getDate().getMonth() + 1;
    const prevYear = nextApi.getDate().getFullYear();
  }

  constructor() {}

  ngOnInit(): void {
    this.isSlotsAvailable = true;
  }
}
