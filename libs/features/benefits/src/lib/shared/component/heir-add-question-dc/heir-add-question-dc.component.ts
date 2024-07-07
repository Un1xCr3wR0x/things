/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Question, AddEvent } from '../../models/questions';
import { GosiCalendar, BilingualText, GenderEnum, Lov, formatDate } from '@gosi-ui/core';
import { InputControlType, QuestionTypes } from '../../enum';
import { isHeirBenefit } from '../../utils/benefitUtil';
import { EventsConstants } from '../../constants/events-constants';
import * as moment from 'moment';

@Component({
  selector: 'bnt-heir-add-question-dc',
  templateUrl: './heir-add-question-dc.component.html',
  styleUrls: ['./heir-add-question-dc.component.scss']
})
export class HeirAddQuestionDcComponent implements OnInit {
  /**
   * Input
   */
  @Input() qnControl: FormGroup;
  @Input() question: Question;
  @Input() lang = 'en';
  @Input() sex: BilingualText;
  @Input() missingOrDeathDate: GosiCalendar; //For translate in html
  @Input() maritalStatusDate: Date; //For translate in html
  @Input() maritalStatus: string;
  //TODO: change the Date type to GosiCalendar
  @Input() requestDate: Date; //For translate in html
  @Input() reasonForbenefits: string; //For translate in html
  @Input() addedEvent: AddEvent; //From add event popup
  @Input() pensionEligibilityStartDate: Date;
  @Input() systemRunDate: GosiCalendar;
  @Input() isHeir = false;
  @Input() isModify = false;
  @Input() isValidator = false;
  @Input() benefitType: string;
  @Input() eligibilityStartDateInDateFormat: moment.Moment;
  @Input() showEventsLabelOnly = false;
  @Input() isHeirLumpsum: boolean;
  @Input() hideErrorMessage = false;
  @Input() widowOrDivorceStatus: BilingualText;
  // @Input() parentForm: FormGroup;
  /**
   * Output
   */
  @Output() changeToggle: EventEmitter<boolean> = new EventEmitter();
  @Output() addEvent: EventEmitter<Question> = new EventEmitter();
  @Output() deleteEvent: EventEmitter<null> = new EventEmitter();
  @Output() openEligibilityPopup: EventEmitter<null> = new EventEmitter();

  genderEnum = GenderEnum;
  eventInfo: string;
  inputControlType = InputControlType;
  eventsOnly = EventsConstants.eventsOnlyText();
  controlsOnly = EventsConstants.controlsOnly();
  questionTypes = QuestionTypes;
  constructor() {}

  ngOnInit(): void {
    // if (this.question.key !== EventsConstants.eventsOnlyText()) this.getEventinfo();
    if (!this.isModify) {
      this.getEventinfo();
    }
  }

  get inputControls() {
    return this.qnControl.get('inputControls') as FormArray;
  }

  addEventPopup() {
    this.addEvent.emit(this.question);
  }

  deleteEventEmit() {
    this.deleteEvent.emit();
  }

  onToggle(event: boolean) {
    this.changeToggle.emit(event);
  }

  getEventinfo() {
    if (isHeirBenefit(this.benefitType)) {
      this.eventInfo = this.question.getEventInfoMessage();
    } else {
      this.eventInfo = this.question.geteventInfoDep();
    }
  }

  selectDropdownValue(value: Lov, controlKeyName: string, index: number) {
    const inputControl = this.qnControl.get('inputControls') as FormArray;
    const inputControlGrp = inputControl.at(index).get(controlKeyName) as FormGroup;
    inputControlGrp.addControl(controlKeyName + 'value', new FormControl(value));
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }

  openEligibility() {
    this.openEligibilityPopup.emit();
  }
}
