import { Component, OnInit, Input } from '@angular/core';
import moment from 'moment';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-modification-details-dc',
  templateUrl: './modification-details-dc.component.html',
  styleUrls: ['./modification-details-dc.component.scss']
})
export class ModificationDetailsDcComponent implements OnInit {
  @Input() modificationDetails;
  @Input() benefitRecalculationDetails;
  @Input() pageName;
  @Input() lang: string;

  constructor() {}

  ngOnInit(): void {}

  getMonths(startDate, endDate) {
    return moment(endDate).diff(startDate, 'months');
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
