import { Component, OnInit, Input } from '@angular/core';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-saned-appeal-details-dc',
  templateUrl: './saned-appeal-details-dc.component.html',
  styleUrls: ['./saned-appeal-details-dc.component.scss']
})
export class SanedAppealDetailsDcComponent implements OnInit {
  @Input() contributorDetails;
  @Input() lang = 'en';
  constructor() {}

  ngOnInit(): void {}
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
