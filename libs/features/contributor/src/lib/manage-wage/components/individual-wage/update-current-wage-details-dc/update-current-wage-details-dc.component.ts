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
  CalendarService,
  CalendarTypeEnum,
  DocumentItem,
  Lov,
  LovList,
  convertToHijriFormat,
  greaterThanLessThanValidator,
  markFormGroupTouched,
  startOfMonth,
  startOfMonthHijiri
} from '@gosi-ui/core';
import { gradeDetails } from '@gosi-ui/features/contributor/lib/shared/models/jobGradeDetails';
import { WageDetailFormBase } from '@gosi-ui/foundation/form-fragments';
import { ContributorTypesEnum, EngagementDetails, MaxLengthEnum, TransactionId } from '../../../../shared';
import { ContributorConstants, ManageWageConstants } from '../../../../shared/constants';

@Component({
  selector: 'cnt-update-current-wage-details-dc',
  templateUrl: './update-current-wage-details-dc.component.html',
  styleUrls: ['./update-current-wage-details-dc.component.scss']
})
export class UpdateCurrentWageDetailsDcComponent extends WageDetailFormBase implements OnInit, OnChanges {
  /**Local variables */
  wageDetailsForm: FormGroup;
  applicableFrom: Date;
  manageWageTransactionId = TransactionId.MANAGE_WAGE;
  occupationLovList: LovList;
  date = new Date();
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  isScan = false;
  wageSeparatorLimit = ContributorConstants.WAGE_SEPARATOR_LIMIT;
  commentMaxLength = MaxLengthEnum.COMMENTS;
  applicableFromHijiri: string;

  /**Local variables */
  @Input() currentEngagmentDetails: EngagementDetails;
  @Input() isValidatorEdit: boolean;
  @Input() documentList: DocumentItem[];
  @Input() occupationList: LovList;
  @Input() contributorType: string;
  @Input() parentForm: FormGroup;
  @Input() uuid: string;
  @Input() referenceNo: number;
  @Input() apiTriggered: boolean;
  @Input() jobClassLov: Lov[] = [];
  @Input() jobRankLov: Lov[] = [];
  @Input() jobGradeLov: Lov[] = [];
  @Input() jobGradeApiResponse: gradeDetails[];
  @Input() isHijiriFormat = false;
  @Input() currentHijiriDate: string;

  /**Output event emitter */
  @Output() updateCurrentWage: EventEmitter<FormGroup> = new EventEmitter();
  @Output() cancelCurrentWage: EventEmitter<null> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() jobClassListChange: EventEmitter<Lov> = new EventEmitter();
  @Output() jobRankListChange: EventEmitter<Lov> = new EventEmitter();

  /**
   * Method to initialise UpdateCurrentWageDetailsDcComponent
   * @param fb
   * @param appToken
   */
  constructor(
    public fb: FormBuilder,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly calendarService: CalendarService
  ) {
    super(fb);
  }

  ngOnInit() {
    this.wageDetailsForm = super.createWageDetailsForm(this.currentEngagmentDetails?.ppaIndicator);
    this.patchWageDetailsForm();
    if (this.parentForm) {
      this.parentForm.addControl('wageDetails', this.wageDetailsForm);
    }
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isScan = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // to filter occupation list for non saudi with excluded occupation list
    if (
      (changes.contributorType && changes.contributorType.currentValue) ||
      (changes.occupationList && changes.occupationList.currentValue)
    ) {
      this.filterOccupation();
    }
    if (changes?.currentEngagmentDetails && changes?.currentEngagmentDetails?.currentValue) {
      this.currentEngagmentDetails = changes?.currentEngagmentDetails?.currentValue;
      this.wageDetailsForm = super.createWageDetailsForm(this.currentEngagmentDetails?.ppaIndicator);
      const firstOfMonth = new Date(startOfMonth(this.firstDay));

      if (new Date(this.currentEngagmentDetails.joiningDate.gregorian) > firstOfMonth) {
        this.applicableFrom = this.currentEngagmentDetails.joiningDate.gregorian;
      } else {
        this.applicableFrom = firstOfMonth;
      }
      if (this.wageDetailsForm && !this.currentEngagmentDetails?.ppaIndicator) {
        this.patchWageDetailsForm();
      }
    }
    if (changes?.jobClassLov && changes?.jobClassLov?.currentValue) {
      this.jobClassLov = changes?.jobClassLov?.currentValue;
    }
    if (changes?.jobRankLov && changes?.jobRankLov?.currentValue) {
      this.jobRankLov = changes?.jobRankLov?.currentValue;
    }
    if (changes?.jobGradeLov && changes?.jobGradeLov?.currentValue) {
      this.jobGradeLov = changes?.jobGradeLov?.currentValue;
    }
    if (changes?.jobGradeApiResponse && changes?.jobGradeApiResponse?.currentValue) {
      this.jobGradeApiResponse = changes?.jobGradeApiResponse?.currentValue;
    }
    if (changes?.currentHijiriDate && changes?.currentHijiriDate?.currentValue) {
      this.currentHijiriDate = changes?.currentHijiriDate?.currentValue;
      this.setDateValues();
    }
    if (changes?.isHijiriFormat) {
      this.isHijiriFormat = changes?.isHijiriFormat?.currentValue;
    }
  }
  setDateValues() {
    const firstOfMonth = new Date(startOfMonth(this.firstDay));
    const firstOfMonthHijiri = startOfMonthHijiri(this.currentHijiriDate);
    if (new Date(this.currentEngagmentDetails?.joiningDate?.gregorian) > firstOfMonth) {
      this.applicableFrom = this.currentEngagmentDetails?.joiningDate?.gregorian;
      this.applicableFromHijiri = this.currentEngagmentDetails?.joiningDate?.hijiri;
    } else {
      this.applicableFrom = firstOfMonth;
      this.applicableFromHijiri = firstOfMonthHijiri;
    }
    if (this.isHijiriFormat) {
      const actualDate = convertToHijriFormat(this.applicableFromHijiri);
      this.calendarService.getGregorianDate(actualDate).subscribe(res => {
        this.applicableFrom = res?.gregorian;
      });
    } else {
      this.calendarService.getHijiriDate(this.applicableFrom).subscribe(hijiriDate => {
        this.applicableFromHijiri = convertToHijriFormat(hijiriDate.hijiri);
      });
    }
    this.setDataToForm();
  }
  setDataToForm() {
    if (
      this.wageDetailsForm &&
      this.jobClassLov.length > 0 &&
      this.jobRankLov.length > 0 &&
      this.jobGradeLov.length > 0
    ) {
      this.patchWageDetailsForm();
    } else {
      setTimeout(() => {
        this.setDataToForm();
      }, 500);
    }
  }

  patchWageDetailsForm() {
    if (this.currentEngagmentDetails) {
      this.wageDetailsForm?.patchValue(this.currentEngagmentDetails?.engagementPeriod[0]);
      this.currentEngagmentDetails.engagementPeriod[0].startDate.gregorian = new Date(this.applicableFrom);
      this.currentEngagmentDetails.engagementPeriod[0].startDate.hijiri = this.applicableFromHijiri
        ? this.applicableFromHijiri
        : this.currentEngagmentDetails?.ppaIndicator
        ? convertToHijriFormat(this.currentEngagmentDetails.engagementPeriod[0].startDate.hijiri)
        : this.currentEngagmentDetails.engagementPeriod[0].startDate.hijiri;
      this.currentEngagmentDetails.engagementPeriod[0].startDate.entryFormat = this.isHijiriFormat
        ? CalendarTypeEnum.HIJRI
        : CalendarTypeEnum.GREGORIAN;
      const jobclass = this.jobClassLov.find(
        item => item.code === this.currentEngagmentDetails?.engagementPeriod[0]?.jobClassCode
      );
      const jobRank = this.jobRankLov.find(
        item => item.code === this.currentEngagmentDetails?.engagementPeriod[0]?.jobRankCode
      );
      const jobGrade = this.jobGradeLov.find(
        item => item.code === this.currentEngagmentDetails?.engagementPeriod[0]?.jobGradeCode
      );

      this.wageDetailsForm?.get('startDate').patchValue(this.currentEngagmentDetails?.engagementPeriod[0]?.startDate);
      this.wageDetailsForm?.get('jobClassName').patchValue(jobclass?.value);
      this.wageDetailsForm?.get('jobRankName').patchValue(jobRank?.value);
      this.wageDetailsForm?.get('jobGradeName').patchValue(jobGrade?.value);
      this.setWageDetailsToForm();
      this.wageDetailsForm.updateValueAndValidity();
      this.wageDetailsForm.markAsPristine();
    }
  }
  setWageDetailsToForm() {
    const event = this.jobGradeLov.find(
      jobGrade => jobGrade.code === this.currentEngagmentDetails?.engagementPeriod[0]?.jobGradeCode
    );
    this.wageDetailsForm?.get('jobGradeName').patchValue(event?.value);
    const setBasicWage = this.jobGradeApiResponse?.find(item => parseInt(item?.jobGradeCode) === event?.code);
    if (setBasicWage && setBasicWage?.minSalary === setBasicWage?.maxSalary) {
      this.wageDetailsForm?.controls['wage'].get('basicWage').disable();
    } else {
      this.wageDetailsForm?.controls['wage'].get('basicWage').enable();
      this.wageDetailsForm?.controls['wage']
        ?.get('basicWage')
        ?.setValidators([
          Validators.required,
          greaterThanLessThanValidator(setBasicWage?.minSalary, setBasicWage?.maxSalary)
        ]);
    }
    this.wageDetailsForm?.controls['wage']?.get('basicWage')?.updateValueAndValidity();
    if (this.parentForm) {
      this.parentForm.removeControl('wageDetails');
      this.parentForm.addControl('wageDetails', this.wageDetailsForm);
    }
  }

  onBlur() {
    super.calculateTotalWage(this.wageDetailsForm);
  }
  /**
   * This method is used to calculate total wage
   */
  calculateTotalWage() {
    super.calculateTotalWage(this.wageDetailsForm);
  }

  /**
   * This method is used to filter occupation list shown to user based on contributor type
   */
  filterOccupation() {
    if (this.occupationList && this.contributorType) {
      this.occupationLovList = new LovList([]);
      this.occupationLovList.items = this.occupationList?.items;
      if (this.contributorType === ContributorTypesEnum.NON_SAUDI_NON_PRIVATE) {
        this.occupationLovList = new LovList(this.occupationList?.items);
        this.occupationLovList.items = this.occupationLovList.items.filter(
          item => ManageWageConstants.EXCLUDED_OCCUPATIONS_NONSAUDI.indexOf(item.value.english) === -1
        );
      }
      if (this.contributorType === ContributorTypesEnum.NON_SAUDI_PRIVATE) {
        this.occupationLovList = new LovList(this.occupationList.items);
        this.occupationLovList.items = this.occupationLovList.items.filter(
          item => ManageWageConstants.EXCLUDED_OCCUPATIONS_NONSAUDI_PRIVATE.indexOf(item.value.english) === -1
        );
      }
      const newOccupationList = new Lov();
      this.currentEngagmentDetails?.engagementPeriod.forEach(res => {
        newOccupationList.value = res?.occupation;
        newOccupationList.disabled = true;
        if (
          !this.occupationList?.items.find(
            item1 =>
              item1?.value?.arabic === newOccupationList?.value?.arabic &&
              item1?.value?.english === newOccupationList?.value?.english
          )
        )
          this.occupationList.items.push(newOccupationList);
      });
    }
  }

  updateWage() {
    if (!this.wageDetailsForm.valid) {
      markFormGroupTouched(this.wageDetailsForm);
    }
    this.updateCurrentWage.emit(this.wageDetailsForm);
  }

  cancelWage() {
    this.cancelCurrentWage.emit();
  }

  /**
   * Method to emit refresh event to parent component
   */
  refreshDocument(documentItem: DocumentItem) {
    this.refresh.emit(documentItem);
  }
  /**Method to select jobClass */
  selectJobClass(data: Lov) {
    this.jobClassListChange.emit(data);
    this.wageDetailsForm.get('jobClassCode').setValue(data.code);
    this.wageDetailsForm.get('jobRankName').reset();
    this.wageDetailsForm.get('jobGradeName').reset();
    this.resetBasicTotalWage();
    this.jobRankLov = [];
    this.jobGradeLov = [];
    this.wageDetailsForm.controls['wage'].get('basicWage').disable();
  }

  /**Method to select jobRank */
  selectJobRank(data: Lov) {
    this.jobRankListChange.emit(data);
    this.wageDetailsForm.get('jobRankCode').setValue(data.code);
    this.wageDetailsForm?.get('jobGradeName').reset();
    this.resetBasicTotalWage();
    this.jobGradeLov = [];
    this.wageDetailsForm?.controls['wage'].get('basicWage').disable();
  }
  resetBasicTotalWage() {
    this.wageDetailsForm?.get('wage').get('basicWage').setValue(parseFloat('0.00').toFixed(2));
    this.wageDetailsForm?.get('wage').get('totalWage').setValue(parseFloat('0.00').toFixed(2));
  }
  selectJobGrade(event: Lov) {
    this.resetBasicTotalWage();
    this.wageDetailsForm.get('jobGradeCode').setValue(event.code);
    const setBasicWage = this.jobGradeApiResponse?.find(item => parseInt(item?.jobGradeCode) === event?.code);
    if (setBasicWage && setBasicWage?.minSalary === setBasicWage?.maxSalary) {
      this.wageDetailsForm?.controls['wage']?.get('basicWage')?.setValue((setBasicWage?.minSalary).toFixed(2));
      this.wageDetailsForm?.controls['wage']?.get('totalWage')?.setValue((setBasicWage?.minSalary).toFixed(2));
      this.wageDetailsForm?.controls['wage'].get('basicWage').disable();

      // this.setBasicWageEnabled(true);
    } else {
      this.haveMinMaxBasicWage(setBasicWage);
    }
  }
  haveMinMaxBasicWage(setBasicWage: gradeDetails) {
    this.wageDetailsForm.controls['wage']?.get('basicWage')?.setValue((setBasicWage?.minSalary).toFixed(2));
    this.wageDetailsForm.controls['wage']?.get('totalWage')?.setValue((setBasicWage?.minSalary).toFixed(2));
    this.wageDetailsForm.controls['wage']
      ?.get('basicWage')
      ?.setValidators([
        Validators.required,
        greaterThanLessThanValidator(setBasicWage?.minSalary, setBasicWage?.maxSalary)
      ]);
    this.wageDetailsForm.controls['wage']?.get('basicWage')?.updateValueAndValidity();
    this.wageDetailsForm.controls['wage'].get('basicWage').enable();
    // this.setBasicWageEnabled(false);
  }
}
