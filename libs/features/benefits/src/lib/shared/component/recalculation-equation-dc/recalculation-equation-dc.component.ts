import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BenefitDetails, RecalculationGroupedPeriod, SwitchTitle } from '../../models';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-recalculation-equation-dc',
  templateUrl: './recalculation-equation-dc.component.html',
  styleUrls: ['./recalculation-equation-dc.component.scss']
})
export class RecalculationEquationDcComponent implements OnInit {
  @Input() benefitCalculationDetails: BenefitDetails;
  @Input() lang;
  @Input() isSaned = false;
  @Input() sanedRecalculationDetails: RecalculationGroupedPeriod;
  @Input() calculationModalTitle: SwitchTitle;

  @Output() closeButtonClicked = new EventEmitter();
  selected = 0;
  totalNewLawMonths = 0;
  totalOldLawMonths = 0;
  averageMonthlyTotal = 0;
  totalBenefit = 0;
  pensionAmount = 0;
  totalPensionAmount = 0;

  constructor() {}

  ngOnInit(): void {
    this.getNetAmount();
    this.getPensionAmount();
  }
  selectSwitch(index) {
    this.selected = index;
  }
  closeModal() {
    this.closeButtonClicked.emit();
  }
  // method to get the net amount
  getNetAmount() {
    if (this.benefitCalculationDetails && this.benefitCalculationDetails.averageMonthlyWagePeriods) {
      this.benefitCalculationDetails.averageMonthlyWagePeriods.forEach(monthlyWage => {
        this.totalOldLawMonths = this.totalOldLawMonths + monthlyWage.noOfOldLawMonths;
        this.totalNewLawMonths = this.totalNewLawMonths + monthlyWage.noOfNewLawMonths;
        this.totalBenefit = this.totalBenefit + monthlyWage.benefitAmount;
        this.averageMonthlyTotal = this.averageMonthlyTotal + monthlyWage.averageMonthlyWage;
      });
    }
  }
  getPensionAmount() {
    this.pensionAmount = (15 / 100) * this.totalBenefit;
    this.totalPensionAmount = this.pensionAmount + this.totalBenefit;
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
