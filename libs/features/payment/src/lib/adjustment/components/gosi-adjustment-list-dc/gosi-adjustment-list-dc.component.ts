import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LovList, RoleIdEnum } from '@gosi-ui/core';

import { Adjustment, AdjustmentDetails } from '../../../shared';

@Component({
  selector: 'pmt-gosi-adjustment-list-dc',
  templateUrl: './gosi-adjustment-list-dc.component.html',
  styleUrls: ['./gosi-adjustment-list-dc.component.scss']
})
export class GosiAdjustmentListDcComponent implements OnInit {
  @Input() netAdjustments: AdjustmentDetails;
  @Input() adjustmentDetails: Adjustment[];
  @Input() debit: boolean;
  @Input() benefitList: LovList;
  @Input() adjustmentSort: LovList;
  @Input() direction: string;
  @Input() enablePayOnline: Boolean;
  @Input() payAdjustmentEligible: boolean;
  @Input() adjustmentModificationEligibilty: boolean;
  @Input() activeAdjustments: AdjustmentDetails;
  @Input() activeAdjustmentsExist: boolean;

  @Output() filterTransactions = new EventEmitter();
  @Output() sortOrder = new EventEmitter();
  @Output() sortList = new EventEmitter();
  @Output() navigateToBenefitDetails = new EventEmitter();
  @Output() navigateToAdjustment = new EventEmitter();
  @Output() navigateToCreate = new EventEmitter();
  @Output() navigateToPayAdjustment = new EventEmitter();
  @Output() navigateToAddModify = new EventEmitter();
  @Output() navigateToPayOnline = new EventEmitter();
  @Output() showEligibilityModal = new EventEmitter();

  editRole = [RoleIdEnum.CSR, RoleIdEnum.INSURANCE_BENEFIT_OPERATIONAL_OFFICER_TWO, RoleIdEnum.INSURANCE_BENEFIT_OPERATIONAL_OFFICER_ONE,RoleIdEnum.SUBSCRIBER, RoleIdEnum.VIC, RoleIdEnum.BENEFICIARY];
  constructor() {}

  ngOnInit(): void {}
  onAddMofifyAdjustment() {
    if (this.adjustmentModificationEligibilty) {
      this.navigateToAddModify.emit();
    } else {
      this.showEligibilityModal.emit();
    }
  }
  onAddAdjustment() {
    if (this.adjustmentModificationEligibilty) {
      this.navigateToCreate.emit();
    } else {
      this.showEligibilityModal.emit();
    }
  }
}
