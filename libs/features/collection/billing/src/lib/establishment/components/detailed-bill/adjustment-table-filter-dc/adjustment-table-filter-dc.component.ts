/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';

import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { convertToYYYYMMDD, LovList } from '@gosi-ui/core';
import { InputDaterangeDcComponent } from '@gosi-ui/foundation-theme';
import { RequestList } from '../../../../shared/models';

@Component({
  selector: 'blg-adjustment-table-filter-dc',
  templateUrl: './adjustment-table-filter-dc.component.html',
  styleUrls: ['./adjustment-table-filter-dc.component.scss']
})
export class AdjustmentTableFilterDcComponent implements OnInit {
  //  Local Variables
  saudiNonSaudiListForm: FormGroup;
  adjustmentFilterForm: FormGroup;
  nationalityForm: FormGroup;
  newAdjustmentFilterForm: FormGroup;
  adjustmentTotalAmountFilterForm: FormGroup;
  newAdjustmentTotalAmountFilterForm: FormGroup;
  filterParams: RequestList = new RequestList();
  periodForm = new FormControl();
  maxDate: Date;
  clearFlag = false;

  //  Input Variables
  @Input() residentType: LovList;

  //  Output Variables
  @Output() filtervalues: EventEmitter<RequestList> = new EventEmitter();
  /**
   * Referring datepicker and daterange picker
   */
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;

  constructor(private fb: FormBuilder) {}

  /**
   * Method to initialise the component
   */
  ngOnInit() {
    this.maxDate = new Date();
    this.adjustmentFilterForm = this.fb.group({
      contributoryWage: new FormControl([0, 45000])
    });
    this.nationalityForm = this.fb.group({
      saudiPerson: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
    this.adjustmentTotalAmountFilterForm = this.fb.group({
      totalAmount: new FormControl([0, 100000])
    });
  }
  // This method is used to apply the filter values
  applyFilter() {
    this.clearFlag = false;
    if (this.adjustmentFilterForm.get('contributoryWage').value) {
      this.filterParams.maxContributoryWage = this.adjustmentFilterForm.get('contributoryWage').value[1];
      this.filterParams.minContributoryWage = this.adjustmentFilterForm.get('contributoryWage').value[0];
    } else {
      this.filterParams.maxContributoryWage = undefined;
      this.filterParams.minContributoryWage = undefined;
    }
    if (this.adjustmentTotalAmountFilterForm.get('totalAmount').value) {
      this.filterParams.minTotal = this.adjustmentTotalAmountFilterForm.get('totalAmount').value[0];
      this.filterParams.maxTotal = this.adjustmentTotalAmountFilterForm.get('totalAmount').value[1];
    } else {
      this.filterParams.maxTotal = undefined;
      this.filterParams.minTotal = undefined;
    }
    if (this.periodForm.value) {
      this.filterParams.period.startDate = convertToYYYYMMDD(this.periodForm.value[0]);
      this.filterParams.period.endDate = convertToYYYYMMDD(this.periodForm.value[1]);
    } else {
      this.filterParams.period.startDate = undefined;
      this.filterParams.period.endDate = undefined;
    }
    if (this.nationalityForm.get('saudiPerson').value) {
      if (this.nationalityForm.get('saudiPerson').get('english').value === 'Saudi') {
        this.filterParams.saudiPerson = true;
      } else if (this.nationalityForm.get('saudiPerson').get('english').value === 'Non Saudi') {
        this.filterParams.saudiPerson = false;
      }
    } else {
      this.filterParams.saudiPerson = null;
    }
    this.filtervalues.emit(this.filterParams);
  }

  clearAllFiters() {
    // this.clearFlag = true;
    this.adjustmentFilterForm.reset();
    this.nationalityForm.reset();
    this.adjustmentTotalAmountFilterForm.reset();
    this.periodForm.reset();
    this.filterParams.maxContributoryWage = undefined;
    this.filterParams.minContributoryWage = undefined;
    this.adjustmentFilterForm = this.fb.group({
      contributoryWage: new FormControl([0, 45000])
    });
    this.filterParams.saudiPerson = undefined;

    this.filterParams.minTotal = undefined;
    this.filterParams.maxTotal = undefined;
    this.adjustmentTotalAmountFilterForm = this.fb.group({
      totalAmount: new FormControl([0, 100000])
    });
    this.filterParams.period.startDate = undefined;
    this.filterParams.period.endDate = undefined;
    this.filtervalues.emit(this.filterParams);
  }
  /**
   * Method to hide datepicker while scrolling
   */
  onScroll() {
    if (this.dateRangePicker.dateRangePicker.isOpen) this.dateRangePicker.dateRangePicker.hide();
  }
}
