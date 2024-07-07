import {Component, Inject, OnInit} from '@angular/core';
import {
  AlertService,
  DocumentItem,
  DocumentService,
  RouterData,
  RouterDataToken, Transaction, TransactionService,
} from "@gosi-ui/core";
import {EstablishmentDetails, MiscellaneousRequest} from "@gosi-ui/features/collection/billing/lib/shared/models";
import {
  EstablishmentService,
  MiscellaneousAdjustmentService
} from "@gosi-ui/features/collection/billing/lib/shared/services";
import {Router} from "@angular/router";
import {catchError, switchMap, tap} from "rxjs/operators";
import {BillingConstants} from "@gosi-ui/features/collection/billing/lib/shared/constants";
import {noop, Observable, throwError} from "rxjs";

@Component({
  selector: 'blg-miscellaneous-adjustment-view-sc',
  templateUrl: './miscellaneous-adjustment-view-sc.component.html',
  styleUrls: ['./miscellaneous-adjustment-view-sc.component.scss']
})
export class MiscellaneousAdjustmentViewScComponent implements OnInit {
  //Local variables
  transaction: Transaction;
  documents: DocumentItem[];
  registrationNumber: number;
  establishmentDetails: EstablishmentDetails;
  editFlag = false;
  misceId: number;
  miscellanousDetails: MiscellaneousRequest = new MiscellaneousRequest();
  isReopenClosingInProgress: boolean;
  isPPAEst = false;

  /**
   *
   * @param miscellanousAdjustmentService
   * @param establishmentService
   * @param documentService
   * @param alertService
   * @param router
   * @param routerDataToken
   * @param transactionService
   */
  constructor(
    readonly miscellanousAdjustmentService: MiscellaneousAdjustmentService,
    readonly establishmentService: EstablishmentService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly transactionService: TransactionService
) {}

  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.registrationNumber = this.transaction?.params?.REGISTRATION_NO;
      this.misceId = this.transaction?.params?.MISC_REFERENCE_NO;
    }
    if (this.misceId && this.registrationNumber) this.getDataForViews();
  }

  getDataForViews() {
    this.establishmentService
      .getEstablishment(this.registrationNumber)
      .pipe(
        tap(response => {
          this.establishmentDetails = response;
          this.isPPAEst = response?.ppaEstablishment;
          this.isReopenClosingInProgress =
            response?.status?.english === BillingConstants.REOPEN_CLOSING_IN_PROGRESS_STATUS ? true : false;
        }),
        switchMap(() => {
          return this.miscellanousAdjustmentService
            .getValidatorMiscellaneousDetails(this.registrationNumber, this.misceId)
            .pipe(
              tap(response => {
                this.miscellanousDetails = response;
              })
            );
        }),
        switchMap(() => {
          return this.getMiscDocuments();
        }),
        catchError(error => {
          this.alertService.showError(error.error.message);
          this.handleErrors(error);
          return throwError(error);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to handle error. */
  handleErrors(error) {
    this.alertService.showError(error.error.message);
  }

  /** Method to get documents. */
  getMiscDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.MISC_ADJUSTMENT_DOC_TRANSACTION_ID,
        BillingConstants.MISC_ADJUSTMENT_DOC_TRANSACTION_TYPE,
        this.registrationNumber,
      )
      .pipe(tap(res => (this.documents = res.filter(item => item.documentContent !== null))));
  }

}
