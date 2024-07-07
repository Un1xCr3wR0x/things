/*
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReporteeObject } from '../../models';
import { TabProps } from '../../enums';

@Component({
  selector: 'tm-team-transactions-side-dc',
  templateUrl: './team-transactions-side-dc.component.html',
  styleUrls: ['./team-transactions-side-dc.component.scss']
})
export class TeamTransactionsSideDcComponent implements OnInit {
  /**
   * input variables
   */
  @Input() teamMemberList: ReporteeObject[] = [];
  @Input() selectedTab: string;
  @Input() allTransactionsCount = 0;
  @Input() onholdTransactionsCount = 0;
  @Input() showCount = true;
  /**
   * output variables
   */
  @Output() changeMember: EventEmitter<string> = new EventEmitter();
  /**
   * local variables
   */
  tabEnums = TabProps;

  isDropdownActive = false;

  constructor() {}

  ngOnInit(): void {}
  /**
   *
   * @param value method to change tab
   */
  tabChange(value) {
    this.isDropdownActive = false;
    this.selectedTab = value;
    this.changeMember.emit(value);
  }
  /**
   * method to oprn dropdown
   */
  openDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }
}
