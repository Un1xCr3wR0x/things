import { Component, OnInit, Input } from '@angular/core';
import { BenefitRecalculation } from '../../../../shared';

@Component({
  selector: 'bnt-benefit-modification-details-dc',
  templateUrl: './benefit-modification-details-dc.component.html',
  styleUrls: ['./benefit-modification-details-dc.component.scss']
})
export class BenefitModificationDetailsDcComponent implements OnInit {
  @Input() benefitRecalculationDetails: BenefitRecalculation;
  constructor() {}

  ngOnInit(): void {}

  onTransactionView() {
    // navigate to transaction
  }
}
