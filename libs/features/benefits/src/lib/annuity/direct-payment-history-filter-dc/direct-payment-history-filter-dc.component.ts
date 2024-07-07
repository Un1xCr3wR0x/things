import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { BilingualText, FilterKeyEnum, FilterKeyValue, LovList } from '@gosi-ui/core';
import { FilterDcComponent, InputDaterangeDcComponent } from '@gosi-ui/foundation-theme';
import { DirectPaymentHistory, DirectPaymentHistoryFilter } from '../../shared';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { isObject } from 'ngx-bootstrap/chronos/utils/type-checks';

@Component({
  selector: 'bnt-direct-payment-history-filter-dc',
  templateUrl: './direct-payment-history-filter-dc.component.html',
  styleUrls: ['./direct-payment-history-filter-dc.component.scss']
})
export class DirectPaymentHistoryFilterDcComponent implements OnInit {
  /**
   * Referring datepicker and filter button
   */
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  @ViewChild('filterbutton') filterbutton: FilterDcComponent;

  @Input() paymentTypesList: LovList;
  @Input() paymentStatusList: LovList;
  @Input() benefitTypeList: LovList;
  @Input() clearHistoryFilter: DirectPaymentHistoryFilter = new DirectPaymentHistoryFilter();
  @Input() hasFiltered: Boolean;
  @Input() directPaymentHistory: any;
  // output varaiables
  @Output() paymentFilterEvent: EventEmitter<DirectPaymentHistoryFilter> = new EventEmitter();
  @Output() apply: EventEmitter<Array<FilterKeyValue>> = new EventEmitter();

  paymentPeriodForm = new FormControl();
  paymentTypeForm: FormGroup;
  paymentHistoryFilter: DirectPaymentHistoryFilter = new DirectPaymentHistoryFilter();
  hasFilter = false;

  paymentTypes: Array<BilingualText> = [];
  paymentStatus: Array<BilingualText> = [];
  benefitTypes: Array<BilingualText> = [];

  selectedPeriodDate: Array<string>;
  selectedPaymentTypeOptions: Array<BilingualText>;
  selectedStatusOptions: Array<BilingualText>;
  selectedBenefitTypeOptions: Array<BilingualText>;

  paymentTypeValues: BilingualText[];
  statusFilterForm: FormGroup;
  benefitTypeForm: FormGroup;
  statusValues: BilingualText[];
  paymentValues: BilingualText[];
  benfittypsValues: BilingualText[];
  maxdate: Date;
  isShowBenefits: boolean = false;
  lang = 'en';
  // benefitTypeList: LovList;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.maxdate = new Date();
    if (!this.statusFilterForm) {
      this.statusFilterForm = this.fb.group({
        items: new FormArray([])
      });
    }
    if (!this.paymentTypeForm) {
      this.paymentTypeForm = this.fb.group({
        items: new FormArray([])
      });
    }
    if (!this.benefitTypeForm) {
      this.benefitTypeForm = this.fb.group({
        items: new FormArray([])
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.paymentTypesList && changes.paymentTypesList.currentValue) {
      this.paymentTypeForm = this.fb.group({
        items: new FormArray([])
      });
      this.paymentTypesList.items.forEach(data => {
        if (data) {
          const control = new FormControl(false);
          (this.paymentTypeForm.controls.items as FormArray).push(control);
          this.paymentTypes.push(data.value);
        }
      });
    }
    if (changes && changes.paymentStatusList && changes.paymentStatusList.currentValue) {
      this.statusFilterForm = this.fb.group({
        items: new FormArray([])
      });
      this.paymentStatusList.items.forEach(data => {
        if (data) {
          const control = new FormControl(false);
          (this.statusFilterForm.controls.items as FormArray).push(control);
          this.paymentStatus.push(data.value);
        }
      });
    }
    if (changes && changes.benefitTypeList && changes.benefitTypeList.currentValue) {
      this.benefitTypeForm = this.fb.group({
        items: new FormArray([])
      });
      this.benefitTypeList.items.forEach(data => {
        if (data) {
          const control = new FormControl(false);
          (this.benefitTypeForm.controls.items as FormArray).push(control);
          this.benefitTypes.push(data.value);
        }
      });
    }
    if (changes && changes.hasFiltered) {
      this.hasFilter = this.hasFiltered ? true : false;
      this.hasFiltered = undefined;
    }
    if (changes && changes?.clearHistoryFilter && changes?.clearHistoryFilter?.currentValue) {
      this.filterbutton?.onHidden();
      this.setFilterHistory();
      this.clearFilterForm();
      this.setFilterFormValues();
    }
    // if(changes.directPaymentHistory){
    //   this.setFilterValues()
    // }
  }
  //   setFilterValues(){
  // this.directPaymentHistory.forEach((obj,index) => {
  //   this.benefitTypeList.items.push({sequence:index,value:obj.history[0].benefitType})
  //   console.log(this.benefitTypeList)
  // });
  //   }
  getPaymentType(event) {
    if (event.length) {
      for (let obj in event) {
        if (event[obj].english == 'Benefit') {
          this.isShowBenefits = true;
          break;
        } else {
          this.isShowBenefits = false;
        }
      }
    } else {
      this.isShowBenefits = false;
    }
    this.selectedPaymentTypeOptions = event;
  }
  /**
   * This method is to filter the list based on the multi filters
   */
  applyFilter(): void {
    const appliedFilters: Array<FilterKeyValue> = [];
    if (this.paymentPeriodForm.value && this.paymentPeriodForm.value.length >= 1) {
      this.selectedPeriodDate = this.paymentPeriodForm.value;
      appliedFilters.push({
        key: FilterKeyEnum.PERIOD,
        values: [this.paymentPeriodForm.value[0], this.paymentPeriodForm.value[1]]
      });
    } else {
      this.selectedPeriodDate = null;
    }
    if (this.selectedPaymentTypeOptions && this.selectedPaymentTypeOptions.length >= 1) {
      this.paymentValues = this.selectedPaymentTypeOptions;
      appliedFilters.push({ key: FilterKeyEnum.PAYEE_TYPE, bilingualValues: this.selectedPaymentTypeOptions });
    } else {
      this.paymentValues = null;
    }
    if (this.selectedStatusOptions && this.selectedStatusOptions.length >= 1) {
      this.statusValues = this.selectedStatusOptions;
      appliedFilters.push({ key: FilterKeyEnum.PAYMENT_STATUS, bilingualValues: this.selectedStatusOptions });
    } else {
      this.statusValues = null;
    }
    if (this.selectedBenefitTypeOptions && this.selectedBenefitTypeOptions.length >= 1) {
      this.benfittypsValues = this.selectedBenefitTypeOptions;
      appliedFilters.push({ key: FilterKeyEnum.BENEFITE_TYPE, bilingualValues: this.selectedBenefitTypeOptions });
    } else {
      this.benfittypsValues = null;
    }
    if (this.selectedPeriodDate) {
      this.paymentHistoryFilter.paymentPeriodFrom = this.selectedPeriodDate[0];
      this.paymentHistoryFilter.paymentPeriodTo = this.selectedPeriodDate[1];
    }
    this.paymentHistoryFilter.paymentType = this.paymentValues;
    this.paymentHistoryFilter.paymentStatus = this.statusValues;
    this.paymentHistoryFilter.BenefitType = this.benfittypsValues;
    this.filterbutton?.onHidden();
    this.paymentFilterEvent.emit(this.paymentHistoryFilter);
    this.apply.emit(appliedFilters);
  }

  /** Method to clear the filters */
  clearAllFiters(): void {
    // const appliedFilters: Array<FilterKeyValue> = [];
    this.selectedPaymentTypeOptions = null;
    this.selectedStatusOptions = null;
    this.selectedBenefitTypeOptions = null;
    this.paymentPeriodForm?.reset();
    this.paymentTypeForm?.reset();
    this.statusFilterForm?.reset();
    this.benefitTypeForm?.reset();
    //this.filterbutton.onHidden();
    this.defaultFilter();
    // this.paymentFilterEvent.emit(this.paymentHistoryFilter);
    // this.apply.emit(appliedFilters);
  }

  /**
   * This method is to set the default filter values
   */
  defaultFilter() {
    this.paymentHistoryFilter.paymentPeriodFrom = undefined;
    this.paymentHistoryFilter.paymentPeriodTo = undefined;
    this.paymentHistoryFilter.paymentStatus = [];
    this.paymentHistoryFilter.paymentType = [];
    this.paymentHistoryFilter.BenefitType = [];
    this.paymentFilterEvent.emit(this.paymentHistoryFilter);
  }

  /**
   * Method to set Filter Form values
   */
  setFilterFormValues() {
    this.setStatusFilterFormValues();
    this.setBenefitTypeFilterFormValues();
    this.setPaymentTypeFilterFormValues();
    //this.applyFilter();
  }
  clearFilterForm() {
    if (!this.clearHistoryFilter.paymentPeriodFrom) this.paymentPeriodForm?.reset();
    this.paymentTypeForm?.reset();
    this.statusFilterForm?.reset();
    this.benefitTypeForm?.reset();
  }
  setStatusFilterFormValues() {
    (this.statusFilterForm.controls.items as FormArray).clear();
    this.paymentStatusList.items.forEach(value => {
      let control = new FormControl();
      if (this.selectedStatusOptions.length > 0) {
        this.selectedStatusOptions?.forEach(items => {
          if (items.english === value?.value?.english) {
            control = new FormControl(true);
          }
        });
      } else {
        control = new FormControl();
      }
      (this.statusFilterForm.controls.items as FormArray).push(control);
    });
  }
  setPaymentTypeFilterFormValues() {
    (this.paymentTypeForm.controls.items as FormArray).clear();
    this.paymentTypesList.items.forEach(value => {
      let control = new FormControl();
      if (this.selectedPaymentTypeOptions.length > 0) {
        this.selectedPaymentTypeOptions?.forEach(items => {
          if (items.english === value?.value?.english) {
            control = new FormControl(true);
          }
        });
      } else {
        control = new FormControl();
      }
      (this.paymentTypeForm.controls.items as FormArray).push(control);
    });
  }
  setBenefitTypeFilterFormValues() {
    (this.benefitTypeForm.controls.items as FormArray).clear();
    this.benefitTypeList.items.forEach(value => {
      let control = new FormControl();
      if (this.selectedBenefitTypeOptions.length > 0) {
        this.selectedBenefitTypeOptions?.forEach(items => {
          if (items.english === value?.value?.english) {
            control = new FormControl(true);
          }
        });
      } else {
        control = new FormControl();
      }
      (this.benefitTypeForm.controls.items as FormArray).push(control);
    });
  }
  setFilterHistory() {
    this.selectedBenefitTypeOptions = this.clearHistoryFilter.BenefitType;
    this.selectedStatusOptions = this.clearHistoryFilter.paymentStatus;
    this.selectedPaymentTypeOptions = this.clearHistoryFilter.paymentType;
  }

  /**
   * Method to hide datepicker while scrolling
   */
  onScroll() {
    if (this.dateRangePicker?.dateRangePicker.isOpen) this.dateRangePicker.dateRangePicker.hide();
  }

  @HostListener('window:mousedown', ['$event'])
  onMouseUp(event): void {
    if (
      this.filterbutton.isOpen &&
      (this.filterbutton.filterContent.nativeElement.contains(event.target) ||
        (this.dateRangePicker?.dateRangePicker.isOpen &&
          !this.filterbutton.filterContent.nativeElement.contains(event.target)))
    ) {
      this.filterbutton.onShown();
    } else if (this.filterbutton.filterBtnRef.nativeElement.contains(event.target)) {
      if (!this.filterbutton.isOpen) {
        this.filterbutton.onHidden();
      } else {
        this.filterbutton.onShown();
      }
    } else {
      this.filterbutton.onHidden();
    }
  }
}
