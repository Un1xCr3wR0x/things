import { Component, Input, SimpleChanges, ViewChild, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { LovList, convertToYYYYMMDD, BilingualText, endOfMonth } from '@gosi-ui/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { BillHistoryFilterParams } from '../../../../shared/models';
import { InputDaterangeDcComponent } from '@gosi-ui/foundation-theme';

@Component({
  selector: 'blg-bill-history-filter-dc',
  templateUrl: './bill-history-filter-dc.component.html',
  styleUrls: ['./bill-history-filter-dc.component.scss']
})
export class BillHistoryFilterDcComponent implements OnInit, OnChanges {
  maxDate: Date;
  amountForm: FormGroup;
  rejectedOHIndicatorForm: FormGroup;
  adjustmentIndicatorForm: FormGroup;
  violationIndicatorForm: FormGroup;
  billDateForm = new FormControl();
  settelementDateForm = new FormControl();
  paymentStatusForm: FormGroup;
  paymentStatus: Array<string>;
  paymentStatusDetails: BilingualText[] = [];
  filterparams: BillHistoryFilterParams = new BillHistoryFilterParams();
  @Input() yesOrNoList: LovList;
  @Input() billPaymentStatus: LovList;
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  @Output() filterValues: EventEmitter<BillHistoryFilterParams> = new EventEmitter();
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.maxDate = new Date();

    this.rejectedOHIndicatorForm = this.createForm();
    this.adjustmentIndicatorForm = this.createForm();
    this.violationIndicatorForm = this.createForm();
    this.paymentStatusForm = this.createForm();
    this.amountForm = this.createAmountForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.yesOrNoList?.currentValue) {
      this.yesOrNoList = changes.yesOrNoList.currentValue;
    }
  }
  createAmountForm() {
    return this.fb.group({
      billAmount: new FormControl([0, 1000000])
    });
  }
  /**
   * Method to get filter details
   *
   */
  applyFilter() {
    if (this.amountForm.get('billAmount').value) {
      this.filterparams.isFilter = true;
      this.filterparams.minBillAmount = this.amountForm.get('billAmount').value[0];
      this.filterparams.maxBillAmount = this.amountForm.get('billAmount').value[1];
    } else {
      this.filterparams.maxBillAmount = null;
      this.filterparams.minBillAmount = null;
    }
    if (this.rejectedOHIndicatorForm.get('name').value) {
      this.filterparams.isFilter = true;
      this.filterparams.rejectedOHInducator = this.rejectedOHIndicatorForm.get('name').value.english;
    } else {
      this.filterparams.rejectedOHInducator = null;
    }
    if (this.adjustmentIndicatorForm.get('name').value) {
      this.filterparams.isFilter = true;
      this.filterparams.adjustmentIndicator = this.adjustmentIndicatorForm.get('name').value.english;
    } else {
      this.filterparams.adjustmentIndicator = null;
    }
    if (this.violationIndicatorForm.get('name').value) {
      this.filterparams.isFilter = true;
      this.filterparams.violtaionIndicator = this.violationIndicatorForm.get('name').value.english;
    } else {
      this.filterparams.violtaionIndicator = null;
    }
    if (this.paymentStatusDetails.length > 0) {
      this.filterparams.isFilter = true;
      this.filterparams.paymentStatus = this.paymentStatusForm.get('name').value.english;
    } else {
      this.filterparams.paymentStatus = null;
    }
    if (this.billDateForm.value) {
      this.filterparams.isFilter = true;
      this.filterparams.billDate.startDate = convertToYYYYMMDD(this.billDateForm.value[0]);
      this.filterparams.billDate.endDate = convertToYYYYMMDD(endOfMonth(this.billDateForm.value[1]).toString());
    } else {
      this.filterparams.billDate.startDate = null;
      this.filterparams.billDate.endDate = null;
    }
    if (this.settelementDateForm.value) {
      this.filterparams.isFilter = true;
      this.filterparams.settlementDate.startDate = convertToYYYYMMDD(this.settelementDateForm.value[0]);
      this.filterparams.settlementDate.endDate = convertToYYYYMMDD(this.settelementDateForm.value[1]);
    } else {
      this.filterparams.settlementDate.startDate = null;
      this.filterparams.settlementDate.endDate = null;
    }
    this.filterValues.emit(this.filterparams);
  }

  // method toclear all  filter branch details
  clearAllFiters() {
    this.billDateForm.reset();
    this.filterparams.isFilter = false;
    this.filterparams.billDate.startDate = null;
    this.filterparams.billDate.endDate = null;
    this.adjustmentIndicatorForm.reset();
    this.filterparams.adjustmentIndicator = null;
    this.violationIndicatorForm.reset();
    this.filterparams.violtaionIndicator = null;
    this.rejectedOHIndicatorForm.reset();
    this.filterparams.rejectedOHInducator = null;
    this.paymentStatusForm.reset();
    this.filterparams.paymentStatus = null;
    this.settelementDateForm.reset();
    this.filterparams.settlementDate.startDate = null;
    this.filterparams.settlementDate.endDate = null;
    this.amountForm = this.createAmountForm();
    this.filterparams.minBillAmount = null;
    this.filterparams.maxBillAmount = null;
    this.filterValues.emit(null);
  }
  /** Method to create establishment list form. */
  createForm() {
    return this.fb.group({
      name: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  /**
   * Method to create date form
   */
  createDateForm() {
    return this.fb.group({
      date: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      })
    });
  }
  /**
   * Method to get selected values
   * @param filterParams
   */
  getSelectedValue(filterParams: string[]) {
    this.paymentStatus = filterParams;
  }
  /**
   * method to set the scroll for filter
   */
  onScroll() {
    if (this.dateRangePicker.dateRangePicker.isOpen) this.dateRangePicker.dateRangePicker.hide();
  }
}
