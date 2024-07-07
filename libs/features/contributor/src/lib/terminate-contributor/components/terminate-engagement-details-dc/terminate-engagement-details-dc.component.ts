/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BankAccount,
  CalendarService,
  CalendarTypeEnum,
  DocumentItem,
  GosiCalendar,
  LovList,
  NotificationService,
  addMonths,
  convertToHijriFormat,
  convertToHijriFormatAPI,
  convertToStringDDMMYYYY,
  endOfMonth,
  endOfMonthHijiri,
  hijiriToJSON,
  monthDiff,
  monthDiffHijiri,
  parseToHijiriFromApi,
  startOfDay,
  startOfMonth,
  startOfMonthHijiri,
  subtractDays,
  subtractMonths

} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ContributorConstants } from '../../../shared/constants';
import { PersonTypesEnum, TerminationType, TransactionId } from '../../../shared/enums';
import { TerminationReason } from '../../../shared/enums/termination-reason';
import {
  Contributor,
  EngagementDetails,
  HijiriConstant,
  PersonalInformation,
  SystemParameter,
  TerminateContributorDetails
} from '../../../shared/models';

@Component({
  selector: 'cnt-terminate-engagement-details-dc',
  templateUrl: './terminate-engagement-details-dc.component.html',
  styleUrls: ['./terminate-engagement-details-dc.component.scss']
})
export class TerminateEngagementDetailsDcComponent implements OnInit, OnChanges {
  /** Local variables */
  terminateDetailsForm: FormGroup;
  secondmentDetailsForm: FormGroup;
  studyLeaveForm: FormGroup;
  disableLeavingDate = false;
  minLeavingDate: Date;
  maxLeavingDate: Date;
  isAppPrivate: boolean;
  terminateTransactionId = TransactionId.TERMINATE_CONTRIBUTOR;
  secondmentTransactionId = TransactionId.REGISTER_SECONDMENT;
  studyLeaveTransactionId = TransactionId.REGISTER_STUDY_LEAVE;
  queryParams = '';
  personNin: any[] = [];
  nicVar: boolean;
  leavingDeathReason: boolean = false;
  terminationReason = TerminationReason;

  /** Input variables */
  @Input() engagement: EngagementDetails;
  @Input() terminationDetails: TerminateContributorDetails;
  @Input() leavingReasonList: LovList;
  @Input() parentForm: FormGroup;
  @Input() systemParameter: SystemParameter;
  @Input() contributor: Contributor;
  @Input() isEditMode: boolean;
  @Input() documentList: DocumentItem[];
  @Input() engagementId: number;
  @Input() referenceNo: number;
  @Input() uuid: string;
  @Input() isDocumentsRequired: boolean;
  @Input() nicDetails: PersonalInformation;
  @Input() isAdminReEdit: boolean;
  @Input() backdatedEngValidatorRequired: boolean;
  @Input() hijiriDateConst: HijiriConstant;
  @Input() ppaEstablishment = false;
  @Input() ppaCalenderShiftDate: GosiCalendar;
  @Input() sysDate: GosiCalendar;
  @Input() certificationTypeAbroad: LovList;
  @Input() certificationTypeNoAbroad: LovList;
  @Input() SecondmentEstType: LovList;
  @Input() secondmentEstablishments: LovList;
  @Input() bankNameList$: Observable<LovList>;
  @Input() bankDetails: BankAccount;
  @Input() isBankDetailsPending: boolean;

  /** Output variables. */
  @Output() refreshDoc: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() isDocumentsRequiredChange: EventEmitter<boolean> = new EventEmitter();
  @Output() nicCall: EventEmitter<object> = new EventEmitter();
  @Output() leavingReasonSelected: EventEmitter<string> = new EventEmitter();
  @Output() clearError = new EventEmitter<void>();
  @Output() IBANChange = new EventEmitter<string>(null);

  certificationList: LovList;
  dateForm1: FormGroup;
  secondmentDateForm: FormGroup;
  studyLeaveDateForm: FormGroup;
  typeGregorian = CalendarTypeEnum.GREGORIAN;
  typeHijira = CalendarTypeEnum.HIJRI;
  minLeavingDateH: string;
  checkPrivate: boolean;
  calendarCheck: string;
  maxHijLeavingDate: string;
  minSecondmentStartDate: Date;
  maxSecondmentStartDate: Date;
  minSecondmentStartDateH: string;
  maxSecondmentStartDateH: string;
  minSecondmentEndDate: Date;
  maxSecondmentEndDate: Date;
  minSecondmentEndDateH: string;
  maxSecondmentEndDateH: string;
  previousDayOfSecondment: GosiCalendar;
  disableSecEndDate: boolean;
  excludedEstablishment = 'Loaned to Excluded establishment ';
  studyTypeList: LovList = {
    items: [
      {
        value: { english: 'Yes', arabic: 'نعم' },
        sequence: 1
      },
      {
        value: { english: 'No', arabic: 'لا' },
        sequence: 2
      }
    ]
  };
  nxtDayOfJoiningDate: GosiCalendar;
  isBankEdit: boolean;

  /** Creates an instance of TerminateEngagementDetailsDcComponent. */
  constructor(
    private fb: FormBuilder,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly calendarService: CalendarService,
    readonly notificationService: NotificationService
  ) {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
  }

  ngOnInit(): void {

    //this.ppaEstablishment = this.engagement?.ppaIndicator;
    this.dateForm1 = this.createDateTypeForm();
    if (this.engagement?.secondment || this.engagement?.studyLeave) {
      this.isDocumentsRequired = true;
      this.isDocumentsRequiredChange.emit(this.isDocumentsRequired);
    }
    // this.minLeavingDateH = parseToHijiriFromApi(this.engagement?.joiningDate?.hijiri);
    this.dateForm1?.get('dateFormat')?.get('english').setValue(this.typeGregorian);
    this.setJoiningdate();
    // this.maxHijLeavingDate = this.ppaEstablishment
    //   ? this.hijiriDateConst.ppaMaxHijirDate
    //   : this.hijiriDateConst.gosiMaxHijiriDate;
    this.terminateDetailsForm.get('leavingDate.entryFormat').setValue(this.typeGregorian);
    if (this.isEditMode) {
      // this.minLeavingDateH = parseToHijiriFromApi(this.terminationDetails?.joiningDate?.hijiri);
      if (this.terminationDetails.leavingDate.entryFormat === this.typeHijira) {
        this.dateForm1?.get('dateFormat')?.get('english').setValue(this.typeHijira);
        this.terminateDetailsForm.get('leavingDate.entryFormat').setValue(this.typeHijira);
        this.switchCalendarType(this.typeHijira, false);
      } else {
        this.dateForm1?.get('dateFormat')?.get('english').setValue(this.typeGregorian);
        this.terminateDetailsForm.get('leavingDate.entryFormat').setValue(this.typeGregorian);
        this.switchCalendarType(this.typeGregorian, false);
      }
    } else {
      // this.minLeavingDateH = parseToHijiriFromApi(this.engagement?.joiningDate?.hijiri);
      this.dateForm1?.get('dateFormat')?.get('english').setValue(this.typeGregorian);
      this.terminateDetailsForm.get('leavingDate.entryFormat').setValue(this.typeGregorian);
      if (this.ppaEstablishment) this.handleTerminationDateForPPA();
    }

    if (this.isAppPrivate) {
      this.checkPrivate = true;
    }
  }
  handleTerminationDateForPPA() {
    if (
      !this.isEditMode &&
      moment(this.engagement?.joiningDate?.gregorian).isSameOrBefore(moment(this.ppaCalenderShiftDate.gregorian))
    ) {
      this.minLeavingDateH = parseToHijiriFromApi(this.engagement?.joiningDate?.hijiri);
      this.maxHijLeavingDate = this.hijiriDateConst.ppaMaxHijirDate;
      this.minLeavingDate = startOfDay(this.ppaCalenderShiftDate?.gregorian);
    }
    if (
      this.isEditMode &&
      moment(this.terminationDetails?.joiningDate?.gregorian).isBefore(moment(this.ppaCalenderShiftDate.gregorian))
    ) {
      // this.maxHijLeavingDate = this.hijiriDateConst.ppaMaxHijirDate;
      this.minLeavingDate = startOfDay(this.ppaCalenderShiftDate?.gregorian);
    }
    if (
      !this.isEditMode &&
      moment(this.engagement?.joiningDate?.gregorian).isAfter(moment(this.ppaCalenderShiftDate.gregorian))
    ) {
      // this.dateForm1?.get('dateFormat')?.get('english').disable();
      this.switchCalendarType(this.typeGregorian);
      // this.dateForm1.updateValueAndValidity();
      this.minLeavingDateH = endOfMonthHijiri(this.hijiriDateConst.ppaMaxHijirDate);
      this.maxHijLeavingDate = startOfMonthHijiri(this.hijiriDateConst.ppaMaxHijirDate);
      this.minLeavingDate = startOfDay(this.engagement?.joiningDate?.gregorian);
      this.maxLeavingDate = new Date();
    }
    // if (
    //   this.isEditMode &&
    //   moment(this.terminationDetails?.joiningDate?.gregorian).isAfter(moment(this.ppaCalenderShiftDate.gregorian))
    // ) {
    //   this.dateForm1?.get('dateFormat')?.get('english').disable();
    //   this.switchCalendarType(this.typeGregorian);
    //   this.dateForm1.updateValueAndValidity();
    // }
    if (moment(new Date()).isBefore(moment(this.ppaCalenderShiftDate.gregorian))) {
      // this.dateForm1?.get('dateFormat')?.get('english').disable();
      this.switchCalendarType(this.typeHijira);
      // this.dateForm1.updateValueAndValidity();
      this.maxLeavingDate = moment(
        this.isEditMode ? this.terminationDetails?.joiningDate?.gregorian : this.engagement?.joiningDate?.gregorian
      ).toDate();
    }
    if (this.parentForm.get('terminateDetails')) this.parentForm.removeControl('terminateDetails');
    this.parentForm.addControl('terminateDetails', this.terminateDetailsForm);
  }

  /** Method to handle the changes in input variables. */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.engagement && changes.engagement.currentValue) {
      this.terminateDetailsForm = this.createTerminateForm();
      this.detectChange();
      if (this.systemParameter) this.initializeTerminateForm();
    }
    if (changes.terminationDetails && changes.terminationDetails.currentValue) {
      this.terminateDetailsForm = this.createTerminateForm();
      this.detectChange();
      if (this.systemParameter) this.initializeTerminateForm();
    }
    if (changes.systemParameter && changes.systemParameter.currentValue) {
      if ((!changes.engagement && this.engagement) || (!changes.terminationDetails && this.terminationDetails))
        this.initializeTerminateForm();
    }
    if (changes.nicDetails && changes.nicDetails.currentValue) {
      this.setLeavingDate();
    }
    if (changes.ppaCalenderShiftDate && changes.ppaCalenderShiftDate.currentValue) {
      this.ppaCalenderShiftDate = changes.ppaCalenderShiftDate.currentValue;
      // if (this.ppaEstablishment) this.handleTerminationDateForPPA();
    }
    if (this.engagement?.secondment) {
      this.leavingReasonList.items = this.leavingReasonList?.items.filter(
        eachReason => eachReason?.value?.english !== this.terminationReason.STUDYLEAVE_END
      );
    }
    if (this.engagement?.studyLeave) {
      this.leavingReasonList.items = this.leavingReasonList?.items.filter(
        eachReason => eachReason?.value?.english !== this.terminationReason.SECONDMENT_END
      );
    }
    if (this.isEditMode && this.leavingReasonList) {
      this.leavingReasonList.items = this.leavingReasonList?.items.filter(
        eachReason =>
          eachReason?.value?.english !== this.terminationReason.SECONDMENT &&
          eachReason?.value?.english !== this.terminationReason.STUDYLEAVE
      );
    }

  }

  /** Method to create engagement details form. */
  createTerminateForm() {
    return this.fb.group({
      joiningDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null, { validators: Validators.required }]
      }),
      leavingDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null, { validators: null }],
        entryFormat: [null]
      }),
      leavingReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      penaltyDisclaimer: [
        { value: this.isEditMode, disabled: this.isEditMode },
        { validators: !this.ppaEstablishment ? Validators.requiredTrue : null }
      ]
    });
  }
  createSecondmentForm() {
    return this.fb.group({
      secondmentStartDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null, { validators: Validators.required }],
        entryFormat: [this.typeGregorian]
      }),
      secondmentEndDate: this.fb.group({
        gregorian: [null, { validators: null }],
        hijiri: [null, { validators: null }],
        entryFormat: [this.typeGregorian]
      }),
      establishmentType: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      establishmentName: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      establishmentId: [null]
    });
  }

  createDateTypeForm() {
    return this.fb.group({
      dateFormat: this.fb.group({
        english: [this.typeGregorian, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [this.typeHijira, { validators: Validators.required, updateOn: 'blur' }]
      })
    });
  }
  createSecondmentDateForm() {
    return this.fb.group({
      startDateFormat: [this.typeGregorian, { validators: Validators.required, updateOn: 'blur' }],
      endDateFormat: [this.typeGregorian, { validators: Validators.required, updateOn: 'blur' }]
    });
  }

  createStudyLeaveForm() {
    return this.fb.group({
      studyInsideSaudi: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      certification: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      studyLeaveStartDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null, { validators: Validators.required }],
        entryFormat: [this.typeGregorian]
      })
    });
  }

  createStudyLeaveDateForm() {
    return this.fb.group({
      startDateFormat: [this.typeGregorian, { validators: Validators.required, updateOn: 'blur' }]
    });
  }

  switchStudyStartDateType(type) {
    this.studyLeaveDateForm?.get('startDateFormat')?.setValue(type);
    this.studyLeaveForm?.get('studyLeaveStartDate').reset();
    this.studyLeaveForm?.get('studyLeaveStartDate')?.get('entryFormat')?.setValue(type);
    this.terminateDetailsForm.get('leavingDate').reset();
    this.setAndUpdateValidators(type, this.studyLeaveForm.get('studyLeaveStartDate'));
  }

  certificateType(data) {
    if (data && this.studyLeaveForm?.get('certification')?.get('english').value != null) {
      this.studyLeaveForm?.get('certification').reset();
    }
    this.certificationList =
      this.studyLeaveForm?.get('studyInsideSaudi')?.get('english').value === 'No'
        ? this.certificationTypeAbroad
        : this.certificationTypeNoAbroad;
  }

  setStudyLeaveDetails() {
    if (this.terminateDetailsForm?.get('secondmentDetails')) {
      this.terminateDetailsForm.removeControl('secondmentDetails');
    }
    if (this.terminateDetailsForm?.get('studyLeaveDetails')) {
      this.terminateDetailsForm.removeControl('studyLeaveDetails');
    }
    this.terminateDetailsForm.get('leavingDate').reset();
    this.disableLeavingDate = true;
    this.dateForm1?.get('dateFormat')?.get('english').disable();
    this.studyLeaveForm = this.createStudyLeaveForm();
    this.studyLeaveForm.get('studyInsideSaudi.english').setValue('Yes');
    this.certificationList = this.certificationTypeNoAbroad;
    this.terminateDetailsForm.addControl('studyLeaveDetails', this.studyLeaveForm);
    this.studyLeaveDateForm = this.createStudyLeaveDateForm();
    this.studyLeaveDateForm?.get('startDateFormat').setValue(this.typeGregorian);
    this.studyLeaveDateForm.get('secondmentStartDate')?.get('gregorian')?.setValidators([Validators.required]);
    this.setDatesRange();
  }

  studyLeaveStartDateGSelected() {
    // To set previous day of studyleave start date as termination date
    if (this.studyLeaveForm.get('studyLeaveStartDate')?.get('gregorian')?.value) {
      const formattedStartDateG = moment(
        this.studyLeaveForm.get('studyLeaveStartDate')?.get('gregorian')?.value
      ).format('YYYY-MM-DD');
      this.calendarService.addToGregorianDate(formattedStartDateG, 0, 0, -1).subscribe(res => {
        if (res) {
          this.previousDayOfSecondment = res;
          this.terminateDetailsForm
            .get('leavingDate')
            ?.get('gregorian')
            ?.setValue(moment(this.previousDayOfSecondment.gregorian).toDate());
          this.terminateDetailsForm
            .get('leavingDate')
            ?.get('hijiri')
            ?.setValue(convertToHijriFormat(this.previousDayOfSecondment.hijiri));
        }
        // if startDate G = calendershiftDateG => terminationDate, which is previousDay Of startDate, can only be in hijiri.
        if (
          moment(startOfDay(this.studyLeaveForm.get('studyLeaveStartDate')?.get('gregorian')?.value)).isSame(
            startOfDay(this.ppaCalenderShiftDate?.gregorian)
          )
        ) {
          this.terminateDetailsForm.get('leavingDate.entryFormat').setValue(this.typeHijira);
          this.dateForm1?.get('dateFormat')?.get('english').setValue(this.typeHijira);
        } else {
          this.terminateDetailsForm.get('leavingDate.entryFormat').setValue(this.typeGregorian);
          this.dateForm1?.get('dateFormat')?.get('english').setValue(this.typeGregorian);
        }
      });
      this.setAndUpdateValidators(this.typeGregorian, this.studyLeaveForm.get('studyLeaveStartDate'));
      //  gregorian min and max studyleave end date
      this.minSecondmentEndDate =
        this.studyLeaveForm?.get('studyLeaveStartDate')?.get('gregorian')?.value > this.ppaCalenderShiftDate.gregorian
          ? this.studyLeaveForm?.get('studyLeaveStartDate')?.get('gregorian')?.value
          : this.ppaCalenderShiftDate.gregorian;
      // max end date can be future date
      // this.maxSecondmentEndDate = new Date();
    }
    //  Hijiri min and max studyleave end date
    this.calendarService
      .getHijiriDate(this.studyLeaveForm.get('studyLeaveStartDate')?.get('gregorian')?.value)
      .subscribe(res => {
        this.minSecondmentEndDateH = convertToHijriFormat(res.hijiri);
      });
    // this.maxSecondmentEndDateH = this.ppaCalenderShiftDate.hijiri;
    this.maxSecondmentEndDateH = this.systemParameter.REG_CONT_MAX_END_DATE_H_PPA;
  }

  studyLeaveStartDateHSelected() {
    if (this.studyLeaveForm.get('studyLeaveStartDate')?.get('hijiri')?.value) {
      this.calendarService
        .getGregorianDate(this.studyLeaveForm.get('studyLeaveStartDate')?.get('hijiri')?.value)
        .subscribe(gregDate => {
          //this.studyLeaveForm?.get('studyLeaveStartDate')?.get('gregorian').setValue(gregDate?.gregorian);
          //  gregorian min and max studyleave end date
          this.minSecondmentEndDate =
            gregDate?.gregorian > this.ppaCalenderShiftDate.gregorian
              ? gregDate?.gregorian
              : this.ppaCalenderShiftDate.gregorian;
          // max end date can be future date
        });
      const formattedStartDateH = convertToHijriFormatAPI(
        this.studyLeaveForm.get('studyLeaveStartDate')?.get('hijiri')?.value
      );
      this.calendarService.addToHijiriDate(formattedStartDateH, 0, 0, -1).subscribe(res => {
        if (res) {
          this.previousDayOfSecondment = res;
          this.terminateDetailsForm
            .get('leavingDate')
            ?.get('hijiri')
            ?.setValue(convertToHijriFormat(this.previousDayOfSecondment.hijiri));
          this.terminateDetailsForm.get('leavingDate.entryFormat').setValue(this.typeHijira);
          this.dateForm1?.get('dateFormat')?.get('english').setValue(this.typeHijira);
          this.terminateDetailsForm
            .get('leavingDate')
            ?.get('gregorian')
            ?.setValue(moment(this.previousDayOfSecondment.gregorian).toDate());
        }
      });
      this.setAndUpdateValidators(this.typeHijira, this.studyLeaveForm.get('studyLeaveStartDate'));
      //  Hijiri min and max studyleave end date
      this.minSecondmentEndDateH = this.studyLeaveForm?.get('studyLeaveStartDate')?.get('hijiri')?.value;
      this.maxSecondmentEndDateH = this.systemParameter.REG_CONT_MAX_END_DATE_H_PPA;
      // this.maxSecondmentEndDateH = this.hijiriDateConst.ppaMaxHijirDate;
    }
  }

  /** Method to initialize terminate form. */
  initializeTerminateForm(): void {
    const joiningDate: GosiCalendar = this.isEditMode
      ? this.terminationDetails.joiningDate
      : this.engagement.joiningDate;
    if (joiningDate && joiningDate.gregorian) {
      this.terminateDetailsForm.get('joiningDate.gregorian').setValue(moment(joiningDate.gregorian).toDate());
      if (!this.nxtDayOfJoiningDate?.gregorian) this.getNxtDayOfJoiningDate();
    }
    if (this.isEditMode) {
      if (this.terminationDetails.leavingDate.entryFormat === this.typeHijira) {
        if (this.terminationDetails.leavingDate && this.terminationDetails.leavingDate.hijiri)
          this.terminateDetailsForm
            .get('leavingDate.hijiri')
            .setValue(convertToHijriFormat(this.terminationDetails.leavingDate.hijiri)),
            { emitEvent: false };
      } else {
        if (this.terminationDetails.leavingDate && this.terminationDetails.leavingDate.gregorian)
          this.terminateDetailsForm
            .get('leavingDate.gregorian')
            .setValue(moment(this.terminationDetails.leavingDate.gregorian).toDate(), { emitEvent: false });
      }
      if (this.terminationDetails.leavingReason && this.terminationDetails.leavingReason.english)
        this.terminateDetailsForm.get('leavingReason').setValue(this.terminationDetails.leavingReason);
      if (
        ContributorConstants.DEAD_LEAVING_REASONS.indexOf(
          this.terminateDetailsForm.get('leavingReason.english').value
        ) === -1
      ) {
        this.leavingDeathReason = true;
        this.nicVar = false;
        this.nicCallParam();
      }
      if (this.contributor) this.checkLeavingReason(true);
    }
    if (this.parentForm?.get('terminateDetails')) {
      this.parentForm.removeControl('terminateDetails');
    }
    this.parentForm.addControl('terminateDetails', this.terminateDetailsForm);
    this.setLeavingDateValidation();
  }
  setSecondmentDetails() {
    if (this.terminateDetailsForm?.get('secondmentDetails')) {
      this.terminateDetailsForm.removeControl('secondmentDetails');
    }
    if (this.terminateDetailsForm?.get('studyLeaveDetails')) {
      this.terminateDetailsForm.removeControl('studyLeaveDetails');
    }
    this.terminateDetailsForm.get('leavingDate').reset();
    this.disableLeavingDate = true;
    this.dateForm1?.get('dateFormat')?.get('english').disable();
    this.secondmentDetailsForm = this.createSecondmentForm();
    this.terminateDetailsForm.addControl('secondmentDetails', this.secondmentDetailsForm);
    this.secondmentDateForm = this.createSecondmentDateForm();
    this.secondmentDateForm?.get('startDateFormat').setValue(this.typeGregorian);
    this.secondmentDetailsForm.get('secondmentStartDate')?.get('gregorian')?.setValidators([Validators.required]);
    this.secondmentDateForm.get('endDateFormat')?.disable();
    this.disableSecEndDate = true;
    this.setDatesRange();
  }
  selectEstType(type: string) {
    if (type === this.excludedEstablishment) {
      this.secondmentDetailsForm.get('establishmentId').setValidators([Validators.required]);
      this.secondmentDetailsForm.get('establishmentId').updateValueAndValidity();
      this.secondmentDetailsForm.get('establishmentName').get('english').setValidators([Validators.required]);
      this.secondmentDetailsForm.get('establishmentName').get('english').updateValueAndValidity();
      this.secondmentDetailsForm.updateValueAndValidity();
    } else {
      this.secondmentDetailsForm.get('establishmentId').reset();
      this.secondmentDetailsForm.get('establishmentName').reset();
      this.secondmentDetailsForm.get('establishmentId').setValidators(null);
      this.secondmentDetailsForm.get('establishmentId').updateValueAndValidity();
      this.secondmentDetailsForm.get('establishmentName').get('english').setValidators(null);
      this.secondmentDetailsForm.get('establishmentName').get('english').updateValueAndValidity();
      // this.secondmentDetailsForm.removeControl('establishmentId');
      // this.secondmentDetailsForm.removeControl('establishmentName');
      this.secondmentDetailsForm.updateValueAndValidity();
    }
  }
  selectExcludedEst(type: string) {
    const selectedExcludedEst = this.secondmentEstablishments.items.find(eachItem => eachItem.value.english === type);
    const establishmentId = selectedExcludedEst?.code;
    this.secondmentDetailsForm.get('establishmentId').setValue(establishmentId);
  }
  getNxtDayOfJoiningDate() {
    // method to get nxt day of joining date (joining date + 1)
    const formattedJoiningDateG = moment(this.terminateDetailsForm.get('joiningDate')?.get('gregorian')?.value).format(
      'YYYY-MM-DD'
    );
    this.calendarService.addToGregorianDate(formattedJoiningDateG, 0, 0, 1).subscribe(res => {
      if (res) {
        this.nxtDayOfJoiningDate = res;
      }
    });
  }
  setDatesRange() {
    //  gregorian min and max secondment start date
    this.minSecondmentStartDate = moment(this.nxtDayOfJoiningDate?.gregorian).isAfter(
      moment(this.ppaCalenderShiftDate.gregorian)
    )
      ? moment(this.nxtDayOfJoiningDate?.gregorian).toDate()
      : this.ppaCalenderShiftDate.gregorian;

    this.maxSecondmentStartDate = new Date();

    //  Hijiri min and max secondment start date
    this.minSecondmentStartDateH = convertToHijriFormat(this.nxtDayOfJoiningDate?.hijiri);
    // this.maxSecondmentStartDateH = this.systemParameter.REG_CONT_MAX_END_DATE_H_PPA;
    this.maxSecondmentStartDateH = this.hijiriDateConst.ppaMaxHijirDate;
  }
  /**Method to detect change in leaving date */
  detectChange(): void {
    this.terminateDetailsForm
      .get('leavingDate.gregorian')
      .valueChanges.pipe(filter(leavingDate => leavingDate !== null))
      .subscribe(leavingDate => this.checkLeavingDate(leavingDate));
    this.terminateDetailsForm
      .get('leavingDate.hijiri')
      .valueChanges.pipe(
        filter(
          leavingHijiriDate => leavingHijiriDate !== null && this.terminateDetailsForm.get('leavingDate.hijiri').valid
        )
      )
      .subscribe(leavingHijiriDate => this.checkLeavingHijiriDate(leavingHijiriDate));
  }

  setJoiningdate() {
    const joiningDate: GosiCalendar = this.isEditMode
      ? this.terminationDetails.joiningDate
      : this.engagement.joiningDate;
    this.calendarCheck = this.isEditMode
      ? this.terminationDetails?.joiningDate?.entryFormat
      : this.engagement?.joiningDate?.entryFormat;
    if (joiningDate && joiningDate.hijiri) {
      this.terminateDetailsForm.get('joiningDate.hijiri').setValue(convertToHijriFormat(joiningDate.hijiri));
    }
    if (joiningDate && joiningDate.gregorian) {
      this.terminateDetailsForm.get('joiningDate.gregorian').setValue(moment(joiningDate.gregorian).toDate());
    }
    if (this.terminateDetailsForm.get('joiningDate')?.get('gregorian')?.value) {
      this.getNxtDayOfJoiningDate();
    }
  }

  /**Method to check if documents is required */
  checkLeavingDate(leavingDate: Date, monthDif?: number): void {
    let monthDifference: number;
    const currentDate = new Date();
    monthDifference = monthDif ? monthDif : monthDiff(startOfMonth(leavingDate), startOfMonth(currentDate));
    if (
      this.terminateDetailsForm.get('leavingReason').get('english').value !== this.terminationReason.SECONDMENT &&
      this.terminateDetailsForm.get('leavingReason').get('english').value !== this.terminationReason.STUDYLEAVE
    ) {
      if (
        !this.isAppPrivate &&
        moment(leavingDate).isSameOrAfter(this.systemParameter.TERMINATE_ENG_MAX_REGULAR_JOINING_DATE, 'day')
      ) {
        this.isDocumentsRequired = false;
      } else {
        if ((monthDifference === 0 || monthDifference === 1) && !this.isAppPrivate) this.isDocumentsRequired = false;
        else this.isDocumentsRequired = true;
      }
      if (this.engagement?.secondment || this.engagement?.studyLeave) {
        this.isDocumentsRequired = true;
      }
      this.isDocumentsRequiredChange.emit(this.isDocumentsRequired);
    }
  }

  checkLeavingHijiriDate(leavingHijiriDate: string) {
    this.notificationService
      .getConversionData(null, hijiriToJSON(leavingHijiriDate), null, this.sysDate?.hijiri)
      .subscribe((leavingDateGreg: any) => {
        const monthDiff = monthDiffHijiri(leavingHijiriDate, convertToHijriFormat(this.sysDate?.hijiri)); //leavingDateGreg?.hijiriDiff?.month + (leavingDateGreg?.hijiriDiff?.day > 0 ? 1 : 0);
        this.checkLeavingDate(leavingDateGreg?.fromDate?.gregorian, monthDiff);
      });
  }
  /** Method to set minimum and maximum limit for leaving date  */
  setLeavingDateValidation(): void {
    let monthDifference: number;
    if (this.isEditMode) {
      const param =
        this.terminationDetails.terminationType === TerminationType.REGULAR
          ? this.isAppPrivate
            ? this.systemParameter.TERMINATE_ENG_MAX_REGULAR_PERIOD_IN_MONTHS_FO
            : this.systemParameter.TERMINATE_ENG_MAX_REGULAR_PERIOD_IN_MONTHS_GOL
          : this.isAppPrivate
          ? this.systemParameter.TERMINATE_ENG_MAX_BACKDATED_PERIOD_IN_MONTHS_FO
          : this.systemParameter.TERMINATE_ENG_MAX_BACKDATED_PERIOD_IN_MONTHS_GOL;
      const systemMinDate = startOfMonth(subtractMonths(this.terminationDetails.formSubmissionDate.gregorian, param));
      this.minLeavingDate = moment(this.terminationDetails.joiningDate.gregorian).isSameOrAfter(systemMinDate, 'day')
        ? this.ppaEstablishment &&
          moment(this.terminationDetails.joiningDate.gregorian).isBefore(this.ppaCalenderShiftDate?.gregorian, 'day')
          ? this.ppaCalenderShiftDate?.gregorian
          : startOfDay(this.terminationDetails.joiningDate.gregorian)
        : this.ppaEstablishment && moment(systemMinDate).isBefore(this.ppaCalenderShiftDate?.gregorian, 'day')
        ? this.ppaCalenderShiftDate?.gregorian
        : systemMinDate;
      if (this.ppaEstablishment) {
        this.minLeavingDateH = moment(this.terminationDetails.joiningDate.gregorian).isBefore(
          this.ppaCalenderShiftDate?.gregorian,
          'day'
        )
          ? parseToHijiriFromApi(this.terminationDetails.joiningDate.hijiri)
          : parseToHijiriFromApi(this.terminationDetails.leavingDate.hijiri);
      }
      this.maxLeavingDate =
        this.terminationDetails.terminationType === TerminationType.REGULAR
          ? moment(this.terminationDetails.formSubmissionDate.gregorian).toDate()
          : endOfMonth(addMonths(systemMinDate, param - 1));
      monthDifference = this.terminationDetails?.formSubmissionMonthDifference
        ? this.terminationDetails?.formSubmissionMonthDifference
        : monthDiff(
            startOfMonth(this.terminationDetails.leavingDate.gregorian),
            startOfMonth(this.terminationDetails.formSubmissionDate.gregorian)
          );
      if (monthDifference === 1) {
        if (
          this.ppaEstablishment &&
          moment(
            moment(startOfMonth(this.terminationDetails.formSubmissionDate.gregorian)).subtract(1, 'month').toDate()
          ).isBefore(this.ppaCalenderShiftDate?.gregorian, 'day')
        ) {
          this.minLeavingDate = this.ppaCalenderShiftDate?.gregorian;
        } else {
          this.minLeavingDate = moment(startOfMonth(this.terminationDetails.formSubmissionDate.gregorian))
            .subtract(1, 'month')
            .toDate();
        }
        if (this.terminationDetails.leavingDate.entryFormat === this.typeGregorian) {
          this.maxHijLeavingDate = startOfMonthHijiri(
            parseToHijiriFromApi(this.terminationDetails.leavingDate?.hijiri)
          );
          this.minLeavingDateH = endOfMonthHijiri(parseToHijiriFromApi(this.terminationDetails.leavingDate?.hijiri));
        } else {
          this.minLeavingDateH = startOfMonthHijiri(parseToHijiriFromApi(this.terminationDetails.leavingDate?.hijiri));
          this.maxHijLeavingDate = endOfMonthHijiri(parseToHijiriFromApi(this.terminationDetails.leavingDate?.hijiri));
        }
        // this.minLeavingDate =
        //   this.ppaEstablishment &&
        //   moment(
        //     moment(startOfMonth(this.terminationDetails.formSubmissionDate.gregorian)).subtract(1, 'month').toDate()
        //   ).isBefore(this.ppaCalenderShiftDate?.gregorian, 'day')
        //     ? this.ppaCalenderShiftDate?.gregorian
        //     : moment(startOfMonth(this.terminationDetails.formSubmissionDate.gregorian)).subtract(1, 'month').toDate();
        // if (
        //   this.ppaEstablishment &&
        //   monthDiff(
        //     startOfMonth(this.terminationDetails.leavingDate.gregorian),
        //     startOfMonth(this.hijiriDateConst.ppaMaxHjiriDateInGregorian)
        //   ) === 1
        // ) {
        //   this.minLeavingDateH = startOfMonthHijiri(this.hijiriDateConst.ppaMaxHijirDate);
        //   this.maxHijLeavingDate = this.hijiriDateConst.ppaMaxHijirDate;
        // }
      } else if (monthDifference > 1 && this.terminationDetails.terminationType !== TerminationType.REGULAR) {
        this.calendarService
          .addToHijiriDate(this.terminationDetails?.formSubmissionDate?.hijiri, 0, -2, 0)
          .subscribe(res => {
            const maxHij = convertToHijriFormat(res.hijiri);
            this.maxLeavingDate = endOfMonth(subtractMonths(this.terminationDetails.formSubmissionDate.gregorian, 2));
            if (moment(this.maxLeavingDate).isBefore(this.ppaCalenderShiftDate?.gregorian, 'day')) {
              this.maxHijLeavingDate = endOfMonthHijiri(maxHij);
            } else {
              this.maxHijLeavingDate = this.hijiriDateConst.ppaMaxHijirDate;
            }
          });
      } else {
        this.maxLeavingDate = moment(
          moment(endOfMonth(this.terminationDetails.leavingDate.gregorian)).toDate()
        ).isBefore(new Date(), 'day')
          ? endOfMonth(this.terminationDetails.leavingDate.gregorian)
          : new Date();
        this.maxHijLeavingDate =
          this.ppaEstablishment &&
          moment(
            moment(startOfMonth(this.terminationDetails.formSubmissionDate.gregorian)).subtract(1, 'month').toDate()
          ).isBefore(this.ppaCalenderShiftDate?.gregorian, 'day')
            ? this.hijiriDateConst.ppaMaxHijirDate
            : endOfMonthHijiri(parseToHijiriFromApi(this.terminationDetails.leavingDate.hijiri));
        this.minLeavingDateH = moment(startOfDay(this.terminationDetails.joiningDate.gregorian)).isBefore(
          this.ppaCalenderShiftDate?.gregorian,
          'day'
        )
          ? parseToHijiriFromApi(this.engagement?.joiningDate?.hijiri)
          : this.hijiriDateConst.ppaMaxHijirDate;
      }
      // can remove this code as hijiri wont be coming for current month
      if (monthDifference === 0 && this.terminationDetails.leavingDate.entryFormat === this.typeHijira) {
        this.minLeavingDateH = startOfMonthHijiri(parseToHijiriFromApi(this.terminationDetails.leavingDate?.hijiri));
        this.maxHijLeavingDate = endOfMonthHijiri(parseToHijiriFromApi(this.terminationDetails.leavingDate?.hijiri));
      }
      if (monthDifference === 0 && this.terminationDetails.leavingDate.entryFormat === this.typeGregorian) {
        this.maxHijLeavingDate = startOfMonthHijiri(parseToHijiriFromApi(this.terminationDetails.leavingDate?.hijiri));
        this.minLeavingDateH = endOfMonthHijiri(parseToHijiriFromApi(this.terminationDetails.leavingDate?.hijiri));
      }
      // if (!this.isAppPrivate && this.isAdminReEdit && !this.backdatedEngValidatorRequired) {
      //   this.minLeavingDate =
      //     this.ppaEstablishment &&
      //     moment(startOfMonth(subtractMonths(moment(new Date()).toDate(), 24))).isBefore(
      //       this.ppaCalenderShiftDate?.gregorian,
      //       'day'
      //     )
      //       ? this.ppaCalenderShiftDate?.gregorian
      //       : startOfMonth(subtractMonths(moment(new Date()).toDate(), 24));
      //   if (monthDiff(startOfMonth(this.terminationDetails.joiningDate.gregorian), startOfMonth(new Date())) < 25) {
      //     this.minLeavingDate =
      //       this.ppaEstablishment &&
      //       moment(moment(this.terminationDetails.joiningDate.gregorian).toDate()).isBefore(
      //         this.ppaCalenderShiftDate?.gregorian,
      //         'day'
      //       )
      //         ? this.ppaCalenderShiftDate?.gregorian
      //         : moment(this.terminationDetails.joiningDate.gregorian).toDate();
      //     this.minLeavingDateH =
      //       this.ppaEstablishment &&
      //       moment(moment(this.terminationDetails.joiningDate.gregorian).toDate()).isBefore(
      //         this.ppaCalenderShiftDate?.gregorian,
      //         'day'
      //       )
      //         ? this.hijiriDateConst.ppaMaxHijirDate
      //         : this.terminationDetails.joiningDate.hijiri;
      //   }
      // }
    } else {
      this.minLeavingDate = moment(
        moment(this.engagement?.joiningDate?.gregorian).isSameOrAfter(
          this.systemParameter.TERMINATE_ENG_MAX_BACKDATED_JOINING_DATE,
          'day'
        )
          ? this.ppaEstablishment &&
            moment(this.engagement?.joiningDate?.gregorian).isBefore(this.ppaCalenderShiftDate?.gregorian, 'day')
            ? this.ppaCalenderShiftDate?.gregorian
            : startOfDay(this.engagement?.joiningDate?.gregorian)
          : this.ppaEstablishment &&
            moment(this.systemParameter.TERMINATE_ENG_MAX_BACKDATED_JOINING_DATE).isBefore(
              this.ppaCalenderShiftDate?.gregorian,
              'day'
            )
          ? this.ppaCalenderShiftDate?.gregorian
          : this.systemParameter.TERMINATE_ENG_MAX_BACKDATED_JOINING_DATE
      ).toDate();
      this.maxLeavingDate = new Date();

      if (this.ppaEstablishment) this.handleTerminationDateForPPA();
      else {
        this.minLeavingDateH = parseToHijiriFromApi(this.engagement?.joiningDate?.hijiri);
        this.maxHijLeavingDate = this.hijiriDateConst.gosiMaxHijiriDate;
      }
    }
  }

  /** Method to check whether leaving reason is related to death. */
  checkLeavingReason(initialize = false) {
    if (this.contributor.person.personType === PersonTypesEnum.SAUDI) {
      const leavingReason = this.terminateDetailsForm.get('leavingReason.english').value;
      if (ContributorConstants.DEAD_LEAVING_REASONS.indexOf(leavingReason) !== -1) {
        this.disableLeavingDate = true;
        this.nicVar = true;
        this.nicCallParam();
      } else {
        this.nicVar = false;
        this.nicCallParam();
        if (this.disableLeavingDate) {
          this.terminateDetailsForm.get('leavingDate').reset();
          this.dateForm1?.get('dateFormat')?.get('english').enable();
        }
        this.disableLeavingDate = false;
        if (this.isEditMode && initialize) {
          this.terminateDetailsForm
            .get('leavingDate.gregorian')
            .setValue(moment(this.terminationDetails.leavingDate.gregorian).toDate());
        }
      }
    }
    this.leavingReasonSelected.emit(this.terminateDetailsForm.get('leavingReason').get('english').value);
    if (this.terminateDetailsForm.get('leavingReason').get('english').value === this.terminationReason.SECONDMENT) {
      this.setSecondmentDetails();
      this.isDocumentsRequired = true;
      this.isDocumentsRequiredChange.emit(this.isDocumentsRequired);
    } else if (
      this.terminateDetailsForm.get('leavingReason').get('english').value === this.terminationReason.STUDYLEAVE
    ) {
      this.setStudyLeaveDetails();
      this.isDocumentsRequired = true;
      this.isDocumentsRequiredChange.emit(this.isDocumentsRequired);
    } else {
      if (this.terminateDetailsForm?.get('secondmentDetails')) {
        this.terminateDetailsForm.removeControl('secondmentDetails');
      }
      if (this.terminateDetailsForm?.get('studyLeaveDetails')) {
        this.terminateDetailsForm.removeControl('studyLeaveDetails');
      }
    }
    this.terminateDetailsForm
      .get('leavingDate.entryFormat')
      .setValue(this.dateForm1?.get('dateFormat')?.get('english')?.value);
  }
  secondmentStartDateGSelected() {
    // To set previous day of secondment start date as termination date
    if (this.secondmentDetailsForm.get('secondmentStartDate')?.get('gregorian')?.value) {
      this.secondmentDetailsForm?.get('secondmentEndDate').reset();
      // this.secondmentDateForm?.get('endDateFormat').setValue(this.typeGregorian);
      this.secondmentDateForm.get('endDateFormat')?.enable();
      this.disableSecEndDate = false;

      const formattedStartDateG = moment(
        this.secondmentDetailsForm.get('secondmentStartDate')?.get('gregorian')?.value
      ).format('YYYY-MM-DD');
      this.calendarService.addToGregorianDate(formattedStartDateG, 0, 0, -1).subscribe(res => {
        if (res) {
          this.previousDayOfSecondment = res;
          this.terminateDetailsForm
            .get('leavingDate')
            ?.get('gregorian')
            ?.setValue(moment(this.previousDayOfSecondment.gregorian).toDate());
          this.terminateDetailsForm
            .get('leavingDate')
            ?.get('hijiri')
            ?.setValue(convertToHijriFormat(this.previousDayOfSecondment.hijiri));
        }
        // if startDate G = calendershiftDateG => terminationDate, which is previousDay Of startDate, can only be in hijiri.
        if (
          moment(startOfDay(this.secondmentDetailsForm.get('secondmentStartDate')?.get('gregorian')?.value)).isSame(
            startOfDay(this.ppaCalenderShiftDate?.gregorian)
          )
        ) {
          this.terminateDetailsForm.get('leavingDate.entryFormat').setValue(this.typeHijira);
          this.dateForm1?.get('dateFormat')?.get('english').setValue(this.typeHijira);
        } else {
          this.terminateDetailsForm.get('leavingDate.entryFormat').setValue(this.typeGregorian);
          this.dateForm1?.get('dateFormat')?.get('english').setValue(this.typeGregorian);
        }
      });
      this.setAndUpdateValidators(this.typeGregorian, this.secondmentDetailsForm.get('secondmentStartDate'));
      if (this.secondmentDateForm?.get('endDateFormat')?.value === this.typeGregorian) {
        this.setAndUpdateValidators(this.typeGregorian, this.secondmentDetailsForm.get('secondmentEndDate'));
      } else if (this.secondmentDateForm?.get('endDateFormat')?.value === this.typeHijira) {
        this.setAndUpdateValidators(this.typeHijira, this.secondmentDetailsForm.get('secondmentEndDate'));
      }
      //  gregorian min and max secondment end date
      this.minSecondmentEndDate =
        this.secondmentDetailsForm?.get('secondmentStartDate')?.get('gregorian')?.value >
        this.ppaCalenderShiftDate.gregorian
          ? this.secondmentDetailsForm?.get('secondmentStartDate')?.get('gregorian')?.value
          : this.ppaCalenderShiftDate.gregorian;
      // max end date can be future date
      // this.maxSecondmentEndDate = new Date();
    }
    //  Hijiri min and max studyleave end date
    this.calendarService
      .getHijiriDate(this.secondmentDetailsForm.get('secondmentStartDate')?.get('gregorian')?.value)
      .subscribe(res => {
        this.minSecondmentEndDateH = convertToHijriFormat(res.hijiri);
      });
    // this.maxSecondmentEndDateH = this.ppaCalenderShiftDate.hijiri;
    this.maxSecondmentEndDateH = this.systemParameter.REG_CONT_MAX_END_DATE_H_PPA;
  }
  secondmentStartDateHSelected() {
    if (this.secondmentDetailsForm.get('secondmentStartDate')?.get('hijiri')?.value) {
      this.secondmentDetailsForm?.get('secondmentEndDate').reset();
      // this.secondmentDateForm?.get('endDateFormat').setValue(this.typeHijira);
      this.secondmentDateForm.get('endDateFormat')?.enable();
      this.disableSecEndDate = false;
      this.calendarService
        .getGregorianDate(this.secondmentDetailsForm.get('secondmentStartDate')?.get('hijiri')?.value)
        .subscribe(gregDate => {
          //this.secondmentDetailsForm?.get('secondmentStartDate')?.get('gregorian').setValue(gregDate?.gregorian);
          //  gregorian min and max studyleave end date
          this.minSecondmentEndDate =
            gregDate?.gregorian > this.ppaCalenderShiftDate.gregorian
              ? gregDate?.gregorian
              : this.ppaCalenderShiftDate.gregorian;
          // max end date can be future date
        });
      const formattedStartDateH = convertToHijriFormatAPI(
        this.secondmentDetailsForm.get('secondmentStartDate')?.get('hijiri')?.value
      );
      this.calendarService.addToHijiriDate(formattedStartDateH, 0, 0, -1).subscribe(res => {
        if (res) {
          this.previousDayOfSecondment = res;
          this.terminateDetailsForm
            .get('leavingDate')
            ?.get('hijiri')
            ?.setValue(convertToHijriFormat(this.previousDayOfSecondment.hijiri));

          this.terminateDetailsForm.get('leavingDate.entryFormat').setValue(this.typeHijira);
          this.dateForm1?.get('dateFormat')?.get('english').setValue(this.typeHijira);
          this.terminateDetailsForm
            .get('leavingDate')
            ?.get('gregorian')
            ?.setValue(moment(this.previousDayOfSecondment.gregorian).toDate());
        }
      });

      this.setAndUpdateValidators(this.typeHijira, this.secondmentDetailsForm.get('secondmentStartDate'));
      if (this.secondmentDateForm?.get('endDateFormat')?.value === this.typeGregorian) {
        this.setAndUpdateValidators(this.typeGregorian, this.secondmentDetailsForm.get('secondmentEndDate'));
      } else if (this.secondmentDateForm?.get('endDateFormat')?.value === this.typeHijira) {
        this.setAndUpdateValidators(this.typeHijira, this.secondmentDetailsForm.get('secondmentEndDate'));
      }
      //  Hijiri min and max secondment end date
      this.minSecondmentEndDateH = this.secondmentDetailsForm?.get('secondmentStartDate')?.get('hijiri')?.value;
      this.maxSecondmentEndDateH = this.systemParameter.REG_CONT_MAX_END_DATE_H_PPA;
      // this.maxSecondmentEndDateH = this.hijiriDateConst.ppaMaxHijirDate;
    }
  }
  secondmentEndDateGSelected() {
    this.secondmentDetailsForm?.get('secondmentEndDate')?.get('entryFormat').setValue(this.typeGregorian);
    this.setAndUpdateValidators(this.typeGregorian, this.secondmentDetailsForm.get('secondmentEndDate'));
  }
  secondmentEndDateHSelected() {
    this.secondmentDetailsForm?.get('secondmentEndDate')?.get('entryFormat').setValue(this.typeHijira);
    this.setAndUpdateValidators(this.typeHijira, this.secondmentDetailsForm.get('secondmentEndDate'));
  }
  /**Method to pass queryParam for NIC call */
  nicCallParam() {
    this.personNin[0] = this.contributor?.person.identity[0];
    const ninNumber = this.personNin[0]?.newNin;
    this.queryParams = `NIN=${ninNumber}`;
    this.nicCall.emit({
      nicVar: this.nicVar,
      queryParams: this.queryParams,
      leavingDeathReason: this.leavingDeathReason
    });
  }
  setLeavingDate() {
    const currentDate = new Date().toISOString();
    if (!this.isEditMode) {
      if (this.nicDetails?.deathDate == null) {
        this.terminateDetailsForm.get('leavingDate').reset();
      } else if (
        moment(this.nicDetails?.deathDate?.gregorian).isBefore(this.engagement?.joiningDate?.gregorian) ||
        moment(this.nicDetails?.deathDate?.gregorian).isAfter(currentDate)
      ) {
        this.terminateDetailsForm.get('leavingDate').reset();
      } else if (
        moment(this.nicDetails?.deathDate?.gregorian).isSameOrAfter(this.engagement?.joiningDate?.gregorian) &&
        moment(this.nicDetails?.deathDate?.gregorian).isSameOrBefore(currentDate)
      ) {
        this.terminateDetailsForm
          .get('leavingDate')
          .get('gregorian')
          .setValue(moment(this.nicDetails?.deathDate?.gregorian).toDate());
        this.terminateDetailsForm
          .get('leavingDate')
          .get('hijiri')
          .setValue(parseToHijiriFromApi(this.nicDetails.deathDate.hijiri));
        this.switchCalendarType(this.nicDetails?.deathDate?.entryFormat, false);
        this.dateForm1?.get('dateFormat')?.get('english').disable();
      }
    } else {
      if (this.nicDetails.deathDate == null) {
        this.terminateDetailsForm
          .get('leavingDate.gregorian')
          .setValue(moment(this.terminationDetails?.leavingDate?.gregorian).toDate());
        this.terminateDetailsForm
          .get('leavingDate.hijiri')
          .setValue(parseToHijiriFromApi(this.terminationDetails?.leavingDate?.hijiri));
      } else if (
        moment(this.nicDetails?.deathDate?.gregorian).isBefore(this.terminationDetails?.joiningDate?.gregorian) ||
        moment(this.nicDetails?.deathDate?.gregorian).isAfter(currentDate)
      ) {
        this.terminateDetailsForm
          .get('leavingDate.gregorian')
          .setValue(moment(this.terminationDetails?.leavingDate?.gregorian).toDate());
        this.terminateDetailsForm.get('leavingDate.hijiri').setValue(this.terminationDetails?.leavingDate?.hijiri);
      } else if (
        moment(this.nicDetails?.deathDate?.gregorian).isSameOrAfter(this.terminationDetails?.joiningDate?.gregorian) &&
        moment(this.nicDetails?.deathDate?.gregorian).isSameOrBefore(currentDate)
      ) {
        this.terminateDetailsForm
          .get('leavingDate')
          .get('gregorian')
          .setValue(moment(this.nicDetails?.deathDate?.gregorian).toDate());
        this.terminateDetailsForm
          .get('leavingDate')
          .get('hijiri')
          .setValue(parseToHijiriFromApi(this.nicDetails?.deathDate?.hijiri));
        this.switchCalendarType(this.nicDetails?.deathDate?.entryFormat, false);
        this.dateForm1?.get('dateFormat')?.get('english').disable();
      }
    }
    if (
      this.ppaEstablishment &&
      moment(this.nicDetails?.deathDate?.gregorian).isBefore(moment(this.ppaCalenderShiftDate?.gregorian))
    ) {
      this.dateForm1?.get('dateFormat')?.get('english').disable();
      this.switchCalendarType(this.typeHijira, false);
      this.dateForm1.updateValueAndValidity();
    }
    if (
      this.ppaEstablishment &&
      moment(this.nicDetails?.deathDate?.gregorian).isAfter(moment(this.ppaCalenderShiftDate?.gregorian))
    ) {
      this.dateForm1?.get('dateFormat')?.get('english').disable();
      this.switchCalendarType(this.typeGregorian, false);
      this.dateForm1.updateValueAndValidity();
    }
  }

  // date format option for leaving date
  switchCalendarType(type, resetDate = true) {
    if (resetDate === true) this.terminateDetailsForm.get('leavingDate').reset();
    this.dateForm1?.get('dateFormat')?.get('english').setValue(type);
    this.terminateDetailsForm.get('leavingDate').get('entryFormat').setValue(type);
    this.setAndUpdateValidators(type, this.terminateDetailsForm.get('leavingDate'));
  }

  setAndUpdateValidators(dateType, formDate) {
    const gregorianControl = formDate.get('gregorian');
    const hijiriControl = formDate.get('hijiri');

    const existingValidators = gregorianControl.validator || Validators.nullValidator;

    if (dateType === this.typeGregorian) {
      // Set validators for Gregorian date
      const newValidators = Validators.compose([existingValidators, Validators.required]);
      gregorianControl.setValidators(newValidators);
      hijiriControl.setValidators(null); // Remove validators for Hijiri date
    } else if (dateType === this.typeHijira) {
      // Set validators for Hijiri date
      const newValidators = Validators.compose([existingValidators, null]);
      gregorianControl.setValidators(null); // Remove validators for Gregorian date
      hijiriControl.setValidators([Validators.required]);
    }
    // Update the form controls' validation status
    gregorianControl.updateValueAndValidity();
    hijiriControl.updateValueAndValidity();
  }
  // date format option for secondment start date
  switchSecStartDateType(type) {
    this.secondmentDateForm?.get('startDateFormat')?.setValue(type);
    this.secondmentDetailsForm?.get('secondmentStartDate').reset();
    this.secondmentDetailsForm?.get('secondmentStartDate')?.get('entryFormat')?.setValue(type);
    this.terminateDetailsForm.get('leavingDate').reset();
    this.setAndUpdateValidators(type, this.secondmentDetailsForm.get('secondmentStartDate'));
    this.secondmentDetailsForm?.get('secondmentEndDate').reset();
  }
  switchSecEndDateType(type) {
    this.secondmentDateForm?.get('endDateFormat')?.setValue(type);
    this.secondmentDetailsForm?.get('secondmentEndDate').reset();
    this.secondmentDetailsForm?.get('secondmentEndDate')?.get('entryFormat')?.setValue(type);
    this.setAndUpdateValidators(type, this.secondmentDetailsForm.get('secondmentEndDate'));
  }

  /** Method to toggle bank edit mode. */
  toggleBankEditMode(flag: boolean) {
    this.isBankEdit = flag;
  }
  /** Method to clear errors. */
  clearErrors() {
    this.clearError.emit();
  }
  /** Method to refresh document. */
  refreshDocument(doc: DocumentItem) {
    this.refreshDoc.emit(doc);
  }
}
