/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  Input,
  SimpleChanges,
  TemplateRef,
  OnInit,
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
  selector: 'blg-penalty-waiver-details-dc',
  templateUrl: './penalty-waiver-details-dc.component.html',
  styleUrls: ['./penalty-waiver-details-dc.component.scss']
})
export class PenaltyWaiverDetailsDcComponent implements OnInit, OnChanges {
  // Local Variable
  waivedPenaltyPercentage: string;
  waivedViolationPercentage: string;
  penaltyWaiverDetailsForm: FormGroup;
  modalRef: BsModalRef;
  paymentGracePeriodForm: FormGroup;
  gracePeriod: number;
  extendedGrace = false;
  extendedReason: string;
  cancelFlag = false;
  addedGrace: number;
  cancel = false;
  setgrace = false;
  isExtraAdded = false;
  reasonForExtension = '';
  extendedGracePeriod = 0;
  newReasonForExtension = '';
  dayLabels: string = DueDateWidgetLabels.ZERO_DAYS;
  lan = 'en';
  modifyFlag = false;
  exceptionalGrace = 0;
  addedGraces = 0;
  extendedGraceFlag = false;
  newTotalGracePeriod;
  typeString = 'primary';
  noBorderFlag=true;

  /* Output Variables */
  @Output() gracePeriodsExtendend: EventEmitter<boolean> = new EventEmitter();

  // Input Variable
  @Input() wavierDetails: PenalityWavier;
  @Input() parentForm: FormGroup;
  @Input() gracePeriodFlag: Boolean;
  @Input() isAppPrivate: boolean;
  @Input() csrFlag: boolean;
  @Input() isLateFeeViolation:boolean;
  @Input() isValidator: boolean;
  @Input() isError: boolean;
  hideGracePeriod: boolean;

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
      this.lan = language;
    });
    this.penaltyWaiverDetailsForm = this.createPenaltyWaiverDetailsForm();
    this.parentForm.addControl('penaltyWaiverDetails', this.penaltyWaiverDetailsForm);
    this.paymentGracePeriodForm = this.createGracePeriodForm();
    if (this.parentForm) {
      this.parentForm.addControl('gracePeriodForm', this.paymentGracePeriodForm);
    }
    if (this.extendedGrace) {
      this.paymentGracePeriodForm.get('extensionReason').setValue(this.extendedReason);
    }
    if(this.isLateFeeViolation){
      this.typeString='secondary';
      this.noBorderFlag=false;
    }
    
  }

  // // Method to get details on input changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.wavierDetails?.currentValue) {
      this.waivedPenaltyPercentage = this.wavierDetails?.waivedPenaltyPercentage + '%';
      this.waivedViolationPercentage = this.wavierDetails?.waiverViolationsPercentage + '%';
      if (!this.csrFlag) {
        if (this.wavierDetails?.extensionReason !== undefined) {
          this.reasonForExtension = this.wavierDetails?.extensionReason;
          this.extendedGrace = true;
        }
        if (this.wavierDetails?.terms?.extendedGracePeriod !== null) {
          this.extendedGracePeriod = this.wavierDetails?.terms?.extendedGracePeriod;
          this.addedGrace = this.wavierDetails?.terms.extendedGracePeriod;
          this.gracePeriod = this.wavierDetails?.terms?.gracePeriod + this.wavierDetails?.terms?.extendedGracePeriod;
        }
        this.setgracePeriods({
          extendedGrace: this.extendedGrace,
          reason: this.reasonForExtension,
          extraAddedGrace: this.addedGrace,
          gracePeriod: this.gracePeriod
        });
      } else {
        if (!this.isAppPrivate && this.wavierDetails?.eligibleWaiveOffAmount > 300000 && !this.isLateFeeViolation) this.gracePeriod = 15;
        else this.gracePeriod = this.wavierDetails?.terms?.gracePeriod;
      }
           if (this.reasonForExtension !== undefined) {
        this.newReasonForExtension = this.reasonForExtension;
      }
      this.setLabelsArabicDay(this.gracePeriod);
      this.penaltyWaiverDetailsForm = this.createPenaltyWaiverDetailsForm();
      this.parentForm.addControl('penaltyWaiverDetails', this.penaltyWaiverDetailsForm);
      if (this.extendedGrace) {
        this.paymentGracePeriodForm.get('extensionReason').setValue(this.extendedReason);
      }
      if(this.wavierDetails?.terms?.gracePeriod === null) this.hideGracePeriod = true;
    }
  }

  createGracePeriodForm(): FormGroup {
    return this.fb.group({
      extensionReason: [null, { validators: Validators.required }],
      extendedGracePeriod: [
        this.wavierDetails?.terms?.gracePeriod,
        { validators: Validators.compose([Validators.pattern('[1-7]'), Validators.required]) }
      ],
      exceptionalGracePeriod: [this.wavierDetails?.terms?.gracePeriod, { validators: Validators.required }]
    });
  }
  // This method is used to create form details for penalty waiver details
  createPenaltyWaiverDetailsForm() {
    return this.fb.group({
      gracePeriod: [this.wavierDetails?.terms?.gracePeriod, { validators: Validators.required }]
    });
  }
  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
    this.modifyFlag = true;
    if (this.cancelFlag) {
      this.paymentGracePeriodForm.get('extensionReason').setValue(this.extendedReason);
      this.paymentGracePeriodForm.get('extendedGracePeriod').setValue(this.addedGrace);
    }
  }

  closeModal() {
    this.modalRef.hide();
  }
  setgracePeriods(params) {
    if (this.modalRef) this.modalRef.hide();
    this.setgrace = true;
    this.gracePeriod = params.gracePeriod;
    this.extendedReason = params.reason;
    this.extendedGraceFlag = true;
    this.addedGrace = params.extraAddedGrace;
    this.paymentGracePeriodForm = this.createGracePeriodForm();
    if (this.paymentGracePeriodForm) {
      this.paymentGracePeriodForm.get('extendedGracePeriod').setValue(this.addedGrace);
      this.paymentGracePeriodForm.get('extensionReason').setValue(this.extendedReason);
      if (this.parentForm.get('gracePeriodForm')) {
        this.parentForm.removeControl('gracePeriodForm');
      }
      this.parentForm.addControl('gracePeriodForm', this.paymentGracePeriodForm);
    }
    this.gracePeriodsExtendend.emit(this.extendedGraceFlag);
    this.setLabelsArabicDay(this.gracePeriod);
    if (Number(params.extraAddedGrace) === 0) {
      this.isExtraAdded = true;
      this.extendedGrace = false;
    } else {
      this.isExtraAdded = false;
      this.extendedGrace = true;
    }
  }
  setextendedFlag(para) {
    this.extendedGrace = para;
    if (Number(this.addedGrace) === 0) {
      this.isExtraAdded = true;
      this.extendedGrace = false;
    } else {
      this.extendedGrace = para;
      this.extendedGrace = true;
    }
  }
  setisCanceled(param) {
    this.cancelFlag = param;
    this.modalRef.hide();
  }
  setLabelsArabicDay(gracePeriod: number) {
    if (gracePeriod === 0) {
      this.dayLabels = DueDateWidgetLabels.ZERO_DAYS;
    } else if (gracePeriod === 1) {
      this.dayLabels = DueDateWidgetLabels.ONE_DAY;
    } else if (gracePeriod === 2) {
      this.dayLabels = DueDateWidgetLabels.TWO_DAYS;
    } else if (gracePeriod > 2 && gracePeriod < 11) {
      this.dayLabels = DueDateWidgetLabels.THREE_TO_TEN_DAYS;
    } else if (gracePeriod > 10) {
      this.dayLabels = DueDateWidgetLabels.GRT_THAN_TEN_DAYS;
    }
  }
}
