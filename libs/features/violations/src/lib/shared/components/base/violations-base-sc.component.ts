/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { Directive, Inject, TemplateRef, OnInit, Optional } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  DocumentItem,
  DocumentService,
  LookupService,
  RouterConstantsBase,
  RouterData,
  RouterDataToken,
  WorkflowService,
  TransactionReferenceData,
  EstablishmentQueryParams,
  Establishment,
  TransactionMixin,
  TransactionInterface,
  Transaction,
  TransactionService,
  RoleIdEnum,
  AuthTokenService, AppealResponse, AppealDetailsResponse
} from '@gosi-ui/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {noop, Observable, throwError} from 'rxjs';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {ViolationConstants, ViolationRouteConstants} from '../../constants';
import {
  DocumentTransactionId,
  DocumentTransactionType,
  InspectionChannel,
  ViolationStatusEnum,
  ViolationTypeEnum
} from '../../enums';
import {ViolationTransaction} from '../../models';
import {ViolationsValidatorService} from '../../services';
import moment from 'moment';
import {AppealViolationsService} from "@gosi-ui/features/violations/lib/shared/services/appeal-violations.service";
import {AppealDetail} from "@gosi-ui/features/appeals/lib/shared/models/employees/appeal-detail";

@Directive()
export class ViolationsBaseScComponent extends TransactionMixin(BaseComponent) implements TransactionInterface, OnInit {
  /** Local variables */
  modalRef: BsModalRef;
  documentList: DocumentItem[];
  lang = 'en';
  transactionDetails: ViolationTransaction;
  channel: string;
  isRasedInspection = false;
  e_Inspection = false;
  isKashefInspection: boolean = false;
  violationId: number;
  isAppPrivate = false;
  isSimisFlag: boolean;
  transactionTraceId: number;
  regNo: number;
  referenceNo: number;
  transactionReferenceData: TransactionReferenceData[] = [];
  editMode = false;
  isCancelled: boolean;
  hasSaved: boolean;
  showAppealButton = false;
  establishmentDetails: Establishment;
  violationDocuments: DocumentItem[];
  transactionTypes: string[] = [
    DocumentTransactionType.VIOLATION_LETTER_TYPE,
    DocumentTransactionType.VIOLATION_REPORT_TYPE
  ];
  ameenReleaseDate = ViolationConstants.SIMIS_TRANSACTION_DATE;
  docBusinessTransaction = DocumentTransactionType.MODIFY_VIOLATION_TYPE;
  noContributors: boolean;
  transaction: Transaction;
  estAppealActive: string = null;

  roleShowButtonAov: boolean;
  aovRoles = [RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN];
  previousRequest: AppealDetailsResponse;

  /**
   *
   * @param lookupService
   * @param documentService
   * @param alertService
   * @param workflowService
   * @param modalService
   * @param router
   * @param routerData
   */
  constructor(
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly validatorService: ViolationsValidatorService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly activatedroute: ActivatedRoute,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location,
    @Optional() readonly transactionService: TransactionService,
    readonly appealVlcService: AppealViolationsService,
    readonly authService: AuthTokenService
  ) {
    super();
  }

  ngOnInit(): void {}

  askForCancel() {
    this.viewModal(this.cancelTemplate);
  }

  initializeData() {
    this.activatedroute.params.subscribe( param => {
      if (param) {
        this.violationId = Number(param.transactionId);
        this.regNo = Number(param.estRegId);
      }
    });
  }

  /** Method to retrieve data for view. */
  initializeView(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    !this.isAppPrivate ? this.transactionService.getAllowedPSFeatures().subscribe(
      data => {
        this.psFeatures = data.Features;
        this.estAppealActive = this.psFeatures.find(item => item == "Appeal_Est");
      },
      err =>{
        this.alertService.showError(err.error.message);
      },
      ()=> {}
    ) : '';

    if (this.regNo) {
      this.getViolationDetails(this.violationId, this.regNo)
        .pipe(
          switchMap(() => {
            return this.getViolationDocuments(
              this.isSimisFlag
                ? DocumentTransactionId.REGISTER_CHANGE_ENGAGEMENT_VIOLATION
                : DocumentTransactionId.REGISTER_CONTRIBUTOR_VIOLATION_TYPE,
              this.isSimisFlag
                ? DocumentTransactionType.VIOLATION_DOCUMENT
                : this.isAppPrivate
                ? this.transactionTypes
                : DocumentTransactionType.VIOLATION_LETTER_TYPE,
              this.violationId
            );
          }),
          catchError(err => {
            this.handleErrors(err);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    } else this.location.back();
  }

  /** Method to initialize keys from payload. */
  initializeToken(): void {
    this.referenceNo = this.routerData.transactionId;
    const payload = JSON.parse(this.routerData.payload);
    if (payload) {
      this.channel = payload.channel;
    }
    this.transactionReferenceData = this.routerData.comments;
  }

  /**
   * This method brings the violation details as a transaction entity
   */

  getTransactionDetails(transactionRefNo) {
    this.transactionService.getTransaction(transactionRefNo).subscribe(
      response => {
        this.transaction = response;
        if (this.transaction.canRequestReview) {
          this.showAppealButton = true;
        }

        if (this.transaction.canAppeal) {
          this.appealVlcService.getAppealOnViolationDetail(this.transaction.transactionRefNo).subscribe(
            appealResp => {
              this.previousRequest = appealResp;
              this.showAppealButton = (this.previousRequest == null || this.previousRequest?.decisionStatus.english != 'Approve') && !this.isAppPrivate;
            },
            err => {
              this.alertService.showError(err.error.message);
            }
          );
        }
      },
      err => {
        this.alertService.showError(err.error.message)
      },
      () => {
      }
    );
  }

//  This method checks the user eligibility to raise an appeal and thus show/hide the appeal button
 showButtonEligibility(transaction: Transaction): boolean {
  let isEligibleToAppeal = false;
  if (transaction.canRequestReview)  {
    isEligibleToAppeal = true;
  }
  if(transaction.canAppeal){
    this.transactionService.getAppealDetails(transaction.transactionRefNo).subscribe(
      response => {
       this.previousRequest = response;
       (this.previousRequest == null  || this.previousRequest?.decisionStatus.english != 'Approve') ? isEligibleToAppeal =  true : isEligibleToAppeal = false;
      },
      err =>{
          this.alertService.showError(err.error.message);
      },
      () =>{}
    );
  }
  return isEligibleToAppeal;
}

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  viewModal(templateRef: TemplateRef<HTMLElement>): void {
    this.modalRef = this.modalService.show(templateRef, { class: 'modal-md modal-dialog-centered' });
  }

  /** This method is to hide the modal reference. */
  hideModal(): void {
    this.modalRef.hide();
  }
  rejectViolation(tab: number) {
    this.alertService.clearAlerts();
    if (this.hasSaved === true) {
      this.validatorService.rejectViolation(this.violationId, this.transactionTraceId, this.editMode).subscribe(res => {
        if (res) {
          this.modalRef.hide();
          this.setTransactionComplete();
          if (this.reRoute) {
            this.router.navigate([this.reRoute]);
          } else if (this.editMode) this.location.back();
          else this.router.navigate([RouterConstantsBase.ROUTE_VIOLATION_HISTORY(this.regNo)]);
        }
      });
    } else {
      this.modalRef.hide();
      this.setTransactionComplete();
      if (this.reRoute) {
        this.router.navigate([this.reRoute]);
      } else if (this.editMode) this.location.back();
      else this.router.navigate([RouterConstantsBase.ROUTE_VIOLATION_HISTORY(this.regNo)]);
    }
  }
  /** Method to navigate to inbox on error during view initialization. */
  handleErrors(errors): void {
    this.alertService.showError(errors?.error?.message);
  }
  showError() {
    this.alertService.showMandatoryErrorMessage();
  }
  /** Method to get documents for the transaction. */
  getDocuments(
    transactionId: string,
    transactionType: string | string[],
    contractId: number,
    referenceId: number
  ): Observable<DocumentItem[]> {
    return this.documentService.getDocuments(transactionId, transactionType, contractId, referenceId).pipe(
      tap(res => {
        this.documentList = res;
      })
    );
  } /**  */
  getViolationDocuments(docId: string, docType: string | string[], violationId: number): Observable<DocumentItem[]> {
    return this.documentService.getDocuments(docId, docType, violationId).pipe(
      tap(res => {
        this.violationDocuments = res.filter(item => item.documentContent !== null);
      })
    );
  }
  /**
   * Method to get documents after refresh
   * @param document
   */
  refreshDocument(document: DocumentItem) {
    this.documentService
      .refreshDocument(
        document,
        this.violationId,
        this.docBusinessTransaction,
        this.docBusinessTransaction,
        this.transactionTraceId
      )
      .subscribe(res => (document = res));
  }
  /**
   * Method to check mandatory documents uploaded
   */
  checkDocumentValidity(modifyDetailsForm: FormGroup) {
    if (!this.documentService.checkMandatoryDocuments(this.documentList)) {
      this.alertService.showMandatoryDocumentsError();
      return false;
    } else if (modifyDetailsForm) return modifyDetailsForm.valid;
    else return true;
  }
  /**
   * Method to fetch violation details based on violationId
   * @param violationId
   */
  getViolationDetails(violationId: number, regNo: number): Observable<ViolationTransaction> {
    return this.validatorService.getTransactionDetails(violationId, regNo).pipe(
      tap(res => {
        this.transactionDetails = res;
        this.roleAppealViolation();
        this.isSimisFlag = this.checkIfSimis();
        this.noContributors = this.checkForNoContributors();
        this.getTransactionDetails(this.transactionDetails.referenceNo);
        if (this.transactionDetails.inspectionInfo) {
          if (this.transactionDetails.inspectionInfo.channel?.english === InspectionChannel.RASED)
            this.isRasedInspection = true;
          if (this.transactionDetails.inspectionInfo.channel?.english === InspectionChannel.E_INSPECTION)
            this.e_Inspection = true;
          if (this.transactionDetails.inspectionInfo.channel?.english === InspectionChannel.KASHEF) {
            this.isKashefInspection = true;
          }
        }
        if (this.transactionDetails.violationStatus.english === ViolationStatusEnum.VIOLATION_CANCEL)
          this.isCancelled = true;
        else this.isCancelled = false;
      })
    );
  }
  checkForNoContributors(): boolean {
    if (
      this.transactionDetails?.violationType?.english === ViolationTypeEnum?.VIOLATING_PROVISIONS &&
      this.transactionDetails?.contributors?.length <= 0
    ) {
      return true;
    } else return false;
  }

  checkIfSimis(): boolean {
    if (!this.transactionDetails?.dateReported?.gregorian) {
      return this.transactionDetails.isSimisViolation;
    } else {
      const tnxDate = moment(new Date(this.transactionDetails?.dateReported?.gregorian));
      const ameenDate = moment(new Date(this.ameenReleaseDate));
      if (tnxDate.isBefore(ameenDate) && this.transactionDetails.isSimisViolation) {
        return true;
      } else {
        return false;
      }
    }
  }

  getSuccessMessage(): string {
    return 'VIOLATIONS.WORKFLOW-FEEDBACKS.TRANSACTION-SUBMIT-MESSAGE';
  }

  /** Navigate to transaction tracker page */
  goToTransaction(trackingData) {
    const transactionId = trackingData.tnxId;
    const transactionNumber = trackingData.tnxReference;
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      url =
        '/establishment-private/#' +
        ViolationRouteConstants.ROUTE_TRANSACTION_TRACKING(transactionId, transactionNumber);
    } else {
      url =
        '/establishment-public/#' +
        ViolationRouteConstants.ROUTE_TRANSACTION_TRACKING(transactionId, transactionNumber);
    }
    window.open(url, '_blank');
  }
  /**Method for getting establishment details */
  getEstablishment(registrationNo: number, queryParams?: EstablishmentQueryParams): void {
    this.validatorService.getEstablishment(registrationNo).subscribe(res => {
      this.establishmentDetails = res;
    });
  }

  /**Method for showing button AOV */
  roleAppealViolation() {
    const gosiscp = this.authService.getEntitlements();

    gosiscp.forEach(est => {
      if (est.establishment === this.regNo) {
        est.role.forEach(roleId => {
          this.roleShowButtonAov = this.aovRoles.includes(roleId);
        })
      }
    })
  }
}
