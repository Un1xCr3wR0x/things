/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DropdownItem } from '@gosi-ui/core';

@Component({
  selector: 'gosi-tabset-dc',
  templateUrl: './tabset-dc.component.html',
  styleUrls: ['./tabset-dc.component.scss']
})
export class TabsetDcComponent implements OnInit, OnChanges {
  currentTab = 0;
  tabs: DropdownItem[];
  dropdownItems: DropdownItem[];
  @Input() selectedId: number;
  private _initialTabsCount = 4;

  @Input() groups: DropdownItem[];
  @Input()
  set initialTabsCount(count) {
    this._initialTabsCount = count;
    const index = this.groups?.findIndex(item => item.id === this.selectedId) || -1;
    if (index !== -1) {
      const temp = this.groups.slice(index, index + 1);
      this.splitTabs([...temp, ...this.groups.slice(0, index), ...this.groups.slice(index + 1)]);
    } else {
      this.splitTabs(this.groups);
      this.selectedId = +this.tabs?.[0]?.id;
    }
  }
  get initialTabsCount() {
    return this._initialTabsCount;
  }

  @Output() selectId: EventEmitter<number> = new EventEmitter();

  /**
   * Method to intisalise the object
   */
  constructor() {}

  /**
   * Method to initalise the component
   */
  ngOnInit(): void {
    if (this.groups) {
      this.splitTabs(this.groups);
      this.selectedId = this.selectedId || +this.tabs[0]?.id;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.groups?.currentValue) {
      this.splitTabs(this.groups);
      this.selectedId = this.selectedId || +this.tabs[0]?.id;
    }
  }

  /**
   * Method to split the tabs into tabs and dropdowns
   * @param tabs
   */
  splitTabs(tabs: DropdownItem[]) {
    if (tabs?.length > this.initialTabsCount) {
      const noOfTabsInView = this.initialTabsCount - 1; //If items more than initial tab count show more as the last tab.
      this.tabs = tabs.slice(0, noOfTabsInView);
      this.dropdownItems = tabs.slice(noOfTabsInView, tabs.length);
    } else {
      this.tabs = tabs;
      this.dropdownItems = [];
    }
  }

  /**
   * Method to select the tab
   * @param tabId
   * @param regNo
   */
  selectTab(tabId: number, regNo: number) {
    if (this.selectedId !== regNo) {
      this.selectId.emit(regNo);
    }
    this.selectedId = regNo;
    this.currentTab = tabId;
  }

  /**
   * Method to select the tab from dropdown
   * @param id
   */
  selectFromDropdown(id: number) {
    if (this.selectedId !== id) {
      this.selectId.emit(id);
    }
    this.selectedId = id;
    const index = this.dropdownItems.findIndex(item => item.id === id);
    if (index !== -1) {
      const temp = this.dropdownItems.splice(index, 1);
      this.splitTabs([...temp, ...this.tabs, ...this.dropdownItems]);
    }
  }
}
