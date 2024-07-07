/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import {
  AlertService,
  CoreAdjustmentService,
  DocumentService,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService,
  Channel,
  CommonIdentity,
  checkIqamaOrBorderOrPassport,
  formatDate,
  CoreBenefitService,
  TransactionStatus,
  DocumentItem,
  TransactionWorkflowDetails,
  GosiCalendar,
  ApplicationTypeEnum,
  AuthTokenService,
  ApplicationTypeToken
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import {
  BankService,
  DependentService,
  HeirBenefitService,
  ManageBenefitService,
  ModifyPayeeDetails,
  Contributor,
  ModifyBenefitService,
  HeirsDetails,
  BenefitDocumentService,
  SanedBenefitService,
  UiBenefitsService,
  BenefitConstants,
  HeirActiveService,
  ActiveBenefits,
  BenefitPropertyService,
  RecalculationConstants,
  getIdentityLabel,
  isDocumentsValid
} from '../../../shared';
import { TransactionBaseScComponent } from '../../base';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-modify-bank-account-sc',
  templateUrl: './modify-bank-account-sc.component.html',
  styleUrls: ['./modify-bank-account-sc.component.scss']
})
export class ModifyBankAccountScComponent extends TransactionBaseScComponent implements OnInit {
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  payeeDetails: ModifyPayeeDetails;
  contributorDetails: Contributor;
  modifyPayeeDetails: HeirsDetails[];
  sin: number;
  benefitRequestId: number;
  checkForm: FormGroup;
  transactionKey: string;
  modifyPayeeType: string;
  channel: Channel;
  authorizedPersonId: CommonIdentity | null;
  guardianPersonId: CommonIdentity | null;
  identity: CommonIdentity;
  isDirectEligible: boolean;
  iscolfour = true;
  personId: number;
  lang = 'en';
  identityLabel = ' ';
  isTransactionCompleted = false;
  reqList: DocumentItem[];
  workflow: TransactionWorkflowDetails;
  transactionInitiatedDate: GosiCalendar;
  isIndividualApp: boolean;

  constructor(
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly manageBenefitService: ManageBenefitService,
    readonly dependentService: DependentService,
    private coreBenefitService: CoreBenefitService,
    readonly alertService: AlertService,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly heirBenefitService: HeirBenefitService,
    readonly heirActiveService: HeirActiveService,
    readonly modifyBenefitService: ModifyBenefitService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly modalService: BsModalService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly uiBenefitService: UiBenefitsService,
    readonly authTokenService: AuthTokenService,
    readonly fb: FormBuilder,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
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
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.transaction = this.transactionService.getTransactionDetails();
    this.getWorkFlowDetails();
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.sin = this.transaction.params.SIN;
      this.benefitRequestId = this.transaction.params.BENEFIT_REQUEST_ID;

      this.transactionKey = 'MODIFY_PAYEE';
      this.modifyPayeeType = this.channel === Channel.FIELD_OFFICE ? 'REQUEST_BENEFIT_FO' : 'REQUEST_BENEFIT_GOL';
      this.isTransactionCompleted = this.transaction.status.english.toUpperCase() === TransactionStatus.COMPLETED;
      // this.getDocumentDetails(
      //   AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_NAME,
      //   AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_TYPE,
      //   this.modificationId,
      //   this.referenceNumber
      // );

      this.getPayeeDetails();
      if (this.isTransactionCompleted) {
        this.getTransactionCompletedDocuments();
      } else {
        this.getDocumentsForModifyPayee(
          this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin,
          this.benefitRequestId,
          this.referenceNumber,
          this.transactionKey,
          this.modifyPayeeType
        );
      }
    }
  }

  getWorkFlowDetails() {
    this.transactionService.getWorkflowDetails().subscribe(res => {
      this.workflow = res;
      this.transactionInitiatedDate = this.workflow?.workFlowList?.find(
        val => val?.status?.english?.toUpperCase() === TransactionStatus.INITIATED.toUpperCase()
      )?.date;
    });
  }

  getPayeeDetails() {
    this.modifyBenefitService.getModifyPaymentDetails(this.sin, this.benefitRequestId, this.referenceNumber).subscribe(
      res => {
        this.payeeDetails = res;
        this.contributorDetails = res?.contributor;
        this.modifyPayeeDetails = res?.heirs;
        this.identity = checkIqamaOrBorderOrPassport(this.contributorDetails?.identity);
        this.identityLabel = getIdentityLabel(this.identity);
        this.setAuthorizedIdentity();
        this.setGuardianIdentity();
        this.modifyPayeeDetails?.forEach(data => {
          if (data?.adjustments?.length > 0) {
            this.isDirectEligible = true;
          } else {
            this.isDirectEligible = true;
          }
        });
      },
      err => {
        this.showError(err);
      }
    );
  }

  setGuardianIdentity() {
    this.modifyPayeeDetails?.forEach(res => {
      if (res?.guardianPersonIdentity) {
        this.guardianPersonId = checkIqamaOrBorderOrPassport(res?.guardianPersonIdentity);
      }
    });
  }

  getDocumentsForModifyPayee(
    sin: number,
    benefitRequestId: number,
    referenceNo: number,
    transactionKey: string,
    modifyPayeeType: string
  ) {
    this.benefitDocumentService
      .getModifyPayeeDocuments(sin, benefitRequestId, referenceNo, transactionKey, modifyPayeeType)
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

  setAuthorizedIdentity() {
    this.modifyPayeeDetails?.forEach(res => {
      if (res?.authorizedPersonIdentity) {
        this.authorizedPersonId = checkIqamaOrBorderOrPassport(res?.authorizedPersonIdentity);
      }
    });
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
  navigateToInjuryDetails() {
    if (!this.isIndividualApp) {
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.sin)]);
    } else {
      this.router.navigateByUrl(`home/benefits/individual`);
    }
  }
  navigateToPrevAdjustment(personId: number) {
    this.adjustmentService.identifier = personId;
    this.adjustmentService.socialNumber = this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin,
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], {
      queryParams: { from: RecalculationConstants.MODIFY_PAYEE }
    });
  }
  onViewBenefitDetails() {
    const data = new ActiveBenefits(
      this.sin,
      this.benefitRequestId,
      this.payeeDetails?.benefitType,
      this.referenceNumber
    );
    this.coreBenefitService.setActiveBenefit(data);
    this.router.navigate([BenefitConstants.ROUTE_ACTIVE_HEIR_BENEFIT]);
  }
}
