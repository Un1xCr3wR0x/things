/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  CoreAdjustmentService,
  DocumentService,
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
  BankService,
  BenefitDetails,
  BenefitDocumentService,
  BenefitType,
  DependentDetails,
  DependentService,
  FuneralBenefitService,
  HeirBenefitService,
  HeirDetailsRequest,
  ManageBenefitService,
  SanedBenefitService,
  UiBenefitsService,
  TransactionType,
  UITransactionType,
  BenefitPropertyService
} from '../../../shared';
import { TransactionBaseScComponent } from '../../base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-modify-heir-sc',
  templateUrl: './modify-heir-sc.component.html',
  styleUrls: ['./modify-heir-sc.component.scss']
})
export class ModifyHeirScComponent extends TransactionBaseScComponent implements OnInit {
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  funeralBeneficiaryDetails: BenefitDetails[];
  heirAccordianPresent: boolean;
  socialInsuranceNo: number;
  requestId: number;
  heirDetailsResp: AnnuityResponseDto;
  heirDetailsData: HeirDetailsRequest;
  benefitTypes: BilingualText;
  heirList: DependentDetails[];
  lang = 'en';
  channel: string;
  transactionKey: string;
  transactionType: string;
  requestType = BenefitType.addModifyHeir;
  isIndividualApp: boolean;

  constructor(
    readonly documentService: DocumentService,
    readonly funeralBenefitService: FuneralBenefitService,
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
    readonly authTokenService: AuthTokenService,
    readonly fb: FormBuilder,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
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
  // :9830/v1/contributor/399378249/benefit/1003631404/req-docs?referenceNo=1042202

  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.socialInsuranceNo = this.transaction.params.SIN;
      this.requestId = this.transaction.params.BENEFIT_REQUEST_ID;
      this.requestType = this.transactionId ? TransactionType[this.transactionId] : null;
    }
    if (this.socialInsuranceNo && this.requestId && this.referenceNumber) {
      this.fetchAnnuityBenefitDetails(this.isIndividualApp ? this.authTokenService.getIndividual() : this.socialInsuranceNo, this.requestId, this.referenceNumber);
    }
    this.getDocuments(
      this.transactionKey,
      this.transactionType,
      this.isIndividualApp ? this.authTokenService.getIndividual() : this.socialInsuranceNo,      this.requestId,
      this.referenceNumber
    );
    this.getBeneficiaryDetails();
  }
  getDocuments(transactionKey, transactionType, socialInsuranceNo, requestId, referenceNumber) {
    this.benefitDocumentService
      .getValidatorDocuments(socialInsuranceNo, requestId, referenceNumber, transactionKey, transactionType)
      .subscribe(res => {
        this.documents = res;
      });
  }
  getBeneficiaryDetails() {
    if (this.socialInsuranceNo && this.requestId && this.referenceNumber) {
      this.dependentService.getBenefitHistory(this.socialInsuranceNo, this.requestId).subscribe(
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
