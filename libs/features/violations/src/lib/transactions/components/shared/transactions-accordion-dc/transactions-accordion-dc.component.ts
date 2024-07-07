import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'vol-transactions-accordion-dc',
  templateUrl: './transactions-accordion-dc.component.html',
  styleUrls: ['./transactions-accordion-dc.component.scss']
})
export class TransactionsAccordionDcComponent implements OnInit {
  isOpen = false;
  isEmpty = false;
  @Input() heading: string = null;
  constructor() {}

  ngOnInit(): void {}
}
