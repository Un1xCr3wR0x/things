/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { LovList, BilingualText } from '@gosi-ui/core';
import { FilterDcComponent, InputMultiCheckboxDcComponent } from '@gosi-ui/foundation-theme/src';
import { AuditorFilterParams } from '../../models';
import { AllowanceList } from '../../models/allowance-list';

@Component({
  selector: 'oh-auditor-filter-dc',
  templateUrl: './auditor-filter-dc.component.html',
  styleUrls: ['./auditor-filter-dc.component.scss']
})
export class AuditorFilterDcComponent implements OnInit, OnChanges {
  //LocalVariables
  ohFilterForm: FormGroup;
  selectedOhOptions: Array<BilingualText>;
  ohCategoryList: BilingualText[] = [];
  totalAllowanceForm: FormGroup;
  newAllowanceForm: FormGroup;
  categoryControl: FormGroup;
  filteredValues: BilingualText[] = [];
  filterparams: AuditorFilterParams = new AuditorFilterParams();
  ohValues: string[];

  //Input Variables
  @Input() ohCategoryLovList: LovList;
  @Input() auditDetails: AllowanceList;
  @Input() minValue: number;
  @Input() maxValue: number;
  @Input() minNewValue: number;
  @Input() maxNewValue: number;
  //Output Variables
  @Output() reset = new EventEmitter();
  @Output() apply: EventEmitter<AuditorFilterParams> = new EventEmitter();

  //Child components
  @ViewChild('filter', { static: false })
  filter: FilterDcComponent;
  @ViewChild('ohCategoryType') ohCategoryListComp: InputMultiCheckboxDcComponent;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.totalAllowanceForm = this.createTotalAllowanceForm();
    this.newAllowanceForm = this.createNewAllowanceForm();
    this.ohFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.ohCategoryList.forEach(() => {
      const control = new FormControl(false);
      (this.ohFilterForm.controls.items as FormArray).push(control);
    });
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.ohCategoryLovList && changes.ohCategoryLovList.currentValue) {
      if (this.ohCategoryLovList) {
        this.ohCategoryLovList.items.forEach(items => {
          if (items) {
            this.ohCategoryList.push(items.value);
          }
        });
      }
    }
    if (changes && changes.minValue) {
      this.minValue = changes.minValue.currentValue;
      this.minValue = Math.floor(this.minValue);
    }
    if (changes && changes.maxValue) {
      this.maxValue = changes.maxValue.currentValue;
      this.maxValue = Math.ceil(this.maxValue);
    }
    if (changes && changes.minNewValue) {
      this.minNewValue = changes.minNewValue.currentValue;
      this.minNewValue = Math.floor(this.minNewValue);
    }
    if (changes && changes.maxNewValue) {
      this.maxNewValue = changes.maxNewValue.currentValue;
      this.maxNewValue = Math.ceil(this.maxNewValue);
    }
  }

  /**
   * Create total allowance form
   */
  createTotalAllowanceForm() {
    return this.fb.group({
      totalAllowance: new FormControl([this.minValue, this.maxValue])
    });
  }

  /**
   * Create new allowance form
   */
  createNewAllowanceForm() {
    return this.fb.group({
      newAllowance: new FormControl([this.minNewValue, this.maxNewValue])
    });
  }

  /**
   * Functionality on scrolling
   */
  onScroll() {}

  clearAllFiters() {
    this.totalAllowanceForm.reset();
    this.totalAllowanceForm.get('totalAllowance').setValue([this.minValue, this.maxValue]);
    this.newAllowanceForm.reset();
    this.newAllowanceForm.get('newAllowance').setValue([this.minNewValue, this.maxNewValue]);
    this.ohFilterForm.reset();
    this.apply.emit(null);
  }
  /**
   * Apply Filter
   */
  applyFilter() {
    this.filterparams.ohType = [];
    if (this.selectedOhOptions && this.selectedOhOptions.length >= 1) {
      const ohList: string[] = [];
      this.selectedOhOptions.forEach(value => ohList.push(value.english));
      this.filterparams.ohType = ohList;
    }
    if (this.totalAllowanceForm.get('totalAllowance').value) {
      this.filterparams.minAllowances = this.totalAllowanceForm.get('totalAllowance').value[0];
      this.filterparams.maxAllowances = this.totalAllowanceForm.get('totalAllowance').value[1];
    } else {
      this.filterparams.maxAllowances = null;
      this.filterparams.minAllowances = null;
    }
    if (this.newAllowanceForm.get('newAllowance').value) {
      this.filterparams.minNewAllowances = this.newAllowanceForm.get('newAllowance').value[0];
      this.filterparams.maxNewAllowances = this.newAllowanceForm.get('newAllowance').value[1];
    } else {
      this.filterparams.maxNewAllowances = null;
      this.filterparams.minNewAllowances = null;
    }
    this.apply.emit(this.filterparams);
  }
}
