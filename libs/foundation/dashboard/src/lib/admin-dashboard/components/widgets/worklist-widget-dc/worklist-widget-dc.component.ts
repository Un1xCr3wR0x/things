/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit } from '@angular/core';
import { DashboardConstants } from '../../../constants';

@Component({
  selector: 'dsb-worklist-widget-dc',
  templateUrl: './worklist-widget-dc.component.html',
  styleUrls: ['./worklist-widget-dc.component.scss']
})
export class WorklistWidgetDcComponent implements OnInit {
  currentTab = 0;
  minHeight = DashboardConstants.CARD_MIN_HEIGHT;
  constructor() {}

  ngOnInit(): void {}
  onSelect(index: number) {}
}
