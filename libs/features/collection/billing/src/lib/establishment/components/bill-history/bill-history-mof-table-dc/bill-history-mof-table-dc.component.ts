import { Component, OnInit, Input, Output, EventEmitter, Inject, SimpleChanges, OnChanges } from '@angular/core';
import { BillHistoryWrapper, BillHistoryRouterDetails, BillHistoryFilterParams } from '../../../../shared/models';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LanguageToken, LovList } from '@gosi-ui/core';

@Component({
  selector: 'blg-bill-history-mof-table-dc',
  templateUrl: './bill-history-mof-table-dc.component.html',
  styleUrls: ['./bill-history-mof-table-dc.component.scss']
})
export class BillHistoryMofTableDcComponent implements OnInit, OnChanges {
  routeToDetails: BillHistoryRouterDetails = new BillHistoryRouterDetails();
  currentPage = 0;
  noOfRecords = 0;
  itemsPerPages = 10;
  placement = 'bottom right';
  lang = 'en';
  regexp: RegExp = new RegExp('^[0-9]+$');
  filterSearchParams: BillHistoryFilterParams = new BillHistoryFilterParams();

  @Input() mofBillHistoryDetails: BillHistoryWrapper;
  @Input() yesOrNoList: LovList;
  @Input() billPaymentStatus: LovList;
  @Input() pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * Output variable
   */
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();
  @Output() routeTo: EventEmitter<BillHistoryRouterDetails> = new EventEmitter();
  @Output() SearchOfAmount: EventEmitter<BillHistoryFilterParams> = new EventEmitter();
  @Output() filterDetails: EventEmitter<BillHistoryFilterParams> = new EventEmitter();

  ngOnInit(): void {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.pageDetails?.currentValue) {
      this.pageDetails = changes.pageDetails.currentValue;
    }
    if (changes?.mofBillHistoryDetails?.currentValue) {
      this.mofBillHistoryDetails = changes.mofBillHistoryDetails.currentValue;
    }
  }
  /**
   *
   * @param amount method to trigger the amount select event
   */
  onSearchAmount(amount: number) {
    this.pageDetails.currentPage = 1;
    if (amount) {
      this.filterSearchParams.isSearch = true;
      this.filterSearchParams.amount = amount;
      this.SearchOfAmount.emit(this.filterSearchParams);
    } else {
      this.filterSearchParams.isSearch = false;
      this.filterSearchParams.amount = 0;
      this.SearchOfAmount.emit(this.filterSearchParams);
    }
  }
  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
      this.selectPageNo.emit(this.currentPage - 1);
    }
  }
  /**
   *
   * @param index method to trigger routing to allocation page
   */
  routeToAllocationScreens(index) {
    this.routeToDetails.destinationPageName = 'allocation';
    this.routeToDetails.index = index;
    this.routeTo.emit(this.routeToDetails);
  }
  /**
   *
   * @param index method to trigger routing to bill-details page
   */
  routeToDetailedBillScreens(index) {
    this.routeToDetails.destinationPageName = 'bill-details';
    this.routeToDetails.index = index;
    this.routeTo.emit(this.routeToDetails);
  }
  /**
   *
   * @param index method to trigger routing to bill-summary page
   */
  routeToBillSummaryScreens(index) {
    this.routeToDetails.destinationPageName = 'bill-summary';
    this.routeToDetails.index = index;
    this.routeTo.emit(this.routeToDetails);
  }
  applyFilter(filterParams: BillHistoryFilterParams) {
    if (this.filterSearchParams.isSearch) {
      filterParams.amount = this.filterSearchParams.amount;
    }
    this.filterSearchParams = filterParams;
    this.filterDetails.emit(filterParams);
  }
}
