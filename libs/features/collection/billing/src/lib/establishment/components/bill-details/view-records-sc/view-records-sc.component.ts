/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CalendarTypeEnum,
  CurrencyToken,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  RegistrationNoToken,
  RegistrationNumber,
  StorageService
} from '@gosi-ui/core';
import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { RouteConstants } from '../../../../shared/constants';
import { Months } from '../../../../shared/enums';
import { EstablishmentHeader, RecordDetails } from '../../../../shared/models';
import { BillRecordService, DetailedBillService, ReportStatementService } from '../../../../shared/services';

@Component({
  selector: 'blg-view-records-sc',
  templateUrl: './view-records-sc.component.html',
  styleUrls: ['./view-records-sc.component.scss']
})
export class ViewRecordsScComponent implements OnInit {
  /**
   * Local Variables
   */
  currentPage = 1;
  itemsPerPage = 10;
  calendarMonth: string;
  calendarType = CalendarTypeEnum.GREGORIAN;
  count: number;
  establishment: Lov[] = [];
  lang = 'en';
  isAdmin = true;
  isHeader = false;
  isPreviousBill = false;
  mappingId: number;
  noOfRecords: number;
  paginationId = 'paginationId';
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  recordEstablishmentList: LovList;
  recordHeaderValue: EstablishmentHeader = new EstablishmentHeader();
  recordListForm: FormGroup;
  recordidNumber: number;
  receiptList: RecordDetails[];
  receiptSortFields$: Observable<LovList>;
  regNo: number;
  selectedCurrency: string;
  /**
   *
   * @param lookupService
   * @param fb
   * @param router
   * @param activatedRoute
   * @param detailedBillService
   * @param storageService
   * @param billRecordService
   * @param reportService
   * @param currency
   */
  constructor(
    readonly lookupService: LookupService,
    readonly fb: FormBuilder,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    readonly detailedBillService: DetailedBillService,
    readonly storageService: StorageService,
    readonly billRecordService: BillRecordService,
    readonly reportService: ReportStatementService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber
  ) {}
  /**
   * Method to initialise variables
   */
  ngOnInit(): void {
    this.recordListForm = this.createrecordListForm();
    this.receiptSortFields$ = this.lookupService.getReceiptSortFields();
    this.currency.subscribe(currentCurrencyKey => {
      this.selectedCurrency = currentCurrencyKey;
    });
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.recordidNumber = this.establishmentRegistrationNo.value;
    this.billRecordService.getRecords(this.recordidNumber).subscribe((res: RecordDetails[]) => {
      this.receiptList = res;
      this.noOfRecords = this.receiptList.length;
    });
    this.getRecordHeaderDetails(this.recordidNumber);
  }
  /**
   * Method to get coresponding month
   * @param index
   */
  getMonth(index: number) {
    const date = new Date(this.receiptList[this.absoluteIndex(index)]?.MONTH);
    const calendarMonth = date.getMonth() + 1;
    return calendarMonth;
  }
  /**
   * Method to get absolute index
   * @param indexOnPage
   */
  absoluteIndex(indexOnPage: number): number {
    return this.itemsPerPage * (this.currentPage - 1) + indexOnPage;
  }
  /**
   * Method to get coresponding date form month
   * @param date
   */
  getMonthFromDate(date: Date) {
    return Object.keys(Months)[moment(date).toDate().getMonth()];
  }
  /**
   * Method to get coresponding year
   * @param index
   */
  getYear(index: number) {
    const date = new Date(this.receiptList[this.absoluteIndex(index)]?.MONTH);
    return date.getFullYear().toString();
  }
  /**
   * Method to get coresponding receipt
   * @param index
   */
  getReceipt(mappingId: number) {
    this.router.navigate([RouteConstants.ROUTE_VIEW_ESCLATION], {
      queryParams: {
        mappingId: mappingId
      }
    });
  }
  /**
   * Method to get selected page
   * @param page
   */
  selectPage(page: number) {
    this.pageDetails.currentPage = this.currentPage = page;
  }
  /** Method to create establishment list form. */
  createrecordListForm() {
    return this.fb.group({
      recordestablishmentName: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  /**
   * Method to get header values
   * @param idNo
   */
  getRecordHeaderDetails(idNo: number) {
    this.detailedBillService.getBillingHeader(idNo, this.isAdmin).subscribe((res: EstablishmentHeader) => {
      this.isHeader = true;
      this.recordHeaderValue = res;
      this.establishment.push({
        value: {
          english: this.recordHeaderValue.name.english
            ? this.recordHeaderValue.name.english
            : this.recordHeaderValue.name.arabic,
          arabic: this.recordHeaderValue.name.arabic
        },
        sequence: 1
      });
      this.recordEstablishmentList = new LovList(this.establishment);
      this.recordListForm
        .get('recordestablishmentName')
        .get('english')
        .setValue(
          this.recordHeaderValue.name.english ? this.recordHeaderValue.name.english : this.recordHeaderValue.name.arabic
        );
    });
  }
}
