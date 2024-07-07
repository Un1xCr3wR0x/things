import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { BillDetails } from '../../models';

@Component({
  selector: 'blg-ppa-mof-establishment-tabset-dc',
  templateUrl: './ppa-mof-establishment-tabset-dc.component.html',
  styleUrls: ['./ppa-mof-establishment-tabset-dc.component.scss']
})
export class PpaMofEstablishmentTabsetDcComponent implements OnChanges {
  /* Input Variables */
  @Input() selectedTab: string;
  @Input() tabDetails;
  @Input() exchangeRate = 1;
  @Input() currencyType: BilingualText;
  @Input() billBalanceDetails: BillDetails;
    /* Output Variables */
  @Output() tabSelected: EventEmitter<string> = new EventEmitter();
  selectedDate: any;
  constructor() { }

 /* Method to fetch data on input changes*/
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.tabDetails?.currentValue) {
      this.tabDetails = changes.tabDetails.currentValue;
    }
     if (changes?.selectedTab?.currentValue) {
       this.selectedTab = changes.selectedTab.currentValue;
    }
     if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
    }
     if (changes?.exchangeRate?.currentValue) {
      this.exchangeRate = changes.exchangeRate.currentValue;
    }
  }

  /* Method to active tab on clicking*/
  activeTab(selectedTab: string) {
    this.tabSelected.emit(selectedTab);
  }
}
