/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, Inject, OnDestroy, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BilingualText,
  DocumentItem,
  DocumentService,
  Establishment,
  EstablishmentRouterData,
  EstablishmentStatusEnum,
  EstablishmentToken,
  LookupService,
  LovList,
  NationalityTypeEnum,
  RouterConstants,
  TransactionReferenceData,
  WorkflowService,
  checkBilingualTextNull,
  getArabicName
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  Admin,
  ChangeEstablishmentService,
  EstablishmentConstants,
  EstablishmentQueryKeysEnum,
  EstablishmentService,
  Owner,
  isGccEstablishment
} from '../../shared';
import { EstablishmentScBaseComponent } from '../../shared/base/establishment-sc.base-component';

@Directive()
export abstract class ValidatorScBaseComponent extends EstablishmentScBaseComponent implements OnDestroy {
  establishment: Establishment = new Establishment();
  comments: TransactionReferenceData[] = [];

  documents: DocumentItem[];
  isGcc = false;
  establishmentName: BilingualText = new BilingualText();
  establishmentToValidate: Establishment = new Establishment();
  canEdit: boolean;
  canReturn = false;
  isReturn: boolean;
  transactionNumber = null;
  isReturnToAdmin = false;
  documentTransactionKey = '';
  documentTransactionType = '';
  saudiNationality = false;
  gccNationality = false;
  others = false;
  canValidatorEdit: boolean;
  reopenedClosingProgressStatus = EstablishmentStatusEnum.REOPEN_CLOSING_IN_PROGRESS;
  isReopenClosingInProgress: boolean = false;

  //Lov Lists
  rejectReasonList$: Observable<LovList>;
  returnReasonList$: Observable<LovList>;

  hasInitialisedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    readonly lookUpService: LookupService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly fb: FormBuilder,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    readonly router: Router
  ) {
    super(modalService, workflowService);
  }

  /**
   * Methoid to get the list of rejection reasons
   */
  getRejectReasonList() {
    this.rejectReasonList$ = this.lookUpService.getEstablishmentRejectReasonList();
  }

  /**
   * Methoid to get the list of return reasons
   */
  getReturnReasonList() {
    this.returnReasonList$ = this.lookUpService.getRegistrationReturnReasonList();
  }

  /**
   * method to get the details of the establishment before editing
   * @param registrationNo
   */
  getEstablishmentDetails(registrationNo: number) {
    this.getEstablishmentData(registrationNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        res => {
          this.establishment = res;
          this.canValidatorEdit =
            this.establishment?.status?.english == EstablishmentStatusEnum.REGISTERED ||
            this.establishment?.status?.english == EstablishmentStatusEnum.REOPEN
              ? true
              : false;
          this.isReopenClosingInProgress =
            this.establishment?.status?.english === EstablishmentStatusEnum.REOPEN_CLOSING_IN_PROGRESS ? true : false;
          this.isGcc = isGccEstablishment(this.establishment);
          this.hasInitialisedSubject.next(true);
        },
        err => {
          this.alertService.showError(err.error.message);
          this.hasInitialisedSubject.next(false);
        }
      );
  }
  getEstablishmentData(registrationNo: number): Observable<Establishment> {
    return this.establishmentService.getEstablishment(registrationNo).pipe(takeUntil(this.destroy$));
  }

  /**
   * // method to get the establishment details to validate
   * @param referenceNumber
   */
  getValidatingEstablishmentDetails(
    registrationNo: number,
    referenceNumber: number,
    fetchEstData: boolean = true,
    performAction?: (establishment: Establishment) => void
  ) {
    const isTerminate =
      this.estRouterData.resourceType === RouterConstants.TRANSACTION_TERMINATE_ESTABLISHMENT ||
      this.estRouterData.resourceType === RouterConstants.TRANSACTION_GOL_TERMINATE_ESTABLISHMENT;
    this.changeEstablishmentService
      .getEstablishmentFromTransient(registrationNo, referenceNumber, isTerminate)
      .pipe(
        tap(res => (this.establishmentToValidate = res)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        () => {
          if (fetchEstData) {
            this.getDocumentDetails(
              this.documentTransactionKey,
              this.documentTransactionType,
              this.establishmentToValidate.registrationNo,
              referenceNumber
            );
            this.getEstablishmentDetails(this.establishmentToValidate.registrationNo);
          }
          if (performAction) {
            performAction(this.establishmentToValidate);
          }
        },
        err => {
          this.alertService.showError(err.error.message);
          this.hasInitialisedSubject.next(false);
        }
      );
  }
  /**
   * // method to get the comments
   * @param referenceNumber
   */
  getComments(estRouterData: EstablishmentRouterData) {
    this.getAllComments(estRouterData).subscribe(
      res => (this.comments = res),
      err => {
        this.alertService.showError(err?.error?.message);
      }
    );
  }

  /**
   * Method to get document list
   * @param transactionKey
   * @param transactionType
   * @param registrationNo
   */
  getDocumentDetails(transactionKey: string, transactionType: string, registrationNo: number, referenceNo: number) {
    this.documentService
      .getDocuments(transactionKey, transactionType, registrationNo, referenceNo)
      .subscribe(res => (this.documents = res.filter(item => item.documentContent != null)));
  }

  /**
   * Method to create form to handle validator operations
   */
  createForm(): FormGroup {
    return this.fb.group({
      taskId: [null],
      user: [null],
      referenceNo: [null],
      action: [null],
      registrationNo: [null]
    });
  }

  confirmCancel() {
    this.hideModal();
    this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
  }

  /**
   * Method to approve the transaction
   * @param form
   */
  confirmApprove(form: FormGroup) {
    this.approveBpmTransaction(this.estRouterData, form).subscribe(
      res => {
        this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
        this.alertService.showSuccess(res);
        this.hideModal();
      },
      err => {
        this.alertService.showError(err.error.message);
        this.hideModal();
      }
    );
  }

  /**
   * Method to reject the transaction
   * @param form
   */
  confirmReject(form: FormGroup) {
    this.rejectBpmTransaction(this.estRouterData, form).subscribe(
      res => {
        this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
        this.alertService.showSuccess(res);
        this.hideModal();
      },
      err => {
        this.alertService.showError(err.error.message);
        this.hideModal();
      }
    );
  }
  /**
   * method to return the transaction
   * @param form
   */
  confirmReturn(form: FormGroup) {
    this.returnBpmTransaction(this.estRouterData, form).subscribe(
      res => {
        this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
        this.alertService.showSuccess(res);
        this.hideModal();
      },
      err => {
        this.alertService.showError(err.error.message);
        this.hideModal();
      }
    );
  }

  /**
   * Method to show approve modal
   * @param templateRef
   */
  approveTransaction(form: FormGroup, templateRef: TemplateRef<HTMLElement>) {
    form.updateValueAndValidity();
    this.showModal(templateRef);
  }
  /**
   * Method to show reject modal
   * @param templateRef
   */
  rejectTransaction(form: FormGroup, templateRef: TemplateRef<HTMLElement>) {
    form.updateValueAndValidity();
    this.showModal(templateRef);
  }

  /**
   * Method to show return modal
   * @param templateRef
   */
  returnTransaction(form: FormGroup, templateRef: TemplateRef<HTMLElement>) {
    form.updateValueAndValidity();
    this.showModal(templateRef);
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
    return this.changeEstablishmentService
      .searchOwnerWithQueryParams(registrationNumber, [
        {
          queryKey: EstablishmentQueryKeysEnum.ESTABLISHMENT_OWNERS,
          queryValue: true
        }
      ])
      .pipe(
        catchError(err => {
          this.alertService.showError(err.error.message);
          return throwError(err);
        }),
        switchMap(res => {
          return forkJoin([
            of(res),
            this.changeEstablishmentService.searchOwnerWithQueryParams(registrationNumber, [
              {
                queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
                queryValue: referenceNumber
              }
            ])
          ]);
        })
      );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
  getAdminName(admin: Admin) {
    let adminName = null;
    if (admin && admin.person.name.arabic.firstName) {
      adminName = getArabicName(admin.person.name.arabic);
    }
    return adminName;
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
  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }
}
