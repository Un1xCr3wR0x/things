/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { AlertService, BorderNumber, Iqama, LanguageToken, NationalId, NIN, Passport, formatDate, ApplicationTypeEnum, ApplicationTypeToken, AuthTokenService } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { Location } from '@angular/common';
import {
  AnnuityResponseDto,
  DependentService,
  DependentSetValues,
  DependentStatusHistory,
  ManageBenefitService,
  ModifyBenefitService
} from '../../shared';

@Component({
  selector: 'bnt-dependent-eligibility-details-sc',
  templateUrl: './dependent-eligibility-details-sc.component.html',
  styleUrls: ['./dependent-eligibility-details-sc.component.scss']
})
export class DependentEligibilityDetailsScComponent implements OnInit {
  dependentBenefit: DependentSetValues;
  activeBenefitDetails: AnnuityResponseDto;
  statusHistoryDetails: DependentStatusHistory;
  lang = 'en';
  sin: number;
  benefitRequestId: number;
  benefitType: string;
  referenceNo: number;
  isSmallScreen: boolean;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  name: string;
  personId: number;
  isAppIndividual: boolean;

  constructor(
    readonly alertService: AlertService,
    readonly manageBenefitService: ManageBenefitService,
    readonly authTokenService: AuthTokenService,
    private modifyPensionService: ModifyBenefitService,
    private dependentService: DependentService,
    private location: Location,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.isAppIndividual = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    this.language.subscribe(language => {
      this.lang = language;
    });
    // accessing the active Benefit details which set which user click on active benefits carousel
    this.dependentBenefit = this.modifyPensionService.getDependentDetails();

    if (this.dependentBenefit) {
      this.sin = this.dependentBenefit?.sin;
      this.benefitRequestId = this.dependentBenefit?.benefitRequestId;
      this.benefitType = this.dependentBenefit?.benefitType;
      this.referenceNo = this.dependentBenefit?.referenceNo;
      this.identity = this.dependentBenefit?.identity;
      this.name = this.dependentBenefit?.name?.english?.name;
      this.personId = this.dependentBenefit?.personId;
      this.getDependentStausDetails(this.isAppIndividual ? this.authTokenService.getIndividual() : this.sin, this.benefitRequestId, this.personId);
    }
  }
  // Fetch active benefit Details
  getDependentStausDetails(sin: number, benefitRequestId: number, personId: number) {
    this.dependentService.getStatusHistoryDetails(sin, benefitRequestId, personId).subscribe(
      res => {
        this.statusHistoryDetails = res;
      },
      err => {
        this.showErrorMessage(err);
      }
    );
  }
  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err.error.details && err.error.details.length > 0) {
      this.alertService.showError(null, err.error.details);
    } else {
      this.alertService.showError(err.error.message);
    }
  }
  // viewContributorDetails() {
  //   this.router.navigate([`home/profile/contributor/${this.sin}/info`]);
  // }
  /** Route back to previous page */
  routeBack() {
    this.location.back();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
