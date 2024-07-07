import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DetailedBillViolationDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-violation-summary-tabel-dc',
  templateUrl: './violation-summary-tabel-dc.component.html',
  styleUrls: ['./violation-summary-tabel-dc.component.scss']
})
export class ViolationSummaryTabelDcComponent implements OnInit, OnChanges {
  @Input() violationDetails: DetailedBillViolationDetails;
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.violationDetails.currentValue) {
      this.violationDetails = changes.violationDetails.currentValue;
    }
  }
}
