/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input } from '@angular/core';
import { BaseComponent, MenuItem } from '@gosi-ui/core';
import menu from '../../../../../assets/jsons/menu.json';
/**
 * This is the component to show home component which wraps all the features
 *
 * @export
 * @class HomeDcComponent
 * @extends {BaseComponent}
 */
@Component({
  selector: 'cntr-home-dc',
  templateUrl: 'home-dc.component.html'
})
export class HomeDcComponent extends BaseComponent {
  @Input()
  menuItems: MenuItem[];

  showRouterOutlet = false;
  /**
   * Creates an instance of HomeDcComponent
   * @memberof  HomeDcComponent
   *
   */

  constructor() {
    super();
    this.menuItems = menu.menuItems;
  }
}
