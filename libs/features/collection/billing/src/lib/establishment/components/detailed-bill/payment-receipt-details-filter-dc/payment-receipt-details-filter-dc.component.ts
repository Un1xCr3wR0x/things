/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { convertToYYYYMMDD } from '@gosi-ui/core';
import { FilterParams } from '../../../../shared/models';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { InputDaterangeDcComponent } from '@gosi-ui/foundation-theme';

@Component({
  selector: 'blg-payment-receipt-details-filter-dc',
  templateUrl: './payment-receipt-details-filter-dc.component.html',
  styleUrls: ['./payment-receipt-details-filter-dc.component.scss']
})
export class PaymentReceiptDetailsFilterDcComponent implements OnInit, OnChanges {
  constructor(private fb: FormBuilder) {}
  /** Output variables */
  @Output() filterValues: EventEmitter<FilterParams> = new EventEmitter();

  /** Input variables */
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;

  // local variables
  amountFilterForms: FormGroup;
  receiptFilterDetails: FilterParams = new FilterParams();
  maximumDate: Date;
  billDateForm = new FormControl();

  /** This method handles initializaton task. */
  ngOnInit() {
    this.maximumDate = new Date();

    this.amountFilterForms = this.fb.group({
      amount: new FormControl([0, 100000])
    });
  }

  /**
   * Method to get filter details
   *
   */
  ngOnChanges() {}

  /**
   * Method to get filter details
   *
   */
  applyFilter() {
    if (this.amountFilterForms.get('amount').value) {
      this.receiptFilterDetails.receiptFilter.maxAmount = this.amountFilterForms.get('amount').value[1];
      this.receiptFilterDetails.receiptFilter.minAmount = this.amountFilterForms.get('amount').value[0];
    } else {
      this.receiptFilterDetails.receiptFilter.maxAmount = null;
    }

    if (this.billDateForm.value) {
      this.receiptFilterDetails.receiptFilter.receiptDate.startDate = convertToYYYYMMDD(this.billDateForm.value[0]);
      this.receiptFilterDetails.receiptFilter.receiptDate.endDate = convertToYYYYMMDD(this.billDateForm.value[1]);
    } else {
      this.receiptFilterDetails.receiptFilter.receiptDate.startDate = null;
      this.receiptFilterDetails.receiptFilter.receiptDate.endDate = null;
    }
    this.receiptFilterDetails.receiptFilter.receiptMode = null;
    this.filterValues.emit(this.receiptFilterDetails);
  }
  // method toclear all  filter branch details
  clearAllFiters() {
    this.billDateForm.reset();
    this.amountFilterForms.reset();
    this.amountFilterForms = this.fb.group({
      amount: new FormControl([0, 100000])
    });
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
