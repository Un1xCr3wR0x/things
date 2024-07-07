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
  ViewChild,
  AfterViewChecked
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BilingualText, convertToYYYYMMDD } from '@gosi-ui/core';
import { InputDaterangeDcComponent, InputMultiCheckboxDcComponent } from '@gosi-ui/foundation-theme';
import { ClaimFilterParams } from '../../models/claim-filter-params';
import { InvoiceDetails } from '../../models/invoice-details';
import * as moment from 'moment';

@Component({
  selector: 'oh-claims-filter-dc',
  templateUrl: './claims-filter-dc.component.html',
  styleUrls: ['./claims-filter-dc.component.scss']
})
export class ClaimsFilterDcComponent implements OnInit, OnChanges, AfterViewChecked {
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}
  amountForm: FormGroup;
  treatmentPeriodForm = new FormControl();
  selectedDaysOptions: Array<BilingualText>;
  treatmentDaysForm: FormGroup;
  treatmentDaysList: BilingualText[] = [];
  @Input() minValue: number;
  @Input() maxValue: number;
  @Input() invoiceDetails: InvoiceDetails;
  maxDate: Date;
  minDate: Date;
  @Output() filterValues: EventEmitter<ClaimFilterParams> = new EventEmitter();
  filterparams: ClaimFilterParams = new ClaimFilterParams();
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  @ViewChild('treatmentDays') treatmentDays: InputMultiCheckboxDcComponent;

  ngOnInit() {
    this.treatmentDaysList.push({
      english: '0-10',
      arabic: '0-10'
    });
    this.treatmentDaysList.push({
      english: '10-20',
      arabic: '10-20'
    });
    this.treatmentDaysList.push({
      english: '20-30',
      arabic: '20-30'
    });
    this.treatmentDaysList.push({
      english: '30+',
      arabic: '30+'
    });
    this.amountForm = this.createamountForm();
    this.treatmentDaysForm = this.fb.group({
      items: new FormArray([])
    });
    this.treatmentDaysList.forEach(() => {
      const control = new FormControl(false);
      (this.treatmentDaysForm.controls.items as FormArray).push(control);
    });
    this.cdr.detectChanges();
  }
  /**
   *
   * @param changes Capturing input on change
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.minValue) {
      this.minValue = changes.minValue.currentValue;
      this.minValue = Math.floor(this.minValue);
    }
    if (changes && changes.maxValue) {
      this.maxValue = changes.maxValue.currentValue;
      this.maxValue = Math.ceil(this.maxValue);
    }
    if (changes && changes.invoiceDetails) {
      this.invoiceDetails = changes.invoiceDetails.currentValue;
    }
  }
  /**
   * Create calim amount form
   */
  createamountForm() {
    return this.fb.group({
      claimAmount: new FormControl([this.minValue, this.maxValue])
    });
  }
  /**
   * Functionality on scrolling
   */
  onScroll() {
    if (this.dateRangePicker.dateRangePicker.isOpen) this.dateRangePicker.dateRangePicker.hide();
  }
  /**
   * Apply Filter
   */
  applyFilter() {
    this.filterparams.treatmentDays = [];
    this.filterparams.isMaxLimitExcluded = false;
    if (this.amountForm.get('claimAmount').value) {
      this.filterparams.minAmount = this.amountForm.get('claimAmount').value[0];
      this.filterparams.maxAmount = this.amountForm.get('claimAmount').value[1];
    } else {
      this.filterparams.maxAmount = null;
      this.filterparams.minAmount = null;
    }
    if (this.treatmentPeriodForm.value) {
      this.filterparams.startDate = convertToYYYYMMDD(this.treatmentPeriodForm.value[0]);
      this.filterparams.endDate = convertToYYYYMMDD(this.treatmentPeriodForm.value[1]);
    } else {
      this.filterparams.startDate = null;
      this.filterparams.endDate = null;
    }
    if (this.selectedDaysOptions && this.selectedDaysOptions.length >= 1) {
      this.selectedDaysOptions.forEach(element => {
        const value = element.english.split('-');
        const lowLimit: number = +value[0];
        const highLimit: number = +value[1];
        for (let i = lowLimit; i <= highLimit; i = i + 1) {
          this.filterparams.treatmentDays.push(i);
        }
        if (element.english.includes('30+')) {
          this.filterparams.isMaxLimitExcluded = true;
        }
      });
      this.filterparams.treatmentDays = this.filterparams.treatmentDays.reduce((acc, val) => {
        if (!acc.find(el => el === val)) {
          acc.push(val);
        }
        return acc;
      }, []);
    }
    this.filterValues.emit(this.filterparams);
  }
  /**
   * Clear all filters
   */
  clearAllFiters() {
    this.amountForm.reset();
    this.amountForm.get('claimAmount').setValue([this.minValue, this.maxValue]);
    this.treatmentPeriodForm.reset();
    this.treatmentDaysForm.reset();
    this.filterValues.emit(null);
  }
  ngAfterViewChecked() {
    if (
      this.invoiceDetails?.cases?.length > 0 &&
      this.invoiceDetails?.cases[0]?.endDate?.gregorian &&
      this.invoiceDetails?.cases[0]?.startDate?.gregorian &&
      !this.maxDate
    ) {
      let maxDate = this.invoiceDetails.cases[0].endDate.gregorian;
      let minDate = this.invoiceDetails.cases[0].startDate.gregorian;
      this.invoiceDetails?.cases?.forEach(element => {
        if (minDate > element.startDate.gregorian) {
          minDate = element.startDate.gregorian;
        }
        if (maxDate < element.endDate.gregorian) {
          maxDate = element.endDate.gregorian;
        }
        this.maxDate = moment(maxDate).toDate();
        this.minDate = moment(minDate).toDate();
      });
    }
    this.cdr.detectChanges();
  }
}
