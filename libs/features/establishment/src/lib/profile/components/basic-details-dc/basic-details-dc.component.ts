/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  DropdownItem,
  Establishment,
  EstablishmentProfile,
  EstablishmentStatusEnum,
  Person,
  RoleIdEnum
} from '@gosi-ui/core';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/lib/search/services/dashboard-search.service';
import {
  EstablishmentActionEnum,
  EstablishmentRoutesEnum,
  EstablishmentTypeEnum,
  FlagConstants,
  FlagDetails,
  FlagTypeEnum,
  LegalEntityEnum,
  PaymentTypeEnum,
  filterGccCsr,
  EstablishmentService
} from '../../../shared';
import { Manager } from '../../../shared/models/manager';
import { RelationshipManager } from '../../../shared/models/relationship-manager';

@Component({
  selector: 'est-basic-details-dc',
  templateUrl: './basic-details-dc.component.html',
  styleUrls: ['./basic-details-dc.component.scss']
})
export class BasicDetailsDcComponent implements OnInit, OnChanges {
  main = EstablishmentTypeEnum.MAIN;
  branch = EstablishmentTypeEnum.BRANCH;
  registered = EstablishmentStatusEnum.REGISTERED;
  reopened = EstablishmentStatusEnum.REOPEN;
  reopenedClosingInProgress = EstablishmentStatusEnum.REOPEN_CLOSING_IN_PROGRESS;
  closeInProgress = EstablishmentStatusEnum.CLOSING_IN_PROGRESS;
  disableAdminsButton = false;
  adminsButtonTooltip: string;
  //Input Variables
  @Input() establishmentProfile: EstablishmentProfile;
  @Input() establishment: Establishment;
  @Input() owners: Person[];
  @Input() admins: Person[];
  @Input() relationshipManager: RelationshipManager;
  @Input() relationOfficerIamDetails: Manager;
  @Input() showNoOfBranches: boolean;
  @Input() ownersCount: number;
  @Input() canEditLegalEntity: boolean;
  @Input() canCloseEstablsihment: boolean;
  @Input() canEditPayment = true;
  @Input() actionDropdown: DropdownItem[];
  @Input() isViewOnly = false;
  @Input() showAdminButton = false;
  @Input() adminActionLabel = 'ESTABLISHMENT.MANAGE-ADMIN';
  @Input() noOfFlags: number;
  @Input() showFlags = false;
  @Input() closureTransactionId: number;
  @Input() flagMap: Map<string, FlagDetails[]>;
  @Input() compliant: boolean;
  @Input() showOwnerSection: boolean;
  @Input() showManageOwners: boolean;
  @Input() showLateFeeIndicator: boolean;
  @Input() showAddSuperAdmin = false;
  @Input() showCertificates = true;
  @Input() showMofPaymentDetails = false;
  @Input() isWorkflow = true;
  @Input() accessRoles: RoleIdEnum[] = [];
  @Input() accessRolesMof: RoleIdEnum[] = [];
  @Input() accessRolesForMCIEst: RoleIdEnum[] = [];
  @Input() accessIdentifier: number;
  @Input() isEligibleUser: boolean;
  @Input() isEligibleUserMof: boolean;
  @Input() hasCertificateViewAccess: boolean;
  @Input() showViolations: boolean;
  @Input() violationUnpaidCount: number;
  @Input() restrictDetailEdit = false;
  @Input() isAppPrivate: boolean;
  @Input() isPpa = false;
  @Input() commitmentIndicatorTotalRatio: string;
  @Input() accessRoleCreateNewPolicy: boolean;
  @Input() isRegisteredInHealthInsurance:boolean=false;

  @Output() editLegalEntity: EventEmitter<void> = new EventEmitter();
  @Output() editPayment: EventEmitter<void> = new EventEmitter();
  @Output() actionType: EventEmitter<EstablishmentActionEnum> = new EventEmitter();
  @Output() addFlags: EventEmitter<void> = new EventEmitter();
  @Output() allFlags: EventEmitter<void> = new EventEmitter();
  @Output() viewModal: EventEmitter<void> = new EventEmitter();
  @Output() modifyLateFee: EventEmitter<void> = new EventEmitter();
  @Output() viewMofPayment: EventEmitter<void> = new EventEmitter();
  @Output() viewCertificate: EventEmitter<void> = new EventEmitter();
  @Output() navigateToHealth: EventEmitter<void> = new EventEmitter();
  @Output() displayModal: EventEmitter<void> = new EventEmitter();
  @Output() violationClick: EventEmitter<void> = new EventEmitter();
  @Output() addScreenLink: EventEmitter<void> = new EventEmitter();
  @Output() modifyScreenLink: EventEmitter<void> = new EventEmitter();
  @Output() reopenEst: EventEmitter<EstablishmentActionEnum> = new EventEmitter();
  @Output() safetyHistory: EventEmitter<void> = new EventEmitter();
  @Output() viewCommitmentIndicator: EventEmitter<void> = new EventEmitter();
  @Output() navigateToHealthInsuranceDetails: EventEmitter<void> = new EventEmitter();

  minimumOwners = 1;
  maximumOwners = 5;

  id = 'basic-details';
  ownerLink = EstablishmentRoutesEnum.EST_OWNERS;
  lateFeeLabel: string;
  viewCertificatLabel = 'ESTABLISHMENT.CERTIFICATES';
  addNewPolicy = 'ESTABLISHMENT.CREATE-NEW-POLICY';
  certificateIcon = 'file-alt';
  helathInsuranceIcon = 'healthInsuranceGreen';
  addFlagAccessRoles = FlagConstants.ADD_FLAG_ACCESS_ROLES;
  viewFlagAccessRoles: RoleIdEnum[] = [];
  lateFeeIcon: string;
  paymentTypeValue: string;
  isLateFeeActive = false;
  restrictModifyOwner: boolean;

  indicatorsLabel = 'ESTABLISHMENT.COMMITMENT-INDICATORS';
  indicatorsIcon = 'chart-line';
  constructor(
    readonly router: Router,
    readonly dashboardSearchService: DashboardSearchService,
    readonly establishmentService: EstablishmentService
  ) {}

  ngOnInit() {
    if (this.establishmentProfile) {
      this.lateFeeLabel = this.hasLateFee() ? 'ESTABLISHMENT.LATE-FEE-APPL' : 'ESTABLISHMENT.LATE-FEE-NOT-APPL';
      this.lateFeeIcon = this.hasLateFee() ? 'has-late-fee' : 'no-late-fee';
      this.isLateFeeActive = this.hasLateFee();
    }
    this.establishment.blockTransactionFlags?.forEach(flag => {
      if (
        flag?.flagType?.english === FlagTypeEnum.BLOCK_SERVICE &&
        flag?.flagReason?.english === 'Manage Admins' &&
        flag?.status === 'Approved'
      ) {
        this.disableAdminsButton = true;
        this.adminsButtonTooltip = 'ESTABLISHMENT.ERROR.MANAGE-ADMINS-BLOCKED';
      }
    });
  }

  hasLateFee(): boolean {
    return this.establishment?.establishmentAccount?.lateFeeIndicator?.english === 'Yes';
  }

  ngOnChanges() {
    if (this.establishmentProfile) {
      if (this.showAddSuperAdmin) {
        this.adminActionLabel = 'ESTABLISHMENT.ADD-SUPER-ADMIN';
      }
      this.restrictModifyOwner =
        this.establishmentProfile?.legalEntity?.english === LegalEntityEnum.INDIVIDUAL && this.restrictDetailEdit
          ? true
          : false;
    }
    if (this.establishment) {
      this.viewFlagAccessRoles = filterGccCsr(FlagConstants.VIEW_FLAG_ACCESS_ROLES, this.establishment);
    }
    this.paymentTypeValue =
      this.establishment?.establishmentAccount?.paymentType?.english === PaymentTypeEnum.MOF
        ? 'ESTABLISHMENT.MOF-PAYMENT'
        : 'ESTABLISHMENT.SELF-PAYMENT';
  }

  /**
   * Method to trigger legal entity change
   */
  legalEntityAction() {
    this.editLegalEntity.emit();
  }
  /**
   * Method to trigger legal entity change
   */
  lateFeeAction() {
    this.modifyLateFee.emit();
  }
  /**
   * Method to trigger view mof details
   */
  mofAction() {
    this.viewMofPayment.emit();
  }

  emitAction(actionKey: EstablishmentActionEnum) {
    this.actionType.emit(actionKey);
  }
  /**
   * Method to navigate to add flag
   */
  addFlagDetails() {
    this.addFlags.emit();
  }
  /**
   * Method to navigate to view flag
   */
  viewAllFlags() {
    this.allFlags.emit();
  }
  /**
   * Method to navigate to view safety modal
   */
  viewModalDetails() {
    this.viewModal.emit();
  }
  displayDetails() {
    this.displayModal.emit();
  }
  navigateToAdd() {
    this.addScreenLink.emit();
  }
  navigateToModify() {
    this.modifyScreenLink.emit();
  }
}
