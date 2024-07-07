import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-wage-recalculation-dc',
  templateUrl: './wage-recalculation-dc.component.html',
  styleUrls: ['./wage-recalculation-dc.component.scss']
})
export class WageRecalculationDcComponent implements OnInit {
  @Input() benefitDetails;
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
  viewBenefitDetails() {
    this.onViewBenefitDetails.emit();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
