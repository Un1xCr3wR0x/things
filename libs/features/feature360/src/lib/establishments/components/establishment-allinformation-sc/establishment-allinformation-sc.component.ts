import { tap, switchMap } from 'rxjs/operators';
import { AfterViewInit, Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BilingualText, LanguageToken, Lov, LovList, AuthTokenService, JWTPayload, MenuService } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { Contributors } from '../../../models/establishments/contributors';
import { EstablishmentProfile } from '../../../models/establishments/establishment-profile';
import { LastWageYear } from '../../../models/establishments/last-wage-year';
import { ContributorsService } from '../../../services/establishments/contributors.service';
import { LastWageYearService } from '../../../services/establishments/last-wage-year.service';
import { EstablishmentDetailsDcComponent } from '../establishment-details-dc/establishment-details-dc.component';
import { EstablishmentProfileService } from '../../../services/establishments/establishment-profile.service';
import { EstablishmentMOLProfileService } from '../../../services/establishments/establishment-molprofile.service';
import { EstablishmentOwnerDetailService } from '../../../services/establishments/establishment-owner-detail.service';
import { EstablishmentMOLProfile } from '../../../models/establishments/establishment-molprofile';
import { EstablishmentSupervisorDetailService } from '../../../services/establishments/establishment-supervisor-detail.service';
import { EstablishmentBranchesService } from '../../../services/establishments/establishment-branches.service';
import { EstablishmentBranches } from '../../../models/establishments/establishment-branches';
import { AdminRoleIdEnum } from '../../../shared/enums/admin-role-id-enum';
import { AdminRoleIdArabicEnum } from '../../../shared/enums/admin-role-id-arabic-enum';

import { EstablishmentsContributionDetailsComponent } from '../establishments-contribution-details-dc/establishments-contribution-details-dc.component';
import { EstablishmentsFinancialDetailsComponent } from '../establishments-financial-details-dc/establishments-financial-details-dc.component';
import { GetCntLastPaidInfService } from '../../../services/establishments/get-cnt-last-paid-inf.service';
import { GetCntLastPaidInf } from '../../../models/establishments/get-cnt-last-paid-inf';
import { GetCntTotalInstallmentAmountAndNumberOfInstallmentMonthsService } from '../../../services/establishments/get-cnt-total-installment-amount-and-number-of-installment-months.service';
import { GetCntTotalInstallmentAmountAndNumberOfInstallmentMonths } from '../../../models/establishments/get-cnt-total-installment-amount-and-number-of-installment-months';
import { CountedEmployeesNitaqatService } from '../../../services/establishments/counted-employees-nitaqat.service';
import { UnCountedEmployeesNitaqatService } from '../../../services/establishments/un-counted-employees-nitaqat.service';
import { CountedEmployeesNitaqat } from '../../../models/establishments/counted-employees-nitaqat';
import { UnCountedEmployeesNitaqat } from '../../../models/establishments/un-counted-employees-nitaqat';
import { PendingTransactionsSimisService } from '../../../services/establishments/pending-transactions-simis.service';
import { PendingTransactionsSimis } from '../../../models/establishments/pending-transactions-simis';
import { RasedAdvancedSearchDetailsService } from '../../../services/establishments/rased-advanced-search-details.service';
import { RasedAdvancedSearchDetails } from '../../../models/establishments/rased-advanced-search-details';
import { GetCntUnPaidViolationService } from '../../../services/establishments/get-cnt-un-paid-violation.service';
import { GetCntUnPaidViolation } from '../../../models/establishments/get-cnt-un-paid-violation';
import { GetCntClosingCreditService } from '../../../services/establishments/get-cnt-closing-credit.service';
import { GetCntClosingDebitService } from '../../../services/establishments/get-cnt-closing-debit.service';
import { GetCntPaymentPeriodService } from '../../../services/establishments/get-cnt-payment-period.service';
import { GetCntDebitAdjustmentAndPaidViolationService } from '../../../services/establishments/get-cnt-debit-adjustment-and-paid-violation.service';
import { GetCntClosingCredit } from '../../../models/establishments/get-cnt-closing-credit';
import { GetCntLastMonthService } from '../../../services/establishments/get-cnt-last-month.service';
import { GetCntLastMonth } from '../../../models/establishments/get-cnt-last-month';
import { GetCntClosingDebit } from '../../../models/establishments/get-cnt-closing-debit';
import { GetCntPaymentPeriod } from '../../../models/establishments/get-cnt-payment-period';
import { GetCntLastMonthContributionService } from '../../../services/establishments/get-cnt-last-month-contribution.service';
import { GetCntLastMonthContribution } from '../../../models/establishments/get-cnt-last-month-contribution';
import { GetCntLastMonthPenaltyService } from '../../../services/establishments/get-cnt-last-month-penalty.service';
import { GetCntLastMonthPenalty } from '../../../models/establishments/get-cnt-last-month-penalty';
import { ChooseDetailsTypeComponent } from '../../../shared';
import { FinancialDetailService } from '../../../services/establishments/financial-detail.service';
import { CreditBalanceDetails } from '@gosi-ui/features/collection/billing/lib/shared/models';
import { EstablishmentService } from '../../../services/establishments/establishment-service.service';
import { AdminWrapper } from '../../../models/establishments/admin-wrapper';
import { EstablishmentOwnersWrapper } from '../../../models/establishments/establishment-owners-wrapper';
import { ContributorsWageService } from '../../../services/establishments/contributors-wage.service';
import { ContributorWageParams } from '../../../models/establishments/contributor-wage-params';

@Component({
  selector: 'fea-establishment-allinformation-sc',
  templateUrl: './establishment-allinformation-sc.component.html',
  styleUrls: ['./establishment-allinformation-sc.component.scss']
})
export class EstablishmentAllinformationScComponent implements OnInit, AfterViewInit, OnDestroy {
  branchesForm: FormGroup = null;
  lang = 'en';
  registrationNumber;
  mainRegistrationNumber = 20169141;
  details = 'establishment';
  mainEstablishmentProfile: EstablishmentProfile;
  establishmentProfile: EstablishmentProfile;
  establishmentOwnerDetail: EstablishmentOwnersWrapper;
  establishmentMOLProfile: EstablishmentMOLProfile;
  establishmentSupervisorDetail: AdminWrapper;
  establishmentBranches: EstablishmentBranches[];
  cntLastPaidInf: GetCntLastPaidInf;
  cntTotalInstallmentAmountAndNumberOfInstallmentMonths: GetCntTotalInstallmentAmountAndNumberOfInstallmentMonths;
  countedEmployeesNitaqat: CountedEmployeesNitaqat;
  unCountedEmployeesNitaqat: UnCountedEmployeesNitaqat;
  pendingTransactionsSimis: PendingTransactionsSimis[] = [];
  rasedAdvancedSearchDetails: RasedAdvancedSearchDetails[] = [];
  cntClosingCredit: GetCntClosingCredit;
  cntLastMonth: GetCntLastMonth;
  cntClosingDebit: GetCntClosingDebit;
  cntPaymentPeriod: GetCntPaymentPeriod;
  cntLastMonthContribution: GetCntLastMonthContribution;
  cntLastMonthPenalty: GetCntLastMonthPenalty;
  token: JWTPayload;
  creditBalanceDetails: CreditBalanceDetails;

  isShowSmsBtn = false;

  currentDetailsTap = 'ESTABLISHMENT-DETAILS';

  branches = [];
  branchesList: LovList = new LovList([]);

  detailsTypeList = [
    {
      name: {
        english: 'ESTABLISHMENT-DETAILS',
        arabic: 'تفاصيل المنشأة'
      }
    },
    {
      name: {
        english: 'FINANCIAL-DETAILS',
        arabic: 'المستحقات المالية'
      }
    },
    {
      name: {
        english: 'CONTRUBUTION',
        arabic: 'الاشتراكات'
      }
    }
  ];

  contributorDetails: Contributors[] = [];
  lastWageYearDetails: LastWageYear;
  cntUnPaidViolation: GetCntUnPaidViolation;

  profileData: EstablishmentProfile;

  @ViewChild('chooseDetailsTypeComp', { static: false })
  chooseDetailsTypeComp: ChooseDetailsTypeComponent;

  @ViewChild('establishmentDetailsComp', { static: false })
  establishmentDetailsComp: EstablishmentDetailsDcComponent;

  @ViewChild('establishmentFinancialComp', { static: false })
  establishmentFinancialComp: EstablishmentsFinancialDetailsComponent;

  @ViewChild('establishmentContributionComp', { static: false })
  establishmentContributionComp: EstablishmentsContributionDetailsComponent;

  constructor(
    private fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private activatedRoute: ActivatedRoute,
    readonly menuService: MenuService,
    readonly authService: AuthTokenService,
    readonly establishmentService: EstablishmentService,
    readonly establishmentProfileService: EstablishmentProfileService,
    readonly establishmentMOLProfileService: EstablishmentMOLProfileService,
    readonly establishmentOwnerDetailService: EstablishmentOwnerDetailService,
    readonly establishmentSupervisorDetailService: EstablishmentSupervisorDetailService,
    readonly establishmentBranchesService: EstablishmentBranchesService,
    readonly contributorsService: ContributorsService,
    readonly lastWageYearService: LastWageYearService,
    readonly getCntLastPaidInfService: GetCntLastPaidInfService,
    readonly cntTotalInstallmentAmountAndNumberOfInstallmentMonthsService: GetCntTotalInstallmentAmountAndNumberOfInstallmentMonthsService,
    readonly countedEmployeesNitaqatService: CountedEmployeesNitaqatService,
    readonly unCountedEmployeesNitaqatService: UnCountedEmployeesNitaqatService,
    readonly pendingTransactionsSimisService: PendingTransactionsSimisService,
    readonly rasedAdvancedSearchDetailsService: RasedAdvancedSearchDetailsService,
    readonly getCntUnPaidViolationService: GetCntUnPaidViolationService,
    readonly getCntClosingCreditService: GetCntClosingCreditService,
    readonly getCntClosingDebitService: GetCntClosingDebitService,
    readonly getCntPaymentPeriodService: GetCntPaymentPeriodService,
    readonly getCntDebitAdjustmentAndPaidViolationService: GetCntDebitAdjustmentAndPaidViolationService,
    readonly getCntLastMonthService: GetCntLastMonthService,
    readonly getCntLastMonthContributionService: GetCntLastMonthContributionService,
    readonly getCntLastMonthPenaltyService: GetCntLastMonthPenaltyService,
    readonly financialDetailService: FinancialDetailService,
    readonly contributorsWageService: ContributorsWageService
  ) {}

  ngOnInit(): void {
    this.registrationNumber = this.activatedRoute.snapshot.params.regNum;
    this.mainRegistrationNumber = this.activatedRoute.snapshot.params.regNum;
    this.branchesForm = this.createBranchesForm();
    this.language.subscribe(language => (this.lang = language));
    this.getAllEstablishmentData(true);
    this.token = this.authService.decodeToken(this.authService.getAuthToken());
    this.menuService.showSMSMessage.next(false);
    this.showSmsButton();
  }

  showSmsButton() {
    if (this.token.gosiscp.match('184') || this.token.gosiscp.match('185') || this.token.gosiscp.match('187')) {
      this.isShowSmsBtn = true;
    } else this.isShowSmsBtn = false;
  }

  ngAfterViewInit() {
    this.chooseDetailsTypeComp.detailsTypeForm.valueChanges.subscribe(() => {
      this.currentDetailsTap = this.chooseDetailsTypeComp.detailsTypeForm
        .get('organizationCategory')
        .get('english').value;
    });
  }

  getAllEstablishmentData(isMain: boolean) {
    this.getEstablishmentProfile(isMain);
    this.getPendingTransactionsSimis();
    this.getRasedAdvancedSearchDetails();
    this.getCountedEmployeesNitaqat();
    this.getUnCountedEmployeesNitaqat();
    this.getOwnerDetails();
    this.getAdminsOfEstablishment();
    this.getContributorList();
  }

  getContributorList() {
    this.contributorsWageService
      .getContributorList(this.registrationNumber, new ContributorWageParams(false, false, 'ACTIVE', 0, 10), false)
      .subscribe(response => {
        if (response) {
        }
      });
  }

  getOwnerDetails() {
    this.establishmentService.getOwnerDetails(this.registrationNumber).subscribe(response => {
      if (response) {
        this.establishmentOwnerDetail = response;
      }
    });
  }

  getAdminsOfEstablishment() {
    this.establishmentService.getAdminsOfEstablishment(this.registrationNumber).subscribe(response => {
      response.admins.forEach(admin => {
        admin.roles.map((role, index) => {
          return (admin.roles[index] = {
            english: AdminRoleIdEnum[role as unknown as number],
            arabic: AdminRoleIdArabicEnum[role as unknown as number]
          });
        });
      });
      if (response) {
        this.establishmentSupervisorDetail = response;
      }
    });
  }

  getEstablishmentProfile(isMain: boolean) {
    this.establishmentProfileService
      .getEstablishmentProfile(this.registrationNumber)
      .subscribe(establishmentProfile => {
        if (establishmentProfile) {
          this.establishmentProfile = establishmentProfile;
          this.getEstablishmentMOLProfile();
          this.getContributorDetails();
          this.getLastWageYearDetails();
          this.getFinancialDetails();

          if (isMain) {
            this.mainRegistrationNumber = this.establishmentProfile.registrationnumber;
            this.mainEstablishmentProfile = this.establishmentProfile;
            this.getEstablishmentBranches();
          }
        }
      });
  }

  getEstablishmentMOLProfile() {
    if (this.establishmentProfile) {
      this.establishmentMOLProfileService
        .getEstablishmentMOLProfile(this.establishmentProfile.molestid, this.establishmentProfile.molestofficeid)
        .subscribe(establishmentMOLProfile => {
          this.establishmentMOLProfile = establishmentMOLProfile;
        });
    }
  }

  getFinancialDetails() {
    this.getCntLastPaidInf();
    this.getCntTotalInstallmentAmountAndNumberOfInstallmentMonths();
    this.getCntUnPaidViolation();
    this.getClosingCredit();
    this.getClosingDebit();
    this.getPaymentPeriod();
    this.getLastMonthContribution();
    this.getLastMonthPenalty();
  }

  getCntLastPaidInf() {
    this.getCntLastPaidInfService
      .getCntLastPaidInf(this.establishmentProfile.establishmentid)
      .subscribe(cntLastPaidInf => {
        this.cntLastPaidInf = cntLastPaidInf;
      });
  }

  getCntTotalInstallmentAmountAndNumberOfInstallmentMonths() {
    this.cntTotalInstallmentAmountAndNumberOfInstallmentMonthsService
      .getCntTotalInstallmentAmountAndNumberOfInstallmentMonths(this.establishmentProfile.establishmentid)
      .subscribe(cntTotalInstallmentAmountAndNumberOfInstallmentMonths => {
        if (cntTotalInstallmentAmountAndNumberOfInstallmentMonths) {
          this.cntTotalInstallmentAmountAndNumberOfInstallmentMonths =
            cntTotalInstallmentAmountAndNumberOfInstallmentMonths;
        }
      });

    this.financialDetailService.getInstallmentactive(this.establishmentProfile.registrationnumber).subscribe(
      data => {},
      error => {}
    );
  }

  getPendingTransactionsSimis() {
    this.pendingTransactionsSimisService
      .getPendingTransactionsSimis(this.registrationNumber)
      .subscribe(pendingTransactionsSimis => {
        this.pendingTransactionsSimis = pendingTransactionsSimis;
        if (pendingTransactionsSimis) {
          pendingTransactionsSimis.forEach(element => {
            const rasedAdvancedSearch: RasedAdvancedSearchDetails = new RasedAdvancedSearchDetails();
            rasedAdvancedSearch.inspectionrequestno = element.transaction_number;
            rasedAdvancedSearch.createdon = element.transaction_entry_date;
            rasedAdvancedSearch.inspectiontype = element.LONGNAME_EN;
            rasedAdvancedSearch.region = element.transaction_description;
            rasedAdvancedSearch.status = element.STATUS_EN;
            rasedAdvancedSearch.originatedsystem = element.SYSTEM_EN;
            rasedAdvancedSearch.pendingwith = element.assigned_user;
            this.rasedAdvancedSearchDetails.push(rasedAdvancedSearch);
          });
        }
      });
  }

  getRasedAdvancedSearchDetails() {
    this.rasedAdvancedSearchDetailsService
      .getRasedAdvancedSearchDetails(this.registrationNumber)
      .subscribe(rasedAdvancedSearchDetails => {
        this.rasedAdvancedSearchDetails = this.rasedAdvancedSearchDetails.concat(rasedAdvancedSearchDetails);
      });
  }

  getEstablishmentBranches() {
    this.establishmentBranchesService
      .getEstablishmentBranches(this.establishmentProfile.establishmentid)
      .subscribe(establishmentBranches => {
        for (let i = 0; i < establishmentBranches.length; i++) {
          this.branches.push({
            value: {
              english: establishmentBranches[i].estnameenglish
                ? establishmentBranches[i].estnameenglish
                : establishmentBranches[i].estnamearabic,
              arabic: establishmentBranches[i].estnamearabic
            },
            sequence: i
          });
        }
        this.branchesList = new LovList(this.branches);
        this.establishmentBranches = establishmentBranches;
      });
  }
  createBranchesForm() {
    return this.fb.group({
      branchName: this.fb.group({
        english: [],
        arabic: []
      })
    });
  }

  getSelectBranch(branch: Lov) {
    if (branch) {
      if (this.establishmentBranches[branch.sequence]) {
        this.registrationNumber = this.establishmentBranches[branch.sequence].registrationnumber;
        this.getAllEstablishmentData(false);
      }
    } else {
      this.registrationNumber = this.mainRegistrationNumber;
      this.getAllEstablishmentData(false);
    }
  }

  getContributorDetails() {
    this.contributorsService.getContributors(this.establishmentProfile.establishmentid).subscribe(value => {
      this.contributorDetails = [];
      value.forEach(contributorDetails => {
        this.contributorDetails.push(contributorDetails);
      });
    });
  }

  getLastWageYearDetails() {
    this.lastWageYearService
      .getLastWageYear(this.establishmentProfile.establishmentid)
      .subscribe(value => (this.lastWageYearDetails = value));
  }

  getCountedEmployeesNitaqat() {
    this.countedEmployeesNitaqatService
      .getCountedEmployeesNitaqat(this.registrationNumber)
      .subscribe(countedEmployeesNitaqat => {
        this.countedEmployeesNitaqat = countedEmployeesNitaqat;
      });
  }

  getUnCountedEmployeesNitaqat() {
    this.unCountedEmployeesNitaqatService
      .getUnCountedEmployeesNitaqat(this.registrationNumber, this.registrationNumber)
      .subscribe(unCountedEmployeesNitaqat => {
        this.unCountedEmployeesNitaqat = unCountedEmployeesNitaqat;
      });
  }

  getCntUnPaidViolation() {
    this.getCntUnPaidViolationService
      .getCntUnPaidViolation(this.establishmentProfile.establishmentid, this.establishmentProfile.establishmentid)
      .subscribe(cntUnPaidViolation => {
        this.cntUnPaidViolation = cntUnPaidViolation;
      });
  }

  getClosingCredit() {
    this.getCntLastMonthService
      .getCntLastMonth(this.establishmentProfile.establishmentid)
      .pipe(
        switchMap(cntLastMonth => {
          if (cntLastMonth) {
            return this.getCntClosingCreditService.getClosingCredit(
              cntLastMonth?.lastmonth,
              this.establishmentProfile.establishmentid
            );
          } else {
            this.cntClosingCredit = null;
            return [];
          }
        })
      )
      .subscribe(cntClosingCredit => {
        this.cntClosingCredit = cntClosingCredit;
      });
    this.financialDetailService.getAvailableCreditBalance(this.establishmentProfile.registrationnumber).subscribe(
      data => {
        this.creditBalanceDetails = data;
      },
      error => {}
    );
  }

  getClosingDebit() {
    this.getCntLastMonthService
      .getCntLastMonth(this.establishmentProfile.establishmentid)
      .pipe(
        switchMap(cntLastMonth => {
          if (cntLastMonth) {
            return this.getCntClosingDebitService.getClosingDebit(
              cntLastMonth.lastmonth,
              this.establishmentProfile.establishmentid
            );
          } else {
            this.cntClosingDebit = null;
            return [];
          }
        })
      )
      .subscribe(cntClosingDebit => {
        this.cntClosingDebit = cntClosingDebit;
      });
  }

  getPaymentPeriod() {
    this.getCntPaymentPeriodService.getPaymentPeriod().subscribe(cntPaymentPeriod => {
      this.cntPaymentPeriod = cntPaymentPeriod;
    });
  }

  getLastMonthContribution() {
    this.getCntLastMonthService
      .getCntLastMonth(this.establishmentProfile.establishmentid)
      .pipe(
        switchMap(cntLastMonth => {
          if (cntLastMonth) {
            return this.getCntLastMonthContributionService.getLastMonthContribution(
              cntLastMonth.lastmonth,
              this.establishmentProfile.establishmentid
            );
          } else {
            this.cntLastMonthContribution = null;
            return [];
          }
        })
      )
      .subscribe(cntLastMonthContribution => {
        this.cntLastMonthContribution = cntLastMonthContribution;
      });
  }

  getLastMonthPenalty() {
    this.getCntLastMonthService
      .getCntLastMonth(this.establishmentProfile.establishmentid)
      .pipe(
        switchMap(cntLastMonth => {
          if (cntLastMonth) {
            return this.getCntLastMonthPenaltyService.getLastMonthPenalty(
              cntLastMonth.lastmonth,
              this.establishmentProfile.establishmentid
            );
          } else {
            this.cntLastMonthPenalty = null;
            return [];
          }
        })
      )
      .subscribe(cntLastMonthPenalty => {
        this.cntLastMonthPenalty = cntLastMonthPenalty;
      });
  }

  ngOnDestroy() {
    this.menuService.showSMSMessage.next(true);
  }
}
