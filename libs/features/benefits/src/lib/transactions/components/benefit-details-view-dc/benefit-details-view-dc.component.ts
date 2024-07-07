import { Component, OnInit, Input } from '@angular/core';
import { AmountDetails, Benefits } from '../../../shared';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-benefit-details-view-dc',
  templateUrl: './benefit-details-view-dc.component.html',
  styleUrls: ['./benefit-details-view-dc.component.scss']
})
export class BenefitDetailsViewDcComponent implements OnInit {
  @Input() benefits: Benefits;
  @Input() benefitAmount: AmountDetails;
  @Input() recalcDtls;
  @Input() benefitDetails;
  @Input() pageName;
  @Input() returnBenefitDetails;
  @Input() lang = 'en';
  constructor() {}

  ngOnInit(): void {}
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
