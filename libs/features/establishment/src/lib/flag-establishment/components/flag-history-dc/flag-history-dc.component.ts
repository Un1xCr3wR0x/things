/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { BilingualText, LanguageToken, Lov, LovList, SortDirectionEnum } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import {
  EstablishmentConstants,
  FilterKeyValue,
  FlagCreationTypeEnum,
  FlagDetails,
  FlagFilter,
  SORT_FLAG_LOV_VALUE_START_DATE
} from '../../../shared';
import { FlagFilterDcComponent } from '../flag-filter-dc/flag-filter-dc.component';

@Component({
  selector: 'est-flag-history-dc',
  templateUrl: './flag-history-dc.component.html',
  styleUrls: ['./flag-history-dc.component.scss']
})
export class FlagHistoryDcComponent implements OnInit, OnChanges {
  /**
   * Local Variables
   */
  lang: string;
  searchParam: number;
  loadedFlags: FlagDetails[] = [];
  pageSize = 10;
  isSearch = false;
  currentPage: number;
  sortValue: Lov;
  sortDirection: string;
  initialSortDirection = SortDirectionEnum.DESCENDING;
  initialSortValue = SORT_FLAG_LOV_VALUE_START_DATE;
  flagFilters: FilterKeyValue[] = [];
  userCreationType = FlagCreationTypeEnum.USER;

  //Input Variables
  @Input() inActiveFlags: FlagDetails[] = [];
  @Input() sortFlagsLovList: LovList;
  @Input() reasonList: LovList;
  @Input() creationTypeLovList: LovList;

  //Output Variables
  @Output() applySearch: EventEmitter<FlagFilter> = new EventEmitter();

  /** Child components */
  @ViewChild('flagFilter', { static: false })
  flagFilter: FlagFilterDcComponent;

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => (this.lang = language));
    const lov = new Lov();
    lov.value = this.initialSortValue;
    this.sortValue = lov;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.inActiveFlags && changes.inActiveFlags.currentValue) {
      this.loadedFlags = [];
      this.loadMore({ currentPage: 0, pageSize: this.pageSize });
    }
  }

  applySearhAndFilter(searchValue: number, filters: FilterKeyValue[], sortValue: Lov, direction: string) {
    this.flagFilters = filters;
    this.searchParam = searchValue ? searchValue : undefined;
    this.sortValue = sortValue;
    this.sortDirection = direction || this.initialSortDirection;
    const filterParam = new FlagFilter();
    filterParam.sortBy = sortValue;
    filterParam.sortOrder = this.sortDirection;
    filterParam.flagFilter = filters;
    filterParam.transactionId = this.searchParam;
    this.applySearch.emit(filterParam);
  }

  /**
   * Method to load more items in view
   * @param event
   */
  loadMore(event: { currentPage: number; pageSize: number }) {
    this.currentPage = event.currentPage;
    const currentIndex = event.currentPage * event.pageSize;
    this.loadedFlags.push(...this.inActiveFlags.slice(currentIndex, currentIndex + event.pageSize));
  }

  /**
   * method to cancel the filter from parent component
   */
  cancelFilter() {
    this.flagFilter?.cancelFilter();
  }

  getFlagInitiatedBy(flag: FlagDetails): BilingualText {
    return flag.creationType.english === this.userCreationType
      ? {
          english: flag?.initiatedBy?.english + ' (' + flag?.initiatedRole?.english + ')',
          arabic: flag?.initiatedBy?.arabic + ' (' + flag?.initiatedRole?.arabic + ')'
        }
      : { english: flag?.initiatedBy?.english, arabic: flag?.initiatedBy?.arabic };
  }

  onSelectInactiveTransactionIdDetails(referenceNo) {
    let url = '';
    url = '/establishment-private/#' + EstablishmentConstants.FLAG_TRACK_ROUTE(referenceNo);
    window.open(url, '_blank');
  }
}
