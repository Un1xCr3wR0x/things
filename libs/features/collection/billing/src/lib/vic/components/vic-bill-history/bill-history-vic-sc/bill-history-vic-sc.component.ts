import { Component, OnInit, Inject } from '@angular/core';
import {
  StorageService,
  convertToYYYYMMDD,
  BilingualText,
  endOfMonth,
  subtractMonths,
  LovList,
  LookupService,
  LanguageToken,
  downloadFile,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { BillDashboardService } from '../../../../shared/services/bill-dashboard.service';
import { BillHistoryWrapper, BillHistoryRouterDetails, BillHistoryFilterParams } from '../../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingRoutingService, ReportStatementService } from '../../../../shared/services';
import { Observable, BehaviorSubject } from 'rxjs';
import { ReportConstants, BillingConstants } from '../../../../shared/constants';
import { LanguageTypeEnum } from '../../../../shared/enums';
import { Location } from '@angular/common';

@Component({
  selector: 'blg-bill-history-vic-sc',
  templateUrl: './bill-history-vic-sc.component.html',
  styleUrls: ['./bill-history-vic-sc.component.scss']
})
export class BillHistoryVicScComponent implements OnInit {
  //----- Variables Declaration --------------------*/
  previousPage: number;
  pageNoAfterFilter: number;
  establishmentName: BilingualText;
  sin: number;
  registrationStatus: BilingualText = new BilingualText();
  billHistoryDetails: BillHistoryWrapper = new BillHistoryWrapper();
  billHistoryChartData: BillHistoryWrapper = new BillHistoryWrapper();
  billNumber: number;
  pageNumber = 0;
  pageSize = 10;
  yesOrNoList$: Observable<LovList>;
  billPaymentStatus$: Observable<LovList>;
  currentStartDate: string;
  currentEndDate: string;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  isSearchPagination = false;
  lang = 'en';
  languageType: string;
  filterSearchDetails: BillHistoryFilterParams = new BillHistoryFilterParams();
  routerdata :RouterData;

  /**
   * Creates an instance of BillingRoutingService
   * @param routerData router data
   */

  constructor(
    readonly billDashboardService: BillDashboardService,
    readonly storageService: StorageService,
    readonly route: ActivatedRoute,
    readonly lookUpService: LookupService,
    readonly billingRoutingService: BillingRoutingService,
    readonly router: Router,
    readonly reportStatementService: ReportStatementService,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    readonly location: Location,
    @Inject(RouterDataToken) readonly routerData: RouterData
  ) {}

  /* This method is to handle intial operations on component load*/
  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
      this.languageType = this.lang === 'en' ? LanguageTypeEnum.ENGLISH_LANGUAGE : LanguageTypeEnum.ARABIC_LANGUAGE;
    });
    this.currentEndDate = convertToYYYYMMDD(endOfMonth(subtractMonths(new Date(), 1)).toString());
    this.route.queryParams.subscribe(params => {
      this.sin = params.sin;
    });

    this.currentStartDate = '1980-01-01';

    this.billPaymentStatus$ = this.lookUpService.getBillPaymentStatusList();
    this.yesOrNoList$ = this.lookUpService.getYesOrNoList();
    this.pageChangedValue(0);
  }

  /* Method to get pagination data on each page select*/
  pageChangedValue(page: number) {
    if (this.filterSearchDetails.isFilter || this.filterSearchDetails.isSearch) {
      this.filterSearchDetails.pageNo = page;
      this.billDashboardService
        .getBillHistoryVicSearchFilter(this.filterSearchDetails, this.sin)
        .subscribe((resValue: BillHistoryWrapper) => {
          this.billHistoryDetails = resValue;
        });
    } else {
      this.pageNumber = page;
      this.billDashboardService
        .getBillHistoryVic(this.sin, this.currentEndDate, this.currentStartDate, true, page, this.pageSize)
        .subscribe((response: BillHistoryWrapper) => {
          this.billHistoryDetails = response;
        });
    }
  }

  /* Method to navigate to other screen depending on option selection from kebab menu in bill history table*/
  routeToMof(routeDetails: BillHistoryRouterDetails) {
    const billIssueDate = this.billHistoryDetails.firstBillIssueDate.gregorian.toString();
    const lastBillIssueDate = this.billHistoryDetails.lastBillIssueDate.gregorian.toString();
    const selectedDate = convertToYYYYMMDD(
      this.billHistoryDetails.bills[routeDetails.index].issueDate.gregorian.toString()
    );
    const selectedDateFormat = this.billHistoryDetails.bills[routeDetails.index].issueDate.entryFormat;
    if (routeDetails.destinationPageName === BillingConstants.BIILL_HISTORY_ROUTE_ALLOCATOIN) {
      this.router.navigate([BillingConstants.ROUTE_VIC_BILL_ALLOCATION], {
        queryParams: {
          monthSelected: convertToYYYYMMDD(selectedDate),
          billIssueDate: convertToYYYYMMDD(billIssueDate),
          maxBilldate: convertToYYYYMMDD(lastBillIssueDate),
          sinNo: this.sin,
          entryFormat: selectedDateFormat
        }
      });
    } else {
      this.routerData.content={ selectFlag:true };
      this.router.navigate([BillingConstants.ROUTE_VIC_DASHBOARD_BILL], {
        queryParams: {
          monthSelected: convertToYYYYMMDD(selectedDate),
          billNumber: this.sin,
          entryFormat: selectedDateFormat
        }
      });
    }
  }

  routeToVicBillDashboard() {
     this.router.navigate([BillingConstants.ROUTE_VIC_DASHBOARD], {
       queryParams: {
         billNumber: this.sin
      }
     });
    //this.location.back();
  }
  applyVicSearchFilter(filterParams: BillHistoryFilterParams) {
    if (filterParams.isFilter || filterParams.isSearch) {
      if (!this.isSearchPagination) {
        this.previousPage = this.pageNumber;
        this.isSearchPagination = true;
      }
      this.pageDetails.goToPage = String(this.pageDetails.currentPage);
      this.pageNumber = 0;
      this.pageDetails.currentPage = 1;
    } else {
      this.pageNumber = this.previousPage;
      this.pageDetails.currentPage = this.pageNumber + 1;
      this.pageDetails.goToPage = String(this.pageDetails.currentPage);
      this.isSearchPagination = false;
    }
    filterParams.billDate.endDate =
      filterParams.billDate.endDate !== null && filterParams.billDate.endDate !== undefined
        ? filterParams.billDate.endDate
        : this.currentEndDate;
    filterParams.billDate.startDate =
      filterParams.billDate.startDate !== null && filterParams.billDate.startDate !== undefined
        ? filterParams.billDate.startDate
        : this.currentStartDate;
    filterParams.pageSize = this.pageSize;
    filterParams.pageNo = this.pageNumber;

    this.filterSearchDetails = filterParams;
    this.billDashboardService
      .getBillHistoryVicSearchFilter(this.filterSearchDetails, this.sin)
      .subscribe((value: BillHistoryWrapper) => {
        this.billHistoryDetails = value;
      });
  }
  downLoadVicBill(billNumber: number) {
    this.reportStatementService.generateVicBills(Number(this.sin), billNumber, this.languageType).subscribe(data => {
      downloadFile(ReportConstants.PRINT_BILL_FILE_NAME, 'application/pdf', data);
    });
  }
}
