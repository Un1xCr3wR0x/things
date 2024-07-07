/* Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EstablishmentStatusEnum, RoleIdEnum, dayDifference } from '@gosi-ui/core';
import {
  Establishment,
  EstablishmentService,
  InspectionDetails,
  InspectionOriginEnum,
  InspectionStatusEnum,
  OHRate,
  SafetyInspectionConstants,
  filterGccCsr
} from '../../../shared';

@Component({
  selector: 'est-compliance-modal-dc',
  templateUrl: './compliance-modal-dc.component.html',
  styleUrls: ['./compliance-modal-dc.component.scss']
})
export class ComplianceModalDcComponent implements OnInit, OnChanges {
  deltaValue: Map<string, number> = SafetyInspectionConstants.DELTA_VALUES();
  inspectionStatusInitiated = InspectionStatusEnum.INITIATED;
  ameenReinspection = InspectionOriginEnum.AMEEN;
  rasedReinspection = InspectionOriginEnum.RASED;
  hasReinspectionDateExceded = false;
  createReinspectionAccessRoles: RoleIdEnum[] = [];
  @Input() inspectionDetails: InspectionDetails;
  @Input() establishment: Establishment;
  @Input() ohDetails: OHRate;

  @Output() closeModal: EventEmitter<null> = new EventEmitter();
  @Output() onRequest = new EventEmitter();
  isRegistered: boolean;
  buttonName: string;
  isRoleAdmin: boolean = false;

  constructor(readonly establishmentService: EstablishmentService) {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.establishment && changes.establishment.currentValue) {
      this.isRegistered = changes.establishment.currentValue.status?.english === EstablishmentStatusEnum.REGISTERED;
      this.createReinspectionAccessRoles = filterGccCsr(
        SafetyInspectionConstants.CREATE_INSPECTION_ACCESS_ROLES,
        changes.establishment.currentValue
      );
      this.isRoleAdmin = this.establishmentService.isUserEligible(
        SafetyInspectionConstants.CREATE_INSPECTION_ACCESS_ROLES_OH
      );
    }
    if (changes && changes.ohDetails && changes.ohDetails.currentValue) {
      if (
        changes.ohDetails.currentValue.currentOhRate - changes.ohDetails.currentValue.baseRate ===
        this.deltaValue.get('medium')
      ) {
        this.buttonName = 'ESTABLISHMENT.REQ-EARLY-MID-REINSPECTION';
        // 3 to 2
      } else if (
        changes.ohDetails.currentValue.currentOhRate - changes.ohDetails.currentValue.baseRate ===
        this.deltaValue.get('max')
      ) {
        this.buttonName = 'ESTABLISHMENT.REQ-EARLY-MAX-REINSPECTION';
      }
    }
    if (
      changes &&
      changes.inspectionDetails?.currentValue &&
      changes.inspectionDetails?.currentValue?.reInspectionDate?.gregorian
    ) {
      this.hasReinspectionDateExceded =
        dayDifference(new Date(), new Date(changes.inspectionDetails.currentValue.reInspectionDate.gregorian)) < 0
          ? true
          : false;
    }
  }

  ngOnInit(): void {}

  submit() {
    this.onRequest.emit();
  }
}
