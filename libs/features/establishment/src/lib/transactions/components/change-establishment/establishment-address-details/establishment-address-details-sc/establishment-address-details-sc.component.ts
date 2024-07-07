import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AddressDetails,
  AddressTypeEnum,
  AlertService,
  Autobind,
  DocumentService,
  Establishment,
  RouterConstants,
  TransactionService,
  isAddressEmpty,
  isEmptyObject,
  isObject
} from '@gosi-ui/core';
import {
  AddEstablishmentService,
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentService,
  EstablishmentTransEnum
} from '@gosi-ui/features/establishment/lib/shared';
import { noop } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TransactionsBaseScComponent } from '../../../../base/transactions-base-sc.component';

@Component({
  selector: 'est-establishment-address-details-sc',
  templateUrl: './establishment-address-details-sc.component.html',
  styleUrls: ['./establishment-address-details-sc.component.scss']
})
export class EstablishmentAddressDetailsScComponent extends TransactionsBaseScComponent implements OnInit {
  readonly nationalType = AddressTypeEnum.NATIONAL;
  readonly poAddressType = AddressTypeEnum.POBOX;
  readonly foriegnType = AddressTypeEnum.OVERSEAS;

  estToValidate: Establishment = new Establishment();
  isNationalAddressChanged = false;
  isPoxAddressChanged = false;
  isOverseasAddressChanged = false;
  iscCurrentMailingAddressChanged = false;

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
    this.documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_ADDRESS_DETAILS;
    this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_ADDRESS_DETAILS;
    this.tnxId = EstablishmentTransEnum.ADDRESS_UPDATE_TRANSACTION;
  }

  ngOnInit(): void {
    this.getTransactionData();
    if (this.estRegNo) {
      this.getEstablishmentDetails(this.estRegNo);
      this.getAddressData();
      this.getAddressChangeDocs();
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }
  getAddressData() {
    if (!this.isTransactionCompleted) {
      this.getAddressFromTransient();
    } else {
      this.getAddressForCompletedData();
    }
  }
  getAddressForCompletedData() {
    this.getEstablishmentTransientAuditDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedAddressData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  getAddressFromTransient() {
    this.getEstablishmentTransientDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedAddressData))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  @Autobind
  getCurrentAndModifiedAddressData(addressData: [Establishment, Establishment]) {
    const [estOldData, estNewData] = addressData;
    this.establishment = estOldData;
    this.establishmentToValidate = estNewData;
    this.iscCurrentMailingAddressChanged =
      estNewData?.contactDetails?.currentMailingAddress !== estOldData?.contactDetails?.currentMailingAddress;

    const nationalAddress = this.getAddress(
      AddressTypeEnum.NATIONAL,
      this.establishmentToValidate?.contactDetails?.addresses
    );
    const poBoxAddress = this.getAddress(
      AddressTypeEnum.POBOX,
      this.establishmentToValidate?.contactDetails?.addresses
    );
    const overseasAddress = this.getAddress(
      AddressTypeEnum.OVERSEAS,
      this.establishmentToValidate?.contactDetails?.addresses
    );
    const oldNationalAddress = this.getAddress(AddressTypeEnum.NATIONAL, this.establishment?.contactDetails?.addresses);
    const oldPoBoxAddress = this.getAddress(AddressTypeEnum.POBOX, this.establishment?.contactDetails?.addresses);
    const oldOverseasAddress = this.getAddress(AddressTypeEnum.OVERSEAS, this.establishment?.contactDetails?.addresses);

    if (!isAddressEmpty(nationalAddress) || !isAddressEmpty(oldNationalAddress))
      this.isNationalAddressChanged = !this.isDeepEqual(oldNationalAddress, nationalAddress);
    if (!isAddressEmpty(poBoxAddress) || !isAddressEmpty(oldPoBoxAddress))
      this.isPoxAddressChanged = !this.isDeepEqual(oldPoBoxAddress, poBoxAddress);
    if (!isAddressEmpty(overseasAddress) || !isAddressEmpty(oldOverseasAddress))
      this.isOverseasAddressChanged = !this.isDeepEqual(oldOverseasAddress, overseasAddress);
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

  getAddressChangeDocs() {
    this.getUploadedDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      this.estRegNo,
      this.referenceNo
    );
  }
}
