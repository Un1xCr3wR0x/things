/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component } from '@angular/core';
import { BaseComponent, MenuItem, RouterConstants } from '@gosi-ui/core';
import menu from '../../../../../assets/jsons/menu.json';
/**
 * This is the component to show home component which wraps all the features
 *
 * @export
 * @class HomeComponent
 * @extends {BaseComponent}
 */
@Component({
  selector: 'est-home',
  templateUrl: 'home.component.html'
})
export class HomeComponent extends BaseComponent {
  menuItems: MenuItem[];
  /**
   * Creates an instance of HomeComponent
   * @memberof  HomeComponent
   *
   */
  constructor() {
    super();
    this.menuItems = menu.menuItems;
  }
}
