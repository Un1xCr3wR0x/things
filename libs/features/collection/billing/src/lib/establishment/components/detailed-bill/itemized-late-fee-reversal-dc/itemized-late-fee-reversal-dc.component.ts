import { Component, Input, OnInit } from '@angular/core';
import { LateFeeReversalDetails } from '../../../../shared/models/late-fee-reversal-details';

@Component({
  selector: 'blg-itemized-late-fee-reversal-dc',
  templateUrl: './itemized-late-fee-reversal-dc.component.html',
  styleUrls: ['./itemized-late-fee-reversal-dc.component.scss']
})
export class ItemizedLateFeeReversalDcComponent implements OnInit {
  /*Input Variable*/
  @Input() LateFeeReversaldet: LateFeeReversalDetails = new LateFeeReversalDetails();

  /*Local Variable*/

  constructor() {}
  ngOnInit(): void {}
}
