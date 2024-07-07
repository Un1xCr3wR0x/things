/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ApplicationTypeToken,
  CalendarService,
  CalendarTypeEnum,
  Lov,
  Occupation,
  OccupationList,
  WageCard,
  addMonths,
  convertToHijriFormat,
  convertToStringDDMMYYYY,
  markFormGroupTouched,
  startOfDay,
  startOfMonth,
  wageValidator
} from '@gosi-ui/core';
import { ContributorConstants, SystemParameter } from '@gosi-ui/features/contributor/lib/shared';
import moment from 'moment';
import { PurposeOfRegsitrationEnum, WagePeriodStatus } from '../../../shared/enums';
import {
  EngagementPeriod,
  RegistrationPurpose,
  VICWageCategory,
  VICWageCategoryWrapper,
  VicEngagementDetails,
  VicEngagementPayload,
  VicEngagementPeriod
} from '../../../shared/models';

@Component({
  selector: 'cnt-vic-engagement-details-dc',
  templateUrl: './vic-engagement-details-dc.component.html',
  styleUrls: ['./vic-engagement-details-dc.component.scss']
})
export class VicEngagementDetailsDcComponent implements OnInit, OnChanges {
  /** Local variables. */
  engagementForm: FormGroup;
  wageSearchForm: FormGroup;
  engagementDateForm: FormGroup;
  showOccupation = false;
  showEstOwnerinfo = false;
  selectedWage: VICWageCategory;
  incrementPercent: number;
  dueDate: Date;
  hasWageDecreased: boolean;
  wageApplicableOn: string;
  displayDate: Date;
  engagementWageAddForm: FormGroup;
  isEngagementWageAddFormVisible = true;
  mandatoryAlert = false;
  wageSeparatorLimit = ContributorConstants.WAGE_SEPARATOR_LIMIT;
  isUpdate = false;
  typeGregorian = CalendarTypeEnum.GREGORIAN;
  typeHijira = CalendarTypeEnum.HIJRI;
  minHijiriDate: string;
  dateformat: string;
  isWageSaved = false;
  wageSavedAlert = false;
  firstOfCurrentMonth: Date;

  /** Input variables. */
  @Input() occupationList: OccupationList;
  @Input() purposeOfRegList: RegistrationPurpose;
  @Input() wageCategories: WageCard[];
  @Input() wageList: VICWageCategoryWrapper;
  @Input() parentForm: FormGroup;
  @Input() vicEngagement: VicEngagementDetails;
  @Input() canEdit: boolean; //Flag to determine whether the section can be edited
  @Input() showPreviousSection: boolean;
  @Input() disableWage = false;
  @Input() disableOccupation = false;
  @Input() isUpdateWage = false;
  @Input() hasCurrentYearVicEngagement: boolean;
  @Input() isEditMode: boolean; //To identify whether validator edit
  @Input() isRegisterVic = false;
  @Input() maxDate: Date;
  @Input() minDate: Date;
  @Input() engagementWageDetails: EngagementPeriod[] = [];
  @Input() purposeOfRegistrationList: Lov[];
  @Input() updateVicPREligible: boolean;
  @Input() systemParams: SystemParameter;

  /** Output variables */
  @Output() cancelTransaction = new EventEmitter<null>(null);
  @Output() saveEngagement = new EventEmitter<VicEngagementPayload>(null);
  @Output() previous = new EventEmitter<null>(null);
  @Output() purposeChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() showWarning: EventEmitter<string> = new EventEmitter();
  @Output() addWageEvent: EventEmitter<null> = new EventEmitter();
  @Output() editWagePeriodOnBoolean: EventEmitter<null> = new EventEmitter();
  @Output() wageUpdateEvent: EventEmitter<Object> = new EventEmitter();
  labelDate: Date;
  applicableFromDate: Date;

  /** Method to handle initialize EngagementDetailsDcComponent. */
  constructor(
    readonly fb: FormBuilder,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly calenderService: CalendarService
  ) {}

  /** Method to handle initialization tasks. */
  ngOnInit(): void {
    this.displayDate = startOfMonth(addMonths(new Date(), 1));
    this.engagementForm = this.createEngagementForm();
    this.engagementDateForm = this.createEngagementDateForm();

    this.initializeEngagementForm();
    this.initializeEngagementDateForm();
    this.wageSearchForm = this.createWageSearchForm();
    this.parentForm.addControl('wageSearch', this.wageSearchForm);
    this.engagementWageAddForm = this.createWageDetailsForm();
    if (!this.isUpdateWage) this.initializeWageApplicableDate();
    this.dateformat = this.typeGregorian;
  }

  /** Method to initialize wage applicable date. */
  initializeWageApplicableDate() {
    if (this.engagementDateForm?.get('dateOfRegistration')?.get('gregorian')?.value) {
      this.wageApplicableOn = convertToStringDDMMYYYY(
        startOfMonth(
          addMonths(startOfDay(this.engagementDateForm?.get('dateOfRegistration')?.get('gregorian')?.value), 1)
        )?.toString()
      );
      this.labelDate = startOfMonth(
        addMonths(startOfDay(this.engagementDateForm?.get('dateOfRegistration')?.get('gregorian')?.value), 1)
      );
    }
    // this.wageApplicableOn = convertToStringDDMMYYYY(startOfMonth(addMonths(new Date(), 1)).toString());
  }

  /** Method to handle changes in input. */
  ngOnChanges(changes: SimpleChanges) {
    if ((changes.purposeOfRegList && this.purposeOfRegList?.pensionReformEligible) || this.updateVicPREligible) {
      const today = new Date();
      this.minDate =
        moment(startOfMonth(today)).isBefore(this.systemParams?.PENSION_REFORM_EFFECTIVE_DATE) &&
        this.purposeOfRegList?.pensionReformEligible
          ? startOfDay(this.systemParams?.PENSION_REFORM_EFFECTIVE_DATE)
          : startOfMonth(today);
      this.firstOfCurrentMonth = startOfMonth(today);
      this.initializeEngagementForm();
      this.initializeEngagementDateForm();
      this.initializeViewInEdit();
      this.initializeViewInDate();
      if (!this.isRegisterVic && this.updateVicPREligible) {
        this.engagementWageAddForm.get('applicableFromDate')?.get('gregorian')?.setValidators([Validators.required]);
        this.engagementWageAddForm.get('startDate').reset();
        this.engagementWageAddForm.get('startDate')?.get('gregorian')?.setValidators(null);
        this.engagementWageAddForm.get('applicableFromDate').updateValueAndValidity();
        this.engagementWageAddForm.get('startDate').updateValueAndValidity();
        if (moment(this.vicEngagement?.joiningDate?.gregorian).isAfter(this.firstOfCurrentMonth)) {
          this.engagementWageAddForm
            .get('applicableFromDate')
            ?.get('gregorian')
            .setValue(moment(this.vicEngagement?.joiningDate?.gregorian).toDate());
        } else {
          this.engagementWageAddForm.get('applicableFromDate')?.get('gregorian')?.setValue(this.firstOfCurrentMonth);
        }
        this.engagementWageAddForm.updateValueAndValidity();
      }
      // this.changeBasicWageStatus();
    }
    if (changes.vicEngagement && changes.vicEngagement.currentValue) {
      this.initializeEngagementForm();
      this.initializeEngagementDateForm();
      this.initializeViewInEdit();
      this.initializeViewInDate();
    }
    if (this.isEditMode && this.isRegisterVic) {
      this.updateWageDetails();
    }
    if (changes.wageCategories && changes.wageCategories.currentValue) {
      this.selectedWage = undefined;
      this.incrementPercent = this.wageList.wageIncrement;
      if (this.wageList.paymentDueDate) this.dueDate = this.wageList.paymentDueDate.gregorian;
      if (this.wageList.wageApplicableOn)
        this.wageApplicableOn = convertToStringDDMMYYYY(this.wageList.wageApplicableOn.gregorian.toString());
      if (this.vicEngagement) this.initializeWageSectionInEdit();
    }
    if (!this.isUpdateWage) this.initializeWageApplicableDate();
  }

  /** Method to create form. */
  createEngagementForm(): FormGroup {
    return this.fb.group({
      purposeOfRegistration: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      occupation: this.fb.group({
        english: [null],
        arabic: []
      })
    });
  }

  /** Method to create date form. */
  createEngagementDateForm(): FormGroup {
    return this.fb.group({
      dateOfRegistration: this.fb.group({
        gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
        hijiri: [null]
      }),

      dateOfReflection: this.fb.group({
        gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
        hijiri: [null]
      })
    });
  }

  /** Method to initialize engagement form. */
  initializeEngagementForm() {
    if (!this.engagementForm) {
      this.parentForm.addControl('engagementForm', this.engagementForm);
    }
  }
  initializeEngagementDateForm() {
    if (this.isRegisterVic) {
      this.parentForm.addControl('engagementDateForm', this.engagementDateForm);
    }
  }

  changeOnDate() {
    this.initializeWageApplicableDate();
    if (this.wageApplicableOn)
      this.engagementDateForm
        .get('dateOfReflection')
        .get('gregorian')
        .patchValue(moment(this.wageApplicableOn, 'DD/MM/YYYY').toDate());
    // this.initializeWageSectionInEdit();
  }

  /** Method to change in wage category. */
  changeWageCategoryStatus() {
    if (this.parentForm && !this.parentForm.get('wageCategory.changed'))
      this.parentForm.addControl('wageCategory', this.fb.group({ changed: true }));
  }
  /** Method to change in basic wage for pr eligible. */
  changeBasicWageStatus() {
    if (this.parentForm && !this.engagementWageAddForm.get('wage').get('basicWage.changed'))
      this.parentForm.addControl('basicWage', this.fb.group({ changed: true }));
  }

  /** Method to create wage form. */
  createWageSearchForm(): FormGroup {
    return this.fb.group({
      search: [null, Validators.required]
    });
  }

  /** Method to initialize view in edit mode. */
  initializeViewInEdit() {
    this.engagementForm.get('purposeOfRegistration').setValue(this.vicEngagement?.purposeOfRegistration);
    if ((this.purposeOfRegList && this.purposeOfRegList?.pensionReformEligible) || this.updateVicPREligible) {
      this.vicEngagement?.purposeOfRegistration;
      this.initializeEngagementWageAddForm();
    }
    this.handlePurposeOfRegistrationChange(this.vicEngagement?.purposeOfRegistration?.english, false);
    if (this.showOccupation) {
      // this.engagementForm
      //   .get('occupation')
      //   .setValue(
      //     this.vicEngagement.engagementPeriod[
      //       this.isUpdateWage
      //         ? this.identifyCurrentPeriodIndex(this.vicEngagement.engagementPeriod, this.isEditMode)
      //         : 0
      //     ].occupation
      //   );
      this.engagementForm
        .get('occupation')
        .patchValue(
          this.vicEngagement.engagementPeriod[
            this.isUpdateWage
              ? this.identifyCurrentPeriodIndex(this.vicEngagement.engagementPeriod, this.isEditMode)
              : 0
          ].occupation
        );
      const item = new Occupation();
      item.occupationName =
        this.vicEngagement.engagementPeriod[
          this.isUpdateWage ? this.identifyCurrentPeriodIndex(this.vicEngagement.engagementPeriod, this.isEditMode) : 0
        ].occupation;
      item.value =
        this.vicEngagement.engagementPeriod[
          this.isUpdateWage ? this.identifyCurrentPeriodIndex(this.vicEngagement.engagementPeriod, this.isEditMode) : 0
        ].occupation;
      if (
        !this.occupationList.items.find(
          item1 => item1.value.arabic === item.value?.arabic && item1.value.english === item.value?.english
        )
      ) {
        item.disabled = true;
        this.occupationList.items.push(item);
      }
    }
  }

  initializeViewInDate() {
    // this.engagementDateForm.get('dateOfRegistration').setValue(this.vicEngagement.formSubmissionDate);
    this.engagementDateForm
      .get('dateOfRegistration.gregorian')
      .setValue(moment(this.vicEngagement.formSubmissionDate.gregorian).toDate());
  }

  /** Method to initialize wage section in edit mode. */
  initializeWageSectionInEdit() {
    //current period index to be identified when csr initiates update wage transaction as there can be future periods.
    //for validator edit of update vic wage, wage to be made valid period is considered
    //for register vic  0th index is considered.
    const currentIndex = this.isUpdateWage
      ? this.identifyCurrentPeriodIndex(this.vicEngagement.engagementPeriod, this.isEditMode)
      : 0;
    this.wageCategories.forEach(item => {
      if (item.category === this.vicEngagement.engagementPeriod[currentIndex].wageCategory) item.active = true;
    });
    this.selectedWage = this.wageList.wageCategories.find(
      item => item.incomeCategory === this.vicEngagement.engagementPeriod[currentIndex].wageCategory
    );
  }

  /** Method to identify current period index. */
  identifyCurrentPeriodIndex(periods: VicEngagementPeriod[], isEditMode: boolean): number {
    //In Edit Mode, if wage was not changed by CSR current period is 0th index, otherwise period with status TO_BE_MADE_VALID
    return isEditMode && periods.some(item => item.status === WagePeriodStatus.TO_BE_MADE_VALID)
      ? periods.findIndex(item =>
          isEditMode ? item.status === WagePeriodStatus.TO_BE_MADE_VALID : item.isCurrentPeriod
        )
      : 0;
  }

  /** Method to handle purpose of registration change. */
  handlePurposeOfRegistrationChange(selectedValue: string, emitChange = true) {
    if (selectedValue === PurposeOfRegsitrationEnum.PROFESSIONAL) {
      this.engagementForm.get('occupation.english').setValidators([Validators.required]);
      this.engagementForm.get('occupation.english').updateValueAndValidity();
      this.showOccupation = true;
      this.showEstOwnerinfo = false;
    } else if (selectedValue === PurposeOfRegsitrationEnum.ESTABLISHMENT_OWNER) {
      this.showOccupation = false;
      this.showEstOwnerinfo = true;
      this.resetValidation();
    } else {
      this.showEstOwnerinfo = false;
      this.showOccupation = false;
      this.resetValidation();
    }
    if (emitChange) this.purposeChange.emit(selectedValue);
  }

  /** Method to reset validation. */
  resetValidation(): void {
    this.engagementForm.get('occupation.english').setValue(null);
    this.engagementForm.get('occupation.arabic').setValue(null);
    this.engagementForm.get('occupation.english').clearValidators();
    this.engagementForm.get('occupation.english').updateValueAndValidity();
  }

  /** Method to handle wage selection. */
  handleWageSelection(wageCategory: number) {
    this.changeWageCategoryStatus();
    this.selectedWage = this.wageList.wageCategories.filter(res => res.incomeCategory === wageCategory)[0];
    if (this.isUpdateWage) this.checkForWageDecrease();
  }

  /** Method to check for wage decrease. */
  checkForWageDecrease() {
    const currentWage = this.wageCategories.filter(res => res.isCurrent)[0];
    if (this.selectedWage.wage < currentWage.wage) this.hasWageDecreased = true;
    else this.hasWageDecreased = false;
  }
  saveForUpdateVicEligible() {
    if (this.engagementWageAddForm.valid) {
      this.mandatoryAlert = false;
      this.engagementWageDetails[0] = this.engagementWageAddForm.getRawValue();
      // this.engagementWageDetails.push(this.engagementWageAddForm.getRawValue());
      this.isWageSaved = true;
    } else {
      this.engagementWageAddForm.markAllAsTouched();
      this.mandatoryAlert = true;
    }
  }
  /** Method to save engagement details. */
  saveEngagementDetails(): void {
    if (!this.isRegisterVic && this.updateVicPREligible) {
      this.saveForUpdateVicEligible();
    }
    if (
      this.purposeOfRegList &&
      this.purposeOfRegList?.pensionReformEligible &&
      this.isWageSaved &&
      this.isRegisterVic
    ) {
      this.updateWageDetails();
    } else if (
      ((this.purposeOfRegList && this.purposeOfRegList?.pensionReformEligible) || this.updateVicPREligible) &&
      !this.isWageSaved
    ) {
      this.engagementWageAddForm.markAllAsTouched();
      if (this.engagementWageAddForm.get('wage').get('basicWage').value > 0) {
        this.mandatoryAlert = false;
        this.wageSavedAlert = true;
      } else {
        this.wageSavedAlert = false;
        this.mandatoryAlert = true;
      }
    }
    markFormGroupTouched(this.engagementForm);
    if (this.engagementForm?.get('purposeOfRegistration')?.invalid) {
      this.mandatoryAlert = true;
      this.engagementForm.markAllAsTouched();
      this.saveEngagement.emit(null);
    } else if (
      !this.engagementForm.invalid &&
      this.selectedWage &&
      !this.purposeOfRegList?.pensionReformEligible &&
      !this.updateVicPREligible
        ? !this.engagementDateForm?.get('dateOfRegistration').invalid
        : true ||
          (!this.engagementForm?.invalid &&
            this.isRegisterVic &&
            this.purposeOfRegList &&
            this.purposeOfRegList?.pensionReformEligible &&
            this.isWageSaved)
        ? !this.engagementDateForm?.get('dateOfReflection').invalid
        : true
    ) {
      const vicEngagement = new VicEngagementPayload();
      if ((this.purposeOfRegList && this.purposeOfRegList?.pensionReformEligible) || this.updateVicPREligible) {
        vicEngagement.joiningDate.gregorian = startOfDay(
          this.engagementDateForm?.get('dateOfReflection')?.get('gregorian')?.value
        );
        vicEngagement.joiningDate.hijiri = null;
        vicEngagement.formSubmissionDate = null;
      } else {
        vicEngagement.formSubmissionDate.gregorian = startOfDay(
          this.engagementDateForm?.get('dateOfRegistration')?.get('gregorian')?.value
        );
        vicEngagement.formSubmissionDate.hijiri = null;
        vicEngagement.joiningDate = null;
      }
      vicEngagement.purposeOfRegistration = this.engagementForm?.get('purposeOfRegistration')?.value;
      vicEngagement.engagementPeriod.occupation = this.engagementForm?.get('occupation')?.get('english')?.value
        ? this.engagementForm?.get('occupation')?.value
        : null;
      vicEngagement.engagementPeriod.basicWage =
        (this.purposeOfRegList && this.purposeOfRegList?.pensionReformEligible) || this.updateVicPREligible
          ? this.engagementWageAddForm?.get('wage')?.get('totalWage')?.value
          : this.selectedWage?.wage;
      vicEngagement.engagementPeriod.applicableFromDate =
        this.updateVicPREligible && !this.isRegisterVic ? this.engagementWageDetails[0]?.applicableFromDate : null;
      //contribution amount, coverage types, wage category not required while saving
      vicEngagement.engagementPeriod.contributionAmount = undefined;
      vicEngagement.engagementPeriod.coverageTypes = undefined;
      vicEngagement.engagementPeriod.wageCategory = undefined;
      if (
        (((this.purposeOfRegList && this.purposeOfRegList?.pensionReformEligible) || this.updateVicPREligible) &&
          this.isWageSaved) ||
        (!this.purposeOfRegList?.pensionReformEligible && !this.updateVicPREligible)
      ) {
        this.saveEngagement.emit(vicEngagement);
      }
    } else {
      this.saveEngagement.emit(null);
      markFormGroupTouched(this.engagementDateForm);
    }
  }

  /** Method to show warning. */
  showWarningMessage() {
    if (!this.isUpdateWage) this.showWarning.emit('CONTRIBUTOR.ADD-VIC.SELECT-PURPOSE-OF-REGISTRATION');
  }

  /**
   * This method is used to create wage details form
   */
  createWageDetailsForm(isPpa = false): FormGroup {
    return this.fb.group({
      formSubmissionDate: this.fb.group({
        gregorian: [null],
        hijiri: ['']
      }),
      startDate: this.fb.group({
        gregorian: [null, Validators.required],
        hijiri: ['', { validators: isPpa ? Validators.required : null, updateOn: 'blur' }],
        entryFormat: [this.typeGregorian]
      }),
      applicableFromDate: this.fb.group({
        gregorian: [null],
        hijiri: [''],
        entryFormat: [this.typeGregorian]
      }),
      wage: this.fb.group({
        basicWage: [
          parseFloat('0.00').toFixed(2),
          { validators: !isPpa ? [Validators.required, wageValidator] : Validators.required, updateOn: 'blur' }
        ],
        commission: [parseFloat('0.00').toFixed(2)],
        housingBenefit: [parseFloat('0.00').toFixed(2)],
        otherAllowance: [parseFloat('0.00').toFixed(2)],
        contributoryWage: [parseFloat('0').toFixed(2), {}],
        totalWage: [parseFloat('0').toFixed(2), { validators: Validators.required, updateOn: 'blur' }]
      })
    });
  }

  /**
   * This method is used to calculate total wage
   */
  calculateTotalWage(engagementWageAddForm: FormGroup) {
    const wageValues = engagementWageAddForm.getRawValue();
    let totalWage = 0;
    let contributoryWage = 0;
    if (wageValues.wage.basicWage) {
      totalWage += parseFloat(wageValues.wage.basicWage);
      contributoryWage += parseFloat(wageValues.wage.basicWage);
    }
    if (wageValues.wage.commission) {
      totalWage += parseFloat(wageValues.wage.commission);
      contributoryWage += parseFloat(wageValues.wage.commission);
    }
    if (wageValues.wage.housingBenefit) {
      totalWage += parseFloat(wageValues.wage.housingBenefit);
      contributoryWage += parseFloat(wageValues.wage.housingBenefit);
    }
    if (wageValues.wage.otherAllowance) {
      totalWage += parseFloat(wageValues.wage.otherAllowance);
    }
    engagementWageAddForm.get('wage').patchValue({
      totalWage: totalWage.toFixed(2)
    });
    engagementWageAddForm.get('wage').patchValue({
      contributoryWage: contributoryWage.toFixed(2)
    });
  }

  onBlur(engagementWageAddForm: FormGroup) {
    this.changeBasicWageStatus();
    this.calculateTotalWage(engagementWageAddForm);
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
        if (this.engagementDateForm.get('dateOfReflection').get('hijiri').value) {
          const jArr = this.engagementDateForm.get('dateOfReflection').get('hijiri').value.split('/');
          if (
            dateArr[1] == jArr[1] &&
            dateArr[2] == jArr[2] &&
            dateArr[0] != jArr[0] &&
            parseInt(dateArr[0]) < parseInt(jArr[0])
          ) {
            actualDate = convertToHijriFormat(this.engagementDateForm.get('dateOfReflection').get('hijiri').value);
            this.engagementWageAddForm
              .get('startDate')
              .get('hijiri')
              .setValue(this.engagementDateForm.get('dateOfReflection').get('hijiri').value);
          }
        }
        this.calenderService.getGregorianDate(actualDate).subscribe(
          res => {
            this.engagementWageAddForm.get('startDate').get('gregorian').setValue(res.gregorian);
            if (this.engagementWageAddForm.valid) {
              this.mandatoryAlert = false;
              this.isEngagementWageAddFormVisible = false;
              // this.addWageEvent.emit(this.engagementWageAddForm.getRawValue());
              this.engagementWageDetails.push(this.engagementWageAddForm.getRawValue());
              this.isUpdate = true;
              this.isWageSaved = true;
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
      if (this.engagementWageAddForm.valid) {
        this.mandatoryAlert = false;
        this.isEngagementWageAddFormVisible = false;
        // this.addWageEvent.emit(this.engagementWageAddForm.getRawValue());
        this.engagementWageDetails.push(this.engagementWageAddForm.getRawValue());
        this.isUpdate = true;
        this.isWageSaved = true;
      } else {
        this.engagementWageAddForm.markAllAsTouched();
        this.mandatoryAlert = true;
      }
    }
  }

  updateWageDetails() {
    if (this.engagementWageAddForm.get('startDate.entryFormat').value === CalendarTypeEnum.GREGORIAN) {
      this.engagementWageAddForm.get('startDate.hijiri').clearValidators();
      this.engagementWageAddForm.get('startDate.hijiri').updateValueAndValidity({ emitEvent: false });
      this.engagementWageDetails[0] = this.engagementWageAddForm.getRawValue();
      this.isEngagementWageAddFormVisible = false;
      this.isWageSaved = true;
    }
    if (this.engagementWageAddForm.get('startDate.entryFormat').value === CalendarTypeEnum.HIJRI) {
      this.engagementWageAddForm.get('startDate.gregorian').clearValidators();
      this.engagementWageAddForm.get('startDate.gregorian').updateValueAndValidity({ emitEvent: false });
      this.engagementWageDetails[0] = this.engagementWageAddForm.getRawValue();
      this.isEngagementWageAddFormVisible = false;
      this.isWageSaved = true;
    }
    if (this.engagementWageAddForm.valid) {
      // this.editWagePeriodOnBoolean.emit(false);
      this.mandatoryAlert = false;
      const getFormData = this.engagementWageAddForm.getRawValue();
      // this.wageUpdateEvent.emit({
      //   wage: getFormData,
      //   index: this.engagementWageEntryEditDetails.index
      // });
      this.engagementWageDetails[0] = this.engagementWageAddForm.getRawValue();
      this.isEngagementWageAddFormVisible = false;
      this.isWageSaved = true;
    } else {
      this.engagementWageAddForm.markAllAsTouched();
      this.mandatoryAlert = true;
    }
  }

  selectJoinDate() {
    this.engagementWageAddForm
      .get('startDate')
      .get('gregorian')
      .setValue(this.engagementDateForm.get('dateOfReflection').get('gregorian').value);
  }

  cancelWageEdit() {
    this.isEngagementWageAddFormVisible = false;
    this.isWageSaved = true;
  }

  editWagePeriod(wageDetail, i) {
    this.isEngagementWageAddFormVisible = true;
    this.isWageSaved = false;
    this.wageSavedAlert = false;
  }

  removeWagePeriod(i) {
    this.engagementWageAddForm.get('wage').reset();
    this.engagementWageAddForm.get('wage').get('basicWage').setValue(parseFloat('0.00').toFixed(2));
    this.engagementWageAddForm.markAsPristine();
    this.engagementWageAddForm.markAsUntouched();
    this.isEngagementWageAddFormVisible = true;
    this.engagementWageDetails = [];
    this.isUpdate = false;
    this.isWageSaved = false;
    this.wageSavedAlert = false;
  }

  initializeEngagementWageAddForm() {
    this.engagementDateForm
      .get('dateOfReflection')
      .get('gregorian')
      .setValue(new Date(this.vicEngagement.joiningDate.gregorian));
    this.engagementWageAddForm
      .get('wage')
      .get('basicWage')
      .patchValue(parseFloat(`${this.vicEngagement.engagementPeriod[0].basicWage}`).toFixed(2));
    this.engagementWageAddForm
      .get('wage')
      .get('totalWage')
      .patchValue(parseFloat(`${this.vicEngagement.engagementPeriod[0].basicWage}`).toFixed(2));
  }
}
