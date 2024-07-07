import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentItem,
  DocumentService,
  Establishment,
  UuidGeneratorService,
  WorkflowService,
  addMonths,
  endOfMonth,
  markFormGroupTouched,
  monthDiff,
  scrollToTop,
  startOfMonth
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, forkJoin, iif, noop, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { incorrectRoute } from '../../../manage-admin/components';
import {
  CertificateDetailsResponse,
  CertificateIdentifierEnum,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentService,
  GenerateCertificateScBaseComponent,
  isDocumentsValid
} from '../../../shared';
import { RequestCertificateService } from '../../../shared/services/request-certificate.service';

@Component({
  selector: 'est-zakat-certificate-sc',
  templateUrl: './zakat-certificate-sc.component.html',
  styleUrls: ['./zakat-certificate-sc.component.scss']
})
export class ZakatCertificateScComponent extends GenerateCertificateScBaseComponent implements OnInit {
  documents: DocumentItem[] = [];
  transactionId = DocumentTransactionIdEnum.ZAKAT_CERTIFICATE;
  currentDate = new Date();
  heading = 'ESTABLISHMENT.GEN-ZAKAT';

  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;

  isMain = false;
  form: FormGroup;
  isPrivateChannel = false;
  minFromDate: Date;
  minToDate: Date;
  maxToDate: Date;
  isGroup = false;
  isOhCert = false;

  constructor(
    readonly bsModalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly location: Location,
    readonly documentService: DocumentService,
    readonly route: ActivatedRoute,
    @Inject(ApplicationTypeToken) readonly appToken: ApplicationTypeEnum,
    readonly uuidService: UuidGeneratorService,
    readonly fb: FormBuilder,
    readonly router: Router,
    readonly alertService: AlertService,
    readonly requestService: RequestCertificateService,
    readonly establishmentService: EstablishmentService
  ) {
    super(bsModalService, workflowService, location, documentService, alertService, requestService);
  }

  ngOnInit(): void {
    this.documentType = DocumentTransactionTypeEnum.ZAKAT_CERTIFICATE;
    this.initialise(this.route.paramMap).subscribe(noop, err => this.alertService.showError(err?.errpr?.message));
  }

  initialise(paramMap: Observable<ParamMap>): Observable<[Establishment, DocumentItem[]]> {
    return paramMap.pipe(
      tap(param => {
        if (param.get('registrationNo')) {
          this.registrationNo = Number(param.get('registrationNo'));
          this.uuid = this.uuidService.getUuid();
          if (this.router.url.includes('main')) {
            this.isMain = true;
            this.heading = 'ESTABLISHMENT.GEN-ZAKAT-MAIN';
          }
          if (this.router.url.includes('group')) {
            this.isGroup = true;
            this.heading = 'ESTABLISHMENT.GEN-ZAKAT-GROUP';
          }
          if (this.router.url.includes('oh-certificate')) {
            this.isOhCert = true;
            this.heading = 'ESTABLISHMENT.GENERATE-OH-CERTIFICATE';
            this.transactionId = DocumentTransactionIdEnum.OH_CERTIFICATE;
            this.documentType = DocumentTransactionTypeEnum.OH_CERTIFICATE;
          }
        } else {
          this.location.back();
          throwError(incorrectRoute);
        }
      }),
      switchMap(() => this.getEstablishmentAndDocuments()),
      tap(estAndDocuments => {
        this.minToDate = this.minFromDate = startOfMonth(estAndDocuments[0].startDate?.gregorian);
        this.maxToDate = estAndDocuments[0]?.closeDate?.gregorian
          ? endOfMonth(estAndDocuments[0]?.closeDate?.gregorian)
          : endOfMonth(this.currentDate);
        this.form = this.createForm();
        if (this.appToken === ApplicationTypeEnum.PRIVATE) {
          this.isPrivateChannel = true;
        }
      })
    );
  }

  getEstablishmentAndDocuments(): Observable<[Establishment, DocumentItem[]]> {
    return forkJoin([
      this.establishmentService.getEstablishment(this.registrationNo),
      iif(
        () => this.appToken === ApplicationTypeEnum.PRIVATE,
        this.documentService.getRequiredDocuments(this.documentType, this.documentType),
        of([] as DocumentItem[])
      ).pipe(
        catchError(err => {
          this.alertService.showError(err?.error?.message);
          return of([] as DocumentItem[]);
        }),
        tap(res => {
          this.documents = this.documentService.removeDuplicateDocs(res);
        })
      )
    ]);
  }

  createForm() {
    const form = this.fb.group({
      fromDate: this.fb.group({
        gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
        hijiri: undefined
      }),
      toDate: this.fb.group({
        gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
        hijiri: undefined
      })
    });
    return form;
  }

  setToDate() {
    if (this.isOhCert) {
      if (this.form.get('toDate').get('gregorian').value) {
        this.form.get('toDate').get('gregorian').setValue(null);
      }
      const fromDate = startOfMonth(new Date(this.form.get('fromDate').get('gregorian').value));
      this.minToDate = addMonths(fromDate, 2);
    }
  }
  generateDocument() {
    markFormGroupTouched(this.form);
    if (!this.form.valid) {
      this.alertService.showMandatoryErrorMessage();
      return;
    }
    if (this.isPrivateChannel && !isDocumentsValid(this.documents)) {
      this.alertService.showMandatoryDocumentsError();
      return;
    }

    const fromDate = {
      gregorian: startOfMonth(new Date(this.form.get('fromDate').get('gregorian').value)),
      hijiri: undefined
    };
    const toDate = {
      gregorian: endOfMonth(new Date(this.form.get('toDate').get('gregorian').value)),
      hijiri: undefined
    };
    const monthDifference = monthDiff(fromDate.gregorian, toDate.gregorian);
    if (this.isOhCert && Math.round(monthDifference) < 3) {
      this.alertService.showErrorByKey('ESTABLISHMENT.OH-PERIOD-ERROR-MSG');
      return;
    }
    if (this.generationInProgress) {
      return;
    }
    this.generationInProgress = true;
    !this.isOhCert && this.isGroup
      ? this.generateZakatForGroup(fromDate, toDate)
      : this.generateReport(
          this.requestService.getCertificateDetails(this.registrationNo, {
            uuid: this.uuid,
            type: this.isOhCert ? CertificateIdentifierEnum.OH : CertificateIdentifierEnum.ZAKAT,
            isGroupCertificate: this.isGroup,
            fromDate: fromDate,
            toDate: toDate
          })
        ).subscribe();
  }
  generateZakatForGroup(fromDate, toDate) {
    this.requestService
      .getCertificateDetails(this.registrationNo, {
        uuid: this.uuid,
        type: this.isOhCert ? CertificateIdentifierEnum.OH : CertificateIdentifierEnum.ZAKAT,
        isGroupCertificate: this.isGroup,
        fromDate: fromDate,
        toDate: toDate
      })
      .subscribe(
        res => {
          if (res.certificateNo) {
            this.getCertStatus(res);
            scrollToTop();
            this.alertService.showInfo(EstablishmentConstants.ZAKAT_FOR_GROUP_CERT_GENERATION_INFO_MSG);
          }
        },
        err => {
          this.alertService.showError(err?.error?.message, err?.error?.details);
          this.generationInProgress = false;
        }
      );
  }
  getCertStatus(certResponse: CertificateDetailsResponse) {
    this.requestService.getZakatCertStatus(this.registrationNo, certResponse.certificateNo).subscribe(
      data => {
        if (data?.isProcessed) {
          this.generateReport(of(certResponse)).subscribe();
        } else {
          setTimeout(() => {
            this.getCertStatus(certResponse);
          }, 5000);
        }
      },
      err => {
        this.alertService.showError(err?.error?.message, err?.error?.details);
        this.generationInProgress = false;
      }
    );
  }
  askForCancel() {
    this.cancelTransaction(this.cancelTemplate);
  }
}
