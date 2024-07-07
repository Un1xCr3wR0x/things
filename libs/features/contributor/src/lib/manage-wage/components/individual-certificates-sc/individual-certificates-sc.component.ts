import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { LanguageToken, AuthTokenService, AlertService } from '@gosi-ui/core';
import { Contributor, ContributorService } from '@gosi-ui/features/contributor/lib/shared';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'cnt-individual-certificates-sc',
  templateUrl: './individual-certificates-sc.component.html',
  styleUrls: ['./individual-certificates-sc.component.scss']
})
export class IndividualCertificatesScComponent implements OnInit {
  lang: string;
  userInfo: Contributor;
  identifier: number;

  // Flags to listen for service errors
  contributionError: boolean;
  wagesError: boolean;
  annuityValError: boolean;
  annuityDetailValError: boolean;
  obligationError: boolean;

  // Flags to Show/Hide Certificates
  showContributionCert: boolean = false;
  showWagesCert: boolean = false;
  showAnnuityValueCert: boolean = false;
  showAnnuityDetailedValueCert: boolean = false;
  showObligationCert: boolean = false;

  // Vairables to store responses for Certs APIs
  contributionCertificate: any;
  wagesCertificate: any;
  annuityValueCertificate: any;
  annuityDetailedValueCertificate: any;
  obligationCertificate: any;

  /**
   * @param language
   * @param alertService
   * @param contributorService
   */

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly contributorService: ContributorService,
    readonly authTokenService: AuthTokenService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.identifier = this.authTokenService.getIndividual();
    this.getUserInfo(this.identifier);
  }

  // Method to retrieve user info
  getUserInfo(identifier: number) {
    this.contributorService.getUserInfo(identifier).subscribe(
      res => {
        this.userInfo = res;
        this.showEligibleCerts(this.userInfo);
      },
      error => {
        this.showError(error);
      },
      () => {}
    );
  }

  // Method to generate Contribution Certificate
  generateContCert() {
    this.contributionError = false;

    this.contributorService.getContributionCertificate(this.identifier).subscribe(
      res => {
        this.contributionCertificate = res;
      },
      error => {
        this.contributionError = true;
        this.showError(error);
      },
      () => {}
    );
  }

  // Method to generate Wages Certificate
  generateWagesCert() {
    this.wagesError = false;

    this.contributorService.getWagesCertificate(this.identifier).subscribe(
      res => {
        this.wagesCertificate = res;
      },
      error => {
        this.wagesError = true;
        this.showError(error);
      },
      () => {}
    );
  }

  // Method to generate Annuity Value Certificate in either English or Arabic
  generateAnnuityValueCert(isEnglish: boolean) {
    this.annuityValError = false;

    isEnglish
      ? this.contributorService.getEnglishAnnuityValueCertificate(this.identifier, this.lang).subscribe(
          res => {
            this.annuityValueCertificate = res;
          },
          error => {
            this.annuityValError = true;
            this.showError(error);
          },
          () => {}
        )
      : this.contributorService.getArabicAnnuityValueCertificate(this.identifier).subscribe(
          res => {
            this.annuityValueCertificate = res;
          },
          error => {
            this.annuityValError = true;
            this.showError(error);
          },
          () => {}
        );
  }

  // Method to generate annuity detailed value certificate
  generateAnnuityDetailedValueCert(lang?: string) {
    this.annuityDetailValError = false;
    this.contributorService.getAnnuityDetailedValueCertificate(this.identifier, lang).subscribe(
      res => {
        this.annuityDetailedValueCertificate = res;
      },
      error => {
        this.annuityDetailValError = true;
        this.showError(error);
      },
      () => {}
    );
  }

  // Method to generate Obligation of transferring benefits certificate
  generateObligationCert() {
    this.obligationError = false;
    this.contributorService
      .getObligationOfTransferringBenefitsCertificateBySin(this.identifier)
      .subscribe(
        res => {
          this.obligationCertificate = res;
        },
        error => {
          this.obligationError = true;
          this.showError(error);
        },
        () => {}
      );
  }

  // Method to show/hide Certs based on the user type
  showEligibleCerts(userInfo: Contributor) {
    this.showContributionCert =
      userInfo.hasLiveEngagement && !userInfo.vicIndicator && userInfo.contributorType === 'SAUDI';
    this.showWagesCert = userInfo.hasActiveTerminatedOrCancelled;
    this.showAnnuityValueCert = userInfo.isAnnuityBeneficiary;
    this.showAnnuityDetailedValueCert = userInfo.isAnnuityBeneficiary;
    this.showObligationCert =
      userInfo.isAnnuityBeneficiary && userInfo.bankAccountDetails?.length > 0
        ? userInfo.bankAccountDetails?.some(account => account.holdStatus === true)
        : false;
  }

  showError(error: HttpErrorResponse) {
    error.error.message
      ? this.alertService.showError(error.error.message)
      : this.alertService.showErrorByKey('CORE.INTERNAL-ERROR');
  }
}
