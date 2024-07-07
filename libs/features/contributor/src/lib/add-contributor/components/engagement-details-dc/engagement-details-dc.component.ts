/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  AfterViewInit,
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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BaseComponent,
  bindToObject,
  CalendarTypeEnum,
  convertToHijriFormat,
  GosiCalendar,
  LookupService,
  Lov,
  LovList,
  markFormGroupTouched,
  startOfDay,
  subtractDays
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import {
  ContributorTypesEnum,
  EngagementDetails,
  EngagementPeriod,
  HijiriConstant,
  ManageWageLookUp,
  PersonalInformation
} from '../../../shared';
import { SystemParameter } from '../../../shared/models/system-parameter';
import { EngagementWageAddDcComponent } from '../engagement-wage-add-dc/engagement-wage-add-dc.component';
import { gradeDetails } from '../../../shared/models/jobGradeDetails';
import { classDetails } from '../../../shared/models/jobClassDetails';
@Component({
  selector: 'cnt-engagement-details-dc',
  templateUrl: './engagement-details-dc.component.html'
})
export class EngagementDetailsDcComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit {
  /**
   * Variable declaration and initialization
   */
  modalRef: BsModalRef;
  hijiriMax: any;
  joiningDate: Date;
  leavingDate: Date;
  leavingReason: string;
  minJoiningDate: Date;
  maxJoiningDate: Date;
  maxLeavingDate: Date;
  minLeavingDate: Date;
  maxHijiriLeavingDate: string;
  isDeleteWageSection: boolean = false;
  resetDateForm: boolean = false;

  // hijiri handling
  joiningDateHijiri: string;
  joiningDateEntryFormat: string;

  disableLeavingDate = true;
  disableLeavingReason = false;

  employeeIdMaxLength: number;
  contributorTypes = ContributorTypesEnum;

  maxWageAddDate: Date = new Date();
  minDateWageAdd: Date;

  currentAge: number;
  disableWageAddSection = true;
  isWageAdditionOn = false;
  isPeriodEditOn = false;

  engagementDetailsForm: FormGroup;
  engagementWageDetails: EngagementPeriod[] = [];

  //-----Wage-Period-Variables
  contributorAbroadStatus: boolean;
  isWageInfoVisible: boolean;
  disableJoining = true;
  // Additional period minstartMonth setting
  isAddition: boolean;
  joiningDateforAddPeriod: string;

  disableBasicWage: boolean;
  /**
   * Input variables
   */
  @Input() workTypeList$: Observable<LovList>;
  @Input() occupationList: LovList;
  @Input() contributorAbroad$: Observable<LovList>;
  @Input() contributorType: string;
  @Input() isGccEstablishment: boolean;
  @Input() systemParams: SystemParameter;
  @Input() engagementDetails: EngagementDetails;
  @Input() leavingReasonLovList$: Observable<LovList>;
  @Input() inEditMode: boolean;
  @Input() penaltyIndicator: boolean;
  @Input() backdatedContributor: boolean;
  @Input() isDocumentsRequired: boolean;
  @Input() isPrivate: boolean;
  @Input() person: PersonalInformation;
  @Input() isBeneficiary: boolean;
  @Input() isSubmit: boolean;
  @Input() isContractRequired: boolean;
  @Input() isApiTriggered: boolean;
  @Input() checkLegal: boolean;
  @Input() disableTerminate: boolean;
  @Input() backdatedEngValidatorRequired: boolean;
  @Input() ppaEstablishment: boolean;
  @Input() jobClassDetails: classDetails[];
  @Input() jobClassLov: Lov[] = [];
  @Input() jobRankLov: Lov[] = [];
  @Input() jobGradeLov: Lov[] = [];
  @Input() jobGradeApiResponse: gradeDetails[];
  @Input() lovDataList: ManageWageLookUp[] = new Array<ManageWageLookUp>();
  @Input() hijiriDateConst: HijiriConstant;
  @Input() isDraftAvailable: boolean;
  @Input() checkPersonalDetailsSaved: boolean;
  @Input() isUnclaimed: boolean;

  /**
   * Output event emitters
   */
  @Output() checkDocRequired: EventEmitter<Object> = new EventEmitter();
  @Output() save: EventEmitter<object> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() showError: EventEmitter<string> = new EventEmitter();
  @Output() jobClassListChange: EventEmitter<Lov> = new EventEmitter();
  @Output() jobRankListChange: EventEmitter<Lov> = new EventEmitter();
  @Output() selectedClassIndex: EventEmitter<object> = new EventEmitter();
  @Output() lovDataListChange: EventEmitter<ManageWageLookUp[]> = new EventEmitter();

  /**
   * Template & directive references
   */
  @ViewChild(EngagementWageAddDcComponent, { static: false })
  engagementWageAddDcComponent: EngagementWageAddDcComponent;
  @ViewChild('draftTemplate', { static: true })
  draftTemplate: TemplateRef<HTMLElement>;
  @ViewChild('cancelEngagementTemplate', { static: true })
  cancelEngagementTemplate: TemplateRef<HTMLElement>;
  wageStartDate: GosiCalendar = new GosiCalendar();

  /**
   * Method to initialize values on class instantiation
   * @param fb
   */
  constructor(private fb: FormBuilder, readonly lookupService: LookupService, private modalService: BsModalService) {
    super();
  }

  /**
   * Method to handle all initial tasks on component load
   */
  ngOnInit() {
    this.hijiriMax = this.ppaEstablishment
      ? this.hijiriDateConst?.ppaMaxHijirDate
      : this.hijiriDateConst?.gosiMaxHijiriDate;
    this.engagementDetailsForm = this.createEngagementDetailsForm();
    this.manageDeclaration(!this.isDocumentsRequired);
    if (this.inEditMode) {
      this.setPenaltyIndicator(this.penaltyIndicator);
    }
  }

  /**
   * Method to emit joining date change
   * @param data
   */
  checkDocumentsRequired(data: Object) {
    this.checkDocRequired.emit(data);
  }

  jobClassListChangeForPPA(data: any) {
    this.jobClassListChange.emit(data);
  }

  jobRankListChangeForPPA(data: any) {
    this.jobRankListChange.emit(data);
  }

  /**Method to handle tasks after child views are created */
  ngAfterViewInit(): void {
    if (this.inEditMode && this.engagementDetails?.engagementPeriod.length > 0 && this.engagementWageAddDcComponent) {
      this.engagementWageAddDcComponent.isEngagementWageAddFormVisible = false;
      this.engagementWageDetails = this.engagementDetails.engagementPeriod;
      this.engagementWageDetails = this.sortEngagementPeriod(this.engagementWageDetails);
      this.lovDataList = this.sortLovDataList(this.lovDataList);
      this.lovDataListChange.emit(this.lovDataList);
      if (this.engagementWageDetails[0].startDate.entryFormat === CalendarTypeEnum.HIJRI)
        this.joiningDateforAddPeriod = this.engagementWageDetails[0].startDate.hijiri;
      this.wageStartDate = this.engagementWageDetails[0]?.startDate;
      this.handleWagePeriodChange(this.engagementWageDetails[0].startDate.gregorian);
    }
  }

  /**Method to detect Input variable changes */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.isDocumentsRequired) {
      this.manageDeclaration(!this.isDocumentsRequired);
    }
    if (changes.engagementDetails && changes.engagementDetails.currentValue) {
      if (
        this.isDraftAvailable &&
        this.engagementDetails?.engagementPeriod.length > 0 &&
        this.engagementWageAddDcComponent
      ) {
        this.engagementWageAddDcComponent.isEngagementWageAddFormVisible = false;
        this.engagementWageDetails = this.engagementDetails.engagementPeriod;
        this.engagementWageDetails = this.sortEngagementPeriod(this.engagementWageDetails);
        if (this.engagementWageDetails[0].startDate.entryFormat === CalendarTypeEnum.HIJRI)
          this.joiningDateforAddPeriod = this.engagementWageDetails[0].startDate.hijiri;
        this.wageStartDate = this.engagementWageDetails[0]?.startDate;
        this.handleWagePeriodChange(this.engagementWageDetails[0].startDate.gregorian);
      }
    }
  }
  /**Method to set penaly indicator */
  setPenaltyIndicator(penaltyIndicator: boolean): void {
    this.engagementDetailsForm.get('penaltyIndicator').setValue(penaltyIndicator, { emitEvent: false });
  }

  /**
   * Method to set joining date
   * @param newJoiningDate
   */
  setJoiningDate(newJoiningDate: Date): void {
    if (newJoiningDate) {
      this.joiningDate = startOfDay(new Date(newJoiningDate));
    } else {
      this.joiningDate = null;
    }
  }
  /**
   * Method to set leaving date
   * @param date
   */
  setLeavingDate(date: Date): void {
    if (date) {
      this.leavingDate = startOfDay(new Date(date));
    } else {
      this.leavingDate = null;
    }
  }

  /**
   * Method to add or remove validations for declarations checkbox
   * @param isRequired
   */
  manageDeclaration(isRequired: boolean) {
    if (this.engagementDetailsForm) {
      if (isRequired) {
        this.engagementDetailsForm.get('checkBoxFlag').setValidators(Validators.requiredTrue);
      } else {
        this.engagementDetailsForm.get('checkBoxFlag').clearValidators();
      }
      this.engagementDetailsForm.get('checkBoxFlag').updateValueAndValidity({ emitEvent: false });
    }
  }

  /**
   * Method to create engagement details form
   */
  createEngagementDetailsForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [, { validators: Validators.requiredTrue }],
      penaltyIndicator: [false]
    });
  }

  /**
   * Method to sort engagement periods (last added period on top)
   * @param wageDetails
   */
  sortEngagementPeriod(wageDetails: EngagementPeriod[]) {
    return wageDetails.sort((a, b) => {
      const dateOne = moment(b.startDate.gregorian);
      const dateTwo = moment(a.startDate.gregorian);
      return dateOne.isAfter(dateTwo) ? 1 : dateOne.isBefore(dateTwo) ? -1 : 0;
    });
  }
  sortLovDataList(lovDataList: ManageWageLookUp[]) {
    return lovDataList.sort((a, b) => {
      const dateOne = moment(b.startDate.gregorian);
      const dateTwo = moment(a.startDate.gregorian);
      return dateOne.isAfter(dateTwo) ? 1 : dateOne.isBefore(dateTwo) ? -1 : 0;
    });
  }

  /**Method to show alert error */
  showAlertError(key: string): void {
    this.showError.emit(key);
  }

  /**Method to emit previous button action */
  navigateTopreviousTab() {
    this.previous.emit();
  }

  /**
   * This method is used to show given template
   * @param template
   * @memberof EmploymentDetailsDcComponent
   */
  showTemplate(template: TemplateRef<HTMLElement>): void {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  /**
   * This method is used to confirm cancellation of transaction
   * @param changes
   * @memberof EmploymentDetailsDcComponent
   */
  confirmCancel(isDraftRequired): void {
    this.reset.emit(isDraftRequired);
    this.decline();
  }
  confirm(): void {
    this.cancel.emit();
    this.decline();
  }
  /**Method to hide modal */
  decline(): void {
    this.modalRef.hide();
  }
  /**
   * Method to save engagement Details
   */
  saveEngagementDetails() {
    if (this.engagementDetailsForm.get('periodForm.joiningDate.entryFormat').value === CalendarTypeEnum.GREGORIAN) {
      this.engagementDetailsForm.get('periodForm.joiningDate.hijiri').clearValidators();
      this.engagementDetailsForm.get('periodForm.joiningDate.hijiri').updateValueAndValidity({ emitEvent: false });
    }
    if (this.engagementDetailsForm.get('periodForm.joiningDate.entryFormat').value === CalendarTypeEnum.HIJRI) {
      this.engagementDetailsForm.get('periodForm.joiningDate.gregorian').clearValidators();
      this.engagementDetailsForm.get('periodForm.joiningDate.gregorian').updateValueAndValidity({ emitEvent: false });
    }
    // if(this.engagementDetailsForm.get('periodForm.leavingDate.gregorian').value && this.engagementDetailsForm.get('periodForm.leavingDate.entryFormat').value=== CalendarTypeEnum.GREGORIAN){
    //   this.engagementDetailsForm.get('periodForm.leavingDate.hijiri').clearValidators();
    //   this.engagementDetailsForm.get('periodForm.leavingDate.hijiri').updateValueAndValidity({emitEvent:false})
    // }
    markFormGroupTouched(this.engagementWageAddDcComponent.engagementWageAddForm);
    markFormGroupTouched(this.engagementDetailsForm);
    let isPreviousEdit = false;
    this.engagementWageDetails.forEach(element => {
      if (element.canEdit === true) {
        isPreviousEdit = true;
      }
    });
    if (isPreviousEdit) {
      this.showError.emit('CONTRIBUTOR.ERR_PREVIOUS_EDIT');
    } else if (this.engagementWageAddDcComponent.isEngagementWageAddFormVisible && this.joiningDate) {
      this.showError.emit('CONTRIBUTOR.ERR-ADD-ENGAGEMENT-PERIOD');
    } else if (this.engagementDetailsForm.invalid) {
      this.showError.emit('CORE.ERROR.MANDATORY-FIELDS');
    } else {
      this.engagementDetailsForm
        .get('periodForm.penaltyIndicator')
        .setValue(this.engagementDetailsForm.get('penaltyIndicator').value);
      const engagement = (this.engagementDetailsForm.get('periodForm') as FormGroup).getRawValue();
      this.save.emit({
        engagementDetails: engagement,
        wageDetails: [...this.engagementWageDetails]
      });
    }
  }

  /**Method to reset all added wages */
  resetEngagementWages(): void {
    this.setWageValidation();
    this.engagementWageDetails = [];
    this.lovDataList = [];
    this.engagementWageAddDcComponent.resetWageEntryForm();
    this.engagementWageAddDcComponent.isEngagementWageAddFormVisible = true;
    this.ppaEstablishment
      ? this.engagementWageAddDcComponent.engagementWageAddForm.get('wage').get('basicWage').disable()
      : this.engagementWageAddDcComponent.engagementWageAddForm.get('wage').get('basicWage').enable();
    this.engagementWageAddDcComponent.engagementWageAddForm
      .get('startDate.gregorian')
      .patchValue(startOfDay(this.joiningDate), { emitEvent: false });
    this.engagementWageAddDcComponent.engagementWageAddForm
      .get('startDate.hijiri')
      .patchValue(this.joiningDateHijiri, { emitEvent: false });
    this.engagementWageAddDcComponent.engagementWageAddForm
      .get('endDate.gregorian')
      .patchValue(startOfDay(this.leavingDate), { emitEvent: false });
    this.engagementWageAddDcComponent.jobRankLov = [];
    this.engagementWageAddDcComponent.jobGradeLov = [];
  }

  resetHijiriLeavingDate(): void {
    if (this.engagementWageDetails[0]?.endDate.hijiri) {
      this.engagementWageDetails[0].endDate.gregorian = null;
      this.engagementWageDetails[0].endDate.hijiri = null;
      this.engagementWageDetails[0].endDate.entryFormat = null;
    }
  }
  //--------------------------------Engagement Wage Add Methods---------------------

  /**Method to update end date for last period based on start date of new period */
  updateEndDateForLastPeriod(selectedStartDate: GosiCalendar) {
    if (selectedStartDate !== null && this.systemParams) {
      if (selectedStartDate.entryFormat == CalendarTypeEnum.HIJRI) {
        if (this.engagementWageDetails.length > 1) {
          this.engagementWageDetails[0].endDate.gregorian = moment(
            subtractDays(selectedStartDate.gregorian, 1)
          ).toDate();
          this.engagementWageDetails[0].endDate.entryFormat = CalendarTypeEnum.HIJRI;
          this.lookupService.getHijriDate(subtractDays(selectedStartDate.gregorian, 1)).subscribe(res => {
            this.engagementWageDetails[1].endDate.hijiri = convertToHijriFormat(res.hijiri);
          });
          // this.engagementWageDetails[0].endDate.hijiri = this.getHijiriDate(this.engagementWageDetails[0].endDate.gregorian);
        } else if (this.engagementWageDetails.length === 1 && this.engagementWageDetails[0].endDate) {
          this.engagementWageDetails[0].endDate.gregorian = moment(
            subtractDays(selectedStartDate.gregorian, 1)
          ).toDate();
          this.engagementWageDetails[0].endDate.entryFormat = CalendarTypeEnum.HIJRI;
          this.lookupService.getHijriDate(subtractDays(selectedStartDate.gregorian, 1)).subscribe(res => {
            this.engagementWageDetails[1].endDate.hijiri = convertToHijriFormat(res.hijiri);
          });
          // this.engagementWageDetails[0].endDate.hijiri = this.getHijiriDate(this.engagementWageDetails[0].endDate.gregorian);
        }
      } else {
        if (this.engagementWageDetails.length > 1) {
          this.engagementWageDetails[0].endDate.gregorian = moment(selectedStartDate.gregorian)
            .subtract(1, 'months')
            .endOf('month')
            .toDate();
          this.lookupService.getHijriDate(this.engagementWageDetails[0].endDate.gregorian).subscribe(res => {
            this.engagementWageDetails[1].endDate.hijiri = convertToHijriFormat(res.hijiri);
          });
          this.engagementWageDetails[0].endDate.entryFormat = CalendarTypeEnum.GREGORIAN;
        } else if (this.engagementWageDetails.length === 1 && this.engagementWageDetails[0].endDate) {
          this.engagementWageDetails[0].endDate.gregorian = moment(selectedStartDate.gregorian)
            .subtract(1, 'months')
            .endOf('month')
            .toDate();
          this.lookupService.getHijriDate(this.engagementWageDetails[0].endDate.gregorian).subscribe(res => {
            this.engagementWageDetails[1].endDate.hijiri = convertToHijriFormat(res.hijiri);
          });
          this.engagementWageDetails[0].endDate.entryFormat = CalendarTypeEnum.GREGORIAN;
        }
      }
    }
    if (this.leavingDate) {
      this.maxWageAddDate = this.leavingDate ? moment(this.leavingDate).endOf('month').toDate() : new Date();
    }
  }

  /**
   * This method is to modify the wage period end date depending on the leaving date of contributor
   */
  setWagePeriodEndDate() {
    if (this.engagementWageDetails && this.engagementWageDetails.length > 0) {
      this.engagementWageDetails[0].endDate.gregorian = this.leavingDate;
      this.setWageInfo(this.engagementWageDetails[0].startDate.gregorian); //checking for add additional period
      this.setHijiriLeavingDateAsEndDate(this.leavingDate);
    }
    if (this.leavingDate) {
      this.engagementWageAddDcComponent.engagementWageAddForm
        .get('endDate.gregorian')
        .patchValue(startOfDay(this.leavingDate), { emitEvent: false });
    } else {
      this.engagementWageAddDcComponent.engagementWageAddForm.get('endDate.gregorian').reset();
    }
  }

  setHijiriLeavingDateAsEndDate(gregorianDate) {
    this.lookupService.getHijriDate(gregorianDate).subscribe(res => {
      this.engagementWageDetails[0].endDate.hijiri = convertToHijriFormat(res.hijiri);
      const inputDate = this.ppaEstablishment
        ? new Date(this.hijiriDateConst.ppaMaxHijiriNextDateInGregorian)
        : new Date(this.hijiriDateConst.gosiMaxHijiriNextDateInGregorian); //to check maxhijiri date less than 2018
      if (gregorianDate < moment(inputDate).toDate()) this.maxHijiriLeavingDate = convertToHijriFormat(res.hijiri);
      if (gregorianDate >= moment(inputDate).toDate()) this.maxHijiriLeavingDate = this.hijiriMax;
      this.engagementWageDetails[0].endDate.entryFormat = this.engagementDetailsForm.get(
        'periodForm.leavingDate.entryFormat'
      ).value;
      if (this.engagementDetailsForm.get('periodForm.leavingDate.entryFormat').value === CalendarTypeEnum.GREGORIAN)
        this.engagementDetailsForm.get('periodForm.leavingDate.hijiri').setValue(convertToHijriFormat(res.hijiri));
    });
  }

  /**Method to set max and min for wage period addition */
  setWageValidation(minDate?: Date): void {
    if (minDate) {
      this.minDateWageAdd = moment(minDate).startOf('month').clone().add(1, 'months').toDate();
    } else if (this.joiningDate) {
      // this.minDateWageAdd = subtractDays(this.joiningDate, 1);
      this.minDateWageAdd = this.joiningDate;
    }
    if (this.leavingDate) {
      this.maxWageAddDate = moment(this.leavingDate).endOf('month').toDate();
    } else {
      this.maxWageAddDate = new Date();
    }
  }

  /**
   * Method to add wage period on click of (save wage & occupation button) from child component (engagement-wage-add)
   */
  addWagePeriod(wage) {
    const lovData = {
      jobClassLov: this.jobClassLov,
      jobRankLov: this.jobRankLov,
      jobGradeLov: this.jobGradeLov,
      jobGradeApiResponse: this.jobGradeApiResponse,
      startDate: wage?.startDate
    };
    this.isPeriodEditOn = false;
    wage.canEdit = false;
    this.disableJoining = false;
    wage.contributorAbroad = this.contributorAbroadStatus;
    this.lovDataList.push(lovData);
    wage = bindToObject(new EngagementPeriod(), wage);
    this.updateEndDateForLastPeriod(wage.startDate);
    this.engagementWageDetails.push(wage);
    this.engagementWageDetails = this.sortEngagementPeriod(this.engagementWageDetails);
    this.lovDataList = this.sortLovDataList(this.lovDataList);
    this.lovDataListChange.emit(this.lovDataList);
    this.engagementWageDetails[0].endDate.gregorian = this.leavingDate ? new Date(this.leavingDate) : null;
    if (this.leavingDate) this.setHijiriLeavingDateAsEndDate(this.leavingDate);
    if (wage.startDate.entryFormat === CalendarTypeEnum.HIJRI) this.joiningDateforAddPeriod = wage.startDate.hijiri;
    this.wageStartDate = wage?.startDate;
    this.handleWagePeriodChange(wage.startDate.gregorian);
    this.isWageAdditionOn = false;
  }

  /**
   * Method to set validations and add new period button
   * @param date
   */
  handleWagePeriodChange(date: Date): void {
    this.setWageInfo(date);
    this.setWageValidation(date);
  }

  /**
   * Method to check if wage info is required or not based on wage start date
   * @param startDate
   */
  setWageInfo(startDate: Date) {
    if (this.leavingDate) {
      this.isWageInfoVisible = !moment(this.leavingDate, 'month').isSame(startDate, 'month');
    } else {
      this.isWageInfoVisible = !moment(new Date(), 'month').isSame(startDate, 'month');
      if (this.wageStartDate?.hijiri && this.ppaEstablishment) {
        this.lookupService.getHijriDate(new Date()).subscribe(res => {
          if (this.hijriSameMonthCheck(this.wageStartDate?.hijiri, res.hijiri)) {
            this.isWageInfoVisible = false;
          } else {
            this.isWageInfoVisible = true;
          }
        });
      }
    }
  }

  hijriSameMonthCheck(startDate, endDate) {
    if (endDate === null || endDate === undefined) return false;
    let splitType1 = this.splitType(startDate);
    const dateArr1 = startDate?.split(splitType1);
    let year1, month1;
    if (splitType1 === '/') {
      month1 = dateArr1[1].padStart(2, '0');
      year1 = dateArr1[2];
    } else if (splitType1 === '-') {
      year1 = dateArr1[0];
      month1 = dateArr1[1].padStart(2, '0');
    }
    let splitType2 = this.splitType(endDate);
    const dateArr2 = endDate?.split(splitType2);
    let year2, month2;
    if (splitType2 === '/') {
      month2 = dateArr2[1].padStart(2, '0');
      year2 = dateArr2[2];
    } else if (splitType2 === '-') {
      year2 = dateArr2[0];
      month2 = dateArr2[1].padStart(2, '0');
    }
    if (month1 == month2 && year1 == year2) return true;
    else return false;
  }

  splitType(date) {
    let splitType: '/' | '-';
    if (date.includes('/')) {
      splitType = '/';
    } else if (date.includes('-')) {
      splitType = '-';
    }
    return splitType;
  }

  /**Method to end date on cancel of wage addition */
  cancelAddWagePeriod() {
    this.setWageInfo(this.engagementWageDetails[0].startDate.gregorian);
    this.isWageAdditionOn = false;
  }

  /**
   * Method to show engagement wage add form for adding additional wage period on clicking (add additional period button)
   */
  addAdditionalPeriod() {
    this.engagementWageAddDcComponent.engagementWageAddForm = this.engagementWageAddDcComponent.createWageDetailsForm(
      this.ppaEstablishment
    );
    this.ppaEstablishment
      ? this.engagementWageAddDcComponent.engagementWageAddForm.get('wage').get('basicWage').disable()
      : this.engagementWageAddDcComponent.engagementWageAddForm.get('wage').get('basicWage').enable();
    this.engagementWageAddDcComponent.isEngagementWageAddFormVisible = true;
    this.isWageAdditionOn = true;
    this.isAddition = true;
    this.engagementWageAddDcComponent.engagementWageAddForm
      .get('startDate.hijiri')
      .setValidators([Validators.required]);
    this.engagementWageAddDcComponent.engagementWageAddForm.get('startDate.hijiri').updateValueAndValidity();
    this.engagementWageAddDcComponent.jobRankLov = [];
    this.engagementWageAddDcComponent.jobGradeLov = [];
  }

  /**Method to delete wage period */
  removeWagePeriod(index: number): void {
    if (this.engagementWageDetails.length === 1) {
      this.engagementWageAddDcComponent.isEngagementWageAddFormVisible = true;
      this.isWageInfoVisible = false;
      const joiningDateFormat = startOfDay(this.joiningDate);
      const joiningDateFormatHijiri = this.joiningDateHijiri;
      this.engagementWageAddDcComponent.jobRankLov = [];
      this.engagementWageAddDcComponent.jobGradeLov = [];
      this.engagementWageAddDcComponent.resetWageEntryForm();
      this.engagementWageAddDcComponent.engagementWageAddForm.get('startDate.gregorian').patchValue(joiningDateFormat);
      this.engagementWageAddDcComponent.engagementWageAddForm
        .get('startDate.hijiri')
        .patchValue(joiningDateFormatHijiri);
      this.resetDateForm = true;
    } else {
      this.engagementWageDetails[1].endDate = this.engagementWageDetails[0].endDate;
    }
    this.engagementWageDetails.splice(index, 1);
    this.lovDataList.splice(index, 1);
    if (this.engagementWageDetails[0]?.startDate?.entryFormat === CalendarTypeEnum.HIJRI)
      this.joiningDateforAddPeriod = this.engagementWageDetails[0]?.startDate?.hijiri;
    this.wageStartDate = this.engagementWageDetails[0]?.startDate;
    this.handleWagePeriodChange(this.engagementWageDetails[0]?.startDate?.gregorian);
    this.isDeleteWageSection = true;
  }

  resetDateFormEvent() {
    this.resetDateForm = false;
  }
  resetDateFormFromConfirmLeavingdate() {
    this.resetDateForm = true;
  }
  resetisDeleteWageSection() {
    this.isDeleteWageSection = false;
  }

  onKeepDraft() {
    this.confirmCancel(true);
  }
  onDiscard() {
    this.confirmCancel(false);
  }

  setMaxLeavingDate() {
    this.lookupService.getHijriDate(this.leavingDate).subscribe(res => {
      const inputDate = this.ppaEstablishment
        ? new Date(this.hijiriDateConst.ppaMaxHijiriNextDateInGregorian)
        : new Date(this.hijiriDateConst.gosiMaxHijiriNextDateInGregorian); //to check maxhijiri date less than 2018
      if (this.leavingDate < moment(inputDate).toDate()) this.maxHijiriLeavingDate = convertToHijriFormat(res.hijiri);
      if (this.leavingDate >= moment(inputDate).toDate()) this.maxHijiriLeavingDate = this.hijiriMax;
    });
  }
  disableBasicWagePpa(val: boolean) {
    this.disableBasicWage = val;
  }

  showCancelTemplate() {
    if ((this.checkPersonalDetailsSaved && !this.inEditMode) || this.isDraftAvailable)
      this.showTemplate(this.draftTemplate);
    else this.showTemplate(this.cancelEngagementTemplate);
  }
}
