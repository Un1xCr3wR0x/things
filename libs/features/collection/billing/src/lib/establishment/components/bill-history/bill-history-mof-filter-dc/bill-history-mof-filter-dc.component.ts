/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LovList, LookupService, convertToYYYYMMDD, BilingualText, endOfMonth } from '@gosi-ui/core';

import { InputDaterangeDcComponent } from '@gosi-ui/foundation-theme';
import { BillHistoryFilterParams } from '../../../../shared/models';

@Component({
  selector: 'blg-bill-history-mof-filter-dc',
  templateUrl: './bill-history-mof-filter-dc.component.html',
  styleUrls: ['./bill-history-mof-filter-dc.component.scss']
})
export class BillHistoryMofFilterDcComponent implements OnInit, OnChanges {
  /**
   * Referring datepicker and daterange picker
   */
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  /**
   * calendar variables
   */
  totalItems;
  isBillFirshtChange = false;
  isCreditFirshtChange = false;
  isNoOfEstablishmentChange = false;
  isNoOfActiveContributorChange = false;
  isSaudisChange = false;
  isNonSaudisChange = false;
  maxdateValue: Date;
  selectedLastDate: Date;
  selectedInitialDate: Array<Date>;
  billDateFormController = new FormControl();
  settlementDateFormController = new FormControl();
  paymentStatusDetails: BilingualText[] = [];
  defaultMinValue = 0;
  defaultMaxValue = 100000;
  billAmount = new FormControl([this.defaultMinValue, this.defaultMaxValue]);
  creditAmount = new FormControl([this.defaultMinValue, this.defaultMaxValue]);
  noOfEstablishment = new FormControl([this.defaultMinValue, this.defaultMaxValue]);
  noOfActiveContributor = new FormControl([this.defaultMinValue, this.defaultMaxValue]);
  saudis = new FormControl([0, 5000]);
  nonSaudis = new FormControl([0, 5000]);

  /**
   * Component local variables
   */
  billHistoryFilterForm: FormGroup;
  selectedAdjustmentOption: string;
  filterParams: BillHistoryFilterParams = new BillHistoryFilterParams();

  // input varaiables
  @Input() yesOrNoList: LovList;
  @Input() billPaymentStatus: LovList;
  // output varaiables
  @Output() filterDetails: EventEmitter<BillHistoryFilterParams> = new EventEmitter();
  constructor(private fb: FormBuilder, readonly lookUpService: LookupService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.yesOrNoList?.currentValue) {
      this.yesOrNoList = changes.yesOrNoList.currentValue;
    }
  }

  ngOnInit(): void {
    this.maxdateValue = new Date();
    this.billHistoryFilterForm = this.createForm();
  }

  /**
   * This method is to filter the list based on the multi filters
   */
  applyFilter(): void {
    if (this.billDateFormController?.value !== null && this.billDateFormController?.value !== undefined) {
      this.filterParams.billDate.startDate = convertToYYYYMMDD(this.billDateFormController.value[0]);
      this.filterParams.billDate.endDate = convertToYYYYMMDD(
        endOfMonth(this.billDateFormController.value[1]).toString()
      );
      this.filterParams.isFilter = true;
    }
    if (this.settlementDateFormController?.value !== null && this.settlementDateFormController?.value !== undefined) {
      this.filterParams.settlementDate.endDate = convertToYYYYMMDD(this.settlementDateFormController.value[1]);
      this.filterParams.settlementDate.startDate = convertToYYYYMMDD(this.settlementDateFormController.value[0]);
      this.filterParams.isFilter = true;
    }
    if (this.selectedAdjustmentOption !== null && this.selectedAdjustmentOption !== undefined) {
      this.filterParams.adjustmentIndicator = this.selectedAdjustmentOption;
      this.filterParams.isFilter = true;
    } else {
      this.filterParams.adjustmentIndicator = null;
    }
    if (this.paymentStatusDetails.length) {
      this.filterParams.paymentStatus = this.paymentStatusDetails;
      this.filterParams.isFilter = true;
    }

    this.fetchBillAmount();
    this.fetchCreditBalance();
    this.fetchNoOfEstablishment();
    this.fetchNoOfEstablishment();
    this.filterDetails.emit(this.filterParams);
  }
  fetchBillAmount() {
    this.filterParams.isFilter = true;
    if (!this.isBillFirshtChange) {
      if (this.billAmount.value[0] !== this.defaultMinValue || this.billAmount.value[1] !== this.defaultMaxValue) {
        this.filterParams.minBillAmount = this.billAmount.value[0];
        this.filterParams.maxBillAmount = this.billAmount.value[1];
        this.isBillFirshtChange = true;
      }
    } else {
      this.filterParams.minBillAmount = this.billAmount.value[0];
      this.filterParams.maxBillAmount = this.billAmount.value[1];
    }
  }
  fetchCreditBalance() {
    this.filterParams.isFilter = true;
    if (!this.isCreditFirshtChange) {
      if (this.creditAmount.value[0] !== this.defaultMinValue || this.creditAmount.value[1] !== this.defaultMaxValue) {
        this.filterParams.minCreditAmount = this.creditAmount.value[0];
        this.filterParams.maxCreditAmount = this.creditAmount.value[1];
        this.isCreditFirshtChange = true;
      }
    } else {
      this.filterParams.minCreditAmount = this.creditAmount.value[0];
      this.filterParams.maxCreditAmount = this.creditAmount.value[1];
    }
  }

  fetchNoOfEstablishment() {
    this.filterParams.isFilter = true;
    if (!this.isNoOfEstablishmentChange) {
      if (
        this.noOfEstablishment.value[0] !== this.defaultMinValue ||
        this.noOfEstablishment.value[1] !== this.defaultMaxValue
      ) {
        this.filterParams.minNoOfEstablishment = this.noOfEstablishment.value[0];
        this.filterParams.maxNoOfEstablishment = this.noOfEstablishment.value[1];
        this.isNoOfEstablishmentChange = true;
      }
    } else {
      this.filterParams.minNoOfEstablishment = this.noOfEstablishment.value[0];
      this.filterParams.maxNoOfEstablishment = this.noOfEstablishment.value[1];
    }
  }

  createForm() {
    return this.fb.group({
      adjustmentIndicator: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      paymentStatus: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  /**
   * This method is to clear the filters
   */

  clearAllFiters(): void {
    this.isCreditFirshtChange = false;
    this.isBillFirshtChange = false;
    this.isNoOfEstablishmentChange = false;
    this.isNoOfActiveContributorChange = false;
    this.isSaudisChange = false;
    this.isNonSaudisChange = false;
    this.billAmount = new FormControl([this.defaultMinValue, this.defaultMaxValue]);
    this.creditAmount = new FormControl([this.defaultMinValue, this.defaultMaxValue]);
    this.noOfEstablishment = new FormControl([this.defaultMinValue, this.defaultMaxValue]);
    this.saudis = new FormControl([this.defaultMinValue, this.defaultMaxValue]);
    this.nonSaudis = new FormControl([this.defaultMinValue, this.defaultMaxValue]);
    this.filterParams.isFilter = false;
    this.billDateFormController.reset();
    this.settlementDateFormController.reset();
    this.billHistoryFilterForm.get('adjustmentIndicator').reset();
    this.billHistoryFilterForm.get('paymentStatus').reset();
    this.filterParams.adjustmentIndicator = null;
    this.selectedAdjustmentOption = null;
    this.filterParams.billDate.startDate = null;
    this.filterParams.billDate.endDate = null;
    this.filterParams.minBillAmount = this.defaultMinValue;
    this.filterParams.minCreditAmount = this.defaultMinValue;
    this.filterParams.maxNoOfEstablishment = null;
    this.filterParams.minNoOfEstablishment = null;
    this.filterParams.maxBillAmount = this.defaultMaxValue;
    this.filterParams.maxCreditAmount = this.defaultMaxValue;
    this.filterParams.paymentStatus = [];
    this.filterParams.settlementDate.endDate = null;
    this.filterParams.settlementDate.startDate = null;
    this.filterDetails.emit(this.filterParams);
  }
  /**
   * Method to hide datepicker while scrolling
   */
  onScrolls() {
    if (this.dateRangePicker.dateRangePicker.isOpen) this.dateRangePicker.dateRangePicker.hide();
  }
}
