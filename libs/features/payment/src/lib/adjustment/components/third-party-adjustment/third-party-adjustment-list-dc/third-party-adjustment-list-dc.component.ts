/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, TemplateRef, OnChanges } from '@angular/core';
import { Alert, BilingualText, FilterKeyValue, Lov, LovList, RoleIdEnum, SortDirectionEnum } from '@gosi-ui/core';
import {
  Adjustment,
  AdjustmentStatus,
  EligibilityCheckStatus,
  AdjustmentConstants,
  AdjustmentDetails
} from '@gosi-ui/features/payment/lib/shared';
import { EligibilityDetails } from '@gosi-ui/features/payment/lib/shared/models/eligibility-details';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'pmt-third-party-adjustment-list-dc',
  templateUrl: './third-party-adjustment-list-dc.component.html',
  styleUrls: ['./third-party-adjustment-list-dc.component.scss']
})
export class ThirdPartyAdjustmentListDcComponent implements OnInit, OnChanges {
  // Input Varaibles
  @Input() sortList: LovList;
  @Input() adjustmentDetails: Adjustment[];
  @Input() adjustmentFilters: FilterKeyValue[];
  @Input() searchParam: string;
  @Input() benefitTypeLovList: LovList;
  @Input() requestedByLovList: LovList;
  @Input() filterStatusList: BilingualText[];
  @Input() sortByinit: BilingualText[];
  @Input() popupFlag: Boolean;
  @Input() elibilityResponse: EligibilityDetails;
  @Input() eligibilityWarningMsg: Alert;
  @Input() tpaDebit: boolean;
  @Input() netAdjustmentAmount: number;
  @Input() monthlyAdjustmentAmount: number;
  @Input() netTpaAdjustments: AdjustmentDetails;

  // Output Varaibles
  @Output() filterTransactions: EventEmitter<FilterKeyValue[]> = new EventEmitter();
  @Output() sortOrder: EventEmitter<string> = new EventEmitter();
  @Output() sortBy: EventEmitter<Lov> = new EventEmitter();
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() navigateToAddModifyDet: EventEmitter<Boolean> = new EventEmitter();
  @Output() navigateToTpaPage: EventEmitter<number> = new EventEmitter();
  // Local Varaibles
  createTpaAccessRoles = AdjustmentConstants.CREATE_TPA_ACCESS_ROLES;
  activeStatus = AdjustmentStatus.ACTIVE;
  onHoldStatus = AdjustmentStatus.ON_HOLD;
  initSortDirection = SortDirectionEnum.ASCENDING;
  manageButtonFlag = false;
  modalRef: BsModalRef;
  showWarning = false;
  editRole = [RoleIdEnum.CSR, RoleIdEnum.INSURANCE_BENEFIT_OPERATIONAL_OFFICER_TWO, RoleIdEnum.INSURANCE_BENEFIT_OPERATIONAL_OFFICER_ONE,RoleIdEnum.SUBSCRIBER, RoleIdEnum.VIC, RoleIdEnum.BENEFICIARY];
  constructor(readonly modalService: BsModalService) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.elibilityResponse && changes.elibilityResponse.currentValue) {
        this.elibilityResponse = changes.elibilityResponse.currentValue;
        if (
          this.elibilityResponse.eligibility.find(staus => staus.key === EligibilityCheckStatus.ACTIVEADJUSTMENT)
            ?.eligible
        ) {
          this.manageButtonFlag = true;
        }
      }
    }
  }
  // Method used to navigate to add/manage adjustment page
  navigateToAddModify() {
    this.navigateToAddModifyDet.emit(this.manageButtonFlag);
  }
  // Method used to hide modal content
  hideModal() {
    this.modalRef.hide();
  }
  // Method used to show modal content
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  navigateToThirdPartyAdjustment(value) {
    this.navigateToTpaPage.emit(value);
  }
}
