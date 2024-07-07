/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BranchList, EstablishmentTypeEnum } from '../../../../shared';

@Component({
  selector: 'est-establishment-list-dc',
  templateUrl: './establishment-list-dc.component.html',
  styleUrls: ['./establishment-list-dc.component.scss']
})
export class EstablishmentListDcComponent implements OnInit {
  /**
   * Input variables
   */
  @Input() establishments: BranchList[];
  @Input() itemsPerPage = 10;
  @Input() pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  @Input() currentPage = 1;
  @Input() totalBranches: number;
  @Input() paginationId: string;
  @Input() showDelinkStatus = false;
  @Input() showNewStatus = false;
  @Input() newGroupMainRegistrationNo;
  main = EstablishmentTypeEnum.MAIN;

  //Output Variables

  @Output() pageIndexEvent: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  /**
   *
   * @param page method to trigger the page select event
   */
  selectedPage(page: number): void {
    if (page !== this.pageDetails.currentPage) {
      this.pageIndexEvent.emit(page);
    }
  }
}
