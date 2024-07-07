import { Component, OnInit, Input } from '@angular/core';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-contribution-detail-dc',
  templateUrl: './contribution-detail-dc.component.html',
  styleUrls: ['./contribution-detail-dc.component.scss']
})
export class ContributionDetailDcComponent implements OnInit {
  @Input() lang = 'en';
  @Input() benefitRecalculationDetails;
  constructor() {}

  ngOnInit(): void {}
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
