import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  Channel,
  DocumentItem,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BenefitDocumentService, isDocumentsValid, ManageBenefitService, UITransactionType } from '../../../shared';

@Component({
  selector: 'bnt-transaction-funeral-grant-sc',
  templateUrl: './transaction-funeral-grant-sc.component.html',
  styleUrls: ['./transaction-funeral-grant-sc.component.scss']
})
export class TransactionFuneralGrantScComponent implements OnInit {
  transaction: Transaction;
  lang = 'en';
  transactionId: number;
  channel: BilingualText;
  sin: number;
  businessId: number;
  documents: DocumentItem[];
  referenceNumber: number;
  benefitRequestId: number;
  requestId: number;
  transactionName: string;
  transactionType: string;
  transactionKey: string;
  reqList: DocumentItem[];
  isIndividualApp: boolean;

  constructor(
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly manageBenefitService: ManageBenefitService,
    readonly transactionService: TransactionService,
    readonly authTokenService: AuthTokenService,
    public route: ActivatedRoute,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.transaction = this.transactionService.getTransactionDetails();
    this.transactionId = this.transaction.transactionId;
    this.getDocumentRelatedValues();
    if (this.transaction?.status?.english === 'Completed') {
      this.getTransactionCompletedDocuments();
    } else {
      this.fetchDocuments();
    }
  }

  getDocumentRelatedValues() {
    this.channel = this.transaction.channel;
    this.referenceNumber = this.transaction.transactionRefNo;
    this.transactionId = this.transaction.transactionId;
    this.sin = this.transaction.params.SIN;
    this.requestId = this.transaction.params.BENEFIT_REQUEST_ID;
    this.businessId = this.transaction.params.BUSINESS_ID;
  }

  fetchDocuments() {
    this.transactionKey = UITransactionType.REQUEST_FUNERAL_GRANT;
    this.transactionType =
      this.channel.english === Channel.FIELD_OFFICE
        ? UITransactionType.FO_REQUEST_SANED
        : UITransactionType.GOL_REQUEST_SANED;
    this.getDocuments(this.transactionKey, this.transactionType, this.requestId, this.referenceNumber);
  }

  getDocuments(
    transactionKey: string,
    transactionType: string,
    benefitRequestId: number,
    referenceNo: number,
    isBackDated = false
  ) {
    this.benefitDocumentService
      .getValidatorDocuments(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, benefitRequestId, referenceNo, transactionKey, transactionType, isBackDated)
      .subscribe(res => {
        this.reqList = res;
        if (isDocumentsValid(this.reqList)) {
          this.documents = this.reqList;
        }
      });
  }

  getTransactionCompletedDocuments() {
    this.documentService.getAllDocuments(null, this.referenceNumber).subscribe(docs => {
      this.reqList = docs;
      if (isDocumentsValid(this.reqList)) {
        this.documents = this.reqList;
      }
    });
  }
}
