import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'blg-transaction-tracking-accordian-dc',
  templateUrl: './transaction-tracking-accordian-dc.component.html',
  styleUrls: ['./transaction-tracking-accordian-dc.component.scss']
})
export class TransactionTrackingAccordianDcComponent implements OnInit {
  @Input() heading: string = null;
  @Input() id = 'accordion';
  @Input() isOpen = false;
  @Input() isEmpty = false;

  constructor() {}

  ngOnInit(): void {}
}
