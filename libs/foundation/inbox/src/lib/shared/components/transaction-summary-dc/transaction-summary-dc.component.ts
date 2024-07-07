/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, Input } from '@angular/core';
import { AlertService, BPMPriorityResponse, BpmPendingCount, Tab } from '@gosi-ui/core';
import { InboxTabConstants } from '../../constants';

@Component({
  selector: 'ibx-transaction-summary-dc',
  templateUrl: './transaction-summary-dc.component.html',
  styleUrls: ['./transaction-summary-dc.component.scss']
})
export class TransactionSummaryDcComponent implements OnInit, OnChanges {
  /**
   *
   * Input variables
   */
  @Input() performancePriority: BPMPriorityResponse = new BPMPriorityResponse();
  @Input() performanceCount: BpmPendingCount = new BpmPendingCount();
  /**
   *
   * Output variables
   */
  @Output() selectedDay: EventEmitter<number> = new EventEmitter();
  @Output() clearSearch: EventEmitter<boolean> = new EventEmitter();
  /**
   *
   * Local variables
   */
  activeInDropdown = false;
  showDropDown = false;
  inboxTabs: Tab[] = [];
  isToday = true;
  isWeek = false;
  isMonth = false;
  completeCount = 0;
  pendingCount = 0;
  defaultSelection = 1;
  totalCount = 0;
  clearSearchTransaction: boolean = false;
  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.inboxTabs = InboxTabConstants.getInboxTabs;
    this.getTransactionPriorityState(1);
    this.alertService.getAlerts().subscribe(alerts => {
      if(alerts.length > 0) {
        this.clearSearchTransaction = true;
      } else {
        this.clearSearchTransaction = false;
      }
      // this.clearSearch.emit(this.clearSearchTransaction);
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.performancePriority && changes.performancePriority.currentValue) {
        this.performancePriority = changes.performancePriority.currentValue;
        this.totalCount =
          this.performancePriority.high + this.performancePriority.medium + this.performancePriority.low;
      }
      if (changes.performanceCount && changes.performanceCount.currentValue) {
        this.performanceCount = changes.performanceCount.currentValue;
        this.pendingCount = this.performanceCount.pending;
        this.completeCount = this.performanceCount.completed;
      }
    }
  }

  getTransactionPriorityState(days: number) {
    this.setActive(days);
    this.selectedDay.emit(days);
    this.defaultSelection = days;
  }
  onDropDownClick() {
    this.showDropDown = !this.showDropDown;
  }
  setActive(days) {
    this.isToday = days === 1 ? true : false;
    this.isWeek = days === 7 ? true : false;
    this.isMonth = days === 30 ? true : false;
  }

}
