/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit, HostListener, SimpleChanges } from '@angular/core';
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
    this.menuItems = menu.menuItems;
  }
  width;
  mobileView: boolean;
  ngOnInit() {
    this.onWindowResize();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.onWindowResize();
    if (changes && changes.menuItems && changes.menuItems.currentValue) {
      this.menuItems = changes.menuItems.currentValue;
    }
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.width = window.innerWidth;
    // mobile view size changed
    if (this.width < 768) {
      this.mobileView = true;
    } else this.mobileView = false;
  }
}
