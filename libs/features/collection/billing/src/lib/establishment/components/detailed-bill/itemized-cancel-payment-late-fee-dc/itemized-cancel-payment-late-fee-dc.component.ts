import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BilingualText, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { ItemizedLateFee } from '../../../../shared/models';

@Component({
  selector: 'blg-itemized-cancel-payment-late-fee-dc',
  templateUrl: './itemized-cancel-payment-late-fee-dc.component.html',
  styleUrls: ['./itemized-cancel-payment-late-fee-dc.component.scss']
})
export class ItemizedCancelPaymentLateFeeDcComponent implements OnInit, OnChanges {
  lang = 'en';
  itemList: ItemizedLateFee = new ItemizedLateFee();
  /**
   * Input variable
   */
  @Input() cancelPaymentlateFeeDetails: ItemizedLateFee;
  @Input() showCancelPaymentLateFeeDetails: boolean;
  @Input() currencyType: BilingualText;
  @Input() exchangeRate = 1;
  /**
   * output variable
   */
  @Output() selectPage: EventEmitter<number> = new EventEmitter();
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {

   
    if (
      changes &&
      changes.cancelPaymentlateFeeDetails &&
      changes.cancelPaymentlateFeeDetails.currentValue &&
      !changes.cancelPaymentlateFeeDetails.isFirstChange())
      {
        this.cancelPaymentlateFeeDetails = changes.cancelPaymentlateFeeDetails.currentValue;
      }
    if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
      this.exchangeRate = changes.exchangeRate.currentValue;
    }
  
}
}

