import { Component, Input, OnInit } from '@angular/core';
import { MonthReceipt } from '../../../../shared/models';

@Component({
  selector: 'blg-bill-receipt-details-dc',
  templateUrl: './bill-receipt-details-dc.component.html',
  styleUrls: ['./bill-receipt-details-dc.component.scss']
})
export class BillReceiptDetailsDcComponent implements OnInit {
  @Input() receipts: MonthReceipt[];
  constructor() {}

  ngOnInit(): void {}
}
