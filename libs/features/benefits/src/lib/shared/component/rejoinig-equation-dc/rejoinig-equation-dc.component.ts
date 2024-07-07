/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bnt-rejoinig-equation-dc',
  templateUrl: './rejoinig-equation-dc.component.html',
  styleUrls: ['./rejoinig-equation-dc.component.scss']
})
export class RejoinigEquationDcComponent implements OnInit {
  rejoinType: string;
  after = 'AFTER';
  before = 'BEFORE';
  status = true;
  constructor() {}

  ngOnInit(): void {}

  clickEventBefore() {
    this.rejoinType = this.before;
    this.status = false;
  }
  clickEventAfter() {
    this.rejoinType = this.after;
    this.status = true;
  }
}
