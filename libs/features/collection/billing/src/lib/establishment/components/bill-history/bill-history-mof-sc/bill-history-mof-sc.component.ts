import { Component, OnInit } from '@angular/core';
import {
  StorageService,
  AppConstants,
  convertToYYYYMMDD,
  BilingualText,
  endOfMonth,
  subtractMonths,
  startOfMonth,
  LovList,
  LookupService
} from '@gosi-ui/core';
import { BillDashboardService } from '../../../../shared/services/bill-dashboard.service';
import { BillHistoryWrapper, BillHistoryRouterDetails, BillHistoryFilterParams } from '../../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingRoutingService } from '../../../../shared/services';
import { BillingConstants } from '../../../../shared/constants/billing-constants';
import { Observable } from 'rxjs';

@Component({
  selector: 'blg-bill-history-mof-sc',
  templateUrl: './bill-history-mof-sc.component.html',
  styleUrls: ['./bill-history-mof-sc.component.scss']
})
export class BillHistoryMofScComponent implements OnInit {
  //----- Variables Declaration --------------------*/
  registrationNo: number;
  registrationStatus: BilingualText = new BilingualText();
  billHistoryDetails: BillHistoryWrapper = new BillHistoryWrapper();
  billHistoryChartData: BillHistoryWrapper = new BillHistoryWrapper();
  billNumber: number;
  pageNumber = 0;
  pageSize = 10;
  establishmentName: BilingualText;
  filterSearchDetails: BillHistoryFilterParams = new BillHistoryFilterParams();
  yesOrNoList$: Observable<LovList>;
  billPaymentStatus$: Observable<LovList>;
  currentStartDate: '1980-01-01';
  maxBillAmount = 10000;
  minBillAmount = 0;
  maxCreditAmount = 10000;
  minCreditAmount = 0;
  currentEndDate: string;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  previousPage: number;
  pageNoAfterFilter: number;
  isMofFlag = true;
  establishmentType: string;
  constructor(
    readonly storageService: StorageService,
    readonly route: ActivatedRoute,
    readonly billingRoutingService: BillingRoutingService,
    readonly billDashboardService: BillDashboardService,
    readonly router: Router,
    readonly lookUpService: LookupService
  ) {}

  /* This method is to handle intial operations on component load*/
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.establishmentType = params.establishmentType;
    });
    this.registrationNo = Number(this.storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY));
    this.currentEndDate = convertToYYYYMMDD(endOfMonth(subtractMonths(new Date(), 1)).toString());
    this.currentStartDate = '1980-01-01';
    this.yesOrNoList$ = this.lookUpService.getYesOrNoList();
    this.billPaymentStatus$ = this.lookUpService.getBillPaymentStatusList();
    this.pageChanged(0);
  }
  startDateCalculator(endDate) {
    return convertToYYYYMMDD(startOfMonth(subtractMonths(new Date(endDate), 12)).toString());
  }
  /* Method to get pagination data on each page select*/
  pageChanged(page: number) {
    if (this.filterSearchDetails.isFilter || this.filterSearchDetails.isSearch) {
      this.filterSearchDetails.pageNo = page;
      this.filterSearchDetails.billDate.startDate = '1980-01-01';
      this.billDashboardService
        .getBillHistoryMofSearchFilter(this.filterSearchDetails)
        .subscribe((res: BillHistoryWrapper) => {
          this.billHistoryDetails = res;
        });
    } else {
      this.pageNumber = page;
      this.billDashboardService
        .getBillHistoryMof(this.currentEndDate, this.establishmentType, this.currentStartDate, page, this.pageSize)
        .subscribe((res: BillHistoryWrapper) => {
          this.billHistoryDetails = res;
        });
    }
  }

  /* Method to navigate to other screen depending on option selection from kebab menu in bill history table*/
  routeToMof(routeDetails: BillHistoryRouterDetails) {
    const selectedDate = convertToYYYYMMDD(
      this.billHistoryDetails.bills[routeDetails.index].issueDate.gregorian.toString()
    );

    if (routeDetails.destinationPageName === BillingConstants.BIILL_HISTORY_ROUTE_ALLOCATOIN) {
      this.router.navigate([BillingConstants.ROUTE_BILL_ALLOCATION_MOF], {
        queryParams: {
          monthSelected: convertToYYYYMMDD(selectedDate),
          maxBilldate: convertToYYYYMMDD(this.billHistoryDetails?.bills[0]?.issueDate?.gregorian.toString())
        }
      });
    } else if (routeDetails.destinationPageName === BillingConstants.BIILL_HISTORY_ROUTE_BILL_DETAILS) {
      this.router.navigate([BillingConstants.ROUTE_DETAILED_BILL_MOF], {
        queryParams: {
          monthSelected: convertToYYYYMMDD(selectedDate)
        }
      });
    } else {
      this.router.navigate([BillingConstants.ROUTE_DASHBOARD_MOF], {
        queryParams: {
          monthSelected: convertToYYYYMMDD(selectedDate)
        }
      });
    }
  }

  routeToMofBillDashboard() {
    this.router.navigate([BillingConstants.ROUTE_DASHBOARD_MOF],{
      queryParams: {
        establishmentType: this.establishmentType
      }
      });
  }
  applySearchFilter(filterParams: BillHistoryFilterParams) {
    if (filterParams.isFilter || filterParams.isSearch) {
      this.pageNumber = 0;
      this.pageDetails.currentPage = 1;
      this.pageDetails.goToPage = String(this.pageDetails.currentPage);
    } else {
      this.pageDetails.goToPage = String(this.pageDetails.currentPage);
    }

    filterParams.billDate.startDate =
      filterParams.billDate.startDate !== null && filterParams.billDate.startDate !== undefined
        ? filterParams.billDate.startDate
        : this.currentStartDate;
    filterParams.billDate.endDate =
      filterParams.billDate.endDate !== null && filterParams.billDate.endDate !== undefined
        ? filterParams.billDate.endDate
        : this.currentEndDate;
    filterParams.pageNo = this.pageNumber;
    filterParams.pageSize = this.pageSize;
    filterParams.maxBillAmount =
      filterParams.maxBillAmount !== undefined ? filterParams.maxBillAmount : this.maxBillAmount;
    filterParams.minBillAmount =
      filterParams.minBillAmount !== undefined ? filterParams.minBillAmount : this.minBillAmount;
    filterParams.maxCreditAmount =
      filterParams.maxCreditAmount !== undefined ? filterParams.maxCreditAmount : this.maxCreditAmount;
    filterParams.minCreditAmount =
      filterParams.minCreditAmount !== undefined ? filterParams.minCreditAmount : this.minCreditAmount;
    this.filterSearchDetails = filterParams;
    this.billDashboardService
      .getBillHistoryMofSearchFilter(this.filterSearchDetails)
      .subscribe((res: BillHistoryWrapper) => {
        this.billHistoryDetails = res;
      });
  }
}
