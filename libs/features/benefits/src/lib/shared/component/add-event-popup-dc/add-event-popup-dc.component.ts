/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// import { HeirEvent } from '../../models/questions';
import { Lov, GosiCalendar, greaterThanValidator, Alert } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BenefitEventSource, EventAddedFrom, EventCategory, EventsType } from '../../enum/events';
import { AddEvent, RequestEventType } from '../../models/questions';
import { EventsConstants } from '../../constants/events-constants';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { PersonalInformation } from '../../models';
import * as moment from 'moment';
import { calendarWithStartOfDay } from '../../utils/benefitUtil';
import { ActionType } from '@gosi-ui/features/benefits/lib/shared/enum/action-type';
import { ActionTypeEnum } from '@gosi-ui/features/establishment';
import { DependentEventSource } from '../../enum';
import { QuestionConstands } from '../../constants';
import { getLatestEventByEventStartDate, getOldestEventFromResponse } from '../../utils';

@Component({
  selector: 'bnt-add-event-popup-dc',
  templateUrl: './add-event-popup-dc.component.html',
  styleUrls: ['./add-event-popup-dc.component.scss']
})
export class AddEventPopupDcComponent implements OnInit {
  commonModalRef: BsModalRef;
  bsModalRef: BsModalRef;
  eventSource = BenefitEventSource;
  eventDateAfterDeathError;
  eventCategory = EventCategory;
  alert: Alert = new Alert();
  constructor(readonly modalService: BsModalService, readonly fb: FormBuilder) {}

  // @Input() events: HeirEvent[] = []; // type <Event>
  /**
   * Input
   */
  @Input()
  public get eventTypeList(): Lov[] {
    return this._eventTypeList;
  }
  public set eventTypeList(value: Lov[]) {
    const expectedEventTypes = EventsConstants.EVENT_TYPES_FOR_QUESTION(this.eventAddedFor.questionObj);
    if (expectedEventTypes.length) {
      this._eventTypeList = [];
      value.forEach(lov => {
        if (expectedEventTypes.includes(lov.value.english)) {
          this._eventTypeList.push(lov);
        }
      });
      if (this._eventTypeList.length === 0) {
        this._eventTypeList = value;
      }
    } else {
      this._eventTypeList = value;
    }
  }
  @Input() systemParameter: SystemParameter;
  @Input() eventAddedFor: RequestEventType;
  @Input() contributorDetails: PersonalInformation;
  @Input() lang: string;
  @Input() systemRunDate: GosiCalendar;
  @Input() isHeir = false;
  @Input() isModifyPage = false;
  @Input() requestDate: GosiCalendar;
  @Input() isSmallScreen: boolean;
  /**
   * Output
   */
  @Output() addEventDetails: EventEmitter<AddEvent> = new EventEmitter();
  @Output() closeAddEvent = new EventEmitter();

  showWageChangeError = false;
  maxDate = null;
  minDate = null;
  eventForm: FormGroup;
  deathBilingual = EventsConstants.deathBilingualText();
  _eventTypeList: Lov[];

  ngOnInit() {
    this.eventForm = this.createForm();
    this.eventForm.get('eventSource').patchValue(EventsConstants.EVENT_MANUAL);
    this.eventForm.get('eventCategory').patchValue(EventCategory[this.eventAddedFor?.questionObj?.key]);
    // if (this.eventForm.get('eventCategory')?.value === EventCategory.employed) {
    //   this.addWageControl();
    // }
    if (this.eventAddedFor.depOrHeirDeathDate) {
      this.maxDate = moment(this.eventAddedFor.depOrHeirDeathDate.gregorian).toDate();
    } else {
      this.maxDate = this.eventAddedFor?.questionObj?.maxDate
        ? this.eventAddedFor?.questionObj?.maxDate
        : moment(this.systemRunDate?.gregorian).toDate();
      // : this.eventAddedFor?.requestDate?.gregorian;
    }
    this.minDate = this.eventAddedFor?.questionObj?.minDate ? this.eventAddedFor?.questionObj?.minDate : new Date(1900, 1, 1);
  }

  selectedEventType(type: string) {
    //535662
    if (type === EventsType.BEGINNING_OF_EMPLOYMENT || type === EventsType.WAGE_CHANGE) {
      this.addWageControl();
    } else {
      this.eventForm.removeControl('wage');
    }
    if (this.isModifyPage) {
      if (!this.isHeir && type === EventsType.BEGINNING_OF_STUDY) {
        this.minDate = moment(this.requestDate.gregorian).toDate();
      }
      if (type === EventsType.MARRIAGE || type === EventsType.WIDOWHOOD || type === EventsType.DIVORCE) {
        this.minDate = moment(this.eventAddedFor.benefitEligibilityDate.gregorian).toDate();
      }
      if (
        this.eventAddedFor.modifyHeir &&
        (type === EventsType.BEGINNING_OF_EMPLOYMENT ||
          type === EventsType.WAGE_CHANGE ||
          type === EventsType.END_OF_EMPLOYMENT)
      ) {
        const oldestEvent = getOldestEventFromResponse(
          this.eventAddedFor?.questionObj?.events.filter(
            item => item.dependentEventSource !== DependentEventSource.UI_EVENT
          )
        );
        if (oldestEvent?.eventStartDate) {
          this.minDate = moment(oldestEvent.eventStartDate.gregorian).toDate();
        }
        const alert = new Alert();
        alert.messageKey = 'BENEFITS.MODIFY-HEIR-EMPLOYMENT-EVENT-MESSAGE';
        this.alert.details = [alert];
      }
    }
    // if (!this.isHeir && this.isModifyPage && type === EventsType.BEGINNING_OF_STUDY) {
    //   this.minDate = moment(this.requestDate.gregorian).toDate();
    // }
    // if (
    //   this.isModifyPage &&
    //   (type === EventsType.MARRIAGE || type === EventsType.WIDOWHOOD || type === EventsType.DIVORCE)
    // ) {
    //   this.minDate = moment(this.eventAddedFor.benefitEligibilityDate.gregorian).toDate();
    // }
    // if (type === EventsType.BEGINNING_OF_EMPLOYMENT || type === EventsType.WAGE_CHANGE) {
    //   this.addWageControl();
    // } else {
    //   this.eventForm.removeControl('wage');
    // }

    // if(
    //   this.isModifyPage &&
    //   this.eventAddedFor.modifyHeir &&
    //   (type === EventsType.BEGINNING_OF_EMPLOYMENT || type === EventsType.WAGE_CHANGE || type === EventsType.END_OF_EMPLOYMENT)
    // ) {
    //   const oldestEvent = getOldestEventFromResponse(
    //     this.eventAddedFor?.questionObj?.events.filter(
    //     item=> item.dependentEventSource !== DependentEventSource.UI_EVENT
    //     )
    //   );
    //   if(oldestEvent?.eventStartDate) {
    //     this.minDate = moment(oldestEvent.eventStartDate.gregorian).toDate();
    //   }
    // }

    // if (
    //   type === EventsType.WAGE_CHANGE ||
    //   type === EventsType.END_OF_EMPLOYMENT ||
    //   type === EventsType.BEGINNING_OF_EMPLOYMENT
    // ) {
    // if (
    //   (type === EventsType.WAGE_CHANGE && this.eventAddedFor?.relationship?.english === RelationShipCode.FATHER) ||
    //   this.eventAddedFor?.relationship?.english === RelationShipCode.GRAND_DAUGHTER ||
    //   (this.eventAddedFor?.relationship?.english === RelationShipCode.HUSBAND &&
    //     this.eventAddedFor?.age >= this.systemParameter.RETIREMENT_AGE)
    // ) {
    //   //US: 393334, 416651
    //   this.showWageChangeError = true;
    // }
    // }
  }

  isEventValid() {
    // Min date calculation is different in modify
    if (
      !this.eventAddedFor.modifyHeir &&
      this.checkEmploymentWageEvents() &&
      (!this.eventForm.get('eventStartDate.gregorian') ||
        !this.eventForm.get('eventStartDate.gregorian').value ||
        moment(this.eventForm.get('eventStartDate.gregorian')?.value).isBefore(
          moment(this.eventAddedFor.benefitEligibilityDate?.gregorian),
          'd'
        ))
    ) {
      return false;
    } else {
      return true;
    }
  }

  checkEmploymentWageEvents() {
    return (
      this.eventForm.get('eventType.english')?.value === EventsType.BEGINNING_OF_EMPLOYMENT ||
      this.eventForm.get('eventType.english')?.value === EventsType.END_OF_DISABILITY ||
      this.eventForm.get('eventType.english')?.value === EventsType.WAGE_CHANGE
    );
  }

  createForm() {
    return this.fb.group({
      actionType: [ActionType.ADD],
      eventOrigin: [EventAddedFrom.UI],
      dependentEventSource: [DependentEventSource.UI_EVENT],
      eventAddedFromUi: true,
      eventType: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      eventStartDate: this.fb.group({
        gregorian: ['', Validators.required],
        hijiri: [null]
      }),
      eventEndDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      eventSource: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      eventCategory: '',
      eventCanBeDeleted: true
    });
  }

  closeModal() {
    this.closeAddEvent.emit();
  }

  addEvent() {
    this.eventDateAfterDeathError = false;
    if (this.eventForm.valid) {
      const contributorDeathDate =
        this.contributorDetails && this.contributorDetails?.deathDate
          ? moment(this.contributorDetails.deathDate?.gregorian)
          : null;
      // this.eventForm
      //   .get('eventStartDate')
      //   .patchValue('gregorian', startOfDay(this.eventForm.get('eventStartDate.gregorian').value));
      if (
        contributorDeathDate &&
        moment(this.eventForm.get('eventStartDate.gregorian').value).isAfter(contributorDeathDate)
      ) {
        this.eventDateAfterDeathError = true;
      } else {
        this.setEventCategory();
        const eventRawValue = this.eventForm.getRawValue();
        eventRawValue.eventStartDate = calendarWithStartOfDay(eventRawValue.eventStartDate);
        this.addEventDetails.emit(eventRawValue);
      }
    } else {
      this.eventForm.markAllAsTouched();
    }
  }

  setEventCategory() {
    const eventType = this.eventForm.get('eventType')?.get('english')?.value;
    if (QuestionConstands.EMPLOYMENT_EVENTS.includes(eventType)) {
      this.eventForm.get('eventCategory').patchValue(EventCategory.employed);
    }
  }

  addWageControl() {
    this.eventForm.addControl(
      'wage',
      new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.\\d+)?'), greaterThanValidator(0)])
    );
  }
}
