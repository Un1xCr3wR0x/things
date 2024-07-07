import { Component, Input, OnInit } from '@angular/core';
import { InspectionChannel, ViolationTransaction, ViolationsEnum } from '@gosi-ui/features/violations/lib/shared';

@Component({
  selector: 'vol-transaction-inspection-details-dc',
  templateUrl: './transaction-inspection-details-dc.component.html',
  styleUrls: ['./transaction-inspection-details-dc.component.scss']
})
export class TransactionInspectionDetailsDcComponent implements OnInit {
  @Input() transactionDetails: ViolationTransaction;
  @Input() isRaiseVioFoVcm: boolean = false;
  @Input() isRaiseViolationFo: boolean = false;
  @Input() isViolatingProvision: boolean = false;
  channelE_Inspection = InspectionChannel.E_INSPECTION;
  channelRased = InspectionChannel.RASED;
  channelHrsd = InspectionChannel.HRSD;
  booleanYes = ViolationsEnum.BOOLEAN_YES;

  constructor() {}

  ngOnInit(): void {}
}
