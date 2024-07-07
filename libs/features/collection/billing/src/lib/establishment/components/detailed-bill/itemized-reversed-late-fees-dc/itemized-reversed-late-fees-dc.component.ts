import {Component, Input, OnInit} from '@angular/core';
import {BilingualText} from "@gosi-ui/core";
import {ItemizedLateFeesWrapper} from "@gosi-ui/features/collection/billing/lib/shared/models";

@Component({
  selector: 'blg-itemized-reversed-late-fees-dc',
  templateUrl: './itemized-reversed-late-fees-dc.component.html',
  styleUrls: ['./itemized-reversed-late-fees-dc.component.scss']
})
export class ItemizedReversedLateFeesDcComponent implements OnInit {

  // inputs
  @Input() exchangeRate = 1;
  @Input() currencyType: BilingualText;
  @Input() itemizedReversedLateFees: ItemizedLateFeesWrapper;

  constructor() { }

  ngOnInit(): void {
  }

}
