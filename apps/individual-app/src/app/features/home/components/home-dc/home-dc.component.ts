/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, HostListener, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApplicationTypeToken, BaseComponent, MenuItem } from '@gosi-ui/core';
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
  templateUrl: 'home-dc.component.html'
})
export class HomeDcComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() menuItems: MenuItem[];
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {
    super();
    this.menuItems = menu.menuItems;
  }
  width;
  mobileView: boolean;
  ipad = true;
  @HostListener('window:resize', ['$event'])
  ngOnInit() {
    this.onWindowResize();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.onWindowResize();
    if (changes && changes.menuItems && changes.menuItems.currentValue) {
      this.menuItems = changes.menuItems.currentValue;
    }
  }
  onWindowResize() {
    this.width = window.innerWidth;
    // mobile view size changed
    if (this.width < 768) {
      this.mobileView = true;
    } else this.mobileView = false;
  }
}
