import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  LanguageToken,
  AuthTokenService,
  WorkflowService,
  Environment,
  EnvironmentToken,
  TransactionService,
  RouterService,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  CoreBenefitService,
  GosiCalendar
} from '@gosi-ui/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IndividualRoleConstants } from '../../constants';
import { IndividualDashboardService } from '../../services/individual-dashboard.service';
import { IndividualBaseScComponent } from '../base/individual-base-sc.component';
import { InjuryHistory } from '@gosi-ui/features/occupational-hazard/lib/shared/models/injury-history';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared/services/oh.service';
import {
  BenefitType,
  BenefitValues,
  DependentService,
  HeirStatusType,
  isHeirBenefit,
  ManageBenefitService,
  SanedBenefitService,
  UiBenefitsService
} from '@gosi-ui/features/benefits/lib/shared';
import { Contributor, ContributorService } from '@gosi-ui/features/contributor/lib/shared';
import { Benefits } from '../../models';

@Component({
  selector: 'dsb-individual-dashboard-sc',
  templateUrl: './individual-dashboard-sc.component.html',
  styleUrls: ['./individual-dashboard-sc.component.scss']
})
export class IndividualDashboardScComponent extends IndividualBaseScComponent implements OnInit {
  isAppIndividual: boolean;
  sinSubscription: Subscription;
  systemRunDate: GosiCalendar;
  userDetails: Contributor;
  registrationNo: number;
  annuitybenefits: Benefits[] = [];
  uiBenefits: Benefits;
  eligibleBenefits: Benefits[] = [];

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly individualAppDashboardService: IndividualDashboardService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly authTokenService: AuthTokenService,
    readonly workflowService: WorkflowService,
    readonly ohService: OhService,
    @Inject(EnvironmentToken) readonly environment: Environment,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly transactionService: TransactionService,
    readonly routerService: RouterService,
    readonly manageBenefitService: ManageBenefitService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly uiBenefitService: UiBenefitsService,
    readonly dependentService: DependentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly contributorService: ContributorService
  ) {
    super(
      language,
      individualAppDashboardService,
      alertService,
      workflowService,
      environment,
      transactionService,
      routerService,
      authTokenService
    );
  }
  lang = 'en';
  userRoleArray: string[] = [];
  roleArray = [];
  inboxtaskCount: number;
  showEngHistory: boolean;
  isSubscriber: boolean;
  isBeneficiary = false;
  ngOnInit(): void {
    this.language.subscribe(lang => (this.lang = lang));
    const identifier = this.authTokenService.getIndividual();
    this.isAppIndividual = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    this.manageBenefitService.nin = identifier;
    this.fectchValues(identifier);
    this.fetchIndvRoles();
    this.coreBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
    });
    super.ngOnInit();
    super.getRequest();
    this.fetchRequest();
    if (this.identifier) {
      this.getBenefits(this.identifier);
      this.getEligibileBenefitDetails(this.identifier);
      this.getEligibleSanedBenefits(this.identifier);
    }
    this.getUserStatus(this.authTokenService.getIndividual());
    // this.estRegNo = this.dashboardSearchService.registrationNo;
    // console.log("estRegNo is", this.estRegNo)
    // this.ohService.setRegistrationNo(this.estRegNo);
  }
  getUserStatus(individualId: number) {
    this.contributorService.getUserStatus(individualId).subscribe(
      res => {
        this.userDetails = res;
      },
      error => {
        this.alertService.showError(error.error.message);
      }
    );
  }
  fetchRequest() {
    this.transactionService.transactionCount$.subscribe(item => {
      this.inboxtaskCount = item;
    });
  }
  fetchIndvRoles() {
    const gosiscp = this.authTokenService.getEntitlements();
    this.userRoleArray = gosiscp?.length > 0 ? gosiscp?.[0]?.role?.map(r => r.toString()) : [];
    IndividualRoleConstants.INDV_ROLES.filter(v => {
      if (this.userRoleArray.includes(v.roleId.toString())) {
        this.roleArray.push(v.roleName);
      }
    });
    if (this.roleArray.includes('DASHBOARD.SUBSCRIBER')) {
      this.fetchOhDetails(this.identifier);
      this.isSubscriber = true;
    }
    if (this.roleArray.includes('DASHBOARD.VIC')) {
      this.isVic = true;
    }
    //if (this.roleArray.includes('DASHBOARD.BENEFICIARY')) {
    //  this.isBeneficiary = true;
    //}
  }
  navigateToEngagement() {
    this.router.navigate([`/home/contributor/individual/contributions`]);
    //, {
    //   queryParams: {
    //     identifier: this.identifier,
    //     dashboardFlag : true
    //   }
    // });
  }
  viewComplication(complication: InjuryHistory) {
    this.ohService.setComplicationId(complication.injuryId);
    this.ohService.setInjuryNumber(complication.injuryNo);
    this.ohService.setRegistrationNo(complication.establishmentRegNo);
    this.ohService.setSocialInsuranceNo(this.identifier);
    this.ohService.setComplicationstatus(complication.status);
    if (complication.actualStatus) {
      this.router.navigate(
        [
          `home/oh/view/${complication.establishmentRegNo}/${this.identifier}/${complication.injuryNo}/${complication.injuryId}/complication/info`
        ],
        {
          queryParams: {
            fromDashboard: true
          }
        }
      );
    }
  }
  navigateToInbox() {
    this.router.navigate([`/home/transactions/list/todolist`]);
  }
  navigateToBill() {
    this.router.navigate(['/home/billing/vic/dashboard'], {
      queryParams: {
        idNo: this.identifier,
        isDashboard: 'true'
      }
    });
  }
  navigateToWage() {
    this.router.navigate(['/home/contributor/engagement/wage-breakup']);
  }
  getEligibileBenefitDetails(identifier: number) {
    this.manageBenefitService.getAnnuityBenefits(identifier).subscribe(res => {
      this.annuitybenefits = res;
      const retirementBenefit: Benefits[] = this.annuitybenefits.filter(
        val =>
          (val.benefitType.english === BenefitType.retirementPension ||
            val.benefitType.english === BenefitType.earlyretirement ||
            val.benefitType.english === BenefitType.retirementLumpsum) &&
          val.status === BenefitValues.new &&
          val.eligible
      );
      if (!retirementBenefit || retirementBenefit?.length < 1) return;
      if (retirementBenefit.findIndex(ben => this.isRetirementPensionType(ben)) >= 0) {
        this.sanedBenefitService.getPensionCalculator(0, null, 0, identifier).subscribe(
          val => {
            retirementBenefit.forEach(benefit => {
              if (this.isRetirementPensionType(benefit)) benefit.amount = val?.benefitAmount;
            });
            this.addEligibleRetirementBenefits(retirementBenefit);
          },
          () => {
            this.addEligibleRetirementBenefits(retirementBenefit);
          }
        );
      } else {
        this.addEligibleRetirementBenefits(retirementBenefit);
      }
    });
  }
  addEligibleRetirementBenefits(retirementBenefit: Benefits[]) {
    retirementBenefit.forEach(benefit => {
      this.eligibleBenefits.push(benefit);
    });
    this.eligibleBenefits = [...this.eligibleBenefits];
  }
  isRetirementPensionType(benefit: Benefits) {
    return (
      benefit?.benefitType?.english === BenefitType.retirementPension ||
      benefit?.benefitType?.english === BenefitType.earlyretirement
    );
  }
  getEligibleSanedBenefits(identifier: number) {
    this.uiBenefitService.getUIBenefits(identifier).subscribe(res => {
      this.uiBenefits = res;
      if (res?.eligible) {
        this.sanedBenefitService.getBenefitCalculationsForSaned(identifier).subscribe(
          val => {
            this.uiBenefits.amount = val?.initialMonths?.amount;
            this.addEligibleSanedbenefits(res);
          },
          () => {
            this.addEligibleSanedbenefits(res);
          }
        );
      }
    });
  }
  addEligibleSanedbenefits(res: Benefits) {
    if (res?.status === BenefitValues.new && res?.applicable) this.eligibleBenefits.push(this.uiBenefits);
    if (this.eligibleBenefits?.length > 0) this.eligibleBenefits = [...this.eligibleBenefits];
  }
  getBenefits(identifier: number) {
    const status = ['Active', 'Draft', 'In Progress'];
    this.sanedBenefitService.getBenefitsWithStatus(identifier, status).subscribe(response => {
      this.activeBenefitsList = response;
      this.activeBenefitsList.forEach((benefit, index) => {
        this.benefitType = benefit.benefitType.english;
        this.status = this.setStatusValues(isHeirBenefit(this.benefitType));
        this.getDependentDetails(index, this.isAppIndividual ? this.identifier : benefit.sin, benefit.benefitRequestId, null, this.status);
      });
    });
  }
  getDependentDetails(index: number, sin: number, benefitRequestId: number, referenceNo: number, status: string[]) {
    if(sin){
      this.dependentService.getDependentDetailsById(sin, benefitRequestId.toString(), referenceNo, status).subscribe(
        res => {
          this.dependentDetails = res;
          this.activeBenefitsList[index].dependentDetails = this.dependentDetails;
        },
        err => {
          this.showErrorMessage(err);
        }
      );
    }
  }
  showErrorMessage(err: any) {
    throw new Error('Method not implemented.');
  }
  // navigateToAddInjury() {
  //   this.ohService.setSocialInsuranceNo(this.identifier);
  //   this.ohService.setInjuryId(null);
  //   this.registrationNo = this.ohService.getRegistrationNumber();
  //   this.ohService.setRegistrationNo(this.registrationNo);
  //   this.router.navigate([RouteConstants.ROUTE_INJURY_ADD]);
  // }
  setStatusValues(isHeir = false) {
    let status;
    if (isHeir) {
      status = [
        HeirStatusType.ACTIVE,
        HeirStatusType.ONHOLD,
        HeirStatusType.REPAY_LUMPSUM,
        HeirStatusType.INITIATED,
        HeirStatusType.REJECTED,
        HeirStatusType.INACTIVE,
        HeirStatusType.WAIVED
      ];
    } else {
      status = [
        HeirStatusType.ACTIVE,
        HeirStatusType.INACTIVE,
        HeirStatusType.ONHOLD,
        HeirStatusType.STOPPED,
        HeirStatusType.WAIVED
      ];
    }
    return status;
  }
}
