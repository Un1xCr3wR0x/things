/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  bindToObject,
  LanguageToken,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Establishment, ViolationRequest } from '../../../models';
import {
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  EstablishmentService
} from '../../../services';

@Directive()
export abstract class ComplianceBaseScComponent implements OnInit {
  registrationNumber;
  socialInsuranceNumber;
  personDetails;
  establishmentDetails: Establishment;
  engagementDetails;
  requestId;
  violationDetails: ViolationRequest;
  payload;
  referanceNumber;
  state;
  currentLang;
  isWageUpdate = false;

  constructor(
    readonly alertService: AlertService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly contractAuthenticationService: ContractAuthenticationService,
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly router: Router
  ) {}

  ngOnInit(): void {}
  listenLanguageChange() {
    this.language.subscribe(lang => {
      this.currentLang = lang;
    });
  }
  setRouterData() {
    if (this.routerDataToken.payload) {
      this.payload = JSON.parse(this.routerDataToken.payload);
      this.registrationNumber = this.payload.registrationNo;
      this.socialInsuranceNumber = this.payload.socialInsuranceNo;
      this.requestId = this.payload.requestId;
      this.referanceNumber = parseInt(this.payload.referenceNo, 10);
      this.state = this.payload?.previousOutcome;
      if (this.payload?.violationType === 'Register change engagement Wage And Occupation violation')
        this.isWageUpdate = true;
    }
  }
  /**
   * Method to get contributor details
   */
  getContributor() {
    return this.contributorService
      .getContributor(this.registrationNumber, this.socialInsuranceNumber)
      .pipe(tap(res => (this.personDetails = res)));
  }
  /** Method to get establishment details*/
  getEstablishment() {
    return this.establishmentService
      .getEstablishmentDetails(this.registrationNumber)
      .pipe(tap(res => (this.establishmentDetails = bindToObject(new Establishment(), res))));
  }
  getEngagement(engagementId) {
    return this.engagementService
      .getEngagementDetails(this.registrationNumber, this.socialInsuranceNumber, engagementId)
      .pipe(tap(res => (this.engagementDetails = res)));
  }
  getViolationRequest() {
    return this.contractAuthenticationService.getViolationRequest(this.registrationNumber, this.requestId).pipe(
      tap(res => (this.violationDetails = res)),
      switchMap(res => this.getEngagement(res.engagementId))
    );
  }
}
