import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LovList, BilingualText, Lov, Alert, AlertTypeEnum, AlertIconEnum, greaterThanValidator } from '@gosi-ui/core';
import { formatNumber } from '@angular/common';
import { AdjustmentConstants } from '../../../shared';

@Component({
  selector: 'pmt-adjustment-modify-cancel-dc',
  templateUrl: './adjustment-modify-cancel-dc.component.html',
  styleUrls: ['./adjustment-modify-cancel-dc.component.scss']
})
export class AdjustmentModifyCancelDcComponent implements OnInit {
  @Input() adjustmentDetail;
  @Input() adjustmentReasonList$: LovList;
  @Input() isValidator;

  @Output() onModifyAdjustmentClicked = new EventEmitter();
  @Output() onCancelAdjustmentClicked = new EventEmitter();
  @Output() onCancelModifyFormCancelled = new EventEmitter();

  switchCase = 'switch1';
  modifyadjustmentForm: FormGroup;
  canceladjustmentForm: FormGroup;
  newBalanceAmount: BilingualText;
  reasonList: BilingualText[] = [{ arabic: 'Buy In', english: 'Buy In' }];
  cancellationReasonList: LovList = new LovList([]);
  cancelList: BilingualText[] = [{ arabic: 'Cancellation of Adjustment', english: 'Cancellation of Adjustment' }];
  debitPercentageList: LovList = new LovList([]);
  percentageList = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100];
  cancelInfo: Alert;
  infoMessage: string;
  isModifyAdjustmentFormChanged: Boolean = false;
  isCancelAdjustmentFormChanged: Boolean = false;
  separatorLimit = AdjustmentConstants.AMOUNT_RECEIVED_SEPARATOR_LIMIT;

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.modifyadjustmentForm = this.createModifyForm();
    this.canceladjustmentForm = this.createCancelForm();
    this.cancelList.forEach(cancelReason => {
      this.cancellationReasonList.items.push({ ...new Lov(), value: cancelReason });
    });
    this.percentageList.forEach(percent => {
      this.debitPercentageList.items.push({
        ...new Lov(),
        value: { english: percent.toString(), arabic: percent.toString() }
      });
    });
    this.setPercentageControl();
    if (this.adjustmentDetail) {
      this.patchModifyForm();
      this.patchCancelForm();
      if (this.isValidator && this.adjustmentDetail?.actionType?.english === 'Modify') {
        this.setAdjustmentValue(
          this.adjustmentDetail?.modificationDetails?.beforeModification?.adjustmentAmount,
          this.adjustmentDetail?.modificationDetails?.beforeModification?.adjustmentBalance
        );
      }
      this.getBalanceAmount();
    }
    if (
      this.adjustmentDetail.adjustmentType.english === 'Debit' &&
      this.adjustmentDetail.adjustmentAmount - this.adjustmentDetail.adjustmentBalance > 0
    ) {
      this.showCancelInfo();
    }
    this.modifyadjustmentForm.valueChanges.subscribe(val => {
      if (val) {
        this.isModifyAdjustmentFormChanged = true;
      } else {
        this.isModifyAdjustmentFormChanged = false;
      }
    });
    this.canceladjustmentForm.valueChanges.subscribe(val => {
      if (val) {
        this.isCancelAdjustmentFormChanged = true;
      } else {
        this.isCancelAdjustmentFormChanged = false;
      }
    });
  }
  createModifyForm() {
    return this.fb.group({
      actionType: this.fb.group({
        english: ['Modify'],
        arabic: ['Modify']
      }),
      adjustmentAmount: [null, Validators.compose([greaterThanValidator(0), Validators.required])],
      adjustmentReason: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      notes: [null, { validators: Validators.required }]
    });
  }
  createCancelForm() {
    return this.fb.group({
      actionType: this.fb.group({
        english: ['Cancel'],
        arabic: ['Cancel']
      }),
      rejectionReason: [null, Validators.required],
      notes: [null, { validators: Validators.required }]
    });
  }
  setPercentageControl() {
    if (this.adjustmentDetail.adjustmentType.english === 'Debit') {
      this.modifyadjustmentForm.addControl(
        'adjustmentPercentage',
        this.fb.group({
          english: [null, { validators: Validators.required }],
          arabic: [null]
        })
      );
    } else if (
      this.adjustmentDetail.adjustmentType.english === 'Credit' &&
      this.modifyadjustmentForm.get('adjustmentPercentage')
    ) {
      this.modifyadjustmentForm.removeControl('adjustmentPercentage');
    }
  }
  patchModifyForm() {
    this.modifyadjustmentForm.patchValue({
      adjustmentAmount: this.adjustmentDetail.adjustmentAmount,
      adjustmentReason: this.adjustmentDetail.adjustmentReason,
      notes: this.adjustmentDetail.notes
    });
    if (this.adjustmentDetail.adjustmentType.english === 'Debit') {
      this.modifyadjustmentForm.get('adjustmentPercentage').setValue({
        english: this.adjustmentDetail?.adjustmentPercentage?.toString(),
        arabic: this.adjustmentDetail?.adjustmentPercentage?.toString()
      });
    }
    if (this.isValidator && this.adjustmentDetail?.actionType?.english === 'Modify')
      this.setNotesForValidator(this.modifyadjustmentForm);
  }
  setNotesForValidator(form) {
    form.get('notes').setValue(this.adjustmentDetail?.notes);
  }
  patchCancelForm() {
    this.canceladjustmentForm.patchValue({
      rejectionReason: this.adjustmentDetail?.rejectionReason
    });
    if (this.isValidator && this.adjustmentDetail?.actionType?.english === 'Cancel')
      this.setNotesForValidator(this.canceladjustmentForm);
  }
  setSwitch(event) {
    this.switchCase = event;
  }
  setAdjustmentValue(adjustmentAmount, adjustmentBalance) {
    if (adjustmentAmount) {
      this.adjustmentDetail.adjustmentAmount = adjustmentAmount;
    }
    if (adjustmentBalance) {
      this.adjustmentDetail.adjustmentBalance = adjustmentBalance;
    }
  }
  getBalanceAmount() {
    if (
      this.modifyadjustmentForm &&
      this.modifyadjustmentForm.get('adjustmentAmount').value !== null &&
      this.modifyadjustmentForm.get('adjustmentAmount').value !== '' &&
      this.adjustmentDetail?.adjustmentBalance !== null &&
      this.adjustmentDetail?.adjustmentAmount !== null
    ) {
      this.newBalanceAmount = {
        english: `${formatNumber(this.getValue(), 'en-US', '1.0-2')} SAR`,
        arabic: `ر.س ${formatNumber(this.getValue(), 'en-US', '1.0-2')}`
      };
    } else {
      this.newBalanceAmount = null;
    }
  }
  getValue() {
    if (
      this.modifyadjustmentForm &&
      this.modifyadjustmentForm.get('adjustmentAmount') &&
      this.modifyadjustmentForm.get('adjustmentAmount').value !== null &&
      this.modifyadjustmentForm.get('adjustmentAmount').value !== '' &&
      this.adjustmentDetail?.adjustmentBalance !== null &&
      this.adjustmentDetail?.adjustmentAmount !== null
    ) {
      return (
        parseFloat(this.modifyadjustmentForm.get('adjustmentAmount').value) +
        this.adjustmentDetail.adjustmentBalance -
        this.adjustmentDetail.adjustmentAmount
      );
    }
  }
  modifyAdjustment() {
    if (this.modifyadjustmentForm.valid) {
      this.onModifyAdjustmentClicked.emit({
        ...this.modifyadjustmentForm.value,
        adjustmentId: this.adjustmentDetail.adjustmentId,
        adjustmentStatus: this.adjustmentDetail.adjustmentStatus,
        adjustmentBalance: this.getValue(),
        adjustmentType: this.adjustmentDetail.adjustmentType,
        benefitType: this.adjustmentDetail.benefitType
      });
    }
  }
  cancelModifyTransaction() {
    if (this.isValidator && this.adjustmentDetail?.actionType?.english === 'Modify') {
      this.setAdjustmentValue(
        this.adjustmentDetail?.modificationDetails?.afterModification?.adjustmentAmount,
        this.adjustmentDetail?.modificationDetails?.afterModification?.adjustmentBalance
      );
    }
    this.onCancelModifyFormCancelled.emit(this.isModifyAdjustmentFormChanged);
  }
  cancelAdjustment() {
    let modifyRequest = {
      ...this.canceladjustmentForm.value,
      adjustmentId: this.adjustmentDetail.adjustmentId,
      adjustmentAmount: this.adjustmentDetail.adjustmentAmount,
      adjustmentReason: this.adjustmentDetail.adjustmentReason,
      adjustmentStatus: this.adjustmentDetail.adjustmentStatus,
      adjustmentBalance: this.adjustmentDetail.adjustmentBalance,
      adjustmentType: this.adjustmentDetail.adjustmentType,
      benefitType: this.adjustmentDetail.benefitType
    };
    let cancelRequest = {
      ...this.canceladjustmentForm.value,
      actionType: { english: 'Recovery', arabic: 'Recovery' },
      adjustmentId: this.adjustmentDetail.adjustmentId,
      adjustmentAmount: this.adjustmentDetail.adjustmentAmount - this.adjustmentDetail.adjustmentBalance,
      adjustmentReason: this.adjustmentDetail.adjustmentReason,
      adjustmentStatus: { english: 'Recovered', arabic: 'مسترد' },
      adjustmentBalance: this.adjustmentDetail.adjustmentBalance,
      adjustmentType: this.adjustmentDetail.adjustmentType,
      benefitType: this.adjustmentDetail.benefitType
    };
    if (this.adjustmentDetail.adjustmentType.english === 'Debit') {
      modifyRequest = {
        ...modifyRequest,
        adjustmentPercentage: {
          english: this.adjustmentDetail?.adjustmentPercentage?.toString(),
          arabic: this.adjustmentDetail?.adjustmentPercentage?.toString()
        }
      };
      cancelRequest = {
        ...cancelRequest,
        adjustmentPercentage: {
          english: this.adjustmentDetail?.adjustmentPercentage?.toString(),
          arabic: this.adjustmentDetail?.adjustmentPercentage?.toString()
        }
      };
    }
    this.onModifyAdjustmentClicked.emit(modifyRequest);
    if (cancelRequest.adjustmentType.english === 'Debit' && cancelRequest.adjustmentAmount > 0) {
      this.onCancelAdjustmentClicked.emit(cancelRequest);
    }
  }
  cancelAdjustmentTransaction() {
    this.onCancelModifyFormCancelled.emit(this.isCancelAdjustmentFormChanged);
  }
  showCancelInfo() {
    this.infoMessage = 'ADJUSTMENT.CANCEL-INFO';
    this.cancelInfo = new Alert();
    this.cancelInfo.messageKey = this.infoMessage;
    this.cancelInfo.type = AlertTypeEnum.INFO;
    this.cancelInfo.dismissible = false;
    this.cancelInfo.icon = AlertIconEnum.INFO;
  }
  getCurrency(amount) {
    if (amount !== null) {
      return {
        english: `${formatNumber(amount, 'en-US', '1.0-2')} SAR`,
        arabic: `ر.س ${formatNumber(amount, 'en-US', '1.0-2')}`
      };
    } else {
      return null;
    }
  }
}
