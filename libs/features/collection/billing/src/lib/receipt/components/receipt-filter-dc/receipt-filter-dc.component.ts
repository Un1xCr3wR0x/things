/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { BilingualText, LovList, convertToYYYYMMDD } from '@gosi-ui/core';
import { FilterParams } from '../../../shared/models';
import { InputMultiCheckboxDcComponent, InputDaterangeDcComponent } from '@gosi-ui/foundation-theme';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'blg-receipt-filter-dc',
  templateUrl: './receipt-filter-dc.component.html',
  styleUrls: ['./receipt-filter-dc.component.scss']
})
export class ReceiptFilterDcComponent implements OnInit, OnChanges {
  constructor(private fb: FormBuilder) {}
  /** Output variables */
  @Output() filterValues: EventEmitter<FilterParams> = new EventEmitter();

  /** Input variables */
  @Input() receiptMode: LovList;
  @Input() receiptStatus: LovList;
  @Input() isVicReceipt: boolean;
  @ViewChild('receiptComponent') receiptListComp: InputMultiCheckboxDcComponent;
  @ViewChild('statusComponent') statusListComp: InputMultiCheckboxDcComponent;
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;

  // local variables
  statusFilterForm: FormGroup;
  receiptFilterForm: FormGroup;
  selectedStatusList: Array<BilingualText>;
  selectedReceiptList: Array<BilingualText>;
  statusList: BilingualText[] = [];
  receiptFilterDetails: FilterParams = new FilterParams();
  receiptModeList: BilingualText[] = [];
  receiptValue: BilingualText[] = [];
  statusValue: BilingualText[] = [];
  amountFilterForm: FormGroup;
  billDateForm = new FormControl();
  maxDate: Date;

  /** This method handles initializaton task. */
  ngOnInit() {
    this.statusFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.receiptFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.receiptStatus?.items.forEach(() => {
      const control = new FormControl(false);
      (this.statusFilterForm.controls.items as FormArray).push(control);
    });
    this.receiptMode?.items.forEach(() => {
      const control = new FormControl(false);
      (this.receiptFilterForm.controls.items as FormArray).push(control);
    });
    this.amountFilterForm = this.fb.group({
      amount: new FormControl([0, 100000])
    });
    this.maxDate = new Date();
  }

  /**
   * Method to get filter details
   *
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.receiptMode && changes.receiptMode.currentValue) {
      this.receiptMode.items.forEach(data => {
        if (data) {
          this.receiptModeList.push(data.value);
        }
      });
    }
    if (changes && changes.receiptStatus && changes.receiptStatus.currentValue) {
      this.receiptStatus?.items.forEach(data => {
        if (data) {
          this.statusList.push(data.value);
        }
      });
    }
  }

  /**
   * Method to get filter details
   *
   */
  applyFilter() {
    if (this.selectedReceiptList && this.selectedReceiptList.length >= 1) {
      this.receiptValue = this.selectedReceiptList;
    } else {
      this.receiptValue = null;
    }

    if (this.selectedStatusList && this.selectedStatusList.length >= 1) {
      this.statusValue = this.selectedStatusList;
    } else {
      this.statusValue = null;
    }
    if (this.amountFilterForm.get('amount').value) {
      this.receiptFilterDetails.receiptFilter.maxAmount = this.amountFilterForm.get('amount').value[1];
      this.receiptFilterDetails.receiptFilter.minAmount = this.amountFilterForm.get('amount').value[0];
    } else {
      this.receiptFilterDetails.receiptFilter.maxAmount = null;
      this.receiptFilterDetails.receiptFilter.minAmount = null;
    }

    if (this.billDateForm.value) {
      this.receiptFilterDetails.receiptFilter.receiptDate.startDate = convertToYYYYMMDD(this.billDateForm.value[0]);
      this.receiptFilterDetails.receiptFilter.receiptDate.endDate = convertToYYYYMMDD(this.billDateForm.value[1]);
    } else {
      this.receiptFilterDetails.receiptFilter.receiptDate.startDate = null;
      this.receiptFilterDetails.receiptFilter.receiptDate.endDate = null;
    }

    this.receiptFilterDetails.receiptFilter.receiptMode = this.receiptValue;
    this.receiptFilterDetails.receiptFilter.status = this.statusValue;
    this.receiptFilterDetails.receiptFilter.approvalStatus = null;
    this.receiptFilterDetails.receiptFilter.endDate = null;
    this.receiptFilterDetails.receiptFilter.startDate = null;
    this.receiptFilterDetails.parentReceiptNo = '';
    this.filterValues.emit(this.receiptFilterDetails);
  }
  // method toclear all  filter branch details
  clearAllFiters() {
    this.billDateForm.reset();
    this.amountFilterForm.reset();
    this.amountFilterForm = this.fb.group({
      amount: new FormControl([0, 100000])
    });
    this.statusFilterForm.reset();
    this.receiptFilterForm.reset();
    this.selectedReceiptList = this.selectedStatusList = null;
    this.receiptFilterDetails.receiptFilter.status = null;
    this.receiptFilterDetails.receiptFilter.receiptMode = null;
    this.receiptFilterDetails.receiptFilter.minAmount = undefined;
    this.receiptFilterDetails.receiptFilter.maxAmount = undefined;
    this.receiptFilterDetails.receiptFilter.receiptDate.startDate = undefined;
    this.receiptFilterDetails.receiptFilter.receiptDate.endDate = undefined;
    this.filterValues.emit(this.receiptFilterDetails);
  }

  /**
   * method to set the scroll for filter
   */
  onScroll() {
    if (this.dateRangePicker.dateRangePicker.isOpen) this.dateRangePicker.dateRangePicker.hide();
  }
}
