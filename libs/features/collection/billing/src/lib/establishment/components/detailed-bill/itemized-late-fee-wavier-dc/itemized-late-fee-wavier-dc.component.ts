import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { LateFeeWavierWrapper } from '../../../../shared/models/late-fee-wavier-wrapper';
import { LateFeeWaiveOff } from '../../../../shared/models/late-fee-waiveoff';
import { WaiveOffDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-itemized-late-fee-wavier-dc',
  templateUrl: './itemized-late-fee-wavier-dc.component.html',
  styleUrls: ['./itemized-late-fee-wavier-dc.component.scss']
})
export class ItemizedLateFeeWavierDcComponent implements OnInit, OnChanges {
  /*Input Variable*/
  @Input() lateFeeWavier: LateFeeWaiveOff = new LateFeeWaiveOff();
  @Input() exchangeRate = 1;
  @Input() currencyType: BilingualText;
  /*Local Variable*/
  lateFeeWaviers: WaiveOffDetails[] = [];

  constructor() {}
  ngOnInit(): void {}
  /* Method to detect changes on input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.exchangeRate?.currentValue) {
      this.exchangeRate = changes.exchangeRate.currentValue;
    }
    if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
    }
  }
}
