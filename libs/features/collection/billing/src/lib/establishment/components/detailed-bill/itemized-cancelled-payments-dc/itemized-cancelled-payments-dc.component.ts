import {Component, Input, OnInit,  SimpleChanges} from '@angular/core';
import {BilingualText} from "@gosi-ui/core";
import { ReceiptWrapper } from "../../../../shared/models/receipt-wrapper";

@Component({
  selector: 'blg-itemized-cancelled-payments-dc',
  templateUrl: './itemized-cancelled-payments-dc.component.html',
  styleUrls: ['./itemized-cancelled-payments-dc.component.scss']
})
export class ItemizedCancelledPaymentsDcComponent implements OnInit {

  // Inputs
  @Input() cancledReceiptDetails: ReceiptWrapper;
  @Input() exchangeRate = 1
  @Input() currencyType: BilingualText;

  // local variables
  total = 0;
  constructor() { }

  ngOnInit(): void {
  }
 
  ngOnChanges(changes: SimpleChanges){
    if (changes?.currencyType?.currentValue) {
      this.currencyType = changes.currencyType.currentValue;
    }
    if (changes?.exchangeRate?.currentValue) {
      this.exchangeRate = changes.exchangeRate.currentValue;
    }
    if(this.cancledReceiptDetails.receiptDetailDto.length > 0){
      this.cancledReceiptDetails.receiptDetailDto.forEach(receipt => {
        this.total += receipt.amountReceived;
      })
    } 
    }
  }


