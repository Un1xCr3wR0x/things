/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LovList, formatDate, GosiCalendar } from '@gosi-ui/core';
import moment from 'moment';
import { BenefitConstants } from '../../../shared/constants';
import { HoldBenefitDetails, RestartHoldDetails } from '../../../shared/models';

@Component({
  selector: 'bnt-restart-details-dc',
  templateUrl: './restart-details-dc.component.html',
  styleUrls: ['./restart-details-dc.component.scss']
})
export class RestartDetailsDcComponent implements OnInit, OnChanges {
  //Local Variables
  repayNotesMaxLength = BenefitConstants.DESCRIPTION_MAX_LENGTH;
  restartForm: FormGroup = new FormGroup({});
  minDate: Date = new Date();
  maxDate: Date = new Date();
  //Input Variables
  @Input() parentForm: FormGroup;
  @Input() inEditMode = false;
  @Input() restartEditdetails: HoldBenefitDetails = new HoldBenefitDetails();
  @Input() restartHoldDetails: RestartHoldDetails = new RestartHoldDetails();
  @Input() restartReasonList: LovList = new LovList([]);
  @Input() lang = 'en';
  @Input() systemRunDate: GosiCalendar;
  //Output Variables
  @Output() save: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  /**
   *
   * @param fb
   */
  constructor(readonly fb: FormBuilder) {}
  /**
   * Method to initialise values
   */
  ngOnInit(): void {
    this.restartForm = this.createRestartForm();
    if (this.parentForm) this.parentForm.addControl('requestDetails', this.restartForm);
  }
  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.restartHoldDetails) {
      this.restartHoldDetails = changes.restartHoldDetails.currentValue;
      if (this.restartHoldDetails) this.minDate = moment(this.restartHoldDetails.eventDate?.gregorian).toDate();
    }
    if (changes && changes.restartEditdetails) {
      this.restartEditdetails = changes.restartEditdetails.currentValue;
      if (this.inEditMode) this.bindToForm();
    }
  }
  /**
   * Method to create restart form
   */
  createRestartForm() {
    return this.fb.group({
      requestDate: this.fb.group({
        gregorian: ['', { validators: Validators.required, updateOn: 'blur' }],
        hijri: ['']
      }),
      requestReason: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [null]
      }),
      notes: [null]
    });
  }
  /**
   * Method to bind details to form during edit flow
   */
  bindToForm() {
    if (this.restartForm) {
      this.restartForm
        ?.get('requestDate')
        ?.get('gregorian')
        ?.setValue(moment(this.restartEditdetails?.requestDate?.gregorian).toDate());
      this.restartForm?.get('requestDate')?.get('gregorian').updateValueAndValidity();
      this.restartForm?.get('requestReason')?.get('english')?.setValue(this.restartEditdetails?.reason.english);
      this.restartForm?.get('requestReason')?.get('english')?.updateValueAndValidity();
      this.restartForm?.get('notes')?.setValue(this.restartEditdetails?.notes);
      this.restartForm?.get('notes')?.updateValueAndValidity();
      this.restartForm.markAsUntouched();
      this.restartForm.markAsPristine();
      this.restartForm.updateValueAndValidity();
    }
  }
  saveRequestDetails() {
    this.save.emit();
  }
  cancelRequestDetails() {
    this.cancel.emit();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
