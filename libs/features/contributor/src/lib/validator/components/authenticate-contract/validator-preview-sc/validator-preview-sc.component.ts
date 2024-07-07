/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AlertService, BankAccount, BaseComponent, BilingualText, bindToObject, QueryParams } from '@gosi-ui/core';
import { concat } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ContractStatus } from '../../../../shared/enums';
import {
  Clauses,
  ContractDetails,
  ContractParams,
  Contributor,
  EngagementDetails,
  Establishment
} from '../../../../shared/models';
import {
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  EstablishmentService
} from '../../../../shared/services';

@Component({
  selector: 'cnt-validator-preview-sc',
  templateUrl: './validator-preview-sc.component.html',
  styleUrls: ['./validator-preview-sc.component.scss']
})
export class ValidatorPreviewScComponent extends BaseComponent implements OnInit {
  /** Local variables. */
  bankInfo: BankAccount;
  personDetailsPreview: Contributor;
  previewEstablishment: Establishment;
  contractAtValidator: ContractDetails;
  contractClauses: Clauses[];
  contractId: number;
  activeEngagement: EngagementDetails;
  registrationNo: number;
  socialInsuranceNo: number;
  engagementId: number;
  previewHeading: BilingualText;
  transportationAllowance: number;
  transactionContractId: number;

  /** Creates an instance of ValidatorPreviewScComponent */
  constructor(
    readonly contractAuthenticationService: ContractAuthenticationService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly activatedRoute: ActivatedRoute
  ) {
    super();
  }

  /** Method to  initialize the component. */
  ngOnInit(): void {
    this.previewHeading = this.getBilingualText('Contract Preview', 'معاينة العقد');
    this.initializeKeysForView();
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) this.intitializeView();
  }

  /** Method to initialize keys for view. */
  initializeKeysForView() {
    this.activatedRoute.paramMap.subscribe((res: ParamMap) => {
      this.registrationNo = res['params']['regNo'];
      this.socialInsuranceNo = res['params']['sinNo'];
      this.engagementId = res['params']['engId'];
    });
    this.activatedRoute.queryParams.subscribe(res => {
      this.transactionContractId = res.param;
    });
  }

  /** Method to get Bilingual Text. */
  getBilingualText(english: string, arabic: string) {
    return { english: english, arabic: arabic };
  }

  /** Method to initialize view. */
  intitializeView() {
    concat(
      this.getEstablishmentDetails(),
      this.getContributorDetails(),
      this.getEngagementDetails(),
      this.getContractDetails()
    ).subscribe();
  }

  /** Method to get establishment details. */
  getEstablishmentDetails() {
    return this.establishmentService
      .getEstablishmentDetails(this.registrationNo)
      .pipe(tap(res => (this.previewEstablishment = bindToObject(new Establishment(), res))));
  }

  /** To get contributor details. */
  getContributorDetails() {
    return this.contributorService
      .getContributor(this.registrationNo, this.socialInsuranceNo)
      .pipe(tap(res => (this.personDetailsPreview = res)));
  }

  /** Method to get Active Engagement */
  getEngagementDetails() {
    return this.engagementService
      .getEngagementDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId)
      .pipe(
        tap(res => {
          this.activeEngagement = bindToObject(new EngagementDetails(), res);
          this.activeEngagement['engagementPeriod'] = res['engagementPeriod'].filter(period => !period['endDate']);
        })
      );
  }

  /** Method to get contract in validator */
  getContractDetails() {
    if (this.transactionContractId) {
      return this.contractAuthenticationService
        .getContracts(
          this.registrationNo,
          this.socialInsuranceNo,
          new ContractParams(this.engagementId, null, this.transactionContractId)
        )
        .pipe(
          tap(res => {
            this.contractAtValidator = res['contracts'][0];
            this.contractId = this.contractAtValidator?.id;
            this.contractClauses = this.contractAtValidator.contractClauses;
            this.transportationAllowance = this.contractAtValidator.wage?.transportationAllowance ?? 0;
            this.bankInfo = this.contractAtValidator.bankAccount;
          })
        );
    } else {
      return this.contractAuthenticationService
        .getContracts(
          this.registrationNo,
          this.socialInsuranceNo,
          new ContractParams(this.engagementId, ContractStatus.VALIDATOR_PENDING, null)
        )
        .pipe(
          tap(res => {
            this.contractAtValidator = res['contracts'][0];
            this.contractId = this.contractAtValidator?.id;
            this.contractClauses = this.contractAtValidator.contractClauses;
            this.transportationAllowance = this.contractAtValidator.wage?.transportationAllowance ?? 0;
            this.bankInfo = this.contractAtValidator.bankAccount;
          })
        );
    }
  }

  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    this.alertService.showError(err.error.message, err.error.details);
  }
}
