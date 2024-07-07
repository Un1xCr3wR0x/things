import { Component, OnInit, Inject } from '@angular/core';
import { EstablishmentDetails, PenalityWavier } from '../../../../shared/models';
import { BillingConstants } from '../../../../shared/constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertService, DocumentItem, DocumentService, RouterData, RouterDataToken, scrollToTop, TransactionReferenceData, TransactionService, WorkflowService, Transaction } from '@gosi-ui/core';
import { BillingRoutingService, EstablishmentService, PenalityWavierService } from '../../../../shared/services';
import { Router } from '@angular/router';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { noop, Observable, throwError } from 'rxjs';


@Component({
  selector: 'blg-waive-establishment-penalty-sc',
  templateUrl: './waive-establishment-penalty-sc.component.html',
  styleUrls: ['./waive-establishment-penalty-sc.component.scss']
})
export class WaiveEstablishmentPenaltyScComponent implements OnInit {
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
  waiverType: string;
  socialInsuranceno: number;
  refNo: number;
  isPPA: boolean;

  constructor(
    readonly penalityWavierService: PenalityWavierService,
    readonly establishmentService: EstablishmentService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly billingRoutingService: BillingRoutingService,
    readonly transactionService: TransactionService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService
  ) { }

  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.registrationNumber = this.transaction?.params?.REGISTRATION_NO;
      this.penaltyWaiveId = this.transaction?.params?.PENALTY_WAIVER_ID;
      this.transactionId = this.transaction.transactionId;
      this.waiverType = this.transaction?.params?.WAIVERTYPE;
      this.socialInsuranceno = this.transaction?.params?.SIN;
      this.refNo = this.transaction?.transactionRefNo;
    }
    scrollToTop();
    this.getKeysFromToken();
    if (this.penaltyWaiveId && this.socialInsuranceno) this.getDataForVicExceptionalView();
    if (this.penaltyWaiveId && this.registrationNumber) this.getDataForView();
  }
  getDataForView(): void {
    this.establishmentService.getEstablishment(this.registrationNumber)
      .pipe(
        tap(res => {
          this.establishmentDetails = res;
          this.isPPA = res.ppaEstablishment;
        }),
        switchMap(() => {
          return this.penalityWavierService.getWavierPenalityDetailsForView(this.registrationNumber, this.penaltyWaiveId)
            .pipe(
              tap(res => {
                this.waiverDetails = res;
                this.exceptionalSocietyFlag = this.waiverDetails.exceptionalSociety;
                this.penaltybillBatchIndicator = res.billBatchIndicator;
                if (this.penaltybillBatchIndicator) {
                  this.alertService.setInfoByKey('BILLING.SERVICE-MAINTANACE');
                  this.isEditApprove = true;
                }
              })
            );
        }),
        switchMap(() => {
          if (this.waiverType=='SPECIAL')
          return this.getExceptionalDocuments();
          else
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
  getExceptionalDocuments(): Observable<DocumentItem[]>{
    return this.documentService
    .getDocuments(
      BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
      BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE,
      this.registrationNumber,
      this.refNo
    )
    .pipe(tap(res => (this.documents = res.filter(item => item.documentContent !== null))));

  }
  getDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
        !this.isGOL
          ? this.exceptionalSocietyFlag
            ? BillingConstants.PENALTY_WAVIER_SPCL_GOL_FO_DOC_TRANSACTION_TYPE
            : BillingConstants.PENALTY_WAVIER_FO_DOC_TRANSACTION_TYPE
          : BillingConstants.PENALTY_WAVIER_GOL_DOC_TRANSACTION_TYPE,      
        this.registrationNumber,
        this.refNo
      )
      .pipe(tap(res => (this.documents = res.filter(item => item.documentContent !== null))));
  }
  getDataForVicExceptionalView(): void {
    this.penalityWavierService
      .getExceptionalVicDetails(this.socialInsuranceno, this.penaltyWaiveId)
      .pipe(
        tap(res => {
          this.waiverDetails = res;
        }),
        switchMap(() => {
          return this.getVicDocuments();
        }),
        catchError(err => {
          this.alertService.showError(err.error.message);
          this.handleError(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  getVicDocuments(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
        BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE,
        this.socialInsuranceno,
        this.refNo
      )
      .pipe(tap(res => (this.documents = res.filter(item => item.documentContent !== null))));
  }
  getKeysFromToken(): void {
    const payload = this.routerDataToken.payload ? JSON.parse(this.routerDataToken.payload) : null;
    if (payload) {
      this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
      this.registrationNumber = payload.registrationNumber ? Number(payload.registrationNumber) : null;
      this.penaltyWaiveId = payload.penaltyWaiveId ? Number(payload.penaltyWaiveId) : null;
    }
    if (this.routerDataToken.comments.length > 0) {
      this.comments = this.routerDataToken.comments;
    }
    this.transactionNumber = this.routerDataToken.transactionId;
  }
  handleError(error) {
    this.alertService.showError(error.error.message);

  }
}


