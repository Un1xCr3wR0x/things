import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ItemizedRejectedOHWrapper } from '../../../../shared/models';

@Component({
  selector: 'blg-rejected-oh-claim-dc',
  templateUrl: './rejected-oh-claim-dc.component.html',
  styleUrls: ['./rejected-oh-claim-dc.component.scss']
})
export class RejectedOhClaimDcComponent implements OnInit, OnChanges {
  @Input() rejectedOhDetails: ItemizedRejectedOHWrapper;

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.rejectedOhDetails) this.rejectedOhDetails = changes.rejectedOhDetails.currentValue;
  }
}
