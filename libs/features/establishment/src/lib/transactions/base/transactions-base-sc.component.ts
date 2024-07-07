/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  Autobind,
  BaseComponent,
  BilingualText,
  checkBilingualTextNull,
  DocumentItem,
  DocumentService,
  Establishment,
  getArabicName,
  NationalityTypeEnum,
  Transaction,
  TransactionService,
  TransactionStatus
} from '@gosi-ui/core';
import { forkJoin, noop, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  ActionTypeEnum,
  AddEstablishmentService,
  Admin,
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  ErrorCodeEnum,
  EstablishmentConstants,
  EstablishmentOwnerDetails,
  EstablishmentOwnersWrapper,
  EstablishmentQueryKeysEnum,
  EstablishmentService,
  EstablishmentTypeEnum,
  isGccEstablishment,
  isGovOrSemiGov,
  isLawTypeCivil,
  isOrgOrSociety,
  LegalEntityEnum,
  Owner,
  QueryParam
} from '../../shared';

@Directive()
export class TransactionsBaseScComponent extends BaseComponent {
  establishmentToValidate: Establishment = new Establishment();
  transaction: Transaction;
  estRegNo: number;
  inspectionRefNo: string;
  refNo: number;
  transactionId: number;
  header: BilingualText;
  referenceNo: number;
  resourceType: string;
  establishment: Establishment;
  estAdminDetails: Admin;
  hasAdmin: boolean;
  estOwnerDetails: EstablishmentOwnerDetails;
  hasOwner: boolean;
  isEstProactive: any;
  ownersToHighlight: any;
  documentList: DocumentItem[] = [];
  isBranch: boolean;
  isGCC: boolean;
  isEstablishmentFromMci: boolean;
  isEstablishmentFromMol: boolean;
  showMofPayment: boolean;
  hasLateFeeIndicator: boolean;
  documentTransactionKey = '';
  documentTransactionType = '';
  certificateId: number;
  excludeHistory: boolean;
  changeEstablishmentService: ChangeEstablishmentService; // need to remove
  isTransactionCompleted: boolean;
  estToValidate: Establishment = new Establishment();
  channel: string;
  saudiNationality = false;
  gccNationality = false;
  others = false;
  currentOwnerList: Owner[];
  newOwners: Owner[] = [];
  currentOwners: Owner[] = [];
  modifiedOwners: Owner[] = [];
  showModifiedLegend = false;
  oldAdmin: Admin;
  newAdmin: Admin;
  tnxId: number;
  establishmentOwners: EstablishmentOwnersWrapper;
  isEstablishmentProactive: boolean;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly addEstService: AddEstablishmentService,
    readonly documentService: DocumentService,
    readonly router: Router
  ) {
    super();
  }

  getTransactionData() {
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.estRegNo = this.transaction?.params?.REGISTRATION_NO;
      this.transactionId = this.transaction?.transactionId;
      this.channel = this.transaction?.channel?.english;
      if (this.transaction?.params?.CERTIFICATE_NO) {
        this.certificateId = this.transaction?.params?.CERTIFICATE_NO;
      }
      if (this.transaction?.status?.english === TransactionStatus.TRANSACTION_COMPLETED)
        this.isTransactionCompleted = true;
      this.header = this.transaction?.title;
      this.referenceNo = this.transaction?.transactionRefNo;
      if (this.transaction?.params?.INSPECTION_REF_NUMBER) {
        this.inspectionRefNo = this.transaction?.params?.INSPECTION_REF_NUMBER;
      }
    }
  }

  /**
   * method to get the details of the establishment before editing
   * @param registrationNo
   */
  getEstablishmentDetails(registrationNo: number) {
    this.establishmentService.getEstablishment(registrationNo).subscribe(
      res => {
        this.establishment = res;
        this.isGCC = isGccEstablishment(this.establishment);
        this.isEstablishmentFromMci =
          this.establishment?.crn?.number && this.establishment.unifiedNationalNumber ? true : false;
        this.isEstablishmentProactive =
          (this.establishment?.crn?.number && this.establishment.unifiedNationalNumber) ||
          (this.establishment.molEstablishmentIds?.molEstablishmentId && this.establishment.unifiedNationalNumber)
            ? true
            : false;
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  intialiseView(regNo: number) {
    this.establishmentService.getEstablishment(regNo).subscribe(
      data => {
        this.establishment = data;
        this.setEstablishmentData(this.establishment);
      },
      err => {
        if (err.error) {
          this.showErrorMessage(err);
        }
      }
    );
  }
  setEstablishmentData(establishment: Establishment) {
    if (establishment?.gccCountry === true) {
      this.getOwnerDetails(establishment);
    }
    this.isBranch = this.establishment?.establishmentType?.english === EstablishmentTypeEnum.BRANCH;
    this.isGCC = this.establishment?.gccCountry ? true : false;
    this.isEstablishmentProactive =
      (this.establishment?.crn?.number && this.establishment.unifiedNationalNumber) ||
      (this.establishment.molEstablishmentIds?.molEstablishmentId && this.establishment.unifiedNationalNumber)
        ? true
        : false;
    if (
      this.establishment?.crn?.number &&
      this.establishment?.crn?.issueDate &&
      this.establishment?.crn?.issueDate.gregorian
    ) {
      this.isEstablishmentFromMci = true;
    }
    if (this.establishment?.molEstablishmentIds?.molOfficeId && this.establishment.molEstablishmentIds?.molunId) {
      this.isEstablishmentFromMol = true;
    }
    if (!EstablishmentConstants.LEGAL_ENTITY_WITHOUT_OWNER.includes(establishment?.legalEntity?.english)) {
      this.getOwnerDetails(establishment);
    }
    // If establishment is main fetch admin
    if (establishment?.establishmentType?.english === EstablishmentTypeEnum.MAIN) {
      this.getAdminDetails(establishment);
    }
    // else {
    //   // If establishment is branch fetch admin only if it is registered through branch
    //   // if (establishment?.establishmentType?.english === EstablishmentTypeEnum.BRANCH) {
    //   //   this.getAdminDetails(establishment);
    //   // }
    // }
    if (isGovOrSemiGov(this.establishment?.legalEntity?.english)) {
      this.showMofPayment = true;
      this.hasLateFeeIndicator = true;
    }
    this.getDocuments();
  }
  getOwnerDetails(establishment: Establishment) {
    const queryParams: QueryParam[] = [];
    queryParams.push({ queryKey: EstablishmentQueryKeysEnum.ESTABLISHMENT_OWNERS, queryValue: true });
    this.establishmentService.getOwnerDetails(establishment?.registrationNo, queryParams).subscribe(
      res => {
        this.hasOwner = true;
        this.establishmentOwners = res;
        this.estOwnerDetails = new EstablishmentOwnerDetails();
        res?.owners.forEach(owner => {
          this.estOwnerDetails?.persons.push(owner?.person);
        });
        // if (this.isEstProactive) {
        //   this.ownersToHighlight = this.estOwnerDetails?.persons
        //     ?.map(owner => owner.personId)
        //     .filter(id => res.molOwnerPersonId.indexOf(id) === -1);
        // }
      },
      err => {
        if (err?.error) {
          if (err?.error?.code === ErrorCodeEnum.OWNER_NO_RECORD) {
            this.hasOwner = false;
          } else {
            this.showErrorMessage(err);
            this.hasOwner = true;
          }
        }
      }
    );
  }

  getAdminDetails(establishment: Establishment) {
    const regNo = this.estRegNo;
    this.establishmentService.getSuperAdminDetails(regNo).subscribe(
      res => {
        this.hasAdmin = true;
        this.estAdminDetails = new Admin();
        this.estAdminDetails.person.identity = [];
        this.estAdminDetails.person = this.addEstService.setAdminDetails(this.estAdminDetails?.person, res?.person);
      },
      err => {
        if (err?.error) {
          if (err?.error?.code === ErrorCodeEnum.ADMIN_NO_RECORD) {
            this.hasAdmin = false;
          } else {
            this.showErrorMessage(err);
            this.hasAdmin = true;
          }
        }
      }
    );
  }
  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    this.alertService.showError(err?.error?.message, err?.error?.details);
  }

  /**
   * Method to get documents
   * @param establishment
   */
  getDocuments() {
    if (this.establishment?.proactiveStatus == 1 || this.establishment?.proactiveStatus == 2) {
      this.addEstService
        .getProActiveDocumentList(this.establishment?.registrationNo)
        .pipe(
          switchMap(res => {
            return forkJoin(
              res.map(doc =>
                this.documentService.refreshDocument(
                  doc,
                  this.establishment?.registrationNo,
                  undefined,
                  undefined,
                  this.referenceNo
                )
              )
            );
          })
        )
        .subscribe(res => (this.documentList = res));
    } else {
      let docType;
      if (this.establishment?.establishmentAccount?.paymentType?.english === 'Yes') {
        docType = DocumentTransactionTypeEnum.GOV_MOF;
      } else if (this.establishment?.gccCountry === true) {
        docType = DocumentTransactionTypeEnum.GCC_EST;
        if (this.estOwnerDetails?.persons?.length !== 0) {
          docType = DocumentTransactionTypeEnum.GCC_EST_OWNER;
        } else if (isOrgOrSociety(this.establishment) || isLawTypeCivil(this.establishment)) {
          docType = DocumentTransactionTypeEnum.GCC_EST_WITHOUT_OWNER;
        }
      } else {
        if (
          this.establishment?.legalEntity?.english === LegalEntityEnum.GOVERNMENT ||
          this.establishment?.legalEntity?.english === LegalEntityEnum.SEMI_GOV
        ) {
          docType = DocumentTransactionTypeEnum.GOV_NON_MOF;
        } else {
          docType = DocumentTransactionTypeEnum.ORG_REGIONAL;
        }
      }
      if (this.establishment?.establishmentAccount?.bankAccount?.bankName?.english) {
        docType += DocumentTransactionTypeEnum.ADD_IBAN;
      }
      this.documentService
        .getDocuments(
          DocumentTransactionTypeEnum.REGISTER_ESTABLISHMENT,
          docType,
          this.establishment?.registrationNo,
          this.referenceNo
        )
        .subscribe(res => (this.documentList = res));
    }
  }

  goToEstProfile(regNo) {
    this.router.navigate([EstablishmentConstants.EST_PROFILE_ROUTE(regNo)]);
  }

  /**
   * Method to get document list
   * @param transactionKey
   * @param transactionType
   * @param registrationNo
   * @param referenceNo
   */
  getUploadedDocuments(transactionKey: string, transactionType: string, registrationNo: number, referenceNo: number) {
    this.documentService
      .getDocuments(transactionKey, transactionType, registrationNo, referenceNo)
      .subscribe(res => (this.documentList = res?.filter(item => item?.documentContent != null)));
  }

  getEstablishmentTransientDetails(
    registrationNo: number,
    referenceNumber: number,
    terminate: boolean = null
  ): Observable<[Establishment, Establishment]> {
    return this.establishmentService.getEstablishment(registrationNo).pipe(
      catchError(err => {
        this.alertService.showError(err.error.message);
        return throwError(err);
      }),
      switchMap(res => {
        return forkJoin([
          of(res),
          this.changeEstablishmentService.getEstablishmentFromTransient(registrationNo, referenceNumber, terminate)
        ]);
      })
    );
  }

  getEstablishmentTransientAuditDetails(
    registrationNo: number,
    referenceNumber: number,
    terminate: boolean = null
  ): Observable<[Establishment, Establishment]> {
    return this.changeEstablishmentService
      .getEstablishmentFromTransient(registrationNo, referenceNumber, terminate, EstablishmentQueryKeysEnum.OLD_VALUE)
      .pipe(
        catchError(err => {
          this.alertService.showError(err.error.message);
          return throwError(err);
        }),
        switchMap(res => {
          return forkJoin([
            of(res),
            this.changeEstablishmentService.getEstablishmentFromTransient(
              registrationNo,
              referenceNumber,
              terminate,
              EstablishmentQueryKeysEnum.NEW_VALUE
            )
          ]);
        })
      );
  }

  checkNull(control) {
    return checkBilingualTextNull(control);
  }

  // this method is used to match the identifier corresponding to nationality
  getIdentifierType(admin: Admin) {
    if (admin.person && admin.person.nationality) {
      if (admin.person.nationality.english === NationalityTypeEnum.SAUDI_NATIONAL) {
        return (this.saudiNationality = true);
      } else if (EstablishmentConstants.GCC_NATIONAL.indexOf(admin.person.nationality.english) !== -1) {
        return (this.gccNationality = true);
      } else {
        return (this.others = true);
      }
    }
  }

  getAdminName(admin: Admin) {
    let adminName = null;
    if (admin && admin.person.name.arabic.firstName) {
      adminName = getArabicName(admin.person.name.arabic);
    }
    return adminName;
  }
  getOwnerData() {
    if (!this.isTransactionCompleted) {
      this.getOwnerFromTransient();
    } else {
      this.getOwnerForCompletedData();
    }
  }
  getOwnerForCompletedData() {
    this.getEstablishmentValidatingOwnerDetailsForComplete(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedOwnersForCompleted))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }
  getOwnerFromTransient() {
    this.getEstablishmentValidatingOwnerDetails(this.estRegNo, this.referenceNo)
      .pipe(tap(this.getCurrentAndModifiedOwners))
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  /**
   * // method to get the establishment owner details to validate
   * @param registrationNumber
   * @param referenceNumber
   */
  getEstablishmentValidatingOwnerDetailsForComplete(
    registrationNumber: number,
    referenceNumber: number
  ): Observable<[Owner[], Owner[]]> {
    return this.changeEstablishmentService.searchOwnerWithQueryParams(registrationNumber).pipe(
      catchError(err => {
        this.alertService.showError(err.error.message);
        return throwError(err);
      }),
      switchMap(res => {
        let queryParams: QueryParam[] = [];
        queryParams.push({
          queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
          queryValue: referenceNumber
        });
        queryParams.push({
          queryKey: EstablishmentQueryKeysEnum.INCLUDE_TRANSIENT_AUDIT,
          queryValue: true
        });
        return forkJoin([
          of(res),
          this.changeEstablishmentService.searchOwnerWithQueryParams(registrationNumber, queryParams)
        ]);
      })
    );
  }
  /**
   * // method to get the establishment owner details to validate
   * @param registrationNumber
   * @param referenceNumber
   */
  getEstablishmentValidatingOwnerDetails(
    registrationNumber: number,
    referenceNumber: number
  ): Observable<[Owner[], Owner[]]> {
    return this.changeEstablishmentService.searchOwnerWithQueryParams(registrationNumber).pipe(
      catchError(err => {
        this.alertService.showError(err.error.message);
        return throwError(err);
      }),
      switchMap(res => {
        let queryParams: QueryParam[] = [];
        queryParams.push({
          queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
          queryValue: referenceNumber
        });
        return forkJoin([
          of(res),
          this.changeEstablishmentService.searchOwnerWithQueryParams(registrationNumber, queryParams)
        ]);
      })
    );
  }

  @Autobind
  getCurrentAndModifiedOwnersForCompleted(ownerResponse: [Owner[], Owner[]]) {
    const [currentOwners, owners] = ownerResponse;
    this.currentOwnerList = currentOwners;
    this.newOwners = owners.length > 0 ? owners.filter(owner => owner.recordAction === ActionTypeEnum.ADD) : [];

    this.modifiedOwners =
      owners.length > 0
        ? owners.filter(
            owner => owner.recordAction === ActionTypeEnum.REMOVE || owner.recordAction === ActionTypeEnum.MODIFY
          )
        : [];
    if (this.modifiedOwners?.filter(owner => owner.recordAction === ActionTypeEnum.MODIFY)?.length > 0) {
      this.showModifiedLegend = true;
    }
    this.currentOwners = currentOwners.map(owner => {
      /* to get the record action of owners who removed or modified from curent owners list */
      return this.modifiedOwners.some(modifiedOwner => modifiedOwner.ownerId === owner.ownerId)
        ? this.modifiedOwners.find(modifiedOwner => modifiedOwner.ownerId === owner.ownerId)
        : owner;
    });
  }

  @Autobind
  getCurrentAndModifiedOwners(ownerResponse: [Owner[], Owner[]]) {
    const [currentOwners, owners] = ownerResponse;
    this.currentOwnerList = currentOwners;
    this.newOwners = owners.length > 0 ? owners.filter(owner => owner.recordAction === ActionTypeEnum.ADD) : [];

    this.modifiedOwners =
      owners.length > 0
        ? owners.filter(
            owner => owner.recordAction === ActionTypeEnum.REMOVE || owner.recordAction === ActionTypeEnum.MODIFY
          )
        : [];
    if (this.modifiedOwners?.filter(owner => owner.recordAction === ActionTypeEnum.MODIFY)?.length > 0) {
      this.showModifiedLegend = true;
    }
    this.currentOwners = currentOwners.map(owner => {
      /* to get the record action of owners who removed or modified from curent owners list */
      return this.modifiedOwners.some(modifiedOwner => modifiedOwner.ownerId === owner.ownerId)
        ? this.modifiedOwners.find(modifiedOwner => modifiedOwner.ownerId === owner.ownerId)
        : owner;
    });
  }
}
