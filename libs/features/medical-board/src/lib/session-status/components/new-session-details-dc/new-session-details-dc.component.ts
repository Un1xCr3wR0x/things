/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { convertToYYYYMMDD, greaterThanValidator, markFormGroupTouched, startOfDay } from '@gosi-ui/core';
import moment from 'moment';
import { MBConstants, RescheduleSessionData, UnAvailableMemberListRequest } from '../../../shared';

@Component({
  selector: 'mb-new-session-details-dc',
  templateUrl: './new-session-details-dc.component.html',
  styleUrls: ['./new-session-details-dc.component.scss']
})
export class NewSessionDetailsDcComponent implements OnInit, OnChanges {
  //Local Variables
  currentDate: Date = new Date();
  sessionForm: FormGroup = new FormGroup({});
  endTimePicker: FormGroup = new FormGroup({});
  sessionDifference: number;
  minDate: Date;
  startTime: string;
  endTime: string;
  //Input Variables
  @Input() parentForm: FormGroup;
  @Input() sessionData: RescheduleSessionData;
  //Output Variables
  @Output() difference: EventEmitter<number> = new EventEmitter();
  @Output() unAvailableList: EventEmitter<UnAvailableMemberListRequest> = new EventEmitter();

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.sessionForm = this.createSessionForm();
    this.endTimePicker = this.createEndTimeForm();
    this.parentForm.addControl('session', this.sessionForm);
    // this.parentForm.addControl('endTime', this.endTimePicker);
    this.sessionForm.valueChanges.subscribe(() => {
      this.setFormForUnavailableList();
    });
    this.endTimePicker.valueChanges.subscribe(() => [this.setFormForUnavailableList()]);
    this.setTimeValidation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.parentForm) {
      this.parentForm = changes.parentForm.currentValue;
    }
    if (changes.sessionData && changes.sessionData.currentValue) {
      this.sessionData = changes.sessionData.currentValue;      
      this.sessionForm.get('startDate').get('gregorian').setValue(new Date(this.sessionData?.sessionDate?.gregorian));
      this.minDate = new Date();
      const sessionStartArray = this.sessionData?.startTime.split(':');
      const minuteArray = sessionStartArray[1].split(' ');
      sessionStartArray[1] = minuteArray[0];
      sessionStartArray[1] = sessionStartArray[1] !== undefined ? sessionStartArray[1] : '00';
      if (this.sessionData?.startTimeAmOrPm.english === MBConstants.POST_MERIDIAN()) {
        if (Number(sessionStartArray[0]) === 12) {
          sessionStartArray[0] = '12';
        } else sessionStartArray[0] = String(Number(sessionStartArray[0]) + 12);
      } else if (
        this.sessionData?.startTimeAmOrPm.english === MBConstants.ANTE_MERIDIAN() &&
        Number(sessionStartArray[0]) === 12
      ) {
        sessionStartArray[0] = '00';
      }
      this.startTime = sessionStartArray[0] + '::' + sessionStartArray[1];
      const sessionEndArray = this.sessionData?.endTime.split(':');
      const endMinuteArray = sessionEndArray[1].split(' ');
      sessionEndArray[1] = endMinuteArray[0];
      sessionEndArray[1] = sessionEndArray[1] !== undefined ? sessionEndArray[1] : '00';
      if (this.sessionData?.endTimeAmOrPm.english === MBConstants.POST_MERIDIAN()) {
        if (Number(sessionEndArray[0]) === 12) {
          sessionEndArray[0] = '12';
        } else sessionEndArray[0] = String(Number(sessionEndArray[0]) + 12);
      } else if (
        this.sessionData?.endTimeAmOrPm.english === MBConstants.ANTE_MERIDIAN() &&
        Number(sessionEndArray[0]) === 12
      ) {
        sessionEndArray[0] = '00';
      }
      this.endTime = sessionEndArray[0] + '::' + sessionEndArray[1];
      this.sessionForm.get('startTimePicker').get('injuryHour').setValue(sessionStartArray[0]);
      this.sessionForm.get('startTimePicker').get('injuryMinute').setValue(sessionStartArray[1]);
      this.sessionForm.get('endTime').get('injuryHour').setValue(sessionEndArray[0]);
      this.sessionForm.get('endTime').get('injuryMinute').setValue(sessionEndArray[1]);
      this.endTimePicker.get('injuryHour').setValue(sessionEndArray[0]);
      this.endTimePicker.get('injuryMinute').setValue(sessionEndArray[1]);
    }
  }
  setTimeValidation() {
    this.sessionForm.get('startTimePicker')?.valueChanges.subscribe(value => {
      this.sessionForm.get('endTime').reset();
      const startHour = this.sessionForm.get('startTimePicker')?.get('injuryHour').value;
      const endHour = Number(this.sessionForm.get('endTime')?.get('injuryHour').value);
      if (startHour !== '00') {
        this.sessionForm
          .get('endTime')
          ?.get('injuryHour')
          ?.setValidators([greaterThanValidator(Number(startHour)), Validators.required]);
      } else if (startHour === 0) {
        this.sessionForm.get('endTime').get('injuryHour').setValidators(Validators.required);
      }
    });
    this.sessionForm.get('endTime')?.valueChanges.subscribe(() => {
      this.sessionForm
        .get('endTime')
        ?.get('injuryHour')
        .valueChanges.subscribe(() => {
          this.sessionForm.get('endTime')?.get('injuryMinute').reset();
        });
      const startHour = Number(this.sessionForm.get('startTimePicker')?.get('injuryHour').value);
      const startMinute = Number(this.sessionForm.get('startTimePicker')?.get('injuryMinute').value);
      const endHour = Number(this.sessionForm.get('endTime')?.get('injuryHour').value);
      const endMinute = Number(this.sessionForm.get('endTime')?.get('injuryMinute').value);
      if (startHour === endHour) {
        this.sessionForm
          .get('endTime')
          ?.get('injuryMinute')
          ?.setValidators([Validators.min(Number(startMinute) + 1), Validators.required]);
      } else {
        this.sessionForm.get('endTime')?.get('injuryMinute')?.setValidators([Validators.required]);
      }
    });
  }
  setFormForUnavailableList() {
    markFormGroupTouched(this.sessionForm);
    markFormGroupTouched(this.endTimePicker);
    const startHour = this.sessionForm.get('startTimePicker').get('injuryHour').value;
    const startMinute = this.sessionForm.get('startTimePicker').get('injuryMinute').value;
    const startDate = this.sessionForm.get('startDate.gregorian').value;
    const endHour = this.sessionForm.get('endTime').get('injuryHour').value;
    const endMinute = this.sessionForm.get('endTime').get('injuryMinute').value;
    const valid = startHour === endHour ? (startMinute < endMinute ? true : false) : startHour < endHour ? true : false;
    if (
      startDate !== null &&
      startHour !== null &&
      startMinute !== null &&
      endHour !== null &&
      endMinute !== null &&
      this.sessionForm.valid &&
      this.endTimePicker.valid &&
      valid
    ) {
      const sessionDate = String(startOfDay(startDate));
      const dateArray = convertToYYYYMMDD(sessionDate);
      let sTime: string = startHour;
      sTime = sTime + '::' + startMinute;
      let eTime: string = endHour;
      eTime = eTime + '::' + endMinute;
      const unAvailableRequest: UnAvailableMemberListRequest = {
        startDate: dateArray,
        startTime: sTime,
        endTime: eTime
      };
      if (
        unAvailableRequest.startDate !== convertToYYYYMMDD(String(this.sessionData.sessionDate.gregorian)) ||
        unAvailableRequest.startTime !== this.startTime ||
        unAvailableRequest.endTime !== this.endTime
      )
        this.unAvailableList.emit(unAvailableRequest);
      this.startTime = unAvailableRequest.startTime;
      this.endTime = unAvailableRequest.endTime;
    }
  }
  createSessionForm() {
    return this.fb.group({
      startTimePicker: this.fb.group({
        injuryHour: [null, { validators: Validators.required }],
        injuryMinute: [null, { validators: Validators.required }]
      }),
      startDate: this.fb.group({
        gregorian: [null, { validators: Validators.compose([Validators.required]), updateOn: 'blur' }],
        hijiri: null
      }),
      endTime: this.fb.group({
        injuryHour: [null, { validators: Validators.required }],
        injuryMinute: [null, { validators: Validators.required }]
      })
    });
  }
  createEndTimeForm() {
    return this.fb.group({
      injuryHour: [null, { validators: Validators.compose([Validators.required]) }],
      injuryMinute: [null, { validators: Validators.required }]
    });
  }
  mindateChange(event) {
    this.sessionForm.get('startDate').valueChanges.subscribe(value => {
      this.sessionDifference = moment(value.gregorian).diff(new Date(), 'day') + 1;
      this.difference.emit(this.sessionDifference);
    });
  }
  validateTime() {
    const startHour = this.sessionForm.get('startTimePicker').get('injuryHour').value;
    const startMinute = this.sessionForm.get('startTimePicker').get('injuryMinute').value;
    const endHour = this.sessionForm.get('endTimePicker').get('injuryHour').value;
    const endMinute = this.sessionForm.get('endTimePicker').get('injuryMinute').value;
    const valid = startHour === endHour ? (startMinute < endMinute ? true : false) : startHour < endHour ? true : false;
    if (endHour !== null && endMinute !== null && !valid) {
      this.sessionForm.get('endTimePicker').get('injuryHour').setValue(null);
      this.sessionForm.get('endTimePicker').get('injuryMinute').setValue(null);
    }
  }
}
