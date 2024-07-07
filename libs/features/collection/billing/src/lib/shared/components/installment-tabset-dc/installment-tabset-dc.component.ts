import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'blg-installment-tabset-dc',
  templateUrl: './installment-tabset-dc.component.html',
  styleUrls: ['./installment-tabset-dc.component.scss']
})
export class InstallmentTabsetDcComponent implements OnChanges {
  /*Local Variables*/
  @Input() tabList;
  @Input() selectedTab: string;

  /* Output Variables */
  @Output() tabSelected: EventEmitter<string> = new EventEmitter();

  constructor() {}

  /* Method to fetch data on input changes*/
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.selectedTab?.currentValue) {
      this.selectedTab = changes.selectedTab.currentValue;
    }
  }
  /* Method to active tab on clicking*/
  activeTab(tabSelected: string) {
    this.tabSelected.emit(tabSelected);
  }
}
