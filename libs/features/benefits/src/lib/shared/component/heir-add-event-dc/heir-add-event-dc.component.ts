/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { AddEvent, Question, HeirEvent } from '../../models/questions';
import { LovList, BilingualText } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BenefitEventSource, EventCategory, QuestionTypes, EventsType } from '../../enum/events';
import { hasOddBeginningOfStudyEvent, getControlsForHeir, createControlsForm } from '../../utils/benefitQuestionsUtils';
import moment from 'moment';
import { ActionType, DependentEventSource } from '../../enum';
import { EventsConstants } from '../../constants';

@Component({
  selector: 'bnt-heir-add-event-dc',
  templateUrl: './heir-add-event-dc.component.html',
  styleUrls: ['./heir-add-event-dc.component.scss']
})
export class HeirAddEventDcComponent implements OnInit, OnChanges {
  /**
   * Input
   */
  @Input() qnControl: FormGroup;
  @Input() questionObject: Question;
  @Input() addedEvent: AddEvent; //From add event popup
  @Input() validateFailedMessage: BilingualText; // to implement
  @Input() infoMessage: string;
  @Input() heading: string;
  @Input() eligibilityStartDateInDateFormat: moment.Moment;
  @Input() isHeir = false;
  @Input() isModify = false;
  @Input() isValidator = false;
  @Input() isHeirLumpsum: boolean;
  @Input() hideErrorMessage = false;
  @Input() lang = 'en';

  /**
   * Output
   */
  @Output() addEventDetails: EventEmitter<FormGroup> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() addEvent: EventEmitter<null> = new EventEmitter();
  @Output() deleteEvent: EventEmitter<null> = new EventEmitter();
  @Output() openEligibilityPopup: EventEmitter<null> = new EventEmitter();

  commonModalRef: BsModalRef;
  eventType: LovList;
  eventForm: FormGroup;
  bsModalRef: BsModalRef;
  eventSource = BenefitEventSource;
  isSmallScreen: boolean;
  questionTypes = QuestionTypes;
  showWage: boolean;
  actionType = ActionType;

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }

  constructor(readonly modalService: BsModalService, readonly fb: FormBuilder) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.addedEvent && changes.addedEvent.currentValue) {
      //To know for which question event added
      if (
        (this.addedEvent.eventCategory === EventCategory[this.questionObject.key] ||
          this.questionObject.key === EventsConstants.eventsOnlyText()) &&
        this.questionObject.showAddeventButton
      ) {
        const eventControl = new FormControl(this.addedEvent); // HeirEvent
        if (this.eventControls) {
          this.eventControls?.push(eventControl);
          this.questionObject.events.push(this.addedEvent);
        } else {
          //If no events already availabe for the question
          this.qnControl?.addControl('eventControls', new FormArray([eventControl]));
          this.questionObject.events = [this.addedEvent];
        }
        if (
          this.questionObject.key === QuestionTypes.STUDENT &&
          this.isHeir &&
          this.addedEvent.eventType?.english === EventsType.BEGINNING_OF_STUDY &&
          !this.isHeirLumpsum
        ) {
          const oddBeginningOfStudyEvent = hasOddBeginningOfStudyEvent(this.eventControls.getRawValue());
          if (oddBeginningOfStudyEvent) {
            if (!this.questionObject.inputControls) {
              this.questionObject.inputControls = [];
            }
            this.questionObject.inputControls = [
              ...this.questionObject.inputControls,
              ...getControlsForHeir(
                QuestionTypes.STUDENT,
                moment(oddBeginningOfStudyEvent.eventStartDate?.gregorian).add(1, 'y').toDate()
                // moment(this.systemRunDate?.gregorian).add(1, 'y').toDate()
              )
            ];
            this.qnControl?.addControl('inputControls', createControlsForm(this.questionObject));
          }
        }
      }
    }
    this.showWage = this.hasWage();
  }

  delete(index: number) {
    //anual notification text box to be added for student question
    const removedEventType = this.eventControls.at(index).value?.eventType?.english;
    if (
      this.isModify &&
      this.eventControls.at(index).value?.dependentEventSource === DependentEventSource.EXISTING_EVENT
    ) {
      //Events from NIC will not having any actionType or NO_ACTION, VAL edit will be having ADD action type
      this.eventControls.at(index).value.actionType = ActionType.REMOVE;
    } else if (
      this.isValidator &&
      this.isModify &&
      this.eventControls.at(index).value?.dependentEventSource === DependentEventSource.UI_EVENT &&
      !this.eventControls.at(index).value?.eventAddedFromUi
    ) {
      this.eventControls.removeAt(index);
      this.questionObject.events.splice(index, 1);
      this.eventControls.controls.forEach((control, i) => {
        if (control.value.dependentEventSource === DependentEventSource.ODM_EVENT) {
          this.eventControls.removeAt(i);
          this.questionObject.events.splice(index, 1);
        }
      });
    } else {
      this.eventControls.removeAt(index);
      this.questionObject.events.splice(index, 1);
    }
    if (removedEventType === EventsType.BEGINNING_OF_STUDY) {
      const oddBeginningOfStudyEvent = hasOddBeginningOfStudyEvent(this.eventControls.getRawValue());
      if (!oddBeginningOfStudyEvent) {
        this.questionObject.inputControls = null;
        this.qnControl.removeControl('inputControls');
      }
    }
    this.showWage = this.hasWage();
    this.deleteEvent.emit();
  }

  addEventPopup() {
    this.addEvent.emit();
  }

  get eventControls(): FormArray {
    return this.qnControl?.controls['eventControls'] as FormArray;
  }

  getModifiedEventControls() {
    return this.eventControls?.value
      ?.filter(val => val.actionType !== ActionType.REMOVE)
      .filter(val => (val.eventType ? true : false));
  }

  hasWage() {
    return (
      this.questionObject.key === QuestionTypes.EMPLOYED ||
      this.questionObject.events.findIndex(item => item.eventCategory === EventCategory.employed && item.wage) >= 0
    );
  }

  // getEventType(event: HeirEvent): BilingualText {
  //   const begEmpType = EventsConstants.BEGINNING_OF_EMPLOYMENT();
  //   if (
  //     event.eventType.english === begEmpType.english &&
  //     moment(event.eventStartDate.gregorian).isSame(this.eligibilityStartDateInDateFormat, 'd')
  //   ) {
  //     return EventsConstants.WAGE_AS_ON_ELIGIBILITY_DATE();
  //   } else {
  //     return event.eventType;
  //   }
  // }
  openEligibilityRules() {
    this.openEligibilityPopup.emit();
  }

  getLink() {
    return `<button id="eligibleRules" (click)="openEligibilityRules()" class="view-link">dd</button>`;
  }

  showPopOver(control: AbstractControl) {
    control.value['showPopOver'] = !control.value['showPopOver'];
  }
}
