/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  CalendarService,
  CalendarTypeEnum,
  GosiCalendar,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  Occupation,
  OccupationList,
  addMonths,
  greaterThanLessThanValidator,
  parseToHijiriFromApi,
  startOfMonth
} from '@gosi-ui/core';
import { ContributorConstants, ContributorService, HijiriConstant, MonthYearLabel, PeriodChangeDetails, SystemParameter, YesOrNo } from '@gosi-ui/features/contributor/lib/shared';
import { EngagementPeriod } from '@gosi-ui/features/contributor/lib/shared/models';
import { gradeDetails } from '@gosi-ui/features/contributor/lib/shared/models/jobGradeDetails';
import { WageDetailFormBase } from '@gosi-ui/foundation/form-fragments';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';


@Component({
  selector: 'cnt-wage-breakup-dc',
  templateUrl: './wage-breakup-dc.component.html',
  styleUrls: ['./wage-breakup-dc.component.scss']
})
export class WageBreakupDcComponent extends WageDetailFormBase implements OnInit, OnChanges {
  /** Local variables. */
  lang = 'en';
  wageForm: FormGroup;
  editMode = false;
  startYear: number;
  endYear: number;
  startMonthLabel: string;
  endMonthLabel: string;
  isPeriodActive = false;
  isBeyondDateLimit = false;
  splittedPeriod: EngagementPeriod;
  modalRef: BsModalRef;
  isDelete: boolean;
  disableOccupation = false;
  disablePPAData = false;
  disableWage = false;
  disableContributorAbroad = false;
  disableEdit = false;
  isAppPublic = false;
  wageSeparatorLimit = ContributorConstants.WAGE_SEPARATOR_LIMIT;
  dateForm: FormGroup;
  typeGregorian = CalendarTypeEnum.GREGORIAN;
  typeHijira = CalendarTypeEnum.HIJRI;
  maxHijiriDate = '13/04/1439';
  minHijiriDate: string;
  minGregorianDate: Date;
  maxGregorianDate: Date;
  startMonthLabelHijiri: GosiCalendar;
  endMonthLabelHijiri: GosiCalendar;

  /** Input variables. */
  @Input() selectedPeriod: EngagementPeriod;
  @Input() isPeriodSplit = false;
  @Input() occupationList: OccupationList;
  @Input() yesOrNoList: LovList;
  @Input() isWageVerified: boolean;
  @Input() parentForm: FormGroup;
  @Input() systemParameter: SystemParameter;
  @Input() periodIndex: number;
  @Input() validatorEdit: boolean;
  @Input() changesInPeriod: PeriodChangeDetails[];
  @Input() activePeriodIndex: number;
  @Input() disableSplit: boolean;
  @Input() isSaudiPerson: boolean;
  @Input() isProactive: boolean;
  @Input() isGccEstblishment = false;
  @Input() totalPeriods: number;
  @Input() periodJoiningDate: Date;
  @Input() checkPrivate: boolean;
  @Input() ppaIndicator: boolean;
  @Input() wageDetails: any;
  @Input() disableFlag: boolean=true;

  @Input() resetDateForm: boolean;
  @Input() ppaEstablishment: boolean;
  jobClassLov: Lov[] = [];
  jobRankLov: Lov[] = [];
  jobGradeLov: Lov[] = [];
  jobGradeApiResponse: gradeDetails[];
  isHijritype: boolean;

  @Input() hijiriDateConst: HijiriConstant;
  @Input() disabledOnEdit: boolean;
  /** Output variables. */
  @Output() disableSplitChange: EventEmitter<boolean> = new EventEmitter();
  @Output() saveWage: EventEmitter<number> = new EventEmitter();
  @Output() split: EventEmitter<number> = new EventEmitter();
  @Output() delete: EventEmitter<number> = new EventEmitter();
  @Output() periodSelect: EventEmitter<number> = new EventEmitter();
  @Output() cancelEdit: EventEmitter<null> = new EventEmitter();

  @ViewChild('periodSplitModal', { static: true })
  periodSplitModal: TemplateRef<HTMLElement>;
  mandatoryAlert: boolean = false;
  jobScaleList$: Observable<LovList>;
  civilianJobScale: number;
  minDateWageAdd: any;
  maxWageAddDate: any;
  jobClassCivilTypeLov = new Lov();
  jobRankListLov = new Lov();
  sysDate: GosiCalendar;
  /**
   * Creates an instance of WageBreakupDcComponent
   * @param fb form builder
   */
  constructor(
    fb: FormBuilder,
    readonly modalService: BsModalService,
    readonly calendarService: CalendarService,
    readonly contributorService: ContributorService,
    readonly lookUpService: LookupService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super(fb);
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
  }

  /** Initialises the component. */
  ngOnInit(): void {
        this.language.subscribe(language => {
      this.lang = language;
    });
    this.disableEdit = this.disableEdit ? true : this.disableEdit;
    // this.getJobLookUps();

    if (this.wageDetails?.startDate?.entryFormat == this.typeGregorian) {
      this.isHijritype = false;
    } else {
      this.isHijritype = true;
    }
    this.minDateWageAdd = moment(this.wageDetails?.startDate?.gregorian)
      .startOf('month')
      .clone()
      .add(1, 'months')
      .toDate();

    this.maxWageAddDate = this.wageDetails?.endDate?.gregorian
      ? moment(this.wageDetails?.endDate?.gregorian).endOf('month').toDate()
      : new Date();
  }

  /**
   * Method to handle the changes in the input variables.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedPeriod && changes.selectedPeriod.currentValue) {
      this.initialiseWagePeriodView();
      if (!changes.systemParameter && this.systemParameter) this.checkPeriodBeyondLimit();
    }

    if (changes.isWageVerified && changes.isWageVerified.currentValue) {
      if (this.isWageVerified) this.editMode = false;
    }

    if (changes.systemParameter && changes.systemParameter.currentValue) {
      if (this.selectedPeriod) this.checkPeriodBeyondLimit();
    }

    if (changes.changesInPeriod && changes.changesInPeriod.currentValue) this.identifyChangesInPeriod();

    if (changes.activePeriodIndex && changes.activePeriodIndex.currentValue !== undefined) this.togglePeriodDisable();

    if (changes.isSaudiPerson || changes.isProactive) this.setActionBasedOnContributor(changes);

    if (changes.isGccEstblishment?.currentValue) this.disableContributorAbroad = true;
    if (changes.wageDetails && changes.wageDetails.currentValue) {
      this.wageDetails = changes.wageDetails.currentValue;
      if (this.ppaIndicator && this.selectedPeriod)
        this.getJobLookUps(this.selectedPeriod?.jobClassCode, this.selectedPeriod?.jobRankCode);
      this.patchValues(this.selectedPeriod);
    }
  }
  //Method to initialize the period view on changes
  initialiseWagePeriodView() {
    this.wageForm = this.createWageDetailsForm(this.ppaIndicator);
    this.setPeriodDates();
    if (this.isPeriodSplit === true && !this.selectedPeriod.wageDetailsUpdated && !this.validatorEdit)
      this.editWage(false);
  }
  //Method to handle the changes in the input variables to set action based  on contributor
  setActionBasedOnContributor(changes: SimpleChanges) {
    if (changes.isSaudiPerson && changes.isSaudiPerson.currentValue === false) this.disableContributorAbroad = true;
    if (changes.isProactive && changes.isProactive.currentValue) {
      this.disablePPAData = true;
      this.disableOccupation = true;
    }
  }

  /** To check engagment period is before the max limited date. */
  checkPeriodBeyondLimit() {
    if (this.systemParameter.CHNG_ENG_MAX_BACKDATED_PERIOD_START_DATE && this.selectedPeriod.endDate) {
      const periodEndDate = new Date(this.selectedPeriod.endDate.gregorian);
      const maxLimitDate = new Date(this.systemParameter.CHNG_ENG_MAX_BACKDATED_PERIOD_START_DATE);
      if (periodEndDate >= maxLimitDate) {
        this.isBeyondDateLimit = false;
      } else {
        this.isBeyondDateLimit = true;
        this.disableEdit = true;
      }
    }
  }
  /** Method to set dates for wage period. */
  setPeriodDates() {
    this.startMonthLabel =
      Object.values(MonthYearLabel)[moment(this.selectedPeriod.startDate.gregorian).toDate().getMonth()];
    this.startYear = moment(this.selectedPeriod.startDate.gregorian).toDate().getFullYear();
    this.minGregorianDate = startOfMonth(addMonths(moment(this.selectedPeriod.startDate.gregorian).toDate(), 1));
    if (this.selectedPeriod.endDate && this.selectedPeriod.endDate.gregorian) {
      this.isPeriodActive = false;
      this.endMonthLabel =
        Object.values(MonthYearLabel)[moment(this.selectedPeriod.endDate.gregorian).toDate().getMonth()];
      this.endYear = moment(this.selectedPeriod.endDate.gregorian).toDate().getFullYear();
      this.maxGregorianDate = moment(this.selectedPeriod.endDate.gregorian).toDate();
    } else {
      this.isPeriodActive = true;
      this.maxGregorianDate = new Date();
    }
    if (this.checkPrivate) {
      this.startMonthLabelHijiri = this.selectedPeriod.startDate;
      if (this.selectedPeriod.endDate && this.selectedPeriod.endDate.gregorian) {
        this.isPeriodActive = false;
        if (!this.selectedPeriod.endDate.entryFormat) {
          this.selectedPeriod.endDate.entryFormat = this.selectedPeriod.startDate.entryFormat;
        }
        this.endMonthLabelHijiri = this.selectedPeriod.endDate;
      }
    }
  }

  /** Method to handle wage edit scenario. */
  editWage(isSelect: boolean) {
    const period: EngagementPeriod = JSON.parse(JSON.stringify(this.selectedPeriod));
    this.editMode = true;
    this.isWageVerified = false;
    if (this.ppaIndicator) {
      this.getJobLookUps(period?.jobClassCode, period?.jobRankCode);
    }
    if (!this.checkPeriodNeedSplit()) {
      if (isSelect) this.periodSelect.emit(this.periodIndex);
      this.wageForm.reset();
      if (period.occupation) {
        this.wageForm.get('occupation').patchValue(period.occupation);
        const item = new Occupation();
        item.occupationName = period.occupation;
        item.value = period.occupation;
        if (
          !this.occupationList.items.find(
            item1 => item1.value.arabic === item.value?.arabic && item1.value.english === item.value?.english
          )
        ) {
          item.disabled = true;
          this.occupationList.items.push(item);
        }
      }
      if (period.contributorAbroad) this.wageForm.get('contributorAbroad.english').patchValue(YesOrNo.YES);
      else this.wageForm.get('contributorAbroad.english').patchValue(YesOrNo.NO);
      Object.keys(period.wage).forEach(key => {
        if (this.wageForm.get('wage').get(key))
          this.wageForm
            .get('wage')
            .get(key)
            .patchValue(period.wage[key] ? parseFloat(period.wage[key]).toFixed(2) : parseFloat('0').toFixed(2));
      });
      this.wageForm.get('startDate.gregorian').patchValue(moment(period?.startDate?.gregorian).toDate());
      this.wageForm?.get('startDate.hijiri').patchValue(parseToHijiriFromApi(period?.startDate?.hijiri));
      this.wageForm?.get('startDate.entryFormat').patchValue(period?.startDate?.entryFormat);
      this.wageForm.updateValueAndValidity();
    } else if (this.checkPeriodNeedSplit ) {
      if (isSelect) this.periodSelect.emit(this.periodIndex);
      this.wageForm.reset();
      if (period.occupation) {
        this.wageForm.get('occupation').patchValue(period.occupation);
        const item = new Occupation();
        item.occupationName = period.occupation;
        item.value = period.occupation;
        if (
          !this.occupationList.items.find(
            item1 => item1.value.arabic === item.value?.arabic && item1.value.english === item.value?.english
          )
        ) {
          item.disabled = true;
          this.occupationList.items.push(item);
        }
      }
      if (period.contributorAbroad) this.wageForm.get('contributorAbroad.english').patchValue(YesOrNo.YES);
      else this.wageForm.get('contributorAbroad.english').patchValue(YesOrNo.NO);
      Object.keys(period.wage).forEach(key => {
        if (this.wageForm.get('wage').get(key))
          this.wageForm
            .get('wage')
            .get(key)
            .patchValue(period.wage[key] ? parseFloat(period.wage[key]).toFixed(2) : parseFloat('0').toFixed(2));
      });
      this.wageForm.get('startDate.gregorian').patchValue(moment(period?.startDate?.gregorian).toDate());
      this.wageForm?.get('startDate.hijiri').patchValue(parseToHijiriFromApi(period?.startDate?.hijiri));
      this.wageForm?.get('startDate.entryFormat').patchValue(period?.startDate?.entryFormat);
      this.wageForm.updateValueAndValidity();
    } else this.split.emit(this.periodIndex);
    if (this.wageForm?.get('startDate.entryFormat').value === this.typeGregorian) {
      this.wageForm?.get('startDate.hijiri').setValidators(null);
      this.wageForm?.get('startDate.gregorian').setValidators([Validators.required]);
    } else {
      this.wageForm?.get('startDate.gregorian').setValidators(null);
      this.wageForm?.get('startDate.hijiri').setValidators([Validators.required]);
    }
    this.wageForm?.get('startDate').updateValueAndValidity();
    if (this.ppaIndicator && this.wageDetails) {
      this.patchValues(period);
    }
    this.disableSplit = true;
    this.disableSplitChange.emit(this.disableSplit);
  }

  /** Method to check whether period needs to be split. */
  checkPeriodNeedSplit(): boolean {
    let flag = false;
    const maxLimit = moment(this.systemParameter.CHNG_ENG_MAX_BACKDATED_PERIOD_START_DATE).toDate();
    if (moment(this.selectedPeriod.startDate.gregorian).isBefore(maxLimit, 'day')) flag = true;
    return flag;
  }

  /** Method to save wage change. */
  saveWageChanges() {
    if (this.wageForm.valid) {
      if (this.parentForm.get('updatedPeriod')) {
        this.parentForm.removeControl('updatedPeriod');
      }
      this.mandatoryAlert = false;
      this.parentForm.addControl('updatedPeriod', this.wageForm);
      this.saveWage.emit(this.periodIndex);
    } else {
      this.wageForm.markAllAsTouched();
      this.mandatoryAlert = true;
    }
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, isDelete: boolean) {
    this.isDelete = isDelete;
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md modal-dialog-centered' }));
  }

  /** This method is to hide the modal reference. */
  hideModal() {
    this.modalRef.hide();
  }

  /** Method to cancel period edit. */
  cancelPeriodEdit() {
    this.editMode = false;
    this.cancelEdit.emit();
  }

  /**
   * Method to delete a splitted period.
   * @param index index
   */
  deletePeriod(index: number) {
    this.delete.emit(index);
    if (!this.isWageVerified) this.cancelEdit.emit();
    this.hideModal();
  }

  /** Method to disable unchnaged fields on validator edit. */
  identifyChangesInPeriod() {
    if (this.changesInPeriod.length > 0) {
      let flag = false;
      this.changesInPeriod.forEach(item => {
        if (item.periodId === this.selectedPeriod.id && this.checkPeriodEligibility(item.startDate, item.endDate)) {
          flag = true;
          this.disableContributorAbroad = !item.isContributorAbroadChanged;
          this.disableOccupation = !item.isOccupationChanged;
          this.disablePPAData = !item.isRankGradeClassChanged;
          this.disableWage = !item.isWageChanged;
          //If the splitted period has no change then disable the entire record
          if (
            this.disableContributorAbroad &&
            (this.disableOccupation || (this.ppaEstablishment && this.disablePPAData)) &&
            this.disableWage
          ) {
            this.disableEdit = true;
          }
        }
      });
      //If the wage record is not changed, disable the entire record
      if (!flag && this.validatorEdit) {
        this.disableEdit = true;
      }
    } else if (this.changesInPeriod.length === 0 && this.validatorEdit) this.disableEdit = true;
  }

  /** Method to identify the correct period with the change. */
  checkPeriodEligibility(startDate: Date, endDate: Date): boolean {
    const periodStart: Date = this.selectedPeriod.startDate.gregorian;
    const periodEnd: Date = this.selectedPeriod.endDate ? this.selectedPeriod.endDate.gregorian : new Date();
    //If period shrinks in validator edit, new start date and end date will be between start date and end date (received by validator).
    //If period expands in validator edit, start date and end date (received by validator) will be between new start date and end date.
    //If only a single period and period start date shrinks and period end date expands, both dates will be after start date and end date received by validator.
    //If only a single period and period start date expands and period end date shrinks, both dates will be after start date and end date received by validator.
    //A period is identified in validator edit based on either of the four conditions (for enable / disable fields).
    return (
      (moment(periodStart).isBetween(startDate, endDate, 'day', '[]') &&
        moment(periodEnd).isBetween(startDate, endDate, 'day', '[]')) ||
      (moment(startDate).isBetween(periodStart, periodEnd, 'day', '[]') &&
        moment(endDate).isBetween(periodStart, periodEnd, 'day', '[]')) ||
      (this.totalPeriods === 1 &&
        ((moment(periodStart).isAfter(startDate, 'day') && moment(periodEnd).isAfter(endDate, 'day')) ||
          (moment(periodStart).isBefore(startDate, 'day') && moment(periodEnd).isBefore(endDate, 'day'))))
    );
  }

  /** Method to toggle disabling periods except for the one being edited. */
  togglePeriodDisable() {
    if (this.activePeriodIndex === null) {
      this.disableEdit = this.isBeyondDateLimit ? true : false;
      if (this.validatorEdit) this.identifyChangesInPeriod(); //To restore the state of period in validator edit.
    } else if (this.activePeriodIndex !== this.periodIndex && !this.editMode) this.disableEdit = true; //Disable all other periods on edit.
  }
  // refeactoring needed to be done

  patchValues(wageDetails: EngagementPeriod) {
    if (
      wageDetails &&
      this.wageForm &&
      this.jobClassLov.length > 0 &&
      this.jobRankLov.length > 0 &&
      this.jobGradeLov.length > 0
    ) {
      this.wageForm.get('jobClassName').setValue(wageDetails?.jobClassName);
      this.wageForm.get('jobRankName').setValue(wageDetails?.jobRankName);
      this.wageForm.get('jobGradeName').setValue(wageDetails?.jobGradeName);
      this.wageForm.get('jobClassCode').setValue(wageDetails?.jobClassCode);
      this.wageForm.get('jobRankCode').setValue(wageDetails?.jobRankCode);
      this.wageForm.get('jobGradeCode').setValue(wageDetails?.jobGradeCode);
      this.wageForm.get('startDate').setValue(wageDetails?.startDate);
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
      this.wageForm.controls['wage'].get('basicWage').disable();
    } else {
      this.wageForm?.controls['wage'].get('basicWage').enable();
      this.wageForm?.controls['wage']
        ?.get('basicWage')
        ?.setValidators([
          Validators.required,
          greaterThanLessThanValidator(setBasicWage?.minSalary, setBasicWage?.maxSalary)
        ]);
    }
    this.wageForm?.controls['wage']?.get('basicWage')?.updateValueAndValidity();
  }
  getJobLookUps(jobClassValue?: number, jobRankValue?: number) {
    this.jobScaleList$ = this.lookUpService.getJobScale();
    this.getJobClass(jobClassValue, jobRankValue);
  }

  getJobClass(jobClassValue?: number, jobRankValue?: number) {
    // this.jobScaleList$?.subscribe(jobScale => {
    //   if (jobScale) {
    //     this.civilianJobScale = jobScale.items.filter(res => {
    //       return res.value.english === 'Civil Job class';
    //     })[0]?.code;
    //     //Job Class List For PPA
    //     this.contributorService.getJobClass(this.civilianJobScale).subscribe(val => {
    //       let selectedJobCLassLov: Lov = new Lov();
    //       this.jobClassLov = [];
    //       val.forEach((eachJobType, index) => {
    //         const lov = new Lov();
    //         lov.code = eachJobType?.jobClassCode;
    //         lov.value = eachJobType?.jobClassName;
    //         lov.sequence = index;
    //         this.jobClassLov.push(lov);
    //         if (jobClassValue === eachJobType?.jobClassCode) {
    //           selectedJobCLassLov = lov;
    //         }
    //       });
    //       if (selectedJobCLassLov?.code || selectedJobCLassLov?.code === 0) {
    //         this.jobClassListChangeForPPA(selectedJobCLassLov, jobRankValue);
    //       }
    //     });
    //   }
    // });
  }
  //Job Rank List For PPA
  jobClassListChangeForPPA(data: Lov, selectedRank?: number) {
    this.jobClassCivilTypeLov = data;
    // this.contributorService.getRank(this.civilianJobScale, this.jobClassCivilTypeLov?.code).subscribe(res => {
    //   this.jobRankLov = [];
    //   let selectedJobRankLov: Lov = new Lov();
    //   res.forEach((eachRankType, index) => {
    //     const lov = new Lov();
    //     lov.code = eachRankType?.jobRankCode;
    //     lov.value = eachRankType?.jobRankName;
    //     lov.sequence = index;
    //     this.jobRankLov.push(lov);
    //     if (selectedRank === eachRankType?.jobRankCode) {
    //       selectedJobRankLov = lov;
    //     }
    //   });
    //   if (selectedJobRankLov?.code || selectedJobRankLov?.code === 0) {
    //     this.jobRankListChangeForPPA(selectedJobRankLov);
    //   }
    // });
  }
  //Job Grade List For PPA
  jobRankListChangeForPPA(data: Lov) {
    // this.jobRankListLov = data;
    // this.contributorService
    //   .getGrade(this.civilianJobScale, this.jobClassCivilTypeLov?.code, this.jobRankListLov?.code)
    //   .subscribe(res => {
    //     this.jobGradeLov = [];
    //     this.jobGradeApiResponse = res;
    //     res.forEach((eachGradeType, index) => {
    //       const lov = new Lov();
    //       lov.value = eachGradeType?.jobGradeName;
    //       lov.sequence = index;
    //       lov.code = parseInt(eachGradeType?.jobGradeCode);
    //       this.jobGradeLov.push(lov);
    //     });
    //   });
  }

  /**Method to select jobClass */
  selectJobClass(data: Lov) {
    this.jobClassListChangeForPPA(data);
    // this.jobClassListChange.emit(data);
    this.wageForm.get('jobClassCode').setValue(data.code);
    this.wageForm.get('jobRankName').reset();
    this.wageForm.get('jobGradeName').reset();
    this.resetBasicTotalWage();
    this.jobRankLov = [];
    this.jobGradeLov = [];
    this.wageForm.controls['wage'].get('basicWage').disable();
  }

  /**Method to select jobRank */
  selectJobRank(data: Lov) {
    this.jobRankListChangeForPPA(data);
    //this.jobRankListChange.emit(data);
    this.wageForm.get('jobRankCode').setValue(data.code);
    this.wageForm?.get('jobGradeName').reset();
    this.resetBasicTotalWage();
    this.jobGradeLov = [];
    this.wageForm?.controls['wage'].get('basicWage').disable();
  }
  resetBasicTotalWage() {
    this.wageForm?.get('wage').get('basicWage').setValue(parseFloat('0.00').toFixed(2));
    this.wageForm?.get('wage').get('totalWage').setValue(parseFloat('0.00').toFixed(2));
  }
  selectJobGrade(event: Lov) {
    this.resetBasicTotalWage();
    this.wageForm.get('jobGradeCode').setValue(event.code);
    const setBasicWage = this.jobGradeApiResponse?.find(item => parseInt(item?.jobGradeCode) === event?.code);
    if (setBasicWage && setBasicWage?.minSalary === setBasicWage?.maxSalary) {
      this.wageForm?.controls['wage']?.get('basicWage')?.setValue((setBasicWage?.minSalary).toFixed(2));
      this.wageForm?.controls['wage']?.get('totalWage')?.setValue((setBasicWage?.minSalary).toFixed(2));
      this.wageForm?.controls['wage'].get('basicWage').disable();
    } else {
      this.haveMinMaxBasicWage(setBasicWage);
    }
  }
  haveMinMaxBasicWage(setBasicWage: gradeDetails) {
    this.wageForm.controls['wage']?.get('basicWage')?.setValue((setBasicWage?.minSalary).toFixed(2));
    this.wageForm.controls['wage']?.get('totalWage')?.setValue((setBasicWage?.minSalary).toFixed(2));
    this.wageForm.controls['wage']
      ?.get('basicWage')
      ?.setValidators([
        Validators.required,
        greaterThanLessThanValidator(setBasicWage?.minSalary, setBasicWage?.maxSalary)
      ]);
    this.wageForm.controls['wage']?.get('basicWage')?.updateValueAndValidity();
    this.wageForm.controls['wage'].get('basicWage').enable();
  }
}
