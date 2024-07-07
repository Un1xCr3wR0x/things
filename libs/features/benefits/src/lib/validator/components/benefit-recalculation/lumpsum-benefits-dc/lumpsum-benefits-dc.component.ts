import { Component, OnInit, Input } from '@angular/core';
import { RecalculationDetails } from '../../../../shared';

@Component({
  selector: 'bnt-lumpsum-benefits-dc',
  templateUrl: './lumpsum-benefits-dc.component.html',
  styleUrls: ['./lumpsum-benefits-dc.component.scss']
})
export class LumpsumBenefitsDcComponent implements OnInit {
  @Input() benefitRecalculationDetails: RecalculationDetails;

  constructor() {}

  ngOnInit(): void {}
}
