import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DisabilityAssessmentDetails, Recalculation, RecalculationAssessment } from '../../../../shared/models';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-recalculation-benefit-details-dc',
  templateUrl: './recalculation-benefit-details-dc.component.html',
  styleUrls: ['./recalculation-benefit-details-dc.component.scss']
})
export class RecalculationBenefitDetailsDcComponent implements OnInit {
  @Input() benefitDetails;
  @Input() benefitRecalculationDetails;
  @Input() currentBenefit: Boolean;
  @Input() isBenefitDetails: boolean;
  @Input() lumpsumToPension: boolean;
  @Input() disabilityAssessment: boolean;
  @Input() disabilityAssessmentData: DisabilityAssessmentDetails;
  @Input() isOcc;
  @Input() newBenefit: Boolean;
  @Input() recalculationDetails: Recalculation;
  @Input() lang = 'en';
  @Input() assessmentDetails: RecalculationAssessment;

  @Output() onViewPaymentHistoryClicked = new EventEmitter();
  @Output() onViewBenefitDetails = new EventEmitter();
  @Output() calculationDetails = new EventEmitter();

  constructor() {}
  ngOnInit(): void {}
  /* Method to navigate to payment history*/
  onViewPaymentHistory(benefitRecalculationDetails) {
    this.onViewPaymentHistoryClicked.emit(benefitRecalculationDetails);
  }
  onHowToCalculate() {
    this.calculationDetails.emit();
  }
  /** Method to check if benefit type contains lumpsum */
  isBenefitTypeLumpSum(benefitType: string) {
    if (benefitType) {
      return benefitType.toLowerCase().includes('lumpsum');
    } else {
      return false;
    }
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
  viewBenefitDetails() {
    this.onViewBenefitDetails.emit();
  }
}
