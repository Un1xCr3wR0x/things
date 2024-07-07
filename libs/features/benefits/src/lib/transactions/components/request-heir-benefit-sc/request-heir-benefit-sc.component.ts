/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  ChannelConstants,
  CoreAdjustmentService,
  DocumentItem,
  DocumentService,
  GosiCalendar,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import {
  AnnuityResponseDto,
  AttorneyDetailsWrapper,
  BankService,
  BenefitConstants,
  BenefitDetails,
  BenefitDocumentService,
  BenefitValues,
  CreditBalanceDetails,
  DependentDetails,
  DependentService,
  FuneralBenefitService,
  HeirBenefitService,
  ManageBenefitService,
  PersonalInformation,
  UnemploymentResponseDto,
  SanedBenefitService,
  UiBenefitsService,
  UITransactionType,
  BenefitPropertyService
} from '../../../shared';
import { FuneralGrantBeneficiaryResponse } from '../../../shared/models/funeral-grant-beneficiary-response';
import { TransactionBaseScComponent } from '../../base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-request-heir-benefit-sc',
  templateUrl: './request-heir-benefit-sc.component.html',
  styleUrls: ['./request-heir-benefit-sc.component.scss']
})
export class RequestHeirBenefitScComponent extends TransactionBaseScComponent implements OnInit {
  transaction: Transaction;
  transactionId: number;
  paymentDetails;
  contributorDetails;
  documents: DocumentItem[];
  personDetails: PersonalInformation;
  socialInsuranceNo: number;
  requestId: number;
  referenceNumber: number;
  annuityBenefitDetails: AnnuityResponseDto;
  benefitType: string;
  authPersonId: number;
  isHeirBenefit = false;
  isJailedBenefit = false;
  requestType: string;
  reqPensionBenefit: boolean;
  personNameEnglish: string;
  personNameArabic: String;
  notificationDate: GosiCalendar;
  requestDate: GosiCalendar;
  dependentDetails: DependentDetails[];
  heirDetails: DependentDetails[];
  nin: number;
  channel: BilingualText;
  transactionNumber: string;
  transactionName: string;
  creditBalanceDetails: CreditBalanceDetails;
  benefitCalculationDetails: BenefitDetails;
  preSelectedAuthperson: AttorneyDetailsWrapper[];
  benefitRequest: UnemploymentResponseDto;
  funeralBeneficiaryDetails: FuneralGrantBeneficiaryResponse;
  bankTransfer = BenefitValues.BANK;
  status: BilingualText;
  isIndividualApp: boolean;
  // businessTransaction=
  // businessTransactionId=

  constructor(
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly manageBenefitService: ManageBenefitService,
    readonly dependentService: DependentService,
    readonly alertService: AlertService,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly heirBenefitService: HeirBenefitService,
    readonly authTokenService: AuthTokenService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly funeralBenefitService: FuneralBenefitService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly uiBenefitService: UiBenefitsService,
    readonly fb: FormBuilder,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly benefitPropertyService: BenefitPropertyService,
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
    this.transaction = this.transactionService.getTransactionDetails();
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.socialInsuranceNo = this.transaction.params.SIN;
      this.requestId = this.transaction.params.BENEFIT_REQUEST_ID;
      this.channel = this.transaction.channel;
      this.status = this.transaction.status;
      if (this.channel.english === ChannelConstants.CHANNELS_FILTER_TRANSACTIONS[1].english)
        this.transactionName = UITransactionType.FO_REQUEST_SANED;
      else this.transactionName = UITransactionType.GOL_REQUEST_SANED;
      if (this.transactionId === Number(BenefitConstants.TRANSACTIONID_HEIR_PENSION)) {
        this.reqPensionBenefit = true;
        this.transactionNumber = UITransactionType.REQUEST_HEIR_PENSION_TRANSACTION;
      } else if (this.transactionId === Number(BenefitConstants.TRANSACTIONID_HAZARDOUS_LUMPSUM)) {
        this.reqPensionBenefit = false;
        this.transactionNumber = UITransactionType.REQUEST_HEIR_LUMPSUM_TRANSACTION;
      }
      if (this.status.english === BenefitConstants.COMPLETED) {
        this.benefitDocumentService
          .fetchDocs(this.requestId, this.referenceNumber, this.transactionNumber, this.transactionName)
          .subscribe(res => {
            this.documents = res;
            this.documents.forEach(doc => {
              this.refreshDocument(doc);
            });
          });
      } else {
        this.benefitDocumentService
          .getRequiredDocuments(this.socialInsuranceNo, this.requestId, this.referenceNumber)
          .subscribe(res => {
            this.documents = res;
            this.documents.forEach(doc => {
              this.refreshDocument(doc);
            });
          });
      }
    }
    this.fetchAnnuityBenefitDetails(this.isIndividualApp ? this.authTokenService.getIndividual() : this.socialInsuranceNo, this.requestId, this.referenceNumber);
    this.getBeneficiaryDetails();
  }
  refreshDocument(doc: DocumentItem) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(doc, this.requestId, this.transactionNumber, this.transactionName, this.referenceNumber)
        .subscribe(res => {
          doc = res;
        });
    }
  }
  getBeneficiaryDetails() {
    if (this.socialInsuranceNo && this.requestId && this.referenceNumber) {
      this.funeralBenefitService
        .getBeneficiaryRequestDetails(this.socialInsuranceNo, this.requestId, this.referenceNumber)
        .subscribe(
          res => {
            this.funeralBeneficiaryDetails = res;
          },
          err => {
            this.showError(err);
          }
        );
    }
  }
}
