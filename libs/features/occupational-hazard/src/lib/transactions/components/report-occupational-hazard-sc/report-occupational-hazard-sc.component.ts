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
  ApplicationTypeEnum,
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
import { InjuredContributorsDTO, InjuryConstants, OHTransactionType, Route } from '../../../shared';
import { OhBaseScComponent } from '../../../shared/component';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  DiseaseService,
  GroupInjuryService
} from '../../../shared/services';

@Component({
  selector: 'oh-report-occupational-hazard-sc',
  templateUrl: './report-occupational-hazard-sc.component.html',
  styleUrls: ['./report-occupational-hazard-sc.component.scss']
})
export class ReportOccupationalHazardScComponent extends OhBaseScComponent implements OnInit {
  transaction: Transaction;
  transactionRefId: number;
  transactionId: number;
  header: BilingualText;
  resourceType: string;
  code: string;
  injuryClosingStatus: BilingualText;
  comment: TransactionReferenceData[] = [];
  workflow: TransactionTrace;
  refNo: number;
  isReopen = false;
  isAppIndividual = false;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly documentService: DocumentService,
    readonly injuryService: InjuryService,
    readonly groupInjuryService: GroupInjuryService,
    readonly ohService: OhService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly contributorService: ContributorService,
    readonly transactionService: TransactionService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    readonly router: Router,
    readonly authTokenService: AuthTokenService
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

  ngOnInit() {
    this.transaction = this.transactionService.getTransactionDetails();
    this.isAppIndividual = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    if (this.transaction) {
      this.refNo = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.header = this.transaction.title;
      this.referenceNo = this.transaction.transactionRefNo;
      this.registrationNo = this.transaction.params.REGISTRATION_NO;
      this.ohService.setRegistrationNumber(this.registrationNo);
      if (this.isAppIndividual) {
        this.socialInsuranceNo = this.authTokenService.getIndividual();
      } else {
        this.socialInsuranceNo = this.transaction.params.SIN;
      }

      this.injuryId = this.transaction.params.BUSINESS_ID;
      if ((this.transactionId === 101507 || this.transactionId === 300399)) {
        this.ohService.setTransactionId(this.transactionId);
        this.ohService.setTransactionRefId(this.transaction.transactionRefNo);
        this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
        this.ohService.setDiseaseId(this.diseaseId);
        this.diseaseId = this.transaction.params.BUSINESS_ID;     
        this.getDiseaseContributor(true);
        this.getDisease(true);   
      } else if (this.transactionId === 300397) {
        this.ohService.setTransactionId(this.transactionId);
        this.ohService.setTransactionRefId(this.transaction.transactionRefNo);
        this.groupInjuryId = this.transaction.params.BUSINESS_ID;
        this.getGroupInjuryDetails();
        this.getInjuredContributors();
      } else {
        this.getInjury(true);
      }
      this.setServiceVariables();
      
      if ((this.transactionId !== 101507 && this.transactionId !== 300399)) {
        this.getEstablishment();
        if (this.registrationNo ) {
          this.getPersonDetails();
        } else {
          this.getContributor();
        }
        this.getDocuments();
      }
      this.getModifiedInjuryData();      
     
      this.fetchTransient();
      this.resourceType = 'OH Rejection Injury TPA';
    }
  }
  getGroupInjuryDetails() {
    this.groupInjuryService.setGroupInjuryId(this.groupInjuryId);
    this.groupInjuryService.getGroupInjuryDetails(this.registrationNo, this.groupInjuryId).subscribe(
      response => {
        this.groupInjuryDetailsWrapper = response;
        this.groupInjury = this.groupInjuryDetailsWrapper.groupInjuryResponseDto;
        this.groupInjury.injuryTime =
          this.groupInjury.injuryHour != null
            ? this.groupInjury.injuryHour + ':' + this.groupInjury.injuryMinute
            : null;
        this.documentService
          .getOldDocuments(this.groupInjuryId, OHTransactionType.DOCUMENT_TRANSACTION_KEY, null, null)
          .subscribe(documentResponse => {
            if (documentResponse) {
              this.documents = documentResponse.filter(item => item.documentContent !== null);
            }
          });
      },
      err => {
        this.showError(err);
      }
    );
  }
  /**
   * Method to Set RegistrationNo,InjuryId ans SIN to Ohservice
   */
  setServiceVariables() {
    this.ohService.setRegistrationNo(this.registrationNo);
    this.ohService.setInjuryId(this.injuryId);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohService.setDiseaseId(this.diseaseId);
  }

  viewInjuryDetails(injury: InjuredContributorsDTO) {
    this.ohService.setInjuryId(injury.injuryId);
    this.ohService.setIsFromGroupInjuryPage(true);
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${injury.socialInsuranceNo}/${injury.injuryId}/injury/info`
    ]);
  }
  /**
   * Fetching Documents
   */
  getDocuments() {
    this.transactionKey =
      this.transaction?.transactionId === 101553
        ? OHTransactionType.REJ_INJ_DOC_TRANSACTION_KEY
        : OHTransactionType.INJ_DOCUMENT_TRANSACTION_KEY;
    this.transactionType =
      this.transaction?.transactionId === 101553 ? OHTransactionType.REJECT_INJURY : OHTransactionType.Injury;
    this.documentService
      .getDocuments(
        this.transactionKey,
        this.transactionType,
        this.injuryId,
        this.transaction.transactionId ? this.referenceNo : null
      )
      .subscribe(documentResponse => {
        this.documents = documentResponse.filter(item => item.documentContent !== null);
      });
  }

  /**
   * Route to Injury Details Page
   */
  viewInjury() {
    this.setRoute();
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/injury/info`
    ]);
  }
  /**
   * Route setting
   */
  setRoute() {
    this.ohService.setTransactionId(this.transaction?.transactionId);
    this.ohService.setTransactionRefId(this.transaction.transactionRefNo);
    this.ohService.setRoute(Route.TRANSACTION_TRACE);
  }
  /**
   * Get Modified Injury Details
   */
  getModifiedInjuryData() {
    if (this.transaction?.transactionId === 101571 || this.transaction?.transactionId === 101573) {
      this.injuryService
        .getModifiedInjuryDetails(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.refNo)
        .subscribe(res => {
          this.modifiedInjuryDetails = res;
          this.modifiedInjuryDetails.injuryTime =
            this.modifiedInjuryDetails.injuryHour != null
              ? this.modifiedInjuryDetails.injuryHour + ':' + this.modifiedInjuryDetails.injuryMinute
              : null;
          this.code = this.getISDCodePrefix(this.modifiedInjuryDetails.emergencyContactNo);
        });
    }
  }
  fetchTransient() {
    if (this.transaction?.transactionId === 101573) {
      this.isReopen = true;
      this.injuryService
        .getInjuryDetails(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.isIndividualApp, true)
        .subscribe(res => {
          this.transientDetails = res.injuryDetailsDto;
        });
    }
  }
}
