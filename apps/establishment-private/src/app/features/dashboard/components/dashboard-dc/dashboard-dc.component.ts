/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent, MenuItem } from '@gosi-ui/core';
import menu from '../../../../../assets/jsons/menu.json';

@Component({
  selector: 'est-dashboard-dc',
  templateUrl: './dashboard-dc.component.html',
  styleUrls: ['./dashboard-dc.component.scss']
})
export class DashboardDcComponent extends BaseComponent implements OnInit {
  /**
   * Input variables
   */
  @Input() menuItems: MenuItem[];

  /**
   * Initialize fields inside constructor
   */
  constructor() {
    super();
    this.menuItems = menu.menuItems.filter(item => item.isEstablishmentRequired !== true);
  }

  ngOnInit() {}
}
