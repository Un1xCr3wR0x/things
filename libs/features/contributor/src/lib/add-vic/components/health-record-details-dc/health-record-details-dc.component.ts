/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { HealthRecordItem, HealthRecordDetails } from '../../../shared/models';
import { VicConstants } from '../../../shared/constants';
import { markFormGroupTouched } from '@gosi-ui/core';

@Component({
  selector: 'cnt-health-record-details-dc',
  templateUrl: './health-record-details-dc.component.html',
  styleUrls: ['./health-record-details-dc.component.scss']
})
export class HealthRecordDetailsDcComponent implements OnInit, OnChanges {
  /** Local variables. */
  healthDetailsForm: FormGroup;

  /** Input variables. */
  @Input() parentForm: FormGroup;
  @Input() healthRecordList: HealthRecordItem[];
  @Input() healthRecordDetails: HealthRecordDetails[];
  @Input() canEdit: boolean;

  /** Output variables. */
  @Output() cancelTransaction = new EventEmitter<null>(null);
  @Output() previous = new EventEmitter<null>(null);
  @Output() saveHealthDetails = new EventEmitter<HealthRecordDetails[]>(null);

  /** Method to handle initialize HealthRecordDetailsDcComponent. */
  constructor(readonly fb: FormBuilder) {}

  /** Method to handle initialization tasks. */
  ngOnInit(): void {
    this.parentForm.addControl('healthCheckBox', new FormControl(false, { validators: Validators.requiredTrue }));
  }

  /** Method to detect changes in input variables. */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.healthRecordList && changes.healthRecordList.currentValue) {
      this.initializeHealthDetailsForm();
      if (this.healthRecordDetails) this.initializeViewInEditMode();
      if (this.canEdit === false) {
        this.disableAllRecords();
        this.parentForm.get('healthCheckBox').setValue(true);
        this.parentForm.get('healthCheckBox').disable();
      }
    }
  }

  /** Method to initialize health details form. */
  initializeHealthDetailsForm() {
    if (!this.healthDetailsForm) {
      this.healthDetailsForm = this.createHealthRecordForm();
      this.parentForm.addControl('healthDetails', this.healthDetailsForm);
    }
  }

  /** Methods to create health record forms */
  createHealthRecordForm() {
    const healthRecordForm = new FormGroup({});
    this.healthRecordList.forEach(healthRecord =>
      healthRecordForm.addControl(healthRecord.healthRecordId.toString(), this.createCommentForm())
    );
    return healthRecordForm;
  }

  /** Method to create comment form. */
  createCommentForm() {
    return this.fb.group({
      comments: [],
      toggle: [false]
    });
  }

  /** Method to initialize view in edit mode. */
  initializeViewInEditMode() {
    this.healthRecordDetails.forEach(item => {
      if (item.choice === 'Y') {
        this.healthDetailsForm.get(item.healthRecordId.toString()).get('toggle').setValue(true);
        this.healthDetailsForm.get(item.healthRecordId.toString()).get('comments').setValue(item.remark);
        this.healthDetailsForm.get(item.healthRecordId.toString()).get('comments').setValidators(Validators.required);
      }
    });
  }

  /** Method to disable all records. */
  disableAllRecords() {
    this.healthRecordList.forEach(item => {
      this.healthDetailsForm.get(item.healthRecordId.toString()).get('toggle').disable();
      this.healthDetailsForm.get(item.healthRecordId.toString()).get('comments').disable();
    });
  }

  /** Method to toggle comment section on selecting health records. */
  toggleCommentSection(isMandatory: string, healthRecForm: AbstractControl): void {
    if (isMandatory === VicConstants.VIC_MANDATORY && healthRecForm.get('toggle').value)
      healthRecForm.get('comments').setValidators(Validators.required);
    else healthRecForm.get('comments').clearValidators(), healthRecForm.get('comments').reset();
    healthRecForm.updateValueAndValidity();
  }

  /** Method to assemble health record details. */
  assembleHealthRecordDetails(): HealthRecordDetails[] {
    const healthReqList: HealthRecordDetails[] = [];
    this.healthRecordList.forEach(healthRes => {
      const healthReq = new HealthRecordDetails();
      healthReq.healthRecordId = healthRes.healthRecordId;
      healthReq.choice = this.healthDetailsForm.get(healthRes.healthRecordId.toString()).get('toggle').value
        ? 'Y'
        : 'N';
      healthReq.remark = this.healthDetailsForm.get(healthRes.healthRecordId.toString()).get('comments').value;
      healthReqList.push(healthReq);
    });
    return healthReqList;
  }

  /** Method to submit health details. */
  submitHealthDetails(): void {
    markFormGroupTouched(this.healthDetailsForm);
    this.parentForm.get('healthCheckBox').markAsTouched();
    if (this.parentForm.get('healthCheckBox').valid && this.healthDetailsForm.valid)
      this.saveHealthDetails.emit(this.assembleHealthRecordDetails());
    else if (!this.healthDetailsForm.valid) this.saveHealthDetails.emit([]);
    else this.saveHealthDetails.emit(null);
  }
}
