import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'blg-record-tabset-dc',
  templateUrl: './record-tabset-dc.component.html',
  styleUrls: ['./record-tabset-dc.component.scss']
})
export class RecordTabsetDcComponent implements OnChanges {
  constructor() {}

  /* Input Variables */
  @Input() selectedTab: string;
  @Input() billTabs;

  /* Output Variables */
  @Output() tabSelected: EventEmitter<string> = new EventEmitter();

  /* Method to fetch data on input changes*/
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.billTabs?.currentValue) {
      this.billTabs = changes.billTabs.currentValue;
    }
    if (changes?.selectedTab?.currentValue) {
      this.selectedTab = changes.selectedTab.currentValue;
    }
  }

  /* Method to active tab on clicking*/
  activeBillTab(tabSelected: string) {
    this.tabSelected.emit(tabSelected);
  }
}
