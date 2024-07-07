import { Component, Inject, OnInit } from '@angular/core';
import { AlertService, ApplicationTypeEnum, ApplicationTypeToken, AuthTokenService, Channel, DocumentItem, DocumentService, Transaction, TransactionService } from '@gosi-ui/core';
import {
  BenefitDocumentService,
  Benefits,
  BenefitType,
  isDocumentsValid,
  ManageBenefitService,
  showErrorMessage,
  UiBenefitsService,
  UITransactionType
} from '../../../shared';

@Component({
  selector: 'bnt-transaction-saned-benefit-sc',
  templateUrl: './transaction-saned-benefit-sc.component.html',
  styleUrls: ['./transaction-saned-benefit-sc.component.scss']
})
export class TransactionSanedBenefitScComponent implements OnInit {
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  sin: number;
  benefitRequestId: number;
  uiEligibility: Benefits;
  transactionType: UITransactionType;
  channel: Channel;
  documents: DocumentItem[];
  reqList: DocumentItem[];
  isIndividualApp: boolean;

  constructor(
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly uiBenefitService: UiBenefitsService,
    readonly alertService: AlertService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly authTokenService: AuthTokenService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}

  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.transactionType = UITransactionType.FO_REQUEST_SANED;
    if (this.channel === Channel.GOSI_ONLINE) {
      this.transactionType = UITransactionType.GOL_REQUEST_SANED;
    }
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.sin = this.isIndividualApp ? this.authTokenService.getIndividual() : this.transaction.params.SIN;
      this.benefitRequestId = this.transaction.params.BENEFIT_REQUEST_ID;
      this.getUIEligibilityDetails(this.sin, BenefitType.ui);
    }
  }

  /** method to get reason for benefit*/
  getUIEligibilityDetails(sin: number, benefitType: string) {
    this.uiBenefitService.getEligibleUiBenefitByType(sin, benefitType).subscribe(
      data => {
        if (data) {
          this.uiEligibility = data;
          let transactionKey = UITransactionType.REQUEST_SANED;
          if (this.uiEligibility?.appeal) {
            transactionKey = UITransactionType.APPEAL_UNEMPLOYMENT_INSURANCE;
          }
          if (this.transaction?.status?.english === 'Completed') {
            this.getTransactionCompletedDocuments();
          } else {
            this.getDocuments(transactionKey, this.transactionType, this.benefitRequestId);
          }
          // if (data.benefitType && data.benefitType.english === this.benefitType) {
          //   if (data.warningMessages) {
          //     this.alertService.showWarning(data.warningMessages[0]);
          //   }
          // }
        }
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  getDocuments(transactionKey: string, transactionType: string, benefitRequestId: number) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionKey, transactionType)
      .subscribe(res => {
        this.documents = res;
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
