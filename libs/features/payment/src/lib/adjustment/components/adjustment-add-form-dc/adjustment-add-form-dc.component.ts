import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreAdjustmentService, LovList, Lov, BilingualText, greaterThanValidator } from '@gosi-ui/core';
import {BenefitDetails, BenefitItems, AdjustmentConstants, getAdjustmentReasonForReform} from '../../../shared';
import { formatNumber } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'pmt-adjustment-add-form-dc',
  templateUrl: './adjustment-add-form-dc.component.html',
  styleUrls: ['./adjustment-add-form-dc.component.scss']
})
export class AdjustmentAddFormDcComponent implements OnInit {
  @Input() adjustmentDetail;
  @Input() set adjustmentReasonList$(value: LovList) {
    this.adjustmentReasonWholeList = value;
    this.adjustmentReasonList = getAdjustmentReasonForReform(value);
  }
  get adjustmentReasonList$() {
    return this.adjustmentReasonList;
  }
  @Input() beneficiaries: BenefitDetails[];
  @Input() isReadOnly: Boolean = false;

  @Output() onCancelClicked = new EventEmitter();
  @Output() onAddClicked = new EventEmitter();
  @Output() onCloseClicked = new EventEmitter();

  adjustmentAddForm: FormGroup;
  benefitTypeList: LovList = new LovList([]);
  benefitItems: BenefitItems;
  type;
  selectedType: Lov;
  isAddAdjustmentFormChanged: Boolean = false;
  adjustmentReasonList: LovList;
  adjustmentReasonWholeList: LovList;

  constructor(readonly fb: FormBuilder, readonly adjustmentService: CoreAdjustmentService) {}

  ngOnInit(): void {
    this.adjustmentAddForm = this.createAdjustmentAddForm();
    if (this.adjustmentDetail?.adjustmentType?.english === 'Debit') {
      this.adjustmentAddForm.addControl(
        'adjustmentPercentage',
        this.fb.group({
          english: [null, { validators: Validators.required }],
          arabic: [null]
        })
      );
    } else if (
      this.adjustmentDetail?.adjustmentType?.english === 'Credit' &&
      this.adjustmentAddForm.get('adjustmentPercentage')
    ) {
      this.adjustmentAddForm.removeControl('adjustmentPercentage');
    }
    this.type = this.adjustmentService.benefitType || this.adjustmentDetail?.benefitType;
    if (this.beneficiaries && this.beneficiaries.length > 0) {
      this.beneficiaries.map((data, index) => {
        this.benefitTypeList.items.push({ ...new Lov(), value: data?.benefitType, sequence: index });
        if (this.type && data?.benefitType?.english === this.type) {
          this.selectedType = { ...new Lov(), value: data?.benefitType, sequence: index };
        }
      });
    }
    if (this.adjustmentDetail) {
      this.patchAddForm();
      if (this.beneficiaries && this.beneficiaries.length > 0) {
        this.beneficiaries.map((data, index) => {
          if (data?.benefitType?.english === this.adjustmentDetail?.benefitType?.english) {
            this.getBenefits({ sequence: index });
          }
        });
      }
      if (this.isReadOnly) {
        this.adjustmentAddForm
          .get('adjustmentReason')
          .patchValue({ english: 'Cancellation of Adjustment', arabic: 'إلغاء تسوية' });
        this.adjustmentAddForm.disable();
      }
    }
    this.adjustmentAddForm.valueChanges.subscribe(val => {
      if (val) {
        this.isAddAdjustmentFormChanged = true;
      } else {
        this.isAddAdjustmentFormChanged = false;
      }
    });
  }
  createAdjustmentAddForm() {
    return this.fb.group({
      actionType: this.fb.group({
        english: ['Add'],
        arabic: ['Add']
      }),
      benefitType: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      adjustmentReason: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      adjustmentType: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      adjustmentAmount: [null, { validators: Validators.compose([greaterThanValidator(0), Validators.required]) }],
      notes: [null, { validators: Validators.required }]
    });
  }
  patchAddForm() {
    this.adjustmentAddForm.patchValue({
      benefitType: this.adjustmentDetail?.benefitType,
      adjustmentReason: this.adjustmentDetail?.adjustmentReason,
      adjustmentType: this.adjustmentDetail?.adjustmentType,
      adjustmentAmount: this.adjustmentDetail?.adjustmentAmount,
      notes: this.adjustmentDetail?.notes
    });
    if (this.adjustmentDetail?.adjustmentType?.english === 'Debit') {
      this.adjustmentAddForm.patchValue({
        adjustmentPercentage: {
          english: this.adjustmentDetail?.adjustmentPercentage.toString(),
          arabic: this.adjustmentDetail?.adjustmentPercentage.toString()
        }
      });
    }
  }
  getBenefits(item) {
    if (item && item.sequence >= 0) {
      this.benefitItems = {
        benefitAmount: {
          english: formatNumber(this.beneficiaries[item.sequence]?.benefitAmount, 'en-US', '1.0-2') + ' SAR/Month',
          arabic: `ر.س/ شهر  ${formatNumber(this.beneficiaries[item.sequence]?.benefitAmount, 'en-US', '1.0-2')}`
        },
        beneficiaryId: this.beneficiaries[item.sequence]?.beneficiaryId,
        benefitRequestStatus: this.beneficiaries[item.sequence]?.benefitRequestStatus,
        benefitStatus: this.beneficiaries[item.sequence]?.benefitStatus,
        benefitStartDate: this.beneficiaries[item.sequence]?.startDate?.gregorian,
        benefitEndDate: this.beneficiaries[item.sequence]?.stopDate?.gregorian,
        benefitRequestDate: this.beneficiaries[item.sequence]?.benefitRequestDate?.gregorian,
        initialBenefitAmount: {
          english:
            formatNumber(this.beneficiaries[item.sequence]?.initialBenefitAmount, 'en-US', '1.0-2') + ' SAR/Month',
          arabic: `ر.س/ شهر  ${formatNumber(this.beneficiaries[item.sequence]?.initialBenefitAmount, 'en-US', '1.0-2')}`
        },
        subsequentBenefitAmount: {
          english:
            formatNumber(this.beneficiaries[item.sequence]?.subsequentBenefitAmount, 'en-US', '1.0-2') + ' SAR/Month',
          arabic: `ر.س/ شهر  ${formatNumber(
            this.beneficiaries[item.sequence]?.subsequentBenefitAmount,
            'en-US',
            '1.0-2'
          )}`
        },
        isBenefitTypeSaned: item?.value?.english
          ? item?.value?.english?.toLowerCase().includes(AdjustmentConstants.SANED) ||
            item?.value?.english?.includes(AdjustmentConstants.UI)
          : false
      };
      this.adjustmentReasonList = getAdjustmentReasonForReform(this.adjustmentReasonWholeList, this.beneficiaries[item.sequence].eligibleForPensionReform);
    }
  }
  addAdjustment() {
    if (this.adjustmentAddForm.valid) {
      if (this.adjustmentDetail?.adjustmentId) {
        this.onAddClicked.emit({
          ...this.adjustmentAddForm.getRawValue(),
          adjustmentStatus: {
            english: 'New',
            arabic: 'جديد'
          },
          adjustmentId: this.adjustmentDetail?.adjustmentId,
          beneficiaryId: this.benefitItems?.beneficiaryId
        });
      } else {
        this.onAddClicked.emit({
          ...this.adjustmentAddForm.getRawValue(),
          adjustmentStatus: {
            english: 'New',
            arabic: 'جديد'
          },
          adjustmentId: 1000 + Math.round(Math.random() * 100),
          beneficiaryId: this.benefitItems?.beneficiaryId
        });
      }
    }
  }
  cancelAddTransaction() {
    this.onCancelClicked.emit(this.isAddAdjustmentFormChanged);
  }
  onViewClosed() {
    this.onCloseClicked.emit();
  }
}
