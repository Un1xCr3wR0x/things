/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  OnChanges,
  HostListener
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BilingualText, LovList } from '@gosi-ui/core';
import moment from 'moment';
import { TransactionsDetails } from '../../shared/models/transaction-history-details';
import { TransactionHistoryFilter } from '../../shared/models/transaction-history-filter';
import { FilterDcComponent, InputDaterangeDcComponent } from '@gosi-ui/foundation-theme/src';

@Component({
  selector: 'bnt-transaction-history-dc',
  templateUrl: './transaction-history-dc.component.html',
  styleUrls: ['./transaction-history-dc.component.scss']
})
export class TransactionHistoryDcComponent implements OnInit, OnChanges {
  @Input() transactions: TransactionsDetails;
  @Input() ifTransactionHistory: boolean;
  @Input() noFilterResult: boolean;
  @Input() noSearchResult: boolean;
  @Input() transactionStatusList: LovList;
  /**
   * Output
   */
  @Output() onSearchTransactionId: EventEmitter<TransactionHistoryFilter> = new EventEmitter();
  @Output() transactionFilterEvent: EventEmitter<TransactionHistoryFilter> = new EventEmitter();
  @Output() goToTransaction: EventEmitter<TransactionsDetails> = new EventEmitter();

  /**
   * Referring datepicker and filter button
   */
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  @ViewChild('transactionFilterButton') transactionFilterButton: FilterDcComponent;

  transactionPeriodForm = new FormControl();
  statusFilterForm: FormGroup;
  selectedStatusOptions: Array<BilingualText>;
  maxDate: Date;
  InitiatedDateForm: FormGroup;
  transactionHistoryFilter: TransactionHistoryFilter = new TransactionHistoryFilter();
  selectedDate: Array<Date>;
  statusValues: BilingualText[];
  statusEvents: Array<BilingualText> = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.maxDate = moment(new Date()).toDate();
    this.statusFilterForm = this.fb.group({
      items: new FormArray([])
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.transactionStatusList && changes.transactionStatusList.currentValue) {
      this.statusFilterForm = this.fb.group({
        items: new FormArray([])
      });
      this.transactionStatusList.items.forEach(data => {
        if (data) {
          const control = new FormControl(false);
          (this.statusFilterForm.controls.items as FormArray).push(control);
          this.statusEvents.push(data.value);
        }
      });
    }
  }
  onSearchId(benefitId: string) {
    this.transactionHistoryFilter.transactionId = parseInt(benefitId, null);
    this.onSearchTransactionId.emit(this.transactionHistoryFilter);
  }

  clearAllFiters(): void {
    this.selectedStatusOptions = null;
    this.transactionPeriodForm.reset();
    this.statusFilterForm.reset();
    this.defaultFilter();
    this.transactionFilterEvent.emit(this.transactionHistoryFilter);
  }

  onScroll() {
    if (this.dateRangePicker?.dateRangePicker.isOpen) this.dateRangePicker.dateRangePicker.hide();
  }

  defaultFilter() {
    this.transactionHistoryFilter.benefitPeriodFrom = undefined;
    this.transactionHistoryFilter.benefitPeriodTo = undefined;
    this.transactionHistoryFilter.status = [];
  }
  applyFilter() {
    if (this.transactionPeriodForm.value && this.transactionPeriodForm.value.length >= 1) {
      this.selectedDate = this.transactionPeriodForm.value;
    } else {
      this.selectedDate = null;
    }
    if (this.selectedStatusOptions && this.selectedStatusOptions.length >= 1) {
      this.statusValues = this.selectedStatusOptions;
    } else {
      this.statusValues = null;
    }
    if (this.selectedDate) {
      this.transactionHistoryFilter.benefitPeriodFrom = this.selectedDate[0];
      this.transactionHistoryFilter.benefitPeriodTo = this.selectedDate[1];
    }
    this.transactionHistoryFilter.status = this.statusValues;
    this.transactionFilterEvent.emit(this.transactionHistoryFilter);
  }

  goToTransactionDetails(transaction: TransactionsDetails) {
    this.goToTransaction.emit(transaction);
  }
  @HostListener('window:mousedown', ['$event'])
  onMouseUp(event): void {
    if (
      this.transactionFilterButton.isOpen &&
      (this.transactionFilterButton.filterContent.nativeElement.contains(event.target) ||
        (this.dateRangePicker?.dateRangePicker.isOpen &&
          !this.transactionFilterButton.filterContent.nativeElement.contains(event.target)))
    ) {
      this.transactionFilterButton.onShown();
    } else if (this.transactionFilterButton.filterBtnRef.nativeElement.contains(event.target)) {
      if (!this.transactionFilterButton.isOpen) {
        this.transactionFilterButton.onHidden();
      } else {
        this.transactionFilterButton.onShown();
      }
    } else {
      this.transactionFilterButton.onHidden();
    }
  }
}
