import { Component, Inject, OnInit } from '@angular/core';
import {
  AlertService,
  CoreAdjustmentService,
  Channel,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService,
  CommonIdentity,
  DocumentItem,
  ApplicationTypeToken,
  LanguageToken,
  checkIqamaOrBorderOrPassport,
  CoreBenefitService,
  TransactionStatus,
  ApplicationTypeEnum,
  AuthTokenService
} from '@gosi-ui/core';
import {
  AnnuityResponseDto,
  BankService,
  BenefitDocumentService,
  DependentService,
  HeirBenefitService,
  ManageBenefitService,
  UITransactionType,
  SanedBenefitService,
  UiBenefitsService,
  ImprisonmentDetails,
  BenefitValues,
  Contributor,
  HoldBenefitDetails,
  BenefitDetails,
  PersonalInformation,
  AttorneyDetailsWrapper,
  BenefitType,
  ModifyBenefitService,
  BenefitDetailsHeading,
  BenefitConstants,
  ActiveBenefits,
  BenefitPropertyService
} from '../../../shared';
import { TransactionBaseScComponent } from '../../base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-stop-benefit-transaction-sc',
  templateUrl: './stop-benefit-transaction-sc.component.html',
  styleUrls: ['./stop-benefit-transaction-sc.component.scss']
})
export class StopBenefitTransactionScComponent extends TransactionBaseScComponent implements OnInit {
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  sin: number;
  benReqId: number;
  lang = 'en';
  annuityBenefitDetails: AnnuityResponseDto;
  benefitType: BenefitType.restartbenefit;
  nin: number;
  requestType: string;
  checkForm: FormGroup;
  transactionKey: string;
  transactionType: string;
  reqList: DocumentItem[];
  requestId: number;
  businessId: number;
  contributorDetails: Contributor;
  identity: CommonIdentity | null;
  benefitValuesConstants = BenefitValues;
  stopBenefitForm: FormGroup;
  stopDetails: HoldBenefitDetails;
  stopBenefitType: string;
  eachType: string;
  stopHeading: string;
  readMore = false;
  showMoreText = 'BENEFITS.READ-FULL-NOTE';
  limitvalue: number;
  limit = 100;
  checkBenefitType = BenefitType.stopbenefit;
  isCompletedTransaction = false;
  isIndividualApp: boolean;

  constructor(
    readonly documentService: DocumentService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly transactionService: TransactionService,
    readonly manageBenefitService: ManageBenefitService,
    readonly dependentService: DependentService,
    readonly alertService: AlertService,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly heirBenefitService: HeirBenefitService,
    readonly modalService: BsModalService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly uiBenefitService: UiBenefitsService,
    readonly adjustmentPaymentService: CoreAdjustmentService,
    readonly fb: FormBuilder,
    readonly modifyBenefitService: ModifyBenefitService,
    readonly coreBenefitService: CoreBenefitService,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly authTokenService: AuthTokenService,
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
    this.limitvalue = this.limit;
    this.transaction = this.transactionService.getTransactionDetails();
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.checkForm = this.fb.group({
      checkBoxFlag: [false]
    });
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.sin = this.isIndividualApp ? this.authTokenService.getIndividual() : this.transaction.params.SIN;
      this.businessId = this.transaction.params.BUSINESS_ID;
      this.benReqId = this.transaction.params.BENEFIT_REQUEST_ID;
      if (this.sin && this.benReqId && this.referenceNumber) {
        this.getStopBenefitDetails(this.sin, this.benReqId, this.referenceNumber);
      }
      this.isCompletedTransaction = this.transaction?.status?.english?.toUpperCase() === TransactionStatus.COMPLETED;
    }
  }
  getStopBenefitDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.modifyBenefitService.getstopDetails(sin, benefitRequestId, referenceNo).subscribe(
      res => {
        this.stopDetails = res;
        this.eachType = new BenefitDetailsHeading(this.stopDetails?.pension?.annuityBenefitType?.english).getHeading();
        this.contributorDetails = res?.contributor;
        this.identity = checkIqamaOrBorderOrPassport(this.contributorDetails?.identity);
        this.fetchStopBenefitDocs();
      },
      err => {
        this.showError(err);
      }
    );
  }
  fetchStopBenefitDocs() {
    this.transactionKey = 'STOP_BENEFIT';
    this.stopBenefitType = 'REQUEST_BENEFIT_FO';
    this.getDocumentsForStopBenefit(
      this.sin,
      this.benReqId,
      this.referenceNumber,
      this.transactionKey,
      this.stopBenefitType
    );
  }
  getDocumentsForStopBenefit(
    sin: number,
    benefitRequestId: number,
    referenceNo: number,
    transactionKey: string,
    stopBenefitType: string
  ) {
    this.benefitDocumentService
      .getStopBenefitDocuments(sin, benefitRequestId, referenceNo, transactionKey, stopBenefitType)
      .subscribe(res => {
        this.documents = res;
      });
  }
  navigateToInjuryDetails() {
    this.router.navigate([`home/profile/contributor/${this.registrationNo}/${this.sin}/info`]);
  }
  viewContributorDetails() {
    this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.sin)], {
      state: { loadPageWithLabel: 'BENEFITS' }
    });
  }
  navigateToPrevAdjustment() {
    this.adjustmentPaymentService.identifier = this.stopDetails?.personId;
    this.adjustmentPaymentService.sin = this.transaction.params.SIN;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT]);
  }
  readFullNote(noteText) {
    this.readMore = !this.readMore;
    if (this.readMore) {
      this.limit = noteText.length;
      this.showMoreText = 'BENEFITS.READ-LESS-NOTE';
    } else {
      this.limit = this.limitvalue;
      this.showMoreText = 'BENEFITS.READ-FULL-NOTE';
    }
  }
  onViewBenefitDetails() {
    const data = new ActiveBenefits(
      this.sin,
      this.benReqId,
      this.stopDetails?.pension?.annuityBenefitType,
      this.referenceNumber
    );
    this.coreBenefitService.setActiveBenefit(data);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
  }
}
