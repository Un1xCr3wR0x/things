/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms .
 */
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AdditionalGuarantee } from '../../../shared/models';
@Component({
  selector: 'blg-installment-grace-period-extended-dc',
  templateUrl: './installment-grace-period-extended-dc.component.html',
  styleUrls: ['./installment-grace-period-extended-dc.component.scss']
})
export class InstallmentGracePeriodExtendedDcComponent implements OnInit, OnChanges {
  modalRef: BsModalRef;
  gracePeriodForm: FormGroup;
  currentGrace: number;
  extraGrace: number;
  exceptionalGrace: number;
  extendedGrace = false;
  extendedReason: string;
  cancelFlag = false;
  addedGraces: number;
  isCancel = false;
  gracePeriod: number;

  @Input() extendedGracePeriod: AdditionalGuarantee;
  @Input() reason: string;
  @Input() gracePeriodValue: number;
  @Input() extraAddedGracePeriod: number;
  @Input() inWorkflow: boolean;
  @Input() isGuaranteeType: boolean;

  /* Output Variables */
  @Output() gracePeriods = new EventEmitter<{ extendedGrace: number; reason: string; extraAddedGrace: number }>();
  @Output() extendedFlag: EventEmitter<boolean> = new EventEmitter();
  @Output() isCanceled: EventEmitter<null> = new EventEmitter();

  constructor(private fb: FormBuilder, readonly modalService: BsModalService) {}

  ngOnInit(): void {
    if (!this.isCancel) {
      this.gracePeriodForm = this.createGracePeriodForm();
      this.setExceptiionalGracePeriod();
    }
  }

  createGracePeriodForm(): FormGroup {
    return this.fb.group({
      extensionReason: [null, { validators: Validators.required }],
      currentGracePeriod: [
        !this.inWorkflow ? this.extendedGracePeriod.minGracePeriodInDays : 7,
        { validators: Validators.required }
      ],
      extendedGracePeriod: [
        null,
        { validators: Validators.compose([Validators.pattern('[0-7]'), Validators.required]) }
      ],
      exceptionalGracePeriod: [
        !this.inWorkflow ? this.extendedGracePeriod.minGracePeriodInDays : this.gracePeriodValue,
        { validators: Validators.required }
      ]
    });
  }
  // Method to get details on input changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.reason && changes.reason.currentValue) {
      this.isCancel = true;
      this.gracePeriodForm = this.createGracePeriodForm();
      this.gracePeriodForm.get('extensionReason').setValue(changes.reason.currentValue);
      this.gracePeriodForm.get('exceptionalGracePeriod').setValue(changes.gracePeriodValue.currentValue);
      this.setExceptiionalGracePeriod();
    }
    if (changes && changes.extraAddedGracePeriod && changes.extraAddedGracePeriod.currentValue) {
      this.gracePeriodForm.get('extendedGracePeriod').setValue(changes.extraAddedGracePeriod.currentValue);
      this.setExceptiionalGracePeriod();
    }
    if (changes && changes.extendedGracePeriod && changes.extendedGracePeriod.isFirstChange()) {
      if (!this.isGuaranteeType && Number(this.extraAddedGracePeriod) !== 0)
        this.gracePeriodForm = this.createGracePeriodForm();
    }
  }
  setExceptiionalGracePeriod() {
    this.gracePeriodForm.get('extendedGracePeriod').valueChanges.subscribe(value => {
      if (value >= 0) {
        this.extraGrace = Number(value);
        if (this.extraGrace === 0) {
          this.gracePeriodForm.get('extensionReason').clearValidators();
          this.gracePeriodForm.get('extensionReason').reset();
        } else {
          this.gracePeriodForm.get('extensionReason').setValidators([Validators.required]);
          this.gracePeriodForm.get('extensionReason').updateValueAndValidity();
        }
        this.exceptionalGrace =
          (!this.inWorkflow ? this.extendedGracePeriod.minGracePeriodInDays : 7) + this.extraGrace;
        this.gracePeriodForm.get('exceptionalGracePeriod').setValue(this.exceptionalGrace);
      } else {
        if (!this.isCancel) {
          this.gracePeriodForm
            .get('currentGracePeriod')
            .setValue(!this.inWorkflow ? this.extendedGracePeriod.minGracePeriodInDays : 7);
          this.gracePeriodForm.get('exceptionalGracePeriod').setValue(this.exceptionalGrace);
        }
      }
    });
  }
  /** Method to hide modal. */
  hideModal(): void {
    this.cancelFlag = true;
    this.isCanceled.emit();
  }
  onSubmit() {
    this.gracePeriodForm.get('extensionReason').markAsTouched();
    this.gracePeriodForm.get('extendedGracePeriod').markAsTouched();
    if (
      this.checkValidity(this.gracePeriodForm.get('extensionReason')) &&
      this.checkValidity(this.gracePeriodForm.get('extendedGracePeriod'))
    ) {
      this.extendedGrace = true;
      this.gracePeriod = this.exceptionalGrace;
      if (this.exceptionalGrace === undefined) {
        this.exceptionalGrace = !this.inWorkflow
          ? this.extendedGracePeriod.minGracePeriodInDays
          : this.gracePeriodValue;
      }
      this.extendedReason = this.gracePeriodForm.get('extensionReason').value;
      this.addedGraces = this.gracePeriodForm.get('extendedGracePeriod').value;
      this.gracePeriodForm.get('currentGracePeriod').setValue(this.gracePeriod);
      this.gracePeriods.emit({
        extendedGrace: this.exceptionalGrace,
        reason: this.extendedReason,
        extraAddedGrace: this.addedGraces
      });
      this.extendedFlag.emit(this.extendedGrace);
    }
  }
  /**
   * Method to check form validity
   * @param form form control */
  checkValidity(form: AbstractControl) {
    if (form) {
      return form.valid;
    }
    return false;
  }
}
