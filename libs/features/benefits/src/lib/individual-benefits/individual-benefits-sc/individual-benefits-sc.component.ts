import { Component, OnInit, Inject, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import {
  Benefits,
  UiBenefitsService,
  showErrorMessage,
  BenefitConstants,
  ManageBenefitService,
  ActiveBenefits,
  SanedBenefitService,
  BypassReassessmentService,
  BenefitResponse,
  BenefitPropertyService,
  BenefitType,
  BenefitStatus
} from '../../shared';
import {
  ContributorRouteConstants,
  ContributorService,
  ContributorTypesEnum,
  SystemParameter
} from '@gosi-ui/features/contributor';
import {
  AlertService,
  LanguageToken,
  RouterDataToken,
  RouterData,
  Role,
  CoreContributorService,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  StorageService,
  isNIN,
  AuthTokenService,
  CoreBenefitService,
  TransactionStatus,
  Contributor
} from '@gosi-ui/core';
import { BehaviorSubject, noop } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { filter, tap } from 'rxjs/operators';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';

@Component({
  selector: 'bnt-individual-benefits-sc',
  templateUrl: './individual-benefits-sc.component.html',
  styleUrls: ['./individual-benefits-sc.component.scss']
})
export class IndividualBenefitsScComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('benefitsTab', { static: false }) benefitsTab?: TabsetComponent;

  nin: number;

  reg = null;
  // searchResult = false;
  nationalIndcator: number;
  uibenefits: Benefits;
  annuitybenefits: Benefits[] = [];
  lang = 'en';
  annuityitemsPresent: boolean;
  occBenefits: Benefits;
  systemParameter: SystemParameter;
  //socialInsuranceNo: number;
  isValidator = false;
  isDoctor = false;
  rolesEnum = Role;
  registrationNo: number;
  personId: number;
  activeBenefitsList: ActiveBenefits[] = [];
  benefitResponse: BenefitResponse;
  isNin: boolean;
  isIndividualApp: boolean;
  showEstimateBtn = false;
  showTabs = {
    ui: true,
    annuities: true,
    oh: true
  };
  userDetails: Contributor;
  engagementId: number;
  constructor(
    readonly uiBenefitService: UiBenefitsService,
    readonly alertService: AlertService,
    readonly manageBenefitService: ManageBenefitService,
    readonly authTokenService: AuthTokenService,
    private storageService: StorageService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    public contributorService: CoreContributorService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly bypassReaassessmentService: BypassReassessmentService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly benefitPropertyService: BenefitPropertyService,
    readonly coreBenefitService: CoreBenefitService,
    public manageService: ManagePersonService,
    readonly contributorServiceParent: ContributorService
  ) {}

  ngOnInit(): void {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    this.language.subscribe(lang => {
      this.lang = lang;
    });

    this.nin = this.authTokenService.getIndividual();
    if (this.nin) {
      this.isNin = isNIN(this.nin?.toString());
      this.setIdentifier(this.nin);
    }
    if (this.nin && this.isIndividualApp) {
      this.initVariables();
    }
    if (this.coreBenefitService.getBenefitAppliedMessage()) {
      this.alertService.showSuccess(this.coreBenefitService.getBenefitAppliedMessage());
    }
    if (this.contributorService.selectedSIN) {
      this.getActiveEngagement();
    }
  }
  ngAfterViewInit() {
    if (this.benefitsTab) this.benefitsTab.tabs[1].active = true;
  }

  getUserStatus(individualId: number, hideTabs = false) {
    this.contributorServiceParent.getUserStatus(individualId).subscribe(
      res => {
        this.userDetails = res;
        if (
          this.userDetails.contributorType.toLowerCase() === ContributorTypesEnum.NON_SAUDI.toLowerCase() &&
          hideTabs
        ) {
          this.showTabs['ui'] = false;
          this.showTabs['annuities'] = false;
          this.benefitsTab.tabs[2].active = true;
        }
      },
      error => {
        this.alertService.showError(error.error.message);
      }
    );
  }

  initVariables() {
    this.annuityitemsPresent = false;
    this.benefitPropertyService.setAnnuityStatus(BenefitConstants.NEW_BENEFIT);
    this.nationalIndcator = this.nin;
    this.registrationNo = this.reg;
    this.benefitPropertyService.nin = this.nationalIndcator;
    this.manageBenefitService.nin = this.nationalIndcator;
    this.manageBenefitService.registrationNo = this.registrationNo;
    this.manageBenefitService.nin = this.contributorService.selectedSIN;
    this.getAnnuityBenefits(this.nationalIndcator);
    // this.getOccbenefits();
    this.getUIBenefits(this.nationalIndcator);
    this.getSystemParam();
    this.getBenefitsWithStatus();
  }

  setIdentifier(identifier) {
    this.contributorService.selectedSIN = +identifier;
    this.getAndSetPersonId(+identifier);
    // this.router.navigateByUrl(`home/benefits/individual/${+identifier}`);
  }

  getAndSetPersonId(identifier) {
    if (!this.isIndividualApp) {
      this.manageBenefitService.getPersonIdentifier(identifier).subscribe(personId => {
        this.storageService.setLocalValue('personId', personId);
      });
    } else {
      this.manageBenefitService.getProfileDetails(identifier).subscribe(res => {
        this.storageService.setLocalValue('personId', res?.personDetails?.personId);
      });
    }
  }
  getBenefitsWithStatus() {
    const status = ['Active', 'Draft', 'In Progress'];
    this.sanedBenefitService.getBenefitsOfIndividualWithStatus(this.nin, status).subscribe(response => {
      this.activeBenefitsList = response;
      if (this.activeBenefitsList.length === 0) {
        this.showEstimateBtn = true;
        // Inside the benefit tab, we shouldn’t show the annuities (unless the non Saudi have active annuity benefit (very rare case)) and
        // Unemployment Insurance tabs
        this.getUserStatus(this.nin, true);
      } else {
        this.activeBenefitsList.forEach(item => {
          let countNo = 0;
          if (
            item.status.english !== BenefitStatus.ACTIVE &&
            item.benefitType.english !== BenefitType.ui &&
            item.benefitType.english !== BenefitType.occBenefit &&
            item.benefitType.english !== BenefitType.occPension &&
            item.benefitType.english !== BenefitType.occLumpsum
          ) {
            countNo = countNo + 1;
          } else {
            countNo = 0;
          }
          if (countNo > 0) this.showEstimateBtn = true;
        });
      }
    });
  }
  onUiTabSelected() {
    this.sanedBenefitService.getContributorVisit(this.nin).subscribe();
  }
  onAppeal(assessmentValues) {
    this.bypassReaassessmentService
      .appealMedicalAssessment(this.nationalIndcator, assessmentValues.benefitRequestId, assessmentValues?.assessmentId)
      .subscribe(
        res => {
          this.benefitResponse = res;
        },
        err => this.alertService.showError(err.error.message)
      );
    if (!assessmentValues?.isAssessment) {
      window.open('https://gositest.gosi.ins/GOSIOnline/ContactUs_Request?userType=2001&requestType=2022&locale=en_US');
      // window.open('https://www.gosi.gov.sa/GOSIOnline/ContactUs_Request?userType=2001&requestType=2022&locale=en_US');
    }
  }
  routeToPension(assessmentValues) {
    this.bypassReaassessmentService
      .accceptMedicalAssessment(this.nin, assessmentValues.benefitRequestId, assessmentValues.assessmentId)
      .subscribe(
        res => {
          this.benefitResponse = res;
          this.router.navigate([BenefitConstants.ROUTE_ASSESSMENT_DISPLAY], {
            queryParams: {
              assessmentId: assessmentValues.assessmentId
            }
          });
        },
        err => this.alertService.showError(err.error.message)
      );
  }
  checkIfValidator(assignedRole): boolean {
    if (
      assignedRole === Role.VALIDATOR ||
      assignedRole === Role.VALIDATOR_1 ||
      assignedRole === Role.VALIDATOR_2 ||
      assignedRole === Role.FC_APPROVER_ANNUITY ||
      assignedRole === Role.CNT_FC_APPROVER
    ) {
      return true;
    }
  }
  getAnnuityBenefits(nationalIndcator: number) {
    this.manageBenefitService.getAnnuityBenefits(nationalIndcator).subscribe(
      data => {
        this.annuitybenefits = data;
        if (this.annuitybenefits && this.annuitybenefits.length > 0) {
          this.annuitybenefits.forEach(benefit => {
            if (benefit.eligibleForDependentAmount) {
              this.benefitPropertyService.setEligibleDependentAmount(benefit.eligibleForDependentAmount);
            }
          });
        }
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }
  getSystemParam() {
    this.manageBenefitService.getSystemParams().subscribe(
      res => {
        this.systemParameter = new SystemParameter().fromJsonToObject(res);
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }
  getUIBenefits(nationalIndcator: number) {
    this.uiBenefitService.getUIBenefits(nationalIndcator).subscribe(
      data => {
        this.uibenefits = data;
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }
  getOccbenefits() {
    this.manageBenefitService.getOccBenefits().subscribe(
      data => {
        this.occBenefits = data;
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }
  navigateToTransactionView(activeBenefits) {
    if (activeBenefits?.status?.english?.toUpperCase() === TransactionStatus.DRAFT.toUpperCase()) return;
    this.sanedBenefitService.getTransaction(activeBenefits.referenceNo).subscribe(res => {
      this.router.navigate([`/home/transactions/view/${res.transactionId}/${activeBenefits.referenceNo}`]);
    });
  }
  cancelVic() {
    this.contributorService.engagementId = this.engagementId;
    this.router.navigate([ContributorRouteConstants.ROUTE_VIC_CANCEL]);
  }
  getActiveEngagement() {
    this.contributorService.getEngagement(this.contributorService.selectedSIN).subscribe(res => {
      this.engagementId = res?.overallEngagements?.filter(eng => eng?.engagementType === 'vic')[0]?.engagementId;
    });
  }
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
    this.alertService.clearAlerts();
    this.benefitPropertyService.setBenefitAppliedMessage(null);
    this.coreBenefitService.setBenefitAppliedMessage(null);
  }
}
