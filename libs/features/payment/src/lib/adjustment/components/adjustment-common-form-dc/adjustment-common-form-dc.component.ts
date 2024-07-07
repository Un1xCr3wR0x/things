import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LovList, Lov, BilingualText } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { AdjustmentConstants } from '../../../shared';

@Component({
  selector: 'pmt-adjustment-common-form-dc',
  templateUrl: './adjustment-common-form-dc.component.html',
  styleUrls: ['./adjustment-common-form-dc.component.scss']
})
export class AdjustmentCommonFormDcComponent implements OnInit {
  @Input() adjustmentAddForm: FormGroup;
  @Input() benefitTypeList;
  @Input() benefitItems;
  @Input() showActionBtn;
  @Input() selectedType: Lov;
  @Input() isReadOnly: Boolean = false;
  @Input() adjustmentDetail;
  @Input() isValidator: Boolean = false;
  @Input() adjustmentReasonList$: LovList;

  @Output() onAddBtnClicked = new EventEmitter();
  @Output() onCancelBtnClicked = new EventEmitter();
  @Output() onBenefitTypeSelected = new EventEmitter();
  @Output() onCloseBtnClicked = new EventEmitter();

  adjustmentTypeList: LovList = new LovList([]);
  reasonList: BilingualText[] = [
    { english: 'Buy In', arabic: 'Buy In' },
    { english: 'Cancellation of Adjustment', arabic: 'إلغاء تسوية' }
  ];
  adjustmentTypes: BilingualText[] = [
    { english: 'Credit', arabic: 'دائن' },
    { english: 'Debit', arabic: 'مدين' }
  ];
  percentageList = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100];
  debitPercentageList: LovList = new LovList([]);
  percentageForm: FormGroup;
  debitValue: BilingualText;
  separatorLimit = AdjustmentConstants.AMOUNT_RECEIVED_SEPARATOR_LIMIT;
  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.percentageForm = this.fb.group({});
    this.adjustmentTypes.forEach(type => {
      this.adjustmentTypeList.items.push({ ...new Lov(), value: type });
    });
    this.percentageList.forEach(percent => {
      this.debitPercentageList.items.push({
        ...new Lov(),
        value: { english: percent.toString(), arabic: percent.toString() }
      });
    });
    if (this.selectedType) {
      this.adjustmentAddForm.get('benefitType').setValue(this.selectedType.value);
      this.getBenefits(this.selectedType);
      this.adjustmentAddForm.get('benefitType').disable();
    }
    if (this.isReadOnly && this.adjustmentDetail) {
      if (this.adjustmentDetail?.adjustmentType?.english === 'Debit') {
        this.percentageForm.addControl(
          'adjustmentPercentage',
          this.fb.group({
            english: [null, { validators: Validators.required }],
            arabic: [null]
          })
        );
      } else if (
        this.adjustmentDetail?.adjustmentType?.english === 'Credit' &&
        this.percentageForm.get('adjustmentPercentage')
      ) {
        this.percentageForm.removeControl('adjustmentPercentage');
      }
      if (this.percentageForm.get('adjustmentPercentage')) {
        this.debitValue = {
          english: this.adjustmentDetail?.adjustmentPercentage.toString(),
          arabic: this.adjustmentDetail?.adjustmentPercentage.toString()
        };
        this.percentageForm.get('adjustmentPercentage').patchValue(this.debitValue);
        this.percentageForm.get('adjustmentPercentage').disable();
      }
    }
  }
  addAdjustment() {
    this.onAddBtnClicked.emit();
  }
  cancelAddTransaction() {
    this.onCancelBtnClicked.emit();
  }
  getBenefits(event) {
    this.onBenefitTypeSelected.emit(event);
    if (event === null) {
      this.benefitItems = null;
    }
  }
  onAdjustmentTypeSelect(type) {
    if (type === 'Debit') {
      this.adjustmentAddForm.addControl(
        'adjustmentPercentage',
        this.fb.group({
          english: [null, { validators: Validators.required }],
          arabic: [null]
        })
      );
    } else if (type === 'Credit' && this.adjustmentAddForm.get('adjustmentPercentage')) {
      this.adjustmentAddForm.removeControl('adjustmentPercentage');
    }
  }
  onClosed() {
    this.onCloseBtnClicked.emit();
  }
}
