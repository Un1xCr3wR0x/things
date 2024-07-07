import { Component, Inject, OnInit } from '@angular/core';
import {
  AlertService,
  DocumentItem,
  DocumentService,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionReferenceData,
  TransactionService
} from '@gosi-ui/core';
import { noop, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { BillingConstants } from '../../../../shared/constants';
import {
  EstablishmentDetails,
  CreditBalanceDetails,
  CreditManagmentRequest,
  RecipientAmountDetails
} from '../../../../shared/models';
import { EstablishmentService, CreditManagementService } from '../../../../shared/services';

@Component({
  selector: 'blg-credit-transfer-sc',
  templateUrl: './credit-transfer-sc.component.html',
  styleUrls: ['./credit-transfer-sc.component.scss']
})
export class CreditTransferScComponent implements OnInit {
  documents: DocumentItem[];
  requestNo: number;
  isGOL: boolean;
  referenceNumber: number;
  registrationNumber: number;
  comments: TransactionReferenceData[] = [];
  transactionNumber: number;
  establishmentDetails: EstablishmentDetails;
  transaction: Transaction;
  transactionId: number;
  creditBalanceDetails: CreditBalanceDetails;
  creditAvailableBalance: boolean;
  currentBalanceList = [];
  creditEstDetails: CreditManagmentRequest;
  isEditApprove = false;
  creditTransferbillBatchIndicator = false;
  recipientDetail: RecipientAmountDetails[];

  constructor(
    readonly creditManagementService: CreditManagementService,
    readonly transactionService: TransactionService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {}

  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.registrationNumber = this.transaction?.params?.REGISTRATION_NO;
      this.requestNo = this.transaction?.params?.CREDIT_REQUEST_NUMBER;
      this.transactionId = this.transaction.transactionId;
    }
    if (this.registrationNumber) this.getDataForCreditTransferView();
    this.getAllcreditDetails(this.registrationNumber, this.requestNo);
    this.getCreditTransferAvailableBalanceDetails(this.registrationNumber);
    this.getCreditTransferKeys();
  }
  getDataForCreditTransferView() {
    this.establishmentService
      .getEstablishment(this.registrationNumber)
      .pipe(
        tap(res => {
          this.establishmentDetails = res;
          this.getCreditTransferAvailableBalanceDetails(this.registrationNumber);
        }),
        switchMap(() => {
          return this.getDocuments();
        }),
        catchError(errs => {
          this.alertService.showError(errs.error.message);
          this.handleError(errs);
          return throwError(errs);
        })
      )
      .subscribe(noop, noop);
  }
  handleError(error: any) {
    this.alertService.showError(error.error.message);
  }
  getDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.CREDIT_MANAGEMENT_ID,
        !this.isGOL
          ? BillingConstants.CREDIT_MANAGEMENT_TRANSACTION_FO_TYPE
          : BillingConstants.CREDIT_MANAGEMENT_TRANSACTION_GOL_TYPE,
        this.registrationNumber,
        this.referenceNumber
      )
      .pipe(tap(res => (this.documents = res.filter(item => item.documentContent !== null))));
  }
  getCreditTransferAvailableBalanceDetails(registrationNumber: number) {
    this.creditManagementService.getAvailableCreditBalance(registrationNumber).subscribe(
      datas => {
        this.creditBalanceDetails = datas;
      },
      errs => {
        this.alertService.showError(errs.error.message);
      }
    );
  }

  /** Method to read keys from token. */
  getCreditTransferKeys(): void {
    const payloads = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payloads) {
      this.requestNo = payloads.requestId ? Number(payloads.requestId) : null;
      this.isGOL = payloads.channel === 'gosi-online' ? true : false;
      this.referenceNumber = payloads.referenceNo ? Number(payloads.referenceNo) : null;
      this.registrationNumber = payloads.registrationNo ? Number(payloads.registrationNo) : null;
    }
    if (this.routerDataToken.comments.length > 0) {
      this.comments = this.routerDataToken.comments;
    }
    this.transactionNumber = this.routerDataToken.transactionId;
  }
  /** Method to get all credit establishment details. */
  getAllcreditDetails(registrationNumber, requestNo) {
    this.creditManagementService.getAllCreditBalanceDetails(registrationNumber, requestNo).subscribe(
      data => {
        this.creditEstDetails = data;
        this.creditTransferbillBatchIndicator = data.billBatchIndicator;
        this.recipientDetail = data.recipientDetail;
        this.isEditApprove = data.haveActiveCancellationRequest;
        if (this.creditTransferbillBatchIndicator) {
          this.alertService.setInfoByKey('BILLING.SERVICE-MAINTANACE');
          this.isEditApprove = true;
        }
        this.creditEstDetails.recipientDetail.forEach(res => {
          this.creditManagementService.getAvailableCreditBalance(res.registrationNo).subscribe(values => {
            this.creditBalanceDetails = values;
            if (this.creditBalanceDetails.totalCreditBalance || this.creditBalanceDetails.totalDebitBalance) {
              const obj = {
                balance:
                  this.creditBalanceDetails.totalCreditBalance !== 0
                    ? this.creditBalanceDetails.totalCreditBalance
                    : this.creditBalanceDetails.totalDebitBalance,
                regNo: res.registrationNo,
                creditBalance: this.creditBalanceDetails.totalCreditBalance !== 0 ? true : false,
                debitBalance: this.creditBalanceDetails.totalDebitBalance !== 0 ? true : false
              };
              this.currentBalanceList.push(obj);
            } else {
              const evt = {
                balance: 0,
                regNo: res.registrationNo
              };
              this.currentBalanceList.push(evt);
            }
          });
        });
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
}
