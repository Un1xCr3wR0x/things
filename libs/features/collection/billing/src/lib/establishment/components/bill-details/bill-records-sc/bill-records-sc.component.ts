/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  BilingualText,
  CurrencyToken,
  LanguageToken,
  Lov,
  LovList,
  RegistrationNoToken,
  RegistrationNumber,
  StorageService
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { RouteConstants } from '../../../../shared/constants';
import {
  AdjustmentTypeDetails,
  AdjustmentWageDetails,
  DebitCreditDetails,
  AdjustmentTotal,
  EstablishmentHeader,
  MonthReceipt
} from '../../../../shared/models';
import { BillRecordService, DetailedBillService, ReportStatementService } from '../../../../shared/services';

@Component({
  selector: 'blg-bill-records-sc',
  templateUrl: './bill-records-sc.component.html',
  styleUrls: ['./bill-records-sc.component.scss']
})
export class BillRecordsScComponent implements OnInit {
  /**
   * Local variables
   */
  accountRecords: DebitCreditDetails;
  accounttabItems = [];
  adjustmentDetails_s001: AdjustmentWageDetails[];
  adjustmentDetails_s002: AdjustmentWageDetails[];
  adjustmentDetails_s034: AdjustmentWageDetails[];
  adjustmentDetails_s2: AdjustmentTypeDetails[];
  adjustmentDetails_s011;
  adjustmentTotal: AdjustmentTotal[];
  allocationRecords: DebitCreditDetails;
  billingEstablishment: Lov[] = [];
  billingHeaderValue: EstablishmentHeader = new EstablishmentHeader();
  billingList: LovList;
  billingtListForm: FormGroup;
  currencyValue: string;
  idNumber: number;
  indicatorType: string;
  lang = 'en';
  establishmentName: BilingualText;
  isAdmin = true;
  isBillingHeader = false;
  mappingId: number;
  receiptRecords: MonthReceipt[];
  routeUrl: string;
  selectedTab;
  totalRecords_01 = 0;
  totalRecords_02 = 0;
  totalRecords_034 = 0;
  wageRecords: DebitCreditDetails;
  /**
   *
   * @param router
   * @param fb
   * @param reportService
   * @param activatedRoute
   * @param storageService
   * @param detailedBillService
   * @param billRecordService
   * @param currency
   * @param language
   */
  constructor(
    readonly router: Router,
    readonly fb: FormBuilder,
    readonly reportService: ReportStatementService,
    readonly activatedRoute: ActivatedRoute,
    readonly storageService: StorageService,
    readonly detailedBillService: DetailedBillService,
    readonly billRecordService: BillRecordService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber
  ) {}
  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.selectedTab = 'BILLING.ACCOUNT-DETAILS';
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.getAccountTabsetDetails();
    this.billingtListForm = this.createBillingEstablishmentListForm();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params) this.mappingId = Number(params.mappingId);
    });
    this.billRecordService.getAccountRecords(this.mappingId).subscribe(res => {
      this.accountRecords = res;
    });

    this.currency?.subscribe(currentCurrencyKey => {
      this.currencyValue = currentCurrencyKey;
    });
    this.idNumber = this.establishmentRegistrationNo.value;
    this.getRecordsDetails(this.idNumber);
  }
  /**
   * Method to get tabset details
   */
  getAccountTabsetDetails() {
    this.accounttabItems = [];
    this.accounttabItems.push({
      tabName: 'BILLING.ACCOUNT-DETAILS'
    });
    this.accounttabItems.push({
      tabName: 'BILLING.WAGE-DETAILS'
    });

    this.accounttabItems.push({
      tabName: 'BILLING.RECEIPTS-DETAILS'
    });

    this.accounttabItems.push({
      tabName: 'BILLING.ALLOCATION-DETAILS'
    });
    this.accounttabItems.push({
      tabName: 'BILLING.ADJUSTMENT-BREAKUP-DETAILS'
    });
  }
  /**
   * Method to create header details form
   */
  createBillingEstablishmentListForm() {
    return this.fb.group({
      billingName: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  /**
   * Method to get old bill records
   * @param idNo
   */
  getRecordsDetails(idNo: number) {
    this.detailedBillService.getBillingHeader(idNo, this.isAdmin).subscribe((res: EstablishmentHeader) => {
      this.billingHeaderValue = res;
      this.establishmentName = new BilingualText();
      this.establishmentName.english =
        this.lang === 'en' && res?.name?.english === null ? res?.name.arabic : res?.name.english;
      this.establishmentName.arabic = res.name?.arabic;
      this.isBillingHeader = true;
      this.billingEstablishment.push({
        value: {
          english: this.billingHeaderValue.name.english
            ? this.billingHeaderValue.name.english
            : this.billingHeaderValue.name.arabic,
          arabic: this.billingHeaderValue.name.arabic
        },
        sequence: 1
      });
      this.billingList = new LovList(this.billingEstablishment);
      this.billingtListForm
        .get('billingName')
        .get('english')
        .setValue(
          this.billingHeaderValue.name.english
            ? this.billingHeaderValue.name.english
            : this.billingHeaderValue.name.arabic
        );
    });
  }
  /**
   * Method to go to a selected tab
   * @param accountTabs
   */
  onAccountToNewTab(accountTabs: string) {
    this.selectedTab = accountTabs;
    if (this.selectedTab === 'BILLING.ACCOUNT-DETAILS')
      this.billRecordService.getAccountRecords(this.mappingId).subscribe((res: DebitCreditDetails) => {
        this.accountRecords = res;
      });
    if (this.selectedTab === 'BILLING.WAGE-DETAILS')
      this.billRecordService.getWageRecords(this.mappingId).subscribe((res: DebitCreditDetails) => {
        this.wageRecords = res;
      });
    if (this.selectedTab === 'BILLING.RECEIPTS-DETAILS')
      this.billRecordService.getReceiptsRecords(this.mappingId).subscribe((res: MonthReceipt[]) => {
        this.receiptRecords = res;
      });
    if (this.selectedTab === 'BILLING.ALLOCATION-DETAILS')
      this.billRecordService.getAllocationRecords(this.mappingId).subscribe((res: DebitCreditDetails) => {
        this.allocationRecords = res;
      });
    if (this.selectedTab === 'BILLING.ADJUSTMENT-BREAKUP-DETAILS') {
      this.billRecordService.getAdjustmentTotal(this.mappingId).subscribe((data: AdjustmentTotal[]) => {
        this.adjustmentTotal = data;
        if (this.adjustmentTotal) {
          this.adjustmentDetails_s2 = [];
          this.billRecordService.getAdjustmentDetails_s2(this.mappingId).subscribe((res: AdjustmentTypeDetails[]) => {
            res?.forEach(value => {
              if (
                value.ADJUSTMENTTYPE === 0 ||
                value.ADJUSTMENTTYPE === 1001 ||
                value.ADJUSTMENTTYPE === 1002 ||
                value.ADJUSTMENTTYPE === 1003 ||
                value.ADJUSTMENTTYPE === 1004 ||
                value.ADJUSTMENTTYPE === 1011
              )
                this.adjustmentDetails_s2.push(value);
            });
          });
          this.billRecordService.getAdjustmentType_s001(this.mappingId).subscribe((res: AdjustmentWageDetails[]) => {
            this.adjustmentDetails_s001 = res;
          });
          this.billRecordService.getAdjustmentType_s002(this.mappingId).subscribe((res: AdjustmentWageDetails[]) => {
            this.adjustmentDetails_s002 = res;
          });
          this.billRecordService.getAdjustmentType_s0034(this.mappingId).subscribe((res: AdjustmentWageDetails[]) => {
            this.adjustmentDetails_s011 = [];
            this.adjustmentDetails_s034 = [];
            res.forEach(list => {
              if (list.ADJUSTMENTTYPE === 1011) {
                this.adjustmentDetails_s011.push(list);
              } else {
                this.adjustmentDetails_s034.push(list);
              }
            });
          });
        }
      });
    }
  }
  /**
   * Method to navigate while clicking cancel
   */
  hideAccountModal() {
    this.router.navigate([RouteConstants.ROUTE_VIEW_RECORD]);
  }
}
