import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, GosiCalendar, Lov, LovList, MedicalAssessment } from '@gosi-ui/core';

@Component({
  selector: 'gosi-ui-medicalboard-reschedule-dc',
  templateUrl: './medicalboard-reschedule-dc.component.html',
  styleUrls: ['./medicalboard-reschedule-dc.component.scss']
})
export class MedicalboardRescheduleDcComponent implements OnInit {
  //Input Variables
  @Input() heading = '';
  @Input() locationList: LovList;
  @Input() availableArray: Date[];
  @Input() unavailableArray: Date[];
  @Input() parentForm: FormGroup;
  @Input() sessionTimeList: LovList;
  @Input() isDisabled: boolean;
  @Input() isReassessment = false;
  @Input() fullyFilled: boolean;
  @Input() noSessions = false;
  @Input() onHold = false;
  @Input() noSessionscalendar = false;
  @Input() minDateValue: Date;
  @Input() maxDateValue: Date;
  @Input() sessionnumber: number;
  @Input() invitenumber: number;
  @Input() virtual: BilingualText = new BilingualText();
  @Input() assessmentDetailsreschedule: MedicalAssessment[];
  //Output Variable
  @Output() locationChange: EventEmitter<BilingualText> = new EventEmitter();
  @Output() dateChange: EventEmitter<Date> = new EventEmitter();
  @Output() eventChange: EventEmitter<Date> = new EventEmitter();
  @Output() setTime: EventEmitter<Lov> = new EventEmitter();
  @Output() onCancelreschedule: EventEmitter<null> = new EventEmitter();
  @Output() showrescheduleModal: EventEmitter<HTMLElement> = new EventEmitter();
  @Output() finalconfirmReschedule: EventEmitter<FormGroup> = new EventEmitter();
  @Output() finalCancelreschedule: EventEmitter<null> = new EventEmitter();
  @Output() locationListModified: EventEmitter<BilingualText> = new EventEmitter();
  //variables
  selectedLocation: string;
  assessmentForm: FormGroup;
  resetTime = false;
  isDisabledLocation: boolean;
  currentDate = new Date();
  officeLocation: BilingualText;
  list: LovList = new LovList([]);
  datecheck: GosiCalendar;
  accepted: boolean;
  rescheduled: boolean;
  sessionId: number;
  inviteId: number;
  assessment: MedicalAssessment;
  showingCard: boolean = true;
  mbTypeenglish: string;
  mbTypearabic: string;

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    if (!this.assessmentForm) {
      this.assessmentForm = this.createSpecialtyForm();
    }
    if (this.parentForm) {
      this.parentForm.addControl('disabilityAssessmentForm', this.assessmentForm);
    }
    this.assessmentForm.get('location').valueChanges?.subscribe(() => {
      this.assessmentForm.get('assessmentDate').reset();
      this.assessmentForm.get('assessmentTime').reset();
      this.resetTime = true;
    });
    this.mbTypeenglish = this.assessmentDetailsreschedule[0].medicalBoardType?.english;
    this.mbTypearabic = this.assessmentDetailsreschedule[0].medicalBoardType?.arabic;
    if (this.mbTypeenglish === 'Appeal Medical Board') {
      this.isDisabledLocation = true;
      this.assessmentForm.get('location').patchValue(this.assessmentDetailsreschedule[0].location);
      this.locationListModified.emit(this.assessmentDetailsreschedule[0].location);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.sessionTimeList && changes.sessionTimeList.currentValue) {
      this.sessionTimeList = changes.sessionTimeList.currentValue;
      if (this.isDisabled) {
        setTimeout(() => {
          this.assessmentForm.get('assessmentTime').patchValue(this.sessionTimeList.items[0].value);
        }, 0);

        this.assessmentForm.updateValueAndValidity();
        this.assessmentForm.markAsPristine();
        this.setTime.emit(this.sessionTimeList.items[0]);
      }
    }
    if (changes && (changes.availableArray?.currentValue || changes.unavailableArray?.currentValue)) {
      this.resetTime = false;
    }
    if (changes && changes.isReassessment) {
      this.isReassessment = changes.isReassessment.currentValue;
    }
    if (changes.minDateValue && changes.minDateValue.currentValue) {
      this.minDateValue = changes.minDateValue.currentValue;
    }
    if (changes.maxDateValue && changes.maxDateValue.currentValue) {
      this.maxDateValue = changes.maxDateValue.currentValue;
    }
  }
  onLocationSelect() {
    this.officeLocation = this.assessmentForm.get('location').value;
    this.locationListModified.emit(this.officeLocation);
  }
  onMonthChange(value: Date) {
    this.officeLocation = this.assessmentForm.get('location').value;

    this.locationChange.emit(this.officeLocation);
    this.dateChange.emit(value);
  }
  onDayChange(value) {
    this.assessmentForm.get('assessmentTime').reset();
    this.eventChange.emit(value);
  }

  selectedTime(specialty: Lov) {
    this.setTime.emit(specialty);
  }
  /*Reschedule accept card actions*/
  finaldeclinereschedule() {
    this.finalCancelreschedule.emit();
    this.assessmentForm.reset();
  }
  finalAcceptReschedule() {
    this.sessionId = this.sessionnumber;
    this.inviteId = this.invitenumber;
    this.finalconfirmReschedule.emit(this.assessmentForm);
  }
  /*Form Actions*/
  onClickAcceptReschedule(template, assessmentForms) {
    if (this.assessmentForm.valid) {
      this.sessionId = this.sessionnumber;
      this.inviteId = this.invitenumber;
      this.showrescheduleModal.emit(template);
      this.datecheck = this.assessmentForm.get('assessmentDate').value;
      this.assessmentForm = assessmentForms;
      this.rescheduled = true;
      this.accepted = false;
      this.showingCard = false;
    } else {
      this.assessmentForm.markAllAsTouched();
    }
  }
  declinereschedule() {
    this.onCancelreschedule.emit();
    this.assessmentForm.reset();
    this.showingCard = false;
  }
  createSpecialtyForm() {
    return this.fb.group({
      location: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      assessmentDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      assessmentTime: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
}
