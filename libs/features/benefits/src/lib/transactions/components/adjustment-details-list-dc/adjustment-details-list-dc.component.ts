import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bnt-adjustment-details-list-dc',
  templateUrl: './adjustment-details-list-dc.component.html',
  styleUrls: ['./adjustment-details-list-dc.component.scss']
})
export class AdjustmentDetailsListDcComponent implements OnInit {
  @Input() benefitRecalculationDetails;
  adjustments = [
    {
      name: 'John Doe',
      relationship: 'Son',
      amount: 13000
    },
    {
      name: 'Mohmed',
      relationship: 'Son',
      amount: 13000
    }
  ];
  constructor() {}

  ngOnInit(): void {}
}
