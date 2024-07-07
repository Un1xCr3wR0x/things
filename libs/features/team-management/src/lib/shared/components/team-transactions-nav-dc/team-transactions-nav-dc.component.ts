/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { SearchDcComponent } from '@gosi-ui/foundation-theme';
import { TeamTransactionsFilterDcComponent } from '../team-transactions-filter-dc/team-transactions-filter-dc.component';
import { TeamTransactionsNav } from './team-transactions-nav-dc';
import { TabProps } from '../../enums';
import { RequestSort, LovList, SortDirectionEnum, Lov, BPMTaskConstants, BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'tm-team-transactions-nav-dc',
  templateUrl: './team-transactions-nav-dc.component.html',
  styleUrls: ['./team-transactions-nav-dc.component.scss']
})
export class TeamTransactionsNavDcComponent implements OnInit {
  /**
   * input variables
   */
  @Input() totalTransactions: number;
  @Input() selectedTransactions: number;
  @Input() searchParam = '';
  @Input() set action(key) {
    this.actionMessage =
      key === TabProps.ONHOLD_TRANSACTIONS ? TeamTransactionsNav.TO_UNHOLD_ACTION : TeamTransactionsNav.TO_HOLD_ACTION;
  }
  @Input() activeTab: string;
  @Input() sortItem: RequestSort;
  @Input() sortList: LovList;

  /**
   * output variables
   */
  @Output() searchValue: EventEmitter<string> = new EventEmitter();
  @Output() filterEvent: EventEmitter<string[]> = new EventEmitter();
  @Output() modalEvent: EventEmitter<string> = new EventEmitter();
  @Output() clearSelection: EventEmitter<null> = new EventEmitter();
  
  @Output() slaOlaFilter: EventEmitter<BilingualText[]> = new EventEmitter();

  @Output() sort: EventEmitter<RequestSort> = new EventEmitter();
  /**
   * local variables
   */
  keyBoardEvents: Array<string> = ['Enter', 'Backspace'];
  @ViewChild('search') search: SearchDcComponent;
  @ViewChild('filter') filter: TeamTransactionsFilterDcComponent;
  isSearched: boolean;

  actionMessage = [];

  constructor() {}

  ngOnInit(): void {}
  /**
   * reset navbar
   */
  resetNavBar() {
    if (this.search) this.search.control.reset();
    if (this.filter) this.filter.clearAllFitersWA();
  }
  /**
   *
   * @param value method to search transactions
   */
  searchTransaction(value) {
    this.searchParam = value;
    this.searchValue.emit(value);
    this.isSearched = true;
  }
  /**
   *
   * @param searchKey method to enable transaction search
   */
  onSearchEnable(searchKey: string, event: KeyboardEvent) {
    if (event !== null && !this.keyBoardEvents.includes(event.key)) return;
    if (!searchKey && this.search.searchbutton.nativeElement.contains(event.target)) {
      this.isSearched = false;
    }
    if (!searchKey && (this.isSearched || !this.search.searchbutton.nativeElement.contains(event.target))) {
      this.isSearched = false;
      this.searchParam = searchKey;
      this.searchValue.emit(searchKey);
    }
  }

  /**
   * Method to trigger the filter event
   * @param filter
   */
  onFilter(filter: string[]) {
    this.filterEvent.emit(filter);
  }
  /**
   *
   * @param key method emit modal
   */
  openModal(key) {
    this.modalEvent.emit(key);
  }
  /**
   * method to clear selection
   */
  clearSelectedTransactions() {
    this.clearSelection.emit();
  }

  /*
   * Method to get sorting order
   */
  sortOrderList(order: string) {
    if (order === SortDirectionEnum.ASCENDING) this.sortItem.direction = SortDirectionEnum.ASCENDING;
    else this.sortItem.direction = SortDirectionEnum.DESCENDING;
    this.onSort();
  }
  /**
   * Method to emit sort
   */
  private onSort(): void {
    this.sort.emit(this.sortItem);
  }
  /*
   * Method to get sorting list details
   */
  sortListDetails(sortBy: Lov) {
    this.sortItem.column = BPMTaskConstants.SORT_FOR_BPM_LIST.find(item => item.code === sortBy.code).column;
    this.sortItem.value = BPMTaskConstants.SORT_FOR_BPM_LIST.find(item => item.code === sortBy.code).value;
    this.onSort();
  }
  /**
   * Method to trigger the filter event
   * @param filter
   */
  onSlaOlaFilter(filter: BilingualText[]) {
    this.slaOlaFilter.emit(filter);
    
  }
}
