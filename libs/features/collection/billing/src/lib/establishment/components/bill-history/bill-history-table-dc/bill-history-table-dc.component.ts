import { Component, OnInit, Input, Output, EventEmitter, Inject, SimpleChanges, OnChanges } from '@angular/core';
import { BillHistoryWrapper, BillHistoryRouterDetails, BillHistoryFilterParams } from '../../../../shared/models';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LanguageToken, LovList } from '@gosi-ui/core';

@Component({
  selector: 'blg-bill-history-table-dc',
  templateUrl: './bill-history-table-dc.component.html',
  styleUrls: ['./bill-history-table-dc.component.scss']
})
export class BillHistoryTableDcComponent implements OnInit, OnChanges {
  routeToDetails: BillHistoryRouterDetails = new BillHistoryRouterDetails();
  currentPage = 0;
  noOfRecords = 0;
  itemsPerPage = 10;
  placement = 'bottom right';
  lang = 'en';
  currentCurrencyLable: string;
  /**
   * Input variable
   */
  @Input() billHistoryDetails: BillHistoryWrapper;
  @Input() isMof: boolean;
  @Input() exchangeRate = 1;
  @Input() currentCurrency = 'SAR';
  @Input() yesOrNoList: LovList;
  @Input() billPaymentStatus: LovList;
  @Input() hideColumn: boolean;
  @Input() pageDetails? = {
    currentPage: 1,
    goToPage: '1'
  };
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * Output variable
   */
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();
  @Output() SearchAmount: EventEmitter<number> = new EventEmitter();
  @Output() routeTo: EventEmitter<BillHistoryRouterDetails> = new EventEmitter();
  @Output() filterParamDetails: EventEmitter<BillHistoryFilterParams> = new EventEmitter();

  ngOnInit(): void {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }
  /**
   * This method is used to handle the changes in the input variables
   * @param changes
   * @memberof InputBaseComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.currentCurrency?.currentValue) {
      this.currentCurrencyLable = 'BILLING.' + changes.currentCurrency.currentValue;
    }
    if (changes?.billHistoryDetails?.currentValue) {
      this.billHistoryDetails = changes.billHistoryDetails.currentValue;
    }
    if (changes?.pageDetails?.currentValue) {
      this.pageDetails = changes.pageDetails.currentValue;
    }
  }
  /**
   *
   * @param amount method to trigger the amount select event
   */
  onSearchAmount(amount: number) {
    this.SearchAmount.emit(amount);
    this.selectPage(1);
  }
  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
      this.selectPageNo.emit(this.currentPage);
    }
  }
  /**
   *
   * @param index method to trigger routing to allocation page
   */
  routeToAllocation(index) {
    this.routeToDetails.destinationPageName = 'allocation';
    this.routeToDetails.index = index;
    this.routeTo.emit(this.routeToDetails);
  }
  /**
   *
   * @param index method to trigger routing to bill-details page
   */
  routeToDetailedBill(index) {
    this.routeToDetails.destinationPageName = 'bill-details';
    this.routeToDetails.index = index;
    this.routeTo.emit(this.routeToDetails);
  }
  /**
   *
   * @param index method to trigger routing to bill-summary page
   */
  routeToBillSummary(index) {
    this.routeToDetails.destinationPageName = 'bill-summary';
    this.routeToDetails.index = index;
    this.routeTo.emit(this.routeToDetails);
  }
  filterValues(filterparams: BillHistoryFilterParams) {
    this.pageDetails.currentPage = 1;
    this.filterParamDetails.emit(filterparams);
  }
}
