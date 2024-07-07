/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { BilingualText, LovList } from '@gosi-ui/core';
import { InputDaterangeDcComponent, FilterDcComponent } from '@gosi-ui/foundation-theme/src';
import { PaymentHistoryFilter } from '../../models';
import { PaymentLabel } from '../../enum/payment-label';

@Component({
  selector: 'bnt-payment-history-filter-dc',
  templateUrl: './payment-history-filter-dc.component.html',
  styleUrls: ['./payment-history-filter-dc.component.scss']
})
export class PaymentHistoryFilterDcComponent implements OnInit, OnChanges {
  /**
   * Referring datepicker and filter button
   */
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  @ViewChild('filterbutton') filterbutton: FilterDcComponent;

  @Input() paymentEventsList: LovList;
  @Input() paymentStatusList: LovList;

  // output varaiables
  @Output() paymentFilterEvent: EventEmitter<PaymentHistoryFilter> = new EventEmitter();

  paymentPeriodForm = new FormControl();
  eventFilterForm: FormGroup;
  paymentHistoryFilter: PaymentHistoryFilter = new PaymentHistoryFilter();
  paymentEventValues: BilingualText[];
  paymentEvents: Array<BilingualText> = [];
  paymentStatus: Array<BilingualText> = [];
  selectedPeriodDate: Array<Date>;
  selectedStatusOptions: Array<BilingualText>;
  selectedEventOptions: Array<BilingualText>;
  statusFilterForm: FormGroup;
  statusValues: BilingualText[];
  maxdate: Date;
  lang = 'en';
  showStatus = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.maxdate = new Date();
    if (!this.statusFilterForm) {
      this.statusFilterForm = this.fb.group({
        items: new FormArray([])
      });
    }
    if (!this.eventFilterForm) {
      this.eventFilterForm = this.fb.group({
        items: new FormArray([])
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.paymentEventsList && changes.paymentEventsList.currentValue) {
      this.eventFilterForm = this.fb.group({
        items: new FormArray([])
      });
      this.paymentEventsList.items.forEach(data => {
        if (data) {
          const control = new FormControl(false);
          (this.eventFilterForm.controls.items as FormArray).push(control);
          this.paymentEvents.push(data.value);
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
  }
  /**
   * This method is to filter the list based on the multi filters
   */
  applyFilter(): void {
    if (this.paymentPeriodForm.value && this.paymentPeriodForm.value.length >= 1) {
      this.selectedPeriodDate = this.paymentPeriodForm.value;
    } else {
      this.selectedPeriodDate = null;
    }
    if (this.selectedEventOptions && this.selectedEventOptions.length >= 1) {
      this.paymentEventValues = this.selectedEventOptions;
    } else {
      this.paymentEventValues = null;
    }
    if (this.selectedStatusOptions && this.selectedStatusOptions.length >= 1) {
      this.statusValues = this.selectedStatusOptions;
    } else {
      this.statusValues = null;
    }
    if (this.selectedPeriodDate) {
      this.paymentHistoryFilter.benefitPeriodFrom = this.selectedPeriodDate[0];
      this.paymentHistoryFilter.benefitPeriodTo = this.selectedPeriodDate[1];
    }
    this.paymentHistoryFilter.paymentEvents = this.paymentEventValues;
    this.paymentHistoryFilter.paymentStatus = this.statusValues;
    this.paymentFilterEvent.emit(this.paymentHistoryFilter);
  }

  /** Method to clear the filters */
  clearAllFiters(): void {
    this.selectedEventOptions = null;
    this.selectedStatusOptions = null;
    this.paymentPeriodForm.reset();
    this.eventFilterForm.reset();
    this.statusFilterForm.reset();
    this.defaultFilter();
    this.paymentFilterEvent.emit(this.paymentHistoryFilter);
  }

  /**
   * This method is to set the default filter values
   */
  defaultFilter() {
    this.paymentHistoryFilter.benefitPeriodFrom = undefined;
    this.paymentHistoryFilter.benefitPeriodTo = undefined;
    this.paymentHistoryFilter.paymentStatus = [];
    this.paymentHistoryFilter.paymentEvents = [];
  }

  paymentEventChecked($event) {
    this.selectedEventOptions = $event;
    this.showStatus = this.selectedEventOptions.find(val => val.english === PaymentLabel.PAYMENTS) ? true : false;
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
