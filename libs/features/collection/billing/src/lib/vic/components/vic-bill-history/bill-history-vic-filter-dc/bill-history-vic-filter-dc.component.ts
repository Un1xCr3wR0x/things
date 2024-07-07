/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LovList, LookupService, convertToYYYYMMDD, BilingualText, endOfMonth } from '@gosi-ui/core';

import { InputDaterangeDcComponent } from '@gosi-ui/foundation-theme';
import { BillHistoryFilterParams } from '@gosi-ui/features/collection/billing/lib/shared/models';

@Component({
  selector: 'blg-bill-history-vic-filter-dc',
  templateUrl: './bill-history-vic-filter-dc.component.html',
  styleUrls: ['./bill-history-vic-filter-dc.component.scss']
})
export class BillHistoryVicFilterDcComponent implements OnInit, OnChanges {
  /**
   * Referring datepicker and daterange picker
   */
  @ViewChild('dateRangePicker1') dateRangePicker1: InputDaterangeDcComponent;
  @ViewChild('dateRangePicker2') dateRangePicker2: InputDaterangeDcComponent;
  /**
   * calendar variables
   */
  maxdate: Date;
  selectedLastDate: Date;
  selectedInitialDate: Array<Date>;
  billDateFormController = new FormControl();
  settlementDateFormController = new FormControl();
  paymentStatusDetail: BilingualText[] = [];
  defaultMin = 0;
  defaultMax = 100000;
  billAmount = new FormControl([this.defaultMin, this.defaultMax]);
  /**
   * Component local variables
   */
  isBillFirshtChange = false;
  isCreditFirshtChange = false;
  isNoOfEstablishmentChange = false;
  isNoOfActiveContributorChange = false;
  isSaudisChange = false;
  isNonSaudisChange = false;
  billHistoryFilterForm: FormGroup;
  closeEvent: any;
  insideEvent: boolean = false;
  filterParamValues: BillHistoryFilterParams = new BillHistoryFilterParams();

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
    this.maxdate = new Date();
    this.billHistoryFilterForm = this.createForm();
  }

  /**
   * This method is to filter the list based on the multi filters
   */
  onFilter(): void {
    if (this.billDateFormController?.value !== null && this.billDateFormController?.value !== undefined) {
      this.filterParamValues.billDate.startDate = convertToYYYYMMDD(this.billDateFormController.value[0]);
      this.filterParamValues.billDate.endDate = convertToYYYYMMDD(
        endOfMonth(this.billDateFormController.value[1]).toString()
      );
      this.filterParamValues.isFilter = true;
    }
    if (this.settlementDateFormController?.value !== null && this.settlementDateFormController?.value !== undefined) {
      this.filterParamValues.settlementDate.startDate = convertToYYYYMMDD(this.settlementDateFormController.value[0]);
      this.filterParamValues.settlementDate.endDate = convertToYYYYMMDD(
        endOfMonth(this.settlementDateFormController.value[1]).toString()
      );
      this.filterParamValues.isFilter = true;
    }

    if (this.paymentStatusDetail.length) {
      this.filterParamValues.paymentStatus = this.paymentStatusDetail;
      this.filterParamValues.isFilter = true;
    }

    this.fetchBillAmount();
    this.filterDetails.emit(this.filterParamValues);
  }
  fetchBillAmount() {
    this.filterParamValues.isFilter = true;
    if (!this.isBillFirshtChange) {
      this.filterParamValues.minBillAmount = this.billAmount.value[0];
      this.filterParamValues.maxBillAmount = this.billAmount.value[1];
      this.isBillFirshtChange = true;
      // }
    } else {
      this.filterParamValues.minBillAmount = this.billAmount.value[0];
      this.filterParamValues.maxBillAmount = this.billAmount.value[1];
    }
  }

  createForm() {
    return this.fb.group({
      adjustmentIndicator: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      vicPaymentStatus: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  /**
   * This method is to clear the filters
   */

  onClearAllFiters(): void {
    this.isCreditFirshtChange = false;
    this.isBillFirshtChange = false;
    this.isNoOfEstablishmentChange = false;
    this.isNoOfActiveContributorChange = false;
    this.isSaudisChange = false;
    this.isNonSaudisChange = false;
    this.billAmount = new FormControl([this.defaultMin, this.defaultMax]);
    this.filterParamValues.isFilter = false;
    this.billDateFormController.reset();
    this.settlementDateFormController.reset();
    this.billHistoryFilterForm.get('adjustmentIndicator').reset();
    this.billHistoryFilterForm.get('vicPaymentStatus').reset();
    this.filterParamValues.adjustmentIndicator = null;
    this.filterParamValues.violtaionIndicator = null;
    this.filterParamValues.rejectedOHInducator = null;
    this.filterParamValues.billDate.startDate = null;
    this.filterParamValues.billDate.endDate = null;
    this.filterParamValues.minBillAmount = null;
    this.filterParamValues.minCreditAmount = null;
    this.filterParamValues.minNoOfEstablishment = null;
    this.filterParamValues.maxBillAmount = null;
    this.filterParamValues.maxCreditAmount = null;
    this.filterParamValues.maxNoOfEstablishment = null;
    this.filterParamValues.paymentStatus = [];
    this.filterParamValues.settlementDate.startDate = null;
    this.filterParamValues.settlementDate.endDate = null;
    this.filterDetails.emit(this.filterParamValues);
  }
  closeCLicked(event) {
    this.closeEvent = event;
    setTimeout(() => {
      this.closeEvent = false;
    }, 40);
  }
  clickInsideSelect(event) {
    this.insideEvent = event;
  }
  /**
   * Method to hide datepicker while scrolling
   */
  onScroll() {
    if (this.dateRangePicker1.dateRangePicker.isOpen) this.dateRangePicker1.dateRangePicker.hide();
    if (this.dateRangePicker2.dateRangePicker.isOpen) this.dateRangePicker2.dateRangePicker.hide();
  }
}
