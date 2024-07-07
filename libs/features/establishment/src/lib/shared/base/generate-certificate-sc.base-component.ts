import { Location } from '@angular/common';
import { Directive, OnDestroy, TemplateRef } from '@angular/core';
import {
  AlertService,
  DocumentItem,
  DocumentService,
  FileType,
  TransactionInterface,
  TransactionMixin,
  WorkflowService,
  downloadFile
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, iif, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DocumentTransactionTypeEnum, EstablishmentKeyEnum } from '../enums';
import { CertificateDetailsResponse, CertificateResponse } from '../models';
import { RequestCertificateService } from '../services';
import { EstablishmentScBaseComponent } from './establishment-sc.base-component';

@Directive()
export abstract class GenerateCertificateScBaseComponent
  extends TransactionMixin(EstablishmentScBaseComponent)
  implements TransactionInterface, OnDestroy
{
  registrationNo: number;
  documentType: DocumentTransactionTypeEnum;
  uuid;
  generationInProgress = false;
  constructor(
    readonly bsModalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly location: Location,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly requestService: RequestCertificateService
  ) {
    super(bsModalService, workflowService);
  }
  cancelTransaction(template: TemplateRef<HTMLElement>) {
    this.showModal(template);
  }

  bindDocContent(document: DocumentItem) {
    this.documentService
      .refreshDocument(document, this.registrationNo, this.documentType, this.documentType, undefined, null, this.uuid)
      .subscribe(res => (document = res));
  }

  cancelModal() {
    this.setTransactionComplete();
    this.hideModal();
    this.location.back();
  }

  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    super.ngOnDestroy();
  }

  generateReport(
    certificateresponse$: Observable<CertificateDetailsResponse>,
    download = true
  ): Observable<CertificateResponse> {
    this.alertService.clearAlerts();
    return certificateresponse$.pipe(
      switchMap(res =>
        iif(
          () => download === true,
          this.requestService.generateCertificate(this.registrationNo, res?.certificateNo).pipe(
            tap(fileData => {
              downloadFile(fileData?.fileName, FileType.pdf, fileData?.blob);
            })
          ),
          of(null)
        )
      ),
      tap(() => {
        this.setTransactionComplete();
        this.location.back();
        this.alertService.showSuccessByKey(EstablishmentKeyEnum.GENERATE_CERT_SUCCESS);
      }),
      catchError(err => {
        this.alertService.showError(err?.error?.message, err?.error?.details);
        return of(null);
      }),
      tap(() => {
        this.generationInProgress = false;
      })
    );
  }

  abstract askForCancel();
}
