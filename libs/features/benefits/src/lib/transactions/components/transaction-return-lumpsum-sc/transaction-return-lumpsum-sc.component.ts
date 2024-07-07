import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Channel,
  DocumentItem,
  DocumentService,
  LanguageToken,
  RoleIdEnum,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService
} from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  BenefitDocumentService,
  BenefitType,
  ReturnLumpsumDetails,
  ReturnLumpsumService,
  UITransactionType
} from '../../../shared';

@Component({
  selector: 'bnt-transaction-return-lumpsum-sc',
  templateUrl: './transaction-return-lumpsum-sc.component.html',
  styleUrls: ['./transaction-return-lumpsum-sc.component.scss']
})
export class TransactionReturnLumpsumScComponent implements OnInit {
  benefitType: string;
  isAppPrivate = false;
  lang = 'en';
  transaction: Transaction;
  repayId: number;
  requestId: number;
  channel: string;
  referenceNo: number;
  documentList: DocumentItem[];
  socialInsuranceNo: number;
  referenceNumber: number;
  transactionId: number;
  transactionKey: string;
  transactionType: UITransactionType;

  sin: number;
  benefitRequestId: number;
  comments: null;
  nin: number;
  returnBenefitDetails: ReturnLumpsumDetails;
  returnLumpsumForm: FormGroup;
  returnLumpsumModal: FormGroup;
  commonModalRef: BsModalRef;
  heading: string;
  isValidatorScreen = true;
  isValidatorCanEditPayment = false;
  isJailedLumpsum = false;
  isHazardous = false;
  isHeir = false;
  isOcc = false;
  isNonOcc = false;
  isWomenLumpsum = false;
  enabledRestoration: Boolean;
  isSadad: Boolean;
  enableLumpsumRepaymentId: number;
  reqDocList = [];
  accessRole = [RoleIdEnum.FC, RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER];
  rejectAccess = [RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER];
  constructor(
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly transactionService: TransactionService,
    readonly returnLumpsumService: ReturnLumpsumService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.transaction = this.transactionService.getTransactionDetails();

    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    if (this.transaction) {
      this.referenceNo = this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.socialInsuranceNo = this.transaction.params.SIN;
      this.sin = this.transaction.params.SIN;
      this.repayId = this.transaction.params.REPAY_ID;
      this.requestId = this.benefitRequestId = this.transaction.params.BENEFIT_REQUEST_ID;
      this.channel = this.transaction.channel.english;
    }
    this.getLumpsumRepaymentDetails(this.sin, this.requestId, this.repayId);
  }

  /**
   * Method to fetch the return lumpsum  details
   */
  getLumpsumRepaymentDetails(sin: number, benefitRequestId: number, repayID: number) {
    this.returnLumpsumService.getLumpsumRepaymentDetails(sin, benefitRequestId, repayID).subscribe(
      res => {
        this.returnBenefitDetails = res;
        this.nin = this.returnBenefitDetails.nin;
        this.benefitType = this.returnBenefitDetails.benefitType.english;
        this.enabledRestoration = this.returnBenefitDetails.enabledRestoration;
        this.enableLumpsumRepaymentId = this.returnBenefitDetails.enableLumpsumRepaymentId;
        this.isSadad = this.returnBenefitDetails.repaymentDetails.paymentMethod.english === 'SADAD';
        if (this.transaction?.status?.english === 'Completed') {
          this.getTransactionCompletedDocuments();
        } else {
          if (!this.isSadad) {
            this.fetchDocumentsForOtherPayment();
          }
          if (this.enabledRestoration) {
            this.fetchDocumentsForRestore(benefitRequestId);
          }
        }
        this.returnLumpsumService.setRepayId(repayID);
        this.returnLumpsumService.setBenefitReqId(benefitRequestId);
        this.setBenefitVariables(this.benefitType);
      },
      err => {
        this.showError(err);
      }
    );
  }

  getTransactionCompletedDocuments() {
    this.documentService.getAllDocuments(null, this.referenceNumber).subscribe(docs => {
      this.documentList = docs.filter(eachDoc => eachDoc.documentContent !== null);
      this.reqDocList.push(...this.documentList);
      this.reqDocList = [...this.reqDocList];
    });
  }

  // @param err This method to show the page level error
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  /**to fetch documents */
  fetchDocumentsForOtherPayment() {
    this.transactionKey = UITransactionType.REPAY_LUMPSUM_BENEFIT;
    this.transactionType =
      this.channel === Channel.FIELD_OFFICE || this.channel === 'Field Office'
        ? UITransactionType.FO_REQUEST_SANED
        : UITransactionType.GOL_REQUEST_SANED;
    this.getDocumentsForOtherPayment(
      this.transactionKey,
      this.transactionType,
      this.benefitRequestId,
      this.referenceNo
    );
  }

  getDocumentsForOtherPayment(
    transactionKey: string,
    transactionType: string,
    benefitRequestId: number,
    referenceNo: number
  ) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionKey, transactionType, referenceNo)
      .subscribe(res => {
        this.documentList = res;
        this.reqDocList.push(...this.documentList);
        this.reqDocList = [...this.reqDocList];
      });
  }
  fetchDocumentsForRestore(enableLumpsumRepaymentId: number) {
    this.transactionKey = UITransactionType.RESTORE_LUMPSUM_BENEFIT;
    this.transactionType = UITransactionType.FO_REQUEST_SANED;
    this.getDocumentsForRestore(this.transactionKey, this.transactionType, enableLumpsumRepaymentId);
  }
  getDocumentsForRestore(transactionKey: string, transactionType: string, businessId: number) {
    this.benefitDocumentService
      .getUploadedDocuments(businessId, transactionKey, transactionType)
      .subscribe(response => {
        this.documentList = response.filter(eachDoc => eachDoc.documentContent !== null);
        this.reqDocList.push(...this.documentList);
        this.reqDocList = [...this.reqDocList];
      });
  }
  setBenefitVariables(benefitType: string) {
    if (benefitType === BenefitType.hazardousLumpsum) {
      this.isHazardous = true;
    } else if (benefitType === BenefitType.jailedContributorLumpsum) {
      this.isJailedLumpsum = true;
    } else if (benefitType === BenefitType.occLumpsum) {
      this.isOcc = true;
    } else if (benefitType === BenefitType.nonOccLumpsumBenefitType) {
      this.isNonOcc = true;
    } else if (benefitType === BenefitType.womanLumpsum) {
      this.isWomenLumpsum = true;
    } else if (benefitType === BenefitType.heirLumpsum) {
      this.isHeir = true;
    }
  }
}
