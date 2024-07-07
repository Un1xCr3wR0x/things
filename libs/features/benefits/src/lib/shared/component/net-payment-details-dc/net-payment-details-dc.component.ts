/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, EventEmitter, Output, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CoreAdjustmentService, AlertTypeEnum, RouterData, RouterDataToken } from '@gosi-ui/core';
import {
  PersonAdjustmentDetails,
  AdjustmentCalculationDetails,
  HeirBenefitDetails,
  AnnuityResponseDto
} from '../../models';
import { BenefitConstants } from '../../constants';
import { BenefitType } from '../../enum';
import { isHeirBenefit } from '../../utils';

@Component({
  selector: 'bnt-net-payment-details-dc',
  templateUrl: './net-payment-details-dc.component.html',
  styleUrls: ['./net-payment-details-dc.component.scss']
})
export class NetPaymentDetailsDcComponent implements OnInit, OnChanges {
  adjustmentForm: FormGroup;
  holdBenefit = false;
  requestId: number;
  personId: number;
  registrationNo: number;
  socialInsuranceNo: number;
  transactionNumber: number;
  referenceNo: number;
  nin: number;
  benefitTypes = BenefitType;
  isHeir = false;

  readonly benefitConstants = BenefitConstants;
  payload;
  readonly Math = Math;

  constructor(
    readonly adjustmentService: CoreAdjustmentService,
    readonly router: Router,
    readonly fb: FormBuilder,
    @Inject(RouterDataToken) readonly routerData: RouterData
  ) {}
  alertTypeEnum = AlertTypeEnum;
  labelStyle = {
    red: {
      value: { color: 'red', 'font-weight': '600' }
    },
    green: {
      value: { color: 'green', 'font-weight': '600' }
    }
  };
  /**
   * Input
   */
  @Input() requestType: string;
  @Input() benefitType: string;
  @Input() disableDirectPayment = false;
  @Input() adjustmentDetails: PersonAdjustmentDetails;
  @Input() parentForm: FormGroup;
  @Input() isValidator = false;
  @Input() isValidator2 = false;
  @Input() holdMessage: string;
  @Input() adjustmentCalculationDetails: AdjustmentCalculationDetails;
  @Input() heirBenefitDetails: HeirBenefitDetails;
  @Input() samaVerified = false;
  @Input() isHeirAdjustment = false;
  @Input() isActive = true;
  @Input() isPension = false;
  @Input() isRPALumpsum = false;
  @Input() annuityBenefitDetails: AnnuityResponseDto; // for fetching isHold and isDirectPayment checkbox values
  @Input() isLumpsum = false; // Benefit amount after deduction only for lumpsum
  @Input() showActionButtons = true;
  /**
   * Output
   */
  @Output() navigateToAdjustmentDetails: EventEmitter<number> = new EventEmitter();
  @Output() navigateToPrevAdjustment: EventEmitter<number> = new EventEmitter();
  @Output() onViewPaymentHistory: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void {
    if (!this.adjustmentForm) this.createAdjustmentDetailsForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.adjustmentDetails && changes.adjustmentDetails.currentValue) {
      const tpaWithHold = this.adjustmentDetails?.adjustments?.filter(adjustment => adjustment.holdAdjustment);
      if (tpaWithHold?.length) {
        this.holdBenefit = true;
      }
    }
    if (changes?.benefitType?.currentValue) {
      this.isHeir = isHeirBenefit(this.benefitType);
    }
  }

  createAdjustmentDetailsForm() {
    this.adjustmentForm = this.fb.group({
      holdBenefit: [false],
      initiateDirectPayment: [false],
      personId: []
    });
    if (this.parentForm) {
      if (this.parentForm?.get('adjustmentDetails') && this.parentForm.get('adjustmentDetails')?.value) {
        this.adjustmentForm.patchValue(this.parentForm?.get('adjustmentDetails')?.value);
        this.parentForm?.removeControl('adjustmentDetails');
        this.parentForm?.addControl('adjustmentDetails', this.adjustmentForm);
      } else {
        this.parentForm?.addControl('adjustmentDetails', this.adjustmentForm);
      }
      this.parentForm.updateValueAndValidity();
    }
  }
  /** Method to set router data to component variables */
  initialiseView(routerData) {
    if (routerData.payload) {
      this.payload = JSON.parse(routerData.payload);
      this.personId = this.payload.socialInsuranceNo;
      this.registrationNo = this.payload.registrationNo;
      this.requestId = this.payload.id;
      this.socialInsuranceNo = +this.routerData.idParams.get('socialInsuranceNo');
      this.transactionNumber = this.payload.referenceNo;
      this.referenceNo = this.payload.referenceNo;
      this.nin = this.payload.nin;
    }
  }

  viewAdjustmentDetails() {
    this.navigateToAdjustmentDetails.emit();
  }

  viewPrevAdjustment() {
    this.navigateToPrevAdjustment.emit();
  }
  onViewHistoryDetails(personId: number) {
    this.onViewPaymentHistory.emit(personId);
  }
}
