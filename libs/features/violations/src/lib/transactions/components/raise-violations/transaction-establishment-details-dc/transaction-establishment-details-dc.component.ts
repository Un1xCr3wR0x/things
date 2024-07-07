import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViolationTransaction, ViolationTransactionId } from '@gosi-ui/features/violations/lib/shared';

@Component({
  selector: 'vol-transaction-establishment-details-dc',
  templateUrl: './transaction-establishment-details-dc.component.html',
  styleUrls: ['./transaction-establishment-details-dc.component.scss']
})
export class TransactionEstablishmentDetailsDcComponent implements OnInit {
  foVcmTxn = ViolationTransactionId.FO_VCM;
  @Input() violationData: ViolationTransaction;
  @Input() transactionId: number;
  @Input() isReportViolationTransaction: boolean = false;
  @Input() lang = 'en';
  @Output() navigateToEst: EventEmitter<number> = new EventEmitter();
  @Output() viewPreviousViolation: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  /**
   * Method to navigate to establishment profile page
   */
  navigateToProfile(registrationNo) {
    this.navigateToEst.emit(registrationNo);
  }
  viewPreviousViolations() {
    this.viewPreviousViolation.emit();
  }
}
