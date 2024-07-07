import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  AlertService,
  LanguageToken,
  markFormGroupTouched,
  markFormGroupUntouched,
  silentDownloadBase64PDF
} from '@gosi-ui/core';
import { CertificateService } from '../../../../shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'cim-individual-certificate-sc',
  templateUrl: './individual-certificate-sc.component.html',
  styleUrls: ['./individual-certificate-sc.component.scss']
})
export class IndividualCertificateScComponent implements OnInit, OnDestroy {
  personIdentifier: number;
  modalRef: BsModalRef;
  lang = 'en';
  pdfContent;
  unifiedBenefitsCertOptions: FormGroup;
  annCertSections = {
    beneficiary: 'BENEFICIARY_DETAILS_SECTION',
    heir: 'HEIR_DETAILS_SECTION',
    bank: 'BANK_DETAILS_SECTION',
    heirAdjustment: 'HEIR_ADJUSTMENTS_DETAILS_SECTION',
    contAdjustment: 'CONTRIBUTOR_ADJUSTMENTS_DETAILS_SECTION'
  };

  @ViewChild('viewCertificateModal', { static: false })
  viewCertificateModal: TemplateRef<HTMLElement>;
  @ViewChild('successModal', { static: false })
  successModal: TemplateRef<HTMLElement>;

  constructor(
    private fb: FormBuilder,
    public alertService: AlertService,
    readonly modalService: BsModalService,
    readonly activatedRoute: ActivatedRoute,
    readonly certificateService: CertificateService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.activatedRoute.parent.parent.paramMap.subscribe(params => {
      if (params.get('personId')) {
        this.personIdentifier = +params.get('personId');
        console.log(this.personIdentifier);
      }
    });

    this.unifiedBenefitsCertOptions = this.fb.group({
      heir: this.fb.control(false, [Validators.requiredTrue]),
      beneficiary: this.fb.control(false, [Validators.requiredTrue]),
      adjustment: this.fb.control(false, []),
      bank: this.fb.control(false, [])
    });

    this.alertService.clearAlerts();
  }

  generateBenefitDetailsCertificate({ isArabic, hideGenerateModal }) {
    markFormGroupTouched(this.unifiedBenefitsCertOptions);
    if (!this.unifiedBenefitsCertOptions.valid) {
      return;
    }
    markFormGroupUntouched(this.unifiedBenefitsCertOptions);
    hideGenerateModal();
    this.alertService.clearAlerts();
    return this.certificateService.getBenefitDetailsCertificate(
      this.personIdentifier,
      isArabic,
      this.annuityCertSections()
    );
  }

  downloadBenefitDetailsCertificate(event) {
    this.generateBenefitDetailsCertificate(event).subscribe(
      (res: any) => {
        silentDownloadBase64PDF(res.content, 'Certificate' + Math.floor(Math.random() * 100000) + '.pdf');
        this.showModal(this.successModal);
      },
      error => {
        this.showError(error);
      }
    );
  }

  viewBenefitDetailsCertificate(event) {
    this.generateBenefitDetailsCertificate(event).subscribe(
      (res: any) => {
        this.pdfContent = `data:application/pdf;base64,${res.content}`;
        this.showModal(this.viewCertificateModal, true);
      },
      error => {
        this.showError(error);
      }
    );
  }

  annuityCertSections() {
    let sections = [];
    const options = this.unifiedBenefitsCertOptions.value;

    if (options.beneficiary) {
      sections.push(this.annCertSections.beneficiary);
      if (options.adjustment) {
        sections.push(this.annCertSections.contAdjustment);
      }
    }
    if (options.heir) {
      sections.push(this.annCertSections.heir);
      if (options.adjustment) {
        sections.push(this.annCertSections.heirAdjustment);
      }
    }
    if (options.bank) {
      sections.push(this.annCertSections.bank);
    }

    return sections;
  }

  showError(error: HttpErrorResponse) {
    error.error.message
      ? this.alertService.showError(error.error.message)
      : this.alertService.showErrorByKey('CORE.INTERNAL-ERROR');
  }

  showModal(modal, large = false) {
    this.modalRef = this.modalService.show(modal, Object.assign({}, { class: large ? 'modal-lg' : 'modal-md' }));
  }

  hideModal() {
    this.modalRef.hide();
  }

  ngOnDestroy() {
    this.alertService.clearAlerts();
  }
}
