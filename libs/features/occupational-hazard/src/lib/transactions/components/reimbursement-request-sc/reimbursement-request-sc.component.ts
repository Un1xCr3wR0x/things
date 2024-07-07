/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location, PlatformLocation } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  DocumentService,
  LanguageToken,
  Transaction,
  TransactionReferenceData,
  TransactionService,
  TransactionTrace
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhBaseScComponent,
  OhService,
  OHTransactionType,
  ReimbursementRequestDetails,
  Route,
  DiseaseService
} from '../../../shared';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';

@Component({
  selector: 'oh-reimbursement-request-sc',
  templateUrl: './reimbursement-request-sc.component.html',
  styleUrls: ['./reimbursement-request-sc.component.scss']
})
export class ReimbursementRequestScComponent extends OhBaseScComponent implements OnInit {
  transaction: Transaction;
  transactionRefId: number;
  transactionId: number;
  header: BilingualText;
  resourceType: string;
  injuryClosingStatus: BilingualText;
  comment: TransactionReferenceData[] = [];
  reimbComment: TransactionReferenceData[] = [];
  workflow: TransactionTrace;
  reimbDetails: ReimbursementRequestDetails;
  refNo: number;
  bussinessId: number;
  isReopen = false;
  reimbId: number;
  isAppIndividual = false;
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
    readonly authTokenService: AuthTokenService,
    readonly claimService: OhClaimsService,
    @Inject(ApplicationTypeToken) readonly appToken: string,    
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    readonly router: Router,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly transactionService: TransactionService
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
  }

  ngOnInit(): void {
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.refNo = this.transaction.transactionRefNo;
      this.header = this.transaction.title;
      this.registrationNo = this.transaction.params.REGISTRATION_NO;
      if (this.isAppIndividual) {
        this.socialInsuranceNo = this.authTokenService.getIndividual();
      }
      else {
        this.socialInsuranceNo = this.transaction.params.SIN;
      }
      this.bussinessId = this.transaction.params.BUSINESS_ID;
      this.reimbId = this.transaction.params.REIMBURSEMENT_ID;
      this.injuryNumber = this.transaction.params.INJURY_ID;
      this.setServiceVariables();
      this.getEstablishment();
      this.getContributor();
      this.getReimbDetails();
      this.documentService
        .getMultipleDocuments(
          this.bussinessId,
          null,
          OHTransactionType.REIMBURSEMENT_CLAIM,
          this.transaction.transactionRefNo
        )
        .subscribe(documentsResponse => {
          if (documentsResponse.length > 0) {
            this.documents = documentsResponse?.filter(item => item.documentContent !== null);
          }
        });
    }
  }

  /**
   * Method to Set RegistrationNo,InjuryId ans SIN to Ohservice
   */
  setServiceVariables() {
    this.ohService.setRegistrationNo(this.registrationNo);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
  }
  /**
   * Get Reimbursement Details
   */
  getReimbDetails() {
    this.claimService
      .getReimbClaim(this.registrationNo, this.socialInsuranceNo, this.bussinessId, this.reimbId)
      .subscribe(
        response => {
          this.reimbDetails = response;
          this.reimbComment = [];
          const comments = new TransactionReferenceData();
          comments.comments = this.reimbDetails.comments;
          comments.role.english = this.reimbDetails.roleid;
          comments.userName.english = this.reimbDetails.userId;
          comments.createdDate = this.reimbDetails.actionedDate;
          this.reimbComment.push(comments);
        },
        err => {
          this.showError(err);
        }
      );
  }
}

