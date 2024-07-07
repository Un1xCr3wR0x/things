/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  DocumentItem,
  UuidGeneratorService,
  DocumentService,
  ApplicationTypeEnum,
  LanguageToken,
  ApplicationTypeToken,
  AlertService,
  Alert,
  getAlertSuccess
} from '@gosi-ui/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { OhClaimsService } from '../../shared/services/oh-claims.service';
import { ActivatedRoute } from '@angular/router';
import { OhConstants } from '../../shared';
import { Location } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder } from '@angular/forms';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'oh-upload-documents-sc',
  templateUrl: './upload-documents-sc.component.html',
  styleUrls: ['./upload-documents-sc.component.scss']
})
export class UploadDocumentsScComponent implements OnInit {
  lang = 'en';
  documentScanList: DocumentItem[] = [];
  documentCategoryList: DocumentItem[] = [];
  documentList$: Observable<DocumentItem[]>;
  caseId: number;
  isAppPrivate: boolean;
  referenceNo: number;
  uuid: string;
  modalRef: BsModalRef;
  scanSucess = true;
  socialInsuranceNo: number;
  registrationNo: number;
  complicationId: number;
  injuryNo: number;
  injuryId: number;
  reimbursementId: number;
  feedBackMessage: Alert;
  maxLengthComments = 300;
  comments: FormGroup;
  @ViewChild('cancelInjury', { static: false })
  private cancelInjuryModal: TemplateRef<HTMLElement>;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly uuidService: UuidGeneratorService,
    readonly alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    readonly location: Location,
    readonly documentService: DocumentService,
    readonly claimService: OhClaimsService,
    readonly modalService: BsModalService,
    readonly fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.language.subscribe(language => (this.lang = language));
    this.comments = this.createCommentsForm();

    this.activatedRoute.params.subscribe(res => {
      this.registrationNo = res.registrationNo;
      this.socialInsuranceNo = res.socialInsuranceNo;
      this.injuryId = res.injuryId;
      this.complicationId = res.complicationId;
      this.injuryNo = res.injuryNo;
      this.reimbursementId = res.reimbId;
    });
    this.alertService.showWarningByKey('OCCUPATIONAL-HAZARD.DOCUMENT-WARNING');
    this.referenceNo = this.claimService.getReferenceNo();
    this.uuid = this.uuidService.getUuid();
    if (this.complicationId) {
      this.caseId = this.complicationId;
    } else {
      this.caseId = this.injuryId;
    }
    this.getDocumentCategory();
  }
  /** This method is to create form */
  createCommentsForm(): FormGroup {
    return this.fb.group({
      comments: [null]
    });
  }
  /** Method to get document category  */
  getDocumentCategory() {
    this.documentList$ = this.documentService
      .getRequiredDocuments(OhConstants.TRANSACTION_REIMBURSEMENT_CLAIM, OhConstants.WORKFLOW_ADD_REIMBURSEMENT_CLAIM)
      .pipe(
        map(documents => this.documentService.removeDuplicateDocs(documents)),
        catchError(error => of(error))
      );
    this.documentList$.subscribe((documents: DocumentItem[]) =>
      documents.forEach(items => {
        items.required = false;
        if (items && this.isAppPrivate) {
          this.documentCategoryList.push(items);
          this.documentScanList.push(items);
        } else if (items && items.name.english !== 'Reimbursement request form') {
          this.documentCategoryList.push(items);
          this.documentScanList.push(items);
        }
      })
    );
  }
  //This method is used to confirm cancellation of transaction
  confirmCancel() {
    this.decline();
    this.alertService.clearAlerts();
    this.location.back();
  }
  decline() {
    this.modalRef.hide();
  }
  /**
   * This method is used to show the cancellation template on click of cancel
   */

  showCancelTemplate() {
    this.alertService.clearAlerts();
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(this.cancelInjuryModal, config);
  }
  /**
   * Final Submit
   */
  submitClaim() {
    this.scanSucess = true;
    for (const documentItems of this.documentScanList) {
      if (documentItems.required && documentItems.documentContent === null) {
        this.alertService.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
        documentItems.uploadFailed = true;
        this.scanSucess = false;
      } else {
        documentItems.uploadFailed = false;
      }
    }
    if (!this.scanSucess) {
      this.alertService.showMandatoryErrorMessage();
    } else {
      this.claimService
        .submitReimbursement(
          this.registrationNo,
          this.socialInsuranceNo,
          this.caseId,
          this.reimbursementId,
          this.comments.get('comments').value
        )
        .subscribe(res => {
          if (res) {
            this.feedBackMessage = getAlertSuccess(res, null) as Alert;
            this.alertService.clearAlerts();
            this.location.back();
            this.alertService.showSuccess(this.feedBackMessage.message);
          }
        });
    }
  }

  refreshDocument(document: DocumentItem) {
    if (document && document.name) {
      this.documentService
        .refreshDocument(
          document,
          this.caseId,
          'REIMBURSEMENT_CLAIM',
          'ADD_REIMBURSEMENT_CLAIM',
          this.referenceNo,
          null,
          null,
          document.sequenceNumber
        )
        .subscribe(res => {
          if (res.sequenceNumber === document.sequenceNumber) {
            document = res;
          }
        });
    }
  }
}
