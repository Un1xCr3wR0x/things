import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-benefit-recalculation-dc',
  templateUrl: './benefit-recalculation-dc.component.html',
  styleUrls: ['./benefit-recalculation-dc.component.scss']
})
export class BenefitRecalculationDcComponent implements OnInit {
  @Input() benefitDetails;
  @Input() benefitCalculationDetails;
  @Input() benefitRecalculationDetails;
  @Input() lang = 'en';

  @Output() onCalculationBtnClicked = new EventEmitter();
  @Output() onViewPaymentClicked = new EventEmitter();
  @Output() onViewBenefitDetails = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  showBenefitCalculation() {
    this.onCalculationBtnClicked.emit(null);
  }
  /** Method to navigate to view payment history */
  onViewPaymentHistory(benefitDetails) {
    this.onViewPaymentClicked.emit(benefitDetails);
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
  viewBenefitDetails() {
    this.onViewBenefitDetails.emit();
  }
}