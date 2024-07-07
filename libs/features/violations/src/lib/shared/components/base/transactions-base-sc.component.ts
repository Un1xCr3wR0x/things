/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { Directive, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  BilingualText,
  DocumentItem,
  DocumentService,
  InspectionTypeEnum,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService,
  TransactionStatus
} from '@gosi-ui/core';
import { iif, noop, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ViolationConstants, ViolationRouteConstants } from '../../constants';
import {
  DocumentTransactionId,
  DocumentTransactionType,
  InspectionChannel,
  ViolationsEnum,
  ViolationStatusEnum,
  ViolationTypeEnum
} from '../../enums';
import { ViolationTransaction } from '../../models';
import { ViolationsValidatorService } from '../../services';

@Directive()
export class TransactionsBaseScComponent extends BaseComponent {
  transaction: Transaction;
  estRegNo: number;
  violationId: number;
  transactionId: number;
  violationDetails: ViolationTransaction;
  isRasedInspection: boolean;
  e_Inspection: boolean;
  checkFAN: boolean;
  documentList: DocumentItem[];
  isCancelEngagement: boolean;
  isModifyJoiningDate: boolean;
  isModifyTerminationDate: boolean;
  isIncorrectWage: boolean;
  isaddEngagement: boolean;
  isIncorrectReason: boolean;
  isWrongBenefits: boolean;
  isViolatingProvision: boolean;
  documentTransactionKey = '';
  documentTransactionType = '';
  referenceNo: number;
  violationReferenceNumber: number;
  isReportViolationTransaction: boolean = false;
  isTransactionCompleted: boolean;
  isAutoApprovedViolation: boolean;
  isKashefViolation: boolean;
  appealViolationId: string;
  constructor(
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly router: Router,
    readonly validatorService: ViolationsValidatorService,
    readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super();
  }

  getTransactionData() {
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.estRegNo = this.transaction?.params?.REGISTRATION_NO;
      this.violationId = this.transaction?.params?.VIOLATION_ID;
      this.transactionId = this.transaction?.transactionRefNo;
      this.appealViolationId = this.transaction?.params?.APPEAL_ON_VIOLATION_ID;
      // this.resourceType = 'Violation';
    }
  }
  getViolationData() {
    this.validatorService
      .getTransactionDetails(this.violationId, this.estRegNo)
      .pipe(
        tap(res => {
          this.violationDetails = { ...res };
          this.isRasedInspection =
            this.violationDetails.inspectionInfo.channel.english === InspectionChannel.RASED ? true : false;
          this.e_Inspection =
            this.violationDetails.inspectionInfo.channel.english === InspectionChannel.E_INSPECTION ? true : false;
          this.checkFAN = this.violationDetails.inspectionInfo.visitId ? true : false;
          this.getViolationType(this.violationDetails);
          this.violationReferenceNumber = this.violationDetails?.violationReferenceNumber;
          this.isReportViolationTransaction = this.violationDetails?.manualViolation ? true : false;
          this.isAutoApprovedViolation =
            this.violationDetails?.violationStatus?.english === ViolationStatusEnum.AUTO_APPROVED ? true : false;
          this.isKashefViolation =
            this.violationDetails?.inspectionInfo.channel?.english === InspectionChannel.KASHEF ? true : false;
          this.checkTransactionStatus(this.transaction?.status);
          if (this.isReportViolationTransaction) {
            this.getUploadedDocuments(
              DocumentTransactionId.MANUALLY_TRIGGERED_VIOLATION,
              DocumentTransactionType.REGISTER_VIOLATION_THROUGH_FO,
              this.violationId,
              this.violationReferenceNumber
            );
          }
        }),
        switchMap(() => iif(() => this.isRasedInspection, this.getRasedInspectionDocs(), of(true))),
        switchMap(() => iif(() => this.e_Inspection && this.checkFAN, this.getEinspectionDocs(), of(true))),
        catchError(err => {
          this.handleErrors(err, true);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  getViolationType(violationDetails: ViolationTransaction) {
    switch (violationDetails.violationType.english.toUpperCase()) {
      case ViolationTypeEnum.ADD_NEW_ENGAGEMENT.toUpperCase():
        this.isaddEngagement = true;
        break;
      case ViolationTypeEnum.CANCEL_ENGAGEMENT.toUpperCase():
        this.isCancelEngagement = true;
        break;
      case ViolationTypeEnum.INCORRECT_REASON.toUpperCase():
      case ViolationTypeEnum.RAISE_INCORRECT_REASON.toUpperCase():
        this.isIncorrectReason = true;
        break;
      case ViolationTypeEnum.INCORRECT_WAGE.toUpperCase():
        this.isIncorrectWage = true;
        break;
      case ViolationTypeEnum.RAISE_WRONG_BENEFITS.toUpperCase():
        this.isWrongBenefits = true;
        break;
      case ViolationTypeEnum.RAISE_VIOLATING_PROVISIONS.toUpperCase():
        this.isViolatingProvision = true;
        break;
      case ViolationTypeEnum.MODIFY_JOINING_DATE.toUpperCase():
        this.isModifyJoiningDate = true;
        break;
      case ViolationTypeEnum.MODIFY_TERMINATION_DATE.toUpperCase():
        this.isModifyTerminationDate = true;
        break;
    }
  }
  /** Method to get rased inspection documents */
  getRasedInspectionDocs() {
    return this.documentService
      .getRasedDocuments(
        InspectionTypeEnum.EMPLOYEE_AFFAIRS,
        this.violationDetails?.violationTypeForRased,
        ViolationsEnum.VIOLATION_TYPE,
        this.violationDetails?.inspectionInfo.visitId
      )
      .pipe(
        tap(docs => {
          if (docs.length > 0) this.documentList = this.documentList.concat(docs);
        }),
        catchError(error => {
          this.handleErrors(error, false);
          return of(this.documentList);
        })
      );
  }

  /** Method to get e-inspection documents */
  getEinspectionDocs() {
    return this.documentService
      .getRasedDocuments(
        InspectionTypeEnum.EMPLOYEE_AFFAIRS,
        this.violationDetails?.contributors[0]?.socialInsuranceNo,
        ViolationsEnum.CONTRIBUTOR_NUMBER,
        this.violationDetails?.inspectionInfo?.visitId
      )
      .pipe(
        tap(res => {
          if (res.length > 0) this.documentList = this.documentList.concat(res);
        }),
        catchError(error => {
          this.handleErrors(error, false);
          return of(this.documentList);
        })
      );
  }
  /** Method to navigate to inbox on error during view initialization. */
  handleErrors(error, flag: boolean): void {
    this.alertService.showError(error.error.message);
    if (flag) this.location.back();
  }
  checkTransactionStatus(status: BilingualText) {
    if (status?.english.toUpperCase() === TransactionStatus.TRANSACTION_COMPLETED.toUpperCase()) {
      this.isTransactionCompleted = true;
    } else {
      this.isTransactionCompleted = false;
    }
  }

  /**
   * Method to get document list
   * @param transactionKey
   * @param transactionType
   * @param violationId
   * @param referenceNo
   */
  getUploadedDocuments(transactionKey: string, transactionType: string, violationId: number, referenceNo: number) {
    this.documentService
      .getDocuments(transactionKey, transactionType, violationId, referenceNo)
      .subscribe(res => (this.documentList = res.filter(item => item.documentContent != null)));
  }
  /**Navigate to Establishment profile Page */
  navigateToEstablishmentProfile(estRegNo: number) {
    this.router.navigate([ViolationRouteConstants.ROUTE_ESTABLISHMENT_PROFILE_PAGE(estRegNo)]);
  }

  /** Navigate to profile page */
  navigateToContributorProfile(index: number) {
    const regNo = this.violationDetails.establishmentInfo.registrationNo;
    const sinNo = this.violationDetails.contributors[index].socialInsuranceNo;
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      url = '/establishment-private/#' + ViolationRouteConstants.ROUTE_CONTRIBUTOR_PROFILE_PAGE(regNo, sinNo);
    } else {
      url = '/establishment-public/#' + ViolationRouteConstants.ROUTE_CONTRIBUTOR_PROFILE_PAGE(regNo, sinNo);
    }
    window.open(url, '_blank');
  }
  /** Navigate to transaction tracker page */
  navigateToTnxTracker(personData: { index: number; engIndex: number }) {
    const personIndex = personData.index;
    const personEngIndex = personData.engIndex;
    const transactionId = this.violationDetails.referenceNo;
    const transactionNumber =
      this.violationDetails.contributors[personIndex]?.engagementInfo[personEngIndex]
        ?.changeTerminationReasonTransaction;
    let pageUrl = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      pageUrl =
        '/establishment-private/#' +
        ViolationRouteConstants.ROUTE_TRANSACTION_TRACKING(transactionId, transactionNumber);
    } else {
      pageUrl =
        '/establishment-public/#' +
        ViolationRouteConstants.ROUTE_TRANSACTION_TRACKING(transactionId, transactionNumber);
    }
    window.open(pageUrl, '_blank');
  }
  navigateToFoValidatorTxnTracking(transactionId: number) {
    this.router.navigate([ViolationRouteConstants.ROUTE_VALIDATOR_FO_VIOLATIONS(transactionId)]);
  }
}
