/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BillingConstants } from '../../constants';
import { Router } from '@angular/router';
import { convertToYYYYMMDD } from '@gosi-ui/core';

@Component({
  selector: 'blg-allocation-tabset-dc',
  templateUrl: './allocation-tabset-dc.component.html',
  styleUrls: ['./allocation-tabset-dc.component.scss']
})
export class AllocationTabsetDcComponent implements OnChanges {
  constructor(private router: Router) {}

  /* Input Variables */
  @Input() selectedTab: string;
  @Input() tabList;
  @Input() selectedDate? = '';
  @Input() billIssueDate? = '';
  @Input() fromPage?: string;

  /* Output Variables */
  @Output() tabSelected: EventEmitter<string> = new EventEmitter();

  /* Local Variables */
  contributionTotal = 0;
  adjustmentTotal = 0;
  creditTotal = 0;
  rejectedOhClaimsTotal = 0;
  violationTotal = 0;
  installmentTotal = 0;
  lateFeeTotal = 0;
  Url: string;

  /* Method to fetch data on input changes*/
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.selectedDate?.currentValue) {
      this.selectedDate = changes.selectedDate.currentValue;
    }
    if (changes?.billIssueDate?.currentValue) {
      this.billIssueDate = changes.billIssueDate.currentValue;
    }
    if (changes?.selectedTab?.currentValue) {
      this.selectedTab = changes.selectedTab.currentValue;
    }
  }

  /* Method to active tab on clicking*/
  activeTab(tabSelected: string) {
    if (this.fromPage !== 'contributorAllocation') {
      if (tabSelected === 'BILLING.ALLOCATION-OF-CREDITS') {
        this.Url = BillingConstants.ROUTE_CONTRIBUTOR_CREDIT_ALLOCATION;
      }
      if (this.selectedDate && this.billIssueDate !== '') {
        this.router.navigate([this.Url], {
          queryParams: {
            monthSelected: convertToYYYYMMDD(this.selectedDate),
            billIssueDate: this.billIssueDate
          }
        });
      }
    } else {
      this.tabSelected.emit(tabSelected);
    }
  }
}
