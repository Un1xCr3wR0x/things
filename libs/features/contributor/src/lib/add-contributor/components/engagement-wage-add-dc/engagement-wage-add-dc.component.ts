/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CalendarService,
  CalendarTypeEnum,
  GosiCalendar,
  LookupService,
  Lov,
  LovList,
  convertToHijriFormat,
  greaterThanLessThanValidator,
  hijiriToJSON,
  maxDateValidator,
  minDateValidator,
  startOfDay,
  startOfMonth,
  startOfMonthHijiri
} from '@gosi-ui/core';
import { WageDetailFormBase } from '@gosi-ui/foundation/form-fragments';
import moment from 'moment-timezone';
import { gradeDetails } from '../../../shared/models/jobGradeDetails';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { ContributorConstants, ContributorTypesEnum, EngagementPeriod, HijiriConstant } from '../../../shared';

@Component({
  selector: 'cnt-engagement-wage-add-dc',
  templateUrl: './engagement-wage-add-dc.component.html',
  styleUrls: ['./engagement-wage-add-dc.component.scss']
})
export class EngagementWageAddDcComponent extends WageDetailFormBase implements OnInit, OnChanges {
  /**
   * Local Variables
   */
  contributorTypes = ContributorTypesEnum;
  engagementWageAddForm: FormGroup;
  mandatoryAlert = false;
  isEngagementWageAddFormVisible = true;
  wageSeparatorLimit = ContributorConstants.WAGE_SEPARATOR_LIMIT;
  typeGregorian = CalendarTypeEnum.GREGORIAN;
  typeHijira = CalendarTypeEnum.HIJRI;
  isHijiriFormat = false;
  minHijiriDate: string;
  maxHijiriDate: any;
  dateformat: string;
  dateForm: FormGroup;
  checkPrivate: boolean;
  setBasicWage: gradeDetails;
  ppaMinGregorianDate: Date;

  /**
   * Input Variables
   */
  @Input() joiningDate: Date = null;
  @Input() joiningDateHijiri: string;
  @Input() joiningDateEntryFormat: string;
  @Input() occupationList: LovList;
  @Input() engagementWageDetails: EngagementPeriod[] = [];
  @Input() isEditMode = false;
  @Input() disableAll = false;
  @Input() disableJoining = false;
  @Input() disableOccupation = false;
  @Input() minWageAddDate: Date;
  @Input() maxWageAddDate: Date;
  @Input() maxHijiriLeavingDate: string;
  @Input() isUpdate = false;
  @Input() engagementWageEntryEditDetails;
  @Input() isPrivate: boolean;
  @Input() contributorType: string;
  @Input() isDeleteWageSection: boolean;
  @Input() isAddition: boolean;
  @Input() leavingDate: Date;
  @Input() resetDateForm: boolean;
  @Input() ppaEstablishment: boolean;
  @Input() jobClassLov: Lov[] = [];
  @Input() jobRankLov: Lov[] = [];
  @Input() jobGradeLov: Lov[] = [];
  @Input() jobGradeApiResponse: gradeDetails[];
  @Input() hijiriDateConst: HijiriConstant;
  @Input() disabledOnEdit: boolean;
  @Input() hideOccupation = false;
  @Input() wageStartDate: GosiCalendar = new GosiCalendar();

  /**
   * output Variables
   */
  @Output() addWageEvent: EventEmitter<null> = new EventEmitter();
  @Output() cancelWageEvent: EventEmitter<null> = new EventEmitter();
  @Output() wageUpdateEvent: EventEmitter<Object> = new EventEmitter(); // emit value period edit in validator screen
  @Output() cancelWageEditEvent: EventEmitter<null> = new EventEmitter();
  @Output() resetDateFormEvent: EventEmitter<null> = new EventEmitter();
  @Output() resetisDeleteWageSection: EventEmitter<null> = new EventEmitter();
  @Output() jobClassListChange: EventEmitter<Lov> = new EventEmitter();
  @Output() jobRankListChange: EventEmitter<Lov> = new EventEmitter();
  @Output() disableBasicWagePpa: EventEmitter<boolean> = new EventEmitter();
  @Output() editWagePeriodOnBoolean: EventEmitter<boolean> = new EventEmitter();

  /**
   * Method to initialize EngagementWageAddDcComponent
   * @param fb
   */
  constructor(
    public fb: FormBuilder,
    readonly calendarService: CalendarService,
    readonly lookupService: LookupService
  ) {
    super(fb);
  }

  /**
   * This method handles the initialization tasks.
   * @memberof EngagementWageAddDcComponent
   */
  ngOnInit() {
    // this.jobClassListChange.emit(new Lov());
    // this.jobRankListChange.emit(new Lov());
    this.maxHijiriDate = this.ppaEstablishment
      ? this.hijiriDateConst?.ppaMaxHijirDate
      : this.hijiriDateConst?.gosiMaxHijiriDate;
    if (!this.dateForm) {
      this.dateForm = this.createDateTypeForm();
    }
    if (!this.engagementWageAddForm) {
      // on period edit form with edit data will be cleared without this check.
      this.engagementWageAddForm = this.createWageDetailsItem();
      this.engagementWageAddForm.get('startDate.hijiri').setValidators([Validators.required]);
      this.engagementWageAddForm.get('startDate.hijiri').updateValueAndValidity();
      this.engagementWageAddForm.get('startDate.entryFormat').setValue(this.typeGregorian);
      if (this.disableOccupation) {
        this.engagementWageAddForm.get('occupation').disable();
      }
    }
    if (this.contributorType === this.contributorTypes.SAUDI) {
      this.checkPrivate = this.ppaEstablishment ? true : this.isPrivate ? true : false;
    }
    this.detectChanges();
  }

  /**Method to handle tasks when input variable changes */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.joiningDate && changes.joiningDate.currentValue) {
      // this.jobClassListChange.emit(new Lov());
      // this.jobRankListChange.emit(new Lov());
      this.setWageDate(this.joiningDate);
    }
    if (changes.joiningDateHijiri && changes.joiningDateHijiri.currentValue) {
      // this.jobClassListChange.emit(new Lov());
      // this.jobRankListChange.emit(new Lov());
      this.setWageDateHijiri(this.joiningDateHijiri);
    }
    if (changes.joiningDateEntryFormat && changes.joiningDateEntryFormat.currentValue) {
      if (this.joiningDateEntryFormat === this.typeHijira) {
        this.isHijiriFormat = true;
        this.dateForm.get('dateFormat.english').setValue(this.typeHijira);
        this.dateformat = this.typeHijira;
      } else {
        this.isHijiriFormat = false;
        this.dateForm.get('dateFormat.english').setValue(this.typeGregorian);
        this.dateformat = this.typeGregorian;
      }
      this.setEntryFormat(this.joiningDateEntryFormat);
      // this.jobClassListChange.emit(new Lov());
      // this.jobRankListChange.emit(new Lov());
    }
    if (changes.minWageAddDate && changes.minWageAddDate.currentValue) {
      this.ppaMinGregorianDate =
        this.minWageAddDate < this.hijiriDateConst?.ppaMinGregorianDate
          ? startOfMonth(this.hijiriDateConst?.ppaMinGregorianDate)
          : this.minWageAddDate;
      if (
        this.dateformat === this.typeGregorian ||
        this.isDeleteWageSection ||
        this.engagementWageDetails.length === 0
      ) {
        this.setHijiriMinWageAddDate(this.minWageAddDate);
        if (this.isDeleteWageSection) {
          this.resetisDeleteWageSection.emit();
        }
      }
    }
    if (changes.maxWageAddDate && changes.maxWageAddDate.currentValue) {
      if (this.isDeleteWageSection) {
        this.setHijiriMaxDate(this.maxWageAddDate);
      }
    }
    if (changes.engagementWageEntryEditDetails && changes.engagementWageEntryEditDetails.currentValue) {
      this.bindToWageEntryForm(changes.engagementWageEntryEditDetails.currentValue.wage);
    }
    if (changes.occupationList && changes.occupationList.currentValue) {
      if (
        (this.engagementWageAddForm?.get('occupation') as FormGroup)?.getRawValue()?.english &&
        this.occupationList?.items
      ) {
        const item = new Lov();
        item.value = (this.engagementWageAddForm.get('occupation') as FormGroup).getRawValue();
        if (
          !this.occupationList.items.find(
            item1 => item1.value.arabic === item?.value?.arabic && item1.value.english === item?.value?.english
          )
        ) {
          item.disabled = true;
          this.occupationList.items.push(item);
        }
      }
    }
    if (changes.resetDateForm) {
      if (this.resetDateForm) {
        if (this.joiningDateEntryFormat === this.typeHijira) {
          this.isHijiriFormat = true;
          this.dateForm.get('dateFormat.english').setValue(this.typeHijira);
          this.dateformat = this.typeHijira;
          this.setWageDateHijiri(this.joiningDateHijiri);
        } else {
          this.isHijiriFormat = false;
          this.dateForm.get('dateFormat.english').setValue(this.typeGregorian);
          this.dateformat = this.typeGregorian;
        }
        this.engagementWageAddForm.get('startDate.hijiri').setValidators([Validators.required]);
        this.setEntryFormat(this.joiningDateEntryFormat);
        this.resetDateFormEvent.emit();
        // For ppaestablishment basic wage field should be disabled on reset
        if (this.ppaEstablishment) this.engagementWageAddForm.controls['wage'].get('basicWage').disable();
      }
    }
    if (changes.isAddition) {
      this.setHijiriMinWageAddDate(this.minWageAddDate);
    }
    if (changes.jobClassLov) {
      this.jobClassLov = changes.jobClassLov.currentValue;
      // if (
      //   this.engagementWageAddForm.getRawValue().jobClassName?.english === this.engagementWageEntryEditDetails?.wage.jobClassName?.english
      // ) {
      //   this.jobClassListChange.emit(
      //     this.jobClassLov.filter(
      //       jobClass => jobClass.value.english === this.engagementWageAddForm.getRawValue().jobClassName?.english
      //     )[0]
      //   );
      // }
    }
    if (changes.jobRankLov) {
      this.jobRankLov = changes.jobRankLov.currentValue;
      // if (this.engagementWageAddForm.getRawValue().jobRankName?.english) {
      //   this.jobRankListChange.emit(
      //     this.jobRankLov.filter(jobRank => jobRank.value.english === this.engagementWageAddForm.getRawValue().jobRankName?.english)[0]
      //   );
      // }
    }
    if (changes.wageStartDate && changes.wageStartDate.currentValue) {
      this.wageStartDate = changes?.wageStartDate?.currentValue;
    }
  }

  /**Method to set start date */
  setWageDate(joiningDate: Date) {
    if (joiningDate && this.engagementWageAddForm) {
      const formatJoiningDate = startOfDay(joiningDate);
      this.engagementWageAddForm.get('startDate.gregorian').setValue(formatJoiningDate);
      this.engagementWageAddForm.get('startDate.entryFormat').setValue(this.joiningDateEntryFormat);
    }
  }

  detectChanges(): void {
    this.engagementWageAddForm
      .get('startDate.hijiri')
      .valueChanges.pipe(
        filter(() => this.engagementWageAddForm.get('startDate.hijiri').valid),
        distinctUntilChanged()
      )
      .subscribe(() => this.onStartDateHijChange());
  }

  onStartDateHijChange() {
    if (
      !this.engagementWageAddForm.get('startDate.gregorian').value &&
      this.dateForm.get('dateFormat.english').value == this.typeHijira &&
      this.engagementWageAddForm.get('startDate.hijiri').value
    ) {
      this.lookupService
        .getGregorianDate(convertToHijriFormat(this.engagementWageAddForm.get('startDate.hijiri').value))
        .subscribe(res => {
          this.engagementWageAddForm.get('startDate.gregorian').setValue(res.gregorian);
        });
    }
  }

  /**
   * This method is to createwage details form
   * @memberof EngagementWageAddDcComponent
   */
  createWageDetailsItem() {
    return super.createWageDetailsForm(this.ppaEstablishment);
  }

  /**
   * This method is to calculate total wage onblur
   * @memberof EngagementWageAddDcComponent
   */
  onBlur(wageDetail: FormGroup) {
    super.calculateTotalWage(wageDetail);
  }

  /**
   * This method is to add wage period
   * @memberof EngagementWageAddDcComponent
   */
  addWagePeriod() {
    if (
      this.dateformat == this.typeHijira ||
      this.engagementWageAddForm.get('startDate.entryFormat').value == this.typeHijira
    ) {
      if (this.engagementWageAddForm.get('startDate').get('hijiri').value) {
        this.engagementWageAddForm.get('startDate.entryFormat').setValue(this.typeHijira);
        let actualDate = convertToHijriFormat(this.engagementWageAddForm.get('startDate').get('hijiri').value);
        const dateArr = this.engagementWageAddForm.get('startDate').get('hijiri').value.split('/');
        const year = parseInt(dateArr[1], null) < 12 ? parseInt(dateArr[2], null) : parseInt(dateArr[2], null) + 1;
        const month = parseInt(dateArr[1], null) < 12 ? parseInt(dateArr[1], null) + 1 : 1;
        this.minHijiriDate = !actualDate
          ? this.minHijiriDate
          : month < 10
          ? '01' + '/' + '0' + month + '/' + year
          : '01' + '/' + month + '/' + year;
        /**
         * For solving invalid engagement issue due to month picker in hijiri calender
         * start date become 1st day of joining month when it changed to check the change
         * following condition used and reset the startdate to joining date
         */
        if (this.joiningDateHijiri) {
          const jArr = this.joiningDateHijiri.split('/');
          if (
            dateArr[1] == jArr[1] &&
            dateArr[2] == jArr[2] &&
            dateArr[0] != jArr[0] &&
            parseInt(dateArr[0]) < parseInt(jArr[0])
          ) {
            actualDate = convertToHijriFormat(this.joiningDateHijiri);
            this.engagementWageAddForm.get('startDate').get('hijiri').setValue(this.joiningDateHijiri);
          }
        }
        this.calendarService.getGregorianDate(actualDate).subscribe(
          res => {
            this.engagementWageAddForm.get('startDate').get('gregorian').setValue(res.gregorian);
            if (this.engagementWageAddForm.valid) {
              this.mandatoryAlert = false;
              this.isEngagementWageAddFormVisible = false;
              this.addWageEvent.emit(this.engagementWageAddForm.getRawValue());
            } else {
              this.engagementWageAddForm.markAllAsTouched();
              this.mandatoryAlert = true;
            }
          },
          err => {
            this.engagementWageAddForm.markAllAsTouched();
            this.mandatoryAlert = true;
          }
        );
      } else {
        this.engagementWageAddForm.markAllAsTouched();
        this.mandatoryAlert = true;
      }
    } else {
      this.engagementWageAddForm.get('startDate.entryFormat').setValue(this.typeGregorian);
      this.engagementWageAddForm.get('startDate.hijiri').clearValidators();
      this.engagementWageAddForm.get('startDate.hijiri').updateValueAndValidity();
      if (this.engagementWageAddForm.valid) {
        this.mandatoryAlert = false;
        this.isEngagementWageAddFormVisible = false;
        this.addWageEvent.emit(this.engagementWageAddForm.getRawValue());
      } else {
        this.engagementWageAddForm.markAllAsTouched();
        this.mandatoryAlert = true;
      }
    }
  }

  /**
   * This method is to cancel wage period and close the form
   * @memberof EngagementWageAddDcComponent
   */
  cancelAddWagePeriod() {
    this.mandatoryAlert = false;
    this.engagementWageAddForm.markAsUntouched();
    this.engagementWageAddForm.markAsPristine();
    this.engagementWageAddForm.reset();
    this.isEngagementWageAddFormVisible = false;
    this.cancelWageEvent.emit();
  }
  /**
   * This method is to clear wage entry form
   * @memberof EmploymentWageDetailsDcComponent
   */
  resetWageEntryForm() {
    this.engagementWageAddForm.reset(this.createWageDetailsItem().getRawValue());
  }

  /**Method to update wage on edit */
  updateWageDetails() {
    if (this.dateForm.get('dateFormat.english').value === CalendarTypeEnum.GREGORIAN) {
      this.engagementWageAddForm.get('startDate.hijiri').clearValidators();
      this.engagementWageAddForm.get('startDate.hijiri').updateValueAndValidity({ emitEvent: false });
    }
    if (this.dateForm.get('dateFormat.english').value === CalendarTypeEnum.HIJRI) {
      this.engagementWageAddForm.get('startDate.gregorian').clearValidators();
      this.engagementWageAddForm.get('startDate.gregorian').updateValueAndValidity({ emitEvent: false });
    }
    this.engagementWageAddForm.get('startDate.entryFormat').setValue(this.dateForm.get('dateFormat.english').value);
    if (this.engagementWageAddForm.valid) {
      this.editWagePeriodOnBoolean.emit(false);
      this.mandatoryAlert = false;
      const getFormData = this.engagementWageAddForm.getRawValue();
      this.wageUpdateEvent.emit({
        wage: getFormData,
        index: this.engagementWageEntryEditDetails.index
      });
    } else {
      this.engagementWageAddForm.markAllAsTouched();
      this.mandatoryAlert = true;
    }
  }

  /**Method to emit cancel action */
  cancelWageEdit() {
    this.cancelWageEditEvent.emit();
  }

  /**
   * This method is to bind values to wageentryform
   */
  bindToWageEntryForm(wageDetails: EngagementPeriod) {
    this.engagementWageAddForm = this.createWageDetailsItem();
    this.dateForm = this.createDateTypeForm();
    if (this.disableOccupation) {
      this.engagementWageAddForm.get('occupation').disable();
    }
    Object.keys(wageDetails).forEach(key => {
      if (key === 'startDate') {
        this.engagementWageAddForm.get('startDate').get('gregorian').setValue(new Date(wageDetails[key].gregorian));
        const hdate =
          wageDetails[key]?.hijiri[4] != '-'
            ? wageDetails[key]?.hijiri
            : convertToHijriFormat(wageDetails[key]?.hijiri);
        this.engagementWageAddForm.get('startDate').get('hijiri').setValue(hdate);
        this.engagementWageAddForm.get('startDate').get('entryFormat').setValue(wageDetails[key].entryFormat);
        if (wageDetails[key].entryFormat === this.typeHijira) {
          this.isHijiriFormat = true;
          this.dateForm.get('dateFormat.english').setValue(this.typeHijira);
        } else {
          this.isHijiriFormat = false;
          this.dateForm.get('dateFormat.english').setValue(this.typeGregorian);
        }
      } else if (key === 'endDate' && wageDetails?.endDate?.gregorian) {
        this.engagementWageAddForm.get('endDate').get('gregorian').setValue(new Date(wageDetails[key].gregorian));
      } else if (key === 'occupation') {
        this.engagementWageAddForm.get('occupation').setValue(wageDetails[key]);
      } else if (key === 'wage') {
        this.engagementWageAddForm.get('wage').patchValue(wageDetails[key]);
        this.engagementWageAddForm.controls['wage'].get('basicWage').updateValueAndValidity();
        this.engagementWageAddForm.controls['wage'].get('basicWage').markAsTouched();
      } else if (key === 'jobClassName') {
        this.engagementWageAddForm.get('jobClassName').setValue(wageDetails[key]);
      } else if (key === 'jobRankName') {
        // this.jobRankListChange.emit(
        //   this.jobRankLov.filter(jobRank => jobRank.value.english === wageDetails[key].english)[0]
        // );
        this.engagementWageAddForm.get('jobRankName').setValue(wageDetails[key]);
      } else if (key === 'jobGradeName') {
        this.engagementWageAddForm.get('jobGradeName').setValue(wageDetails[key]);
      } else if (key === 'jobClassCode') {
        this.engagementWageAddForm.get('jobClassCode').setValue(wageDetails[key]);
      } else if (key === 'jobRankCode') {
        this.engagementWageAddForm.get('jobRankCode').setValue(wageDetails[key]);
      } else if (key === 'jobGradeCode') {
        this.engagementWageAddForm.get('jobGradeCode').setValue(wageDetails[key]);
      }
      if (this.jobGradeLov && this.jobGradeLov.length > 0 && key === 'jobGradeCode') {
        const gradeData = this.jobGradeLov.find(grade => grade.code === wageDetails[key]);
        this.setWageDetailsToForm(gradeData);
      }
    });
    this.patchValues(wageDetails);
    this.minWageAddDate = wageDetails.startDate.gregorian
      ? moment(wageDetails.startDate.gregorian).startOf('month').toDate()
      : new Date();
    this.wageStartDate = wageDetails?.startDate;
    this.ppaMinGregorianDate =
      this.minWageAddDate < this.hijiriDateConst?.ppaMinGregorianDate
        ? startOfMonth(this.hijiriDateConst?.ppaMinGregorianDate)
        : this.minWageAddDate;
    this.maxWageAddDate = wageDetails.endDate?.gregorian
      ? moment(wageDetails.endDate.gregorian).endOf('month').toDate()
      : new Date();
    this.setHijiriMinWageAddDate(wageDetails.startDate.gregorian, true);
    this.setHijiriMaxDate(wageDetails.endDate?.gregorian);
    this.startDateFormControl.setValidators([
      Validators.required,
      minDateValidator(this.minWageAddDate),
      maxDateValidator(this.maxWageAddDate)
    ]);
    this.engagementWageAddForm.updateValueAndValidity();
  }
  patchValues(wageDetails) {
    if (
      wageDetails &&
      this.engagementWageAddForm &&
      this.jobClassLov.length > 0 &&
      this.jobRankLov.length > 0 &&
      this.jobGradeLov.length > 0
    ) {
      this.engagementWageAddForm.get('jobClassName').setValue(wageDetails?.jobClassName);
      this.engagementWageAddForm.get('jobRankName').setValue(wageDetails?.jobRankName);
      this.engagementWageAddForm.get('jobGradeName').setValue(wageDetails?.jobGradeName);
      this.engagementWageAddForm.get('jobClassCode').setValue(wageDetails?.jobClassCode);
      this.engagementWageAddForm.get('jobRankCode').setValue(wageDetails?.jobRankCode);
      this.engagementWageAddForm.get('jobGradeCode').setValue(wageDetails?.jobGradeCode);
      const gradeData = this.jobGradeLov.find(grade => grade.code === wageDetails?.jobGradeCode);
      this.setWageDetailsToForm(gradeData);
    } else {
      setTimeout(() => {
        this.patchValues(wageDetails);
      }, 500);
    }
  }
  setWageDetailsToForm(gradeData: Lov) {
    const event = this.jobGradeLov.find(jobGrade => jobGrade.code === gradeData?.code);
    const setBasicWage = this.jobGradeApiResponse?.find(item => parseInt(item?.jobGradeCode) === event?.code);
    if (setBasicWage && setBasicWage?.minSalary === setBasicWage?.maxSalary) {
      this.engagementWageAddForm.controls['wage'].get('basicWage').disable();
    } else {
      this.engagementWageAddForm?.controls['wage'].get('basicWage').enable();
      this.engagementWageAddForm?.controls['wage']
        ?.get('basicWage')
        ?.setValidators([
          Validators.required,
          greaterThanLessThanValidator(setBasicWage?.minSalary, setBasicWage?.maxSalary)
        ]);
    }
    this.engagementWageAddForm?.controls['wage']?.get('basicWage')?.updateValueAndValidity();
  }

  /**Getter for start date form control */
  private get startDateFormControl(): FormControl {
    return this.engagementWageAddForm.get('startDate').get('gregorian') as FormControl;
  }

  // handle hijiri
  setWageDateHijiri(joiningDate: string) {
    if (joiningDate && this.engagementWageAddForm) {
      this.engagementWageAddForm.get('startDate.hijiri').setValue(joiningDate);
      this.engagementWageAddForm.get('startDate.entryFormat').setValue(this.joiningDateEntryFormat);
    }
  }
  setEntryFormat(entryFormat) {
    this.engagementWageAddForm.get('startDate.entryFormat').setValue(entryFormat);
  }

  setHijiriMinWageAddDate(minDate: Date, isEdit = false) {
    if (this.wageStartDate?.entryFormat === CalendarTypeEnum?.HIJRI && this.wageStartDate?.hijiri) {
      isEdit
        ? (this.minHijiriDate = this.wageStartDate?.hijiri)
        : this.calendarService?.addToHijiriDate(this.wageStartDate?.hijiri, 0, 1, 0).subscribe(res => {
            this.minHijiriDate = startOfMonthHijiri(convertToHijriFormat(res.hijiri));
          });
    } else if (minDate) {
      moment(minDate).isSameOrAfter(this.hijiriDateConst?.ppaMinGregorianDate) && this.ppaEstablishment
        ? this.calendarService
            .addToHijiriDate(hijiriToJSON(this.hijiriDateConst?.ppaMaxHijirDate), 0, 1, 0)
            .subscribe(res => {
              this.minHijiriDate = startOfMonthHijiri(convertToHijriFormat(res.hijiri));
            })
        : this.lookupService.getHijriDate(minDate).subscribe(res => {
            this.minHijiriDate = convertToHijriFormat(res.hijiri);
          });
    }
  }

  setHijiriMaxDate(maxDate: Date) {
    const inputDate = this.ppaEstablishment
      ? new Date(this.hijiriDateConst.ppaMaxHjiriDateInGregorian)
      : new Date(this.hijiriDateConst?.gosiMaxHijiriNextDateInGregorian); //to check maxhijiri date less than 2018
    if (maxDate == null || maxDate == undefined) {
      this.maxHijiriDate = this.ppaEstablishment
        ? this.hijiriDateConst?.ppaMaxHijirDate
        : this.hijiriDateConst?.gosiMaxHijiriDate;
    }
    if (maxDate < moment(inputDate).toDate() || moment(inputDate).toDate() > moment(maxDate).toDate()) {
      if (maxDate)
        this.lookupService.getHijriDate(maxDate).subscribe(res => {
          if (res?.hijiri) {
            this.maxHijiriDate = convertToHijriFormat(res.hijiri);
            //console.log("subscribe",this.maxHijiriDate);
          }
        });
      //console.log("after",this.maxHijiriDate);
    }
  }

  /** Method to create calendar type form */
  createDateTypeForm() {
    return this.fb.group({
      dateFormat: this.fb.group({
        english: [this.typeGregorian, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [this.typeHijira, { validators: Validators.required, updateOn: 'blur' }]
      })
    });
  }

  /** Method to switch calendar type */
  switchCalendarType(type) {
    this.dateForm.get('dateFormat.english').setValue(type);
    this.engagementWageAddForm.get('startDate')?.get('gregorian').setValue(null);
    this.engagementWageAddForm.get('startDate')?.get('hijiri').setValue(null);
    this.isHijiriFormat = !this.isHijiriFormat;
    this.dateformat = type;
    this.engagementWageAddForm.get('startDate.hijiri').setValidators([Validators.required]);
    this.engagementWageAddForm.get('startDate.hijiri').updateValueAndValidity();
    if (
      !this.engagementWageAddForm.get('startDate.gregorian').value &&
      this.dateForm.get('dateFormat.english').value == this.typeHijira &&
      this.engagementWageAddForm.get('startDate.hijiri').value
    ) {
      this.lookupService
        .getGregorianDate(convertToHijriFormat(this.engagementWageAddForm.get('startDate.hijiri').value))
        .subscribe(res => {
          this.engagementWageAddForm.get('startDate.gregorian').setValue(res.gregorian);
        });
    }
    if (this.dateForm.get('dateFormat.english').value == this.typeGregorian) {
      this.engagementWageAddForm.get('startDate.gregorian').setValidators([Validators.required]);
      this.engagementWageAddForm.get('startDate.gregorian').updateValueAndValidity();
    }
  }

  /**Method to select jobClass */
  selectJobClass(data: Lov) {
    this.engagementWageAddForm.get('jobClassCode').setValue(data?.code);
    this.jobClassListChange.emit(data);
    this.engagementWageAddForm.get('jobRankName').reset();
    this.engagementWageAddForm.get('jobGradeName').reset();
    this.resetBasicTotalWage();
    this.jobRankLov = [];
    this.jobGradeLov = [];
    this.engagementWageAddForm.controls['wage'].get('basicWage').disable();
  }

  /**Method to select jobRank */
  selectJobRank(data: Lov) {
    this.engagementWageAddForm.get('jobRankCode').setValue(data?.code);
    this.jobRankListChange.emit(data);
    this.engagementWageAddForm.get('jobGradeName').reset();
    this.resetBasicTotalWage();
    this.jobGradeLov = [];
    this.engagementWageAddForm.controls['wage'].get('basicWage').disable();
  }

  resetBasicTotalWage() {
    this.engagementWageAddForm.get('wage').get('basicWage').setValue(parseFloat('0.00').toFixed(2));
    this.engagementWageAddForm.get('wage').get('totalWage').setValue(parseFloat('0.00').toFixed(2));
  }

  /** Method to select jobGrade */
  selectJobGrade(event: Lov) {
    this.engagementWageAddForm.get('jobGradeCode').setValue(event?.code);
    this.resetBasicTotalWage();
    this.setBasicWage = this.jobGradeApiResponse?.find(item => parseInt(item?.jobGradeCode) === event?.code);
    if (this.setBasicWage?.minSalary === this.setBasicWage?.maxSalary) {
      this.engagementWageAddForm.controls['wage']
        ?.get('basicWage')
        ?.setValue((this.setBasicWage?.minSalary).toFixed(2));
      this.engagementWageAddForm.controls['wage']
        ?.get('totalWage')
        ?.setValue((this.setBasicWage?.minSalary).toFixed(2));
      this.engagementWageAddForm.controls['wage'].get('basicWage').disable();
      this.setBasicWageEnabled(true);
    } else {
      this.haveMinMaxBasicWage();
    }
  }

  haveMinMaxBasicWage() {
    this.engagementWageAddForm.controls['wage']?.get('basicWage')?.setValue((this.setBasicWage?.minSalary).toFixed(2));
    this.engagementWageAddForm.controls['wage']?.get('totalWage')?.setValue((this.setBasicWage?.minSalary).toFixed(2));
    this.engagementWageAddForm.controls['wage']
      ?.get('basicWage')
      ?.setValidators([
        Validators.required,
        greaterThanLessThanValidator(this.setBasicWage?.minSalary, this.setBasicWage?.maxSalary)
      ]);
    this.engagementWageAddForm.controls['wage']?.get('basicWage')?.updateValueAndValidity();
    this.engagementWageAddForm.controls['wage'].get('basicWage').enable();
    this.setBasicWageEnabled(false);
  }

  setBasicWageEnabled(isEnabled: boolean) {
    this.disableBasicWagePpa.emit(isEnabled);
  }
}
