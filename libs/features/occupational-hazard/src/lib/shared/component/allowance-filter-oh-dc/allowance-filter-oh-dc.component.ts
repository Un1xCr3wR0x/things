/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
  } from '@angular/core';
  import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
  import { BilingualText, LovList } from '@gosi-ui/core';
  import { InputMultiCheckboxDcComponent } from '@gosi-ui/foundation-theme/src';
  import { AllowanceType } from '../../enums/allowance-type';
  import { AllowanceFilterParams } from '../../models';
  import { AuditAllowance } from '../../models/audit-allowance';
  import { AllowanceAuditSummaryOh } from '../../models/allowance-audit-summary-oh';
  
  @Component({
    selector: 'oh-allowance-filter-oh-dc',
    templateUrl: './allowance-filter-oh-dc.component.html',
    styleUrls: ['./allowance-filter-oh-dc.component.scss']
  })
  export class AllowanceFilterOhDcComponent implements OnInit, OnChanges {
    //Local Variables
    allowanceTypeFilterForm: FormGroup;
    selectedAllowanceType: Array<BilingualText>;
    allowanceTypeList: BilingualText[] = [];
    noOfDaysForm: FormGroup;
    noOfVisitsForm: FormGroup;
    daysMinValue: number;
    daysMaxValue: number;
    noOfVisitsMinValue: number;
    noOfVisitsMaxValue: number;
    isConveyanceAllowance = false;
    allowanceHasNoOfDays = false;
    filterparams: AllowanceFilterParams = new AllowanceFilterParams();
    resetDaysMin: number;
    resetDaysMax: number;
    resetVisitsMin: number;
    resetVisitsMax: number;
    allowancesWithDays = [AllowanceType.DAILY_ALLOWANCE, AllowanceType.COMP_ALLOWANCE];
    //Input Variables
    @Input() allowanceDetails: AllowanceAuditSummaryOh = new AllowanceAuditSummaryOh();
    @Input() allowanceLovList: LovList;
  
    @Input() minDaysValue: number;
    @Input() maxDaysValue: number;
    @Input() minVisitsValue: number;
    @Input() maxVisitsValue: number;
  
    //Output Variables
    @Output() reset = new EventEmitter();
    @Output() applyAllowanceFilter: EventEmitter<AllowanceFilterParams> = new EventEmitter();
  
    //Child components
    @ViewChild('allowanceType') allowanceTypeComp: InputMultiCheckboxDcComponent;
    isSelected: boolean;
  
    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}
  
    ngOnInit(): void {
      this.noOfDaysForm = this.createNoOfDaysForm();
  
      // this.noOfVisitsForm = this.createNoOfVisitsForm();
      this.allowanceTypeFilterForm = this.fb.group({
        items: new FormArray([])
      });
      this.isConveyanceAllowance = false;
      this.allowanceTypeList.forEach(() => {
        const control = new FormControl(false);
        (this.allowanceTypeFilterForm.controls.items as FormArray).push(control);
      });
  
      this.resetDaysMin = this.minDaysValue;
      this.resetDaysMax = this.maxDaysValue;
      // this.resetVisitsMin = this.minVisitsValue;
      // this.resetVisitsMax = this.maxVisitsValue;
      this.cdr.detectChanges();
    }
  
    ngOnChanges(changes: SimpleChanges) {
      if (changes && changes.allowanceLovList && changes.allowanceLovList.currentValue) {
        this.allowanceLovList = changes.allowanceLovList.currentValue;
        if (this.allowanceLovList) {
          this.allowanceLovList.items.forEach(items => {
            if (items) {
              this.allowanceTypeList.push(items.value);
            }
          });
        }
      }
  
      if (changes && changes.minDaysValue) {
        this.minDaysValue = changes.minDaysValue.currentValue;
        this.minDaysValue = Math.floor(this.minDaysValue);
      }
      if (changes && changes.maxDaysValue) {
        this.maxDaysValue = changes.maxDaysValue.currentValue;
        this.maxDaysValue = Math.ceil(this.maxDaysValue);
      }
      if (changes && changes.minVisitsValue) {
        this.minVisitsValue = changes.minVisitsValue.currentValue;
        this.minVisitsValue = Math.floor(this.minVisitsValue);
      }
      if (changes && changes.maxVisitsValue) {
        this.maxVisitsValue = changes.maxVisitsValue.currentValue;
        this.maxVisitsValue = Math.ceil(this.maxVisitsValue);
      }
    }
    /**
     * Create total allowance form
     */
    createNoOfDaysForm() {
      return this.fb.group({
        noOfDays: new FormControl([this.minDaysValue, this.maxDaysValue])
      });
    }
  
    /**
     * Create new allowance form
     */
    createNoOfVisitsForm() {
      return this.fb.group({
        noOfVisits: new FormControl([this.minVisitsValue, this.maxVisitsValue])
      });
    }
  
    /**
     * Functionality on scrolling
     */
    onScroll() {}
  
    clearAllFiters() {
      this.noOfDaysForm.reset();
      this.noOfDaysForm.get('noOfDays').setValue([this.resetDaysMin, this.resetDaysMax]);
      // this.noOfVisitsForm.reset();
      // this.noOfVisitsForm.get('noOfVisits').setValue([this.resetVisitsMin, this.resetVisitsMax]);
      this.allowanceTypeFilterForm.reset();
      this.applyAllowanceFilter.emit(null);
      this.allowanceHasNoOfDays = false;
      this.isConveyanceAllowance = false;
    }
    /**
     * Apply Filter
     */
    applyFilter() {
      this.filterparams.claimType = [];
      if (this.selectedAllowanceType && this.selectedAllowanceType.length >= 1) {
        const allowanceList: string[] = [];
        this.selectedAllowanceType.forEach(value => allowanceList.push(value.english));
        this.filterparams.claimType = allowanceList;
      }
      if (this.noOfDaysForm.get('noOfDays').value) {
        this.filterparams.noOfDaysMin = this.noOfDaysForm.get('noOfDays').value[0];
        this.filterparams.noOfDaysMax = this.noOfDaysForm.get('noOfDays').value[1];
      } else {
        this.filterparams.noOfDaysMax = null;
        this.filterparams.noOfDaysMin = null;
      }
      // if (this.noOfVisitsForm.get('noOfVisits').valueChanges.subscribe()) {
      //   this.filterparams.visitsMin = this.noOfVisitsForm.get('noOfVisits').value[0];
      //   this.filterparams.visitsMax = this.noOfVisitsForm.get('noOfVisits').value[1];
  
      // } else {
      //   this.filterparams.visitsMax = null;
      //   this.filterparams.visitsMin = null;
      // }
      // if (this.noOfVisitsForm.get('noOfVisits').value) {
      //   this.filterparams.visitsMin = this.noOfVisitsForm.get('noOfVisits').value[0];
      //   this.filterparams.visitsMax = this.noOfVisitsForm.get('noOfVisits').value[1];
      // } else {
      //   this.filterparams.visitsMax = null;
      //   this.filterparams.visitsMin = null;
      // }
      // if (!this.isSelected) {
      //   this.filterparams.visitsMax = null;
      //   this.filterparams.visitsMin = null;
      // }
      this.isSelected = false;
      this.applyAllowanceFilter.emit(this.filterparams);
    }
  
    selectedAllowance(type) {
      this.selectedAllowanceType = type;
      const arr = [];
      this.selectedAllowanceType.forEach(item => {
        arr.push(item.english);
      });
      this.isConveyanceAllowance = arr.includes(AllowanceType.CONV_ALLOWANCE);
      this.allowanceHasNoOfDays = arr.find(item => this.allowancesWithDays.includes(item)) ? true : false;
    }
    setVisits() {
      this.isSelected = true;
    }
  }
  