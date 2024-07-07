/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BilingualText, LovList } from '@gosi-ui/core';
import { BranchFilter } from '../../../shared/models';
import { InputMultiCheckboxDcComponent } from '@gosi-ui/foundation-theme';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'blg-reciept-filter-dc',
  templateUrl: './reciept-filter-dc.component.html',
  styles: []
})
export class RecieptFilterDcComponent implements OnInit, OnChanges {
  constructor(private fb: FormBuilder) {}

  // local variables
  statusFilterForm: FormGroup;
  locationFilterForm: FormGroup;
  selectedStatusOptions: Array<BilingualText>;
  selectedLocationOptions: Array<BilingualText>;
  locationValue: BilingualText[];
  statusValue: BilingualText[] = [];
  modalRef: BsModalRef;
  branchFilter: BranchFilter = new BranchFilter();
  locationList: BilingualText[] = [];
  statusList: BilingualText[] = [];

  // input varaiables
  @Input() establishmentLocationList: LovList;
  @Input() establishmentStatusList: LovList;
  @ViewChild('statusComponent') statusListComp: InputMultiCheckboxDcComponent;
  @ViewChild('locationComponent') locationListComp: InputMultiCheckboxDcComponent;
  // outut varaiables
  @Output() branchDetailsFilter: EventEmitter<BranchFilter> = new EventEmitter();
  @Output() filterFlag: EventEmitter<Boolean> = new EventEmitter();

  /** This method handles initializaton task. */
  ngOnInit() {
    this.statusFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.locationFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.establishmentStatusList.items.forEach(() => {
      const control = new FormControl(false);
      (this.statusFilterForm.controls.items as FormArray).push(control);
    });
    this.establishmentLocationList.items.forEach(() => {
      const control = new FormControl(false);
      (this.locationFilterForm.controls.items as FormArray).push(control);
    });
  }
  /**
   * Method to get filter details
   *
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.establishmentLocationList && changes.establishmentLocationList.currentValue) {
      this.establishmentLocationList.items.forEach(data => {
        if (data) {
          this.locationList.push(data.value);
        }
      });
    }
    if (changes && changes.establishmentStatusList && changes.establishmentStatusList.currentValue) {
      this.establishmentStatusList.items.forEach(data => {
        if (data) {
          this.statusList.push(data.value);
        }
      });
    }
  }

  /*Method to fetch details based on filter conditions*/
  applyFilter() {
    if (this.selectedLocationOptions && this.selectedLocationOptions.length >= 1) {
      this.locationValue = this.selectedLocationOptions;
    } else {
      this.locationValue = null;
    }
    if (this.selectedStatusOptions && this.selectedStatusOptions.length >= 1) {
      this.statusValue = this.selectedStatusOptions;
    } else {
      this.statusValue = null;
    }

    this.branchFilter.fieldOffice = this.locationValue;
    this.branchFilter.status = this.statusValue;
    this.branchDetailsFilter.emit(this.branchFilter);
    this.filterFlag.emit(true);
  }

  /*Method to clear filter values*/
  clearAllFiters() {
    this.statusFilterForm.reset();
    this.locationFilterForm.reset();
    this.selectedLocationOptions = null;
    this.selectedStatusOptions = null;
    this.branchDetailsFilter.emit(null);
    this.filterFlag.emit(false);
  }
}
