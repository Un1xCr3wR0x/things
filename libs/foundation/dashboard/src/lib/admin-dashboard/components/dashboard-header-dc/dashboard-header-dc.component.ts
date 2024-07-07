/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { LovList, BilingualText, Lov, SortDirectionEnum } from '@gosi-ui/core';
import { SearchDcComponent } from '@gosi-ui/foundation-theme';
import { SearchRequest, RequestFilter, RequestSort, EstablishmentSortConstants } from '@gosi-ui/foundation-dashboard';

@Component({
  selector: 'dsb-dashboard-header-dc',
  templateUrl: './dashboard-header-dc.component.html',
  styleUrls: ['./dashboard-header-dc.component.scss']
})
export class DashboardHeaderDcComponent implements OnInit, OnChanges {
  // input variables
  @Input() establishmentList = [];
  @Input() selectedEstablishment: BilingualText = null;
  @Input() canBack = false;
  @Input() isBranch = false;
  @Input() lang = 'en';
  @Input() location: BilingualText = null;
  @Input() villageLocationList: LovList;
  @Input() searchRequest: SearchRequest = new SearchRequest();
  @Output() back: EventEmitter<null> = new EventEmitter();
  @Output() selected: EventEmitter<number> = new EventEmitter();
  @Output() searchValue: EventEmitter<string> = new EventEmitter();
  @Output() filterEvent: EventEmitter<RequestFilter> = new EventEmitter();
  @Output() sort: EventEmitter<RequestSort> = new EventEmitter();
  keyBoardEvents: Array<string> = ['Enter', 'Backspace'];
  @ViewChild('search') search: SearchDcComponent;
  sortRequest = new RequestSort();
  isSearched: boolean;
  searchParam = '';
  actionMessage = [];
  sortList: LovList;
  sortValue: BilingualText = new BilingualText();
  constructor() {}

  ngOnInit(): void {}
  /*
   * Method to detect changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.searchRequest && changes.searchRequest.currentValue) {
      this.initiateSort();
      this.searchRequest = changes.searchRequest.currentValue;
      this.sortRequest = changes.searchRequest.currentValue.sort;
    }
  }
  /**
   * method to emit on back event
   */
  onBack() {
    this.back.emit();
  }
  /**
   *
   * @param registartionNo method to emit selected est
   */
  onSelect(registartionNo: number) {
    this.selected.emit(registartionNo);
  }
  /**
   * Method to search establishments
   * @param value
   */
  searchEstablishments(value) {
    this.searchParam = value;
    this.searchValue.emit(value);
    this.isSearched = true;
  }
  onSearchEnable(searchKey: string) {
    if (!searchKey && this.isSearched) {
      this.isSearched = false;
      this.searchParam = searchKey;
      this.searchValue.emit(searchKey);
    }
  }
  onFilter(filterValue: RequestFilter) {
    this.filterEvent.emit(filterValue);
  }
  initiateSort() {
    this.sortList = new LovList(EstablishmentSortConstants.SORT_FOR_ESTABLISHMENT);
    this.sortValue = EstablishmentSortConstants.SORT_FOR_ESTABLISHMENT[0].value;
  }
  directionToggle(order) {
    this.sortRequest.direction = order;
    this.onSort();
  }
  onSortItemSelected(sortBy: Lov) {
    this.sortRequest.column = EstablishmentSortConstants.SORT_FOR_ESTABLISHMENT.find(
      item => item.code === sortBy.code
    ).column;
    this.onSort();
  }
  /**
   * Method to emit sort
   */
  onSort(): void {
    this.sort.emit(this.sortRequest);
  }
}
