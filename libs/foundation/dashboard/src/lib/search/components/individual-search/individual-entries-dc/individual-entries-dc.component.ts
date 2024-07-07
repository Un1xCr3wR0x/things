/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme';
import { RequestLimit } from '../../../../shared';
import { Person, NIN, Iqama, NationalId, Passport, BorderNumber } from '@gosi-ui/core';
import { getIdentificationNumber } from '../../../utils';
@Component({
  selector: 'dsb-individual-entries-dc',
  templateUrl: './individual-entries-dc.component.html',
  styleUrls: ['./individual-entries-dc.component.scss']
})
export class IndividualEntriesDcComponent implements OnInit, OnChanges {
  /**
   * local variables
   */
  individualPagination = 'individualPagination';
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  itemsPerPage = 10;
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;
  /**
   * input variables
   */
  @Input() individualEntry: Person[];
  @Input() isRecent = false;
  @Input() individualSearchCount: number;
  @Input() limitItem: RequestLimit = new RequestLimit();
  /**
   * output variables
   */
  @Output() limit: EventEmitter<RequestLimit> = new EventEmitter();
  @Output() navigate: EventEmitter<Person> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  /**
   * method for pagination
   * @param pageNo
   */
  selectPage(pageNo: number) {
    if (pageNo - 1 !== this.limitItem.pageNo) {
      this.pageDetails.currentPage = pageNo;
      this.limitItem.pageNo = pageNo - 1;
      this.onLimit();
    }
  }
  /**
   * method to handle changes in the input variables
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.individualEntry && changes.individualEntry.currentValue)
      this.individualEntry = changes.individualEntry.currentValue;
    if (changes && changes.individualSearchCount && changes.individualSearchCount.currentValue)
      this.individualSearchCount = changes.individualSearchCount.currentValue;
    if (changes && changes.limitItem && changes.limitItem.currentValue) {
      this.limitItem = changes.limitItem.currentValue;
      this.pageDetails.currentPage = this.limitItem.pageNo + 1;
    }
  }
  /**
   * method to emit page number and page size
   */
  private onLimit() {
    this.limit.emit(this.limitItem);
  }
  onNavigate(person: Person) {
    this.navigate.emit(person);
  }
  /**
   * method to reset pagination
   */
  resetPagination() {
    this.pageDetails.currentPage = 1;
    this.limitItem.pageNo = 0;
    if (this.paginationDcComponent) this.paginationDcComponent.resetPage();
  }
  getIdentificationNumberDetails(identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber>) {
    return getIdentificationNumber(identity);
  }
}
