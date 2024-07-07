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
  BilingualText,
  CalendarService,
  CalendarTypeEnum,
  GosiCalendar,
  LanguageToken,
  LookupService,
  LovList,
  OccupationList,
  RoleIdEnum,
  addDays,
  convertToHijriFormat,
  endOfMonth,
  hijiriToJSON,
  markFormGroupTouched,
  maxDateValidator,
  minDateValidator,
  parseToHijiri,
  parseToHijiriFromApi,
  startOfDay,
  subtractDays
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  ChangeEngagementTransactionType,
  ContributorConstants,
  HijiriConstant,
  PersonTypesEnum,
  WorkType,
  YesOrNo
} from '../../../shared';
import {
  Contributor,
  CoveragePeriodWrapper,
  EngagementDetails,
  EngagementPeriod,
  Establishment,
  ModifyCoverage,
  PeriodChangeDetails,
  SystemParameter
} from '../../../shared/models';
import { ConfirmationModalDcComponent } from '../confirmation-modal-dc/confirmation-modal-dc.component';

@Component({
  selector: 'cnt-engagement-period-dc',
  templateUrl: './engagement-period-dc.component.html',
  styleUrls: ['./engagement-period-dc.component.scss']
})
export class EngagementPeriodDcComponent implements OnInit, OnChanges {
  /** Local variables */
  engagementDetailsForm: FormGroup;
  isEngagementActive = false;
  selectedEngagement: EngagementDetails; //To store the changes without affecting original details.
  tempPeriods: EngagementPeriod[] = []; //To store the value of changed engagement periods, to update if verification success
  modalRef: BsModalRef;
  currentLang = 'en';
  joiningDate: Date;
  leavingDate: Date;
  minLeavingDate: Date; //Min limit for leaving date
  maxJoiningDate: Date; // Max limit for joining date
  disableLeavingDate = false;
  disableLeavingReason = false;
  disableJoiningDate = false;
  disableWorkType = false;
  disableEmployeeId = false;
  isJoiningDateChanged = false;
  isLeavingDateChanged = false;
  isLeavingReasonChanged = false;
  employeeIdMaxlength = ContributorConstants.EMPLOYMENT_NUMBER_MAX_LENGTH;
  isPeriodSplitted = false;
  periodAdjustFlag: boolean; //Flag to identify whether period needs to be adjusted based on joining/leaving date
  periodEditInProgress = false;
  enabledFields: string[] = []; //List of feilds that were enabled before period edit
  isSaudiPerson = true;
  isAppPrivate: boolean;
  showAllToolTip: boolean;
  showJoiningDateToolTip: boolean;
  tooltipLabel: string;
  messageToDisplay: string;
  isProactive = false;
  tempLeavingReason: BilingualText; //To store previous value of leavin reason before changing it.
  minDate: Date;
  currentRoles: boolean;
  tempModifyCoveragePeriod: ModifyCoverage;
  isHijiri = false;
  inAct: boolean;
  queryParams: string = '';
  personNin: any[] = [];
  nicCheck: boolean;
  isDisableInValidator: boolean = false;
  validatorLeavingDate: boolean = false;
  validatorLeavingReason: boolean = false;
  leavingDeathReason: boolean = false;
  backWage: boolean = false;

  dateForm: FormGroup;
  dateForm1: FormGroup;
  typeGregorian = CalendarTypeEnum.GREGORIAN;
  typeHijira = CalendarTypeEnum.HIJRI;
  checkPrivate: boolean;
  minHijiriDate: string;
  joiningHijiriDate: string;
  leavingHijiriDate: string;
  joiningGregorianDate: Date = null;
  leavingGregorianDate: Date = null;
  hijiriType: boolean;
  hijiriLeavingType: boolean;
  minLeavingDateHijiri: string;
  isHijiriLeaving: boolean;
  maxLeavingDateHijiri: string;
  leavingDateHijiri: string;
  maxHijiriDate: string;
  maxHijiriJoiningDate: any;
  minJGregorianDate: any;

  @ViewChild('tooltipTemplate', { static: true })
  tooltipTemplate: TemplateRef<HTMLElement>;
  @ViewChild('confirmSplitModal', { static: true })
  confirmSplitModal: TemplateRef<HTMLElement>;

  /** Input variables */
  @Input() establishment: Establishment;
  @Input() engagement: EngagementDetails;
  @Input() leavingReasonList: LovList;
  @Input() occupationList: OccupationList;
  @Input() isWageVerified: boolean;
  @Input() parentForm: FormGroup;
  @Input() updatedEngagement: EngagementDetails;
  @Input() isWageDetailsUpdate: boolean;
  @Input() systemParameter: SystemParameter;
  @Input() workTypeList: LovList;
  @Input() yesOrNoList: LovList;
  @Input() contributor: Contributor;
  @Input() editMode: boolean;
  @Input() changeRequestTypes: string[];
  @Input() changesInPeriod: PeriodChangeDetails[];
  @Input() formSubmissionDate: Date;
  @Input() penaltyIndicator: number;
  @Input() isGccEstblishment: boolean;
  @Input() userRoles: string[];
  @Input() newCoverages: LovList;
  @Input() reasonForChange: LovList;
  @Input() coveragePeriod: CoveragePeriodWrapper;
  @Input() isModifyCoverage: boolean;
  @Input() modifyCoverageValue: ModifyCoverage;
  @Input() isPrevious: boolean;
  @Input() nicDetails: any;
  @Input() saveB: boolean;
  @Input() isAppPublic: boolean;
  @Input() isAdminReEdit: boolean;
  @Input() backdatedEngValidatorRequired: boolean;
  @Input() hijiriDateConst: HijiriConstant;
  @Input() ppaEstablishment: boolean;
  @Input() isUnclaimed: boolean;

  /** Output variables. */
  @Output() verify: EventEmitter<EngagementDetails> = new EventEmitter();
  @Output() save: EventEmitter<EngagementDetails> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() fieldChanged: EventEmitter<boolean> = new EventEmitter(); //Event to enable document section in GOL.
  @Output() editInProgress: EventEmitter<boolean> = new EventEmitter();
  @Output() penaltyIndicatorChange: EventEmitter<number> = new EventEmitter();
  @Output() showAlertError: EventEmitter<string> = new EventEmitter();
  @Output() modifyCoverageValues: EventEmitter<boolean> = new EventEmitter();
  @Output() modifyCoverageDateValues: EventEmitter<object> = new EventEmitter();
  @Output() edit: EventEmitter<ModifyCoverage> = new EventEmitter();
  @Output() coverageValidity: EventEmitter<null> = new EventEmitter();
  @Output() joiningDateChange: EventEmitter<boolean> = new EventEmitter();
  @Output() nicCall: EventEmitter<object> = new EventEmitter();

  leavingReasonUpdatedList: LovList;

  /** Creates an instance of EngagementPeriodDcComponent. */
  constructor(
    private fb: FormBuilder,
    public modalService: BsModalService,
    readonly calendarService: CalendarService,
    readonly lookupService: LookupService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
  }
  /** Method to initialize the component. */
  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.currentLang = lang;
    });
    if (this.isAppPrivate || (this.ppaEstablishment && this.appToken === ApplicationTypeEnum.PUBLIC)) {
      this.checkPrivate = true;
    }
    if (!this.dateForm) {
      this.dateForm = this.createDateTypeForm();
      this.dateForm.get('dateFormat.english').setValue(this.typeGregorian);
    }
    if (!this.dateForm1) {
      this.dateForm1 = this.createDateTypeForm();
      this.dateForm1.get('dateFormat.english').setValue(this.typeGregorian);
    }
    this.minDate = new Date(this.hijiriDateConst?.gosiMaxHijiriNextDateInGregorian);
    this.inAct = this.contributor?.statusType === 'INACTIVE';
  }
  /** Method to handle the changes in input variables. */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.leavingReasonList && changes.leavingReasonList.currentValue && this.leavingReasonList) {
      this.leavingReasonUpdatedList = this.leavingReasonList;
      if (
        this.engagement &&
        this.engagement?.leavingReason &&
        this.engagement?.leavingReason?.english === 'Study leave'
      ) {
        this.leavingReasonUpdatedList.items = changes.leavingReasonList.currentValue.items.filter(
          data => data.value.english !== 'Secondment'
        );
      } else if (
        this.engagement &&
        this.engagement?.leavingReason &&
        this.engagement?.leavingReason?.english === 'Secondment'
      ) {
        this.leavingReasonUpdatedList.items = changes.leavingReasonList.currentValue.items.filter(
          data => data.value.english !== 'Study Leave'
        );
      } else if (
        this.engagement &&
        this.engagement?.leavingReason &&
        this.engagement?.leavingReason?.english !== 'Secondment' &&
        this.engagement?.leavingReason?.english !== 'Study leave'
      ) {
        this.leavingReasonUpdatedList.items = changes.leavingReasonList.currentValue.items.filter(
          data => data?.value?.english !== 'Study Leave' && data?.value?.english !== 'Secondment'
        );
      }
    }
    if (changes.engagement && changes.engagement?.currentValue) {
      if (this.updatedEngagement && this.selectedEngagement) {
        this.bindDataForView(this.updatedEngagement);
        //To identify change in joining/leaving date in case of validator edit/previous section
        this.setJoiningOrLeavingDateChangeFlag();
      } else {
        this.selectedEngagement = JSON.parse(JSON.stringify(this.engagement));
        this.bindDataForView(this.selectedEngagement);
      }
    }
    if (changes.isWageVerified && changes.isWageVerified.currentValue) {
      if (this.isWageVerified === true) {
        this.periodEditInProgress = false;
        this.disableOrEnableFields(this.periodEditInProgress);
        this.selectedEngagement.engagementPeriod = this.tempPeriods;
        if (!this.editMode) this.isPeriodSplitted = this.checkPeriodSplit(); //In validator edit split are not discarded
      }
    }
    //If there is change in engagement details, use that value.
    if (changes.updatedEngagement && changes.updatedEngagement.currentValue) {
      this.selectedEngagement = JSON.parse(JSON.stringify(this.updatedEngagement));
      this.tempPeriods = [];
      this.updatedEngagement.engagementPeriod.forEach(period => {
        this.tempPeriods.push(JSON.parse(JSON.stringify(period)));
      });
      this.isPeriodSplitted = this.checkPeriodSplit(); //In case of validator edit/previous section
      if (this.engagement) {
        this.bindDataForView(this.selectedEngagement);
        //To identify change in joining/leaving date in case of validator edit/previous section
        this.setJoiningOrLeavingDateChangeFlag();
      }
    }
    if (changes.formSubmissionDate || changes.systemParameter) {
      this.bindDataForView(this.selectedEngagement);
      this.reCalculateDateLimits(changes);
    }
    if (changes.changeRequestTypes && changes.changeRequestTypes.currentValue) this.identifyTheChanges();
    if (changes.contributor && changes.contributor.currentValue) this.handleDisableFields();
    // if (changes.formSubmissionDate || changes.systemParameter) this.reCalculateDateLimits(changes);
    if (changes.penaltyIndicator) this.setPenaltyIndicator();
    if (changes.userRoles) {
      if (this.userRoles.includes(RoleIdEnum.REG_CONT_OPER_SPVSR.toString())) this.currentRoles = true;
    }
    if (changes.modifyCoverageValue && changes.modifyCoverageValue.currentValue)
      this.tempModifyCoveragePeriod = this.modifyCoverageValue;
    if (changes.nicDetails && changes.nicDetails.currentValue) {
      this.setLeavingDate();
    }
  }
  /** Method to create engagement details form. */
  createEngagementDetailsForm() {
    return this.fb.group({
      joiningDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null],
        entryFormat: [null]
      }),
      leavingDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null],
        entryFormat: [null]
      }),
      leavingReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      workType: this.fb.group({
        english: [
          null,
          {
            validators: Validators.compose([Validators.required]),
            updateOn: 'blur'
          }
        ],
        arabic: null
      }),
      companyWorkerNumber: [
        null,
        {
          updateOn: 'blur'
        }
      ],
      penalty: this.fb.group({
        english: [
          null,
          {
            validators: this.editMode && !this.ppaEstablishment ? Validators.compose([Validators.required]) : null,
            updateOn: 'blur'
            //&& this.isAppPrivate
          }
        ],
        arabic: null
      }),
      penaltyDisclaimer: [
        { value: this.editMode, disabled: this.editMode },
        { validators: !this.ppaEstablishment ? Validators.requiredTrue : null }
      ]
    });
  }
  /** Method to bind engagement details to form for view. */
  bindDataForView(engagement: EngagementDetails): void {
    if (this.isAppPrivate || (this.ppaEstablishment && this.appToken === ApplicationTypeEnum.PUBLIC)) {
      this.checkPrivate = true;
    }
    if (engagement?.joiningDate?.entryFormat === CalendarTypeEnum.HIJRI) {
      this.isHijiri = true;
    } else {
      this.isHijiri = false;
    }
    this.engagementDetailsForm = this.createEngagementDetailsForm();
    if (!this.dateForm) this.dateForm = this.createDateTypeForm();
    if (!this.dateForm1) this.dateForm1 = this.createDateTypeForm();
    if (engagement?.joiningDate && engagement?.joiningDate?.gregorian && !this.isHijiri && this.checkPrivate) {
      this.hijiriType = false;
      this.dateForm.get('dateFormat.english').setValue(this.typeGregorian);
      this.engagementDetailsForm
        .get('joiningDate.gregorian')
        .setValue(moment(engagement?.joiningDate?.gregorian).toDate());
    } else if (engagement?.joiningDate && engagement?.joiningDate?.gregorian && this.isHijiri && this.checkPrivate) {
      this.hijiriType = true;
      this.dateForm.get('dateFormat.english').setValue(this.typeHijira);
      this.engagementDetailsForm
        .get('joiningDate.hijiri')
        .setValue(convertToHijriFormat(engagement?.joiningDate?.hijiri));
      this.engagementDetailsForm.get('joiningDate.gregorian').clearValidators();
      this.engagementDetailsForm.get('joiningDate.gregorian').updateValueAndValidity();
      if (engagement?.joiningDate && engagement?.joiningDate?.gregorian) {
        this.engagementDetailsForm
          .get('joiningDate.gregorian')
          .setValue(moment(engagement?.joiningDate?.gregorian).toDate());
      }
    } else if (engagement?.joiningDate && engagement?.joiningDate?.gregorian && !this.checkPrivate) {
      this.hijiriType = false;
      this.engagementDetailsForm
        .get('joiningDate.gregorian')
        .setValue(moment(engagement?.joiningDate?.gregorian).toDate());
    }
    if (engagement?.leavingDate?.entryFormat === CalendarTypeEnum.HIJRI) {
      this.isHijiriLeaving = true;
    } else {
      this.isHijiriLeaving = false;
    }
    if (engagement?.leavingDate && engagement?.leavingDate.gregorian && !this.isHijiriLeaving && this.checkPrivate) {
      this.isEngagementActive = false;
      this.hijiriLeavingType = false;
      this.dateForm1?.get('dateFormat.english').setValue(this.typeGregorian);
      this.engagementDetailsForm
        .get('leavingDate.gregorian')
        .setValue(moment(engagement?.leavingDate.gregorian).toDate());
    } else if (
      engagement?.leavingDate &&
      engagement?.leavingDate.gregorian &&
      this.isHijiriLeaving &&
      this.checkPrivate
    ) {
      this.isEngagementActive = false;
      this.hijiriLeavingType = true;
      this.dateForm1?.get('dateFormat.english').setValue(this.typeHijira);
      this.engagementDetailsForm
        .get('leavingDate.hijiri')
        .setValue(convertToHijriFormat(engagement?.leavingDate.hijiri));
      this.engagementDetailsForm.get('leavingDate.gregorian').clearValidators();
      this.engagementDetailsForm.get('leavingDate.gregorian').updateValueAndValidity();
      if (engagement?.leavingDate && engagement?.leavingDate.gregorian) {
        this.engagementDetailsForm
          .get('leavingDate.gregorian')
          .setValue(moment(engagement?.leavingDate.gregorian).toDate());
      }
    } else if (engagement?.leavingDate && engagement?.leavingDate.gregorian && !this.checkPrivate) {
      this.isEngagementActive = false;
      this.engagementDetailsForm
        .get('leavingDate.gregorian')
        .setValue(moment(engagement?.leavingDate.gregorian).toDate());
    } else {
      this.isEngagementActive = true;
      //If engagement is active remove the validators.
      this.engagementDetailsForm.get('leavingDate.gregorian').clearValidators();
      this.engagementDetailsForm.get('leavingReason.english').clearValidators();
      this.engagementDetailsForm.get('leavingDate.gregorian').updateValueAndValidity();
      this.engagementDetailsForm.get('leavingReason.english').updateValueAndValidity();
    }
    if (engagement?.leavingReason && engagement?.leavingReason.english) {
      this.engagementDetailsForm.get('leavingReason').setValue(engagement?.leavingReason);
      if (
        ContributorConstants.DEAD_LEAVING_REASONS.indexOf(engagement?.leavingReason.english) !== -1 &&
        !this.engagement.proactive
      )
        this.disableLeavingDate = true;
      if (engagement?.leavingReason.english === ContributorConstants.GOV_JOB_JOINING && !this.isAppPrivate) {
        this.disableLeavingDate = true;
        this.disableLeavingReason = true;
      }
    }
    if (engagement?.companyWorkerNumber)
      this.engagementDetailsForm.get('companyWorkerNumber').setValue(engagement?.companyWorkerNumber);
    if (engagement?.workType && engagement?.workType.english)
      this.engagementDetailsForm.get('workType').setValue(engagement?.workType);
    if (!this.isSaudiPerson) {
      this.engagementDetailsForm.get('workType.english').clearValidators();
      this.engagementDetailsForm.get('workType.english').updateValueAndValidity();
    }
    //If system parameter and engagement details are present then check the boundary conditions
    if (this.systemParameter && this.engagement) this.checkBoundaryConditions();
    this.setDateLimit(this.engagementDetailsForm);
    this.setProactiveFlag();
    this.setPenaltyIndicator();
    this.updatePenaltyDisclaimerForm();
    if (this.parentForm.get('engagementDetails')) this.parentForm.removeControl('engagementDetails');
    this.parentForm.addControl('engagementDetails', this.engagementDetailsForm);
    //worktype should be full-time for PPA
    if (this.ppaEstablishment) {
      this.workTypeList = new LovList(
        this.workTypeList?.items?.filter(res => {
          return res?.value?.english === WorkType.FULL_TIME;
        })
      );
    }
  }
  /**Method to diable or enable fileds */
  handleDisableFields(): void {
    if (this.contributor?.person?.personType && this.contributor?.person?.personType !== PersonTypesEnum.SAUDI) {
      this.isSaudiPerson = false;
      if (!this.isAppPrivate) this.disableLeavingDate = this.disableLeavingReason = this.disableJoiningDate = true;
    }
  }
  /**Method to enable or disable fields */
  disableOrEnableFields(isDisable: boolean): void {
    if (isDisable) {
      //Store the fields that are enabled
      if (!this.disableJoiningDate) this.enabledFields.push(ChangeEngagementTransactionType.JOINING_DATE);
      if (!this.disableLeavingDate) this.enabledFields.push(ChangeEngagementTransactionType.LEAVING_DATE);
      if (!this.disableLeavingReason) this.enabledFields.push(ChangeEngagementTransactionType.LEAVING_REASON);
      if (!this.disableWorkType) this.enabledFields.push(ChangeEngagementTransactionType.WORK_TYPE);
      if (!this.disableEmployeeId) this.enabledFields.push(ChangeEngagementTransactionType.EMPLOYEE_ID);
      this.disableLeavingDate =
        this.disableLeavingReason =
        this.disableJoiningDate =
        this.disableWorkType =
        this.disableEmployeeId =
          isDisable;
    } else {
      this.enabledFields.forEach(key => {
        if (key === ChangeEngagementTransactionType.JOINING_DATE) this.disableJoiningDate = false;
        if (key === ChangeEngagementTransactionType.LEAVING_DATE) this.disableLeavingDate = false;
        if (key === ChangeEngagementTransactionType.LEAVING_REASON) this.disableLeavingReason = false;
        if (key === ChangeEngagementTransactionType.WORK_TYPE) this.disableWorkType = false;
        if (key === ChangeEngagementTransactionType.EMPLOYEE_ID) this.disableEmployeeId = false;
      });
      this.enabledFields = [];
    }
  }

  /** Method to set minimum and maximum limit for joining date and leaving date  */
  setDateLimit(form: FormGroup): void {
    this.joiningDate = moment(this.engagement?.joiningDate?.gregorian).toDate();
    this.minHijiriDate = convertToHijriFormat(this.engagement?.joiningDate.hijiri);
    this.minLeavingDateHijiri = convertToHijriFormat(this.engagement?.joiningDate.hijiri);
    this.leavingDateHijiri = convertToHijriFormat(this.engagement?.leavingDate?.hijiri);
    this.maxHijiriDate = this.ppaEstablishment
      ? this.hijiriDateConst?.ppaMaxHijirDate
      : this.hijiriDateConst?.gosiMaxHijiriDate;
    this.maxHijiriJoiningDate = this.isEngagementActive ? this.maxHijiriDate : this.getMinimumHijiriLeavingDate();

    this.maxLeavingDateHijiri = this.isEngagementActive
      ? this.ppaEstablishment
        ? this.hijiriDateConst?.ppaMaxHijirDate
        : this.hijiriDateConst?.gosiMaxHijiriDate
      : this.getMinimumHijiriLeavingDate();
    //In GOL if joining date is before MAX_BACKDATED_JOINING_DATE and leaving date is after MAX_BACKDATED_JOINING_DATE
    //Minimum leaving date is MAX_BACKDATED_JOINING_DATE
    //All other cases minimum leaving date is joining date
    this.minLeavingDate =
      //Removing the GOL Channel check as per story 373203, 375879 for R2
      /* !this.isAppPrivate && */ this.systemParameter &&
      moment(this.engagement?.joiningDate?.gregorian).isSameOrBefore(
        this.systemParameter.CHNG_ENG_MAX_BACKDATED_JOINING_DATE,
        'day'
      ) &&
      moment(this.engagement?.leavingDate?.gregorian).isSameOrAfter(
        this.systemParameter.CHNG_ENG_MAX_BACKDATED_JOINING_DATE,
        'day'
      )
        ? moment(this.systemParameter.CHNG_ENG_MAX_BACKDATED_JOINING_DATE).toDate()
        : moment(this.engagement?.joiningDate?.gregorian).toDate();
    this.leavingDate = this.isEngagementActive
      ? new Date()
      : moment(this.engagement?.leavingDate?.gregorian).isBefore()
      ? moment(this.engagement?.leavingDate?.gregorian).toDate()
      : new Date();
    // if (this.isAppPublic && this.isAdminReEdit && !this.isEngagementActive && !this.backdatedEngValidatorRequired) {
    //   this.minLeavingDate = startOfMonth(subtractMonths(moment(new Date()).toDate(), 24));
    //   if (monthDiff(startOfMonth(this.joiningDate), startOfMonth(new Date())) < 25) {
    //     this.minLeavingDate = this.joiningDate;
    //   }
    //   if (!this.disableJoiningDate) {
    //     this.joiningDate = startOfMonth(subtractMonths(moment(new Date()).toDate(), 24));
    //   }
    // }
    //In validator edit if engagement is active and form submission date is before current date
    //Maximum joining date is form submission date other wise current date
    this.maxJoiningDate = this.isEngagementActive
      ? this.editMode && moment(this.formSubmissionDate).isBefore()
        ? moment(this.formSubmissionDate).toDate()
        : new Date()
      : moment(this.engagement?.leavingDate.gregorian).isBefore()
      ? moment(this.engagement?.leavingDate.gregorian).toDate()
      : new Date();
    if (!this.checkPrivate || (this.checkPrivate && !this.hijiriType && !this.hijiriLeavingType)) {
      form
        .get('joiningDate.gregorian')
        .setValidators([
          Validators.required,
          minDateValidator(this.joiningDate),
          maxDateValidator(this.maxJoiningDate)
        ]);
      form
        .get('leavingDate.gregorian')
        .setValidators([
          Validators.required,
          minDateValidator(this.minLeavingDate),
          maxDateValidator(this.leavingDate)
        ]);
    }

    if (this.ppaEstablishment) {
      this.minJGregorianDate =
        this.joiningDate < new Date(this.hijiriDateConst?.ppaMinGregorianDate)
          ? new Date(this.hijiriDateConst?.ppaMinGregorianDate)
          : this.joiningDate;
      this.minLeavingDate =
        this.minLeavingDate < new Date(this.hijiriDateConst?.ppaMinGregorianDate)
          ? new Date(this.hijiriDateConst?.ppaMinGregorianDate)
          : this.minLeavingDate;
    } else {
      this.minJGregorianDate = this.joiningDate;
    }
  }

  getMinimumHijiriLeavingDate() {
    if (this.leavingDateHijiri) {
      const dateArr = this.leavingDateHijiri.split('/');
      const jArr = this.maxHijiriDate.split('/');
      if (parseInt(dateArr[2]) === parseInt(jArr[2]) && parseInt(dateArr[1]) === parseInt(jArr[1])) {
        if (parseInt(dateArr[0]) > parseInt(jArr[0])) {
          return this.maxHijiriDate;
        } else if (parseInt(dateArr[0]) < parseInt(jArr[0])) {
          return this.leavingDateHijiri;
        } else {
          return this.maxHijiriDate;
        }
      } else if (parseInt(dateArr[2]) === parseInt(jArr[2]) && parseInt(dateArr[1]) !== parseInt(jArr[1])) {
        if (parseInt(dateArr[1]) > parseInt(jArr[1])) {
          return this.maxHijiriDate;
        } else if (parseInt(dateArr[1]) < parseInt(jArr[1])) {
          return this.leavingDateHijiri;
        } else {
          return this.maxHijiriDate;
        }
      } else if (parseInt(dateArr[2]) !== parseInt(jArr[2])) {
        if (parseInt(dateArr[2]) > parseInt(jArr[2])) {
          return this.maxHijiriDate;
        } else if (parseInt(dateArr[2]) < parseInt(jArr[2])) {
          return this.leavingDateHijiri;
        } else {
          return this.leavingDateHijiri;
        }
      }
    }
  }
  /** Method to check boundary conditions. */
  checkBoundaryConditions() {
    //Removing the GOL Channel check as per story 373203, 375879 for R2
    // if (!this.isAppPrivate) {
    //In GOL disable joining date and leaving reason if joining date is before MAX_BACKDATED_JOINING_DATE
    //disable leaving date if leaving date is before MAX_BACKDATED_JOINING_DATE
    if (
      !this.isEngagementActive &&
      moment(this.engagement?.leavingDate.gregorian).isBefore(
        this.systemParameter.CHNG_ENG_MAX_BACKDATED_JOINING_DATE,
        'day'
      )
    ) {
      this.disableJoiningDate = true;
      this.disableLeavingDate = true;
      this.disableLeavingReason = true;
      this.showAllToolTip = !this.editMode;
    } else if (
      moment(this.engagement?.joiningDate?.gregorian).isBefore(
        this.systemParameter.CHNG_ENG_MAX_BACKDATED_JOINING_DATE,
        'day'
      )
    ) {
      this.disableJoiningDate = true;
      this.showJoiningDateToolTip = !this.editMode;
    }
    // }
  }
  /** Method to handle recalculation of date limits. */
  reCalculateDateLimits(changes: SimpleChanges) {
    if (changes.formSubmissionDate && changes.formSubmissionDate.currentValue)
      if (this.engagementDetailsForm)
        //If form is already created, date limits must be re-calculated.
        this.setDateLimit(this.engagementDetailsForm);
    if (changes.systemParameter && changes.systemParameter.currentValue && !changes.engagement) {
      //If engagement details are present, check the boundary conditions and re-calculate date limits.
      if (this.engagement) {
        this.setDateLimit(this.engagementDetailsForm);
        this.checkBoundaryConditions();
      }
    }
  }
  /** Method to set flags for joining / leaving date change. */
  setJoiningOrLeavingDateChangeFlag() {
    this.isJoiningDateChanged = this.checkChangeInJoiningDate(this.engagement?.joiningDate?.gregorian);
    if (!this.isEngagementActive) {
      this.isLeavingDateChanged = this.checkChangeInLeavingDate(this.engagement?.leavingDate.gregorian);
      this.isLeavingReasonChanged =
        this.engagementDetailsForm.get('leavingReason.english').value !== this.engagement?.leavingReason.english;
    }
  }
  /** This method is to disabe the fields, when it is proactive */
  setProactiveFlag() {
    if (this.engagement?.proactive) {
      this.isProactive = true;
      if (this.isAppPrivate) this.disableJoiningDate = true;
      this.disableLeavingReason = false;
    }
  }
  /** Method to set penalty indicator. */
  setPenaltyIndicator() {
    if (this.engagementDetailsForm && this.editMode)
      this.engagementDetailsForm
        .get('penalty.english')
        .setValue(this.penaltyIndicator === 1 ? YesOrNo.YES : YesOrNo.NO);
  }
  /** Method to handle wage change in engagement period. */
  verifyWageChange(event) {
    const engagement: EngagementDetails = JSON.parse(JSON.stringify(this.selectedEngagement));
    this.tempPeriods = [];
    let updatedPeriod: EngagementPeriod = JSON.parse(JSON.stringify(event.updatedPeriod));
    let isFound = false;
    engagement?.engagementPeriod.forEach(period => {
      if (period.id === updatedPeriod.id) {
        if (!isFound) {
          isFound = true;
          event.periods.forEach(item => {
            if (moment(item.startDate.gregorian).isSame(updatedPeriod.startDate.gregorian)) {
              updatedPeriod = this.setWagePeriod(updatedPeriod);
              this.tempPeriods.push(updatedPeriod);
              engagement.updatedPeriod = updatedPeriod;
            } else this.tempPeriods.push(item);
          });
        }
      } else this.tempPeriods.push(period);
    });
    engagement.engagementPeriod = this.tempPeriods;
    this.verify.emit(engagement);
  }
  /** Method to set the changed period to existing period. */
  setWagePeriod(period: EngagementPeriod): EngagementPeriod {
    period.occupation = this.parentForm.get('updatedPeriod.occupation.english').value
      ? this.parentForm.get('updatedPeriod.occupation').value
      : undefined;
    period.jobClassCode = this.parentForm.get('updatedPeriod.jobClassCode').value;
    period.jobClassName = this.parentForm.get('updatedPeriod.jobClassName').value;
    period.jobRankCode = this.parentForm.get('updatedPeriod.jobRankCode').value;
    period.jobRankName = this.parentForm.get('updatedPeriod.jobRankName').value;
    period.jobGradeCode = this.parentForm.get('updatedPeriod.jobGradeCode').value;
    period.jobGradeName = this.parentForm.get('updatedPeriod.jobGradeName').value;
    period.wage = (this.parentForm.get('updatedPeriod.wage') as FormGroup).getRawValue();
    period.contributorAbroad =
      this.parentForm.get('updatedPeriod.contributorAbroad.english').value === YesOrNo.YES ? true : false;
    period.wage.contributoryWage = 0;
    period.wageDetailsUpdated = true;
    return period;
  }
  /** Method to check change in engagement period due to change in engagement start date */
  checkChangeInEngagementPeriod(): void {
    if (!this.isModifyCoverage) {
      this.hijiriType = this.hijiriLeavingType = this.isHijiri = this.isHijiriLeaving = false;
      const deletedPeriods: EngagementPeriod[] = [];
      const periods =
        this.engagement
          .engagementPeriod; /* this.editMode ? this.updatedEngagement.engagementPeriod : this.engagement.engagementPeriod */
      let isJoiningChanged = false;
      let isLeavingChanged = false;
      periods.forEach(period => {
        if (moment(period.startDate.gregorian).isBefore(this.selectedEngagement.joiningDate.gregorian, 'day')) {
          if (moment(period.endDate?.gregorian).isBefore(this.selectedEngagement.joiningDate.gregorian, 'day')) {
            deletedPeriods.push(period);
          } else {
            const newEngPeriod: EngagementPeriod = new EngagementPeriod();
            newEngPeriod.startDate.gregorian = period.startDate.gregorian;
            newEngPeriod.startDate.hijiri = period.startDate.hijiri;
            newEngPeriod.startDate.entryFormat = period.startDate.entryFormat;
            newEngPeriod.endDate.gregorian = subtractDays(this.selectedEngagement.joiningDate.gregorian, 1);
            this.lookupService.getHijriDate(newEngPeriod.endDate.gregorian).subscribe(res => {
              newEngPeriod.endDate.hijiri = res.hijiri;
            });
            newEngPeriod.endDate.entryFormat = period.startDate.entryFormat;
            deletedPeriods.push(newEngPeriod);
          }
          isJoiningChanged = true;
        }
        if (moment(period.endDate?.gregorian).isAfter(this.selectedEngagement.leavingDate?.gregorian, 'day')) {
          if (moment(period.startDate.gregorian).isAfter(this.selectedEngagement.leavingDate.gregorian, 'day')) {
            deletedPeriods.push(period);
          } else {
            const newEngPeriod: EngagementPeriod = new EngagementPeriod();
            newEngPeriod.endDate.gregorian = period.endDate.gregorian;
            newEngPeriod.endDate.hijiri = period.endDate.hijiri;
            newEngPeriod.endDate.entryFormat = period.endDate.entryFormat;
            newEngPeriod.startDate.entryFormat = period.endDate.entryFormat;
            newEngPeriod.startDate.gregorian = moment(this.selectedEngagement.leavingDate.gregorian)
              .add(1, 'days')
              .toDate();
            this.lookupService.getHijriDate(newEngPeriod.startDate.gregorian).subscribe(res => {
              newEngPeriod.startDate.hijiri = res.hijiri;
            });
            deletedPeriods.push(newEngPeriod);
          }
          isLeavingChanged = true;
        }
      });
      if (deletedPeriods.length > 0) {
        this.sortEngagementPeriod(deletedPeriods);
        this.showTemplate(deletedPeriods, isJoiningChanged, isLeavingChanged);
      } else this.modifyPeriodChange();
    } else {
      this.edit.emit(this.tempModifyCoveragePeriod);
    }
  }
  /** Method to sort engagement periods (last added period on top)  */
  sortEngagementPeriod(periods: EngagementPeriod[]) {
    return periods.sort((a, b) => {
      const dateOne = new Date(b.startDate.gregorian);
      const dateTwo = new Date(a.startDate.gregorian);
      return dateOne > dateTwo ? -1 : dateOne < dateTwo ? 1 : 0;
    });
  }
  /** Method to save the changes in period. */
  modifyPeriodChange() {
    markFormGroupTouched(this.engagementDetailsForm);
    if (!this.isEngagementActive)
      this.selectedEngagement.leavingReason = this.engagementDetailsForm.get('leavingReason').value;
    this.selectedEngagement.companyWorkerNumber = this.engagementDetailsForm.get('companyWorkerNumber').value;
    if (this.engagementDetailsForm.get('workType.english').value)
      this.selectedEngagement.workType = this.engagementDetailsForm.get('workType').value;
    if (this.editMode) {
      this.penaltyIndicator = this.engagementDetailsForm.get('penalty.english').value === YesOrNo.YES ? 1 : 0;
      this.penaltyIndicatorChange.emit(this.penaltyIndicator);
    }
    this.selectedEngagement.engagementPeriod.forEach(period => {
      if (period.wage && this.ppaEstablishment) {
        period.wage.commission = null;
        period.wage.housingBenefit = null;
        period.wage.otherAllowance = null;
      }
    });
    this.save.emit(this.selectedEngagement);
  }
  /**Show confirmation pop up */
  showTemplate(deletedPeriods: EngagementPeriod[], isJoiningChanged: boolean, isLeavingChanged: boolean): void {
    const initialState = {
      deletedPeriods: deletedPeriods,
      stringToDisplay:
        isJoiningChanged && isLeavingChanged
          ? 'CONTRIBUTOR.CHANGING-JOINING-LEAVING-DATE'
          : isJoiningChanged
          ? 'CONTRIBUTOR.CHANGING-JOINING-DATE'
          : isLeavingChanged
          ? 'CONTRIBUTOR.CHANGING-LEAVING-DATE'
          : 'CONTRIBUTOR.CHANGING-LEAVING-REASON'
    };
    this.modalRef = this.modalService.show(ConfirmationModalDcComponent, {
      backdrop: true,
      ignoreBackdropClick: true,
      initialState
    });
    this.modalRef.content.modify.subscribe((value: boolean) => {
      if (value === true) this.modifyPeriodChange();
    });
  }
  /** Method to check whether joining date is changed. */
  checkChangeInJoiningDate(joiningDate: Date) {
    let flag = true;
    if (
      this.checkPrivate &&
      this.engagementDetailsForm.get('joiningDate.hijiri').value &&
      this.dateForm.get('dateFormat.english').value == this.typeHijira
    ) {
      if (
        hijiriToJSON(parseToHijiri(this.selectedEngagement.joiningDate.hijiri)) ==
        hijiriToJSON(this.engagementDetailsForm.get('joiningDate.hijiri').value)
      ) {
        flag = false;
      }
      return flag;
    } else if (this.engagementDetailsForm.get('joiningDate.gregorian').value == null) return false;
    else {
      if (
        moment(startOfDay(joiningDate)).isSame(
          startOfDay(this.engagementDetailsForm.get('joiningDate.gregorian').value)
        )
      )
        flag = false;
      return flag;
    }
  }
  /** Method to handle change in joining date. */
  adjustWagePeriodsOnJoiningDateChange() {
    if (this.checkPrivate) {
      if (this.hijiriType || this.engagementDetailsForm.get('joiningDate.hijiri').value !== null) {
        this.calendarService
          .getGregorianDate(hijiriToJSON(this.engagementDetailsForm.get('joiningDate.hijiri').value))
          .subscribe(res => {
            this.joiningGregorianDate = res.gregorian;
            this.engagementDetailsForm
              .get('joiningDate.gregorian')
              .setValue(moment(this.joiningGregorianDate).toDate());
            this.engagementDetailsForm.get('joiningDate.entryFormat').setValue(this.typeHijira);
            if (this.hijiriType) this.dateForm.get('dateFormat.english').setValue(this.typeHijira);
            this.hijiriFunction();
          });
      } else {
        this.engagementDetailsForm.get('joiningDate.entryFormat').setValue(this.typeGregorian);
        this.lookupService
          .getHijriDate(this.engagementDetailsForm.get('joiningDate.gregorian').value)
          .subscribe(res => {
            this.joiningHijiriDate = res.hijiri;
            this.hijiriFunction();
          });
      }
    } else {
      this.hijiriFunction();
    }
  }

  hijiriFunction() {
    if (this.checkChangeInJoiningDate(this.selectedEngagement.joiningDate.gregorian)) {
      if (this.checkValidity(true)) {
        let newPeriods: EngagementPeriod[];
        //Check period expansion only in the case of validator edit.
        if (
          this.checkJoiningDateExpansion(
            this.engagementDetailsForm.get('joiningDate.gregorian').value,
            this.selectedEngagement.joiningDate.gregorian
          ) &&
          this.editMode
        )
          newPeriods = this.handlePeriodExpansion();
        else {
          const originalPeriods: EngagementPeriod[] = this.getOriginalPeriods();
          this.isJoiningDateChanged = this.checkChangeInJoiningDate(this.engagement?.joiningDate?.gregorian);
          this.joiningDateChange.emit(this.isJoiningDateChanged);
          this.toggleScreenActions(); //Check whether document section is required in GOL.
          newPeriods = this.handleJoiningDateChange(originalPeriods);
          //If leaving date is already changed, adjust the periods for it.
          if (this.isLeavingDateChanged) newPeriods = this.handleLeavingDateChange(newPeriods);
          //If wages are changed set it back to new periods
          if (!this.isPeriodSplitted) newPeriods = this.updateWagePeriods(newPeriods);
          else if (!this.editMode) this.isPeriodSplitted = false; //In edit mode splits will not be discarded
        }
        if (this.checkPrivate) {
          if (this.hijiriType || this.engagementDetailsForm.get('joiningDate.hijiri').value !== null) {
            this.selectedEngagement.joiningDate.gregorian = startOfDay(this.joiningGregorianDate);
            this.selectedEngagement.joiningDate.hijiri = hijiriToJSON(
              this.engagementDetailsForm.get('joiningDate.hijiri').value
            );
            this.selectedEngagement.joiningDate.entryFormat =
              this.engagementDetailsForm.get('joiningDate.entryFormat').value;
          } else {
            this.selectedEngagement.joiningDate.gregorian = startOfDay(
              this.engagementDetailsForm.get('joiningDate.gregorian').value
            );
            this.selectedEngagement.joiningDate.hijiri = this.joiningHijiriDate;
            this.selectedEngagement.joiningDate.entryFormat =
              this.engagementDetailsForm.get('joiningDate.entryFormat').value;
          }
        } else {
          this.selectedEngagement.joiningDate.gregorian = startOfDay(
            this.engagementDetailsForm.get('joiningDate.gregorian').value
          );
        }
        this.selectedEngagement.engagementPeriod = [...newPeriods];
        this.tempPeriods = newPeriods; //Since periods got changed, update tempPeriods
      }
    }
  }
  /** Method to check whether leaving date is changed. */
  checkChangeInLeavingDate(leavingDate: Date) {
    let flag = true;
    if (this.checkPrivate && this.engagementDetailsForm.get('leavingDate.hijiri').value) {
      if (
        hijiriToJSON(parseToHijiri(this.selectedEngagement.leavingDate.hijiri)) ==
        hijiriToJSON(this.engagementDetailsForm.get('leavingDate.hijiri').value)
      ) {
        flag = false;
      }
      return flag;
    } else if (this.engagementDetailsForm.get('leavingDate.gregorian').value == null) return false;
    else {
      if (
        moment(startOfDay(leavingDate)).isSame(
          startOfDay(this.engagementDetailsForm.get('leavingDate.gregorian').value)
        )
      )
        flag = false;
      return flag;
    }
  }
  /** Method to handle change in leaving date. */
  adjustWagePeriodsOnLeavingDateChange() {
    if (this.checkPrivate) {
      if (this.hijiriLeavingType || this.engagementDetailsForm.get('leavingDate.hijiri').value !== null) {
        this.calendarService
          .getGregorianDate(hijiriToJSON(this.engagementDetailsForm.get('leavingDate.hijiri').value))
          .subscribe(res => {
            this.leavingGregorianDate = res.gregorian;
            this.engagementDetailsForm
              .get('leavingDate.gregorian')
              .setValue(moment(this.leavingGregorianDate).toDate());
            this.engagementDetailsForm.get('leavingDate.entryFormat').setValue(this.typeHijira);
            this.dateForm1.get('dateFormat.english').setValue(this.typeHijira);
            this.hijiriFunctionLeaving();
          });
      } else {
        this.engagementDetailsForm.get('leavingDate.entryFormat').setValue(this.typeGregorian);
        this.lookupService
          .getHijriDate(this.engagementDetailsForm.get('leavingDate.gregorian').value)
          .subscribe(res => {
            this.leavingHijiriDate = res.hijiri;
            this.hijiriFunctionLeaving();
          });
      }
    } else {
      this.hijiriFunctionLeaving();
    }
  }

  hijiriFunctionLeaving() {
    if (this.checkChangeInLeavingDate(this.selectedEngagement.leavingDate.gregorian)) {
      if (this.checkValidity(false)) {
        let newPeriods: EngagementPeriod[];
        //Check period expansion only in the case of validator edit.
        if (
          this.checkLeavingDateExpansion(
            this.engagementDetailsForm.get('leavingDate.gregorian').value,
            this.isEngagementActive ? new Date() : this.selectedEngagement.leavingDate.gregorian
          ) &&
          this.editMode
        )
          newPeriods = this.handlePeriodExpansion();
        else {
          const originalPeriods: EngagementPeriod[] = this.getOriginalPeriods();
          this.isLeavingDateChanged = this.checkChangeInLeavingDate(this.engagement?.leavingDate.gregorian);
          this.toggleScreenActions(); //Check whether document section is required in GOL.
          newPeriods = this.handleLeavingDateChange(originalPeriods);
          //If joining date was already changed, adjust the periods for it.
          if (this.isJoiningDateChanged) newPeriods = this.handleJoiningDateChange(newPeriods);
          //If wages are changed set it back to new periods
          if (!this.isPeriodSplitted) newPeriods = this.updateWagePeriods(newPeriods);
          else if (!this.editMode) this.isPeriodSplitted = false; //In edit mode splits will not be discarded
        }
        if (this.checkPrivate) {
          if (this.hijiriLeavingType || this.engagementDetailsForm.get('leavingDate.hijiri').value !== null) {
            this.selectedEngagement.leavingDate.gregorian = startOfDay(this.leavingGregorianDate);
            this.selectedEngagement.leavingDate.hijiri = hijiriToJSON(
              this.engagementDetailsForm.get('leavingDate.hijiri').value
            );
            this.selectedEngagement.leavingDate.entryFormat =
              this.engagementDetailsForm.get('leavingDate.entryFormat').value;
          } else {
            this.selectedEngagement.leavingDate.gregorian = startOfDay(
              this.engagementDetailsForm.get('leavingDate.gregorian').value
            );
            this.selectedEngagement.leavingDate.hijiri = this.leavingHijiriDate;
            this.selectedEngagement.leavingDate.entryFormat =
              this.engagementDetailsForm.get('leavingDate.entryFormat').value;
          }
        } else {
          this.selectedEngagement.leavingDate.gregorian = startOfDay(
            this.engagementDetailsForm.get('leavingDate.gregorian').value
          );
        }
        this.selectedEngagement.engagementPeriod = [...newPeriods];
        this.tempPeriods = newPeriods; //Since periods got changed, update tempPeriods
      }
    }
  }
  /** Method to get the base periods in which the joining / leaving date change is to be performed. */
  getOriginalPeriods(): EngagementPeriod[] {
    if (
      this.editMode &&
      (this.checkJoiningDateExpansion(
        this.engagementDetailsForm.get('joiningDate.gregorian').value,
        this.updatedEngagement.joiningDate.gregorian
      ) ||
        this.checkLeavingDateExpansion(
          this.engagementDetailsForm.get('leavingDate.gregorian').value,
          this.isEngagementActive ? new Date() : this.updatedEngagement.leavingDate.gregorian
        ))
    )
      //In edit mode if periods are expanded, base period should have those expanded periods.
      return this.handlePeriodExpansion();
    //In edit mode the base period will be updated engagement.
    else if (this.editMode) return this.clonePeriods(this.updatedEngagement);
    else return this.clonePeriods(this.engagement);
  }
  /** Check whether the dates are valid or not. */
  checkValidity(isJoiningDate: boolean): boolean {
    let isValid = true;
    if (
      (this.engagementDetailsForm.get('joiningDate.gregorian').valid ||
        this.engagementDetailsForm.get('joiningDate.gregorian').disabled) &&
      (this.engagementDetailsForm.get('leavingDate.gregorian').valid ||
        this.engagementDetailsForm.get('leavingDate.gregorian').disabled)
    ) {
      const joiningDate = startOfDay(this.engagementDetailsForm.get('joiningDate.gregorian').value);
      const leavingDate = startOfDay(this.engagementDetailsForm.get('leavingDate.gregorian').value);
      //If joining date is not before leaving date, set joiningDate/leavingDate to previous value.
      if (!moment(joiningDate).isSameOrBefore(leavingDate) && !this.isEngagementActive) {
        isValid = false;
        if (isJoiningDate) {
          this.engagementDetailsForm
            .get('joiningDate.gregorian')
            .patchValue(moment(this.selectedEngagement.joiningDate.gregorian).toDate());
          if (this.checkPrivate)
            this.engagementDetailsForm
              .get('joiningDate.hijiri')
              .patchValue(convertToHijriFormat(this.selectedEngagement.joiningDate.hijiri));
        } else {
          this.engagementDetailsForm
            .get('leavingDate.gregorian')
            .patchValue(moment(this.selectedEngagement.leavingDate.gregorian).toDate());
          if (this.checkPrivate)
            this.engagementDetailsForm
              .get('leavingDate.hijiri')
              .patchValue(convertToHijriFormat(this.selectedEngagement.leavingDate.hijiri));
        }
      }
    } else isValid = false;
    return isValid;
  }
  /** Method to adjust wage periods on change of joining date. */
  handleJoiningDateChange(periods: EngagementPeriod[]): EngagementPeriod[] {
    const newPeriods: EngagementPeriod[] = [];
    const joiningDate = startOfDay(this.engagementDetailsForm?.get('joiningDate')?.get('gregorian')?.value);
    const joiningDateHijiri = convertToHijriFormat(
      this.engagementDetailsForm?.get('joiningDate')?.get('hijiri')?.value
    );
    let itemFound = false;
    periods.reverse().forEach(item => {
      if (!itemFound) {
        if (moment(joiningDate).isSameOrAfter(item.startDate.gregorian, 'day')) {
          if (!item.endDate || (item.endDate && moment(joiningDate).isSameOrBefore(item.endDate.gregorian, 'day'))) {
            item.startDate.gregorian = joiningDate;
            item.startDate.hijiri = joiningDateHijiri;
            item.startDate.entryFormat = this.engagementDetailsForm.get('joiningDate')?.get('entryFormat')?.value
              ? this.engagementDetailsForm.get('joiningDate')?.get('entryFormat')?.value
              : this.typeGregorian;
            newPeriods.push(item);
            itemFound = true;
          }
        }
      } else newPeriods.push(item);
    });
    return newPeriods.reverse();
  }
  /** Method to adjust wage periods on change of leaving date. */
  handleLeavingDateChange(periods: EngagementPeriod[]): EngagementPeriod[] {
    const newPeriods: EngagementPeriod[] = [];
    const leavingDate = startOfDay(this.engagementDetailsForm.get('leavingDate.gregorian').value);
    const leavingDateHijiri = convertToHijriFormat(this.engagementDetailsForm.get('leavingDate.hijiri').value);
    let itemFound = false;
    periods.forEach(item => {
      if (!itemFound) {
        if (moment(leavingDate).isSameOrBefore(item.endDate.gregorian, 'day')) {
          if (moment(leavingDate).isSameOrAfter(item.startDate.gregorian, 'day')) {
            itemFound = true;
            item.endDate.gregorian = leavingDate;
            item.endDate.hijiri = leavingDateHijiri;
            item.endDate.entryFormat = this.engagementDetailsForm.get('leavingDate')?.get('entryFormat')?.value;
            newPeriods.push(item);
          }
        }
      } else newPeriods.push(item);
    });
    return newPeriods;
  }
  /** Method to clone the periods from an engagement. */
  clonePeriods(engagement: EngagementDetails): EngagementPeriod[] {
    const periods: EngagementPeriod[] = [];
    engagement?.engagementPeriod.forEach(item => {
      periods.push(JSON.parse(JSON.stringify(item)));
    });
    return periods;
  }
  /** Method to update wage record in case of any previous change. */
  updateWagePeriods(periods: EngagementPeriod[]): EngagementPeriod[] {
    if (this.tempPeriods.length > 0) {
      this.tempPeriods.forEach(item => {
        periods.forEach(period => {
          if (item.wageDetailsUpdated && item.id === period.id) {
            period.wageDetailsUpdated = item.wageDetailsUpdated;
            period.occupation = item?.occupation;
            period.jobClassCode = item?.jobClassCode;
            period.jobClassName = item?.jobClassName;
            period.jobRankCode = item?.jobRankCode;
            period.jobRankName = item?.jobRankName;
            period.jobGradeCode = item?.jobGradeCode;
            period.jobGradeName = item?.jobGradeName;
            period.wage = item.wage;
          }
        });
      });
    }
    return periods;
  }
  /**Method to check if death reason is selected and to set leaving date */
  checkLeavingReason() {
    if (this.engagementDetailsForm) {
      const leavingReason = this.engagementDetailsForm.get('leavingReason.english').value;
      this.tempLeavingReason = this.selectedEngagement.leavingReason;
      this.selectedEngagement.leavingReason = this.engagementDetailsForm.get('leavingReason').value;
      this.isLeavingReasonChanged = leavingReason !== this.engagement?.leavingReason.english;
      this.toggleScreenActions(); //Check whether document section is required in GOL.
      if (ContributorConstants.DEAD_LEAVING_REASONS.indexOf(leavingReason) !== -1 && this.isSaudiPerson) {
        this.disableLeavingDate = true;
        this.nicCheck = true;
        this.isDisableInValidator = false;
        if (this.editMode && this.validatorLeavingDate && this.validatorLeavingReason) {
          this.isDisableInValidator = false;
        } else if (this.editMode && !this.validatorLeavingDate && this.validatorLeavingReason) {
          this.isDisableInValidator = true;
        }
        this.nicCallParam();
      } else if (this.disableLeavingDate && !this.editMode) this.disableLeavingDate = false;
      if (
        leavingReason !== ContributorConstants.DEAD_LEAVING_REASONS[0] &&
        leavingReason !== ContributorConstants.DEAD_LEAVING_REASONS[1] &&
        leavingReason !== ContributorConstants.DEAD_LEAVING_REASONS[2] &&
        leavingReason !== ContributorConstants.DEAD_LEAVING_REASONS[3] &&
        leavingReason !== ContributorConstants.DEAD_LEAVING_REASONS[4] &&
        leavingReason !== ContributorConstants.DEAD_LEAVING_REASONS[5] &&
        this.isSaudiPerson
      ) {
        this.nicCheck = false;
        if (this.editMode && this.validatorLeavingDate && this.validatorLeavingReason) {
          this.disableLeavingDate = false;
        } else if (this.editMode && !this.validatorLeavingDate && this.validatorLeavingReason) {
          this.disableLeavingDate = true;
        } else {
          this.disableLeavingDate = false;
        }
        this.isDisableInValidator = false;
        this.nicCallParam();
      }
    }
  }
  /**Method to pass queryParam for NIC call */
  nicCallParam() {
    this.personNin[0] = this.contributor.person.identity[0];
    const ninNumber = this.personNin[0].newNin;
    this.queryParams = `NIN=${ninNumber}`;
    this.nicCall.emit({
      nicCheck: this.nicCheck,
      queryParams: this.queryParams,
      leavingDeathReason: this.leavingDeathReason
    });
  }
  /**Method to set original leaving date or death date which ever is earlier */
  setLeavingDate() {
    const leavingDate = this.engagementDetailsForm.get('leavingDate.gregorian');
    const leavingDateHijiri = this.engagementDetailsForm.get('leavingDate.hijiri');
    if (moment(this.engagement?.leavingDate?.gregorian).isBefore(this.contributor.person?.deathDate?.gregorian)) {
      leavingDate.setValue(moment(this.engagement?.leavingDate.gregorian).toDate());
      leavingDateHijiri.setValue(parseToHijiriFromApi(this.engagement?.leavingDate.hijiri));
    } else if (this.contributor.person?.deathDate?.gregorian) {
      leavingDate.setValue(moment(this.contributor.person.deathDate.gregorian).toDate());
      leavingDateHijiri.setValue(parseToHijiriFromApi(this.contributor.person.deathDate.hijiri));
    }
    if (!this.isDisableInValidator) {
      if (this.nicDetails == null) {
        this.engagementDetailsForm
          .get('leavingDate.gregorian')
          .setValue(moment(this.engagement?.leavingDate.gregorian).toDate());
        this.engagementDetailsForm
          .get('leavingDate.hijiri')
          .setValue(parseToHijiriFromApi(this.engagement?.leavingDate.hijiri));
      } else if (moment(this.engagement?.leavingDate?.gregorian).isBefore(this.nicDetails.gregorian)) {
        this.engagementDetailsForm
          .get('leavingDate.gregorian')
          .setValue(moment(this.engagement?.leavingDate.gregorian).toDate());
        this.engagementDetailsForm
          .get('leavingDate.hijiri')
          .setValue(parseToHijiriFromApi(this.engagement?.leavingDate.hijiri));
      } else if (moment(this.engagement?.leavingDate?.gregorian).isSameOrAfter(this.nicDetails.gregorian)) {
        this.engagementDetailsForm.get('leavingDate.gregorian').setValue(moment(this.nicDetails.gregorian).toDate());
        this.engagementDetailsForm.get('leavingDate.hijiri').setValue(parseToHijiriFromApi(this.nicDetails.hijiri));
      }
    } else {
      // this is in validator, if termination date is not edited  in change engagement and termination reason is only enabled in validator
      this.engagementDetailsForm
        .get('leavingDate.gregorian')
        .setValue(moment(this.engagement?.leavingDate.gregorian).toDate());
      this.engagementDetailsForm
        .get('leavingDate.hijiri')
        .setValue(parseToHijiriFromApi(this.engagement?.leavingDate.hijiri));
    }
    if (moment(this.nicDetails.gregorian).isBefore(moment(this.systemParameter.PPA_CALENDAR_SHIFT_DATE))) {
      this.dateForm1.get('dateFormat.english').disable();
      this.switchCalendarType1(this.typeHijira, false);
      this.dateForm1.updateValueAndValidity();
    }
    if (moment(this.nicDetails.gregorian).isAfter(moment(this.systemParameter.PPA_CALENDAR_SHIFT_DATE))) {
      this.dateForm1.get('dateFormat.english').disable();
      this.switchCalendarType1(this.typeGregorian, false);
      this.dateForm1.updateValueAndValidity();
    }
  }
  /** Method to toggle action in screen. */
  toggleScreenActions() {
    //In GOL if there is change in joining date, leaving date or leaving reason enable document section.
    if (!this.isAppPrivate)
      this.fieldChanged.emit(this.isJoiningDateChanged || this.isLeavingDateChanged || this.isLeavingReasonChanged);
  }
  /** Method to cancel the transaction. */
  cancelTransaction() {
    this.cancel.emit();
  }
  /** Method to check whether periods are splitted or not. */
  checkPeriodSplit() {
    let flag = false;
    this.selectedEngagement.engagementPeriod.forEach((period, index, array) => {
      if (!flag) {
        if (array[index + 1] && period.id === array[index + 1].id) flag = true;
      }
    });
    return flag;
  }
  /** Method to delete the splitted period. */
  deleteSplittedPeriod(startDate: Date) {
    this.selectedEngagement.engagementPeriod.forEach((item, index) => {
      if (moment(startDate).isSame(item.startDate.gregorian, 'day')) {
        if (item.endDate) {
          this.selectedEngagement.engagementPeriod[index + 1].endDate.gregorian = endOfMonth(item.endDate.gregorian);
          if (this.checkPrivate) {
            this.selectedEngagement.engagementPeriod[index + 1].endDate.gregorian = item.endDate.gregorian;
            this.selectedEngagement.engagementPeriod[index + 1].endDate.hijiri = item.endDate.hijiri;
          }
        } else {
          this.selectedEngagement.engagementPeriod[index + 1].endDate = undefined;
        }
        this.selectedEngagement.engagementPeriod.splice(index, 1);
      }
    });
    this.selectedEngagement.engagementPeriod = [...this.selectedEngagement.engagementPeriod];
    this.isPeriodSplitted = this.checkPeriodSplit();
  }
  /** Method to identify the changes/modification  in engagement. */
  identifyTheChanges() {
    if (this.editMode && this.changeRequestTypes && this.changeRequestTypes.length > 0) {
      this.disableLeavingDate = true;
      this.disableLeavingReason = true;
      this.disableJoiningDate = true;
      this.disableWorkType = true;
      this.disableEmployeeId = true;
      this.changeRequestTypes.forEach(param => {
        const key = ChangeEngagementTransactionType[param];
        if (key) {
          switch (key) {
            case ChangeEngagementTransactionType.WORK_TYPE:
              this.disableWorkType = false;
              break;
            case ChangeEngagementTransactionType.EMPLOYEE_ID:
              this.disableEmployeeId = false;
              break;
            case ChangeEngagementTransactionType.JOINING_DATE:
              this.disableJoiningDate = false;
              break;
            case ChangeEngagementTransactionType.LEAVING_DATE:
              this.disableLeavingDate = false;
              this.validatorLeavingDate = true;
              break;
            case ChangeEngagementTransactionType.LEAVING_REASON:
              this.disableLeavingReason = false;
              this.validatorLeavingReason = true;
              if (
                this.engagementDetailsForm.get('leavingReason.english').value !==
                ContributorConstants.DEAD_LEAVING_REASONS
              ) {
                this.leavingDeathReason = true;
                this.nicCheck = false;
                this.nicCallParam();
              }
              break;
            case ChangeEngagementTransactionType.BACKDATED_WAGE:
              this.backWage = true;
              break;
          }
        }
      });
    }
  }
  /** Method to reset the changed field to valid value. */
  resetChangedField() {
    switch (this.periodAdjustFlag) {
      case null: {
        this.engagementDetailsForm.get('leavingReason').setValue(this.tempLeavingReason);
        this.engagementDetailsForm
          .get('leavingDate.gregorian')
          .setValue(moment(this.selectedEngagement.leavingDate.gregorian).toDate());
        if (this.checkPrivate)
          this.engagementDetailsForm
            .get('leavingDate.hijiri')
            .patchValue(convertToHijriFormat(this.selectedEngagement.leavingDate.hijiri));
        this.disableLeavingDate = false;
        break;
      }
      case true: {
        this.engagementDetailsForm
          .get('joiningDate.gregorian')
          .setValue(moment(this.selectedEngagement.joiningDate.gregorian).toDate());
        if (this.checkPrivate)
          this.engagementDetailsForm
            .get('joiningDate.hijiri')
            .patchValue(convertToHijriFormat(this.selectedEngagement.joiningDate.hijiri));
        break;
      }
      case false: {
        this.engagementDetailsForm
          .get('leavingDate.gregorian')
          .setValue(moment(this.selectedEngagement.leavingDate.gregorian).toDate());
        if (this.checkPrivate)
          this.engagementDetailsForm
            .get('leavingDate.hijiri')
            .patchValue(convertToHijriFormat(this.selectedEngagement.leavingDate.hijiri));
        break;
      }
    }
    this.periodAdjustFlag = undefined;
  }
  /** Method to set edit in progree flag when period being edited. */
  handlePeriodEdit(flag: boolean) {
    this.periodEditInProgress = flag;
    this.disableOrEnableFields(flag);
    this.editInProgress.emit(this.periodEditInProgress);
  }
  /** Method to set context of the tooltip based on field. */
  setTooltipContext(identifier: number) {
    if (identifier === 1)
      this.tooltipLabel = this.isAppPrivate
        ? 'CONTRIBUTOR.JOINING-DATE-BEYOND-LIMIT-MESSAGE'
        : 'CONTRIBUTOR.JOINING-DATE-BEYOND-LIMIT-MESSAGE-GOL';
    else if (identifier === 2)
      this.tooltipLabel = this.isAppPrivate
        ? 'CONTRIBUTOR.LEAVING-DATE-BEYOND-LIMIT-MESSAGE'
        : 'CONTRIBUTOR.LEAVING-DATE-BEYOND-LIMIT-MESSAGE-GOL';
    else if (identifier === 3)
      this.tooltipLabel = this.isAppPrivate
        ? 'CONTRIBUTOR.LEAVING-REASON-BEYOND-LIMIT-MESSAGE'
        : 'CONTRIBUTOR.LEAVING-REASON-BEYOND-LIMIT-MESSAGE-GOL';
    return this.tooltipTemplate;
  }
  /** This method is to show the modal reference. */
  showModal(template: TemplateRef<HTMLElement>, flag: boolean) {
    this.periodAdjustFlag = flag;
    if (this.periodAdjustFlag === true) this.messageToDisplay = 'CONTRIBUTOR.CHANGING-JOINING-DATE-ON-PERIOD-SPLIT';
    else if (this.periodAdjustFlag === false)
      this.messageToDisplay = 'CONTRIBUTOR.CHANGING-LEAVING-DATE-ON-PERIOD-SPLIT';
    else this.messageToDisplay = 'CONTRIBUTOR.CHANGING-LEAVING-REASON-ON-PERIOD-SPLIT';
    const config = { backdrop: true, ignoreBackdropClick: true, class: 'modal-dialog-centered' };
    this.modalRef = this.modalService.show(template, config);
  }
  /** This method is to hide the modal reference. */
  hideModal() {
    this.resetChangedField();
    this.modalRef.hide();
  }
  /** Method to adjust wage periods base on the change happened. */
  adjustWagePeriods() {
    if (this.periodAdjustFlag) this.adjustWagePeriodsOnJoiningDateChange();
    else this.adjustWagePeriodsOnLeavingDateChange(); //When periodAdjustFlag is null or false
    this.modalRef.hide();
  }
  /** Method to check whether period is getting expanded while changing joining date. */
  checkJoiningDateExpansion(newJoiningDate: Date, oldJoiningDate: Date): boolean {
    let flag = false;
    if (moment(newJoiningDate).isBefore(oldJoiningDate, 'day')) flag = true;
    return flag;
  }
  /** Method to check whether period is getting expanded while changing leaving date. */
  checkLeavingDateExpansion(newLeavingDate: Date, oldLeavingDate: Date): boolean {
    let flag = false;
    if (moment(newLeavingDate).isAfter(oldLeavingDate, 'day')) flag = true;
    return flag;
  }
  /** Method to find the extra period that need to be added when periods expand while changing joining / leaving date. */
  findExtraPeriods(startDate: Date, endDate: Date): EngagementPeriod[] {
    //startDate and endDate is the range in which the outside periods are to be found.
    const extraPeriods: EngagementPeriod[] = [];
    const periods: EngagementPeriod[] = this.clonePeriods(this.engagement);
    periods.reverse().forEach(period => {
      //Identify the period from original periods which falls in the given range.
      if (
        moment(startDate).isBetween(
          period.startDate.gregorian,
          period.endDate ? period.endDate.gregorian : new Date(),
          'day',
          '[]'
        ) &&
        moment(period.startDate.gregorian).isSameOrBefore(endDate, 'day') &&
        !moment(startDate).isAfter(endDate, 'day')
      ) {
        //Set the period details in the given range.
        const newPeriod: EngagementPeriod = JSON.parse(JSON.stringify(period));
        if (!period.endDate) newPeriod.endDate = new GosiCalendar();
        //Set period start date if only a part of period is in the range.
        if (moment(period.startDate.gregorian).isSameOrBefore(startDate, 'day'))
          newPeriod.startDate.gregorian = startOfDay(startDate);
        //Set period end date if only a part of period is in the range.
        if (moment(period.endDate ? period.endDate.gregorian : new Date()).isSameOrAfter(endDate, 'day'))
          newPeriod.endDate.gregorian = startOfDay(endDate);
        //Update startDate of range after a period in the given range is identified.
        startDate = startOfDay(addDays(newPeriod.endDate.gregorian, 1));
        extraPeriods.push(newPeriod);
      }
    });
    return extraPeriods;
  }
  /** Method to add the extra periods identified to the period list. */
  addExtraPeriodsBack(
    basePeriods: EngagementPeriod[],
    extraPeriods: EngagementPeriod[],
    flag: boolean
  ): EngagementPeriod[] {
    //flag true indicates joining date change, false indicates leaving date change.
    const newPeriods: EngagementPeriod[] = [];
    basePeriods = basePeriods.reverse(); //To make the period in ascending order.
    let lastFoundIndex = 0;
    let isAnyPeriodFound = false;
    //Create a list with extra periods, also identify whether the extra period is part of any other period.
    extraPeriods.forEach(newPeriod => {
      let found = false;
      basePeriods.forEach((oldPeriod, index) => {
        if (!found) {
          //If the extra periods have period with same id as that of current periods,
          //then the extra period is part of that period, update the period's start or end based on extra period
          if (this.checkPeriodEligibility(oldPeriod, newPeriod, basePeriods.length, flag, index)) {
            found = true;
            lastFoundIndex = index;
            isAnyPeriodFound = true;
            //If joining date is changed, update start date only.
            if (flag) oldPeriod.startDate = newPeriod.startDate;
            //If leaving date is changed, update end date only.
            else oldPeriod.endDate = newPeriod.endDate;
            newPeriods.push(oldPeriod);
          }
        }
      });
      //If the extra period is not part of any of current periods, it is entirely a new period add it to the list.
      if (!found) newPeriods.push(newPeriod);
    });
    //Add the remaining periods to the new list.
    //If joining date is changed, the rest of the periods from lastFoundIndex + 1 of current periods are added to the end of list.
    if (flag)
      basePeriods.forEach((period, index) => {
        lastFoundIndex = isAnyPeriodFound ? lastFoundIndex : -1;
        if (index > lastFoundIndex) newPeriods.push(period);
      });
    //If leaving date is changed, the rest of the periods from 0 to lastFoundIndex - 1 of current periods are added to the start of list.
    else
      basePeriods.forEach((period, index) => {
        lastFoundIndex = isAnyPeriodFound ? lastFoundIndex : basePeriods.length;
        if (index < lastFoundIndex) newPeriods.splice(index, 0, period);
      });
    return newPeriods.reverse();
  }
  /** Method to check whether the period is part of extra period identified. */
  checkPeriodEligibility(
    oldPeriod: EngagementPeriod,
    newPeriod: EngagementPeriod,
    length: number,
    flag: boolean,
    index: number
  ) {
    let isEligible = false;
    if (oldPeriod.id === newPeriod.id) {
      if (flag && index === 0) isEligible = true;
      //If joining date is expanded new period should be added at the start of periods.
      else if (!flag && index === length - 1) isEligible = true; //if leaving date is expanded new period should be added at the end of periods.
    }
    return isEligible;
  }
  /** Method to handle expansion of period due to change in joining date. */
  handleJoiningDateExpansion(periods: EngagementPeriod[]): EngagementPeriod[] {
    const extraPeriods = this.findExtraPeriods(
      this.engagementDetailsForm.get('joiningDate.gregorian').value,
      subtractDays(this.updatedEngagement.joiningDate.gregorian, 1)
    );
    return this.addExtraPeriodsBack(periods, extraPeriods, true);
  }
  /** Method to handle expansion of period due to change in leaving date. */
  handleLeavingDateExpansion(periods: EngagementPeriod[]): EngagementPeriod[] {
    const extraPeriods = this.findExtraPeriods(
      addDays(this.updatedEngagement.leavingDate.gregorian, 1),
      this.engagementDetailsForm.get('leavingDate.gregorian').value
    );
    return this.addExtraPeriodsBack(periods, extraPeriods, false);
  }
  /** Method to handle expansion of periods based on the change. */
  handlePeriodExpansion(): EngagementPeriod[] {
    const periods: EngagementPeriod[] = this.clonePeriods(this.selectedEngagement);
    const isJoiningDate = this.checkJoiningDateExpansion(
      this.engagementDetailsForm.get('joiningDate.gregorian').value,
      this.updatedEngagement.joiningDate.gregorian
    );
    const isLeavingDate = this.checkLeavingDateExpansion(
      this.engagementDetailsForm.get('leavingDate.gregorian').value,
      this.isEngagementActive ? new Date() : this.updatedEngagement.leavingDate.gregorian
    );
    if (isJoiningDate && isLeavingDate)
      return this.handleLeavingDateExpansion(this.handleJoiningDateExpansion(periods));
    else if (isJoiningDate) return this.handleJoiningDateExpansion(periods);
    else if (isLeavingDate) return this.handleLeavingDateExpansion(periods);
  }
  /** Method to update penalty disclaimer form. */
  updatePenaltyDisclaimerForm() {
    if (this.isEngagementActive) {
      // this.engagementDetailsForm.get('penalty').get('english').clearValidators();
      this.engagementDetailsForm.get('penaltyDisclaimer').clearValidators();
    } else if (
      this.parentForm.get('engagementDetails') &&
      this.parentForm.get('engagementDetails.penaltyDisclaimer').value
    )
      this.engagementDetailsForm.get('penaltyDisclaimer').setValue(true);
    this.engagementDetailsForm.get('penaltyDisclaimer').updateValueAndValidity();
    // this.engagementDetailsForm.get('penalty').get('english').updateValueAndValidity();
  }
  modifyCoverage(res) {
    this.modifyCoverageValues.emit(res);
  }

  modifyCoverageDate(res) {
    this.modifyCoverageDateValues.emit(res);
  }

  modifyCoverageEdit(res) {
    this.tempModifyCoveragePeriod = res;
    this.coverageValidity.emit();
  }
  periodEdit(res) {
    this.periodEditInProgress = res;
  }

  createDateTypeForm() {
    return this.fb.group({
      dateFormat: this.fb.group({
        english: [this.typeGregorian, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [this.typeHijira, { validators: Validators.required, updateOn: 'blur' }]
      })
    });
  }

  switchCalendarType(type) {
    this.dateForm.get('dateFormat.english').setValue(type);
    this.engagementDetailsForm.get('joiningDate.entryFormat').setValue(type);
    this.engagementDetailsForm.get('joiningDate.gregorian').reset();
    this.engagementDetailsForm.get('joiningDate.hijiri').reset();

    if (type === this.typeGregorian) {
      // Set validators for Gregorian date
      this.engagementDetailsForm.get('joiningDate.gregorian').setValidators([Validators.required]);
      this.engagementDetailsForm.get('joiningDate.hijiri').clearValidators(); // Remove validators for Hijiri date
      this.hijiriType = false;
    } else if (type === this.typeHijira) {
      // Set validators for Hijiri date
      this.engagementDetailsForm.get('joiningDate.gregorian').clearValidators(); // Remove validators for Gregorian date
      this.engagementDetailsForm.get('joiningDate.hijiri').setValidators([Validators.required]);
      this.hijiriType = true;
    }

    // Update the form controls' validation status
    this.engagementDetailsForm.get('joiningDate.gregorian').updateValueAndValidity();
    this.engagementDetailsForm.get('joiningDate.hijiri').updateValueAndValidity();
  }

  switchCalendarType1(type, resetValue = true) {
    this.dateForm1.get('dateFormat.english').setValue(type);
    this.engagementDetailsForm.get('leavingDate.entryFormat').setValue(type);
    if (resetValue) {
      this.engagementDetailsForm.get('leavingDate.gregorian').reset();
      this.engagementDetailsForm.get('leavingDate.hijiri').reset();
    }

    if (type === this.typeGregorian) {
      // Set validators for Gregorian date
      this.engagementDetailsForm.get('leavingDate.gregorian').setValidators([Validators.required]);
      this.engagementDetailsForm.get('leavingDate.hijiri').clearValidators(); // Remove validators for Hijiri date
      this.hijiriLeavingType = false;
    } else if (type === this.typeHijira) {
      // Set validators for Hijiri date
      this.engagementDetailsForm.get('leavingDate.gregorian').clearValidators(); // Remove validators for Gregorian date
      this.engagementDetailsForm.get('leavingDate.hijiri').setValidators([Validators.required]);
      this.hijiriLeavingType = true;
    }

    // Update the form controls' validation status
    this.engagementDetailsForm.get('leavingDate.gregorian').updateValueAndValidity();
    this.engagementDetailsForm.get('leavingDate.hijiri').updateValueAndValidity();
  }
}
