/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeEnum, ApplicationTypeToken, BilingualText, convertToYYYYMMDD, LovList } from '@gosi-ui/core';
import { InputDaterangeDcComponent, InputMultiCheckboxDcComponent } from '@gosi-ui/foundation-theme';
import * as moment from 'moment';
import { ClaimDetailsFilterParams } from '../../shared';
import { ClaimsWrapper } from '../../shared/models/claims-details';

@Component({
  selector: 'oh-claims-details-filter-dc',
  templateUrl: './claims-details-filter-dc.component.html',
  styleUrls: ['./claims-details-filter-dc.component.scss']
})
export class ClaimsDetailsFilterDcComponent implements OnInit, OnChanges, AfterViewChecked {
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}
  amountForm: FormGroup;
  setValues = false;
  setRange = false;
  type = '';
  treatmentPeriodForm = new FormControl();
  selectedTypeOptions: Array<BilingualText>;
  selectedStatusOptions: Array<BilingualText>;
  selectedPayeeOptions: Array<BilingualText>;
  filterparam: ClaimDetailsFilterParams = new ClaimDetailsFilterParams();
  maxDate: Date;
  minDate: Date;
  setMinDate = false;
  invoiceId = 0;
  claimNo = 0;
  amount = 0;
  claims: ClaimsWrapper = new ClaimsWrapper();
  minValue = 0;
  maxValue = 0;
  isMinValue = false;
  value = 0;
  isAppPrivate = false;
  claimTypeList: BilingualText[] = [];
  claimPayeeList: BilingualText[] = [];
  statusList: BilingualText[] = [];
  statusFilterForm: FormGroup;
  payeeFilterForm: FormGroup;
  typeFilterform: FormGroup;
  setType = false;
  setPayee = false;
  setStatus = false;
  @Input() claimsWrapper: ClaimsWrapper = new ClaimsWrapper();
  @Input() claimTypes: LovList;
  @Input() claimPayees: LovList;
  @Input() status: LovList;
  @Output() filterValues: EventEmitter<ClaimDetailsFilterParams> = new EventEmitter();
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  @ViewChild('claimType') claimType: InputMultiCheckboxDcComponent;
  @ViewChild('claimPayee') claimPayee: InputMultiCheckboxDcComponent;
  @ViewChild('claimStatus') claimStatus: InputMultiCheckboxDcComponent;
  ngOnInit() {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isAppPrivate = true;
    } else {
      this.isAppPrivate = false;
    }
    this.amountForm = this.createamountForm();
    this.statusFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.typeFilterform = this.fb.group({
      items: new FormArray([])
    });
    this.payeeFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.status?.items?.forEach(() => {
      const control = new FormControl(false);
      (this.statusFilterForm.controls.items as FormArray).push(control);
    });
    this.claimTypes?.items?.forEach(() => {
      const control = new FormControl(false);
      (this.typeFilterform.controls.items as FormArray).push(control);
    });
    this.claimPayees?.items?.forEach(() => {
      const control = new FormControl(false);
      (this.payeeFilterForm.controls.items as FormArray).push(control);
    });
  }
  /**
   *
   * @param changes Capturing changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.claimsWrapper) {
      this.claimsWrapper = changes.claimsWrapper.currentValue;
      if (this.appToken === ApplicationTypeEnum.PRIVATE) {
        this.isAppPrivate = true;
      } else {
        this.isAppPrivate = false;
      }
      if (!this.isAppPrivate && this.claimsWrapper?.claims) {
        this.claimsWrapper.claims = this.claimsWrapper?.claims?.filter(
          item => item.payeeDetails?.payableTo.english === 'Establishment' || (item.initiatedByEst && item.reImbId)
        );
      }
      if (!this.setValues) {
        this.claimsWrapper?.claims?.forEach((element, index) => {
          if (element?.claimType && element?.expenses[0]) {
            if (element.expenses[0].amount && !this.setValues) {
              this.minValue = element.expenses[0].amount;
              this.maxValue = element.expenses[0].amount;
              this.maxDate = element.expenses[0].endDate.gregorian;
              this.minDate = element.expenses[0].startDate.gregorian;
              this.setValues = true;
            }
          }
        });
      }
      this.ngAfterViewChecked();
    }
    if (changes && changes.status) {
      this.status = changes.status.currentValue;
    }
    if (changes && changes.claimPayees) {
      this.claimPayees = changes.claimPayees.currentValue;
    }
    if (changes && changes.claimTypes) {
      this.claimTypes = changes.claimTypes.currentValue;
    }
    this.cdr.detectChanges();
  }
  /**
   * Create claim amount form
   */
  createamountForm() {
    return this.fb.group({
      amount: new FormControl([this.minValue, this.maxValue])
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
    this.filterparam.claimPayee = [];
    this.filterparam.claimType = [];
    this.filterparam.claimStatus = [];
    if (this.amountForm.get('amount').value) {
      this.filterparam.minAmount = this.amountForm.get('amount').value[0];
      this.filterparam.maxAmount = this.amountForm.get('amount').value[1];
    } else {
      this.filterparam.maxAmount = null;
      this.filterparam.minAmount = null;
    }
    this.claimsWrapper.claims.forEach(item => {
      if (
        item.claimId === 0 &&
        item.reImbId &&
        this.filterparam.minAmount === this.minValue &&
        this.filterparam.maxAmount === this.maxValue
      ) {
        this.filterparam.minAmount = null;
        this.filterparam.maxAmount = null;
      }
    });

    if (this.treatmentPeriodForm.value) {
      this.filterparam.startDate = convertToYYYYMMDD(this.treatmentPeriodForm.value[0]);
      this.filterparam.endDate = convertToYYYYMMDD(this.treatmentPeriodForm.value[1]);
    } else {
      this.filterparam.startDate = null;
      this.filterparam.endDate = null;
    }
    if (this.selectedPayeeOptions && this.selectedPayeeOptions.length >= 1) {
      this.selectedPayeeOptions.forEach(element => {
        this.filterparam.claimPayee.push(element.english);
      });
    }
    if (this.selectedStatusOptions && this.selectedStatusOptions.length >= 1) {
      this.selectedStatusOptions.forEach(element => {
        this.filterparam.claimStatus.push(element.english);
      });
    }
    if (this.selectedTypeOptions && this.selectedTypeOptions.length >= 1) {
      this.selectedTypeOptions.forEach(element => {
        this.filterparam.claimType.push(element.english);
      });
    }
    this.filterValues.emit(this.filterparam);
  }

  /**
   * Clear all filters
   */
  clearAllFiters() {
    this.amountForm.reset();
    this.amountForm.get('amount').setValue([this.minValue, this.maxValue]);
    this.treatmentPeriodForm.reset();
    this.payeeFilterForm.reset();
    this.statusFilterForm.reset();
    this.typeFilterform.reset();
    this.filterValues.emit(null);
  }
  /**
   * Finding minimum and maximum date
   */
  ngAfterViewChecked() {
    if (this.claimsWrapper?.claims?.length > 0 && !this.setMinDate) {
      this.claimsWrapper?.claims?.forEach(element => {
        if (element?.expenses && element?.expenses[0]?.startDate?.gregorian) {
          if (this.minDate > moment(element.expenses[0].startDate.gregorian).toDate()) {
            this.minDate = moment(element.expenses[0].startDate.gregorian).toDate();
          }
        }
        if (element?.expenses && element?.expenses[0]?.endDate?.gregorian) {
          if (this.maxDate < moment(element.expenses[0].endDate.gregorian).toDate()) {
            this.maxDate = moment(element.expenses[0].endDate.gregorian).toDate();
          }
        }
        this.maxDate = moment(this.maxDate).toDate();
        this.minDate = moment(this.minDate).toDate();
      });
      this.setMinDate = true;
      this.cdr.detectChanges();
    }
    if (this.claimsWrapper && this.claimsWrapper.claims && !this.isMinValue) {
      this.claimsWrapper?.claims?.forEach(element => {
        if (
          element?.expenses &&
          element.invoiceId === this.invoiceId &&
          element.claimNo === this.claimNo &&
          this.type === element?.claimType?.english
        ) {
          this.value = this.amount;
        } else {
          this.value = 0;
        }
        if (element?.claimType && element?.expenses && element?.expenses[0]) {
          element?.expenses?.forEach(item => {
            this.value = item.amount + this.value;
            this.amount = this.value;
          });
          this.invoiceId = element.invoiceId;
          this.claimNo = element.claimNo;
          if (element?.claimType?.english) {
            this.type = element.claimType.english;
          }
        }
        if (this.minValue > this.value) {
          this.minValue = this.value;
        }
        if (this.maxValue < this.value) {
          this.maxValue = this.value;
        }
        this.isMinValue = true;
      });
      if (this.amountForm?.get('amount')) {
        this.maxValue = Math.ceil(this.maxValue);
        this.minValue = Math.floor(this.minValue);
        if (this.maxValue === this.minValue) {
          this.minValue = 0;
        }
        this.amountForm.get('amount').setValue([this.minValue, this.maxValue]);
      }
      this.cdr.detectChanges();
    }
    if (!this.setStatus) {
      this.status?.items?.forEach(items => {
        if (items) {
          this.statusList.push(items.value);
          this.setStatus = true;
        }
      });
    }
    if (!this.setPayee) {
      this.claimPayees?.items?.forEach(items => {
        if (items) {
          this.claimPayeeList.push(items.value);
          this.setPayee = true;
        }
      });
    }
    if (!this.setType) {
      this.claimTypes?.items?.forEach(items => {
        if (items) {
          this.claimTypeList.push(items.value);
          this.setType = true;
        }
      });
    }
    this.cdr.detectChanges();
  }
}
