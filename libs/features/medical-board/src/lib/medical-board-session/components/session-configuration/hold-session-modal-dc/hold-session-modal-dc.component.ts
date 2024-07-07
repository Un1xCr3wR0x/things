/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LovList,
  AppConstants,
  convertToStringDDMMYYYY,
  addDays,
  startOfDay,
  BilingualText,
  GosiCalendar,
  scrollToTop,
  markFormGroupTouched
} from '@gosi-ui/core';
import * as moment from 'moment';
import { HoldSessionDetails, IndividualSessionDetails, SessionHoldDetails, MBConstants, GeneralEnum } from '../../../../shared';

@Component({
  selector: 'mb-hold-session-modal-dc',
  templateUrl: './hold-session-modal-dc.component.html',
  styleUrls: ['./hold-session-modal-dc.component.scss']
})
export class HoldSessionModalDcComponent implements OnInit, OnChanges {
  //Local Variables
  addMinDate: Date;
  addStartdate: Date;
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;
  date: Date;
  modifystartDate: Date;
  disabled = false;
  endrange = [];
  helpEndText: BilingualText = new BilingualText();
  helpStartText: BilingualText = new BilingualText();
  holdMinDate: Date;
  holdSessionForm: FormGroup = new FormGroup({});
  holdStartDate: Date;
  startDate: Date;
  startrange = [];

  //Input Variables
  @Input() actionType: string;
  @Input() holdDetails: SessionHoldDetails;
  @Input() holdReasonList: LovList;
  @Input() individualSessionDetails: IndividualSessionDetails;
  @Input() parentForm: FormGroup = new FormGroup({});

  //Output Variables
  @Output() cancelEvent: EventEmitter<null> = new EventEmitter();
  @Output() action: EventEmitter<HoldSessionDetails> = new EventEmitter();
  showMandatoryError: boolean;

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.helpStartText = null;
    this.helpEndText = null;
    this.holdSessionForm = this.createHoldSessionForm();
    if (this.actionType === 'add') {
      this.holdSessionForm?.reset();
      this.parentForm?.removeControl('holdSessionForm');
    }
    if (this.holdDetails && this.actionType === 'modify') this.bindToForm(this.holdDetails);
    if (this.parentForm) this.parentForm.addControl('holdSessionForm', this.holdSessionForm);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.holdDetails) {
      this.holdDetails = changes.holdDetails.currentValue;
    }
    if (changes && changes.actionType) {
      this.actionType = changes.actionType.currentValue;
    }
    if (changes && changes.individualSessionDetails) {
      this.individualSessionDetails = changes.individualSessionDetails.currentValue;
      this.setAddStartDate(this.individualSessionDetails.startDate);
    }
    if (changes && changes.parentForm) {
      this.parentForm = changes.parentForm.currentValue;
    }
  }
  bindToForm(holdDetails: SessionHoldDetails) {
    this.holdMinDate = new Date();
    if (this.holdSessionForm) {
      this.modifystartDate = new Date();
      if (holdDetails?.holdStartDate)
        this.holdSessionForm
          .get('startDate')
          ?.get('gregorian')
          ?.setValue(startOfDay(new Date(holdDetails?.holdStartDate?.gregorian)));
      else this.holdSessionForm.get('startDate')?.get('gregorian')?.setValue(null);
      const modifyStartdate = moment(holdDetails?.holdStartDate?.gregorian);
      if (modifyStartdate.isBefore(new Date())) this.modifystartDate = modifyStartdate.toDate();
      const endDate = moment(this.holdDetails?.holdEndDate?.gregorian);
      if (endDate.isBefore(new Date())) {
        this.holdMinDate = endDate.toDate();
        this.disabled = true;
      } else this.disabled = false;

      if (holdDetails?.holdEndDate)
        this.holdSessionForm
          .get('endDate')
          ?.get('gregorian')
          ?.setValue(startOfDay(new Date(holdDetails?.holdEndDate?.gregorian)));
      else this.holdSessionForm.get('endDate')?.get('gregorian')?.setValue(null);
      this.holdSessionForm.get('holdReason')?.get('english')?.setValue(holdDetails?.holdReason?.english);
      this.holdSessionForm.get('holdReason')?.get('arabic')?.setValue(holdDetails?.holdReason?.arabic);
      this.commentMandatory();
    }
  }
  setAddStartDate(sessionDate: GosiCalendar) {
    if (moment(sessionDate.gregorian).isAfter(new Date()))
      this.startDate = addDays(moment(sessionDate.gregorian).toDate(), 1);
    else this.startDate = new Date();
  }
  getIsDisabled() {
    if (this.actionType === 'modify') {
      if (!this.holdSessionForm.valid || this.disabled) return true;
      else return false;
    } else if (this.actionType === 'add') {
      if (!this.holdSessionForm.valid) return true;
      else return false;
    }
  }
  /**
   * Method to detect change in input property
   */
  mindateChange() {
    this.holdSessionForm
      .get('startDate')
      .get('gregorian')
      .valueChanges.subscribe(value => {
        this.holdStartDate = moment(value).toDate();
        this.startrange = [];
        const today = moment(new Date());
        if (today.isSameOrAfter(this.holdStartDate))
          this.startrange = this.getDates(addDays(new Date(), 1), addDays(new Date(), 21));
        else this.startrange = this.getDates(addDays(new Date(this.holdStartDate), 1), addDays(new Date(), 21));
        if (this.startrange?.length > 0) {
          if (this.startrange.length === 1) this.helpStartText = MBConstants.HOLD_START_MESSAGE(this.startrange[0]);
          else
            this.helpStartText = MBConstants.HOLD_END_MESSAGE(
              this.startrange[0],
              this.startrange[this.startrange.length - 1]
            );
        } else {
          this.helpStartText = null;
          this.helpEndText = null;
        }
        this.holdSessionForm.get('endDate').get('gregorian').reset();
        if (value == null) this.holdMinDate = null;
        else this.holdMinDate = moment(value).toDate();
        const daysDiff = moment(new Date()).diff(moment(value).toDate());
        if (daysDiff < 1) this.holdMinDate = moment(value).toDate();
        else this.holdMinDate = new Date();
      });
  }
  /**
   * Method to get date range
   * @param startDate
   * @param stopDate
   */
  getDates(startDate, stopDate) {
    const dateArray = [];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(convertToStringDDMMYYYY(new Date(currentDate).toString()));
      currentDate = addDays(currentDate, 1);
    }
    return dateArray;
  }
  maxdateChange() {
    this.holdSessionForm
      .get('endDate')
      .get('gregorian')
      .valueChanges.subscribe(value => {
        const endDate = moment(value).toDate();
        this.startrange = [];
        const today = moment(new Date());
        if (today.isSameOrAfter(endDate))
          this.endrange = this.getDates(addDays(new Date(), 1), addDays(new Date(), 21));
        else this.endrange = this.getDates(addDays(new Date(endDate), 1), addDays(new Date(), 21));
        if (this.endrange?.length > 0) {
          if (this.endrange.length === 1) this.helpEndText = MBConstants.HOLD_START_MESSAGE(this.endrange[0]);
          else
            this.helpEndText = MBConstants.HOLD_END_MESSAGE(this.endrange[0], this.endrange[this.endrange?.length - 1]);
        } else this.helpEndText = null;

        if (
          (moment(value).isSameOrAfter(this.holdStartDate) && moment(value).isSameOrAfter(new Date())) ||
          value === null
        )
          this.disabled = false;
        else this.disabled = true;
      });
  }
  startdateChange() {
    this.holdSessionForm
      .get('startDate')
      .get('gregorian')
      .valueChanges.subscribe(value => {
        this.addMinDate = addDays(new Date(value), 1);
      });
    this.holdSessionForm.get('endDate').get('gregorian').reset();
  }
  //Validation for incorrect date format
  onDateBlur(date, controlName) {
    const isValid = moment(date,'DD/MM/YYYY', true).isValid();
    if(date && date!=="" && !isValid) {
      this.holdSessionForm
      .get(controlName)
      .get('gregorian').setErrors({ bsDate: { invalid: true } });
    }
  }
  // Create hold session form
  createHoldSessionForm() {
    return this.fb.group({
      startDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      endDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      holdReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      comments: [null]
    });
  }
  //Cancel hold session
  cancelHoldSession() {
    this.cancelEvent.emit();
  }

  confirmHoldSession() {
    if (this.holdSessionForm.valid) {
      this.showMandatoryError = false;
      const formData = new HoldSessionDetails();
      formData.comments = this.holdSessionForm?.get('comments').value;
      let startDate :Date;
      startDate = this.holdSessionForm.get('startDate').get('gregorian').value;
      formData.startDate.gregorian = startOfDay(startDate);
      const endDate = this.holdSessionForm?.get('endDate.gregorian')?.value;
      formData.endDate.gregorian = startOfDay(endDate);
      formData.id = this.holdDetails?.id;
      formData.holdReason = this.holdSessionForm?.get('holdReason').value;
      this.action.emit(formData);
    } else {
      scrollToTop();
      markFormGroupTouched(this.holdSessionForm);
      this.showMandatoryError = true;
    }
  }

  commentMandatory() {
    const otherValue = this.holdSessionForm.get('holdReason').get('english');
    if (otherValue.value === GeneralEnum.OTHER) {
      this.holdSessionForm.get('comments').reset();
      this.holdSessionForm.get('comments').setValidators([Validators.required]);
      this.holdSessionForm.get('comments').updateValueAndValidity();
    } else if (otherValue.value !== GeneralEnum.OTHER) {
      this.holdSessionForm.get('comments').clearValidators();
      this.holdSessionForm.get('comments').reset();
      this.holdSessionForm.get('comments').updateValueAndValidity();
    }
  }
}
