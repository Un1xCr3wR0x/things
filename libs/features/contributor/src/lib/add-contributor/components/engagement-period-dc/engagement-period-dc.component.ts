/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BaseComponent,
  CalendarService,
  CalendarTypeEnum,
  GosiCalendar,
  LookupService,
  LovList,
  convertToHijriFormat,
  endOfMonth,
  endOfMonthHijiri,
  maxDateValidator,
  minDateValidator,
  monthDiff,
  startOfDay,
  startOfMonth,
  startOfMonthHijiri,
  startOfYear,
  subtractMonths
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';
import { ContributorConstants } from '../../../shared/constants';
import { ContributorTypesEnum, MaxLengthEnum, WorkType } from '../../../shared/enums';
import {
  EngagementDetails,
  EngagementPeriod,
  HijiriConstant,
  PersonalInformation,
  SystemParameter
} from '../../../shared/models';
import { checkWageAddSection, createEngagementForm, getPeriodParam } from '../../../shared/utils';
@Component({
  selector: 'cnt-engagement-period-dc',
  templateUrl: './engagement-period-dc.component.html',
  styleUrls: ['./engagement-period-dc.component.scss']
})
export class EngagementPeriodDcComponent extends BaseComponent implements OnInit, OnChanges {
  /**Input variables */
  @Input() workTypeList: LovList;
  @Input() leavingReasonLovList: LovList;
  @Input() contributorAbroad: LovList;
  @Input() contributorType: string;
  @Input() systemParams: SystemParameter;
  @Input() engagementDetails: EngagementDetails;
  @Input() engagementDetailsForm: FormGroup;
  @Input() inEditMode: boolean;
  @Input() isDraftAvailable: boolean;
  @Input() backdatedContributor: boolean;
  @Input() isPrivate: boolean;
  @Input() engagementWageDetails: EngagementPeriod[] = [];
  @Input() person: PersonalInformation;
  @Input() isGccEstablishment: boolean;
  @Input() isBeneficiary: boolean;
  @Input() joiningDate: Date;
  @Input() joiningDateHijiri: string;
  @Input() joiningDateEntryFormat: string;
  @Input() leavingDate: Date;
  @Input() disableWageAddSection: boolean;
  @Input() isContractRequired: boolean;
  @Input() checkLegal: boolean;
  @Input() resetDateForm: boolean;
  @Input() disableTerminate: boolean;
  @Input() backdatedEngValidatorRequired: boolean;
  @Input() ppaEstablishment: boolean;
  @Input() hijiriDateConst: HijiriConstant;
  /** Output event emitters */
  @Output() joiningDateChange: EventEmitter<Date> = new EventEmitter();
  @Output() leavingDateChange: EventEmitter<Date> = new EventEmitter();
  @Output() joiningDateHijiriChange: EventEmitter<string> = new EventEmitter();
  @Output() joiningDateEntryFormatChange: EventEmitter<string> = new EventEmitter();
  @Output() resetEngagementWages: EventEmitter<null> = new EventEmitter();
  @Output() disableWageAddSectionChange: EventEmitter<boolean> = new EventEmitter();
  @Output() setWageValidation: EventEmitter<null> = new EventEmitter();
  @Output() getDateEntry: EventEmitter<GosiCalendar> = new EventEmitter();
  @Output() setWagePeriodEndDate: EventEmitter<null> = new EventEmitter();
  @Output() checkDocRequired: EventEmitter<Object> = new EventEmitter();
  @Output() resetHijiriLeavingDate: EventEmitter<null> = new EventEmitter();
  @Output() resetDateFormFromConfirmLeavingdate: EventEmitter<null> = new EventEmitter();
  @Output() setMaxLeavingDate: EventEmitter<Date> = new EventEmitter();
  /**Local variables */
  contributorTypes = ContributorTypesEnum;
  employeeIdMaxLength = MaxLengthEnum.EMPLOYEE_ID;
  modalRef: BsModalRef;
  leavingReason: string;
  minJoiningDate: Date;
  maxJoiningDate: Date;
  maxLeavingDate: Date;
  minLeavingDate: Date;
  disableLeavingDate = true;
  disableLeavingReason = false;
  periodDetailForm: FormGroup;
  joiningDateHijiriForCancel: string;
  leavingDateHijiriForCancel: string;

  // For hijiri calendar
  minStartDate: any;
  maxstartDate: any;
  maxHijiriLeavingDate: any;
  minHijiriLeavingDate: any;
  dateForm1: FormGroup;
  dateForm2: FormGroup;
  typeGregorian = CalendarTypeEnum.GREGORIAN;
  typeHijira = CalendarTypeEnum.HIJRI;

  /**Child components */
  @ViewChild('changeJoiningDateTemplate', { static: true })
  changeJoiningDateTemplate: TemplateRef<HTMLElement>;
  @ViewChild('changeJoiningDateHijriTemplate', { static: true })
  changeJoiningDateHijriTemplate: TemplateRef<HTMLElement>;
  @ViewChild('changeLeavingDateHijiriTemplate', { static: true })
  changeLeavingDateHijiriTemplate: TemplateRef<HTMLElement>;
  @ViewChild('changeLeavingDateTemplate', { static: true })
  changeLeavingDateTemplate: TemplateRef<HTMLElement>;
  @ViewChild('changeLeavingReasonTemplate', { static: true })
  changeLeavingReasonTemplate: TemplateRef<HTMLElement>;
  @ViewChild('contractRemovingTemplate', { static: true })
  contractRemovingTemplate: TemplateRef<HTMLElement>;
  @ViewChild('contractRemovingTemplate1', { static: true })
  contractRemovingTemplate1: TemplateRef<HTMLElement>;

  checkPrivate: boolean;
  forPPA: LovList;
  /** Method to initialize values on class instantiation. */
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    readonly calendarService: CalendarService,
    readonly lookupService: LookupService
  ) {
    super();
  }

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.minStartDate = this.ppaEstablishment
      ? this.hijiriDateConst.ppaMinHijiriDate
      : this.hijiriDateConst.gosiMinHijiriDate;
    this.maxstartDate = this.ppaEstablishment
      ? this.hijiriDateConst?.ppaMaxHijirDate
      : this.hijiriDateConst?.gosiMaxHijiriDate;
    this.maxHijiriLeavingDate = this.ppaEstablishment
      ? this.hijiriDateConst?.ppaMaxHijirDate
      : this.hijiriDateConst?.gosiMaxHijiriDate;
    this.isPrivate = this.isPrivate;
    this.checkLegal = this.checkLegal;
    // this.maxstartDate = this.ppaEstablishment ? "08/06/1444": "13/04/1439";
    // this.maxHijiriLeavingDate = this.ppaEstablishment ? "08/06/1444": "13/04/1439";

    if (this.contributorType === this.contributorTypes.SAUDI) {
      this.checkPrivate = this.ppaEstablishment ? true : this.isPrivate ? true : false;
    }
    //this.periodDetailForm = this.getForm();
    this.periodDetailForm = createEngagementForm(this.fb, this.deathDate ? false : true, this.deathDate ? true : false);
    // forms for handling hijri and gregorian calender
    this.dateForm1 = this.createDateTypeForm();
    this.dateForm2 = this.createDateTypeForm();
    this.periodDetailForm.get('joiningDate.entryFormat').setValue(this.typeGregorian);
    this.periodDetailForm.get('leavingDate.entryFormat').setValue(this.typeGregorian);

    this.engagementDetailsForm.addControl('periodForm', this.periodDetailForm);
    if (this.periodDetailForm && this.inEditMode) this.bindDataToForm();
    if (this.isDraftAvailable) this.bindDataToForm();
    if (this.ppaEstablishment) this.periodDetailForm.get('workType.english').setValue(WorkType.FULL_TIME);
    if (!this.inEditMode || (this.inEditMode && this.engagementDetails.isContributorActive))
      this.removeLeavingValidation();
    this.setContributorAbroad();
    this.setLeavingDateValidation(this.joiningDate);
    this.setJoiningDateValidation();
    this.checkWageAdditionSection();
    this.periodDetailForm.updateValueAndValidity({ emitEvent: false });
    this.detectChanges();
    this.ReopenEstablishmentAction();
  }

  getForm(): FormGroup {
    return this.periodDetailForm
      ? this.periodDetailForm
      : createEngagementForm(this.fb, this.deathDate ? false : true, this.deathDate ? true : false);
  }

  /**Method to detect Input variable changes */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.systemParams && changes.systemParams.currentValue && this.contributorType !== undefined) {
      this.setJoiningDateValidation();
      this.setContributorAbroad();
    }
    if (changes.engagementDetails && changes.engagementDetails.currentValue) {
      if (this.periodDetailForm && this.inEditMode) this.bindDataToForm();
      if (this.isDraftAvailable) this.bindDataToForm();
    }
    if (this.ppaEstablishment && changes.workTypeList?.currentValue) {
      this.forPPA = new LovList(
        this.workTypeList.items.filter(res => {
          return res.value.english === WorkType.FULL_TIME;
        })
      );
      this.periodDetailForm = this.getForm();
      this.periodDetailForm.get('workType').setValue(this.forPPA.items[0].value);
    }

    if ((changes.isBeneficiary && this.isBeneficiary) || (changes.isGccEstablishment && this.isGccEstablishment))
      this.setContributorAbroad();
  }
  /**Getters for form control */
  private get leavingDateFormControl(): FormControl {
    return this.periodDetailForm.get('leavingDate.gregorian') as FormControl;
  }
  private get leavingDateFormControlHijiri(): FormControl {
    return this.periodDetailForm.get('leavingDate.hijiri') as FormControl;
  }
  private get leavingReasonFormControl(): FormControl {
    return this.periodDetailForm.get('leavingReason.english') as FormControl;
  }
  private get joiningDateFormControl(): FormControl {
    return this.periodDetailForm.get('joiningDate.gregorian') as FormControl;
  }
  private get joiningDateFormControlHijiri(): FormControl {
    return this.periodDetailForm.get('joiningDate.hijiri') as FormControl;
  }
  private get ContributorActiveFormControl(): FormControl {
    return this.periodDetailForm.get('isContributorActive') as FormControl;
  }
  private get ContractActiveFormControl(): FormControl {
    return this.periodDetailForm.get('isContractActive') as FormControl;
  }
  private get deathDate(): Date {
    return this.person?.deathDate?.gregorian ? this.person.deathDate.gregorian : null;
  }
  private get birthDate(): Date {
    return this.person?.birthDate?.gregorian ? this.person.birthDate.gregorian : null;
  }
  /**Method to bind data to form */
  bindDataToForm(): void {
    Object.keys(this.engagementDetails).forEach(name => {
      if (name === 'skipContract') {
        name = 'isContractActive';
      }
      if (this.periodDetailForm.get(name)) {
        if (name === 'joiningDate') {
          const date = new Date(this.engagementDetails[name]['gregorian']);
          this.setJoiningDate(date, false);
          this.joiningDateFormControl.setValue(date, { emitEvent: false });
          const hdate = convertToHijriFormat(this.engagementDetails[name]['hijiri']);
          this.joiningDateHijiriForCancel = hdate;
          this.joiningDateFormControlHijiri.setValue(hdate, { emitEvent: false });
          this.joiningDateEntryFormat = this.engagementDetails[name]['entryFormat'];
          this.joiningDateEntryFormatChange.emit(this.joiningDateEntryFormat);
          if (this.engagementDetails[name]['entryFormat'] === this.typeHijira) {
            this.dateForm1.get('dateFormat.english').setValue(this.typeHijira);
            this.joiningDateHijiri = hdate;
            this.joiningDateHijiriChange.emit(this.joiningDateHijiri);
            this.periodDetailForm.get('joiningDate.entryFormat').setValue(this.typeHijira);
          } else {
            this.dateForm1.get('dateFormat.english').setValue(this.typeGregorian);
            this.periodDetailForm.get('joiningDate.entryFormat').setValue(this.typeGregorian);
          }
        } else if (name === 'leavingDate' && this.engagementDetails.leavingDate) {
          if (this.engagementDetails[name]['gregorian']) {
            const date = new Date(this.engagementDetails[name]['gregorian']);
            this.setLeavingDate(date);
            this.setMaxLeavingDate.emit();
            this.leavingDateFormControl.setValue(date, { emitEvent: false });
            const hdate = convertToHijriFormat(this.engagementDetails[name]['hijiri']);
            this.leavingDateHijiriForCancel = hdate;
            this.minHijiriLeavingDate = convertToHijriFormat(this.engagementDetails['joiningDate']['hijiri']);
            this.leavingDateFormControlHijiri.setValue(hdate, { emitEvent: false });
            if (this.engagementDetails[name]['entryFormat'] === this.typeHijira) {
              this.dateForm2.get('dateFormat.english').setValue(this.typeHijira);
              this.periodDetailForm.get('leavingDate.entryFormat').setValue(this.typeHijira);
            } else {
              this.dateForm2.get('dateFormat.english').setValue(this.typeGregorian);
              this.periodDetailForm.get('leavingDate.entryFormat').setValue(this.typeGregorian);
            }
          }
        } else if (name === 'leavingReason') {
          if (this.engagementDetails.leavingReason?.english) {
            this.leavingReason = this.engagementDetails.leavingReason.english;
            this.leavingReasonFormControl.setValue(this.leavingReason, { emitEvent: false });
          }
        } else if (name === 'isContributorActive') {
          this.ContributorActiveFormControl.setValue(this.engagementDetails.isContributorActive);
          if (!this.isDraftAvailable) this.ContributorActiveFormControl.disable();
          if (this.engagementDetails.isContributorActive) this.removeLeavingValidation();
        } else if (name === 'isContractActive') {
          this.ContractActiveFormControl.setValue(this.engagementDetails.skipContract);
          if (this.isDraftAvailable) this.contractActiveChange(this.engagementDetails.skipContract);
          else this.ContractActiveFormControl.disable();
        } else if (name !== 'penaltyIndicator' && name !== null && name)
          this.periodDetailForm.get(name).patchValue(this.engagementDetails[name]);
      }
    });
    if (this.engagementDetails.engagementPeriod?.length > 0 && this.periodDetailForm) {
      const contributorAbroad = this.periodDetailForm.get('contributorAbroad.english');
      if (
        this.engagementDetails.engagementPeriod.length > 0 &&
        this.engagementDetails.engagementPeriod[0].contributorAbroad
      )
        contributorAbroad.setValue('Yes');
      else contributorAbroad.setValue('No');
    }
    this.checkWageAdditionSection();
  }

  /**Method to check wage addition change */
  checkWageAdditionSection(): void {
    this.disableWageAddSection = checkWageAddSection(this.periodDetailForm);
    this.disableWageAddSectionChange.emit(this.disableWageAddSection);
  }
  detectChanges(): void {
    this.joiningDateFormControl.valueChanges
      .pipe(
        tap(() => this.checkWageAdditionSection()),
        filter(() => this.joiningDateFormControl.valid),
        distinctUntilChanged()
      )
      .subscribe(() => this.onJoiningDateChange());
    this.leavingDateFormControl.valueChanges
      .pipe(
        tap(() => this.checkWageAdditionSection()),
        filter(() => !this.leavingDateFormControl.invalid),
        distinctUntilChanged()
      )
      .subscribe(() => this.onLeavingDateChange());
    // detect changes in hijiri
    this.joiningDateFormControlHijiri.valueChanges
      .pipe(
        tap(() => this.checkWageAdditionSection()),
        filter(() => this.joiningDateFormControlHijiri.valid),
        distinctUntilChanged()
      )
      .subscribe(() => this.onJoiningDateChangeHijiri());
    this.leavingDateFormControlHijiri.valueChanges
      .pipe(
        tap(() => this.checkWageAdditionSection()),
        filter(() => this.leavingDateFormControlHijiri.valid),
        distinctUntilChanged()
      )
      .subscribe(() => this.onLeavingDateChangeHijiri());
  }

  /**Method to trigger or clear on joining date selection  */
  onJoiningDateChange(): void {
    const val = this.joiningDateFormControl.value; //show confirmation popup when joining date is changed in edit mode
    this.gethijiriLeavingDate(val); //minimum leaving date
    if (this.joiningDateFormControl.valid && !moment(val).isSame(this.joiningDate)) {
      if (
        this.engagementWageDetails.length > 0 &&
        this.periodDetailForm.get('joiningDate.entryFormat').value === this.typeGregorian &&
        this.periodDetailForm.get('joiningDate.gregorian') != null
      )
        this.showTemplate(this.changeJoiningDateTemplate);
      else {
        this.setJoiningDate(startOfDay(val));
        this.getDateEntry.emit(this.periodDetailForm.get('joiningDate').value);
        this.setWageValidation.emit();
        this.resetLeavingDateAndReason(this.engagementDetails?.leavingReason?.english);
        this.setLeavingDateValidation(startOfDay(val));
      }
    }
  }
  /**Method to trigger or clear on leaving date selection  */
  onLeavingDateChange(): void {
    const val = this.leavingDateFormControl.value; //show confirmation popup when joining date is changed in edit mode
    if (this.leavingDateFormControl.valid && val && !moment(val).isSame(this.leavingDate)) {
      if (this.engagementWageDetails.length > 0) this.showTemplate(this.changeLeavingDateTemplate);
      else {
        this.setLeavingDate(startOfDay(val));
        this.setWageValidation.emit();
        this.setWagePeriodEndDate.emit();
      }
    }
  }
  /** Method to trigger or clear on leaving reason selection*/
  onLeavingReasonChange(): void {
    const val = this.leavingReasonFormControl.value; //show confirmation popup when joining date is changed in edit mode
    if (this.leavingReasonFormControl.valid && val && val !== this.leavingReason) {
      if (this.engagementWageDetails.length > 0) this.showTemplate(this.changeLeavingReasonTemplate);
      else this.setLeavingDateForDead(val);
    }
    this.checkWageAdditionSection();
  }
  /** Method to set joining date*/
  setJoiningDate(newJoiningDate: Date, checkRequired = true): void {
    if (newJoiningDate) this.joiningDate = startOfDay(new Date(newJoiningDate));
    else this.joiningDate = null;
    this.joiningDateChange.emit(this.joiningDate);
    if (checkRequired)
      this.checkDocRequired.emit({
        joiningDate: this.joiningDate,
        isConActive: this.ContributorActiveFormControl.value,
        isContRequired: this.isContractRequired,
        joiningDateHijiri:
          this.dateForm1.get('dateFormat.english').value === this.typeHijira ? this.joiningDateHijiri : null
      });
  }
  /** Method to set leaving date*/
  setLeavingDate(date: Date): void {
    if (date) this.leavingDate = startOfDay(new Date(date));
    else this.leavingDate = null;
    this.leavingDateChange.emit(this.leavingDate);
  }

  ReopenEstablishmentAction() {
    if (this.disableTerminate) {
      this.ContributorActiveFormControl.setValue(false);
      this.ContributorActiveFormControl.disable();
      this.setContractInActive();
      this.isContractRequired = false;
      this.ContractActiveFormControl.setValue(false);
      this.ContractActiveFormControl.disable();
    }
  }
  /**Method tp enable or disable leaving input */
  enableLeavingDate(): void {
    if (
      this.inEditMode &&
      this.engagementDetails.leavingReason?.english === ContributorConstants.LEAVING_REASON_BACKDATED
    ) {
      this.disableLeavingDate = this.disableLeavingReason = true;
    } else if (
      this.leavingReasonFormControl &&
      ContributorConstants.DEAD_LEAVING_REASONS.indexOf(this.leavingReasonFormControl.value) !== -1 &&
      this.deathDate
    )
      this.disableLeavingDate = true;
    else this.disableLeavingDate = this.joiningDate ? false : true;
  }
  /** Method to set max and min leaving date validation based on death date, form submission */
  setLeavingDateValidation(minDate: Date, maxDate?: Date): void {
    if (this.periodDetailForm) {
      if (!this.ContributorActiveFormControl.value) {
        minDate = minDate ? startOfDay(new Date(minDate)) : null;
        maxDate = maxDate ? startOfDay(new Date(maxDate)) : null;
        if (minDate) minDate = moment(minDate).toDate();
        if (this.inEditMode) {
          if (this.deathDate) {
            maxDate = moment(this.engagementDetails.formSubmissionDate.gregorian).isBefore(this.deathDate)
              ? new Date(this.engagementDetails.formSubmissionDate.gregorian)
              : new Date(this.deathDate);
          } else if (this.engagementDetails.leavingDate?.gregorian) {
            maxDate =
              this.engagementDetails.leavingReason?.english === ContributorConstants.LEAVING_REASON_BACKDATED
                ? this.engagementDetails.leavingDate.gregorian
                : this.engagementDetails.formSubmissionDate.gregorian;
          } else {
            maxDate = this.backdatedContributor
              ? moment(this.engagementDetails.formSubmissionDate.gregorian)
                  .subtract(Number(getPeriodParam(this.isPrivate, true, this.systemParams)) + 1, 'month')
                  .endOf('month')
                  .toDate()
              : new Date(this.engagementDetails.formSubmissionDate.gregorian);
          }
        } else maxDate = this.deathDate ? this.deathDate : moment().toDate();
        this.minLeavingDate =
          this.ppaEstablishment && minDate < this.hijiriDateConst?.ppaMinGregorianDate
            ? new Date(startOfDay(this.hijiriDateConst?.ppaMinGregorianDate))
            : new Date(startOfDay(minDate));
        this.maxLeavingDate = new Date(startOfDay(maxDate));
        this.leavingReasonFormControl.setValidators([Validators.required]);
        this.leavingDateFormControlHijiri.setValidators([Validators.required]);
        if (!this.ppaEstablishment) {
          if (this.deathDate && this.maxLeavingDate < new Date(this.hijiriDateConst.gosiMaxHijiriNextDateInGregorian))
            this.setHijiriMaxLeavingDate(this.maxLeavingDate);
          this.leavingDateFormControl.setValidators([
            Validators.required,
            minDateValidator(this.minLeavingDate),
            maxDateValidator(this.maxLeavingDate)
          ]);
        } else if (
          this.deathDate &&
          this.maxLeavingDate < new Date(this.hijiriDateConst.ppaMaxHijiriNextDateInGregorian)
        )
          this.setHijiriMaxLeavingDate(this.maxLeavingDate);
      } else {
        this.leavingDateFormControl.clearValidators();
        this.leavingDateFormControlHijiri.clearValidators();
        this.leavingReasonFormControl.clearValidators();
      }
      this.enableLeavingDate();
      this.leavingDateFormControl.updateValueAndValidity({ emitEvent: false });
      this.leavingDateFormControlHijiri.updateValueAndValidity({ emitEvent: false });
      this.leavingReasonFormControl.updateValueAndValidity({ emitEvent: false });
    }
  }
  /**Method to handle contributor abroad radio based on gcc establishment and age  */
  setContributorAbroad(): void {
    if (this.periodDetailForm) {
      const contributorAbroad = this.periodDetailForm.get('contributorAbroad.english');
      if (contributorAbroad) {
        if (this.isGccEstablishment) this.setContributorAbroadForm('Yes', contributorAbroad);
        else {
          const startDateOfYear = startOfYear(new Date());
          const currentAge = this.birthDate ? moment(startDateOfYear).diff(moment(this.birthDate), 'years') : 0;
          const systemParam = this.isBeneficiary
            ? this.systemParams?.MAX_ELIGIBLE_BENEFICIARY_AGE
            : this.systemParams?.UI_TERMINATION_AGE;
          if (this.isBeneficiary) {
            //Abroad status will set default false if person is beneficiary and age above 65 years
            if (currentAge !== null && !Number.isNaN(currentAge) && systemParam && currentAge > systemParam)
              this.setContributorAbroadForm('No', contributorAbroad);
            else if (contributorAbroad.disabled) this.resetContributorAbroadForm(contributorAbroad);
          } else {
            if (currentAge !== null && !Number.isNaN(currentAge) && systemParam && currentAge >= systemParam)
              this.setContributorAbroadForm('No', contributorAbroad);
            else if (contributorAbroad.disabled) this.resetContributorAbroadForm(contributorAbroad);
          }
        }
      }
    }
  }
  /** Method to set contributor abroad form. */
  setContributorAbroadForm(value: string, form: AbstractControl) {
    form.setValue(value);
    form.disable({ emitEvent: false });
  }
  /** Method  to reset contributor abroad form. */
  resetContributorAbroadForm(form: AbstractControl) {
    form.reset();
    form.enable({ emitEvent: false });
  }
  /**Method to set joining date max and min date validation based on death date , form submission date */
  setJoiningDateValidation(): void {
    if (this.systemParams && this.periodDetailForm) {
      let minDate: Date;
      let minHijiriDate: string;
      let maxDate: Date;
      let maxHijiriDate: string;
      let monthDifference: number;
      monthDifference = this.engagementDetails?.formSubmissionMonthDifference
        ? this.engagementDetails?.formSubmissionMonthDifference
        : monthDiff(
            startOfMonth(this.engagementDetails?.joiningDate?.gregorian),
            startOfMonth(this.engagementDetails?.formSubmissionDate?.gregorian)
          );
      if (this.inEditMode) {
        if (this.deathDate) {
          moment(this.engagementDetails?.formSubmissionDate?.gregorian).isBefore(this.deathDate)
            ? ((maxDate = this.engagementDetails?.formSubmissionDate?.gregorian),
              (maxHijiriDate = this.engagementDetails?.formSubmissionDate?.hijiri))
            : ((maxDate = this.deathDate), (maxHijiriDate = this.person?.deathDate?.hijiri));
        } else if (this.engagementDetails?.leavingDate?.gregorian) {
          if (
            monthDifference === 1 &&
            this.engagementDetails?.leavingReason?.english === ContributorConstants.LEAVING_REASON_BACKDATED
          ) {
            minDate = moment(startOfMonth(this.engagementDetails?.formSubmissionDate?.gregorian))
              .subtract(1, 'month')
              .toDate();
            this.calendarService
              .addToHijiriDate(this.engagementDetails?.formSubmissionDate?.hijiri, 0, -1, 0)
              .subscribe(res => {
                minHijiriDate = startOfMonthHijiri(convertToHijriFormat(res?.hijiri));
              });
          }
          if (
            monthDifference > 1 &&
            this.engagementDetails.leavingReason?.english === ContributorConstants.LEAVING_REASON_BACKDATED
          ) {
            this.ppaEstablishment
              ? ((maxDate = this.engagementDetails.leavingDate.gregorian),
                (maxHijiriDate = convertToHijriFormat(this.engagementDetails?.leavingDate?.hijiri)))
              : ((maxDate = endOfMonth(subtractMonths(this.engagementDetails.formSubmissionDate.gregorian, 2))),
                this.calendarService
                  .addToHijiriDate(this.engagementDetails?.formSubmissionDate?.hijiri, 0, 2, 0)
                  .subscribe(res => {
                    maxHijiriDate = endOfMonthHijiri(convertToHijriFormat(res?.hijiri));
                  }));
            if (this.ppaEstablishment && this.engagementDetails.leavingDate.hijiri)
              this.maxstartDate = this.engagementDetails.leavingDate.hijiri;
          } else
            this.engagementDetails.leavingReason?.english === ContributorConstants.LEAVING_REASON_BACKDATED
              ? ((maxDate = this.engagementDetails.leavingDate.gregorian),
                (maxHijiriDate = convertToHijriFormat(this.engagementDetails?.leavingDate?.hijiri)))
              : ((maxDate = this.engagementDetails.formSubmissionDate.gregorian),
                (maxHijiriDate = convertToHijriFormat(this.engagementDetails?.formSubmissionDate?.hijiri)));
        } else {
          this.backdatedContributor
            ? ((maxDate = moment(this.engagementDetails.formSubmissionDate.gregorian)
                .subtract(Number(getPeriodParam(this.isPrivate, true, this.systemParams)) + 1, 'month')
                .endOf('month')
                .toDate()),
              this.calendarService
                .addToHijiriDate(
                  this.engagementDetails?.formSubmissionDate?.hijiri,
                  0,
                  Number(getPeriodParam(this.isPrivate, true, this.systemParams)) + 1,
                  0
                )
                .subscribe(res => {
                  minHijiriDate = endOfMonthHijiri(convertToHijriFormat(res?.hijiri));
                }))
            : ((maxDate = this.engagementDetails.formSubmissionDate.gregorian),
              (maxHijiriDate = convertToHijriFormat(this.engagementDetails.formSubmissionDate.hijiri)));
        }
        if (monthDifference !== 1) {
          minDate = moment(this.engagementDetails.formSubmissionDate.gregorian)
            .subtract(
              this.contributorType === ContributorTypesEnum.SAUDI && this.backdatedContributor
                ? Number(getPeriodParam(this.isPrivate, false, this.systemParams))
                : Number(getPeriodParam(this.isPrivate, true, this.systemParams)),
              'month'
            )
            .startOf('month')
            .toDate();
          this.calendarService
            .addToHijiriDate(
              this.engagementDetails?.formSubmissionDate?.hijiri,
              0,
              this.contributorType === ContributorTypesEnum.SAUDI && this.backdatedContributor
                ? Number(getPeriodParam(this.isPrivate, false, this.systemParams))
                : Number(getPeriodParam(this.isPrivate, true, this.systemParams)),
              0
            )
            .subscribe(res => {
              minHijiriDate = startOfMonthHijiri(convertToHijriFormat(res?.hijiri));
            });
        }
        // if ((!this.backdatedEngValidatorRequired && (this.contributorType === ContributorTypesEnum.SAUDI))  && !this.isPrivate) {
        //   minDate = this.ppaEstablishment
        //     ? this.hijiriDateConst?.ppaMinGregorianDate
        //     : startOfMonth(subtractMonths(moment(new Date()).toDate(), 24));
        // }
      } else {
        maxDate = this.deathDate ? this.deathDate : moment().toDate();
        if (this.contributorType === ContributorTypesEnum.SAUDI)
          minDate = this.ppaEstablishment
            ? this.hijiriDateConst?.ppaMinGregorianDate
            : this.systemParams.REG_CONT_MAX_BACKDATED_JOINING_DATE;
        else minDate = this.systemParams.REG_CONT_MAX_REGULAR_JOINING_DATE;
      }
      this.minJoiningDate = new Date(startOfDay(minDate));
      this.maxJoiningDate = new Date(startOfDay(maxDate));
      setTimeout(() => {
        if (!this.ppaEstablishment) {
          const inputDate = new Date(this.hijiriDateConst?.gosiMaxHijiriNextDateInGregorian);
          if (this.minJoiningDate < inputDate) this.setHijiriMinJoiningDate(this.minJoiningDate);
          if (this.maxJoiningDate < inputDate) this.setHijiriMaxJoiningDate(this.maxJoiningDate);
          this.joiningDateFormControl.setValidators([
            Validators.required,
            minDateValidator(this.minJoiningDate),
            maxDateValidator(this.maxJoiningDate)
          ]);
          this.joiningDateFormControl.updateValueAndValidity({ emitEvent: false });
        } else {
          if (this.inEditMode) this.setHijiriMinJoiningDate(this.minJoiningDate, minHijiriDate);
          if (this.minJoiningDate < this.hijiriDateConst?.ppaMinGregorianDate) {
            this.minJoiningDate = new Date(startOfDay(this.hijiriDateConst?.ppaMinGregorianDate));
          }
          if (this.maxJoiningDate < new Date(this.hijiriDateConst.ppaMaxHijiriNextDateInGregorian)) {
            this.setHijiriMaxJoiningDate(this.maxJoiningDate, maxHijiriDate);
          }
        }
      }, 1500);
    }
  }
  /** Method to handle active contributor switch change. */
  onContributorActiveChange(isContributorActive: boolean): void {
    if (isContributorActive) {
      this.leavingDateFormControlHijiri.setValue(null);
      this.leavingDateHijiriResetOnNull();
    }
    if (!isContributorActive && this.isContractRequired) this.showTemplate(this.contractRemovingTemplate);
    else this.contributorActiveChange(isContributorActive);
  }

  /** Method to handle active contract switch change. */
  onContractActiveChange(isContractActive: boolean): void {
    //console.log('toogle', isContractActive);
    if (!isContractActive) {
      this.periodDetailForm.get('isContractActive').setValue(isContractActive, { emitEvent: false });
    } else this.contractActiveChange(isContractActive);
    if (!isContractActive && this.isContractRequired) this.showTemplate(this.contractRemovingTemplate1);
    else this.contractActiveChange(isContractActive);
  }

  /** Method to set contributor active status. */
  setContributorActive(): void {
    this.ContributorActiveFormControl.setValue(true);
    this.checkWageAdditionSection();
    this.decline();
  }

  setContractActive(): void {
    this.ContractActiveFormControl.setValue(true);
    this.contractActiveChange(true);
    this.decline();
  }
  setContractInActive(): void {
    this.ContractActiveFormControl.setValue(false);
    this.contractActiveChange(false);
  }
  /** This method is to set leaving date as death date depeding leaving reason */
  contributorActiveChange(isContributorActive: boolean): void {
    if (this.modalRef) this.decline();
    if (isContributorActive) {
      if (this.periodDetailForm) this.removeLeavingValidation();
      this.setContractActive();
      //this.isContractRequired = this.ppaEstablishment ? false : true;
      this.ContractActiveFormControl.enable();
    } else {
      this.setLeavingDateValidation(this.joiningDate);
      this.setContractInActive();
      if (this.checkLegal) this.isContractRequired = false;
      this.ContractActiveFormControl.disable();
    }
    this.setWagePeriodEndDate.emit();
    this.checkDocRequired.emit({
      joiningDate: this.joiningDate,
      isConActive: isContributorActive,
      isContRequired: this.isContractRequired,
      joiningDateHijiri:
        this.dateForm1.get('dateFormat.english').value === this.typeHijira ? this.joiningDateHijiri : null
    });
    this.checkWageAdditionSection();
  }
  /** This method is to set leaving date as death date depeding leaving reason*/

  contractActiveChange(isContractActive: boolean): void {
    this.checkDocRequired.emit({
      joiningDate: this.joiningDate,
      isConActive: this.ContributorActiveFormControl.value,
      isContRequired: isContractActive,
      joiningDateHijiri:
        this.dateForm1.get('dateFormat.english').value === this.typeHijira ? this.joiningDateHijiri : null
    });
    if (this.modalRef) this.decline();
  }
  setLeavingDateForDead(value: string): void {
    this.leavingReason = value;
    if (ContributorConstants.DEAD_LEAVING_REASONS.indexOf(value) !== -1 && this.deathDate) {
      this.leavingDateFormControl.setValue(new Date(this.deathDate), { emitEvent: false });
      this.setLeavingDate(this.deathDate);
      this.disableLeavingDate = true;
    } else if (this.joiningDate) this.disableLeavingDate = false;
  }
  /** This method is to clear leaving date and reson form validation when the isContributorActive toggle is true   */
  removeLeavingValidation(): void {
    if (this.periodDetailForm) {
      if (this.leavingDateFormControl) this.leavingDateFormControl.clearValidators();
      if (this.leavingDateFormControlHijiri) this.leavingDateFormControlHijiri.clearValidators();
      if (this.leavingReasonFormControl) this.leavingReasonFormControl.clearValidators();
      this.resetLeavingDateAndReason(this.engagementDetails?.leavingReason?.english);
    }
  }
  /** This method is to reset leaving leaving reason and leaving date   */
  resetLeavingDateAndReason(leavingReason: string): void {
    if (!(this.inEditMode && leavingReason === ContributorConstants.LEAVING_REASON_BACKDATED)) {
      this.setLeavingDate(null);
      this.leavingReason = null;
      this.leavingDateFormControl.reset();
      this.leavingDateFormControlHijiri.reset();
      this.periodDetailForm.get('leavingReason').reset();
      // this.periodDetailForm.get('leavingDate.entryFormat').reset();
      this.resetHijiriLeavingDate.emit();
    }
  }
  /** This method is called when confirm joining date change in edit mode popup is confirmed.   */
  confirmJoiningDateChange(joiningDate): void {
    this.resetLeavingDateAndReason(this.engagementDetails?.leavingReason?.english);
    this.setJoiningDate(joiningDate);
    this.setLeavingDateValidation(this.joiningDate);
    this.resetEngagementWages.emit();
    this.checkWageAdditionSection();
    this.modalRef.hide();
  }
  /** Method to cancel joining date change. */
  cancelJoiningDateChange(): void {
    this.joiningDateFormControl.setValue(startOfDay(this.joiningDate), { emitEvent: false });
    this.joiningDateFormControlHijiri.patchValue(this.joiningDateHijiriForCancel, { emitEvent: true });
    this.modalRef.hide(); //to set joining date selected after popup confirmation
  }
  /** Method to show template. */
  showTemplate(template: TemplateRef<HTMLElement>): void {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  /** Method to decline modal. */
  decline(): void {
    this.modalRef.hide();
  }
  /** This method is called when confirm joining date change in edit mode popup is confirmed.   */
  confirmLeavingDateChange(leavingDate): void {
    this.setLeavingDate(startOfDay(new Date(leavingDate)));
    this.leavingReason = null;
    this.periodDetailForm.get('leavingReason').reset();
    this.resetDateFormFromConfirmLeavingdate.emit();
    this.resetEngagementWages.emit();
    this.checkWageAdditionSection();
    this.modalRef.hide();
  }
  /** This method is called when confirm joining date change in edit mode popup is canceled. */
  cancelLeavingDateChange(): void {
    this.leavingDateFormControl.setValue(startOfDay(this.leavingDate), { emitEvent: false });
    this.leavingDateFormControlHijiri.patchValue(this.leavingDateHijiriForCancel, { emitEvent: true });
    this.modalRef.hide();
  }
  /** This method is called when confirm leaving reason change popup is confirmed.   */
  confirmLeavingReasonChange(): void {
    this.setLeavingDateForDead(this.leavingReasonFormControl.value);
    this.resetEngagementWages.emit();
    this.checkWageAdditionSection();
    this.decline();
  }
  /** This method is called when confirm leaving reason change popup is canceled.*/
  cancelLeavingReasonChange(): void {
    this.leavingReasonFormControl.setValue(this.leavingReason, { emitEvent: false });
    this.leavingReasonFormControl.updateValueAndValidity({ emitEvent: false });
    this.periodDetailForm.updateValueAndValidity({ emitEvent: false });
    this.decline();
  }

  // handle hijiri

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
    this.joiningDateFormControlHijiri.setValidators([Validators.required]);
    this.joiningDateFormControlHijiri.updateValueAndValidity({ emitEvent: false });
    this.periodDetailForm.get('joiningDate.gregorian').setValue(null, { emitEvent: false });
    this.periodDetailForm.get('joiningDate.hijiri').setValue(null, { emitEvent: false });
    this.joiningDateHijiriResetOnNull();
    this.dateForm1.get('dateFormat.english').setValue(type);
    this.periodDetailForm.get('joiningDate.entryFormat').setValue(type);
    if (type == this.typeGregorian) {
      this.joiningDateFormControl.setValidators([Validators.required]);
      this.joiningDateFormControl.updateValueAndValidity({ emitEvent: false });
    }
  }
  switchCalendarType1(type) {
    if (!this.disableLeavingDate) {
      this.periodDetailForm.get('leavingDate.gregorian').setValue(null);
      this.periodDetailForm.get('leavingDate.hijiri').setValue(null);
      this.leavingDateHijiriResetOnNull();
      this.dateForm2.get('dateFormat.english').setValue(type);
      this.periodDetailForm.get('leavingDate.entryFormat').setValue(type);
    }
  }

  // method to get minimum leaving date and set hijiri joining date to form
  gethijiriLeavingDate(gregorianDate: Date): any {
    this.lookupService.getHijriDate(gregorianDate).subscribe(res => {
      this.minHijiriLeavingDate = convertToHijriFormat(res.hijiri);
      this.joiningDateEntryFormat = this.periodDetailForm.get('joiningDate.entryFormat').value;
      this.joiningDateEntryFormatChange.emit(this.joiningDateEntryFormat);
      this.joiningDateHijiri =
        this.joiningDateEntryFormat == this.typeGregorian
          ? convertToHijriFormat(res.hijiri)
          : this.periodDetailForm.get('joiningDate.hijiri').value;
      this.joiningDateHijiriChange.emit(this.joiningDateHijiri);
    });
  }

  setHijiriMaxJoiningDate(gregorianDate: Date, maxHijiriDate?: string): any {
    if (maxHijiriDate) {
      this.maxstartDate = maxHijiriDate;
    }
    this.lookupService.getHijriDate(gregorianDate).subscribe(res => {
      this.maxstartDate = convertToHijriFormat(res.hijiri);
    });
  }
  setHijiriMaxLeavingDate(gregorianDate: Date): any {
    this.lookupService.getHijriDate(gregorianDate).subscribe(res => {
      this.maxHijiriLeavingDate = convertToHijriFormat(res.hijiri);
    });
  }
  setHijiriMinJoiningDate(gregorianDate: Date, minHijiriDate?: string): any {
    if (minHijiriDate) {
      this.minStartDate = minHijiriDate;
    } else {
      this.lookupService.getHijriDate(gregorianDate).subscribe(res => {
        this.minStartDate = convertToHijriFormat(res.hijiri);
      });
    }
  }

  onJoiningDateChangeHijiri(): void {
    const val = this.joiningDateFormControlHijiri.value; //show confirmation popup when joining date is changed in edit mode
    this.minHijiriLeavingDate = val;
    const actualDate = convertToHijriFormat(val);
    this.joiningDateHijiri = actualDate;
    if (val) {
      this.calendarService
        .getGregorianDate(actualDate)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (this.joiningDateFormControlHijiri.valid && !moment(res.gregorian).isSame(this.joiningDate)) {
            if (
              this.engagementWageDetails.length > 0 &&
              this.periodDetailForm.get('joiningDate.entryFormat').value === this.typeHijira &&
              this.periodDetailForm.get('joiningDate.hijiri') != null
            ) {
              this.showTemplate(this.changeJoiningDateHijriTemplate);
            } else {
              this.joiningDateHijiriForCancel = val;
              this.periodDetailForm.get('joiningDate.gregorian').setValue(res.gregorian);
              this.setJoiningDate(startOfDay(res.gregorian));
              this.setWageValidation.emit();
              this.resetLeavingDateAndReason(this.engagementDetails?.leavingReason?.english);
              this.setLeavingDateValidation(startOfDay(res.gregorian));
            }
          }
        });
    }
  }

  onLeavingDateChangeHijiri(): void {
    const val = this.leavingDateFormControlHijiri.value; //show confirmation popup when joining date is changed in edit mode
    const actualDate = convertToHijriFormat(val);
    this.calendarService.getGregorianDate(actualDate).subscribe(res => {
      if (this.leavingDateFormControlHijiri.valid && val && !moment(res.gregorian).isSame(this.leavingDate)) {
        if (this.engagementWageDetails.length > 0) this.showTemplate(this.changeLeavingDateHijiriTemplate);
        else {
          this.leavingDateHijiriForCancel = val;
          this.periodDetailForm.get('leavingDate.gregorian').setValue(res.gregorian);
          this.setLeavingDate(startOfDay(res.gregorian));
          this.setWageValidation.emit();
          this.setWagePeriodEndDate.emit();
        }
      }
    });
  }

  // joining date popup confirm
  confirmJoiningDateHijiriChange(joiningDate): void {
    this.joiningDateHijiriForCancel = joiningDate;
    this.resetLeavingDateAndReason(this.engagementDetails?.leavingReason?.english);
    this.calendarService.getGregorianDate(convertToHijriFormat(joiningDate)).subscribe(res => {
      this.setJoiningDate(res.gregorian);
      this.joiningDateHijiri = joiningDate;
      this.joiningDateHijiriChange.emit(this.joiningDateHijiri);
      this.setLeavingDateValidation(this.joiningDate);
      this.resetEngagementWages.emit();
      this.periodDetailForm.get('joiningDate.gregorian').setValue(res.gregorian);
      this.checkWageAdditionSection();
      this.modalRef.hide();
    });
  }

  confirmLeavingDateHijiriChange(leavingDate): void {
    this.leavingDateHijiriForCancel = leavingDate;
    this.calendarService.getGregorianDate(convertToHijriFormat(leavingDate)).subscribe(res => {
      this.setLeavingDate(startOfDay(new Date(res.gregorian)));
      this.leavingReason = null;
      this.periodDetailForm.get('leavingReason').reset();
      this.resetDateFormFromConfirmLeavingdate.emit();
      this.resetEngagementWages.emit();
      this.periodDetailForm.get('leavingDate.gregorian').setValue(res.gregorian);
      this.checkWageAdditionSection();
      this.modalRef.hide();
    });
  }

  leavingDateHijiriResetOnNull() {
    this.setLeavingDate(null);
    this.setWageValidation.emit();
    this.setWagePeriodEndDate.emit();
  }

  joiningDateHijiriResetOnNull() {
    this.setJoiningDate(null);
    this.setWageValidation.emit();
    this.resetLeavingDateAndReason(this.engagementDetails?.leavingReason?.english);
    this.setLeavingDateValidation(null);
  }
}
