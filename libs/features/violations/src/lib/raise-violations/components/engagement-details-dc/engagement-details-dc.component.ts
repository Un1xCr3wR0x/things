import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AlertService,
  CalendarService,
  convertToStringDDMMYYYY,
  dayDifference,
  Establishment,
  hijiriToJSON,
  LookupService,
  LovList,
  maxDateValidator,
  minDateValidator,
  parseToHijiri,
  startOfDay,
  subtractDays
} from '@gosi-ui/core';
import { InputDateDcComponent, InputHijiriDcComponent } from '@gosi-ui/foundation-theme';
import moment from 'moment';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { getDateFormat } from '../../../shared';
import { ViolationContributorEnum, ViolationsEnum } from '../../../shared/enums';
import { Engagements } from '../../../shared/models';

@Component({
  selector: 'vol-engagement-details-dc',
  templateUrl: './engagement-details-dc.component.html',
  styleUrls: ['./engagement-details-dc.component.scss']
})
export class EngagementDetailsDcComponent implements OnInit, OnChanges {
  currentDate: Date = new Date();
  minStartDate: Date = new Date();
  maxStartDate: Date = new Date();
  minHijiriStartDate: string;
  maxHijiriStartDate: string;
  minEndDate: Date = new Date();
  maxEndDate: Date = new Date();
  minHijiriEndDate: string;
  maxHijiriEndDate: string;
  maxGregStartDate: string;
  maxGregEndDate: string;

  isAutopopulateEngagement: boolean = false;
  @Input() violationYesOrNoList: Observable<LovList>;
  @Input() engagementDetails: Engagements;
  @Input() parentForm: FormGroup;
  @Input() engagementForm: FormGroup;
  @Input() isCancelEng: boolean;
  @Input() isIncorrectWage: boolean;
  @Input() isAddNewEng: boolean;
  @Input() isIncorrectReason: boolean;
  @Input() isViolatingProvisions: boolean;
  @Input() engIndex: number;
  @Input() isContributorEdit: boolean;
  @Input() id: string;
  @Input() setCancelEngForm: boolean;
  @Input() establishmentDetails: Establishment;

  @Output() getStartDate: EventEmitter<object> = new EventEmitter();
  @Output() getEndDate: EventEmitter<object> = new EventEmitter();
  @Output() bindData: EventEmitter<null> = new EventEmitter();

  @ViewChild('startDateGregComponent', { static: false })
  startDateGregComponent: InputDateDcComponent;
  @ViewChild('endDateGregComponent', { static: false })
  endDateGregComponent: InputDateDcComponent;
  @ViewChild('startDateHijiriComponent', { static: false })
  startDateHijiriComponent: InputHijiriDcComponent;
  @ViewChild('endDateHijiriComponent', { static: false })
  endDateHijiriComponent: InputHijiriDcComponent;

  calenderList: LovList;
  hijiriDate: string;
  engStartDate: Date;
  engEndDate: Date;
  engStartDateHijiri: string;
  engEndDateHijiri: string;
  isStartDateHijiri: boolean;
  isEndDateHijiri: boolean;
  showDateInfoMsg: boolean;
  constructor(
    readonly fb: FormBuilder,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    const item = [
      {
        value: { english: 'Gregorian', arabic: 'ميلادي' },
        sequence: 1
      },
      {
        value: { english: 'Hijiri', arabic: 'هجري' },
        sequence: 2
      }
    ];
    this.showDateInfoMsg = false;
    this.calenderList = new LovList(item);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.establishmentDetails && changes.establishmentDetails.currentValue) {
      this.establishmentDetails = changes.establishmentDetails.currentValue;
      this.setCalenderDates(this.establishmentDetails?.startDate?.gregorian);
    }
    if (changes.engagementDetails && changes.engagementDetails.currentValue) {
      this.engagementDetails = changes.engagementDetails.currentValue;
      this.showDateInfoMsg = false;
      if (this.isCancelEng) {
        this.setCalenderType(this.engagementForm?.get('calendarType').value);
        this.engagementForm
          ?.get('periodStartDate')
          ?.get('gregorian')
          ?.valueChanges.pipe(distinctUntilChanged())
          .subscribe(() => {
            this.onStartDateChange();
          });
        // this.engagementForm
        //   ?.get('periodStartDate')
        //   ?.get('hijiri')
        //   ?.valueChanges.pipe(
        //     filter(() => this.engagementForm?.get('periodStartDate')?.get('hijiri').valid),
        //     distinctUntilChanged()
        //   )
        //   .subscribe(() => {
        //     this.onStartDateChange();
        //   });
        this.engagementForm
          ?.get('periodEndDate')
          ?.get('gregorian')
          ?.valueChanges.pipe(
            filter(() => this.engagementForm?.get('periodEndDate')?.get('gregorian').valid),
            distinctUntilChanged()
          )
          .subscribe(() => {
            this.onDatesSubmit();
          });
        // this.engagementForm
        //   ?.get('periodEndDate')
        //   ?.get('hijiri')
        //   ?.valueChanges.pipe(
        //     filter(() => this.engagementForm?.get('periodEndDate')?.get('hijiri').valid),
        //     distinctUntilChanged()
        //   )
        //   .subscribe(() => {
        //     this.onDatesSubmit();
        //   });
        this.setCancelEngDates();
        setTimeout(() => {
          this.checkForCancelledBooleanYesOrNo();
          this.showDateInfoMsg = false;
          if (this.isContributorEdit) this.bindData.emit();
        }, 300);
      }
    }
    if (changes.isContributorEdit) {
      this.isContributorEdit = changes?.isContributorEdit?.currentValue;
    }
    if (changes.setCancelEngForm && this.isCancelEng) {
      this.setDateTypes(this.engagementForm?.get('calendarType').value);
      this.showDateInfoMsg = false;
      this.checkForCancelledBooleanYesOrNo();
      this.onStartDateChange();
    }
  }
  setCalenderDates(estStartDate: Date) {
    const estDate = moment(this.establishmentDetails?.startDate?.gregorian).startOf('day').toDate();
    this.minStartDate = estDate;
    this.minEndDate = estDate;
    this.lookupService.getHijriDate(estStartDate).subscribe(res => {
      const minDate = convertToStringDDMMYYYY(res?.hijiri);
      this.minHijiriStartDate = minDate;
      this.minHijiriEndDate = minDate;
    });
    const newDate = moment(new Date()).startOf('day').toDate();
    this.maxStartDate = newDate;
    this.maxEndDate = newDate;
    this.lookupService.getHijriDate(moment(new Date()).toDate()).subscribe(res => {
      this.hijiriDate = convertToStringDDMMYYYY(res?.hijiri);
      this.maxHijiriStartDate = this.hijiriDate;
      this.maxHijiriEndDate = this.hijiriDate;
    });
    this.maxGregStartDate = convertToStringDDMMYYYY(new Date().toDateString());
    this.maxGregEndDate = convertToStringDDMMYYYY(new Date().toDateString());
  }
  checkForCancelledBooleanYesOrNo() {
    if (this.engagementForm?.get('calendarType').value === null) {
      this.engagementForm?.get('calendarType').setValue(ViolationsEnum.DATE_GREGORIAN);
      this.engagementForm?.get('periodStartDate')?.get('entryFormat').setValue(ViolationsEnum.DATE_GREGORIAN);
      this.engagementForm?.get('periodEndDate')?.get('entryFormat').setValue(ViolationsEnum.DATE_GREGORIAN);
    }

    if (this.engagementDetails.status === ViolationContributorEnum.CANCELLED) {
      this.engagementForm?.get('isEngagementCancelled.english').setValue(ViolationsEnum.BOOLEAN_YES);
      this.checkEngagementFullyCancelled(ViolationsEnum.BOOLEAN_YES);
    } else {
      this.engagementForm?.get('isEngagementCancelled.english').setValue(ViolationsEnum.BOOLEAN_NO);
      this.checkEngagementFullyCancelled(ViolationsEnum.BOOLEAN_NO);
    }
  }
  checkEngagementFullyCancelled(clickedYes: String) {
    if (clickedYes === ViolationsEnum.BOOLEAN_YES) {
      this.isAutopopulateEngagement = true;
      if (this.isStartDateHijiri) {
        this.engagementForm.get('periodStartDate').get('hijiri').setValidators([Validators.required]);
        this.engagementForm.get('periodStartDate').get('entryFormat').setValue(ViolationsEnum.DATE_HIJIRI);
      } else {
        this.engagementForm.get('periodStartDate').get('gregorian').setValidators([Validators.required]);
        this.engagementForm.get('periodStartDate').get('entryFormat').setValue(ViolationsEnum.DATE_GREGORIAN);
      }
      if (this.isEndDateHijiri) {
        this.engagementForm.get('periodEndDate').get('hijiri').setValidators([Validators.required]);
        this.engagementForm.get('periodEndDate').get('entryFormat').setValue(ViolationsEnum.DATE_HIJIRI);
      } else {
        this.engagementForm.get('periodEndDate').get('gregorian').setValidators([Validators.required]);
        this.engagementForm.get('periodEndDate').get('entryFormat').setValue(ViolationsEnum.DATE_GREGORIAN);
      }
      this.engagementForm
        .get('periodStartDate')
        .get('gregorian')
        .setValue(new Date(this.engagementDetails?.joiningDate?.gregorian));
      this.engagementForm
        .get('periodStartDate')
        .get('hijiri')
        .setValue(convertToStringDDMMYYYY(this.engagementDetails?.joiningDate?.hijiri));
      setTimeout(() => {
        this.engagementForm
          .get('periodEndDate')
          .get('gregorian')
          .setValue(new Date(this.engagementDetails?.leavingDate?.gregorian));
        this.engagementForm
          .get('periodEndDate')
          .get('hijiri')
          .setValue(convertToStringDDMMYYYY(this.engagementDetails?.leavingDate?.hijiri));
      }, 250);
    } else {
      if (getDateFormat(this.engagementForm?.get('calendarType').value) === ViolationsEnum.DATE_HIJIRI) {
        this.engagementForm.get('periodStartDate').get('hijiri').setValidators([Validators.required]);
        this.engagementForm.get('periodStartDate').get('entryFormat').setValue(ViolationsEnum.DATE_HIJIRI);
      } else if (getDateFormat(this.engagementForm?.get('calendarType').value) === ViolationsEnum.DATE_GREGORIAN) {
        this.engagementForm.get('periodStartDate').get('gregorian').setValidators([Validators.required]);
        this.engagementForm.get('periodStartDate').get('entryFormat').setValue(ViolationsEnum.DATE_GREGORIAN);
      }

      if (this.engagementDetails?.status === ViolationContributorEnum.LIVE) {
        this.maxStartDate = subtractDays(moment(this.engStartDate).startOf('day').toDate(), 1);
        this.maxHijiriStartDate = this.engStartDateHijiri;
        this.maxGregStartDate = convertToStringDDMMYYYY(subtractDays(new Date(this.engStartDate), 1).toDateString());
        this.maxEndDate = subtractDays(moment(this.engStartDate).startOf('day').toDate(), 1);
        this.maxHijiriEndDate = this.engStartDateHijiri;
        this.maxGregEndDate = convertToStringDDMMYYYY(subtractDays(new Date(this.engStartDate), 1).toDateString());
      }
      this.isAutopopulateEngagement = false;
      const startDateValidatorFns = [minDateValidator(this.minStartDate), maxDateValidator(this.maxStartDate)];
      if (this.engagementForm.get('periodStartDate')?.get('entryFormat')?.value === ViolationsEnum.DATE_GREGORIAN) {
        startDateValidatorFns.push(Validators.required);
      }
      this.engagementForm?.get('periodStartDate')?.get('gregorian')?.setValidators(startDateValidatorFns);
      const endDateValidatorFns = [minDateValidator(this.minEndDate), maxDateValidator(this.maxEndDate)];
      if (this.engagementForm.get('periodEndDate')?.get('entryFormat')?.value === ViolationsEnum.DATE_GREGORIAN) {
        endDateValidatorFns.push(Validators.required);
      }
      this.engagementForm?.get('periodEndDate')?.get('gregorian')?.setValidators(endDateValidatorFns);
      const startDateHijiriValidatorFns = [];
      // [
      //   minDateValidator(convertToDateFromHijiri(this.minHijiriStartDate)),
      //   maxDateValidator(convertToDateFromHijiri(this.maxHijiriStartDate))
      // ];
      if (this.engagementForm.get('periodStartDate')?.get('entryFormat')?.value === ViolationsEnum.DATE_HIJIRI) {
        startDateHijiriValidatorFns.push(Validators.required);
      }
      this.engagementForm?.get('periodStartDate')?.get('hijiri')?.setValidators(startDateHijiriValidatorFns);

      const endDateHijiriValidatorFns = [];
      // [
      //   minDateValidator(convertToDateFromHijiri(this.minHijiriEndDate)),
      //   maxDateValidator(convertToDateFromHijiri(this.maxHijiriEndDate))
      // ];
      if (this.engagementForm.get('periodEndDate')?.get('entryFormat')?.value === ViolationsEnum.DATE_HIJIRI) {
        endDateHijiriValidatorFns.push(Validators.required);
      }
      this.engagementForm?.get('periodEndDate')?.get('hijiri')?.setValidators(endDateHijiriValidatorFns);
    }
  }
  setCalenderType(entryFormat) {
    this.showDateInfoMsg = false;
    this.engagementForm.get('periodStartDate').get('gregorian').setValue(null);
    this.engagementForm.get('periodStartDate').get('hijiri').setValue(null);
    this.engagementForm.get('periodEndDate').get('gregorian').setValue(null);
    this.engagementForm.get('periodEndDate').get('hijiri').setValue(null);
    this.engagementForm.get('periodStartDate').markAsPristine();
    this.engagementForm.get('periodEndDate').markAsPristine();
    this.setDateTypes(entryFormat);
    this.engagementForm.get('periodStartDate').get('hijiri').markAsUntouched();
    this.engagementForm.get('periodEndDate').get('hijiri').markAsUntouched();
    this.engagementForm.get('periodStartDate').get('gregorian').markAsUntouched();
    this.engagementForm.get('periodEndDate').get('gregorian').markAsUntouched();
  }
  setDateTypes(entryFormat) {
    if (entryFormat === ViolationsEnum.DATE_HIJIRI) {
      this.engagementForm.get('calendarType').setValue(ViolationsEnum.DATE_HIJIRI);
      this.engagementForm.get('periodStartDate').get('hijiri').setValidators(Validators.required);
      this.engagementForm.get('periodStartDate').get('entryFormat').setValue(ViolationsEnum.DATE_HIJIRI);
      this.engagementForm.get('periodEndDate').get('entryFormat').setValue(ViolationsEnum.DATE_HIJIRI);
      this.engagementForm.get('periodStartDate').get('gregorian').setValidators(null);
      this.engagementForm.get('periodEndDate').get('hijiri').setValidators(Validators.required);
      this.engagementForm.get('periodEndDate').get('gregorian').setValidators(null);
    } else {
      this.engagementForm.get('calendarType').setValue(ViolationsEnum.DATE_GREGORIAN);
      this.engagementForm.get('periodStartDate').get('gregorian').setValidators(Validators.required);
      this.engagementForm.get('periodStartDate').get('entryFormat').setValue(ViolationsEnum.DATE_GREGORIAN);
      this.engagementForm.get('periodEndDate').get('entryFormat').setValue(ViolationsEnum.DATE_GREGORIAN);
      this.engagementForm.get('periodStartDate').get('hijiri').setValidators(null);
      this.engagementForm.get('periodEndDate').get('hijiri').setValidators(null);
      this.engagementForm.get('periodEndDate').get('gregorian').setValidators(Validators.required);
    }
  }
  // for limiting calendar
  setCancelEngDates() {
    if (getDateFormat(this.engagementDetails?.joiningDate?.entryFormat) === ViolationsEnum.DATE_HIJIRI) {
      this.isStartDateHijiri = true;
      this.engStartDateHijiri = convertToStringDDMMYYYY(this.engagementDetails?.joiningDate?.hijiri);
      this.getGregorianDate(parseToHijiri(this.engagementDetails?.joiningDate?.hijiri)).subscribe(res => {
        this.engStartDate = res?.gregorian;
      });
    } else {
      this.isStartDateHijiri = false;
      this.engStartDate = this.engagementDetails?.joiningDate?.gregorian;
      this.lookupService.getHijriDate(this.engagementDetails?.joiningDate?.gregorian).subscribe(res => {
        this.engStartDateHijiri = convertToStringDDMMYYYY(res?.hijiri);
      });
    }
    const endDate = this.engagementDetails?.leavingDate?.entryFormat
      ? this.engagementDetails?.leavingDate
      : this.engagementDetails?.joiningDate;
    if (getDateFormat(endDate?.entryFormat) === ViolationsEnum.DATE_HIJIRI) {
      this.isEndDateHijiri = true;
      this.engEndDateHijiri = convertToStringDDMMYYYY(endDate?.hijiri);
      this.getGregorianDate(parseToHijiri(endDate?.hijiri)).subscribe(res => {
        this.engEndDate = res?.gregorian;
      });
    } else {
      this.isEndDateHijiri = false;
      this.engEndDate = endDate?.gregorian;
      this.lookupService.getHijriDate(startOfDay(endDate?.gregorian)).subscribe(res => {
        this.engEndDateHijiri = convertToStringDDMMYYYY(res?.hijiri);
      });
    }
  }
  getGregorianDate(date) {
    return this.calendarService.getGregorianDate(hijiriToJSON(date));
  }
  onStartDateChange() {
    this.showDateInfoMsg = false;
    const engForm = this.engagementForm.get('periodStartDate');
    if (
      (engForm.get('entryFormat').value === ViolationsEnum.DATE_HIJIRI ||
        engForm.get('entryFormat').value === ViolationsEnum.DATE_GREGORIAN) &&
      this.engagementDetails.status !== ViolationContributorEnum.CANCELLED
    ) {
      this.engagementForm.get('periodEndDate.gregorian').setValue(null);
      this.engagementForm.get('periodEndDate.hijiri').setValue(null);
      this.engagementForm.get('periodEndDate.gregorian').markAsUntouched();
      this.engagementForm.get('periodEndDate.hijiri').markAsUntouched();
      if (this.engagementForm.get('calendarType').value === ViolationsEnum.DATE_HIJIRI) {
        //  = startOfDay(
        //   convertToDateFromHijiri(this.engagementForm.get('periodStartDate').get('hijiri').value)
        // );
        this.getGregorianDate(this.engagementForm.get('periodStartDate').get('hijiri').value).subscribe(res => {
          this.handleHijiriDate(
            res.gregorian,
            this.engagementForm.get('periodStartDate').get('hijiri').value,
            this.engagementForm.get('periodStartDate').get('hijiri')
          );
        });
      } else {
        const formStartDate: Date = this.engagementForm.get('periodStartDate').get('gregorian').value;
        this.handleDate(formStartDate, this.engagementForm);
      }
    }
  }
  handleHijiriDate(formStartDate: Date, formStartDateHijiri, formControl) {
    this.showDateInfoMsg = false;
    if (
      dayDifference(this.engStartDate, formStartDate) >= 0 &&
      (this.engagementDetails?.status === ViolationContributorEnum.LIVE ||
        dayDifference(this.engEndDate, formStartDate) <= 0)
    ) {
      if (this.engagementDetails?.status === ViolationContributorEnum.HISTORY) {
        this.engagementForm?.get('periodStartDate').get('hijiri').setValue(null);
      }
      this.showDateInfoMsg = true;
    } else if (dayDifference(this.engStartDate, formStartDate) < 0 && formControl.valid) {
      this.minHijiriEndDate = formStartDateHijiri;
      this.lookupService.getHijriDate(subtractDays(new Date(this.engStartDate), 1)).subscribe(res => {
        this.maxHijiriEndDate = convertToStringDDMMYYYY(res.hijiri);
      });
      this.maxGregEndDate = convertToStringDDMMYYYY(subtractDays(new Date(this.engStartDate), 1).toDateString());
    } else if (dayDifference(this.engEndDate, formStartDate) > 0 && formControl.valid) {
      this.minHijiriEndDate = formStartDateHijiri;
      this.maxHijiriEndDate = this.hijiriDate;
      this.maxGregEndDate = convertToStringDDMMYYYY(startOfDay(new Date()).toDateString());
    }
  }

  handleDate(formStartDate: Date, engForm) {
    this.showDateInfoMsg = false;
    if (
      dayDifference(this.engStartDate, formStartDate) >= 0 &&
      (this.engagementDetails?.status === ViolationContributorEnum.LIVE ||
        dayDifference(this.engEndDate, formStartDate) <= 0)
    ) {
      if (this.engagementDetails?.status === ViolationContributorEnum.HISTORY) {
        this.engagementForm?.get('periodStartDate').get('gregorian').setValue(null);
      }
      this.showDateInfoMsg = true;
      // add validation mesage
    } else if (
      dayDifference(this.engStartDate, formStartDate) < 0 &&
      engForm.get('periodStartDate').get('gregorian').valid
    ) {
      // enddate greg
      const endDateValidatorFns = [
        minDateValidator(formStartDate),
        maxDateValidator(subtractDays(new Date(this.engStartDate), 1)),
        Validators.required
      ];
      this.engagementForm.get('periodEndDate').get('gregorian').setValidators(endDateValidatorFns);

      this.minEndDate = moment(formStartDate).startOf('day').toDate();
      this.maxEndDate = subtractDays(moment(this.engStartDate).startOf('day').toDate(), 1);
    } else if (
      dayDifference(this.engEndDate, formStartDate) > 0 &&
      engForm.get('periodStartDate').get('gregorian').valid
    ) {
      // enddate greg
      const endDateValidatorFns = [minDateValidator(formStartDate), maxDateValidator(new Date()), Validators.required];
      this.engagementForm.get('periodEndDate').get('gregorian').setValidators(endDateValidatorFns);
      this.minEndDate = moment(formStartDate).startOf('day').toDate();
      this.maxEndDate = moment(new Date()).startOf('day').toDate();
    }
  }
  //after getting two days
  onDatesSubmit() {
    this.engagementForm?.get('periodStartDate').markAllAsTouched();
    this.engagementForm?.get('periodEndDate').get('hijiri').markAllAsTouched();
    this.engagementForm?.get('periodEndDate').markAllAsTouched();
  }

  selectContributionAmount() {
    this.engagementForm.get('contributionAmount').updateValueAndValidity();
  }
}
