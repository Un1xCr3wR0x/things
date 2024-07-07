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
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService
} from '@gosi-ui/core';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { BehaviorSubject } from 'rxjs';
import {
  BenefitConstants,
  BenefitDocumentService,
  getTransactionTypeOrId,
  HeirStatus,
  isDocumentsValid,
  ManageBenefitService,
  showErrorMessage,
  UIPayloadKeyEnum,
  UITransactionType
} from '../../../shared';

@Component({
  selector: 'bnt-transaction-retirement-lumpsum-sc',
  templateUrl: './transaction-retirement-lumpsum-sc.component.html',
  styleUrls: ['./transaction-retirement-lumpsum-sc.component.scss']
})
export class TransactionRetirementLumpsumScComponent implements OnInit {
  transaction: Transaction;
  lang = 'en';
  systemParameter: SystemParameter;
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
  isJailedLumpsum = false;
  isRPALumpsum = false;
  isEarlyRetirement = false;
  isNonOcc = false;
  isNonOccDisabilityAssessment = false;
  isJailedPension = false;
  isHazardous = false;
  isHeir = false;
  isOcc = false;
  isHoldBenefit = false;
  status: BilingualText;
  isIndividualApp: boolean;

  constructor(
    readonly alertService: AlertService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly documentService: DocumentService,
    readonly manageBenefitService: ManageBenefitService,
    public route: ActivatedRoute,
    readonly transactionService: TransactionService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly authTokenService: AuthTokenService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang; //required
    });
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.route.queryParams.subscribe(params => {
      this.isNonOcc = params.nonocc === 'true';
      this.isJailedLumpsum = params.jailedlumpsum === 'true';
      this.isHazardous = params.hazardous === 'true';
      this.isHeir = params.heir === 'true';
      this.isOcc = params.occ === 'true';
      this.isRPALumpsum = params.rpa === 'true';
      this.isHoldBenefit = params.hold === 'true';
    });
    this.getSystemParam(); //required
    this.transaction = this.transactionService.getTransactionDetails();
    this.transactionId = this.transaction.transactionId;
    this.getDocumentRelatedValues();
    // if (this.transactionId === Number(302001)) {
    //   this.getDocuments(this.transactionKey, this.transactionType, this.benefitRequestId, this.referenceNumber);
    // }
    if (this.transaction?.status?.english === 'Completed') {
      this.getTransactionCompletedDocuments();
    } else {
      this.fetchDocuments();
    }
  }

  getSystemParam() {
    this.manageBenefitService.getSystemParams().subscribe(
      res => {
        this.systemParameter = new SystemParameter().fromJsonToObject(res);
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  getDocumentRelatedValues() {
    this.channel = this.transaction.channel;
    this.referenceNumber = this.transaction.transactionRefNo;
    this.transactionId = this.transaction.transactionId;
    this.sin = this.transaction.params.SIN;
    this.benefitRequestId = this.transaction.params.BENEFIT_REQUEST_ID;
    this.businessId = this.transaction.params.BUSINESS_ID;
    this.requestId = +this.routerData.idParams.get(UIPayloadKeyEnum.ID);
    this.status = this.transaction.status;
  }

  /** this function to fetch the documents required  */
  fetchDocuments() {
    if (this.isNonOcc) {
      this.transactionKey = UITransactionType.REQUEST_NON_OCC_LUMPSUM_TRANSACTION;
    } else if (this.isJailedLumpsum) {
      this.transactionKey = UITransactionType.REQUEST_JAILED_LUMPSUM_TRANSACTION;
    } else if (this.isHazardous) {
      this.transactionKey = UITransactionType.REQUEST_HAZARDOUS_LUMPSUM_TRANSACTION;
    } else if (this.isHeir) {
      this.transactionKey = UITransactionType.REQUEST_HEIR_LUMPSUM_TRANSACTION;
    } else if (this.isOcc) {
      this.transactionKey = UITransactionType.REQUEST_OCC_LUMPSUM_TRANSACTION;
    } else if (this.isRPALumpsum) {
      this.transactionKey = UITransactionType.REQUEST_RPA_LUMPSUM_BENEFIT;
    } else {
      this.transactionKey = UITransactionType.REQUEST_PENSION_LUMPSUM_BENEFIT;
    }
    this.transactionType =
      this.channel.english === Channel.FIELD_OFFICE ||
      this.channel.english === ChannelConstants.CHANNELS_FILTER_TRANSACTIONS[1].english
        ? UITransactionType.FO_REQUEST_SANED
        : UITransactionType.GOL_REQUEST_SANED;
    this.getDocuments(this.transactionKey, this.transactionType, this.benefitRequestId, this.referenceNumber);
  }
  getTransactionCompletedDocuments() {
    this.documentService.getAllDocuments(null, this.referenceNumber).subscribe(docs => {
      this.reqList = docs;
      if (isDocumentsValid(this.reqList)) {
        this.documents = this.reqList;
      }
    });
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
}
