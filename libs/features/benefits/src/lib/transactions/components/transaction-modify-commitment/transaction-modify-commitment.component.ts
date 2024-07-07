import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  Channel,
  ChannelConstants,
  DocumentItem,
  LanguageToken,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BenefitConstants, BenefitDocumentService, ManageBenefitService } from '../../../shared';

@Component({
  selector: 'bnt-transaction-modify-commitment',
  templateUrl: './transaction-modify-commitment.component.html',
  styleUrls: ['./transaction-modify-commitment.component.scss']
})
export class TransactionModifyCommitmentComponent implements OnInit {
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
  isModifyBank = false;
  isRemoveBank = false;
  status;
  isIndividualApp: boolean;
  isAddBank: boolean;

  constructor(
    readonly alertService: AlertService,
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
    this.language.subscribe(lang => {
      this.lang = lang; //required
    });
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.isModifyBank = params.modifybank === 'true';
        this.isRemoveBank = params.removebank === 'true';
        this.isAddBank = params.addbank === 'true';
      }
    });
    this.transaction = this.transactionService.getTransactionDetails();
    this.transactionId = this.transaction.transactionId;
    this.getDocumentRelatedValues();
    if (this.sin && this.requestId && this.referenceNumber) {
      this.fetchDocumentsForModify();
    }
  }

  getDocumentRelatedValues() {
    this.channel = this.transaction.channel;
    this.referenceNumber = this.transaction.transactionRefNo;
    this.transactionId = this.transaction.transactionId;
    this.sin = this.transaction.params.SIN;
    this.requestId = this.transaction.params.BENEFIT_REQUEST_ID;
    this.businessId = this.transaction.params.BUSINESS_ID;
    this.status = this.transaction?.status?.english;
  }

  fetchDocumentsForModify() {
    this.transactionKey =
      this.isModifyBank ?
        BenefitConstants.MODIFY_ACCOUNT :
        this.isAddBank ?
          BenefitConstants.ADD_BANK_COMMITMENT :
        BenefitConstants.REMOVE_ACCOUNT;
    const transactionType =
      this.channel.english === ChannelConstants.CHANNELS_FILTER_TRANSACTIONS[1].english
        ? BenefitConstants.REQUEST_BENEFIT_FO
        : BenefitConstants.REQUEST_BENEFIT_GOL;
    if (this.isModifyBank) {
      this.benefitDocumentService
        .getModifyBankDocuments(
          this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin,
          this.requestId,
          this.referenceNumber,
          this.transactionKey,
          this.transactionType
        )
        .subscribe(res => {
          this.documents = res;
        });
    } else {
      this.getDocumentsForModify(this.transactionKey, transactionType, this.requestId);
    }
  }
  getDocumentsForModify(transactionKey: string, transactionType: string, benefitRequestId: number) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionKey, transactionType)
      .subscribe(res => {
        this.documents = res;
      });
  }
}
