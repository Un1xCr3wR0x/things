import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AnnuityResponseDto, AverageMonthlyWagePeriod, BenefitDetails, BenefitRecalculation } from '../../models';

@Component({
  selector: 'bnt-benefit-calc-details-dc',
  templateUrl: './benefit-calc-details-dc.component.html',
  styleUrls: ['./benefit-calc-details-dc.component.scss']
})
export class BenefitCalcDetailsDcComponent implements OnInit {
  @Input() averageMonthlyWagePeriods: AverageMonthlyWagePeriod[];
  @Input() benefitCalculationDetails: BenefitDetails;
  @Input() benefitRecalculationDetails: BenefitRecalculation;
  @Input() activeBenefitDetails: AnnuityResponseDto;
  @Input() eligibleForPensionReform = false;
  @Input() isRecalculation = false;
  /**
   * Output
   */
  @Output() close = new EventEmitter();

  calcType: string;
  constructor() {}

  ngOnInit(): void {
    this.calcType = 'newBenefit';
  }

  closeModal() {
    this.close.emit();
  }
  calcTypeChange(calcType) {
    if (calcType === 'newBenefit') {
      this.calcType = 'newBenefit';
    } else {
      this.calcType = 'currentBenefit';
    }
  }
}
