import { Component, Inject, OnInit } from '@angular/core';
import {
  CoreAdjustmentService,
  DocumentService,
  Transaction,
  TransactionService,
  AlertService,
  RouterDataToken,
  RouterData,
  LookupService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Channel,
  LanguageToken,
  formatDate
} from '@gosi-ui/core';
import { TransactionBaseScComponent } from '../../base';
import {
  showErrorMessage,
  ManageBenefitService,
  AnnuityResponseDto,
  DependentService,
  HeirBenefitService,
  BankService,
  ReturnLumpsumDetails,
  ReturnLumpsumService,
  BenefitDocumentService,
  UITransactionType,
  SanedBenefitService,
  UiBenefitsService,
  BenefitType,
  BenefitPropertyService,
  BenefitConstants
} from '../../../shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-return-lumpsum-benefit-sc',
  templateUrl: './return-lumpsum-benefit-sc.component.html',
  styleUrls: ['./return-lumpsum-benefit-sc.component.scss']
})
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ReturnLumpsumBenefitScComponent extends TransactionBaseScComponent implements OnInit {
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  sin: number;
  benefitRequestId: number;
  contributorDetails: AnnuityResponseDto;
  returnBenefitDetails: ReturnLumpsumDetails;
  repayId: number;
  pageName: string;
  transactionKey: UITransactionType;
  transactionType: UITransactionType;
  channel: string;
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
  isIndividualApp: boolean;

  constructor(
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly manageBenefitService: ManageBenefitService,
    readonly dependentService: DependentService,
    readonly alertService: AlertService,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly heirBenefitService: HeirBenefitService,
    readonly returnLumpsumService: ReturnLumpsumService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly modalService: BsModalService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly uiBenefitService: UiBenefitsService,
    readonly fb: FormBuilder,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly benefitPropertyService: BenefitPropertyService,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    readonly ohService: OhService
  ) {
    super(
      documentService,
      manageBenefitService,
      dependentService,
      alertService,
      bankService,
      lookUpService,
      heirBenefitService,
      adjustmentService,
      sanedBenefitService,
      uiBenefitService,
      modalService,
      router,
      fb,
      routerData,
      benefitPropertyService,
      ohService
    );
  }

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.transaction = this.transactionService.getTransactionDetails();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.intialiseTheView(this.routerData);
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.sin = this.transaction.params.SIN;
      this.repayId = this.transaction.params.REPAY_ID;
      this.benefitRequestId = this.transaction.params.BENEFIT_REQUEST_ID;
      this.channel = this.transaction.channel.english;
      if (this.transactionId === 302020) {
        this.pageName = 'returnLumpsum';
      } else {
        this.pageName = 'enableReturnLumpsum';
      }
      // this.fetchDocuments();
      // this.getDocumentDetails(
      //   AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_NAME,
      //   AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_TYPE,
      //   this.modificationId,
      //   this.referenceNumber
      // );
    }

    this.getLumpsumRepaymentDetails(this.sin, this.benefitRequestId, this.repayId);

    // this.manageBenefitService
    //   .getAnnuityBenefitRequestDetail(this.sin, this.benefitRequestId, this.referenceNumber)
    //   .subscribe(
    //     res => {
    //       this.contributorDetails = res;
    //     },
    //     err => {
    //       if (err.status === 500 || err.status === 422 || err.status === 400) {
    //         this.showErrorMessages(err);
    //         this.goToTop();
    //       }
    //     }
    //   );
  }
  viewContributorDetails() {
    if (!this.isIndividualApp) {
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.sin)], {
        state: { loadPageWithLabel: 'BENEFITS' }
      });
    } else {
      this.router.navigateByUrl(`home/benefits/individual`);
    }
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
        if (!this.isSadad) {
          this.fetchDocumentsForOtherPayment();
        }
        if (this.enabledRestoration) {
          this.fetchDocumentsForRestore(this.enableLumpsumRepaymentId);
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
  /**to fetch documents */
  fetchDocumentsForOtherPayment() {
    this.transactionKey = UITransactionType.REPAY_LUMPSUM_BENEFIT;
    this.transactionType =
      this.channel === 'Field Office' ? UITransactionType.FO_REQUEST_SANED : UITransactionType.GOL_REQUEST_SANED;
    this.getDocumentsForOtherPayment(
      this.transactionKey,
      this.transactionType,
      this.benefitRequestId,
      this.referenceNumber
    );
  }

  getDocumentsForOtherPayment(
    transactionKey: string,
    transactionType: string,
    benefitRequestId: number,
    referenceNumber: number
  ) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionKey, transactionType, referenceNumber)
      .subscribe(res => {
        this.documents = res;
      });
  }
  fetchDocumentsForRestore(enableLumpsumRepaymentId: number) {
    this.transactionKey = UITransactionType.RESTORE_LUMPSUM_BENEFIT;
    this.transactionType = UITransactionType.FO_REQUEST_SANED;
    this.getDocumentsForRestore(this.transactionKey, this.transactionType, enableLumpsumRepaymentId);
  }
  getDocumentsForRestore(transactionKey: string, transactionType: string, enableLumpsumRepaymentId: number) {
    this.benefitDocumentService
      .getUploadedDocuments(enableLumpsumRepaymentId, transactionKey, transactionType)
      .subscribe(response => {
        this.documents = response.filter(eachDoc => eachDoc.documentContent !== null);
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

  fetchDocuments() {
    this.transactionKey = UITransactionType.REPAY_LUMPSUM_BENEFIT;
    // this.transactionType = this.channel === Channel.FIELD_OFFICE ? UITransactionType.FO_REQUEST_SANED : UITransactionType.GOL_REQUEST_SANED;
    this.transactionType = UITransactionType.FO_REQUEST_SANED;
    this.benefitDocumentService
      .getUploadedDocuments(this.repayId, this.transactionKey, this.transactionType)
      .subscribe(response => {
        this.documents = response;
      });
  }

  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
