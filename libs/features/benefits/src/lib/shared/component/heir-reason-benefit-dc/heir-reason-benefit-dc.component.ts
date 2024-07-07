/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ReasonBenefit, HeirDetailsRequest, Benefits } from '../../models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import moment from 'moment-timezone';
import { BenefitValues } from '../../enum/benefit-values';
import { GosiCalendar, startOfDay, LovList, Lov, BilingualText } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { BenefitStatus } from '../../enum/benefit-status';
import { isDeathByPpaOhInjury } from '../../utils/benefitUtil';

@Component({
  selector: 'bnt-heir-reason-benefit-dc',
  templateUrl: './heir-reason-benefit-dc.component.html',
  styleUrls: ['./heir-reason-benefit-dc.component.scss']
})
export class HeirReasonBenefitDcComponent implements OnInit {
  //local variables
  deathReason = BenefitValues.deathOfTheContributor;
  missingReason = BenefitValues.missingContributor;
  benefitValues = BenefitValues;
  isSmallScreen: boolean;
  minDate: Date;
  maxDate: Date;
  reportDateForm: FormGroup;
  benefitStatusEnum = BenefitStatus;
  /**
   * Input
   */
  @Input() hideOptionalLabel = true;
  @Input() isAppPrivate: boolean;
  @Input() isValidator = false;
  @Input() parentForm: FormGroup;
  @Input() benefitReasonList: Observable<LovList>;
  @Input() systemRunDate;
  @Input() lessPadding = true;
  @Input() isRegisterPage = false;
  @Input() reasonForbenefits: ReasonBenefit;
  @Input() disableSaveAndNext: boolean;
  @Input() benefitStatus: BilingualText;
  @Input() disableEdit = false;
  @Input() eligibilityApiResponse: Benefits;

  /**
   * Output
   */
  @Output() dateSelected: EventEmitter<Date> = new EventEmitter();
  @Output() onBlur = new EventEmitter();
  @Output() save: EventEmitter<HeirDetailsRequest> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() deathDate: EventEmitter<any> = new EventEmitter();

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.reportDateForm = this.createForm();
    this.maxDate = this.systemRunDate?.gregorian ? moment(this.systemRunDate.gregorian)?.toDate() : new Date();
    this.setReasonAndDate(this.reasonForbenefits.heirBenefitRequestReason);
    this.getScreenSize();
  }

  createForm() {
    return this.fb.group({
      reason: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      checkBoxFlag: [false]
    });
  }

  cancelTransaction() {
    this.cancel.emit();
  }

  missingDateChanged() {
    const date = startOfDay(this.reportDateForm.get('missingDate').get('gregorian').value);
    this.minDate = date;
    this.disableSaveAndNext = false;
    // this.parentForm.get('requestDate').reset();
   }

  deathDateChanged() {
    const date = startOfDay(this.reportDateForm.get('deathDate').get('gregorian').value);
    this.minDate = date;
    this.disableSaveAndNext = false;
    // this.parentForm.get('requestDate').reset();
    this.deathDate.emit(date);
  }

  applyForBenefit() {
    if (this.reportDateForm.valid) {
      const heirRequestDetails = new HeirDetailsRequest();
      heirRequestDetails.eventDate = new GosiCalendar();
      heirRequestDetails.requestDate = new GosiCalendar();
      if (
        this.reportDateForm.get('reason').value.english === BenefitValues.missingContributor ||
        this.reportDateForm.get('reason').value.english === BenefitValues.ohMissingContributor
      ) {
        if (this.reportDateForm.get('missingDate') && this.reportDateForm.get('missingDate.gregorian')) {
          heirRequestDetails.eventDate.gregorian = startOfDay(this.reportDateForm.get('missingDate.gregorian').value);
        } else {
          heirRequestDetails.eventDate = this.reasonForbenefits?.missingDate;
        }
      } else {
        if (this.reportDateForm.get('deathDate') && this.reportDateForm.get('deathDate.gregorian')) {
          heirRequestDetails.eventDate.gregorian = startOfDay(this.reportDateForm.get('deathDate.gregorian').value);
        } else {
          heirRequestDetails.eventDate = this.reasonForbenefits?.deathDate;
        }
      }

      if (this.parentForm.get('requestDate.gregorian')?.value) {
        heirRequestDetails.requestDate.gregorian = startOfDay(this.parentForm.get('requestDate.gregorian')?.value);
      }

      // if (this.isDeathByOhInjury()) {
      //   if (this.reportDateForm.get('checkBoxFlag')?.value === true) {
      //     heirRequestDetails.isPpaOhDeath = this.reportDateForm.get('checkBoxFlag')?.value;
      //   }
      // }
      if (this.isDeathByOhInjury()) {
          heirRequestDetails.isPpaOhDeath = this.reportDateForm.get('checkBoxFlag')?.value;
      }

      heirRequestDetails.reason = this.reportDateForm.get('reason').value;
      this.save.emit(heirRequestDetails);
    } else {
      this.reportDateForm.markAllAsTouched();
    }
  }

  selectReason(value: Lov) {
    this.setReasonAndDate(value.value);
  }

  isDeathByOhInjury() {
    return isDeathByPpaOhInjury(
      this.eligibilityApiResponse?.benefitType.english,
      this.eligibilityApiResponse?.eligibleForPensionReform,
      this.eligibilityApiResponse?.isPpaOhDeath
    );
  }

  setReasonAndDate(reason: BilingualText) {
    const control = this.fb.group({
      gregorian: [null, { updateOn: 'blur', validators: Validators.compose([Validators.required]) }],
      hijiri: [null, { updateOn: 'blur' }]
    });
    this.reportDateForm.get('reason').patchValue(reason);
    if (
      reason.english === BenefitValues.deathOfTheContributor ||
      reason.english === BenefitValues.ohDeathOfTheContributor
    ) {
      this.reportDateForm.addControl('deathDate', control);
      this.reportDateForm.removeControl('missingDate');
      if (this.reasonForbenefits.deathDate?.gregorian) {
        this.reportDateForm
          .get('deathDate')
          .get('gregorian')
          .patchValue(new Date(this.reasonForbenefits.deathDate.gregorian));
        // this.disableEdit = true;
      }
    } else if (
      reason.english === BenefitValues.missingContributor ||
      reason.english === BenefitValues.ohMissingContributor
    ) {
      this.reportDateForm.addControl('missingDate', control);
      this.reportDateForm.removeControl('deathDate');
      if (this.reasonForbenefits.missingDate?.gregorian) {
        this.reportDateForm
          .get('missingDate')
          .get('gregorian')
          .patchValue(new Date(this.reasonForbenefits.missingDate.gregorian));
        // this.disableEdit = true;
      }
    }
  }
}
