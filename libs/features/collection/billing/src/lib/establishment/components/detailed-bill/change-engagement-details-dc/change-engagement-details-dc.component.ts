import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BilingualText, CalendarTypeEnum } from '@gosi-ui/core';
import { ChangeEngagement, ChangeEngagementDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-change-engagement-details-dc',
  templateUrl: './change-engagement-details-dc.component.html',
  styleUrls: ['./change-engagement-details-dc.component.scss']
})
export class ChangeEngagementDetailsDcComponent implements OnInit, OnChanges {
  valueAvailble = true;
  itemizedLateFeeList: ChangeEngagementDetails[] = [];
  @Input() currencyType: BilingualText;
  @Input() changeEngagement: ChangeEngagement = new ChangeEngagement();
  @Input() pageNo: number;

  // @Output() adjustmentFilterDetails: EventEmitter<RequestList> = new EventEmitter();
  @Output() searchValues: EventEmitter<number> = new EventEmitter();
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();

  total: number;
  dateFormat = CalendarTypeEnum;
  sortOrder = 'ASC';
  currentSortColumn = 'CONTRIBUTOR_NAME_ENG';
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  currentPage = 0;
  noOfRecords = 0;
  itemsPerPage = 10;
  totalAmount = 0;
  lang = 'en';
  constructor() {}

  ngOnInit(): void {}
  /* Method to detect changes on input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
    }
    if (
      changes &&
      changes.changeEngagement &&
      changes.changeEngagement.currentValue &&
      !changes.changeEngagement.isFirstChange()
    ) {
      const data = changes.changeEngagement.currentValue;
      this.getItemizedLateFeeEngagementDetails(data);
      this.pageDetails.currentPage = this.pageNo + 1;
      this.pageDetails.goToPage = String(this.pageDetails.currentPage);
    }
    this.getItemizedLateFeeEngagementDetails(this.changeEngagement);
  }
  getItemizedLateFeeEngagementDetails(changeEngagement) {
    this.itemizedLateFeeList = changeEngagement.changeRequest;
    this.total = this.changeEngagement.total;
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
   * @param amount method to trigger the amount select event
   */
  onSearchValue(searchParam: number) {
    this.searchValues.emit(searchParam);
    if (searchParam === null) {
      this.searchValues.emit(undefined);
    }
  }
}
