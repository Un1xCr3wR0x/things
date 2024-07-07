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
  BenefitPropertyService,
  BenefitConstants,
  ActiveBenefits
} from '../../../shared';
import { TransactionBaseScComponent } from '../../base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-hold-benefit-transaction-sc',
  templateUrl: './hold-benefit-transaction-sc.component.html',
  styleUrls: ['./hold-benefit-transaction-sc.component.scss']
})
export class HoldBenefitTransactionScComponent extends TransactionBaseScComponent implements OnInit {
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
  holdBenefitDetails: HoldBenefitDetails;
  modifyHoldForm: FormGroup;
  readMore = false;
  showMoreText = 'BENEFITS.READ-FULL-NOTE';
  limitvalue: number;
  limit = 100;
  eachType: string;
  holdHeading: string;
  isIndividualApp: boolean;

  constructor(
    readonly documentService: DocumentService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly coreBenefitService: CoreBenefitService,
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
    readonly fb: FormBuilder,
    readonly modifyBenefitService: ModifyBenefitService,
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
        this.getHoldDetails(this.sin, this.benReqId, this.referenceNumber);
      }
    }
  }
  getHoldDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.modifyBenefitService.getHoldBenefitDetails(sin, benefitRequestId, referenceNo).subscribe(
      res => {
        this.holdBenefitDetails = res;
        this.eachType = new BenefitDetailsHeading(
          this.holdBenefitDetails?.pension?.annuityBenefitType?.english
        ).getHeading();

        this.identity = checkIqamaOrBorderOrPassport(this.holdBenefitDetails?.contributor?.identity);
        this.fetchDocumentsForHoldBenefit();
      },
      err => {
        this.showError(err);
      }
    );
  }
  fetchDocumentsForHoldBenefit() {
    this.transactionKey = UITransactionType.HOLD_RETIREMENT_PENSION_BENEFIT;
    this.transactionType = UITransactionType.FO_REQUEST_SANED;
    this.getDocumentsForHoldBenefit(this.transactionKey, this.transactionType, this.benReqId);
  }

  getDocumentsForHoldBenefit(transactionKey: string, transactionType: string, benefitRequestId: number) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionKey, transactionType)
      .subscribe(res => {
        this.documents = res;
      });
  }
  viewContributorDetails() {
    this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.sin)], {
      state: { loadPageWithLabel: 'BENEFITS' }
    });
  }
  onViewBenefitDetails() {
    const data = new ActiveBenefits(
      this.sin,
      this.benReqId,
      this.holdBenefitDetails?.pension?.annuityBenefitType,
      this.referenceNumber
    );
    this.coreBenefitService.setActiveBenefit(data);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
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
}
