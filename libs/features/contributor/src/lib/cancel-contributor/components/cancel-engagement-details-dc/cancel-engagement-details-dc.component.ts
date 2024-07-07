/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LovList, GosiCalendar, BilingualText, CalendarTypeEnum, convertToHijriFormat } from '@gosi-ui/core';
import moment from 'moment-timezone';
import { CancelContributorDetails, ContributorConstants, EngagementDetails } from '../../../shared';

@Component({
  selector: 'cnt-cancel-engagement-details-dc',
  templateUrl: './cancel-engagement-details-dc.component.html',
  styleUrls: ['./cancel-engagement-details-dc.component.scss']
})
export class CancelEngagementDetailsDcComponent implements OnChanges {
  /**Local Variables */
  cancelDetailsForm: FormGroup;
  joiningDate: GosiCalendar;
  leavingDate: GosiCalendar;
  leavingReason: BilingualText;
  typeGregorian = CalendarTypeEnum.GREGORIAN;
  typeHijira = CalendarTypeEnum.HIJRI;

  /**Input Variables */
  @Input() parentForm: FormGroup;
  @Input() engagement: EngagementDetails;
  @Input() leavingReasonList: LovList;
  @Input() cancelReasonList: LovList;
  @Input() isEditMode: boolean;
  @Input() isPpa = false;
  @Input() cancellationDetails: CancelContributorDetails;

  @Output() isWrongReg: EventEmitter<boolean> = new EventEmitter();
  joiningDateGreg: boolean;
  leavingDateGreg: boolean;

  constructor(private fb: FormBuilder) {}

  /**Method to detect changes in input variables */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.engagement && changes.engagement.currentValue) {
      this.cancelDetailsForm = this.createCancelForm(this.engagement.leavingDate?.gregorian ? true : false);
      this.bindDataToForm();
      this.parentForm.addControl('cancelForm', this.cancelDetailsForm);
    }

    if (changes.cancellationDetails && changes.cancellationDetails.currentValue) {
      this.cancelDetailsForm = this.createCancelForm(this.cancellationDetails.leavingDate?.gregorian ? true : false);
      this.bindDataToForm();
      this.parentForm.addControl('cancelForm', this.cancelDetailsForm);
    }
  }

  /** Method to create engagement details form. */
  createCancelForm(isLeavingRequired = false) {
    return this.fb.group({
      joiningDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null, { validators: Validators.required }]
      }),
      leavingDate: this.fb.group({
        gregorian: [null, { validators: isLeavingRequired ? Validators.required : null }],
        hijiri: [null, { validators: isLeavingRequired ? Validators.required : null }]
      }),
      leavingReason: this.fb.group({
        english: [null, { validators: isLeavingRequired ? Validators.required : null }],
        arabic: [null]
      }),
      cancellationReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }

  /**Method to bind data to form from api */
  bindDataToForm(): void {
    this.joiningDate = this.isEditMode ? this.cancellationDetails.joiningDate : this.engagement.joiningDate;
    this.leavingDate = this.isEditMode ? this.cancellationDetails.leavingDate : this.engagement.leavingDate;
    this.leavingReason = this.isEditMode ? this.cancellationDetails.leavingReason : this.engagement.leavingReason;

    if (this.joiningDate) {
      this.cancelDetailsForm.get('joiningDate.gregorian').setValue(moment(this.joiningDate.gregorian).toDate());
      this.cancelDetailsForm.get('joiningDate.hijiri').setValue(convertToHijriFormat(this.joiningDate.hijiri));
      if (this.joiningDate.entryFormat === this.typeGregorian) {
        this.joiningDateGreg = true;
        this.cancelDetailsForm.get('joiningDate').get('hijiri').clearValidators();
        this.cancelDetailsForm.get('joiningDate').updateValueAndValidity();
      } else if (this.joiningDate.entryFormat === this.typeHijira) {
        this.joiningDateGreg = false;
        this.cancelDetailsForm.get('joiningDate').get('gregorian').clearValidators();
        this.cancelDetailsForm.get('joiningDate').updateValueAndValidity();
      }
    }

    if (this.leavingDate) {
      this.cancelDetailsForm
        .get('leavingDate.gregorian')
        .setValue(moment(this.leavingDate.gregorian).toDate(), { emitEvent: false });
      this.cancelDetailsForm
        .get('leavingDate.hijiri')
        .setValue(convertToHijriFormat(this.leavingDate.hijiri), { emitEvent: false });
      if (this.leavingDate.entryFormat === this.typeGregorian) {
        this.leavingDateGreg = true;
        this.cancelDetailsForm.get('leavingDate').get('hijiri').clearValidators();
        this.cancelDetailsForm.get('leavingDate').updateValueAndValidity();
      } else if (this.leavingDate.entryFormat === this.typeHijira) {
        this.leavingDateGreg = false;
        this.cancelDetailsForm.get('leavingDate').get('gregorian').clearValidators();
        this.cancelDetailsForm.get('leavingDate').updateValueAndValidity();
      }
    }

    if (this.leavingReason?.english) this.cancelDetailsForm.get('leavingReason').setValue(this.leavingReason);
    if (this.isEditMode && this.cancellationDetails.cancellationReason?.english)
      this.cancelDetailsForm.get('cancellationReason').setValue(this.cancellationDetails.cancellationReason);
    if (this.isPpa) {
      if (this.cancelDetailsForm?.get('cancellationReason')?.get('english')?.value === 'Wrong Registration')
        this.isWrongReg.emit(true);
      else this.isWrongReg.emit(false);
    }
  }

  /**Method to make comment mandatory if reason is others */
  onCancelReasonChange(reason: string): void {
    if (this.isPpa) {
      if (reason === 'Wrong Registration') this.isWrongReg.emit(true);
      else this.isWrongReg.emit(false);
    }
    if (reason.toLowerCase() === ContributorConstants.OTHER_CANCEL_REASON.toLowerCase())
      this.parentForm.get('comments.comments').setValidators(Validators.required);
    else this.parentForm.get('comments.comments').clearValidators();
    this.parentForm.get('comments.comments').updateValueAndValidity();
  }
}
