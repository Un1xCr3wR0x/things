/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject } from '@angular/core';
import {
  Transaction,
  BilingualText,
  TransactionReferenceData,
  TransactionTrace,
  AlertService,
  DocumentService,
  TransactionService,
  ApplicationTypeToken,
  LanguageToken,
  ApplicationTypeEnum,
  AuthTokenService
} from '@gosi-ui/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ContributorService,
  EstablishmentService,
  ComplicationService,
  InjuryService,
  OhService,
  OhBaseScComponent,
  OHTransactionType,
  Route,
  DiseaseService
} from '../../../shared';
import { FormBuilder } from '@angular/forms';
import { Location, PlatformLocation } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'oh-report-complication-sc',
  templateUrl: './report-complication-sc.component.html',
  styleUrls: ['./report-complication-sc.component.scss']
})
export class ReportComplicationScComponent extends OhBaseScComponent implements OnInit {
  transaction: Transaction;
  transactionRefId: number;
  transactionId: number;
  header: BilingualText;
  isReopen = false;
  resourceType: string;
  isAppIndividual = false;
  injuryClosingStatus: BilingualText;
  comment: TransactionReferenceData[] = [];
  workflow: TransactionTrace;
  refNo: number;
  complicationClosingStatus: BilingualText = new BilingualText();
  backPath = '../../../../../transactions/list';
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly injuryService: InjuryService,
    readonly ohService: OhService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly transactionService: TransactionService,
    @Inject(ApplicationTypeToken) readonly appToken: string,    
    readonly authTokenService: AuthTokenService,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    readonly router: Router
  ) {
    super(
      language,
      alertService,
      contributorService,
      documentService,
      establishmentService,
      injuryService,
      ohService,
      router,
      fb,
      complicationService,
      diseaseService,
      location,
      appToken      
    );
    pLocation.onPopState(() => {
      this.router.navigate([this.backPath], { relativeTo: this.route });
    });
  }

  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    this.isAppIndividual = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    if (this.transaction) {
      this.header = this.transaction.title;
      this.refNo = this.transaction.transactionRefNo;
      this.registrationNo = this.transaction.params.REGISTRATION_NO;
      if (this.isAppIndividual) {
        this.socialInsuranceNo = this.authTokenService.getIndividual();
      }
      else {
        this.socialInsuranceNo = this.transaction.params.SIN;
      }

      this.complicationId = this.transaction.params.BUSINESS_ID;
      this.injuryNumber = this.transaction.params.INJURY_ID;
      this.referenceNo = this.transaction.transactionRefNo;
      this.ohService.setRegistrationNo(this.registrationNo);
      this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
      this.getPerson();
      this.fetchComplicationData();
      if (this.transaction.transactionId === 101574) {
        this.fetchTransient();
      }
      if (this.transaction.transactionId === 101574 || this.transaction.transactionId === 101572) {
        this.getModifiedComplicationData();
      }
      this.getEstablishment();
      this.getContributor();
      this.getDocuments();
      this.resourceType = 'OH Rejection Injury TPA';
    }
  }
  /**
   * Get Modified Complication Details
   */
  getModifiedComplicationData() {
    this.complicationService
      .getModifiedComplicationDetails(
        this.registrationNo,
        this.socialInsuranceNo,
        this.injuryNumber,
        this.complicationId,
        this.transaction.transactionRefNo
      )
      .subscribe(res => {
        this.modifiedcomplicationDetails = res;
        this.isdCode = this.getISDCodePrefix(this.modifiedcomplicationDetails.emergencyContactNo);
      });
  }
  /**Fetching complicatiopn details */
  fetchComplicationData() {
    this.complicationService
      .getComplication(this.registrationNo, this.socialInsuranceNo, this.injuryNumber, this.complicationId, false)
      .subscribe(res => {
        this.complicationDetails = res.complicationDetailsDto;
        this.injuryId = this.complicationDetails.injuryDetails.injuryId;
        this.complicationClosingStatus = this.complicationDetails.status;
        this.idCode = this.getISDCodePrefix(this.complicationDetails.emergencyContactNo);
        if(this.complicationDetails?.isComplicationIsInInjuryEstablishment){
          this.getInjury();
        }
      });
  }
  viewComplication() {
    this.setRoute();
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryNumber}/${this.complicationId}/complication/info`
    ]);
  }
  viewInjury() {
    this.setRoute();
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`
    ]);
  }
  fetchTransient() {
    this.isReopen = true;
    this.complicationService
      .getComplication(this.registrationNo, this.socialInsuranceNo, this.injuryNumber, this.complicationId, true)
      .subscribe(res => {
        this.transientComplicationDetails = res.complicationDetailsDto;
      });
  }
  /**
   * Fetching Documents
   */
  getDocuments() {
    this.transactionKey =
      this.transaction.transactionId === 101569
        ? OHTransactionType.REJ_INJ_DOC_TRANSACTION_KEY
        : OHTransactionType.INJ_DOCUMENT_TRANSACTION_KEY;
    this.transactionType =
      this.transaction.transactionId === 101569 ? OHTransactionType.REJECT_INJURY : OHTransactionType.Complication;
    this.documentService
      .getDocuments(
        this.transactionKey,
        this.transactionType,
        this.complicationId,
        this.transaction.transactionId ? this.referenceNo : null
      )
      .subscribe(documentResponse => {
        this.documents = documentResponse.filter(item => item.documentContent !== null);
      });
  }
  setRoute() {
    this.ohService.setTransactionId(this.transaction.transactionId);
    this.ohService.setTransactionRefId(this.transaction.transactionRefNo);
    this.ohService.setRoute(Route.TRANSACTION_TRACE_COMPLICATION);
  }
}

