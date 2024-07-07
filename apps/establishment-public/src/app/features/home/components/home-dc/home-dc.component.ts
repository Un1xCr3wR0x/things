/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input } from '@angular/core';
import { BaseComponent, MenuItem, MenuService } from '@gosi-ui/core';
import menu from '../../../../../assets/jsons/menu.json';
/**
 * This is the component to show home component which wraps all the features
 *
 * @export
 * @class HomeDcComponent
 * @extends {BaseComponent}
 */
@Component({
  selector: 'est-home-dc',
  templateUrl: 'home-dc.component.html',
  styleUrls: ['./home-dc.component.scss']
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

  constructor(readonly menuService: MenuService) {
    super();
    if (this.menuService.isPpaEstablishment) {
      this.menuItems = menu.menuItems.filter(item => item.isPpaEstablishment !== true);
    } else this.menuItems = menu.menuItems;
  }
}
