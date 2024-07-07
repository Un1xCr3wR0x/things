/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, EventEmitter, Input,OnInit, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { BilingualText, Establishment, FilterKeyEnum, FilterKeyValue, Lov, LovList } from '@gosi-ui/core';
import { DefaultAmounts, FilterHistory, ViolationFilterResponse } from '../../../shared/models';
import { Router } from '@angular/router';
import { ViolationRouteConstants } from '../../../shared/constants/violations-route-contants';
import { ViolationsEnum } from '../../../shared/enums';
import { EligibleRoleConstants, ViolationConstants } from '../../../shared';
@Component({
  selector: 'vol-violation-history-heading-dc',
  templateUrl: './violation-history-heading-dc.component.html',
  styleUrls: ['./violation-history-heading-dc.component.scss']
})
export class ViolationHistoryHeadingDcComponent implements OnInit,OnChanges {
  /** Local Variables */
  isSearched = false;
  searchParam = '';
  estRegistered: String;
  sortOrder = 'ASC';
  sortBy: string;
  violationList: LovList;
  estReopened: String;

  /** Input variables. */
  @Input() channelList: LovList;
  @Input() isAppPrivate;
  @Input() violationFilterResponse: ViolationFilterResponse = new ViolationFilterResponse();
  @Input() typeList: LovList;
  @Input() backPath: string;
  @Input() defaultAmounts:DefaultAmounts;
  @Input() regNo: number;
  @Input() estDetails: Establishment;

  /** output variables. */
  @Output() filterHistory: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() searchHistory: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() navigateToReportViolation: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() sortItemSelected?: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortListValues?: EventEmitter<string> = new EventEmitter<string>();
  appliedFilter: FilterKeyValue[] = new Array<FilterKeyValue>();
  clearFilteredHistory: FilterHistory = new FilterHistory();
  hasFiltered: boolean;
  accessCsrOnly = EligibleRoleConstants.ELIGIBLE_CSR_ROLES;

  constructor(readonly location: Location, private router: Router) {}

  ngOnInit(): void {
    this.estRegistered = ViolationsEnum.ESTABLISHMENT_REGISTERED;
    this.violationList  = ViolationConstants.VIOLATION_TYPE_LIST;
    this.estReopened = ViolationsEnum.ESTABLISHMENT_REOPEN;

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes && changes.defaultAmounts){
      this.defaultAmounts=changes.defaultAmounts.currentValue;
    }
  }
  /** Method to search violation history from list. */
  searchViolationHistory(value) {
    this.searchParam = value;
    this.isSearched = true;
    this.searchHistory.emit(value);
  }
  onSearchEnable(searchKey: string) {
    if (!searchKey && this.isSearched) {
      this.isSearched = false;
      this.searchParam = searchKey;
      this.searchHistory.emit(searchKey);
    }
  }
  filterViolationHistory(value) {
    this.filterHistory.emit(value);
  }
  filterApplied(val) {
    this.appliedFilter = [];
    val.forEach((element, i) => {
      if (element.key === FilterKeyEnum.PERIOD) {
        this.appliedFilter.push(element);
      }
      else if(element.key === FilterKeyEnum.PENALTYAMOUNT){
        this.appliedFilter.push(element);
      }
      else if(element.key === FilterKeyEnum.PAIDAMOUNT){
        this.appliedFilter.push(element);
      } else {
        if (element.bilingualValues.length > 0) {
          this.appliedFilter.push(element);
        }
      }
    });
    this.hasFiltered = this.appliedFilter.length > 0 ? true : false;
  }

  cancelledFilter(val: FilterKeyValue[]) {
    if (val.length === 0) {
      this.clearFilteredHistory = new FilterHistory();
      this.appliedFilter = [];
      this.hasFiltered = false;
    } else {
      this.clearFilteredHistory = new FilterHistory();
      val.forEach(element => {
        if (element.key === FilterKeyEnum.STATUS) {
          this.clearFilteredHistory.status = element.bilingualValues;
        }
        if (element.key === FilterKeyEnum.ROLES) {
          this.clearFilteredHistory.channel = element.bilingualValues;
        }
        if (element.key === FilterKeyEnum.NATIONALITY) {
          this.clearFilteredHistory.violationType = element.bilingualValues;
        }
        if (element.key === FilterKeyEnum.PERIOD) {
          this.clearFilteredHistory.period.startDate = element.values[0];
          this.clearFilteredHistory.period.endDate = element.values[1];
        }
        if(element.key === FilterKeyEnum.PENALTYAMOUNT){
          this.clearFilteredHistory.appliedPenaltyAmountStart=element.rangeValues[0];
          this.clearFilteredHistory.appliedPenaltyAmountEnd=element.rangeValues[1];
        }
        if(element.key === FilterKeyEnum.PAIDAMOUNT){
          this.clearFilteredHistory.appliedPaidAmountStart=element.rangeValues[0];
          this.clearFilteredHistory.appliedPaidAmountEnd=element.rangeValues[1];
        }
      });
      this.hasFiltered = true;
    }
  }
  reportViolation() {
    this.navigateToReportViolation.emit();
  }
  sortDirection(sortOrder) {
    this.sortOrder = sortOrder;
    this.sortListValues.emit(this.sortOrder);
  }
  sortedItem(violationList:Lov ) {
    if (violationList.value.english === 'Letter Date' || violationList.value.arabic === 'تاريخ الإشعار') {
      this.sortBy = 'dateReported';
    }
    else if (violationList.value.english === 'Penalty Amount' || violationList.value.arabic === 'مقدار الغرامة') {
      this.sortBy = 'penaltyAmount';
    } else if (violationList.value.english === 'Amount Paid' || violationList.value.arabic === 'المبلغ المدفوع') {
      this.sortBy = 'paidAmount';
    }

    this.sortItemSelected.emit(this.sortBy);
  }
}

