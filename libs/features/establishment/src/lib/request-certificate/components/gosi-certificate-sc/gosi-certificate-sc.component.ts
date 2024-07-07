import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentItem,
  DocumentService,
  UuidGeneratorService,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { incorrectRoute } from '../../../manage-admin/components';
import {
  CertificateIdentifierEnum,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  GenerateCertificateScBaseComponent,
  isDocumentsValid,
  RequestCertificateService
} from '../../../shared';

@Component({
  selector: 'est-gosi-certificate-sc',
  templateUrl: './gosi-certificate-sc.component.html',
  styleUrls: ['./gosi-certificate-sc.component.scss']
})
export class GosiCertificateScComponent extends GenerateCertificateScBaseComponent implements OnInit {
  documents: DocumentItem[] = [];
  transactionId = DocumentTransactionIdEnum.GOSI_CERTIFICATE;

  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;

  constructor(
    readonly bsModalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly location: Location,
    readonly documentService: DocumentService,
    readonly route: ActivatedRoute,
    @Inject(ApplicationTypeToken) readonly appToken: ApplicationTypeEnum,
    readonly uuidService: UuidGeneratorService,
    readonly requestService: RequestCertificateService,
    readonly alertService: AlertService
  ) {
    super(bsModalService, workflowService, location, documentService, alertService, requestService);
  }

  ngOnInit(): void {
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.location.back();
      return;
    }
    this.initialise(this.route.paramMap).subscribe(noop, noop);
  }

  initialise(paramMap: Observable<ParamMap>): Observable<DocumentItem[]> {
    return paramMap.pipe(
      tap(param => {
        if (param.get('registrationNo')) {
          this.registrationNo = Number(param.get('registrationNo'));
          this.uuid = this.uuidService.getUuid();
        } else {
          this.location.back();
          throwError(incorrectRoute);
        }
      }),
      switchMap(() => {
        this.documentType = DocumentTransactionTypeEnum.GOSI_CERTIFICATE;
        return this.documentService.getRequiredDocuments(this.documentType, this.documentType).pipe(
          catchError(err => {
            this.alertService.showError(err?.error?.message);
            return of([]);
          }),
          tap(res => (this.documents = this.documentService.removeDuplicateDocs(res)))
        );
      })
    );
  }

  generateDocument() {
    if (!isDocumentsValid(this.documents)) {
      this.alertService.showMandatoryDocumentsError();
      return;
    }
    if (this.generationInProgress) {
      return;
    }
    this.generationInProgress = true;
    this.generateReport(
      this.requestService.getCertificateDetails(this.registrationNo, {
        uuid: this.uuid,
        type: CertificateIdentifierEnum.GOSI,
        isGroupCertificate: false
      })
    ).subscribe();
  }

  askForCancel() {
    this.cancelTransaction(this.cancelTemplate);
  }
}
