/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { AdjustmentDetailsDto } from '../../shared/models/adjustment-details';
import { ApplicationTypeEnum, ApplicationTypeToken, RoleIdEnum } from '@gosi-ui/core';

@Component({
  selector: 'bnt-adjustment-details-dc',
  templateUrl: './adjustment-details-dc.component.html',
  styleUrls: ['./adjustment-details-dc.component.scss']
})
export class AdjustmentDetailsDcComponent implements OnInit {
  viewModify = [RoleIdEnum.CSR, RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE, RoleIdEnum.SUBSCRIBER, RoleIdEnum.VIC, RoleIdEnum.BENEFICIARY,RoleIdEnum.INSURANCE_BENEFIT_OPERATIONAL_OFFICER_ONE];

  @Input() adjustmentsDetails: AdjustmentDetailsDto;
  @Input() adjustmentEligibility = false;

  @Output() navigateToAdd = new EventEmitter();
  @Output() navigateToAddModify: EventEmitter<null> = new EventEmitter();
  @Output() navigateToAdjustmentById = new EventEmitter();
  @Output() showEligibilityModal = new EventEmitter();
  isIndividualApp: boolean;
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}

  ngOnInit(): void {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
  }
  onAddMofifyAdjustment() {
    if (this.adjustmentEligibility) {
      this.navigateToAddModify.emit();
    } else {
      this.showEligibilityModal.emit();
    }
  }
  onAddAdjustment() {
    if (this.adjustmentEligibility) {
      this.navigateToAdd.emit();
    } else {
      this.showEligibilityModal.emit();
    }
  }
}
