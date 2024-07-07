/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  HostListener,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { LovList } from '@gosi-ui/core';
import {
  AnnuityResponseDto,
  BenefitDetails,
  DependentDetails,
  HeirAdjustments,
  HeirBenefitDetails,
  HeirDebitDetails
} from '../../models';
import { AdjustmentType, HeirStatus } from '../../enum';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { isHeirLumpsum } from '../../utils';

@Component({
  selector: 'bnt-heir-adjustment-details-dc',
  templateUrl: './heir-adjustment-details-dc.component.html',
  styleUrls: ['./heir-adjustment-details-dc.component.scss']
})
export class HeirAdjustmentDetailsDcComponent implements OnInit, OnChanges {
  // adjustmentForm: FormGroup;
  holdBenefit = false;
  heirAdjustmentForm = new FormArray([]);
  AdjustmentType = AdjustmentType;
  isActive = true;
  HeirStatus = HeirStatus;
  isSmallScreen: boolean;
  commonModalRef: BsModalRef;
  hasAtleastOneAdjustment = false;
  isHeirLumpsum = isHeirLumpsum;
  constructor(readonly fb: FormBuilder, readonly modalService: BsModalService) {}

  labelStyle = {
    red: {
      value: { color: "color('red-200')", 'font-weight': '600' }
    },
    green: {
      value: { color: "color('green-200')", 'font-weight': '600' }
    }
  };
  /**
   * Input
   */
  @Input() heirBenefitDetails: HeirBenefitDetails[];
  @Input() heirOrDependentDetails: DependentDetails[] = [];
  @Input() parentForm: FormGroup;
  @Input() isValidator = false;
  @Input() isTransactionScreen = false;
  @Input() isLumpsum: boolean;
  @Input() isRestartBenefit: boolean;
  @Input() topHeading: string; //'BENEFITS.ADJUSTMENT-DETAILS'
  @Input() deductionPlanList: LovList;
  @Input() deductionPlanSelectionDisable = false;
  @Input() lang: string;
  @Input() approveScreen = true;
  @Input() samaVerified = true;
  @Input() adjustmentDetails: HeirAdjustments = {} as HeirAdjustments;
  @Input() heirActionType: string;
  @Input() benefitCalculation: BenefitDetails;
  @Input() requestType: string;
  @Input() benefitType: string;
  @Input() annuityBenefitDetails: AnnuityResponseDto;
  @Input() isIndividualApp = false;

  /**
   * Output
   */
  @Output() navigateToAdjustmentDetails: EventEmitter<HeirBenefitDetails> = new EventEmitter();
  @Output() navigateToPrevAdjustment: EventEmitter<HeirBenefitDetails> = new EventEmitter();
  @Output() getTpa: EventEmitter<number> = new EventEmitter();
  @Output() navigateToPaymentHistory: EventEmitter<number> = new EventEmitter();

  // benefitType;
  // TODO Adjustment API integration

  ngOnInit(): void {
    if (this.parentForm) {
      if (this.parentForm?.get('heirAdjustmentForm') && this.parentForm.get('heirAdjustmentForm')?.value) {
        this.heirAdjustmentForm.patchValue(this.parentForm?.get('heirAdjustmentForm')?.value);
        this.parentForm?.removeControl('heirAdjustmentForm');
        this.parentForm?.addControl('heirAdjustmentForm', this.heirAdjustmentForm);
      } else {
        this.parentForm?.addControl('heirAdjustmentForm', this.heirAdjustmentForm);
      }
      this.parentForm.updateValueAndValidity();
    }
  }

  setValues() {
    this.heirAdjustmentForm = new FormArray([]);
    this.heirBenefitDetails.forEach(eachHeir => {
      if (!this.hasAtleastOneAdjustment) {
        this.hasAtleastOneAdjustment = eachHeir.adjustmentCalculationDetails.adjustmentDetails.length ? true : false;
      }
      const creditAdjustment = eachHeir.adjustmentCalculationDetails.adjustmentDetails.filter(adjustment => {
        return adjustment.adjustmentType?.english === AdjustmentType.CREDIT;
      });
      eachHeir.hasCreditAdjustment = creditAdjustment.length ? true : false;
      const form = this.createForm(eachHeir, eachHeir.hasCreditAdjustment);
      const eachHeirValue = this.heirOrDependentDetails.filter(value => value.personId === eachHeir.personId);
      this.heirOrDependentDetails.forEach(element => {
        if (eachHeir?.personId === element?.personId && element?.status?.english === 'Inactive') {
          this.isActive = false;
        }
      });
      if (form.get('adjustmentDetails') && eachHeirValue.length) {
        form.get('adjustmentDetails.holdBenefit').patchValue(eachHeirValue[0].isHold ? true : false);
        form.get('adjustmentDetails.initiateDirectPayment').patchValue(eachHeirValue[0].isDirectPayment ? true : false);
        // form.get('adjustmentDetails.personId').patchValue(eachHeirValue[0].personId);
      }
      this.heirAdjustmentForm.push(form);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.heirBenefitDetails && changes.heirBenefitDetails.currentValue) {
      this.setValues();
    }
  }

  viewAdjustmentDetails(event: HeirBenefitDetails) {
    this.navigateToAdjustmentDetails.emit(event);
  }

  viewPrevAdjustment(event: HeirBenefitDetails) {
    this.navigateToPrevAdjustment.emit(event);
  }
  onViewPaymentDetails(personId: number) {
    this.navigateToPaymentHistory.emit(personId);
  }

  createForm(eachHeir: HeirBenefitDetails, hasCreditAdjustment = false) {
    const heirDebitDetails = new HeirDebitDetails();
    const adjustmentForm = this.fb.group({
      personId: eachHeir.personId
    });
    if (!this.approveScreen && !hasCreditAdjustment) {
      adjustmentForm.addControl(
        'deductionPercentage',
        this.fb.group({
          english: [heirDebitDetails.deductionPercentage, { validators: Validators.required, updateOn: 'blur' }],
          arabic: heirDebitDetails.deductionPercentage
        })
      );
    }
    // else {
    //   //Save was not working for debug purpose
    //   adjustmentForm.addControl(
    //     'deductionPercentage',
    //     this.fb.group({
    //       english: '',
    //       arabic: ''
    //     })
    //   );
    // }
    if (eachHeir.adjustmentCalculationDetails.adjustmentDetails)
      if (this.approveScreen) {
        adjustmentForm.addControl(
          'adjustmentDetails',
          this.fb.group({
            holdBenefit: [false],
            initiateDirectPayment: [false],
            personId: [eachHeir.personId]
          })
        );
      }
    return adjustmentForm;
  }

  setValuesToForm() {}

  selectdeductionPlanMethod(event) {}

  getTpaAdjustments(event: boolean, personId: number) {
    if (this.approveScreen && event) this.getTpa.emit(personId);
  }

  getAdjustments(personId: number) {
    return this.adjustmentDetails ? this.adjustmentDetails[personId] : null;
  }
  /*
   * This methid is to show Modal
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
  }
  /*
   * This method is to close Modal
   */
  hideModal() {
    this.commonModalRef.hide();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
  // getLumpsum(benefitType) {
  //   return benefitType.includes('Lumpsum');
  // }
}
