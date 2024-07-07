import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, LanguageToken, Lov, LovList } from '@gosi-ui/core';
import { DATE } from 'ngx-bootstrap/chronos/units/constants';
import { DisabiliyDtoList } from '../../../shared/models/disabiliy-dto-list';
import { IndividualSessionEvents } from '../../../shared/models/individual-session-events';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mb-assessment-schedule-details-dc',
  templateUrl: './assessment-schedule-details-dc.component.html',
  styleUrls: ['./assessment-schedule-details-dc.component.scss']
})
export class AssessmentScheduleDetailsDcComponent implements OnInit, OnChanges {
  assessmentForm: FormGroup;
  list: LovList = new LovList([]);
  currentDate = new Date();
  lang = 'en';
  lan: string;
  headOffice = { value: { english: 'Head Office', arabic: 'المركز الرئيسي' }, sequence: 1 };
  @Input() sessionTimeList: LovList;
  @Input() locationList: LovList;
  @Input() isReassessment = false;
  // @Input() assessmentList: string[];
  @Input() availableArray: Date[];
  @Input() unavailableArray: Date[];
  @Input() fullyFilled: boolean;
  @Input() noSessions = false;
  @Input() parentForm: FormGroup;
  @Input() disabilityDetails: DisabiliyDtoList;
  // @Input() individualSession: IndividualSessionEvents[];
  @Output() dateChange: EventEmitter<Date> = new EventEmitter();
  @Output() locationChange: EventEmitter<BilingualText> = new EventEmitter();
  @Output() eventChange: EventEmitter<Date> = new EventEmitter();
  @Output() setTime: EventEmitter<Lov> = new EventEmitter();
  @Input() isDisabled: boolean;
  officeLocation: BilingualText;
  resetTime = false;
  constructor(readonly fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    if (!this.assessmentForm) {
      this.assessmentForm = this.createSpecialtyForm();
    }
    if (this.parentForm) {
      this.parentForm.addControl('disabilityAssessmentForm', this.assessmentForm);
    }
    // console.log(this.availableArray);
    this.assessmentForm.get('location').valueChanges?.subscribe(() => {
      this.assessmentForm.get('assessmentDate').reset();
      this.assessmentForm.get('assessmentTime').reset();
      this.resetTime = true;
    });
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.onLocationChange();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.sessionTimeList && changes.sessionTimeList.currentValue) {
      this.sessionTimeList = changes.sessionTimeList.currentValue;
      if (this.isDisabled) {
        setTimeout(() => {
          this.assessmentForm.get('assessmentTime').patchValue(this.sessionTimeList.items[0].value);
        }, 0);
        // console.log(this.assessmentForm);

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

  onLocationChange(){
    if (this.disabilityDetails.medicalBoard.english === 'Appeal Medical Board') {
        this.assessmentForm.get('location').get('english').patchValue(this.headOffice?.value?.english);
        this.assessmentForm.get('location').get('arabic').patchValue(this.headOffice?.value?.arabic);
    } else {
      this.assessmentForm.get('location').patchValue(this.disabilityDetails?.foCode);
    }
  }

  createSpecialtyForm() {
    return this.fb.group({
      location: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      assessmentDate: this.fb.group({
        gregorian: [null, Validators.required],
        hijiri: [null]
      }),
      assessmentTime: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
}
