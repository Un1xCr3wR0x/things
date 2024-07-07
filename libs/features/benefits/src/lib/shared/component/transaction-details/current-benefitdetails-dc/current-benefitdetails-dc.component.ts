import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AnnuityResponseDto } from '../../../../shared/models';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-current-benefitdetails-dc',
  templateUrl: './current-benefitdetails-dc.component.html',
  styleUrls: ['./current-benefitdetails-dc.component.scss']
})
export class CurrentBenefitdetailsDcComponent implements OnInit {
  /*Local Variable*/
  @Input() benefitDetails: AnnuityResponseDto;
  @Input() benefitRecalculationDetails;
  @Input() lang = 'en';

  @Output() onViewPaymentClicked = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  /** Method to navigate to view payment history */
  onViewPaymentHistory(benefitDetails) {
    this.onViewPaymentClicked.emit(benefitDetails);
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
