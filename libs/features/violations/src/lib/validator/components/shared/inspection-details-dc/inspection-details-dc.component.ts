import { Component, OnInit, Input } from '@angular/core';
import { ViolationTransaction } from '../../../../shared/models';
import { InspectionChannel, ViolationsEnum } from '../../../../shared/enums';

@Component({
  selector: 'vol-inspection-details-dc',
  templateUrl: './inspection-details-dc.component.html',
  styleUrls: ['./inspection-details-dc.component.scss']
})
export class InspectionDetailsDcComponent implements OnInit {
  @Input() transactionDetails: ViolationTransaction;
  @Input() isViolatingProvision: boolean = false;
  @Input() isRaiseViolationFo: boolean = false;
  @Input() isRaiseVioFoVcm: boolean = false;
  channelRased = InspectionChannel.RASED;
  channelE_Inspection = InspectionChannel.E_INSPECTION;
  channelHrsd = InspectionChannel.HRSD;
  booleanYes = ViolationsEnum.BOOLEAN_YES;

  constructor() {}

  ngOnInit(): void {}
}
