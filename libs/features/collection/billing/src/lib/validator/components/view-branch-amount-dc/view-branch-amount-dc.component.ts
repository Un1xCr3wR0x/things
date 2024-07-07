/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BilingualText, CurrencySar } from '@gosi-ui/core';
import { BranchBreakup } from '../../../shared/models';

@Component({
  selector: 'blg-view-branch-amount-dc',
  templateUrl: './view-branch-amount-dc.component.html',
  styleUrls: ['./view-branch-amount-dc.component.scss']
})
export class ViewBranchAmountDcComponent implements OnChanges {
  /** Input variables */
  @Input() branchBreakup: BranchBreakup[];
  @Input() currency: BilingualText;
  @Input() showOutsideGroup: boolean;
  @Input() gccFlag: boolean;
  /** Local variables */
  otherCurrency = false;
  noOfRecords: 400;
  paginationIdInside = 'insideBranchAllocation';
  paginationIdOutside = 'OutsideBranchAllocation';
  itemsPerPage = 10;
  currentPageInside = 1;
  currentPageOutside = 1;
  pageDetailsInside = {
    currentPage: 1,
    goToPage: ''
  };
  pageDetailsOutside = {
    currentPage: 1,
    goToPage: ''
  };
  insideLength = 0;
  outsideLength = 0;
  insideBranch: BranchBreakup[] = [];
  outsideBranch: BranchBreakup[] = [];
  /** Method to get values on unput changes */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.currency && changes.currency.currentValue) {
      if (this.currency.english !== CurrencySar.ENGLISH) {
        this.otherCurrency = true;
      } else {
        this.otherCurrency = false;
      }
    }
    if (changes.branchBreakup && changes.branchBreakup.currentValue) {
      this.branchBreakup.forEach(res => {
        if (res.outsideGroup === true) this.outsideBranch.push(res);
        else this.insideBranch.push(res);
      });
      this.insideLength = this.insideBranch.length;
      this.outsideLength = this.outsideBranch.length;
    }
  }
  selectedPageInside(page) {
    if (this.pageDetailsInside.currentPage !== page) {
      this.pageDetailsInside.currentPage = this.currentPageInside = page;
    }
  }
  selectedPageOutside(page) {
    if (this.pageDetailsOutside.currentPage !== page) {
      this.pageDetailsOutside.currentPage = this.currentPageOutside = page;
    }
  }
}
