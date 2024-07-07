/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { BilingualText, LovList } from '@gosi-ui/core';
import { InjuryFilter } from '../../shared';
import { InputMultiCheckboxDcComponent } from '@gosi-ui/foundation-theme';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'oh-injury-filter-dc',
  templateUrl: './injury-filter-dc.component.html',
  styleUrls: ['./injury-filter-dc.component.scss']
})
export class InjuryFilterDcComponent implements OnInit, OnChanges {
  constructor(private fb: FormBuilder) {}

  /**
   * Local Variables
   */
  selectedStatusOptions: Array<BilingualText>;
  statusFilterForm: FormGroup;
  statusValue: BilingualText[] = [];
  statusList: BilingualText[] = [];
  injuryFilter: InjuryFilter = new InjuryFilter();

  /**
   * Output variables
   */
  @Output() injuryDetailsFilter: EventEmitter<InjuryFilter> = new EventEmitter();
  /**
   * Template & directive references
   */

  @ViewChild('statusComponent') statusListComp: InputMultiCheckboxDcComponent;

  /** Input variables */
  @Input() transactionStatus: LovList;
  @Input() clearResult = false;
  @Input() statusFilter: BilingualText[];

  ngOnInit(): void {
    this.statusFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.statusList.forEach(() => {
      const control = new FormControl(false);
      (this.statusFilterForm.controls.items as FormArray).push(control);
    });
    if (this.clearResult) {
      this.clearAllFiters();
    }
  }
  /**
   * Method to get filter details
   *
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.transactionStatus && changes.transactionStatus.currentValue) {
      if (this.transactionStatus) {
        this.transactionStatus.items.forEach(items => {
          if (items) {
            this.statusList.push(items.value);
          }
        });
      }
    }
    if (changes && changes.clearResult) {
      if (this.clearResult) {
        this.clearAllFiters();
      }
    }

    if (changes && changes.statusFilter) {
      if (this.statusFilter) {
        this.clearSelectedFilter(this.statusFilter);
      }
    }
  }
  applyFilter() {
    if (this.selectedStatusOptions && this.selectedStatusOptions.length >= 1) {
      this.statusValue = this.selectedStatusOptions;
    } else {
      this.statusValue = null;
    }
    this.injuryFilter.status = this.statusValue;
    this.injuryDetailsFilter.emit(this.injuryFilter);
  }
  /*Method to clear filter values*/
  clearSelectedFilter(items) {
    const index = this.statusList.findIndex(element => element === items);
    if (index !== -1) {
      this.selectedStatusOptions = this.selectedStatusOptions.filter(item => item.english !== items.english);
      this.statusFilterForm.controls.items.value.forEach(() => {
        Object.values(this.statusFilterForm.controls).forEach((control: FormGroup) => {
          control.controls[index].setValue(false);
          control.controls[index].markAsUntouched();
          control.controls[index].markAsPristine();
        });
      });
    }
  }
  /*Method to clear filter values*/
  clearAllFiters() {
    this.statusFilterForm.reset();
    this.selectedStatusOptions = [];
    this.injuryDetailsFilter.emit(null);
  }
}
