import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { NgxSimpleCalendarComponent } from 'ngx-simple-calendar';

@Component({
  selector: 'dev-calendar-view-dc',
  templateUrl: './calendar-view-dc.component.html',
  styleUrls: ['./calendar-view-dc.component.scss']
})
export class CalendarViewDcComponent implements OnInit {
  isValid = false;
  sampleOne = [
    {
      startDateTime: new Date(2019, 8, 25),
      data: {
        name: 'Whole day event',
        description: 'This is a whole day event description',
        color: '#9b00ed'
      }
    },
    {
      startDateTime: new Date(2019, 8, 4, 2),
      endDateTime: new Date(2019, 8, 4, 15),
      data: {
        name: 'Lorem ipsum dolor sit amet.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, quas.',
        color: '#3365ed'
      }
    },
    {
      startDateTime: new Date(2019, 8, 5, 4),
      endDateTime: new Date(2019, 8, 9, 10),
      data: {
        name: 'Lorem ipsum dolor sit.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        color: '#eda70e'
      }
    },
    {
      startDateTime: new Date(2019, 8, 29, 4),
      endDateTime: new Date(2019, 9, 1, 8),
      data: {
        name: 'To Next month event',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
        color: '#3bed4c'
      }
    }
  ];
  sampleTwo = [
    {
      startDateTime: new Date(2019, 8, 6, 2),
      endDateTime: new Date(2019, 8, 6, 15),
      data: {
        name: 'To Next month event',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
        color: '#df785f'
      }
    },
    {
      startDateTime: new Date(2019, 8, 9, 4),
      endDateTime: new Date(2019, 8, 17, 10),
      data: {
        name: 'Lorem ipsum dolor sit amet.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, quas.',
        color: '#4493ed'
      }
    },
    {
      startDateTime: new Date(2019, 8, 11, 4),
      endDateTime: new Date(2019, 8, 14, 10),
      data: {
        name: 'Whole day event',
        description: 'This is a whole day event description',
        color: '#ed673a'
      }
    },
    {
      startDateTime: new Date(2019, 8, 13, 4),
      endDateTime: new Date(2019, 8, 14, 10),
      data: {
        name: 'Whole day event',
        description: 'This is a whole day event description',
        color: '#1be1ed'
      }
    },
    {
      startDateTime: new Date(2019, 8, 30, 4),
      endDateTime: new Date(2019, 9, 14, 10),
      data: {
        name: 'Whole day event',
        description: 'This is a whole day event description',
        color: '#3bed4c'
      }
    },
    {
      startDateTime: new Date(2019, 9, 20, 4),
      endDateTime: new Date(2019, 9, 21, 10),
      data: {
        name: 'Lorem ipsum dolor sit amet.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, quas.',
        color: '#df785f'
      }
    }
  ];

  options1 = {
    outline: false
  };
  events = [];
  toDate = new Date();
  selectedMonth: string;
  currentdate: string;
  actDate: string;
  @ViewChild('ngSimpleCalendar', { static: true })
  private ngSimpleCalendar: NgxSimpleCalendarComponent;

  constructor(private el: ElementRef) {
    this.el = el.nativeElement;
  }
  ngOnInit() {
    this.events = this.sampleOne;
    this.currentdate = moment(new Date()).format('DD/MM/YYYY');
  }
  getDate(event) {
    this.actDate = event.target.innerText;
    this.selectedMonth = this.ngSimpleCalendar.currentMonthYearText;
    this.ngSimpleCalendar.calendarData.forEach(date => {
      if (date.number.toString() === this.actDate && date.activeMonth === true) date.today = true;
      else date.today = false;
    });
    this.currentdate = moment(
      new Date(this.ngSimpleCalendar.currentYear, this.ngSimpleCalendar.currentMonth, Number(this.actDate)).toString()
    ).format('DD/MM/YYYY');
  }
  getEvent(event) {
    //console.log('getEvent', event.title);
  }

  addDate() {
    this.events = this.sampleTwo;
  }
}
