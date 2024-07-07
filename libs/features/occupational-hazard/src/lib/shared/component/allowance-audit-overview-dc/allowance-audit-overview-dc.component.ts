import { Component, OnInit, Input } from '@angular/core';
import { MonthYearLabel } from '../../enums';
import { AllowanceList } from '../../models/allowance-list';
import moment from 'moment';

@Component({
  selector: 'oh-allowance-audit-overview-dc',
  templateUrl: './allowance-audit-overview-dc.component.html',
  styleUrls: ['./allowance-audit-overview-dc.component.scss']
})
export class AllowanceAuditOverviewDcComponent implements OnInit {
  constructor() {}
  @Input() auditDetails: AllowanceList;
  ngOnInit(): void {}
  //Get Batch Month
  getBatchMonth() {
    if (this.auditDetails?.batchMonth?.gregorian) {
      return Object.values(MonthYearLabel)[moment(this.auditDetails.batchMonth.gregorian).toDate().getMonth()];
    } else {
      return null;
    }
  }
  //Get Batch Year
  getBatchYear() {
    if (this.auditDetails?.batchMonth?.gregorian) {
      return moment(this.auditDetails.batchMonth.gregorian).toDate().getFullYear().toString();
    } else {
      return null;
    }
  }
}
