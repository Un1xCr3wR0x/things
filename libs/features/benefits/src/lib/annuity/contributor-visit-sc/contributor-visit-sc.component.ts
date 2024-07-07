/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken, AuthTokenService, CoreActiveBenefits, CoreBenefitService, LanguageToken } from '@gosi-ui/core';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ManageBenefitService, UiBenefitsService } from '../../shared';
import { UISanedBenifitsEligibilityListItemDto } from '../../shared/models/saned-eligibility';

@Component({
  selector: 'bnt-contributor-visit-sc',
  templateUrl: './contributor-visit-sc.component.html',
  styleUrls: ['./contributor-visit-sc.component.scss']
})
export class ContributorVisitScComponent implements OnInit {
  activeBenefit: CoreActiveBenefits;
  sin: number;
  benefitRequestId: number;
  eligibilityList: UISanedBenifitsEligibilityListItemDto[];
  lang = 'en';

  isAnnuity = false;
  isEligible = false;
  isUiBenefits = false;
  isIndividualApp: boolean;

  constructor(
    readonly location: Location,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    public route: ActivatedRoute,
    readonly authTokenService: AuthTokenService,
    readonly coreBenefitService: CoreBenefitService,
    readonly manageBenefitService: ManageBenefitService,
    readonly uiBenefitsService: UiBenefitsService
  ) {}

  ngOnInit(): void {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.sin = this.isIndividualApp ? this.authTokenService.getIndividual() : this.manageBenefitService.socialInsuranceNo;
    this.language.subscribe(language => {
      this.lang = language;
    });

    this.route.queryParams.subscribe(params => {
      this.isAnnuity = params.annuity === 'true' ? true : false;
      this.isEligible = params.isEligible === 'true' ? true : false;
      this.isUiBenefits = params.uiBenefits === 'true' ? true : false;
    });
    this.uiBenefitsService.getSanedBenefitsEligibilityList(this.sin).subscribe(res => {
      this.eligibilityList = res.uiContributorEligibilityDetailsItemDto;
    });
    //console.log('------ uiContributorEligibilityDetailsItemDto -----');
    //console.log(this.eligibilityList);
  }

  routeBack() {
    this.location.back();
  }
}
