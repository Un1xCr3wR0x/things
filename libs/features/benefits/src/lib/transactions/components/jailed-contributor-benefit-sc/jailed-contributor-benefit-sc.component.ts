/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
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
  LanguageToken,
  formatDate,
  ApplicationTypeEnum,
  ApplicationTypeToken,
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
  BenefitPropertyService,
  ImprisonmentDetails
} from '../../../shared';
import { TransactionBaseScComponent } from '../../base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-jailed-contributor-benefit-sc',
  templateUrl: './jailed-contributor-benefit-sc.component.html',
  styleUrls: ['./jailed-contributor-benefit-sc.component.scss']
})
export class JailedContributorBenefitScComponent extends TransactionBaseScComponent implements OnInit {
  // Local varaibles
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  channel = 'field-office';
  heirDetailsResp: AnnuityResponseDto;
  imprisonmentAdjustments: ImprisonmentDetails;
  heirAccordianPresent = false;
  sin: number;
  requestId: number;
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
    readonly fb: FormBuilder,
    readonly router: Router,
    readonly authTokenService: AuthTokenService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly benefitPropertyService: BenefitPropertyService,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
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
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.requestId = this.transaction.params.BENEFIT_REQUEST_ID;
      this.sin = this.isIndividualApp ? this.authTokenService.getIndividual() : this.transaction.params.SIN;
    }
    if (this.sin && this.requestId && this.referenceNumber) {
      this.getImprisonmentModifyDet();
    }
    if (this.sin && this.requestId) {
      this.getImprisonmentAdjustments(this.sin, this.requestId);
    }
  }
  /**
   * Method to fetch the Imprisonment details
   */
  getImprisonmentModifyDet() {
    this.manageBenefitService
      .getAnnuityBenefitRequestDetail(this.sin, this.requestId, this.referenceNumber)
      .subscribe(res => {
        this.heirDetailsResp = res;
        this.fetchDocumentsForImprisonmentModify();
      });
  }
  getImprisonmentAdjustments(sin: number, requestId: number) {
    this.dependentService.getImprisonmentDetails(sin, requestId).subscribe(
      res => {
        if (res) {
          this.imprisonmentAdjustments = res;
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  /**to fetch documents */
  fetchDocumentsForImprisonmentModify() {
    const transactionKey = UITransactionType.REQUEST_MODIFY_IMPRISONMENT_TRANSACTION;
    const transactionType =
      this.channel === Channel.FIELD_OFFICE ? UITransactionType.FO_REQUEST_SANED : UITransactionType.GOL_REQUEST_SANED;
    this.benefitDocumentService.getUploadedDocuments(this.requestId, transactionKey, transactionType).subscribe(res => {
      this.documents = res;
    });
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
