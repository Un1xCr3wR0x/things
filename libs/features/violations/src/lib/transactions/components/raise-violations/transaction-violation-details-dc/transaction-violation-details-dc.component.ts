import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  InspectionChannel,
  ViolationTransaction,
  ViolationTransactionId
} from '@gosi-ui/features/violations/lib/shared';

@Component({
  selector: 'vol-transaction-violation-details-dc',
  templateUrl: './transaction-violation-details-dc.component.html',
  styleUrls: ['./transaction-violation-details-dc.component.scss']
})
export class TransactionViolationDetailsDcComponent implements OnInit {
  rasedChannel = InspectionChannel.RASED;
  eInspectionChannel = InspectionChannel.E_INSPECTION;
  simisChannel = InspectionChannel.SIMIS;
  foValidatorTxn = ViolationTransactionId.FO_VALIDATOR;
  foVcmTxn = ViolationTransactionId.FO_VCM;

  @Input() violationData: ViolationTransaction;
  @Input() isCancelEngagement: boolean;
  @Input() isModifyTerminationDate: boolean;
  @Input() isModifyJoiningDate: boolean;
  @Input() isaddEngagement: boolean;
  @Input() isIncorrectWage: boolean;
  @Input() isIncorrectReason: boolean;
  @Input() transactionId: number;
  @Input() isReportViolationTransaction: boolean = false;
  @Input() isInjuryViolation: boolean;
  
  @Input() isTransactionCompleted: boolean;
  @Output() navigateToValidatorTxn: EventEmitter<number> = new EventEmitter();
  @Output() profileNavigation: EventEmitter<{ violationId: number; regNo: number }> = new EventEmitter();
  // @Input() lang = 'en';
  // @Output() navigateToEst: EventEmitter<number> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  /**
   * Method to get the violation type
   */
  getViolationType() {
    if (this.violationData) {
      const type = this.violationData.repeatedViolation;
      if (!type) {
        return 'VIOLATIONS.NO';
      } else {
        return 'VIOLATIONS.YES';
      }
    }
  }
  navigateToTxn(transactionNumber) {
    this.navigateToValidatorTxn.emit(transactionNumber);
  }
  navigateToViolationProfile() {
    const data = {
      violationId: this.violationData?.violationId,
      regNo: this.violationData?.establishmentInfo?.registrationNo
    };
    this.profileNavigation.emit(data);
  }
}
