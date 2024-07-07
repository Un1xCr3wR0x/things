/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { convertToYYYYMMDD } from '@gosi-ui/core';
import { MofAllocationBreakupFilter } from '../../../shared/models';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { InputDaterangeDcComponent } from '@gosi-ui/foundation-theme';

@Component({
  selector: 'blg-mof-allocation-breakup-filter-dc',
  templateUrl: './mof-allocation-breakup-filter-dc.component.html',
  styleUrls: ['./mof-allocation-breakup-filter-dc.component.scss']
})
export class MofAllocationBreakupFilterDcComponent implements OnInit {
  constructor(private fb: FormBuilder) {}
  /** Output variables */
  @Output() filterValues: EventEmitter<MofAllocationBreakupFilter> = new EventEmitter();

  /** Input variables */
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;

  // local variables
  allocationBreakupFilterDet: MofAllocationBreakupFilter = new MofAllocationBreakupFilter();
  amountFilterForm: FormGroup;
  billDateForm = new FormControl();
  maxDate: Date;

  /** This method handles initializaton task. */
  ngOnInit() {
    this.amountFilterForm = this.fb.group({
      amount: new FormControl([0, 100000])
    });
    this.maxDate = new Date();
  }

  /**
   * Method to get filter details
   *
   */
  applyFilter() {
    if (this.amountFilterForm.get('amount').value) {
      this.allocationBreakupFilterDet.maxAmount = this.amountFilterForm.get('amount').value[1];
      this.allocationBreakupFilterDet.minAmount = this.amountFilterForm.get('amount').value[0];
    } else {
      this.allocationBreakupFilterDet.maxAmount = null;
      this.allocationBreakupFilterDet.minAmount = null;
    }

    if (this.billDateForm.value) {
      this.allocationBreakupFilterDet.allocationDate.startDate = convertToYYYYMMDD(this.billDateForm.value[0]);
      this.allocationBreakupFilterDet.allocationDate.endDate = convertToYYYYMMDD(this.billDateForm.value[1]);
    } else {
      this.allocationBreakupFilterDet.allocationDate.startDate = null;
      this.allocationBreakupFilterDet.allocationDate.endDate = null;
    }
    this.filterValues.emit(this.allocationBreakupFilterDet);
  }
  // method toclear all  filter branch details
  clearAllFiters() {
    this.billDateForm.reset();
    this.amountFilterForm.reset();
    this.amountFilterForm = this.fb.group({
      amount: new FormControl([0, 100000])
    });
    this.allocationBreakupFilterDet.minAmount = null;
    this.allocationBreakupFilterDet.maxAmount = null;
    this.allocationBreakupFilterDet.allocationDate.startDate = null;
    this.allocationBreakupFilterDet.allocationDate.endDate = null;
    this.filterValues.emit(this.allocationBreakupFilterDet);
  }

  /**
   * method to set the scroll for filter
   */
  onScroll() {
    if (this.dateRangePicker.dateRangePicker.isOpen) this.dateRangePicker.dateRangePicker.hide();
  }
}
