import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  LovList,
  AuthTokenService,
  downloadBase64PDF,
  AlertService,
  BilingualText,
  StorageService,
  LanguageToken
} from '@gosi-ui/core';
import { ManagePersonConstants, ChangePersonService } from '../../../shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContributorService } from '@gosi-ui/features/contributor';
import { ActivatedRoute } from '@angular/router';
import { IndividualDashboardService } from '@gosi-ui/foundation-dashboard/src/lib/individual-app/services/individual-dashboard.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'cim-certificate-details-sc',
  templateUrl: './certificate-details-sc.component.html',
  styleUrls: ['./certificate-details-sc.component.scss']
})
export class CertificateDetailsScComponent implements OnInit, OnDestroy {
  personIdentifier: number;
  contCertIdentifier: number;
  wageCertIdentifier: number;
  isActive: boolean;
  lang='en';

  constructor(
    private fb: FormBuilder,
    readonly contributorService: ContributorService,
    readonly authTokenService: AuthTokenService,
    readonly changePersonService: ChangePersonService,
    readonly individualAppDashboardService: IndividualDashboardService,
    public alertService: AlertService,
    readonly storageService: StorageService,
    readonly activatedRoute: ActivatedRoute,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  bankList: LovList = new LovList([
    { value: ManagePersonConstants.ARABIC, sequence: 1 },
    { value: ManagePersonConstants.ENGLISH, sequence: 2 }
  ]);
  benefitReasonList: LovList = new LovList([{ value: ManagePersonConstants.SELECT_CONTRIBUTOR, sequence: 1 }]);
  certificateForm: FormGroup;
  annuityEnglish: boolean = false;
  showContributionbuttons: boolean = false;
  showWagesbuttons: boolean = false;
  showDetailedbuttons: boolean = false;
  showObligationButtons: boolean = false;
  showAnnuityValueButtons: boolean = false;
  identifier: number;
  nin: number;
  iqama: number;
  certificateNumberCont: any;
  certificateNumberWage: any;
  certificateNumberDetailed: any;
  certificateNumberObligation: any;
  certificateNumberAnnuityValue: any;
  //succcessGenerateMsg: BilingualText = { arabic: 'تم إصدار شهادتك بنجاح!', english: 'Your Certificate Has Been Generated Successfully!' };
  succcessContributionGenerateMsg: BilingualText = {
    arabic: 'تم إصدار شهادة الاشتراك بنجاح!',
    english: 'Contribution Certificate Has Been Generated Successfully!'
  };
  succcessWagesGenerateMsg: BilingualText = {
    arabic: 'تم إصدار شهادة الأجور بنجاح!',
    english: 'Wages Certificate Has Been Generated Successfully!'
  };
  succcessAnnuityDetailedGenerateMsg: BilingualText = {
    arabic: 'تم إصدار شهادة مفصلة بمقدار المعاش بنجاح!',
    english: 'Annuity Detailed Certificate Has Been Generated Successfully!'
  };
  succcessObligationGenerateMsg: BilingualText = {
    arabic: 'تم إصدار شهادة التزام تحويل مستحقات بنجاح!',
    english: 'Obligation of transferring benefits Certificate Has Been Generated Successfully!'
  };
  succcessAnnuityValueGenerateMsg: BilingualText = {
    arabic: 'تم إصدار شهادة مقدار المعاش بنجاح!',
    english: 'Annuity Value Certificate Has Been Generated Successfully!'
  };
  showMandatoryIdentifierError: BilingualText = {
    arabic:
      'لإصدار هذه الشهادة، لابد من وجود رقم هوية وطنية مسجل في النظام للسعوديين ولغير السعوديين لابد من وجود رقم إقامة أو رقم حدود',
    english:
      'To generate this certificate, the contributor needs to have an NIN for Saudis or Iqama/Border number for Non-Saudis on file'
  };

  // Vairables to store responses for Certs APIs
  contributionCertificate: any;
  wagesCertificate: any;
  annuityValueCertificate: any;
  annuityDetailedValueCertificate: any;
  obligationCertificate: any;
  isSaudiPerson: boolean;

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.certificateForm = this.createBankForm();
    this.activatedRoute.parent.parent.paramMap.subscribe(params => {
      if (params.get('personId')) {
        //console.log(this.changePersonService.getSIN());
        this.individualAppDashboardService
          .getIndividualDetails(this.changePersonService.getSIN().toString())
          .subscribe(res => {
            this.isActive = res.statusType == 'ACTIVE' ? true : false;
            this.contCertIdentifier = this.contributorService.NINDetails[0]?.newNin;
            this.wageCertIdentifier =
              this.contributorService.NINDetails[0]?.newNin ||
              this.contributorService.IqamaDetails[0]?.iqamaNo ||
              this.contributorService.BordeNoDetails[0]?.id;
          });
      }
    });
    this.alertService.clearAlerts();
  }

  createBankForm(): FormGroup {
    return this.fb.group({
      banklocation: this.fb.group({
        english: ['Arabic', { validators: Validators.required }],
        arabic: ['عربى']
      }),
      reason: this.fb.group({
        english: ['Select Contributor', { updateOn: 'blur' }],
        arabic: [null]
      })
    });
  }

  // Method to generate Contribution Certificate
  generateContributionCert() {
    if (this.isActive && this.contCertIdentifier) {
      this.alertService.clearAlerts();
      this.contributorService.getContributionCertificate(this.contCertIdentifier).subscribe(
        res => {
          if (res) {
            this.showContributionbuttons = true;
            this.contributionCertificate = res;
            this.certificateNumberCont = this.contributionCertificate.printSerialNumber;
            this.alertService.showSuccess(this.succcessContributionGenerateMsg);
          }
        },
        error => {
          this.showContributionbuttons = false;
          if (error.status == 400) {
            error.error.message.english =
              'Dear Customer, Your certificate can not be generated because there are no active engagements';
            error.error.message.arabic = 'عزيزي المشترك، لا يمكنك  شهادتك الاشتراك وذلك لعدم وجود مدد اشتراك نشطة.';
          }
          this.alertService.showError(error.error.message);
        },
        () => {}
      );
    } else {
      this.showIndentifierError();
    }
  }

  // Method to generate Wages Certificate
  generateWagesCert() {
    if (this.wageCertIdentifier) {
      this.alertService.clearAlerts();
      this.contributorService.getWagesCertificate(this.wageCertIdentifier).subscribe(
        res => {
          if (res) {
            this.showWagesbuttons = true;
            this.wagesCertificate = res;
            this.certificateNumberWage = this.wagesCertificate.printSerialNumber;
            this.alertService.showSuccess(this.succcessWagesGenerateMsg);
          }
        },
        error => {
          this.showContributionbuttons = false;
          if (error.status == 400) {
            error.error.message.english =
              'Dear Customer, Your certificate can not be generated because there are no active engagements';
            error.error.message.arabic = 'عزيزي المشترك، لا يمكنك  شهادتك الاشتراك وذلك لعدم وجود مدد اشتراك نشطة.';
          }
          this.alertService.showError(error.error.message);
        },
        () => {}
      );
    } else {
      this.showIndentifierError();
    }
  }

  // Method to generate Annuity Detailed Certificate
  generateAnnuityDetailedCert() {
    if (this.wageCertIdentifier) {
      this.contributorService.getAnnuityDetailedValueCertificate(this.wageCertIdentifier,this.lang).subscribe(
        res => {
          if (res) {
            this.showDetailedbuttons = true;
            this.annuityDetailedValueCertificate = res;
            this.certificateNumberDetailed = this.annuityDetailedValueCertificate.printSerialNumber;
            this.alertService.showSuccess(this.succcessAnnuityDetailedGenerateMsg);
          }
        },
        error => {
          this.showDetailedbuttons = false;
          if (error.status == 400) {
            error.error.message.english =
              'Dear Customer, Your certificate can not be generated because there are no active engagements';
            error.error.message.arabic = 'عزيزي المشترك، لا يمكنك  شهادتك الاشتراك وذلك لعدم وجود مدد اشتراك نشطة.';
          }
          this.alertService.showError(error.error.message);
        },
        () => {}
      );
    } else {
      this.showIndentifierError();
    }
  }

  // Method to generate Obligation of transferring benefits certificate
  generateObligationCert() {
    if (this.wageCertIdentifier) {
      this.contributorService.getObligationOfTransferringBenefitsCertificate(this.wageCertIdentifier).subscribe(
        res => {
          if (res) {
            this.showObligationButtons = true;
            this.obligationCertificate = res;
            this.certificateNumberObligation = this.obligationCertificate.printSerialNumber;
            this.alertService.showSuccess(this.succcessObligationGenerateMsg);
          }
        },
        error => {
          this.showObligationButtons = false;
          if (error.status == 400) {
            error.error.message.english =
              'Dear Customer, Your certificate can not be generated because there are no active engagements';
            error.error.message.arabic = 'عزيزي المشترك، لا يمكنك  شهادتك الاشتراك وذلك لعدم وجود مدد اشتراك نشطة.';
          }
          this.alertService.showError(error.error.message);
        },
        () => {}
      );
    } else {
      this.showIndentifierError();
    }
  }

  selectedLanguge(evnt) {
    if (evnt == 'English') {
      this.annuityEnglish = true;
    } else {
      this.annuityEnglish = false;
    }
  }

  // Method to generate Annuity Value Certificate in either English or Arabic
  generateAnnuityValueCert() {
    if (this.wageCertIdentifier) {
      this.annuityEnglish
        ? this.contributorService.getEnglishAnnuityValueCertificate(this.wageCertIdentifier).subscribe(
            res => {
              if (res) {
                this.showAnnuityValueButtons = true;
                this.annuityValueCertificate = res;
                this.certificateNumberAnnuityValue = this.annuityValueCertificate.printSerialNumber;
                this.alertService.showSuccess(this.succcessAnnuityValueGenerateMsg);
              }
            },
            error => {
              this.showAnnuityValueButtons = false;
              if (error.status == 400) {
                error.error.message.english =
                  'Dear Customer, Your certificate can not be generated because there are no active engagements';
                error.error.message.arabic = 'عزيزي المشترك، لا يمكنك  شهادتك الاشتراك وذلك لعدم وجود مدد اشتراك نشطة.';
              }
              this.alertService.showError(error.error.message);
            },
            () => {}
          )
        : this.contributorService.getArabicAnnuityValueCertificate(this.wageCertIdentifier).subscribe(
            res => {
              if (res) {
                this.showAnnuityValueButtons = true;
                this.annuityValueCertificate = res;
                this.certificateNumberAnnuityValue = this.annuityValueCertificate.printSerialNumber;
                this.alertService.showSuccess(this.succcessAnnuityValueGenerateMsg);
              }
            },
            error => {
              this.showAnnuityValueButtons = false;
              if (error.status == 400) {
                error.error.message.english =
                  'Dear Customer, Your certificate can not be generated because there are no active engagements';
                error.error.message.arabic = 'عزيزي المشترك، لا يمكنك  شهادتك الاشتراك وذلك لعدم وجود مدد اشتراك نشطة.';
              }
              this.alertService.showError(error.error.message);
            },
            () => {}
          );
    } else {
      this.showIndentifierError();
    }
  }

  downloadCertificate(object) {
    downloadBase64PDF(object.link, 'Certificate');
  }

  showIndentifierError() {
    this.alertService.showError(this.showMandatoryIdentifierError);
  }

  ngOnDestroy() {
    this.alertService.clearAlerts();
  }
}
