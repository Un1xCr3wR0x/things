import { Component, OnInit, Inject } from '@angular/core';
import {
  CreditBalanceDetails,
  CreditRefundDetails,
  EstablishmentDetails,
  PenalityWavier,
  VicCreditRefundIbanDetails
} from '../../../../shared/models';
import { BillingConstants } from '../../../../shared/constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertService,
  DocumentItem,
  DocumentService,
  RouterData,
  RouterDataToken,
  scrollToTop,
  TransactionReferenceData,
  TransactionService,
  WorkflowService,
  Transaction,
  BilingualText,
  LookupService
} from '@gosi-ui/core';
import { BillingRoutingService, EstablishmentService, CreditManagementService } from '../../../../shared/services';
import { Router } from '@angular/router';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { noop, Observable, throwError } from 'rxjs';

@Component({
  selector: 'blg-credit-refund-establishment-view-sc',
  templateUrl: './credit-refund-establishment-view-sc.component.html',
  styleUrls: ['./credit-refund-establishment-view-sc.component.scss']
})
export class CreditRefundEstablishmentViewScComponent implements OnInit {
  //Local variables
  modalRef: BsModalRef;
  waiverDetails: PenalityWavier;
  establishmentDetails: EstablishmentDetails;
  penaltyWaiveId: number;
  registrationNumber: number;
  transactionNumber: number;
  documents: DocumentItem[];
  comments: TransactionReferenceData[] = [];
  exceptionalSocietyFlag = false;
  penaltybillBatchIndicator = false;
  isEditApprove = false;
  referenceNumber: number;
  isGOL: boolean;
  transaction: Transaction;
  transactionId: number;
  CreditRefundDetails: CreditRefundDetails;
  creditBalanceDetails: CreditBalanceDetails;
  requestNo: number;
  creditRefundbillBatchIndicator = false;
  editFlag: boolean;
  bankName: BilingualText = new BilingualText();
  iscreditRefund = true;
  vicCreditRefundIbanDetails: VicCreditRefundIbanDetails;
  constructor(
    readonly creditManagementService: CreditManagementService,
    readonly establishmentService: EstablishmentService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly billingRoutingService: BillingRoutingService,
    readonly transactionService: TransactionService,
    private lookUpService: LookupService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService
  ) {}

  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.registrationNumber = this.transaction?.params?.REGISTRATION_NO;
      this.requestNo = this.transaction?.params?.CREDIT_REQUEST_NUMBER;
      this.transactionId = this.transaction.transactionId;
    }
    scrollToTop();
    this.getKeysFromToken();
    if (this.registrationNumber) this.getDataForView();
    this.getAllcreditDetails(this.registrationNumber, this.requestNo);
  }
  getKeysFromToken(): void {
    const payload = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payload) {
      this.requestNo = payload.requestId ? Number(payload.requestId) : null;
      this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
      this.isGOL = payload.channel === 'gosi-online' ? true : false;
      this.registrationNumber = payload.registrationNo ? Number(payload.registrationNo) : null;
    }
    if (this.routerDataToken.comments.length > 0) {
      this.comments = this.routerDataToken.comments;
    }
    this.transactionNumber = this.routerDataToken.transactionId;
  }

  getDataForView(): void {
    this.establishmentService
      .getEstablishment(this.registrationNumber)
      .pipe(
        tap(res => {
          this.establishmentDetails = res;
        }),
        switchMap(() => {
          return this.getDocuments();
        }),
        catchError(err => {
          this.alertService.showError(err.error.message);
          this.handleError(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  handleError(err: any) {}
  getAvailableBalanceDetails(regNumber: number) {
    this.creditManagementService.getAvailableCreditBalance(regNumber).subscribe(
      data => {
        this.creditBalanceDetails = data;
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  getDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.CREDIT_REFUND_ID,
        BillingConstants.CREDIT_REFUND_TRANSACTION_TYPE,
        this.registrationNumber,
        this.referenceNumber
      )
      .pipe(tap(res => (this.documents = res.filter(item => item.documentContent !== null))));
  }
  getAllcreditDetails(registrationNumber: number, requestNo: number) {
    this.creditManagementService.getRefundDetails(registrationNumber, requestNo).subscribe(
      data => {
        this.CreditRefundDetails = data;
        this.creditRefundbillBatchIndicator = data.billBatchIndicator;
        if (this.creditRefundbillBatchIndicator) {
          this.alertService.setInfoByKey('BILLING.SERVICE-MAINTANACE');
          this.isEditApprove = true;
        }
        if (this.CreditRefundDetails.haveActiveCancellationRequest) this.editFlag = false;
        this.getContributorDetails(this.CreditRefundDetails.iban);
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }

  getContributorDetails(iBanCode: string) {
    this.lookUpService.getBankForIban(iBanCode.slice(4, 6)).subscribe(
      res => {
        this.bankName = res.items[0]?.value;
      },
      err => this.handleError(err)
    );
  }
}
