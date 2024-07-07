import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { Router } from '@angular/router';
import { AppealRouteConstants, AppealValidatorRoles } from '@gosi-ui/features/appeals';

@Component({
  selector: 'appeals-request-summary',
  templateUrl: './request-summary.component.html',
  styleUrls: ['./request-summary.component.scss']
})
export class RequestSummaryComponent implements OnInit {
  @Input() title: BilingualText;
  @Input() transactionRefNo: string;
  @Input() identityNumber: string;
  @Input() initiatedDate: GosiCalendar;
  @Input() assigneeName: string;
  @Input() ninNumber: number;
  @Input() email: string;

  labelStyle = {
    value: { color: '#2B3DC3', 'font-weight': '450', 'text-decoration': 'underline', cursor: 'pointer' }
  };
  labelStyleTwo = {
    value: { 'font-weight': '500' }
  };
  labelName = {
    value: { 'font-weight': '600' }
  };
  isPPATransaction: boolean = false;

  constructor(readonly router: Router) {}

  ngOnInit(): void {}

  navigateToTransactionView(transactionId: any): void {
    if (this.isPPATransaction) return;
    localStorage.setItem('view', 'appealview');
    this.router.navigate([AppealRouteConstants.ROUTE_APPEAL_TRANSACTION_VIEW(transactionId)]);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.transactionRefNo && this.ninNumber) {
      if (this.IsPPA(+this.transactionRefNo)) {
        this.isPPATransaction = true;
      }
    }
  }

  IsPPA(id: number): boolean {
    const idAsString = id.toString();
    const firstFourDigits = parseInt(idAsString.substring(0, 4));

    return firstFourDigits >= 1400 && firstFourDigits <= new Date().getFullYear();
  }

  onNavigateToUserView(nin: any) {
    const url = '#/' + AppealRouteConstants.ROUTE_APPEAL_USER_VIEW(nin);
    window.open(url, '_blank');
  }
}
