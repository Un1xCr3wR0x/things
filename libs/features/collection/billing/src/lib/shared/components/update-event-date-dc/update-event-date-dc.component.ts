import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output, OnChanges, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import moment from 'moment';
import { endOfMonth, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { EventDate, PenaltyWaiverSegmentRequest } from '../../models';

@Component({
  selector: 'blg-update-event-date-dc',
  templateUrl: './update-event-date-dc.component.html',
  styleUrls: ['./update-event-date-dc.component.scss']
})
export class UpdateEventDateDcComponent implements OnInit, OnChanges {
  eventDateForm: FormGroup;
  lang = 'en';
  newEventDateList = [];
  actualEventDateList = [];
  @Input() eventDateList: EventDate;
  @Input() parentForm: FormGroup;
  @Input() dataOnEditMode: PenaltyWaiverSegmentRequest; // data submited while creating transaction
  @Output() eventDateDetails = new EventEmitter();
  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.eventDateList?.currentValue) {
      this.newEventDateList = [];
      this.eventDateList = changes?.eventDateList?.currentValue;
      this.initialiseForm();
      this.updateForm();
      this.listenForChange();
      if (this.dataOnEditMode?.eventDate.length > 0) {
        this.setNewDateOnGdicEdit();
      }
    }
    if (changes?.dataOnEditMode?.currentValue) {
      this.dataOnEditMode = changes?.dataOnEditMode?.currentValue;
    }
  }
  initialiseForm() {
    this.eventDateForm = this.fb.group({
      eventDateDetails: ''
    });
  }
  updateForm() {
    this.eventDateForm.setControl('eventDateDetails', this.setExistingEventDetails(this.eventDateList?.eventDateInfo));
  }
  setExistingEventDetails(eventDetails) {
    const eventDetailsFA = new FormArray([]);
    if (eventDetails) {
      eventDetails.forEach(res => {
        eventDetailsFA.push(this.newEventDetails(res));
      });
    }
    return eventDetailsFA;
  }

  newEventDetails(res): FormGroup {
    return this.fb.group({
      year: [res['year']],
      eventDateInfo: [res['eventDate']],
      month: [res['month']],
      newDate: this.fb.group({
        gregorian: this.fb.control('', [Validators.required]),
        hijiri: ''
      })
    });
  }

  //enable next month only on a month selection by setting mindate
  getMinDate(currentMonth) {
    return new Date(currentMonth);
  }

  //enable next month only on a month selection by setting mindate
  getMaxDate(currentMonth) {
    return endOfMonth(new Date(currentMonth));
  }

  listenForChange() {
    this.eventDateForm.controls.eventDateDetails['controls'].forEach(eventDateControl => {
      this.parentForm.addControl('eventDateChange', this.eventDateForm);
      eventDateControl.valueChanges.subscribe(data => {
        this.pushDateChange(data);
      });
    });
  }
  pushDateChange(value) {
    if (typeof value === 'object') {
      const dateIndex = this.newEventDateList
        .map(data => data['year'] + data['month']['english'])
        .indexOf(value['year'] + value['month']['english']);
      if (dateIndex < 0) {
        this.newEventDateList.push(value);
      } else {
        this.newEventDateList[dateIndex] = value;
      }

      this.eventDateDetails.emit(this.newEventDateList);
    }
  }
  setNewDateOnGdicEdit() {
    this.eventDateForm.get('eventDateDetails')['controls'].forEach(item => {
      this.dataOnEditMode.eventDate.forEach(date => {
        if (
          moment(date.actualEventDate.gregorian).toString() ===
          moment(item.get('eventDateInfo').value.gregorian).toString()
        ) {
          item.get('newDate').get('gregorian').setValue(new Date(date.newEventDate.gregorian));
        }
      });
    });
  }
}
