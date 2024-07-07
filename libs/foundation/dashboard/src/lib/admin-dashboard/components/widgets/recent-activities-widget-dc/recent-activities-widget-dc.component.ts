/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RecentActivityWrapper } from '../../../models';
import { BilingualText, statusBadge } from '@gosi-ui/core';
import { DashboardConstants } from '../../../constants';

@Component({
  selector: 'dsb-recent-activities-widget-dc',
  templateUrl: './recent-activities-widget-dc.component.html',
  styleUrls: ['./recent-activities-widget-dc.component.scss']
})
export class RecentActivitiesWidgetDcComponent implements OnInit {
  //local variables
  minHeight = DashboardConstants.CARD_MIN_HEIGHT;
  // input variables
  @Input() recentActivityList: RecentActivityWrapper[];
  // output variables
  @Output() load: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  /**
   *
   * @param status method to set status
   */
  statusBadgeType(status: BilingualText) {
    return statusBadge(status.english);
  }
  /**
   * method to emit load more
   */
  viewMore() {
    this.load.emit();
  }
}
