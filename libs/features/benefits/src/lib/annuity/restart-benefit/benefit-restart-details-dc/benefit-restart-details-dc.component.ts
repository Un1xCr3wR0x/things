import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LanguageToken, formatDate } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BenefitPaymentDetails, HoldBenefitDetails } from '../../../shared/models';

@Component({
  selector: 'bnt-benefit-restart-details-dc',
  templateUrl: './benefit-restart-details-dc.component.html',
  styleUrls: ['./benefit-restart-details-dc.component.scss']
})
export class BenefitRestartDetailsDcComponent implements OnInit, OnChanges {
  //Local Variables
  adjustments = [];
  benefitDetails = [];
  lang = 'en';
  //Input Variables
  @Input() benefitPaymentDetails: BenefitPaymentDetails = new BenefitPaymentDetails();
  @Input() inEditMode: boolean;
  @Input() restartEditdetails: HoldBenefitDetails = new HoldBenefitDetails();
  @Input() restartCalculations: HoldBenefitDetails = new HoldBenefitDetails();
  @Output() onViewBenefitDetails = new EventEmitter();
  /**
   *
   * @param language
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(lang => (this.lang = lang));
  }
  //Method to detect changes in input property
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.restartCalculations) this.restartCalculations = changes.restartCalculations.currentValue;
    if (changes && changes.restartEditdetails) this.restartEditdetails = changes.restartEditdetails.currentValue;
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
  viewBenefitDetails() {
    this.onViewBenefitDetails.emit();
  }
}
