/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import {
  AlertTypeEnum,
  BilingualText,
  Establishment,
  EstablishmentProfile,
  EstablishmentStatusEnum,
  MobileDetails,
  RoleIdEnum,
  TransactionReferenceData
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EstablishmentConstants, EstablishmentTypeEnum, WorkFlowStatusType, isGccEstablishment, isGovOrSemiGov } from '../../../shared';

@Component({
  selector: 'est-establishment-details-dc',
  templateUrl: './establishment-details-dc.component.html',
  styleUrls: ['./establishment-details-dc.component.scss']
})
export class EstablishmentDetailsDcComponent implements OnInit, OnChanges {
  registrationNumber: number;
  @Input() establishment: Establishment = new Establishment();
  @Input() establishmentProfile: EstablishmentProfile = new EstablishmentProfile();
  @Input() editBasicDetailsMsg: string;
  @Input() editIdentifierDetailsMsg: string;
  @Input() identifierReferenceNo: number;
  @Input() basicReferenceNo: number;
  @Input() bankReferenceNo: number;
  @Input() contactReferenceNo: number;
  @Input() addressReferenceNo: number;
  @Input() editBankDetailsMsg: string;
  @Input() editContactDetailsMsg: string;
  @Input() editAddressDetailsMsg: string;
  @Input() canEditBasicDetails = false;
  @Input() canEditIdentifier = false;
  @Input() canEditBankDetails = false;
  @Input() canEditContactDetails = false;
  @Input() canEditAddressDetails = false;
  @Input() isViewOnly = false;
  @Input() hasDifferentLE;
  @Input() comments: TransactionReferenceData[];
  @Input() isMainRegistered = true;
  @Input() accessRoles: RoleIdEnum[] = [];
  @Input() accessRolesForMCIEst: RoleIdEnum[] = [];
  @Input() accessIdentifier: number;
  @Input() restrictDetailEdit = false;
  @Input() isAppPrivate: boolean;
  @Input() isMciEstablishment: boolean;
  @Input() toolTipMsg: string;
  @Input() canRefresh = false;
  @Input() isPpa = false;
  @Input() reopenedClosingInProgress: boolean = false;
  @Input() isProactive = false;
  @Input() canEditEstInfo = false;

  @Output() navigateToChange: EventEmitter<string> = new EventEmitter();
  @Output() refreshBasicDetails: EventEmitter<null> = new EventEmitter();
  establishmentName: BilingualText = new BilingualText();
  isGcc = false;
  main = EstablishmentTypeEnum.MAIN;

  errorMessage = '';

  isdCode: string;
  isAddressEmpty: boolean;
  isCancelled: boolean;
  transactionReferenceData: TransactionReferenceData[] = [];
  showAddressEmptyError: boolean;
  mainRegNoofGroup: number;
  rejectionReason: BilingualText = new BilingualText();
  warnigAlertType = AlertTypeEnum.WARNING;
  bsModalRef: BsModalRef;
  isEstClosed: boolean;
  isGOLWithoutUNN: boolean;
  accountStatus: string;

  constructor(readonly bsModalService: BsModalService) {}

  ngOnInit(): void {
    this.initialiseView();
    if (this.establishment.establishmentAccount?.bankAccount?.accountStatus) {
      this.accountStatus =
        'ESTABLISHMENT.BANK-ACCOUNT-STATUS.' + this.establishment.establishmentAccount?.bankAccount?.accountStatus;
    } else {
      this.accountStatus = null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.establishment && changes.establishment.currentValue) {
      this.isEstClosed = changes.establishment.currentValue.status.english === EstablishmentStatusEnum.CLOSED;
      this.initialiseView();
    }
  }

  initialiseView() {
    this.establishmentName = { ...this.establishment.name };
    this.establishmentName.english = this.establishmentName.english
      ? this.establishmentName.english
      : this.establishmentName.arabic;
    this.isGcc = isGccEstablishment(this.establishment);
    this.isdCode = this.getISDCodePrefix(this.establishment.contactDetails?.mobileNo);
    this.rejectionReason = this.getRejectionReason(this.comments);
    this.isAddressEmpty = this.establishment.contactDetails?.addresses?.length > 0 ? false : true;
    if (this.establishment.status.english === EstablishmentStatusEnum.CANCELLED) {
      this.isCancelled = true;
    } else {
      this.isCancelled = false;
    }
    this.isGOLWithoutUNN = !this.isAppPrivate && !this.isGcc && !this.establishment.unifiedNationalNumber && !isGovOrSemiGov(this.establishment.legalEntity.english) ;
  }

  /**
   * Method to get the isdcode prefix
   * @param isdCode
   */
  getISDCodePrefix(mobileNo: MobileDetails): string {
    let prefix;
    if (mobileNo === null || (mobileNo && mobileNo.primary === null)) {
      prefix = null;
    } else if (mobileNo && mobileNo.isdCodePrimary === null) {
      prefix = EstablishmentConstants.ISD_PREFIX_MAPPING.sa;
    } else {
      Object.keys(EstablishmentConstants.ISD_PREFIX_MAPPING).forEach(key => {
        if (mobileNo && key === mobileNo.isdCodePrimary) {
          prefix = EstablishmentConstants.ISD_PREFIX_MAPPING[key];
        }
      });
    }
    return prefix;
  }

  /**
   * method to hide the modal
   */
  hideModal() {
    this.bsModalRef.hide();
  }

  /**
   * Method to navigate to edit basic details
   */
  goToEditBasicDetails() {
    this.navigateToChange.emit(WorkFlowStatusType.BASICDETAILS);
  }

  /**
   * Method to navigate to edit identifier details
   */
  goToEditIdentifierDetails() {
    this.navigateToChange.emit(WorkFlowStatusType.IDENTIFIER);
  }

  /**
   * Method to navigate to edit bank details
   */
  goToEditBankDetails() {
    this.navigateToChange.emit(WorkFlowStatusType.BANKDETAILS);
  }
  /**
   * Method to navigate to edit contact details
   */
  goToEditContactDetails() {
    if (this.isAddressEmpty === true && !this.isGcc) {
      this.showAddressEmptyError = true;
    } else {
      this.navigateToChange.emit(WorkFlowStatusType.CONTACTDETAILS);
    }
  }
  /**
   * Method to navigate to edit contact details
   */
  goToEditAddressDetails() {
    this.navigateToChange.emit(WorkFlowStatusType.ADDRESSDETAILS);
  }
  /**
   * Method to get rejection reason
   * TODO Fix this method
   * @param establishment
   */
  getRejectionReason(comments: TransactionReferenceData[]) {
    if (!comments?.length) {
      return null;
    } else {
      for (const transactionReferenceData of comments) {
        if (transactionReferenceData.transactionStepStatus === 'Reject') {
          this.rejectionReason = transactionReferenceData.rejectionReason;
        } else {
          return null;
        }
      }
      return this.rejectionReason;
    }
  }

  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.bsModalRef = this.bsModalService.show(
      templateRef,
      Object.assign({}, { class: 'modal-lg modal-dialog-centered' })
    );
  }

  goToRefreshBasicDetails() {
    this.refreshBasicDetails.emit();
  }
}
