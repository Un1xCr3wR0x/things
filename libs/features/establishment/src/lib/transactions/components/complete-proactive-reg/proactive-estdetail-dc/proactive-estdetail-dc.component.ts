import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AddressTypeEnum,
  AlertService,
  Autobind,
  DocumentService,
  Establishment,
  isAddressEmpty,
  RouterConstants,
  TransactionService,
  AddressDetails,
  isEmptyObject,
  isObject,
  AppConstants
} from '@gosi-ui/core';
import {
  AddEstablishmentService,
  ChangeEstablishmentService,
  EstablishmentService
} from '@gosi-ui/features/establishment/lib/shared';
import { noop } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TransactionsBaseScComponent } from '../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-proactive-estdetail-dc',
  templateUrl: './proactive-estdetail-dc.component.html',
  styleUrls: ['./proactive-estdetail-dc.component.scss']
})
export class ProactiveEstdetailDcComponent extends TransactionsBaseScComponent implements OnInit {
  @Input() establishment: Establishment = null;
  @Input() isBranch = false;
  @Input() isGcc = false;
  @Input() showCrn = false;
  readonly nationalType = AddressTypeEnum.NATIONAL;
  readonly poAddressType = AddressTypeEnum.POBOX;
  readonly foriegnType = AddressTypeEnum.OVERSEAS;
  isLegalEntityModified: boolean;
  isLicenseModified: boolean;
  isLicenseIssueModified: boolean;
  isLicenseAuthorityModified: boolean;
  isLicenseExpiryModified: boolean;
  isEngNameModified: boolean;
  isStartDateModified: boolean;
  isTypeModified: boolean;
  isNationalAddressChanged = false;
  isPoxAddressChanged = false;
  iscCurrentMailingAddressChanged = false;
  isMobileNoModified: boolean;
  isTeleNoModified: boolean;
  isTeleExtNoModified: boolean;
  isEmailModified: boolean;

  constructor(
    readonly documentService: DocumentService,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly transactionService: TransactionService,
    readonly location: Location,
    readonly router: Router,
    readonly addEstService: AddEstablishmentService,
    readonly changeEstablishmentService: ChangeEstablishmentService
  ) {
    super(establishmentService, transactionService, alertService, addEstService, documentService, router);
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentData();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  getEstablishmentData() {
    if (!this.isTransactionCompleted) {
      this.getChangeEstData();
    } else {
      this.getChangeEstUpdateData();
    }
  }

  // Method to get the old transaction changes

  getChangeEstData() {
    this.getEstablishmentTransientDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedEstData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  // Method to get the new transaction changes

  getChangeEstUpdateData() {
    this.getEstablishmentTransientAuditDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedEstData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  @Autobind
  getCurrentAndModifiedEstData(EstData: [Establishment, Establishment]) {
    const [estOldData, estNewData] = EstData;
    this.establishment = estOldData;
    this.estToValidate = estNewData;
    if (this.establishment?.gccEstablishment !== null && this.establishment?.gccCountry === true) {
      this.isGCC = true;
    }
    if (this.establishment?.legalEntity?.english !== this.estToValidate?.legalEntity?.english) {
      this.isLegalEntityModified = true;
    }
    if (this.establishment?.license?.number !== this.estToValidate?.license?.number) {
      this.isLicenseModified = true;
    }
    if (this.establishment?.license?.issuingAuthorityCode !== this.estToValidate?.license?.issuingAuthorityCode) {
      this.isLicenseAuthorityModified = true;
    }
    if (this.establishment?.license?.issueDate?.gregorian !== this.estToValidate?.license?.issueDate?.gregorian) {
      this.isLicenseIssueModified = true;
    }
    if (this.establishment?.license?.expiryDate?.gregorian !== this.estToValidate?.license?.expiryDate?.gregorian) {
      this.isLicenseExpiryModified = true;
    }
    if (this.establishment?.name?.english !== this.estToValidate?.name?.english) {
      this.isEngNameModified = true;
    }
    if (this.establishment?.startDate?.gregorian !== this.estToValidate?.startDate?.gregorian) {
      this.isStartDateModified = true;
    }
    if (this.establishment?.establishmentType === this.estToValidate?.establishmentType) {
      this.isTypeModified = false;
    }
    if (this.establishment?.contactDetails?.mobileNo?.primary !== this.estToValidate?.contactDetails?.mobileNo?.primary) {
      this.isMobileNoModified = true;
    }
    if (
      this.establishment?.contactDetails?.telephoneNo?.primary !==
      this.estToValidate?.contactDetails?.telephoneNo?.primary
    ) {
      this.isTeleNoModified = true;
    }
    if (
      this.establishment?.contactDetails?.telephoneNo?.extensionPrimary !==
      this.estToValidate?.contactDetails?.telephoneNo?.extensionPrimary
    ) {
      this.isTeleExtNoModified = true;
    }
    if (this.establishment?.contactDetails?.emailId?.primary !== this.estToValidate?.contactDetails?.emailId?.primary) {
      this.isEmailModified = true;
    }
    this.iscCurrentMailingAddressChanged =
      estNewData?.contactDetails?.currentMailingAddress !== estOldData?.contactDetails?.currentMailingAddress;

    const nationalAddress = this.getAddress(AddressTypeEnum.NATIONAL, this.estToValidate?.contactDetails?.addresses);
    const poBoxAddress = this.getAddress(AddressTypeEnum.POBOX, this.estToValidate?.contactDetails?.addresses);
    const oldNationalAddress = this.getAddress(AddressTypeEnum.NATIONAL, this.establishment?.contactDetails?.addresses);
    const oldPoBoxAddress = this.getAddress(AddressTypeEnum.POBOX, this.establishment?.contactDetails?.addresses);

    if (!isAddressEmpty(nationalAddress) || !isAddressEmpty(oldNationalAddress))
      this.isNationalAddressChanged = !this.isDeepEqual(oldNationalAddress, nationalAddress);
    if (!isAddressEmpty(poBoxAddress) || !isAddressEmpty(oldPoBoxAddress))
      this.isPoxAddressChanged = !this.isDeepEqual(oldPoBoxAddress, poBoxAddress);
  }

  /**
   * Method to get the particular address from array
   * @param type
   */
  getAddress(type, addressDetail: AddressDetails[]): AddressDetails {
    if (addressDetail) {
      return addressDetail.find(address => address.type === type) || new AddressDetails();
    } else {
      return new AddressDetails();
    }
  }
  isDeepEqual = (object1: Object, object2: Object) => {
    if (isEmptyObject(object1) || isEmptyObject(object2)) return false;

    if (isEmptyObject(object1) && isEmptyObject(object2)) return true;

    const objKeys1 = Object.keys(object1);
    const objKeys2 = Object.keys(object2);
    if (objKeys1.length !== objKeys2.length) return false;

    for (var key of objKeys1) {
      const value1 = object1[key];
      const value2 = object2[key];

      const isObjects = isObject(value1) && isObject(value2);

      if ((isObjects && !this.isDeepEqual(value1, value2)) || (!isObjects && value1 !== value2)) {
        return false;
      }
    }
    return true;
  };

  getISDCodePrefix() {
    let prefix = '';
    Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.estToValidate.contactDetails.mobileNo.isdCodePrimary) {
        prefix = AppConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
}
