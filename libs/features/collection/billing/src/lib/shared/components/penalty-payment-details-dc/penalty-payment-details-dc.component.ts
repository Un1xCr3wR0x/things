/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  Input,
  SimpleChanges,
  OnInit,
  TemplateRef,
  OnChanges,
  Inject,
  Output,
  EventEmitter
} from '@angular/core';
import { PenalityWavier } from '../../../shared/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DueDateWidgetLabels } from '../../enums/due-date-widget-labels';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'blg-penalty-payment-details-dc',
  templateUrl: './penalty-payment-details-dc.component.html',
  styleUrls: ['./penalty-payment-details-dc.component.scss']
})
export class PenaltyPaymentDetailsDcComponent implements OnInit, OnChanges {
  // Local Variable
  paymentForm: FormGroup;
  isRequired = true;
  paymentFlag: boolean;
  gracePeriod: number;
  modalRef: BsModalRef;
  exceptionalWaiverDetailsForm: FormGroup;
  extendedGrace = false;
  extendedReason: string;
  cancelFlag = false;
  isExtraAdded = false;
  addedGrace: number;
  reason: string;
  amount: number;
  dayLabel: string = DueDateWidgetLabels.ZERO_DAYS;
  lang = 'en';
  gracePeriodOnEdit: number;

  // Input Variable

  @Input() parentForm: FormGroup;
  @Input() wavierDetails: PenalityWavier;
  @Input() eligibleWaiveOffAmount: number;
  @Input() validatorFlag: boolean;
  @Input() waiverDetailsOnEdit: PenalityWavier;

  // Output Variable
  @Output() extensionValues: EventEmitter<object> = new EventEmitter();
  @Output() paymentRequired: EventEmitter<boolean> = new EventEmitter();
  /**
   * Creates an instance of PaymentFileUploadDcComponent.
   * @param fb Form builder
   * @param modalService
   */
  constructor(
    private fb: FormBuilder,
    readonly modalService: BsModalService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.paymentForm = this.createPaymentForm();

    this.exceptionalWaiverDetailsForm = this.createExceptionalWaiverDetailsForm();
    if (this.extendedGrace) {
      this.exceptionalWaiverDetailsForm.get('extensionReason').setValue(this.reason);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.wavierDetails && changes.wavierDetails.currentValue) {
      if (!this.validatorFlag && !this.extendedGrace) {
        this.gracePeriod = this.wavierDetails?.terms?.gracePeriod;
      }
    }
    this.setLabelArabicDay(this.gracePeriod);
    this.exceptionalWaiverDetailsForm = this.createExceptionalWaiverDetailsForm();
    if (this.extendedGrace) {
      this.exceptionalWaiverDetailsForm.get('extensionReason').setValue(this.reason);
    }
    if (this.eligibleWaiveOffAmount !== null)
      this.amount = this.wavierDetails.dueAmount.total - Number(this.eligibleWaiveOffAmount);
    else {
      this.amount = null;
    }
    if (changes && changes.waiverDetailsOnEdit && changes.waiverDetailsOnEdit.currentValue) {
      if (this.validatorFlag) {
        if (this.waiverDetailsOnEdit.paymentRequired.english === 'No') {
          this.paymentFlag = false;
          this.isRequired = false;
        } else {
          this.paymentFlag = true;
        }
        this.paymentForm = this.createPaymentForm();
        this.exceptionalWaiverDetailsForm = this.createExceptionalWaiverDetailsForm();
        if (this.eligibleWaiveOffAmount !== null) {
          this.amount = this.waiverDetailsOnEdit.dueAmount.total - Number(this.eligibleWaiveOffAmount);
        } else {
          this.amount = null;
        }
        this.reason = this.waiverDetailsOnEdit.extensionReason;
        this.gracePeriod = this.waiverDetailsOnEdit?.terms?.gracePeriod;
        if (this.waiverDetailsOnEdit?.terms?.extendedGracePeriod) {
          this.extendedGrace = true;
          this.exceptionalWaiverDetailsForm.get('extensionReason').setValue(this.reason);

          this.addedGrace = this.waiverDetailsOnEdit.terms.extendedGracePeriod;
          this.gracePeriod = this.waiverDetailsOnEdit?.terms?.gracePeriod + this.addedGrace;
        }
      }
    }
  }
  createPaymentForm(): FormGroup {
    return this.fb.group({
      paymentRequired: [
        this.validatorFlag ? this.paymentFlag : true,
        {
          validators: Validators.compose([Validators.required])
        }
      ]
    });
  }
  changePaymentType(requires: boolean) {
    this.isRequired = requires;
    this.paymentRequired.emit(this.isRequired);
  }
  gracePeriods(params) {
    this.modalRef.hide();
    this.gracePeriod = params.extendedGrace;
    this.exceptionalWaiverDetailsForm.get('extensionReason').setValue(params.reason);
    this.reason = params.reason;
    this.addedGrace = params.extraAddedGrace;
    this.setLabelArabicDay(this.gracePeriod);
    this.extensionValues.emit({
      extensionreason: this.reason,
      extendedGrace: this.addedGrace,
      paymentRequires: this.isRequired
    });
    if (Number(params.extraAddedGrace) === 0) {
      this.isExtraAdded = true;
      this.extendedGrace = false;
    } else {
      this.isExtraAdded = false;
      this.extendedGrace = true;
    }
  }
  extendedFlag(para) {
    this.extendedGrace = para;
    if (Number(this.addedGrace) === 0) {
      this.isExtraAdded = true;
      this.extendedGrace = false;
    } else {
      this.extendedGrace = para;
      this.extendedGrace = true;
    }
  }
  isCanceled(param) {
    this.cancelFlag = param;
    this.modalRef.hide();
  }
  setLabelArabicDay(gracePeriod: number) {
    if (gracePeriod === 0) {
      this.dayLabel = DueDateWidgetLabels.ZERO_DAYS;
    } else if (gracePeriod === 1) {
      this.dayLabel = DueDateWidgetLabels.ONE_DAY;
    } else if (gracePeriod === 2) {
      this.dayLabel = DueDateWidgetLabels.TWO_DAYS;
    } else if (gracePeriod > 2 && gracePeriod < 11) {
      this.dayLabel = DueDateWidgetLabels.THREE_TO_TEN_DAYS;
    } else if (gracePeriod > 10) {
      this.dayLabel = DueDateWidgetLabels.GRT_THAN_TEN_DAYS;
    }
  }
  createExceptionalWaiverDetailsForm(): FormGroup {
    return this.fb.group({
      extensionReason: [null, { validators: Validators.required }],
      currentGracePeriod: [this.wavierDetails?.terms?.gracePeriod, { validators: Validators.required }],
      extendedGracePeriod: ['', { validators: Validators.compose([Validators.pattern('[1-7]'), Validators.required]) }],
      exceptionalGracePeriod: [this.wavierDetails?.terms?.gracePeriod, { validators: Validators.required }]
    });
  }
  /** Method to show modal. */
  showModals(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
    if (this.cancelFlag) {
      this.exceptionalWaiverDetailsForm.get('extensionReason').setValue(this.reason);
      this.exceptionalWaiverDetailsForm.get('extendedGracePeriod').setValue(this.addedGrace);
    }
  }
}
