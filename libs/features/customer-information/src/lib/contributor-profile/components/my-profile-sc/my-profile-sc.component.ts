import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  LookupService,
  AuthTokenService
} from '@gosi-ui/core';
import { ContributorService } from '@gosi-ui/features/contributor/lib/shared/services';
import { Contributor } from '@gosi-ui/features/contributor/lib/shared';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ChangePersonScBaseComponent, ChangePersonService, RoleConstants } from '../../../shared';
import { SanedBenefitService } from '@gosi-ui/features/benefits/lib/shared/services';
import { ActiveBenefits, BenefitStatus } from '@gosi-ui/features/benefits/lib/shared';
@Component({
  selector: 'cim-my-profile-sc',
  templateUrl: './my-profile-sc.component.html',
  styleUrls: ['./my-profile-sc.component.scss']
})
export class MyProfileScComponent extends ChangePersonScBaseComponent implements OnInit {
  userRoleArray: string[] = [];
  roleArray = [];
  lang = 'en';
  identifier: number;
  navigatedFrom: string;
  userDetails: Contributor;
  activeBenefit: ActiveBenefits;

  constructor(
    readonly changePersonService: ChangePersonService,
    readonly lookService: LookupService,
    readonly dashboardSearchService: DashboardSearchService,
    readonly contributorService: ContributorService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    public modalService: BsModalService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly authTokenService: AuthTokenService,
    readonly sanedBenefitService: SanedBenefitService
  ) {
    super(
      changePersonService,
      dashboardSearchService,
      contributorService,
      lookService,
      appToken,
      alertService,
      documentService,
      modalService,
      route
    );
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { navigatedFrom: string };
    this.navigatedFrom = state?.navigatedFrom;
  }

  ngOnInit() {
    super.ngOnInit();
    this.language.subscribe(lang => (this.lang = lang));
    this.identifier = this.authTokenService.getIndividual();
    if (this.identifier) {
      this.getUserStatus(this.identifier);
      this.getProfileDetails(this.identifier);
      // this.changePersonService.getSinValue(this.identifier).subscribe(val => {
      //   this.sin = val?.listOfPersons[0]?.socialInsuranceNumber[0];
      // });
    }
    this.fetchIndvRoles();
  }
  // Story 554035: Message in Individual app: My profile bank details for the beneficiary
  getUserStatus(identifier: number) {
    this.contributorService.getUserStatus(identifier).subscribe(
      res => {
        this.userDetails = res;
        if (res?.isBeneficiary) {
          this.getBenefits(identifier);
        }
      },
      error => {
        this.alertService.showError(error.error.message);
      }
    );
  }
  getBenefits(identifier: number) {
    const status = ['Active', 'Draft', 'In Progress'];
    this.sanedBenefitService.getBenefitsWithStatus(identifier, status).subscribe(response => {
      // this.activeBenefitsList = response;
      this.activeBenefit = response.find(item => item?.status?.english === BenefitStatus.ACTIVE);
    });
  }
  fetchIndvRoles() {
    const gosiscp = this.authTokenService.getEntitlements();
    this.userRoleArray = gosiscp?.length > 0 ? gosiscp?.[0]?.role?.map(r => r.toString()) : [];
    RoleConstants.INDV_ROLES.filter(v => {
      if (this.userRoleArray.includes(v.roleId.toString())) {
        this.roleArray.push(v.roleName);
      }
    });
  }
  navigateTo() {
    this.router.navigate(['/home/individual/profile/modify'], {
      queryParams: {
        identifier: this.identifier
      }
    });
  }

  reverifyDetailsFn(bankDetails) {
    this.changePersonService.verifyBankDetails(this.identifier, bankDetails).subscribe(res => {
      this.alertService.clearAlerts();
      this.alertService.showSuccess(res?.bilingualMessage, null, 5);
      this.getFinancialDetails(this.identifier);
    });
  }
}
