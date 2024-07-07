/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EstablishmentAllocationDetails, BranchBreakup, MofAllocationBreakupFilter } from '../../../shared/models';

@Component({
  selector: 'blg-mof-establishment-allocation-dc',
  templateUrl: './mof-establishment-allocation-dc.component.html',
  styleUrls: ['./mof-establishment-allocation-dc.component.scss']
})
export class MofEstablishmentAllocationDcComponent implements OnInit {
  /**LocaL Variable */
  paginationId = 'allocationDetails';
  itemsPerPage = 10;
  currentPage = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };

  /** Input variables. */
  @Input() estAllocationDetails: EstablishmentAllocationDetails;
  @Input() branchDetails: BranchBreakup[];

  /** Output varaibles. */
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();
  @Output() searchAmountValue: EventEmitter<number> = new EventEmitter();
  @Output() filterDetails: EventEmitter<MofAllocationBreakupFilter> = new EventEmitter();
  /**
   * Creates an instance of ReceiptBreakupDcComponent
   * @param language
   */
  constructor() {}

  /** Initializes the component. */
  ngOnInit() {}

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
  onSearchAmount(regNo: number) {
    this.pageDetails.currentPage = 1;
    this.searchAmountValue.emit(regNo);
  }
  searchAmount(res) {
    if (res === '') {
      this.pageDetails.currentPage = 1;
      this.searchAmountValue.emit();
    }
  }
  filterReceipts(filterDet: MofAllocationBreakupFilter) {
    this.pageDetails.currentPage = 1;
    this.filterDetails.emit(filterDet);
  }
}
