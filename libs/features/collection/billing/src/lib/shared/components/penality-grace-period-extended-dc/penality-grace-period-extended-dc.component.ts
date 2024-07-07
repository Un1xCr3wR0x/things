/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormBuilder } from '@angular/forms';

import { PenalityWavier } from '../../models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'blg-penality-grace-period-extended-dc',
  templateUrl: './penality-grace-period-extended-dc.component.html',
  styleUrls: ['./penality-grace-period-extended-dc.component.scss']
})
export class PenalityGracePeriodExtendedDcComponent implements OnInit, OnChanges {
  penaltyWaiverDetailsForm: FormGroup;
  modalRef: BsModalRef;
  gracePeriodForm: FormGroup;
  gracePeriod: number;
  currentGrace: number;
  extraGrace: number;
  exceptionalGrace: number;
  extendedGrace = false;
  extendedReason: string;
  cancelFlag = false;
  addedGraces: number;
  changeFlag = false;
  cancel = false;
  extendedGracePeriodValue = 0;
  editedGracePeriod = 0;

  @Input() reason: string;
  @Input() addedGrace: number;
  @Input() exceptionalGracePeriod: number;
  @Input() wavierDetails: PenalityWavier;
  @Input() csrFlag: boolean;
  @Input() extendedGracePeriod: number;
  @Input() reasonForExtension = '';
  @Input() validatorFlag: boolean;
  @Input() waiverDetailsOnEdit: PenalityWavier;

  /* Output Variables */
  @Output() gracePeriods = new EventEmitter<{
    extendedGrace: number;
    reason: string;
    extraAddedGrace: number;
    gracePeriod: number;
  }>();
  @Output() extendedFlag: EventEmitter<boolean> = new EventEmitter();
  @Output() isCanceled: EventEmitter<boolean> = new EventEmitter();

  constructor(private fb: FormBuilder, readonly modalService: BsModalService) {}

  ngOnInit(): void {
    if (!this.cancel) {
      this.gracePeriodForm = this.createGracePeriodForm();
      this.setExceptiionalGracePeriod();
    }
  }

  // Method to get details on input changes
  ngOnChanges(changes: SimpleChanges) {
    this.changeFlag = true;
    if (changes && changes.reasonForExtension && changes.reasonForExtension.currentValue) {
      if (!this.validatorFlag) {
        this.cancel = true;
        this.gracePeriodForm = this.createGracePeriodForm();
        this.gracePeriodForm.get('extensionReason').setValue(this.reasonForExtension);
        this.gracePeriodForm.get('exceptionalGracePeriod').setValue(changes.exceptionalGracePeriod.currentValue);
        if (this.addedGrace === 0 && this.addedGrace !== null) {
          this.gracePeriodForm.get('extensionReason').reset();
          this.gracePeriodForm.get('extendedGracePeriod').reset();
          this.gracePeriodForm.get('exceptionalGracePeriod').setValue(7);
        }
        this.setExceptiionalGracePeriod();
      }
    }
    if (changes && changes.addedGrace && changes.addedGrace.currentValue >= 0) {
      this.cancel = true;
      this.gracePeriodForm = this.createGracePeriodForm();
      this.gracePeriodForm.get('extendedGracePeriod').setValue(changes.addedGrace.currentValue);
      this.gracePeriodForm.get('extensionReason').setValue(this.reason);
      this.gracePeriodForm.get('exceptionalGracePeriod').setValue(this.exceptionalGracePeriod);
      this.setExceptiionalGracePeriod();
    }
    if (changes && changes.waiverDetailsOnEdit && changes.waiverDetailsOnEdit?.currentValue) {
      if (this.validatorFlag || !this.csrFlag) {
        this.gracePeriodForm?.get('extensionReason').setValue(this.waiverDetailsOnEdit?.extensionReason);
        this.gracePeriodForm?.get('extendedGracePeriod').setValue(this.waiverDetailsOnEdit?.terms?.extendedGracePeriod);
        this.gracePeriodForm
          ?.get('exceptionalGracePeriod')
          .setValue(
            this.waiverDetailsOnEdit?.terms?.gracePeriod + this.waiverDetailsOnEdit?.terms?.extendedGracePeriod
          );
        this.setExceptiionalGracePeriod();
      }
    }
    if (changes && changes.wavierDetails && changes.wavierDetails.currentValue) {
      this.gracePeriod = this.wavierDetails?.terms?.gracePeriod;
    }
    this.penaltyWaiverDetailsForm = this.createPenaltyWaiverDetailsForm();
  }

  setExceptiionalGracePeriod() {
    this.gracePeriodForm?.get('extendedGracePeriod').valueChanges.subscribe(value => {
      if (value?.toString().length > 0 && Number(value) >= 0) {
        this.extraGrace = Number(value);
        if (this.extraGrace === 0) {
          this.gracePeriodForm.get('extensionReason').clearValidators();
          this.gracePeriodForm.get('extensionReason').reset();
          this.gracePeriodForm.updateValueAndValidity();
        } else {
          this.gracePeriodForm.get('extensionReason').setValidators([Validators.required]);
          this.gracePeriodForm.get('extensionReason').updateValueAndValidity();
        }
        this.exceptionalGrace = this.wavierDetails?.terms?.gracePeriod + this.extraGrace;
        this.gracePeriodForm.get('exceptionalGracePeriod').setValue(this.exceptionalGrace);
      } else {
        if (!this.cancel) {
          this.gracePeriodForm.get('currentGracePeriod').setValue(this.wavierDetails?.terms?.gracePeriod);
          this.gracePeriodForm.get('exceptionalGracePeriod').setValue(this.exceptionalGrace);
        } else if (this.validatorFlag) {
          this.editedGracePeriod = this.waiverDetailsOnEdit?.terms?.gracePeriod + Number(value);
          this.gracePeriodForm
            ?.get('exceptionalGracePeriod')
            .setValue(this.waiverDetailsOnEdit?.terms?.gracePeriod + Number(value));
        } else if (!this.csrFlag) {
          this.editedGracePeriod = this.wavierDetails?.terms?.gracePeriod + Number(value);
          this.gracePeriodForm
            ?.get('exceptionalGracePeriod')
            .setValue(this.wavierDetails?.terms?.gracePeriod + Number(value));
        }
      }
    });
  }

  createGracePeriodForm(): FormGroup {
    return this.fb.group({
      extensionReason: [this.csrFlag ? null : this.reasonForExtension, { validators: Validators.required }],
      currentGracePeriod: [this.wavierDetails?.terms?.gracePeriod, { validators: Validators.required }],
      extendedGracePeriod: [
        this.csrFlag ? '' : this.extendedGracePeriod,
        { validators: Validators.compose([Validators.pattern('[0-7]'), Validators.required]) }
      ],
      exceptionalGracePeriod: [
        this.csrFlag
          ? this.wavierDetails.terms.gracePeriod
          : this.wavierDetails.terms.gracePeriod + this.extendedGracePeriod,
        { validators: Validators.required }
      ]
    });
  }
  // This method is used to create form details for penalty waiver details
  createPenaltyWaiverDetailsForm() {
    return this.fb.group({
      gracePeriod: [this.wavierDetails.terms.gracePeriod, { validators: Validators.required }]
    });
  }
  /** Method to hide modal. */
  hideModal(): void {
    this.cancelFlag = true;
    this.gracePeriodForm.get('extendedGracePeriod').setValue(this.addedGrace);
    this.gracePeriodForm.get('extensionReason').setValue(this.extendedReason);
    this.isCanceled.emit(this.cancelFlag);
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
  onSubmit() {
    if (
      this.checkValidity(this.gracePeriodForm.get('extensionReason')) &&
      this.checkValidity(this.gracePeriodForm.get('extendedGracePeriod'))
    ) {
      this.extendedGrace = true;

      this.gracePeriod = this.exceptionalGrace;
      if (this.exceptionalGrace === undefined) {
        this.exceptionalGrace = this.exceptionalGracePeriod;
        if (this.validatorFlag || !this.csrFlag) this.exceptionalGrace = this.editedGracePeriod;
      }
      this.extendedReason = this.gracePeriodForm.get('extensionReason').value;
      this.addedGraces = this.gracePeriodForm.get('extendedGracePeriod').value;
      if (this.waiverDetailsOnEdit && this.waiverDetailsOnEdit.terms) {
        this.waiverDetailsOnEdit.terms.extendedGracePeriod = this.addedGraces;
        this.waiverDetailsOnEdit.extensionReason = this.extendedReason;
      }
      this.gracePeriodForm.get('currentGracePeriod').setValue(this.gracePeriod);
      this.gracePeriods.emit({
        extendedGrace: this.exceptionalGrace,
        reason: this.extendedReason,
        extraAddedGrace: this.addedGraces,
        gracePeriod: this.exceptionalGrace
      });
      this.extendedFlag.emit(this.extendedGrace);
    }
  }
}
